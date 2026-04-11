import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FinalCTA: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = headlineRef.current?.querySelectorAll('.cta-word');
      if (words) {
        gsap.fromTo(
          words,
          { y: '110%' },
          {
            y: '0%',
            duration: 1.4,
            ease: 'power3.out',
            stagger: 0.08,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
            },
          }
        );
      }

      gsap.from('.cta-label, .cta-sub, .cta-btn, .cta-contact', {
        opacity: 0,
        y: 30,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const words = ['Italy\u2019s', 'finest', 'to', 'your', 'doorstep.'];

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: '#f2f1ea',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '14rem 4rem',
        overflow: 'hidden',
        zIndex: 26,
      }}
    >
      {/* Background decoration - arches SVG */}
      <svg
        aria-hidden
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '120%',
          height: '120%',
          opacity: 0.05,
          pointerEvents: 'none',
        }}
        viewBox="0 0 1200 800"
        fill="none"
      >
        {[0, 1, 2, 3, 4].map((i) => {
          const x = 150 + i * 240;
          return (
            <g key={i}>
              <path
                d={`M ${x - 60} 600 L ${x - 60} 300 Q ${x - 60} 200 ${x} 200 Q ${x + 60} 200 ${x + 60} 300 L ${x + 60} 600`}
                stroke="#560806"
                strokeWidth="1.5"
                fill="none"
              />
            </g>
          );
        })}
        <line x1="0" y1="600" x2="1200" y2="600" stroke="#560806" strokeWidth="1" />
      </svg>

      {/* Content */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <p
          className="cta-label"
          style={{
            fontFamily: 'Lato, sans-serif',
            fontSize: '0.65rem',
            fontWeight: 300,
            letterSpacing: '0.55em',
            textTransform: 'uppercase',
            color: '#560806',
            opacity: 0.6,
            marginBottom: '3rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            justifyContent: 'center',
          }}
        >
          <span style={{ width: '40px', height: '1px', background: 'rgba(86,8,6,0.4)' }} />
          An Invitation
          <span style={{ width: '40px', height: '1px', background: 'rgba(86,8,6,0.4)' }} />
        </p>

        <h2
          ref={headlineRef}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(3rem, 8vw, 9rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            lineHeight: 1,
            color: '#560806',
            maxWidth: '14ch',
            margin: '0 auto',
            letterSpacing: '-0.01em',
          }}
        >
          {words.map((word, i) => (
            <span
              key={i}
              style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', marginRight: '0.2em' }}
            >
              <span className="cta-word" style={{ display: 'inline-block', transform: 'translateY(110%)' }}>
                {word}
              </span>
            </span>
          ))}
        </h2>

        <p
          className="cta-sub"
          style={{
            fontFamily: 'Lato, sans-serif',
            fontSize: '0.95rem',
            fontWeight: 300,
            lineHeight: 1.9,
            color: 'rgba(23,23,23,0.6)',
            marginTop: '3rem',
            maxWidth: '58ch',
            marginInline: 'auto',
          }}
        >
          For the discerning architect, the designer of vision, the collector of the eternal —
          Roccia welcomes you to experience marble transformed into living art.
        </p>

        {/* CTA Button */}
        <div className="cta-btn" style={{ marginTop: '4rem' }}>
          <a
            href="#contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1.5rem',
              padding: '1.5rem 3rem',
              border: '1px solid #560806',
              fontFamily: 'Lato, sans-serif',
              fontSize: '0.7rem',
              fontWeight: 300,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              color: '#560806',
              textDecoration: 'none',
              position: 'relative',
              overflow: 'hidden',
              transition: 'color 0.5s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#560806';
              (e.currentTarget as HTMLElement).style.color = '#f2f1ea';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.color = '#560806';
            }}
          >
            Begin Your Commission
            <span style={{ fontSize: '1rem' }}>→</span>
          </a>
        </div>

        {/* Contact info */}
        <div
          className="cta-contact"
          style={{
            marginTop: '6rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '3rem',
            maxWidth: '800px',
            marginInline: 'auto',
            paddingTop: '4rem',
            borderTop: '1px solid rgba(86,8,6,0.15)',
          }}
        >
          {[
            { label: 'Atelier', val: 'Indore, India' },
            { label: 'Enquiries', val: 'hello@roccia.com' },
            { label: 'Visit', val: 'www.roccia.com' },
          ].map((c) => (
            <div key={c.label} style={{ textAlign: 'center' }}>
              <p
                style={{
                  fontFamily: 'Lato, sans-serif',
                  fontSize: '0.55rem',
                  fontWeight: 300,
                  letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                  color: 'rgba(86,8,6,0.45)',
                  marginBottom: '0.5rem',
                }}
              >
                {c.label}
              </p>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.1rem',
                  color: '#560806',
                  letterSpacing: '0.05em',
                }}
              >
                {c.val}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
