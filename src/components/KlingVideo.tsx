import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCanvasScrub } from '../hooks/useCanvasScrub';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 903;
const BIRDS_FRAME_COUNT = 951;

const spotlightItems = [
  { name: 'Forma Divina', img: '/assets/1.jpeg' },
  { name: 'Piano Eterno', img: '/assets/2.jpeg' },
  { name: 'Superficie Viva', img: '/assets/3.jpeg' },
  { name: 'Acqua Pietra', img: '/assets/4.jpeg' },
  { name: 'Luce Sacra', img: '/assets/5.jpeg' },
  { name: 'Pietra Nobile', img: '/assets/6.jpeg' },
  { name: 'Marmo Vivo', img: '/assets/7.jpeg' },
  { name: 'Arco Celeste', img: '/assets/8.jpeg' },
];

const arcConfig = { gap: 0.08, speed: 0.3, arcRadius: 500 };

function getBezierPos(t: number, sx: number, sy: number, ey: number, cx: number, cy: number) {
  return {
    x: (1 - t) ** 2 * sx + 2 * (1 - t) * t * cx + t * t * sx,
    y: (1 - t) ** 2 * sy + 2 * (1 - t) * t * cy + t * t * ey,
  };
}

function getImgProgress(index: number, progress: number) {
  const start = index * arcConfig.gap;
  const end = start + arcConfig.speed;
  if (progress < start) return -1;
  if (progress > end) return 2;
  return (progress - start) / arcConfig.speed;
}

