import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsMobile } from '../hooks/useIsMobile';

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
  const mob = useIsMobile();
  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const structureRef = useRef<HTMLDivElement>(null);
  const titleInnerRef = useRef<HTMLSpanElement>(null);
  const estRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const cloudLeftRef = useRef<HTMLDivElement>(null);
  const cloudRightRef = useRef<HTMLDivElement>(null);
  const cloudBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Entrance + scroll handled by rAF below ──
      gsap.set('.hero__content', { opacity: 0 });

      // Scroll indicator fade in
      const tl = gsap.timeline({ delay: 1.8 });
      tl.to(scrollIndicatorRef.current, {
        opacity: 1, duration: 0.8, ease: 'power2.out',
      });

      // Set initial bottom cloud centering
      if (cloudBottomRef.current) {
        gsap.set(cloudBottomRef.current, { xPercent: -50 });
      }

      // ── Scroll-driven parallax ──
      const hero = heroRef.current;
      if (!hero) return;

      // Background parallax (move up slower)
      gsap.to(bgRef.current, {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Structure lifts upward — stops when reaching the white section
      gsap.to(structureRef.current, {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: '55% top',
          scrub: 0.6,
        },
      });

      // Clouds drift outward + fade out on scroll
      ScrollTrigger.create({
        trigger: hero,
        start: 'top top',
        end: '80% top',
        scrub: 1.5,
        onUpdate: (self) => {
          const p = self.progress;
          if (cloudLeftRef.current) {
            gsap.set(cloudLeftRef.current, { x: -p * 200, opacity: 1 - p });
          }
          if (cloudRightRef.current) {
            gsap.set(cloudRightRef.current, { x: p * 200, opacity: 1 - p });
          }
          if (cloudBottomRef.current) {
            gsap.set(cloudBottomRef.current, { xPercent: -50, y: p * 80, opacity: 1 - p * 0.5 });
          }
        },
      });

    }, heroRef);

    // ── Unified rAF: entrance from bottom + scroll-driven movement ──
    const contentEl = document.querySelector('.hero__content') as HTMLElement;
    const heroEl = heroRef.current;
    let rafId: number | null = null;

    if (contentEl && heroEl) {
      let currentY = 35;
      let currentOpacity = 0;
      const heroHeight = heroEl.offsetHeight;
      const ENTRANCE_DELAY = 1200;
      const ENTRANCE_DURATION = 1800;
      const startTime = performance.now();

      function animate() {
        const now = performance.now();
        const elapsed = now - startTime;
        const scrollY = window.scrollY;
        const scrollProgress = Math.min(Math.max(scrollY / (heroHeight * 0.5), 0), 1);

        let targetY: number;
        let targetOpacity: number;

        if (elapsed < ENTRANCE_DELAY) {
          targetY = 35;
          targetOpacity = 0;
        } else if (elapsed < ENTRANCE_DELAY + ENTRANCE_DURATION) {
          const entranceProgress = (elapsed - ENTRANCE_DELAY) / ENTRANCE_DURATION;
          const eased = 1 - Math.pow(1 - entranceProgress, 3);
          targetY = 35 * (1 - eased) + scrollProgress * 35;
          targetOpacity = eased * (1 - scrollProgress * 0.8);
        } else {
          targetY = scrollProgress * 35;
          targetOpacity = 1 - scrollProgress * 0.8;
        }

        currentY += (targetY - currentY) * 0.06;
        currentOpacity += (targetOpacity - currentOpacity) * 0.08;

        contentEl.style.transform = `translateY(${currentY}%)`;
        contentEl.style.opacity = String(Math.max(0, Math.min(1, currentOpacity)));

        rafId = requestAnimationFrame(animate);
      }
      rafId = requestAnimationFrame(animate);
    }

    return () => {
      ctx.revert();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section ref={heroRef} className="hero" id="home">
      {/* Clip wrapper — keeps sky contained */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
        {/* Sky background */}
        <div ref={bgRef} className="hero__bg" />
        <div className="hero__bg-gradient" />
      </div>

      {/* Left cloud */}
      <div
        ref={cloudLeftRef}
        style={{
          position: mob ? 'absolute' : 'fixed',
          left: '-2%',
          top: mob ? '-5%' : '-2%',
          width: mob ? '50%' : '36%',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        <img src="/assets/cloud-left.png" alt="" aria-hidden="true" draggable={false} style={{ width: '100%', display: 'block' }} />
      </div>

      {/* Right cloud */}
      <div
        ref={cloudRightRef}
        style={{
          position: mob ? 'absolute' : 'fixed',
          right: '-2%',
          top: mob ? '-8%' : '-5%',
          width: mob ? '50%' : '36%',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        <img src="/assets/cloud-right.png" alt="" aria-hidden="true" draggable={false} style={{ width: '100%', display: 'block' }} />
      </div>

      {/* Main marble structure */}
      <div ref={structureRef} className="hero__structure">
        <img
          src="/assets/main-hero.png"
          alt="Roccia marble architectural structure"
          draggable={false}
        />
      </div>

      {/* Bottom cloud — outside hero flow, overlaps section below */}
      <div
        ref={cloudBottomRef}
        style={{
          position: 'absolute',
          bottom: mob ? '-40%' : '-62%',
          left: '50%',
          width: mob ? '120%' : '100vw',
          zIndex: 20,
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
            maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 100%)',
          }}
        />
      </div>

      {/* White blur gradient at bottom of hero — top transparent/blurry, bottom solid white */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '22%',
          zIndex: 3,
          pointerEvents: 'none',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 25%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0.9) 75%, #ffffff 100%)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 30%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 30%)',
        }}
      />

      {/* Hero content / text */}
      <div className="hero__content">
        <div className="hero__content-inner">
          <div ref={estRef} className="hero__est">
            Est. 1994 &nbsp;·&nbsp; Indore, India
          </div>

          <h1 className="hero__title">
            <span ref={titleInnerRef} className="hero__title-inner">
              ROCCIA
            </span>
          </h1>

          <p ref={subtitleRef} className="hero__subtitle">
            Marble Decor & Artistry
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollIndicatorRef} className="hero__scroll-indicator">
        <span className="hero__scroll-text">Scroll</span>
        <span className="hero__scroll-line" />
      </div>
    </section>
  );
};

export default Hero;
