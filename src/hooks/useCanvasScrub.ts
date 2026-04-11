import { useRef, useCallback } from 'react';

interface UseCanvasScrubOptions {
  frameDir: string;
  frameCount: number;
  framePrefix?: string;
  frameExt?: string;
  fit?: 'cover' | 'contain';
}

export function useCanvasScrub({
  frameDir,
  frameCount,
  framePrefix = 'frame_',
  frameExt = 'jpg',
  fit = 'cover',
}: UseCanvasScrubOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedSetRef = useRef<Set<number>>(new Set());
  const currentFrameRef = useRef(-1);
  const readyRef = useRef(false);
  const firstFrameDrawnRef = useRef(false);
  const sizeLockedRef = useRef(false);
  const coverParamsRef = useRef<{ sx: number; sy: number; sw: number; sh: number } | null>(null);
  const containParamsRef = useRef<{ dx: number; dy: number; dw: number; dh: number } | null>(null);

  const getFrameSrc = useCallback(
    (i: number) => {
      const num = String(i + 1).padStart(4, '0');
      return `${frameDir}/${framePrefix}${num}.${frameExt}`;
    },
    [frameDir, framePrefix, frameExt]
  );

  // Draw frame — canvas size and cover params are locked after first draw
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const images = imagesRef.current;
    if (!canvas || !images.length) return;

    const clampedIndex = Math.max(0, Math.min(index, images.length - 1));
    if (clampedIndex === currentFrameRef.current) return;

    const img = images[clampedIndex];
    if (!img || !img.complete || !img.naturalWidth) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Lock canvas size on first draw — never resize again
    if (!sizeLockedRef.current) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);

      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = canvas.width / canvas.height;

      if (fit === 'cover') {
        // Cover — crop image to fill canvas
        let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
        if (imgRatio > canvasRatio) {
          sw = img.naturalHeight * canvasRatio;
          sx = (img.naturalWidth - sw) / 2;
        } else {
          sh = img.naturalWidth / canvasRatio;
          sy = (img.naturalHeight - sh) / 2;
        }
        coverParamsRef.current = { sx, sy, sw, sh };
      } else {
        // Contain — fit image inside canvas, center, no crop
        let dw: number, dh: number;
        if (imgRatio > canvasRatio) {
          // Image wider than canvas — fill width
          dw = canvas.width;
          dh = canvas.width / imgRatio;
        } else {
          // Image taller than canvas — fill height
          dh = canvas.height;
          dw = canvas.height * imgRatio;
        }
        const dx = (canvas.width - dw) / 2;
        const dy = (canvas.height - dh) / 2;
        containParamsRef.current = { dx, dy, dw, dh };
      }

      sizeLockedRef.current = true;
    }

    if (fit === 'cover') {
      const params = coverParamsRef.current;
      if (!params) return;
      ctx.drawImage(img, params.sx, params.sy, params.sw, params.sh, 0, 0, canvas.width, canvas.height);
    } else {
      const params = containParamsRef.current;
      if (!params) return;
      // Clear before drawing for contain fit (so letterbox is transparent)
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, params.dx, params.dy, params.dw, params.dh);
    }
    currentFrameRef.current = clampedIndex;
  }, [fit]);

  // Preload all frames
  const preload = useCallback(() => {
    if (imagesRef.current.length > 0) return;

    const images: HTMLImageElement[] = new Array(frameCount);
    imagesRef.current = images;

    // Count both successful and failed loads toward "resolved" so the loading
    // gate never stalls if a frame 404s or times out on the CDN.
    const resolvedSet = new Set<number>();

    const onFrameResolved = (index: number, success: boolean) => {
      if (resolvedSet.has(index)) return;
      resolvedSet.add(index);

      if (success) {
        loadedSetRef.current.add(index);
        if (index === 0 && !firstFrameDrawnRef.current) {
          firstFrameDrawnRef.current = true;
          drawFrame(0);
          // As soon as frame 0 is on screen we mark "ready" so the loading
          // overlay clears and the user can start scrolling immediately.
          // The rest of the frames continue streaming in parallel in the
          // background; setProgress() falls back to the nearest loaded
          // neighbour if a target frame isn't ready yet.
          readyRef.current = true;
        }
      }
    };

    // Hard safety net — if frame 0 is really slow (rare), force ready after 4s
    const readyTimeout = setTimeout(() => {
      readyRef.current = true;
    }, 4000);

    // Fire every frame load in parallel — HTTP/2 multiplexing on Vercel
    // handles hundreds of concurrent requests much faster than sequential
    // batches. Still prioritise frame 0 so the first paint happens first.
    const firstImg = new Image();
    firstImg.src = getFrameSrc(0);
    images[0] = firstImg;
    firstImg.onload = () => onFrameResolved(0, true);
    firstImg.onerror = () => onFrameResolved(0, false);
    if (firstImg.complete && firstImg.naturalWidth) {
      onFrameResolved(0, true);
    }

    // Kick off the rest all at once — the browser will queue them over
    // its available HTTP/2 connections.
    for (let i = 1; i < frameCount; i++) {
      const img = new Image();
      const idx = i;
      img.onload = () => onFrameResolved(idx, true);
      img.onerror = () => onFrameResolved(idx, false);
      img.src = getFrameSrc(i);
      images[i] = img;
    }

    // Clear the safety timeout once ready
    const cleanupInterval = setInterval(() => {
      if (readyRef.current) {
        clearTimeout(readyTimeout);
        clearInterval(cleanupInterval);
      }
    }, 500);
  }, [frameCount, getFrameSrc, drawFrame]);

  // Set progress — draws nearest loaded frame
  const setProgress = useCallback(
    (progress: number) => {
      const targetIndex = Math.round(progress * (frameCount - 1));
      const images = imagesRef.current;
      if (!images.length) return;

      const img = images[targetIndex];
      if (img && img.complete && img.naturalWidth) {
        drawFrame(targetIndex);
        return;
      }

      for (let offset = 1; offset < 15; offset++) {
        for (const idx of [targetIndex - offset, targetIndex + offset]) {
          if (idx >= 0 && idx < frameCount) {
            const fallback = images[idx];
            if (fallback && fallback.complete && fallback.naturalWidth) {
              drawFrame(idx);
              return;
            }
          }
        }
      }
    },
    [frameCount, drawFrame]
  );

  return {
    canvasRef,
    preload,
    setProgress,
    isReady: () => readyRef.current,
    loadProgress: () => loadedSetRef.current.size / frameCount,
  };
}