const KlingVideo: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [loadPct, setLoadPct] = useState(0);

  const cloudLeftRef = useRef<HTMLDivElement>(null);
  const cloudRightRef = useRef<HTMLDivElement>(null);
  const fadeTopRef = useRef<HTMLDivElement>(null);

  // Spotlight overlay refs
  const overlayRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLImageElement>(null);
  const bgImageRef2 = useRef<HTMLImageElement>(null);
  const titlesRef = useRef<HTMLDivElement>(null);
  const imagesContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Cloud + white reveal refs (come over pinned last frame)
  const revealCloudRef = useRef<HTMLDivElement>(null);
  const revealWhiteRef = useRef<HTMLDivElement>(null);
  const frameWhitenRef = useRef<HTMLDivElement>(null);
  const birdsCanvasContainerRef = useRef<HTMLDivElement>(null);

  const { canvasRef, preload, setProgress, isReady, loadProgress } = useCanvasScrub({
    frameDir: '/assets/frames-kling',
    frameCount: FRAME_COUNT,
    stride: 2,
  });

  // Birds video — second canvas scrub (contain fit, no crop)
  const birdsScrub = useCanvasScrub({
    frameDir: '/assets/frames-birds',
    frameCount: BIRDS_FRAME_COUNT,
    fit: 'contain',
    stride: 2,
  });

  useEffect(() => {
    const section = sectionRef.current;
    const titlesContainer = titlesRef.current;
    const imagesContainer = imagesContainerRef.current;
    const header = headerRef.current;
    const overlay = overlayRef.current;
    if (!section || !titlesContainer || !imagesContainer || !header || !overlay) return;

    preload();
    birdsScrub.preload();

    const loadInterval = setInterval(() => {
      if (isReady()) {
        setLoadPct(100);
        clearInterval(loadInterval);
        return;
      }
      setLoadPct(Math.round(loadProgress() * 100));
    }, 100);

    // Build spotlight titles + floating images
    titlesContainer.innerHTML = '';
    imagesContainer.innerHTML = '';
    const imageEls: HTMLDivElement[] = [];

    spotlightItems.forEach((item, index) => {
      const h1 = document.createElement('h1');
      h1.textContent = item.name;
      h1.style.opacity = index === 0 ? '1' : '0.35';
      h1.style.fontFamily = "'Cormorant Garamond', serif";
      h1.style.fontSize = 'clamp(2.5rem, 5vw, 4.5rem)';
      h1.style.fontWeight = '400';
      h1.style.letterSpacing = '0.08em';
      h1.style.lineHeight = '1';
      h1.style.color = '#f2f1ea';
      h1.style.transition = 'opacity 0.3s ease';
      titlesContainer.appendChild(h1);

      const wrap = document.createElement('div');
      wrap.className = 'spotlight-img';
      const img = document.createElement('img');
      img.src = item.img;
      img.alt = '';
      wrap.appendChild(img);
      imagesContainer.appendChild(wrap);
      imageEls.push(wrap);
    });

    const titleEls = titlesContainer.querySelectorAll('h1');
    let currentActive = 0;

    const cw = window.innerWidth * 0.3;
    const ch = window.innerHeight;
    const asx = cw - 220;
    const asy = -250;
    const aey = ch + 250;
    const acx = asx + arcConfig.arcRadius;
    const acy = ch / 2;

    imageEls.forEach((img) => gsap.set(img, { opacity: 0 }));

    const ctx = gsap.context(() => {
      // One single pin: 500% video + 1000% spotlight = 1500% total
      ScrollTrigger.create({
        trigger: section,
        start: 'top-=1 top',
        end: '+=900%',
        pin: true,
        pinSpacing: true,
        scrub: 2,
        anticipatePin: 1,
        onUpdate: (self) => {
          const total = self.progress;
          // Scroll split:
          // 0.00 → 0.22 → video phase
          // 0.22 → 0.66 → spotlight phase
          // 0.66 → 0.78 → cloud rises up
          // 0.78 → 1.00 → white section rises up
          const VIDEO_PHASE = 0.22;
          const SPOTLIGHT_END = 0.66;

          // Default: reset reveal elements for phases before reveal
          if (total < SPOTLIGHT_END) {
            if (revealCloudRef.current) revealCloudRef.current.style.transform = 'translateY(100%)';
            if (revealWhiteRef.current) revealWhiteRef.current.style.transform = 'translateY(100%)';
            if (frameWhitenRef.current) frameWhitenRef.current.style.opacity = '0';
            birdsScrub.setProgress(0);
            if (birdsCanvasContainerRef.current) birdsCanvasContainerRef.current.style.opacity = '0';
          }

          if (total <= VIDEO_PHASE) {
            // ═══ VIDEO PHASE ═══
            const videoP = total / VIDEO_PHASE;
            setProgress(videoP);

            // Clouds
            const frameProgress = videoP * FRAME_COUNT;
            const cloudStart = 20;
            const cloudEnd = 80;
            if (frameProgress > cloudStart) {
              const cloudP = Math.min((frameProgress - cloudStart) / (cloudEnd - cloudStart), 1);
              if (cloudLeftRef.current) cloudLeftRef.current.style.transform = `translateX(${-cloudP * 120}%)`;
              if (cloudRightRef.current) cloudRightRef.current.style.transform = `translateX(${cloudP * 120}%)`;
            } else {
              if (cloudLeftRef.current) cloudLeftRef.current.style.transform = 'translateX(0)';
              if (cloudRightRef.current) cloudRightRef.current.style.transform = 'translateX(0)';
            }

            // Hide overlay + all spotlight elements
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
            if (bgImageRef.current) bgImageRef.current.style.opacity = '0';
            if (bgImageRef2.current) bgImageRef2.current.style.opacity = '0';
            const titlesWrap = section.querySelector('.spotlight-titles-wrap') as HTMLElement;
            if (titlesWrap) titlesWrap.style.opacity = '0';
            if (imagesContainer) imagesContainer.style.opacity = '0';
            header.style.opacity = '0';
            imageEls.forEach((img) => gsap.set(img, { opacity: 0 }));
            const lines = section.querySelector('.spotlight-lines') as HTMLElement;
            if (lines) lines.style.opacity = '0';
            const lineTop = section.querySelector('.spotlight-line-top-inner') as HTMLElement;
            const lineBot = section.querySelector('.spotlight-line-bot-inner') as HTMLElement;
            if (lineTop) lineTop.style.width = '0%';
            if (lineBot) lineBot.style.width = '0%';
          } else if (total <= SPOTLIGHT_END) {
            // ═══ SPOTLIGHT PHASE — cards come from top ═══
            // Keep last frame
            setProgress(1);

            // Clouds gone
            if (cloudLeftRef.current) cloudLeftRef.current.style.transform = 'translateX(-120%)';
            if (cloudRightRef.current) cloudRightRef.current.style.transform = 'translateX(120%)';

            // Fade in overlay + show spotlight elements
            const spotP = (total - VIDEO_PHASE) / (SPOTLIGHT_END - VIDEO_PHASE);
            const fadeIn = Math.min(spotP / 0.05, 1);
            overlay.style.opacity = String(fadeIn * 0.8);
            overlay.style.pointerEvents = 'auto';
            // bg image opacity controlled by title swap — first title stays hidden
            const titlesWrap = section.querySelector('.spotlight-titles-wrap') as HTMLElement;
            if (titlesWrap) titlesWrap.style.opacity = '1';
            if (imagesContainer) imagesContainer.style.opacity = '1';
            const lines = section.querySelector('.spotlight-lines') as HTMLElement;
            if (lines) lines.style.opacity = '1';
            // Draw lines: in first 15% draw left→right, in last 10% undraw left→right
            const lineTop = section.querySelector('.spotlight-line-top-inner') as HTMLElement;
            const lineBot = section.querySelector('.spotlight-line-bot-inner') as HTMLElement;
            if (lineTop && lineBot) {
              if (spotP < 0.15) {
                // Drawing in — grows from left to right
                const drawP = spotP / 0.15;
                lineTop.style.clipPath = `inset(0 ${(1 - drawP) * 100}% 0 0)`;
                lineBot.style.clipPath = `inset(0 ${(1 - drawP) * 100}% 0 0)`;
                lineTop.style.width = '100%';
                lineBot.style.width = '100%';
              } else if (spotP > 0.9) {
                // Undrawing — same direction, left to right disappears
                const undrawP = (spotP - 0.9) / 0.1;
                lineTop.style.clipPath = `inset(0 0 0 ${undrawP * 100}%)`;
                lineBot.style.clipPath = `inset(0 0 0 ${undrawP * 100}%)`;
              } else {
                // Full line visible
                lineTop.style.clipPath = 'inset(0 0 0 0)';
                lineBot.style.clipPath = 'inset(0 0 0 0)';
                lineTop.style.width = '100%';
                lineBot.style.width = '100%';
              }
            }

            // Header
            header.style.opacity = spotP > 0.02 && spotP < 0.95 ? '1' : '0';

            // Titles scroll from bottom to top
            const vh = window.innerHeight;
            const scrollH = titlesContainer.scrollHeight;
            const currentY = vh - spotP * (vh + scrollH);
            gsap.set(titlesContainer, { y: currentY });

            // Floating images
            imageEls.forEach((img, index) => {
              const imgP = getImgProgress(index, spotP);
              if (imgP < 0 || imgP > 1) {
                gsap.set(img, { opacity: 0 });
              } else {
                const pos = getBezierPos(imgP, asx, asy, aey, acx, acy);
                gsap.set(img, { x: pos.x - 100, y: pos.y - 75, opacity: 1 });
              }
            });

            // Active title
            const mid = vh / 2;
            let closestIdx = 0;
            let closestDist = Infinity;
            titleEls.forEach((t, i) => {
              const rect = t.getBoundingClientRect();
              const dist = Math.abs(rect.top + rect.height / 2 - mid);
              if (dist < closestDist) { closestDist = dist; closestIdx = i; }
            });
            if (closestIdx !== currentActive) {
              (titleEls[currentActive] as HTMLElement).style.opacity = '0.35';
              (titleEls[closestIdx] as HTMLElement).style.opacity = '1';
              currentActive = closestIdx;
            }
          } else {
            // ═══ REVEAL PHASE — cloud + white slide up over last frame ═══
            setProgress(1);

            // Keep clouds gone
            if (cloudLeftRef.current) cloudLeftRef.current.style.transform = 'translateX(-120%)';
            if (cloudRightRef.current) cloudRightRef.current.style.transform = 'translateX(120%)';

            // Hide spotlight overlay + elements
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
            if (bgImageRef.current) bgImageRef.current.style.opacity = '0';
            if (bgImageRef2.current) bgImageRef2.current.style.opacity = '0';
            const titlesWrap = section.querySelector('.spotlight-titles-wrap') as HTMLElement;
            if (titlesWrap) titlesWrap.style.opacity = '0';
            if (imagesContainer) imagesContainer.style.opacity = '0';
            header.style.opacity = '0';
            const lines = section.querySelector('.spotlight-lines') as HTMLElement;
            if (lines) lines.style.opacity = '0';

            // Reveal progress: 0 → 1 over (SPOTLIGHT_END → 1)
            const revealP = (total - SPOTLIGHT_END) / (1 - SPOTLIGHT_END);

            // Birds video scrubs during reveal phase
            birdsScrub.setProgress(revealP);
            if (birdsCanvasContainerRef.current) {
              birdsCanvasContainerRef.current.style.opacity = '1';
            }

            // Frame behind whitens as cloud appears
            if (frameWhitenRef.current) {
              frameWhitenRef.current.style.opacity = String(Math.min(revealP * 1.3, 1));
            }

            // Cloud rises full distance over the entire reveal phase
            if (revealCloudRef.current) {
              revealCloudRef.current.style.transform = `translateY(${(1 - revealP) * 100}%)`;
            }

            // White starts following at 20% of cloud's progress, then catches up
            // Both finish at the same time (revealP = 1)
            if (revealWhiteRef.current) {
              const whiteP = Math.max((revealP - 0.2) / 0.8, 0);
              revealWhiteRef.current.style.transform = `translateY(${(1 - whiteP) * 100}%)`;
            }
          }
        },
      });
    });

    return () => {
      ctx.revert();
      clearInterval(loadInterval);
    };
  }, [preload, setProgress, isReady, loadProgress]);

  return (
    <div
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        zIndex: 3,
        overflow: 'hidden',
        background: '#000',
      }}
    >
      {/* Kling frames — scrubbed on scroll */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />

      {/* White overlay over canvas — fades in during reveal phase */}
      <div
        ref={frameWhitenRef}
        style={{
          position: 'absolute',
          inset: 0,
          background: '#ffffff',
          zIndex: 4,
          opacity: 0,
          pointerEvents: 'none',
          willChange: 'opacity',
        }}
      />

      {/* Birds video canvas — scrubs during reveal phase */}
      <div
        ref={birdsCanvasContainerRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 6,
          opacity: 0,
          pointerEvents: 'none',
          transition: 'opacity 0.3s ease',
          background: '#000',
        }}
      >
        <canvas
          ref={birdsScrub.canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>

      {/* White fade on top */}
      <div
        ref={fadeTopRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '30%',
          background: 'linear-gradient(to bottom, #ffffff 0%, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0.3) 60%, transparent 100%)',
          zIndex: 4,
          pointerEvents: 'none',
        }}
      />

      {/* Left cloud */}
      <div
        ref={cloudLeftRef}
        style={{ position: 'absolute', top: '-8%', left: '-5%', width: '45%', zIndex: 5, pointerEvents: 'none', opacity: 0.9, willChange: 'transform' }}
      >
        <img src="/assets/cloud-left.png" alt="" aria-hidden="true" draggable={false} style={{ width: '100%', display: 'block' }} />
      </div>

      {/* Right cloud */}
      <div
        ref={cloudRightRef}
        style={{ position: 'absolute', top: '-5%', right: '-5%', width: '45%', zIndex: 5, pointerEvents: 'none', opacity: 0.9, willChange: 'transform' }}
      >
        <img src="/assets/cloud-right.png" alt="" aria-hidden="true" draggable={false} style={{ width: '100%', display: 'block' }} />
      </div>

      {/* ═══ SPOTLIGHT OVERLAY — comes on top after video ends ═══ */}
      {/* Two stacked bg images for cross-fade transitions */}
      <img
        ref={bgImageRef}
        src={spotlightItems[0].img}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 8,
          opacity: 0,
          transition: 'opacity 0.8s ease',
          pointerEvents: 'none',
        }}
      />
      <img
        ref={bgImageRef2}
        src={spotlightItems[1].img}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 8,
          opacity: 0,
          transition: 'opacity 0.8s ease',
          pointerEvents: 'none',
        }}
      />
      {/* Dark overlay */}
      <div
        ref={overlayRef}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(23,23,23,0.65)',
          zIndex: 9,
          opacity: 0,
          pointerEvents: 'none',
          transition: 'opacity 0.2s',
        }}
      />

      {/* Titles with diagonal clip */}
      <div
        className="spotlight-titles-wrap"
        style={{
          position: 'absolute',
          top: 0,
          left: '15vw',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          clipPath: 'polygon(50vh 0px, 0px 50%, 50vh 100%, 100% calc(100% + 100vh), 100% -100vh)',
          zIndex: 15,
          pointerEvents: 'none',
          opacity: 0,
        }}
      >
        <div
          ref={titlesRef}
          style={{
            position: 'relative',
            left: '15%',
            width: '75%',
            display: 'flex',
            flexDirection: 'column',
            gap: '5rem',
          }}
        />
      </div>

      {/* Floating images */}
      <div
        ref={imagesContainerRef}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          minWidth: '300px',
          height: '100%',
          zIndex: 16,
          pointerEvents: 'none',
        }}
      />

      {/* Discover header */}
      <div
        ref={headerRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '5%',
          transform: 'translateY(-50%)',
          opacity: 0,
          zIndex: 17,
          transition: 'opacity 0.3s ease',
        }}
      >
        <p style={{
          fontFamily: 'Lato, sans-serif',
          fontSize: '0.7rem',
          fontWeight: 300,
          letterSpacing: '0.5em',
          textTransform: 'uppercase',
          color: 'rgba(220,209,191,0.7)',
        }}>Discover</p>
      </div>

      {/* V-lines — exact clip-path edge match using CSS */}
      <div
        className="spotlight-lines"
        style={{
          position: 'absolute',
          top: 0,
          left: '15vw',
          width: '50vh',
          height: '100%',
          zIndex: 18,
          pointerEvents: 'none',
          opacity: 0,
        }}
      >
        <div className="spotlight-line-top-inner" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '0%',
          height: '50%',
          borderBottom: '1px solid rgba(220,209,191,0.3)',
          transform: 'skewY(-45deg)',
          transformOrigin: 'bottom left',
          pointerEvents: 'none',
          transition: 'none',
        }} />
        <div className="spotlight-line-bot-inner" style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '0%',
          height: '50%',
          borderTop: '1px solid rgba(220,209,191,0.3)',
          transform: 'skewY(45deg)',
          transformOrigin: 'top left',
          pointerEvents: 'none',
          transition: 'none',
        }} />
      </div>

      {/* ═══ REVEAL: combined cloud + white section ═══ */}
      {/* The cloud is the leading edge that rises first; the white follows attached behind */}
      <div
        ref={revealCloudRef}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '120vh',
          zIndex: 26,
          transform: 'translateY(100%)',
          willChange: 'transform',
          pointerEvents: 'none',
        }}
      >
        {/* Cloud image — sits at the very top */}
        <img
          src="/assets/cloud-bottom.png"
          alt=""
          aria-hidden="true"
          draggable={false}
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '110vw',
            maxWidth: 'none',
            zIndex: 2,
            maskImage: 'linear-gradient(to top, transparent 0%, black 20%, black 55%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 20%, black 55%, transparent 100%)',
          }}
        />
      </div>

      {/* ═══ REVEAL: white section attached behind cloud ═══ */}
      <div
        ref={revealWhiteRef}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '110vh',
          zIndex: 25,
          transform: 'translateY(100%)',
          willChange: 'transform',
          pointerEvents: 'none',
          background: '#ffffff',
          // Soft fade at the top so the cloud blends into the white
          maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 12%, black 25%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 12%, black 25%)',
        }}
      />


      {/* Loading indicator */}
      {loadPct < 100 && (
        <div
          style={{
            position: 'absolute', inset: 0, background: '#171717',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: '1rem', zIndex: 20,
          }}
        >
          <p style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem',
            color: 'rgba(220,209,191,0.4)', letterSpacing: '0.4em', fontStyle: 'italic',
          }}>Loading Experience</p>
          <div style={{ width: '120px', height: '1px', background: 'rgba(220,209,191,0.15)', position: 'relative' }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, height: '100%',
              width: `${loadPct}%`, background: 'rgba(220,209,191,0.5)', transition: 'width 0.2s',
            }} />
          </div>
          <p style={{
            fontFamily: 'Lato, sans-serif', fontSize: '0.6rem',
            color: 'rgba(220,209,191,0.25)', letterSpacing: '0.2em',
          }}>{loadPct}%</p>
        </div>
      )}
    </div>
  );
};

export default KlingVideo;
