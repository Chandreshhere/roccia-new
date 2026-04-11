import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: '01',
    title: 'Sourcing',
    italian: "L'Origine",
    desc: 'The finest marble blocks sourced from quarries of Italy, Rajasthan, and beyond. Each slab hand-selected for its veining, density, and character — the raw poetry of the earth.',
  },
  {
    num: '02',
    title: 'Design',
    italian: 'Il Disegno',
    desc: 'Advanced 3D design and digital masonry techniques meet decades of artisanal instinct. Every curve and contour is calculated — a union of intuition and engineering precision.',
  },
  {
    num: '03',
    title: 'Sculpt',
    italian: 'La Scultura',
    desc: 'Precision CNC machining defines the form; the chisel of our master artisans refines the soul. Where technology and tradition converge to shape the eternal.',
  },
  {
    num: '04',
    title: 'Finish',
    italian: 'La Rifinitura',
    desc: 'Hand-polished over days, sometimes weeks. Each surface refined until it tells a story — cool to the touch, warm in intent, tangible proof of time mastered.',
  },
];

const Craftsmanship: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current?.querySelectorAll('.craft-header-line') ?? [], {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });

      // Staggered reveal of each step
      const stepEls = stepsRef.current?.querySelectorAll('.craft-step');
      if (stepEls) {
        stepEls.forEach((el, i) => {
          gsap.from(el, {
            opacity: 0,
            x: i % 2 === 0 ? -60 : 60,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
            },
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        padding: '14rem 4rem',
        background: '#f2f1ea',
        overflow: 'hidden',
        zIndex: 23,
      }}
    >
      {/* Background big text */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '8rem',
          right: '-3rem',
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '18rem',
          fontStyle: 'italic',
          color: 'rgba(86,8,6,0.04)',
          fontWeight: 300,
          letterSpacing: '0.05em',
          pointerEvents: 'none',
          userSelect: 'none',
          lineHeight: 0.8,
        }}
      >
        Process
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
          <p
            className="craft-header-line"
            style={{
              fontFamily: 'Lato, sans-serif',
              fontSize: '0.65rem',
              fontWeight: 300,
              letterSpacing: '0.5em',
              textTransform: 'uppercase',
              color: '#560806',
              opacity: 0.55,
              marginBottom: '1.5rem',
            }}
          >
            The Making
          </p>
          <h2
            className="craft-header-line"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(3rem, 6vw, 6.5rem)',
              fontWeight: 400,
              color: '#560806',
              lineHeight: 1,
              letterSpacing: '-0.01em',
            }}
          >
            From Stone to <em style={{ fontWeight: 300 }}>Story</em>
          </h2>
          <div
            className="craft-header-line"
            style={{
              width: '80px',
              height: '1px',
              background: 'rgba(86,8,6,0.3)',
              margin: '2.5rem auto 0',
            }}
          />
        </div>

        {/* Steps */}
        <div ref={stepsRef} style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="craft-step"
              style={{
                display: 'grid',
                gridTemplateColumns: i % 2 === 0 ? '1fr 1.5fr' : '1.5fr 1fr',
                gap: '5rem',
                alignItems: 'center',
                direction: i % 2 === 0 ? 'ltr' : 'rtl',
              }}
            >
              {/* Number */}
              <div style={{ direction: 'ltr' }}>
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 'clamp(6rem, 14vw, 16rem)',
                    fontWeight: 300,
                    color: 'rgba(86,8,6,0.15)',
                    lineHeight: 0.85,
                    fontStyle: 'italic',
                    textAlign: i % 2 === 0 ? 'right' : 'left',
                  }}
                >
                  {step.num}
                </div>
              </div>

              {/* Text */}
              <div style={{ direction: 'ltr' }}>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1rem',
                    fontStyle: 'italic',
                    color: 'rgba(86,8,6,0.5)',
                    letterSpacing: '0.1em',
                    marginBottom: '0.5rem',
                  }}
                >
                  {step.italian}
                </p>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 'clamp(2.5rem, 4.5vw, 4.5rem)',
                    fontWeight: 400,
                    color: '#560806',
                    lineHeight: 1,
                    marginBottom: '1.5rem',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {step.title}
                </h3>
                <div
                  style={{
                    width: '50px',
                    height: '1px',
                    background: 'rgba(86,8,6,0.25)',
                    marginBottom: '1.5rem',
                  }}
                />
                <p
                  style={{
                    fontFamily: 'Lato, sans-serif',
                    fontSize: '0.9rem',
                    fontWeight: 300,
                    lineHeight: 1.9,
                    color: 'rgba(23,23,23,0.65)',
                    maxWidth: '48ch',
                  }}
                >
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Craftsmanship;
