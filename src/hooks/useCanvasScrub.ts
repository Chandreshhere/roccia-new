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

    const onFrameLoad = (index: number) => {
      loadedSetRef.current.add(index);

      if (index === 0 && !firstFrameDrawnRef.current) {
        firstFrameDrawnRef.current = true;
        drawFrame(0);
      }

      if (loadedSetRef.current.size === frameCount) {
        readyRef.current = true;
      }
    };

    // Load frame 0 first
    const firstImg = new Image();
    firstImg.src = getFrameSrc(0);
    images[0] = firstImg;

    let batchIndex = 1;
    const BATCH_SIZE = 25;

    function loadBatch() {
      const end = Math.min(batchIndex + BATCH_SIZE, frameCount);
      for (let i = batchIndex; i < end; i++) {
        const img = new Image();
        const idx = i;
        img.onload = () => onFrameLoad(idx);
        img.src = getFrameSrc(i);
        images[i] = img;
      }
      batchIndex = end;
      if (batchIndex < frameCount) {
        setTimeout(loadBatch, 10);
      }
    }

    firstImg.onload = () => {
      onFrameLoad(0);
      loadBatch();
    };
    if (firstImg.complete) {
      onFrameLoad(0);
      loadBatch();
    }
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
