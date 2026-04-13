import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { useIsMobile } from '../hooks/useIsMobile';

// Import SVGs synchronously at build time
import casaSvgRaw from '../assets/casa.svg?raw';
import bagnoSvgRaw from '../assets/bagno.svg?raw';
import luceSvgRaw from '../assets/luce.svg?raw';

// Deterministic positions — each image has its own parallax speed for continuous horizontal drift
const casaImages = [
  { src: '/assets/main/1.png', x: 4, y: -2, w: 28, speed: 0.4 },
  { src: '/assets/main/2.png', x: 72, y: 14, w: 26, speed: 0.25 },
  { src: '/assets/main/3.png', x: 65, y: 62, w: 30, speed: 0.55 },
];

const bagnoImages = [
  { src: '/assets/main/4.png', x: 72, y: 6, w: 26, speed: 0.35 },
  { src: '/assets/main/5.png', x: 3, y: 54, w: 34, speed: 0.55 },
];

const luceImages = [
  { src: '/assets/main/10.png', x: 5, y: -4, w: 28, speed: 0.3 },
  { src: '/assets/main/12.png', x: -10, y: 14, w: 48, speed: 0.35, maxW: 760 },
  { src: '/assets/main/right top.png', x: 72, y: -4, w: 26, speed: 0.45 },
  { src: '/assets/main/8.png', x: 70, y: 60, w: 28, speed: 0.3 },
];

const items = [
  {
    id: 'casa',
    svgRaw: casaSvgRaw,
    images: casaImages,
    text: {
      label: 'I — The Home',
      italian: 'La Casa',
      title: 'Casa',
      desc: 'Living spaces transformed — statement floors, architectural walls, sculpted furniture. The home reimagined in marble.',
      x: 8,
      y: 64,
    },
  },
  {
    id: 'bagno',
    svgRaw: bagnoSvgRaw,
    images: bagnoImages,
    text: {
      label: 'II — The Sanctuary',
      italian: 'Il Bagno',
      title: 'Bagno',
      desc: 'The bathroom as a private world of cool luxury — vanities, tubs, mosaics. Where stone becomes serenity.',
      x: 10,
      y: 10,
    },
  },
  {
    id: 'luce',
    svgRaw: luceSvgRaw,
    images: luceImages,
    text: {
      label: 'III — The Sculpture',
      italian: 'La Luce',
      title: 'Luce',
      desc: 'Standalone sculptures and carved luminaries. Stone shaped to hold light — our most evocative expressions of form.',
      x: 8,
      y: 62,
    },
  },
];

