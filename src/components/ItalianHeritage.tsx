import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ItalianHeritage: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const illustrationRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left content reveal
      gsap.from(leftRef.current?.children ?? [], {
        opacity: 0,
        y: 50,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });

      // SVG draw animation
      const paths = illustrationRef.current?.querySelectorAll('path, rect, line, circle, polyline, polygon');
      if (paths) {
        paths.forEach((el) => {
          const p = el as SVGGeometryElement;
          if (p.getTotalLength) {
            const len = p.getTotalLength();
            gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
          }
        });

        gsap.to(paths, {
          strokeDashoffset: 0,
          duration: 2.5,
          ease: 'power2.inOut',
          stagger: 0.03,
          scrollTrigger: {
            trigger: illustrationRef.current,
            start: 'top 75%',
          },
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
        minHeight: '100vh',
        background: '#f2f1ea',
        padding: '12rem 4rem',
        zIndex: 21,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '6rem',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {/* Left: Brand Story */}
        <div ref={leftRef}>
          <p
            style={{
              fontFamily: 'Lato, sans-serif',
              fontSize: '0.65rem',
              fontWeight: 300,
              letterSpacing: '0.5em',
              textTransform: 'uppercase',
              color: '#560806',
              opacity: 0.5,
              marginBottom: '1.5rem',
            }}
          >
            Brand Story
          </p>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(3rem, 5.5vw, 6rem)',
              fontWeight: 400,
              lineHeight: 1,
              color: '#560806',
              marginBottom: '3rem',
              letterSpacing: '-0.01em',
            }}
          >
            Born in Indore,
            <br />
            <em style={{ fontWeight: 300 }}>inspired</em> by Italy.
          </h2>

          <div
            style={{
              width: '60px',
              height: '1px',
              background: 'rgba(86,8,6,0.3)',
              marginBottom: '2.5rem',
            }}
          />

          <p
            style={{
              fontFamily: 'Lato, sans-serif',
              fontSize: '0.9rem',
              fontWeight: 300,
              lineHeight: 1.9,
              color: 'rgba(23,23,23,0.65)',
              marginBottom: '1.5rem',
              maxWidth: '48ch',
            }}
          >
            For centuries, stone has stood as a symbol of permanence, prestige and
            architectural power. Traditionally seen as distant, grand and immovable —
            Roccia reimagines this legacy.
          </p>

          <p
            style={{
              fontFamily: 'Lato, sans-serif',
              fontSize: '0.9rem',
              fontWeight: 300,
              lineHeight: 1.9,
              color: 'rgba(23,23,23,0.65)',
              marginBottom: '3rem',
              maxWidth: '48ch',
            }}
          >
            Driven by a deep, instinctive need to shape and give form to the eternal,
            we transform raw, natural materials into living expressions of space, soul
            and structure. Our objects are not merely furniture — they are modern artefacts.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              fontFamily: 'Lato, sans-serif',
              fontSize: '0.65rem',
              fontWeight: 300,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: '#560806',
            }}
          >
            <span style={{ width: '40px', height: '1px', background: '#560806' }} />
            Italy's Finest to Your Doorstep
          </div>
        </div>

        {/* Right: Italian Architecture SVG */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1 / 1.1',
          }}
        >
          <svg
            ref={illustrationRef}
            viewBox="0 0 500 550"
            fill="none"
            style={{ width: '100%', height: '100%' }}
          >
            {/* Ground line */}
            <line x1="0" y1="480" x2="500" y2="480" stroke="#560806" strokeWidth="1" opacity="0.4" />

            {/* Left colonnade building */}
            <rect x="20" y="200" width="140" height="280" stroke="#560806" strokeWidth="1" fill="none" opacity="0.5" />
            <rect x="30" y="220" width="120" height="40" stroke="#560806" strokeWidth="0.7" fill="none" opacity="0.4" />
            {/* Columns */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={`col-l-${i}`} x1={40 + i * 25} y1="270" x2={40 + i * 25} y2="460" stroke="#560806" strokeWidth="1" opacity="0.4" />
            ))}
            <line x1="30" y1="460" x2="150" y2="460" stroke="#560806" strokeWidth="1" opacity="0.4" />
            <line x1="30" y1="270" x2="150" y2="270" stroke="#560806" strokeWidth="1" opacity="0.4" />
            {/* Roof */}
            <polyline points="20,200 90,160 160,200" stroke="#560806" strokeWidth="1" fill="none" opacity="0.5" />

            {/* Center dome building */}
            <rect x="180" y="240" width="140" height="240" stroke="#560806" strokeWidth="1.2" fill="none" opacity="0.6" />
            {/* Dome */}
            <path d="M 180 240 Q 250 150 320 240" stroke="#560806" strokeWidth="1.2" fill="none" opacity="0.6" />
            <path d="M 200 240 Q 250 170 300 240" stroke="#560806" strokeWidth="0.7" fill="none" opacity="0.4" />
            <circle cx="250" cy="180" r="5" stroke="#560806" strokeWidth="0.8" fill="none" opacity="0.5" />
            <line x1="250" y1="145" x2="250" y2="175" stroke="#560806" strokeWidth="0.8" opacity="0.5" />
            {/* Arches */}
            <path d="M 195 480 L 195 320 Q 195 300 215 300 Q 235 300 235 320 L 235 480" stroke="#560806" strokeWidth="0.9" fill="none" opacity="0.5" />
            <path d="M 265 480 L 265 320 Q 265 300 285 300 Q 305 300 305 320 L 305 480" stroke="#560806" strokeWidth="0.9" fill="none" opacity="0.5" />
            {/* Door */}
            <path d="M 230 480 L 230 380 Q 230 360 250 360 Q 270 360 270 380 L 270 480" stroke="#560806" strokeWidth="1" fill="none" opacity="0.6" />
            {/* Decorative line */}
            <line x1="180" y1="280" x2="320" y2="280" stroke="#560806" strokeWidth="0.6" opacity="0.4" />

            {/* Right tower building */}
            <rect x="340" y="180" width="140" height="300" stroke="#560806" strokeWidth="1" fill="none" opacity="0.5" />
            <rect x="370" y="140" width="80" height="40" stroke="#560806" strokeWidth="0.8" fill="none" opacity="0.4" />
            {/* Windows */}
            {[0, 1, 2].map((row) =>
              [0, 1, 2].map((col) => (
                <rect
                  key={`w-${row}-${col}`}
                  x={360 + col * 35}
                  y={220 + row * 70}
                  width="20"
                  height="40"
                  stroke="#560806"
                  strokeWidth="0.5"
                  fill="none"
                  opacity="0.35"
                />
              ))
            )}
            {/* Flag pole */}
            <line x1="410" y1="140" x2="410" y2="110" stroke="#560806" strokeWidth="0.6" opacity="0.4" />
            <polygon points="410,110 430,115 410,120" stroke="#560806" strokeWidth="0.5" fill="none" opacity="0.4" />

            {/* Mountains in background */}
            <polyline points="0,200 80,120 160,180 220,100 300,170 380,90 460,160 500,130" stroke="#560806" strokeWidth="0.6" fill="none" opacity="0.2" />

            {/* Cypress trees */}
            <ellipse cx="170" cy="450" rx="6" ry="30" stroke="#560806" strokeWidth="0.6" fill="none" opacity="0.35" />
            <ellipse cx="335" cy="450" rx="6" ry="30" stroke="#560806" strokeWidth="0.6" fill="none" opacity="0.35" />

            {/* Sun */}
            <circle cx="250" cy="70" r="25" stroke="#560806" strokeWidth="0.6" fill="none" opacity="0.3" />
            {[...Array(12)].map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              const x1 = 250 + Math.cos(angle) * 32;
              const y1 = 70 + Math.sin(angle) * 32;
              const x2 = 250 + Math.cos(angle) * 42;
              const y2 = 70 + Math.sin(angle) * 42;
              return (
                <line
                  key={`ray-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#560806"
                  strokeWidth="0.5"
                  opacity="0.25"
                />
              );
            })}
          </svg>

          {/* Est. 1994 label */}
          <div
            style={{
              position: 'absolute',
              bottom: '-1rem',
              right: '1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '0.3rem',
              fontFamily: "'Cormorant Garamond', serif",
              color: '#560806',
            }}
          >
            <span
              style={{
                fontSize: '0.7rem',
                letterSpacing: '0.4em',
                fontFamily: 'Lato, sans-serif',
                fontWeight: 300,
                opacity: 0.5,
                textTransform: 'uppercase',
              }}
            >
              Established
            </span>
            <span
              style={{
                fontSize: '2.5rem',
                fontWeight: 400,
                letterSpacing: '0.15em',
              }}
            >
              1994
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ItalianHeritage;
