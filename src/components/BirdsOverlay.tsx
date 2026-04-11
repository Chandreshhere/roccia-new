import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';

export interface BirdsOverlayHandle {
  setProgress: (p: number) => void;
}

interface Bird {
  // Origin inside the statue bounding box
  originX: number;
  originY: number;
  // Direction for perspective fly-out (normalized vector from center)
  dirX: number;
  dirY: number;
  // Starting and ending scale (controls "distance" from viewer)
  startScale: number;
  endScale: number;
  // When this bird starts and ends its journey (0-1 normalized)
  spawnStart: number;
  spawnEnd: number;
  // Tilt + rotation base
  tiltX: number;
  rotation: number;
  // Flap
  flapSpeed: number;
  flapOffset: number;
  // Perspective drift distance (how far outward it spreads as it approaches)
  driftDist: number;
}

interface BirdsOverlayProps {}

const NUM_BIRDS = 60;

const BirdsOverlay = forwardRef<BirdsOverlayHandle, BirdsOverlayProps>((_props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const birdsRef = useRef<Bird[]>([]);
  const rafRef = useRef<number>();

  useImperativeHandle(ref, () => ({
    setProgress(p: number) {
      progressRef.current = Math.max(0, Math.min(1, p));
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let vw = window.innerWidth;
    let vh = window.innerHeight;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      vw = window.innerWidth;
      vh = window.innerHeight;
      canvas.width = vw * dpr;
      canvas.height = vh * dpr;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      initBirds();
    };

    const initBirds = () => {
      // Statue bounding box — center of viewport, tall narrow rectangle
      const sbW = vw * 0.22;
      const sbH = vh * 0.55;
      const sbLeft = vw * 0.5 - sbW / 2;
      const sbTop = vh * 0.5 - sbH * 0.45;

      birdsRef.current = Array.from({ length: NUM_BIRDS }, (_, i) => {
        // Gaussian distribution inside statue area
        const rx = (Math.random() + Math.random() + Math.random()) / 3;
        const ry = (Math.random() + Math.random() + Math.random()) / 3;
        const originX = sbLeft + rx * sbW;
        const originY = sbTop + ry * sbH;

        // Direction outward from viewport center for perspective
        const cx = vw / 2;
        const cy = vh / 2;
        const dx = originX - cx + (Math.random() - 0.5) * 40;
        const dy = originY - cy + (Math.random() - 0.5) * 40;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;

        return {
          originX,
          originY,
          dirX: dx / len,
          dirY: dy / len,
          startScale: 0.15 + Math.random() * 0.25,
          endScale: 4 + Math.random() * 5,
          spawnStart: (i / NUM_BIRDS) * 0.55,
          spawnEnd: 0.75 + Math.random() * 0.25,
          tiltX: (Math.random() - 0.5) * 0.3,
          rotation: (Math.random() - 0.5) * 0.4,
          flapSpeed: 8 + Math.random() * 6,
          flapOffset: Math.random() * Math.PI * 2,
          driftDist: vw * (0.4 + Math.random() * 0.8),
        };
      });
    };

    resize();
    window.addEventListener('resize', resize);

    // Realistic top-down bird silhouette with flapping wings
    const drawBird = (
      cx: number,
      cy: number,
      size: number,
      rotation: number,
      flap: number
    ) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);

      const color = 'rgba(28, 20, 20, 0.9)';
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const bodyLen = size * 1.0;
      const wingSpan = size * 2.8;
      const wingWidth = size * 0.85;

      // ── Body (elongated oval) ──
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.16, bodyLen * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // ── Head ──
      ctx.beginPath();
      ctx.arc(0, -bodyLen * 0.42, size * 0.2, 0, Math.PI * 2);
      ctx.fill();

      // ── Beak ──
      ctx.beginPath();
      ctx.moveTo(-size * 0.06, -bodyLen * 0.56);
      ctx.lineTo(0, -bodyLen * 0.68);
      ctx.lineTo(size * 0.06, -bodyLen * 0.56);
      ctx.closePath();
      ctx.fill();

      // ── Tail (fan shape) ──
      ctx.beginPath();
      ctx.moveTo(-size * 0.22, bodyLen * 0.42);
      ctx.lineTo(-size * 0.08, bodyLen * 0.72);
      ctx.lineTo(size * 0.08, bodyLen * 0.72);
      ctx.lineTo(size * 0.22, bodyLen * 0.42);
      ctx.closePath();
      ctx.fill();

      // ── Wings with flap ──
      // flap range: -1 (full down) to 1 (full up)
      // Wings go from the body outward to the tip, curving based on flap
      const wingRise = flap * size * 0.5;

      // Left wing
      ctx.beginPath();
      ctx.moveTo(-size * 0.12, -size * 0.05);
      // Leading edge (front of wing)
      ctx.quadraticCurveTo(
        -wingSpan * 0.35,
        -wingWidth * 0.35 - wingRise,
        -wingSpan * 0.5,
        -wingRise * 0.5
      );
      // Wing tip
      ctx.quadraticCurveTo(
        -wingSpan * 0.45,
        wingWidth * 0.1 - wingRise * 0.3,
        -wingSpan * 0.4,
        wingWidth * 0.2 - wingRise * 0.2
      );
      // Trailing edge (back of wing)
      ctx.quadraticCurveTo(
        -wingSpan * 0.25,
        wingWidth * 0.3 - wingRise * 0.4,
        -size * 0.12,
        size * 0.15
      );
      ctx.closePath();
      ctx.fill();

      // Right wing (mirror)
      ctx.beginPath();
      ctx.moveTo(size * 0.12, -size * 0.05);
      ctx.quadraticCurveTo(
        wingSpan * 0.35,
        -wingWidth * 0.35 - wingRise,
        wingSpan * 0.5,
        -wingRise * 0.5
      );
      ctx.quadraticCurveTo(
        wingSpan * 0.45,
        wingWidth * 0.1 - wingRise * 0.3,
        wingSpan * 0.4,
        wingWidth * 0.2 - wingRise * 0.2
      );
      ctx.quadraticCurveTo(
        wingSpan * 0.25,
        wingWidth * 0.3 - wingRise * 0.4,
        size * 0.12,
        size * 0.15
      );
      ctx.closePath();
      ctx.fill();

      // Wing separation highlight (feather line)
      ctx.strokeStyle = 'rgba(50, 35, 35, 0.4)';
      ctx.lineWidth = Math.max(0.5, size * 0.015);
      ctx.beginPath();
      ctx.moveTo(-size * 0.12, 0);
      ctx.lineTo(-wingSpan * 0.42, -wingRise * 0.3);
      ctx.moveTo(size * 0.12, 0);
      ctx.lineTo(wingSpan * 0.42, -wingRise * 0.3);
      ctx.stroke();

      ctx.restore();
    };

    const animate = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, vw, vh);

      const globalP = progressRef.current;
      const time = performance.now() / 1000;

      // Sort birds by scale (smaller = further = draw first)
      const sorted = [...birdsRef.current].map((b, idx) => ({ b, idx }));
      sorted.sort((a, x) => {
        const localA = Math.max(
          0,
          Math.min(1, (globalP - a.b.spawnStart) / (a.b.spawnEnd - a.b.spawnStart))
        );
        const localB = Math.max(
          0,
          Math.min(1, (globalP - x.b.spawnStart) / (x.b.spawnEnd - x.b.spawnStart))
        );
        return localA - localB;
      });

      sorted.forEach(({ b }) => {
        const localP = Math.max(
          0,
          Math.min(1, (globalP - b.spawnStart) / (b.spawnEnd - b.spawnStart))
        );
        if (localP <= 0) return;

        // Quadratic perspective: accelerate outward as bird "gets closer"
        const accel = localP * localP;

        // Position: originates at statue, drifts outward in its direction
        const x = b.originX + b.dirX * b.driftDist * accel;
        const y = b.originY + b.dirY * b.driftDist * accel - 60 * localP;

        // Scale: grows dramatically as bird approaches viewer
        const size = b.startScale * 10 + (b.endScale - b.startScale) * 10 * localP;

        // Rotation: base rotation + tilt, slight variation over time for natural wobble
        const wobble = Math.sin(time * 1.2 + b.flapOffset) * 0.05;
        const rotation = b.rotation + wobble;

        // Wing flap
        const flap = Math.sin(time * b.flapSpeed + b.flapOffset);

        // Fade in at spawn
        let alpha = 1;
        if (localP < 0.08) alpha = localP / 0.08;
        // Fade out slightly when very close (passing by viewer)
        if (localP > 0.9) alpha *= 1 - (localP - 0.9) / 0.1;

        // Cull if way off screen
        const cullMargin = size * 4;
        if (
          x < -cullMargin ||
          x > vw + cullMargin ||
          y < -cullMargin ||
          y > vh + cullMargin
        ) {
          return;
        }

        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        drawBird(x, y, size, rotation, flap);
        ctx.globalAlpha = 1;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 6,
        pointerEvents: 'none',
      }}
    />
  );
});

BirdsOverlay.displayName = 'BirdsOverlay';

export default BirdsOverlay;