const CasaBagnoLuceScroll: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const svgContainerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mob = useIsMobile();

  useLayoutEffect(() => {
    // ── Inject SVGs synchronously ──
    items.forEach((item, i) => {
      const container = svgContainerRefs.current[i];
      if (!container) return;

      container.innerHTML = item.svgRaw;
      const svg = container.querySelector('svg');
      if (!svg) return;

      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      svg.setAttribute('shape-rendering', 'geometricPrecision');
      svg.style.overflow = 'visible';

      // Convert all paths to strokes — keep everything including the outer border
      const paths = svg.querySelectorAll('path, polygon');
      paths.forEach((el) => {
        const p = el as SVGGeometryElement;
        p.setAttribute('fill', 'none');
        p.setAttribute('stroke', '#560806');
        p.setAttribute('stroke-width', '380');
        p.setAttribute('stroke-linejoin', 'round');
        p.setAttribute('stroke-linecap', 'round');
        p.setAttribute('shape-rendering', 'geometricPrecision');
        (p.style as CSSStyleDeclaration).willChange = 'stroke-dashoffset';

        if (p.getTotalLength) {
          try {
            const len = p.getTotalLength();
            p.style.strokeDasharray = String(len);
            p.style.strokeDashoffset = String(len);
            // Cache the length on the DOM so we don't recompute on every scroll
            (p as SVGGeometryElement & { _pathLen?: number })._pathLen = len;
          } catch {
            // skip
          }
        }
      });
    });

    // ── Pure scroll handler, syncs with Lenis smooth scroll ──
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const track = trackRef.current;
    if (!section || !sticky || !track) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const sectionHeight = section.offsetHeight;
      const totalScrollable = sectionHeight - vh;
      // Start progress BEFORE the section pins — when the section top is 70vh below
      // viewport top, progress = 0. This way Casa drawing + image slide begins while
      // the section is still coming into view.
      const preEntry = vh * 0.3;
      let p = (preEntry - rect.top) / (totalScrollable + preEntry);
      p = Math.max(0, Math.min(1, p));
      render(p);
    };

    /*
     * Timeline (rawProgress 0 → 1):
     *   0.00 – 0.25  Casa draws while stationary (Casa stays centered)
     *   0.25 – 0.60  Track moves Casa → Bagno, Bagno DRAWS while sliding in
     *   0.60 – 1.00  Track moves Bagno → Luce, Luce DRAWS while sliding in
     */
    const PHASES = [
      { kind: 'draw',     panel: 0, start: 0.00, end: 0.25 },
      { kind: 'moveDraw', from: 0,  to: 1, drawPanel: 1, start: 0.25, end: 0.60 },
      { kind: 'moveDraw', from: 1,  to: 2, drawPanel: 2, start: 0.60, end: 1.00 },
    ] as const;

    const render = (rawProgress: number) => {
      const vw = window.innerWidth;

      // Background transition white → black during last 5% of scroll
      const bgTransitionStart = 0.95;
      if (rawProgress >= bgTransitionStart) {
        const bgP = Math.min((rawProgress - bgTransitionStart) / (1 - bgTransitionStart), 1);
        const v = Math.round((1 - bgP) * 255);
        const bgColor = `rgb(${v}, ${v}, ${v})`;
        section.style.background = bgColor;
        sticky.style.background = bgColor;
      } else {
        section.style.background = '#ffffff';
        sticky.style.background = '#ffffff';
      }

      // ── Determine current track X + per-panel draw progress ──
      let trackX = 0;
      const panelDrawP: number[] = [0, 0, 0];

      for (const phase of PHASES) {
        if (rawProgress < phase.start) break;
        const phaseP = Math.max(0, Math.min(1, (rawProgress - phase.start) / (phase.end - phase.start)));

        if (phase.kind === 'draw') {
          trackX = -phase.panel * vw;
          panelDrawP[phase.panel] = phaseP;
        } else {
          // moveDraw — track interpolates AND the incoming panel draws
          trackX = -(phase.from + (phase.to - phase.from) * phaseP) * vw;
          panelDrawP[phase.from] = 1; // previous panel stays fully drawn
          panelDrawP[phase.drawPanel] = phaseP; // incoming panel draws as it enters
        }
      }

      // Apply track position with GPU-accelerated translate3d
      track.style.transform = `translate3d(${trackX}px, 0, 0)`;

      // ── Per-panel draw + text ──
      panelRefs.current.forEach((panel, i) => {
        if (!panel) return;
        const localP = panelDrawP[i];

        const svgPaths = panel.querySelectorAll('svg path, svg polygon');
        const pathCount = svgPaths.length;

        svgPaths.forEach((el, idx) => {
          const pathEl = el as SVGGeometryElement & { _pathLen?: number; _lastOffset?: number };
          const len = pathEl._pathLen;
          if (len === undefined) return;

          const pathStart = (idx / pathCount) * 0.6;
          const pathEnd = pathStart + 0.4;
          const pathP = Math.max(0, Math.min(1, (localP - pathStart) / (pathEnd - pathStart)));
          const offset = len * (1 - pathP);

          if (pathEl._lastOffset === undefined || Math.abs(pathEl._lastOffset - offset) > 0.5) {
            pathEl.style.strokeDashoffset = String(offset);
            pathEl._lastOffset = offset;
          }
        });

        // Parallax images — GPU-accelerated, precomputed px values
        const vh = window.innerHeight;
        const vw = window.innerWidth;
        const parallaxImages = panel.querySelectorAll('.cbl-parallax-img');
        parallaxImages.forEach((img, idx) => {
          const el = img as HTMLElement;

          if (i === 0) {
            // Casa — images must fully arrive BEFORE the Casa→Bagno transition starts at 0.25
            const stagger = idx * 0.04;
            const slideP = Math.max(0, Math.min(1, (rawProgress - stagger) / (0.22 - stagger)));
            // Softer easing — easeOutQuad instead of cubic
            const eased = 1 - (1 - slideP) * (1 - slideP);
            const slideY = (1 - eased) * vh * 0.6;
            el.style.transform = `translate3d(0, ${slideY}px, 0)`;
          } else {
            // Bagno & Luce — slide from right during their draw phase
            const stagger = idx * 0.08;
            const enterP = Math.max(0, Math.min(1, (localP - stagger) / (1 - stagger)));
            const eased = 1 - Math.pow(1 - enterP, 3);
            const slideX = (1 - eased) * vw;
            el.style.transform = `translate3d(${slideX}px, 0, 0)`;
          }
        });

        // Text block — matches panel's entry direction
        const textEl = panel.querySelector('.cbl-panel-text') as HTMLElement | null;
        if (textEl) {
          if (i === 0) {
            // Casa text — slides up from bottom, slightly after the images
            const slideP = Math.max(0, Math.min(1, (rawProgress - 0.08) / (0.22 - 0.08)));
            const eased = 1 - (1 - slideP) * (1 - slideP);
            const slideY = (1 - eased) * vh * 0.5;
            const opacity = eased;
            textEl.style.transform = `translate3d(0, ${slideY}px, 0)`;
            textEl.style.opacity = String(opacity);
          } else {
            // Bagno & Luce text — slide from right, slightly after the images
            const enterP = Math.max(0, Math.min(1, (localP - 0.2) / (1 - 0.2)));
            const eased = 1 - Math.pow(1 - enterP, 3);
            const slideX = (1 - eased) * vw * 0.8;
            const opacity = eased;
            textEl.style.transform = `translate3d(${slideX}px, 0, 0)`;
            textEl.style.opacity = String(opacity);
          }
        }

        // Casa-only floating description in top-right
        if (i === 0) {
          const descEl = panel.querySelector('.cbl-casa-desc') as HTMLElement | null;
          if (descEl) {
            const slideP = Math.max(0, Math.min(1, (rawProgress - 0.1) / (0.22 - 0.1)));
            const eased = 1 - (1 - slideP) * (1 - slideP);
            const slideY = (1 - eased) * vh * 0.5;
            descEl.style.transform = `translate3d(0, ${slideY}px, 0)`;
            descEl.style.opacity = String(eased);
          }
        }

        // Bagno-only floating description in bottom-right
        if (i === 1) {
          const descEl = panel.querySelector('.cbl-bagno-desc') as HTMLElement | null;
          if (descEl) {
            const enterP = Math.max(0, Math.min(1, (localP - 0.25) / (1 - 0.25)));
            const eased = 1 - Math.pow(1 - enterP, 3);
            const slideX = (1 - eased) * vw * 0.8;
            descEl.style.transform = `translate3d(${slideX}px, 0, 0)`;
            descEl.style.opacity = String(eased);
          }
        }

        // Luce-only floating description in right middle
        if (i === 2) {
          const descEl = panel.querySelector('.cbl-luce-desc') as HTMLElement | null;
          if (descEl) {
            const enterP = Math.max(0, Math.min(1, (localP - 0.25) / (1 - 0.25)));
            const eased = 1 - Math.pow(1 - enterP, 3);
            const slideX = (1 - eased) * vw * 0.8;
            descEl.style.transform = `translate3d(${slideX}px, -50%, 0)`;
            descEl.style.opacity = String(eased);
          }
        }
      });
    };

    // Run on every GSAP ticker frame (synced with Lenis's raf loop)
    // This guarantees render() fires on every frame, not just on scroll events
    handleScroll();
    gsap.ticker.add(handleScroll);
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      gsap.ticker.remove(handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        // Total scrollable height = enough for all 3 panels + transition space
        height: '400vh',
        background: 'transparent',
      }}
    >
      {/* Faded white background — fades in at the top to blend with marquee above */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#ffffff',
          zIndex: 1,
          pointerEvents: 'none',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 2%, rgba(0,0,0,0.85) 5%, #000 8%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 2%, rgba(0,0,0,0.85) 5%, #000 8%)',
        }}
      />

      {/* Blur + fade bridge — extends above the section to soften the top edge */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '-25vh',
          height: '40vh',
          zIndex: 2,
          pointerEvents: 'none',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.25) 30%, rgba(255,255,255,0.7) 65%, rgba(255,255,255,0.95) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 40%, #000 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 40%, #000 100%)',
        }}
      />

      {/* Cloud bleeding over the top of the horizontal section */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: mob ? '-30vh' : '-55vh',
          transform: 'translateX(-50%)',
          width: mob ? '130%' : '120vw',
          zIndex: 5,
          pointerEvents: 'none',
        }}
      >
        <img
          src="/assets/cloud-bottom.png"
          alt=""
          aria-hidden="true"
          draggable={false}
          style={{
            width: '100%',
            display: 'block',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 45%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 0%, black 45%, transparent 100%)',
          }}
        />
      </div>
      {/* Sticky viewport — stays fixed while user scrolls through the section */}
      <div
        ref={stickyRef}
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          overflowX: 'clip',
          overflowY: 'visible',
          background: 'transparent',
          zIndex: 3,
        }}
      >
        {/* Horizontal track */}
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            height: '100%',
            willChange: 'transform',
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden',
          }}
        >
          {items.map((item, i) => (
            <div
              key={item.id}
              ref={(el) => {
                panelRefs.current[i] = el;
              }}
              style={{
                flexShrink: 0,
                width: '100vw',
                height: '100vh',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Scattered parallax images — initial transform matches the entry direction */}
              {item.images.map((img, imgIdx) => {
                const initialTransform =
                  i === 0
                    ? 'translate3d(0, 60vh, 0)' // Casa starts 60vh below
                    : 'translate3d(100vw, 0, 0)'; // Bagno/Luce start off-screen right
                return (
                  <img
                    key={imgIdx}
                    src={img.src}
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    className="cbl-parallax-img"
                    data-speed={img.speed}
                    style={{
                      position: 'absolute',
                      left: `${img.x}%`,
                      top: `${img.y}%`,
                      width: mob ? `${Math.min(img.w * 0.65, 40)}vw` : `${img.w}vw`,
                      maxWidth: mob ? '200px' : `${(img as { maxW?: number }).maxW ?? 560}px`,
                      height: 'auto',
                      willChange: 'transform',
                      transform: initialTransform,
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      zIndex: 3,
                    }}
                  />
                );
              })}

              {/* Centered SVG that draws on scroll */}
              <div
                ref={(el) => {
                  svgContainerRefs.current[i] = el;
                }}
                style={{
                  width: mob ? 'clamp(180px, 55vw, 280px)' : 'clamp(280px, 32vw, 460px)',
                  aspectRatio: '2/3',
                  filter: 'drop-shadow(0 20px 40px rgba(86,8,6,0.15))',
                  zIndex: 5,
                  position: 'relative',
                }}
              />

              {/* Panel text — positioned in empty area, animates with panel's entry direction */}
              <div
                className="cbl-panel-text"
                style={{
                  position: 'absolute',
                  left: mob ? '5%' : `${item.text.x}%`,
                  top: mob ? (i === 0 ? '72%' : i === 1 ? '8%' : '70%') : `${item.text.y}%`,
                  maxWidth: mob ? '65vw' : '560px',
                  zIndex: 4,
                  willChange: 'transform, opacity',
                  transform:
                    i === 0
                      ? 'translate3d(0, 50vh, 0)'
                      : 'translate3d(80vw, 0, 0)',
                  opacity: 0,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  color: i === 2 ? '#ffffff' : '#560806',
                  pointerEvents: 'none',
                  fontSize: mob ? '0.85em' : '1.75em',
                }}
              >
                <div
                  style={{
                    fontFamily: 'Lato, sans-serif',
                    fontSize: '0.72em',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    opacity: 0.7,
                    marginBottom: '0.9em',
                  }}
                >
                  {item.text.label}
                </div>
                <div
                  style={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontStyle: 'italic',
                    fontSize: '1.6em',
                    lineHeight: 1,
                    opacity: 0.65,
                    marginBottom: '0.3em',
                  }}
                >
                  {item.text.italian}
                </div>
                <div
                  style={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: '4.5em',
                    lineHeight: 0.95,
                    fontWeight: 400,
                    marginBottom: '1.2em',
                  }}
                >
                  {item.text.title}
                </div>
              </div>

              {/* Luce description — floats in right middle, slides in from right */}
              {i === 2 && !mob && (
                <div
                  className="cbl-luce-desc"
                  style={{
                    position: 'absolute',
                    right: '5%',
                    top: '54%',
                    maxWidth: '320px',
                    zIndex: 4,
                    willChange: 'transform, opacity',
                    transform: 'translate3d(80vw, -50%, 0)',
                    opacity: 0,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    color: '#ffffff',
                    pointerEvents: 'none',
                    textAlign: 'right',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Lato, sans-serif',
                      fontSize: '0.68rem',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      opacity: 0.55,
                      marginBottom: '0.9rem',
                    }}
                  >
                    — Chapter Three
                  </div>
                  <p
                    style={{
                      fontFamily: '"Cormorant Garamond", serif',
                      fontSize: '1.15rem',
                      lineHeight: 1.55,
                      fontStyle: 'italic',
                      opacity: 0.8,
                      margin: 0,
                      fontWeight: 400,
                    }}
                  >
                    {item.text.desc}
                  </p>
                </div>
              )}

              {/* Bagno description — floats in bottom-right, slides in from right */}
              {i === 1 && !mob && (
                <div
                  className="cbl-bagno-desc"
                  style={{
                    position: 'absolute',
                    right: '5%',
                    bottom: '10%',
                    maxWidth: '320px',
                    zIndex: 4,
                    willChange: 'transform, opacity',
                    transform: 'translate3d(80vw, 0, 0)',
                    opacity: 0,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    color: '#560806',
                    pointerEvents: 'none',
                    textAlign: 'right',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Lato, sans-serif',
                      fontSize: '0.68rem',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      opacity: 0.55,
                      marginBottom: '0.9rem',
                    }}
                  >
                    — Chapter Two
                  </div>
                  <p
                    style={{
                      fontFamily: '"Cormorant Garamond", serif',
                      fontSize: '1.15rem',
                      lineHeight: 1.55,
                      fontStyle: 'italic',
                      opacity: 0.8,
                      margin: 0,
                      fontWeight: 400,
                    }}
                  >
                    {item.text.desc}
                  </p>
                </div>
              )}

              {/* Casa description — floats in top-right, slides up with panel */}
              {i === 0 && !mob && (
                <div
                  className="cbl-casa-desc"
                  style={{
                    position: 'absolute',
                    right: '4%',
                    top: '8%',
                    maxWidth: '320px',
                    zIndex: 4,
                    willChange: 'transform, opacity',
                    transform: 'translate3d(0, 50vh, 0)',
                    opacity: 0,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    color: '#560806',
                    pointerEvents: 'none',
                    textAlign: 'right',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Lato, sans-serif',
                      fontSize: '0.68rem',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      opacity: 0.55,
                      marginBottom: '0.9rem',
                    }}
                  >
                    — Chapter One
                  </div>
                  <p
                    style={{
                      fontFamily: '"Cormorant Garamond", serif',
                      fontSize: '1.15rem',
                      lineHeight: 1.55,
                      fontStyle: 'italic',
                      opacity: 0.8,
                      margin: 0,
                      fontWeight: 400,
                    }}
                  >
                    {item.text.desc}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Progress dots */}
        <div
          style={{
            position: 'absolute',
            bottom: '3rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '0.75rem',
            zIndex: 5,
          }}
        >
          {items.map((item) => (
            <span
              key={item.id}
              style={{
                width: '32px',
                height: '1px',
                background: 'rgba(86,8,6,0.25)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CasaBagnoLuceScroll;
