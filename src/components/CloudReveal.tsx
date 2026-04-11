import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CloudReveal: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);
  const whiteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cloud = cloudRef.current;
    const white = whiteRef.current;
    if (!section || !cloud || !white) return;

    // Initial state — both below the viewport
    gsap.set(cloud, { yPercent: 100 });
    gsap.set(white, { yPercent: 100 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: 1.2,
        onUpdate: (self) => {
          const p = self.progress;

          // Phase 1 (0 → 0.3): cloud rises from below, 100% → 0%
          if (p <= 0.3) {
            const cloudP = p / 0.3;
            gsap.set(cloud, { yPercent: 100 * (1 - cloudP) });
            gsap.set(white, { yPercent: 100 });
          } else {
            // Phase 2 (0.3 → 1): white section rises, cloud stays at top
            gsap.set(cloud, { yPercent: 0 });
            const whiteP = (p - 0.3) / 0.7;
            gsap.set(white, { yPercent: 100 * (1 - whiteP) });
          }
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '200vh',
        pointerEvents: 'none',
      }}
    >
      {/* Sticky layer — contains the cloud + white that slide up over the pinned section above */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {/* White section — slides up second */}
        <div
          ref={whiteRef}
          style={{
            position: 'absolute',
            inset: 0,
            background: '#ffffff',
            zIndex: 20,
            willChange: 'transform',
            pointerEvents: 'auto',
          }}
        />

        {/* Cloud layer — slides up first */}
        <div
          ref={cloudRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            zIndex: 25,
            willChange: 'transform',
            pointerEvents: 'none',
          }}
        >
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
              maskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CloudReveal;
