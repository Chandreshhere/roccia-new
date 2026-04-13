import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { useIsMobile } from '../hooks/useIsMobile';

const TOP_ROW = ['Stone shaped by time', 'Marble as memory'];
const BOTTOM_ROW = ['Light carved into form', 'The earth made eternal', 'Silence cast in stone'];

// Mobile: 5 rows
const MOB_ROWS = [
  ['Stone shaped by time'],
  ['Marble as memory'],
  ['Light carved into form'],
  ['The earth made eternal'],
  ['Silence cast in stone'],
];

const RotatorSVG = () => (
  <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', display: 'block' }}>
    <g stroke="#560806" strokeWidth="6" strokeLinecap="round" fill="none">
      <line x1="50" y1="8" x2="50" y2="92" />
      <line x1="8" y1="50" x2="92" y2="50" />
      <line x1="20" y1="20" x2="80" y2="80" />
      <line x1="80" y1="20" x2="20" y2="80" />
    </g>
  </svg>
);

const MarqueeManifesto: React.FC = () => {
  const mob = useIsMobile();
  const sectionRef = useRef<HTMLElement>(null);
  const trackTopRef = useRef<HTMLDivElement>(null);
  const trackBottomRef = useRef<HTMLDivElement>(null);
  const mobTrackRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (mob) {
      // ── Mobile: 5 rows ──
      const tracks = mobTrackRefs.current.filter(Boolean) as HTMLDivElement[];
      const rotators = Array.from(section.querySelectorAll('.marquee-rotator')) as HTMLElement[];
      let vh = window.innerHeight;
      let vw = window.innerWidth;
      let sectionHeight = section.offsetHeight;
      const travels: number[] = tracks.map((t) => t.scrollWidth - vw);

      const recalc = () => {
        vh = window.innerHeight;
        vw = window.innerWidth;
        sectionHeight = section.offsetHeight;
        tracks.forEach((t, i) => { travels[i] = t.scrollWidth - vw; });
      };

      let lastProgress = -1;

      const handleScroll = () => {
        const rect = section.getBoundingClientRect();
        const total = vh + sectionHeight;
        let p = (vh - rect.top) / total;
        p = p < 0 ? 0 : p > 1 ? 1 : p;
        if (Math.abs(p - lastProgress) < 0.0005) return;
        lastProgress = p;

        const y = -p * vh * 0.6;

        tracks.forEach((track, i) => {
          const travel = travels[i];
          // Alternate direction: even rows go left, odd rows go right
          const x = i % 2 === 0
            ? -p * travel * 0.7
            : -travel + p * travel * 0.7;
          track.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });

        const rot = `rotate(${p * 720}deg)`;
        for (let i = 0; i < rotators.length; i++) {
          rotators[i].style.transform = rot;
        }
      };

      const onResize = () => { recalc(); lastProgress = -1; handleScroll(); };
      handleScroll();
      gsap.ticker.add(handleScroll);
      window.addEventListener('resize', onResize, { passive: true });
      return () => { gsap.ticker.remove(handleScroll); window.removeEventListener('resize', onResize); };
    } else {
      // ── Desktop: original 2 rows ──
      const trackTop = trackTopRef.current;
      const trackBottom = trackBottomRef.current;
      if (!trackTop || !trackBottom) return;

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

      const onResize = () => { recalc(); lastProgress = -1; handleScroll(); };
      handleScroll();
      gsap.ticker.add(handleScroll);
      window.addEventListener('resize', onResize, { passive: true });
      return () => { gsap.ticker.remove(handleScroll); window.removeEventListener('resize', onResize); };
    }
  }, [mob]);

  const mobFontSize = 'clamp(3.5rem, 15vw, 7rem)';
  const deskFontSize = 'clamp(4rem, 12vw, 16rem)';

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        height: mob ? 'clamp(2rem, 10vw, 6rem)' : 'clamp(4rem, 12vw, 16rem)',
        marginTop: mob ? '-25vh' : '-45vh',
        marginBottom: 0,
        background: 'transparent',
        overflow: 'visible',
        zIndex: 6,
        pointerEvents: 'none',
      }}
    >
      {mob ? (
        /* ── Mobile: 5 parallel rows ── */
        <>
          {MOB_ROWS.map((phrases, rowIdx) => (
            <div
              key={rowIdx}
              ref={(el) => { mobTrackRefs.current[rowIdx] = el; }}
              style={{
                position: 'absolute',
                top: `calc(${rowIdx * 22}% + ${rowIdx * 3}rem)`,
                left: 0,
                transform: 'translate3d(0, 0, 0)',
                display: 'flex',
                alignItems: 'center',
                gap: '6vw',
                whiteSpace: 'nowrap',
                willChange: 'transform',
                paddingLeft: '50vw',
                paddingRight: '50vw',
                zIndex: 2,
                color: '#560806',
              }}
            >
              {phrases.map((phrase, i) => (
                <React.Fragment key={i}>
                  <span
                    style={{
                      fontFamily: '"PP Editorial New", "Didot", "Bodoni 72", "Playfair Display", Georgia, serif',
                      fontSize: mobFontSize,
                      fontWeight: 400,
                      lineHeight: 1,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {phrase}
                  </span>
                  {i < phrases.length - 1 && (
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
                        fontSize: mobFontSize,
                        color: '#560806',
                        willChange: 'transform',
                        transform: 'rotate(0deg)',
                      }}
                    >
                      <RotatorSVG />
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          ))}
        </>
      ) : (
        /* ── Desktop: original 2 rows (untouched) ── */
        <>
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
                    fontSize: deskFontSize,
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
                      fontSize: deskFontSize,
                      color: '#560806',
                      willChange: 'transform',
                      transform: 'rotate(0deg)',
                    }}
                  >
                    <RotatorSVG />
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
                    fontSize: deskFontSize,
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
                      fontSize: deskFontSize,
                      color: '#560806',
                      willChange: 'transform',
                      transform: 'rotate(0deg)',
                    }}
                  >
                    <RotatorSVG />
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default MarqueeManifesto;
