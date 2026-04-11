import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── Three brand book quotes that cycle through on scroll ── */
const phases = [
  {
    label: 'I — Poised & Understated',
    quote: 'Every surface tells a story — not of excess, but of mastery.',
    italic: 'La Maestria',
  },
  {
    label: 'II — Articulate & Intelligent',
    quote: 'Each curve and contour is calculated — a union of intuition and expertise.',
    italic: "L'Intuizione",
  },
  {
    label: 'III — Evocative & Sensory',
    quote: 'Cool to the touch. Warm in intent. Every surface holds a story of time made tangible.',
    italic: 'Il Tempo',
  },
];

const ManifestoQuote: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const phaseRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRef = useRef<HTMLDivElement>(null);
  const attrRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const progressDotsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Hide all phases except first
    phaseRefs.current.forEach((el, i) => {
      if (el) {
        gsap.set(el, {
          opacity: i === 0 ? 1 : 0,
        });
      }
    });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=350%',
        pin: true,
        pinType: 'transform',
        pinSpacing: true,
        scrub: 1.2,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;

          // 0 → 0.08: label fade in
          // 0.08 → 0.35: phase 0 active
          // 0.35 → 0.60: phase 1 active
          // 0.60 → 0.85: phase 2 active
          // 0.85 → 1: attribution fades in

          if (labelRef.current) {
            labelRef.current.style.opacity = String(Math.min(p / 0.08, 1));
          }

          let activePhase: number;
          let phaseT: number;

          if (p < 0.35) {
            activePhase = 0;
            phaseT = Math.max((p - 0.08) / 0.27, 0);
          } else if (p < 0.6) {
            activePhase = 1;
            phaseT = (p - 0.35) / 0.25;
          } else if (p < 0.85) {
            activePhase = 2;
            phaseT = (p - 0.6) / 0.25;
          } else {
            activePhase = 2;
            phaseT = 1;
          }

          phaseRefs.current.forEach((el, i) => {
            if (!el) return;
            if (i === activePhase) {
              const fadeIn = Math.min(phaseT * 2.5, 1);
              el.style.opacity = String(fadeIn);
              el.style.transform = `translateY(${(1 - fadeIn) * 40}px)`;
            } else {
              el.style.opacity = '0';
            }
          });

          progressDotsRef.current.forEach((d, i) => {
            if (!d) return;
            d.style.width = i === activePhase ? '30px' : '8px';
            d.style.opacity = i === activePhase ? '1' : '0.3';
          });

          if (attrRef.current) {
            const attrP = Math.max((p - 0.85) / 0.15, 0);
            attrRef.current.style.opacity = String(attrP);
            attrRef.current.style.transform = `translateX(-50%) translateY(${(1 - attrP) * 20}px)`;
          }

          if (bgTextRef.current) {
            bgTextRef.current.style.transform = `translateX(-50%) translateY(${-p * 40}px)`;
          }
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: '#560806',
        overflow: 'hidden',
        zIndex: 20,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8rem 4rem',
        }}
      >
        {/* Background decorative italic text */}
        <div
          ref={bgTextRef}
          aria-hidden
          style={{
            position: 'absolute',
            bottom: '-6rem',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(12rem, 28vw, 34rem)',
            fontStyle: 'italic',
            fontWeight: 300,
            color: 'rgba(220,209,191,0.04)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            userSelect: 'none',
            lineHeight: 0.75,
            willChange: 'transform',
          }}
        >
          Manifesto
        </div>

        {/* Decorative corner marks */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: '3rem',
            left: '3rem',
            width: '40px',
            height: '40px',
            borderTop: '1px solid rgba(220,209,191,0.2)',
            borderLeft: '1px solid rgba(220,209,191,0.2)',
          }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: '3rem',
            right: '3rem',
            width: '40px',
            height: '40px',
            borderTop: '1px solid rgba(220,209,191,0.2)',
            borderRight: '1px solid rgba(220,209,191,0.2)',
          }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: '3rem',
            left: '3rem',
            width: '40px',
            height: '40px',
            borderBottom: '1px solid rgba(220,209,191,0.2)',
            borderLeft: '1px solid rgba(220,209,191,0.2)',
          }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: '3rem',
            right: '3rem',
            width: '40px',
            height: '40px',
            borderBottom: '1px solid rgba(220,209,191,0.2)',
            borderRight: '1px solid rgba(220,209,191,0.2)',
          }}
        />

        {/* Section label */}
        <div
          ref={labelRef}
          style={{
            fontFamily: 'Lato, sans-serif',
            fontSize: '0.65rem',
            fontWeight: 300,
            letterSpacing: '0.55em',
            textTransform: 'uppercase',
            color: 'rgba(220,209,191,0.5)',
            marginBottom: '5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            opacity: 0,
          }}
        >
          <span
            style={{
              width: '40px',
              height: '1px',
              background: 'rgba(220,209,191,0.3)',
            }}
          />
          Our Manifesto
          <span
            style={{
              width: '40px',
              height: '1px',
              background: 'rgba(220,209,191,0.3)',
            }}
          />
        </div>

        {/* Phase quotes */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1100px',
            height: '380px',
          }}
        >
          {phases.map((phase, i) => (
            <div
              key={i}
              ref={(el) => {
                phaseRefs.current[i] = el;
              }}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                textAlign: 'center',
                willChange: 'opacity, transform',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <p
                style={{
                  fontFamily: 'Lato, sans-serif',
                  fontSize: '0.6rem',
                  fontWeight: 300,
                  letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                  color: 'rgba(201,169,110,0.7)',
                  marginBottom: '1.5rem',
                }}
              >
                {phase.label}
              </p>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.1rem',
                  fontStyle: 'italic',
                  color: 'rgba(220,209,191,0.5)',
                  letterSpacing: '0.15em',
                  marginBottom: '2rem',
                }}
              >
                {phase.italic}
              </p>
              <blockquote
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(2.2rem, 5.5vw, 6.5rem)',
                  fontWeight: 400,
                  fontStyle: 'italic',
                  lineHeight: 1.15,
                  letterSpacing: '-0.01em',
                  color: '#f2f1ea',
                  margin: 0,
                  maxWidth: '20ch',
                  marginInline: 'auto',
                }}
              >
                {phase.quote}
              </blockquote>
            </div>
          ))}
        </div>

        {/* Progress dots */}
        <div
          style={{
            marginTop: '5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          {phases.map((_, i) => (
            <div
              key={i}
              ref={(el) => {
                progressDotsRef.current[i] = el;
              }}
              style={{
                width: i === 0 ? '30px' : '8px',
                height: '1px',
                background: '#dcd1bf',
                opacity: i === 0 ? 1 : 0.3,
                transition: 'width 0.5s ease, opacity 0.5s ease',
              }}
            />
          ))}
        </div>

        {/* Attribution */}
        <div
          ref={attrRef}
          style={{
            position: 'absolute',
            bottom: '5rem',
            left: '50%',
            transform: 'translateX(-50%) translateY(20px)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            opacity: 0,
            willChange: 'opacity, transform',
          }}
        >
          <span
            style={{
              width: '60px',
              height: '1px',
              background: 'rgba(220,209,191,0.3)',
            }}
          />
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.1rem',
              fontStyle: 'italic',
              color: 'rgba(220,209,191,0.7)',
              letterSpacing: '0.1em',
            }}
          >
            House of Roccia
          </span>
          <span
            style={{
              width: '60px',
              height: '1px',
              background: 'rgba(220,209,191,0.3)',
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default ManifestoQuote;
