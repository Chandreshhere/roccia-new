import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const values = [
  {
    num: '01',
    title: 'Artistry',
    italian: "L'Arte",
    body: 'At the heart of our brand lies Artistry — the pursuit of beauty in every detail. Each sculpture and surface reflects our devotion to craft and creative vision.',
  },
  {
    num: '02',
    title: 'Innovation',
    italian: "L'Innovazione",
    body: 'Pioneering advanced 3D design and digital masonry techniques, the brand blends technology with craftsmanship to redefine modern luxury.',
  },
  {
    num: '03',
    title: 'Heritage',
    italian: "L'Eredità",
    body: 'Rooted in Italian design philosophy and timeless craftsmanship, the brand honours centuries-old traditions while adapting them to contemporary aesthetics.',
  },
  {
    num: '04',
    title: 'Integrity',
    italian: "L'Integrità",
    body: 'Commitment to authenticity, transparency, and uncompromised quality at every stage — from raw material to finished masterpiece.',
  },
  {
    num: '05',
    title: 'Excellence',
    italian: "L'Eccellenza",
    body: "Precision, perfection, and passion define the brand's approach to design, execution, and client experience.",
  },
];

const FivePillars: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveal
      gsap.from('.pillar-header', {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });

      // Pillar cards — each reveals on scroll
      const cards = containerRef.current?.querySelectorAll('.pillar-card');
      if (cards) {
        cards.forEach((el, i) => {
          gsap.from(el, {
            opacity: 0,
            y: 80,
            duration: 1,
            ease: 'power3.out',
            delay: i * 0.08,
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
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
        background: '#171717',
        overflow: 'hidden',
        zIndex: 24,
      }}
    >
      {/* Decorative background text */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(14rem, 32vw, 40rem)',
          fontWeight: 300,
          color: 'rgba(242,241,234,0.02)',
          pointerEvents: 'none',
          userSelect: 'none',
          letterSpacing: '0.15em',
          whiteSpace: 'nowrap',
          fontStyle: 'italic',
          lineHeight: 0.8,
        }}
      >
        Valori
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
          <p
            className="pillar-header"
            style={{
              fontFamily: 'Lato, sans-serif',
              fontSize: '0.65rem',
              fontWeight: 300,
              letterSpacing: '0.5em',
              textTransform: 'uppercase',
              color: 'rgba(201,169,110,0.7)',
              marginBottom: '1.5rem',
            }}
          >
            What We Stand For
          </p>
          <h2
            className="pillar-header"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(3rem, 6vw, 6.5rem)',
              fontWeight: 400,
              color: '#f2f1ea',
              lineHeight: 1,
              letterSpacing: '-0.01em',
            }}
          >
            Five <em style={{ fontWeight: 300 }}>Pillars</em>
          </h2>
          <div
            className="pillar-header"
            style={{
              width: '80px',
              height: '1px',
              background: 'rgba(201,169,110,0.4)',
              margin: '2.5rem auto 0',
            }}
          />
        </div>

        {/* Pillar cards */}
        <div
          ref={containerRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0',
          }}
        >
          {values.map((v, i) => (
            <div
              key={v.num}
              className="pillar-card"
              style={{
                padding: '3rem 0',
                borderBottom: '1px solid rgba(220,209,191,0.1)',
                display: 'grid',
                gridTemplateColumns: '120px 1fr 2fr 60px',
                gap: '3rem',
                alignItems: 'start',
                cursor: 'none',
                transition: 'padding 0.5s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.padding = '3.5rem 0';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.padding = '3rem 0';
              }}
            >
              {/* Number */}
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '2rem',
                  fontWeight: 300,
                  color: 'rgba(201,169,110,0.8)',
                  fontStyle: 'italic',
                  letterSpacing: '0.05em',
                }}
              >
                {v.num}
              </div>

              {/* Title */}
              <div>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '0.85rem',
                    fontStyle: 'italic',
                    color: 'rgba(201,169,110,0.6)',
                    letterSpacing: '0.1em',
                    marginBottom: '0.5rem',
                  }}
                >
                  {v.italian}
                </p>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 'clamp(2rem, 3.5vw, 3.5rem)',
                    fontWeight: 400,
                    color: '#f2f1ea',
                    lineHeight: 1,
                    letterSpacing: '-0.005em',
                  }}
                >
                  {v.title}
                </h3>
              </div>

              {/* Body */}
              <p
                style={{
                  fontFamily: 'Lato, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 300,
                  lineHeight: 1.9,
                  color: 'rgba(242,241,234,0.55)',
                  maxWidth: '56ch',
                  paddingTop: '0.5rem',
                }}
              >
                {v.body}
              </p>

              {/* Arrow */}
              <div
                style={{
                  fontSize: '1.2rem',
                  color: 'rgba(201,169,110,0.5)',
                  textAlign: 'right',
                  paddingTop: '0.5rem',
                }}
              >
                →
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FivePillars;
