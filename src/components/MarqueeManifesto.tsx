import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

const TOP_ROW = ['Stone shaped by time', 'Marble as memory'];
const BOTTOM_ROW = ['Light carved into form', 'The earth made eternal', 'Silence cast in stone'];

const MarqueeManifesto: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackTopRef = useRef<HTMLDivElement>(null);
  const trackBottomRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const trackTop = trackTopRef.current;
    const trackBottom = trackBottomRef.current;
    if (!section || !trackTop || !trackBottom) return;

    // Cache static values once — avoid touching layout every frame
    const rotators = Array.from(section.querySelectorAll('.marquee-rotator')) as HTMLElement[];
    let vh = window.innerHeight;
    let vw = window.innerWidth;
    let sectionHeight = section.offsetHeight;
    let travelTop = trackTop.scrollWidth - vw;
    let travelBottom = trackBottom.scrollWidth - vw;

    const recalc = () => {
      vh = window.innerHeight;
      vw = window.innerWidth;
      sectionHeight = section.offsetHeight;
      travelTop = trackTop.scrollWidth - vw;
      travelBottom = trackBottom.scrollWidth - vw;
    };

    let lastProgress = -1;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const total = vh + sectionHeight;
      let p = (vh - rect.top) / total;
      p = p < 0 ? 0 : p > 1 ? 1 : p;

      // Skip redraw if nothing meaningful changed
      if (Math.abs(p - lastProgress) < 0.0005) return;
      lastProgress = p;

      const y = -p * vh * 0.6;

      const xTop = -p * travelTop * 0.7;
      trackTop.style.transform = `translate3d(${xTop}px, ${y}px, 0)`;

      const xBottom = -travelBottom + p * travelBottom * 0.7;
      trackBottom.style.transform = `translate3d(${xBottom}px, ${y}px, 0)`;

      const rot = `rotate(${p * 720}deg)`;
      for (let i = 0; i < rotators.length; i++) {
        rotators[i].style.transform = rot;
      }
    };

    const onResize = () => {
      recalc();
      lastProgress = -1;
      handleScroll();
    };

    handleScroll();
    gsap.ticker.add(handleScroll);
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      gsap.ticker.remove(handleScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        height: 'clamp(4rem, 12vw, 16rem)',
        marginTop: '-45vh',
        marginBottom: 0,
        background: 'transparent',
        overflow: 'visible',
        zIndex: 6,
        pointerEvents: 'none',
      }}
    >
      {/* Top row — marquees right → left */}
      <div
        ref={trackTopRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          transform: 'translate3d(0, 0, 0)',
          display: 'flex',
          alignItems: 'center',
          gap: '8vw',
          whiteSpace: 'nowrap',
          willChange: 'transform',
          paddingLeft: '50vw',
          paddingRight: '50vw',
          zIndex: 2,
          color: '#560806',
        }}
      >
        {TOP_ROW.map((phrase, i) => (
          <React.Fragment key={i}>
            <span
              style={{
                fontFamily: '"PP Editorial New", "Didot", "Bodoni 72", "Playfair Display", Georgia, serif',
                fontSize: 'clamp(4rem, 12vw, 16rem)',
                fontWeight: 400,
                lineHeight: 1,
                letterSpacing: '-0.01em',
              }}
            >
              {phrase}
            </span>
            {i < TOP_ROW.length - 1 && (
              <span
                aria-hidden="true"
                className="marquee-rotator"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '0.7em',
                  height: '0.7em',
                  flexShrink: 0,
                  fontSize: 'clamp(4rem, 12vw, 16rem)',
                  color: '#560806',
                  willChange: 'transform',
                  transform: 'rotate(0deg)',
                }}
              >
                <svg
                  viewBox="0 0 100 100"
                  style={{ width: '100%', height: '100%', display: 'block' }}
                >
                  <g stroke="#560806" strokeWidth="6" strokeLinecap="round" fill="none">
                    <line x1="50" y1="8" x2="50" y2="92" />
                    <line x1="8" y1="50" x2="92" y2="50" />
                    <line x1="20" y1="20" x2="80" y2="80" />
                    <line x1="80" y1="20" x2="20" y2="80" />
                  </g>
                </svg>
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Bottom row — marquees left → right */}
      <div
        ref={trackBottomRef}
        style={{
          position: 'absolute',
          top: 'calc(100% + 2vw)',
          left: 0,
          transform: 'translate3d(0, 0, 0)',
          display: 'flex',
          alignItems: 'center',
          gap: '8vw',
          whiteSpace: 'nowrap',
          willChange: 'transform',
          paddingLeft: '50vw',
          paddingRight: '50vw',
          zIndex: 2,
          color: '#560806',
        }}
      >
        {BOTTOM_ROW.map((phrase, i) => (
          <React.Fragment key={i}>
            <span
              style={{
                fontFamily: '"PP Editorial New", "Didot", "Bodoni 72", "Playfair Display", Georgia, serif',
                fontSize: 'clamp(4rem, 12vw, 16rem)',
                fontWeight: 400,
                lineHeight: 1,
                letterSpacing: '-0.01em',
              }}
            >
              {phrase}
            </span>
            {i < BOTTOM_ROW.length - 1 && (
              <span
                aria-hidden="true"
                className="marquee-rotator"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '0.7em',
                  height: '0.7em',
                  flexShrink: 0,
                  fontSize: 'clamp(4rem, 12vw, 16rem)',
                  color: '#560806',
                  willChange: 'transform',
                  transform: 'rotate(0deg)',
                }}
              >
                <svg
                  viewBox="0 0 100 100"
                  style={{ width: '100%', height: '100%', display: 'block' }}
                >
                  <g stroke="#560806" strokeWidth="6" strokeLinecap="round" fill="none">
                    <line x1="50" y1="8" x2="50" y2="92" />
                    <line x1="8" y1="50" x2="92" y2="50" />
                    <line x1="20" y1="20" x2="80" y2="80" />
                    <line x1="80" y1="20" x2="20" y2="80" />
                  </g>
                </svg>
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default MarqueeManifesto;
