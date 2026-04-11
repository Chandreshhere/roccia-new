import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { target: 30, suffix: '+', label: 'Years of Mastery', italian: 'Anni' },
  { target: 500, suffix: '+', label: 'Bespoke Commissions', italian: 'Opere' },
  { target: 12, suffix: '', label: 'Countries Served', italian: 'Paesi' },
  { target: 100, suffix: '%', label: 'Bespoke', italian: 'Su Misura' },
];

const StatsMarquee: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const numberRefs = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      numberRefs.current.forEach((el, i) => {
        if (!el) return;
        const target = stats[i].target;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2.2,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = String(Math.round(obj.val));
          },
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        });
      });

      gsap.from(sectionRef.current?.querySelectorAll('.stats-col') ?? [], {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        background: '#560806',
        padding: '10rem 4rem',
        overflow: 'hidden',
        zIndex: 25,
      }}
    >
      {/* Top marquee */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          borderBottom: '1px solid rgba(220,209,191,0.1)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '3rem',
            whiteSpace: 'nowrap',
            animation: 'marquee 40s linear infinite',
          }}
        >
          {[...Array(8)].map((_, i) => (
            <React.Fragment key={i}>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1rem',
                  fontStyle: 'italic',
                  color: 'rgba(220,209,191,0.4)',
                  letterSpacing: '0.15em',
                }}
              >
                House of Roccia
              </span>
              <span
                style={{
                  color: 'rgba(201,169,110,0.5)',
                  fontSize: '0.5rem',
                  alignSelf: 'center',
                }}
              >
                ◆
              </span>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1rem',
                  fontStyle: 'italic',
                  color: 'rgba(220,209,191,0.4)',
                  letterSpacing: '0.15em',
                }}
              >
                Italy's Finest to Your Doorstep
              </span>
              <span
                style={{
                  color: 'rgba(201,169,110,0.5)',
                  fontSize: '0.5rem',
                  alignSelf: 'center',
                }}
              >
                ◆
              </span>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1rem',
                  fontStyle: 'italic',
                  color: 'rgba(220,209,191,0.4)',
                  letterSpacing: '0.15em',
                }}
              >
                Marble Decor &amp; Artistry
              </span>
              <span
                style={{
                  color: 'rgba(201,169,110,0.5)',
                  fontSize: '0.5rem',
                  alignSelf: 'center',
                }}
              >
                ◆
              </span>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1rem',
                  fontStyle: 'italic',
                  color: 'rgba(220,209,191,0.4)',
                  letterSpacing: '0.15em',
                }}
              >
                Est. 1994
              </span>
              <span
                style={{
                  color: 'rgba(201,169,110,0.5)',
                  fontSize: '0.5rem',
                  alignSelf: 'center',
                }}
              >
                ◆
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Header */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '6rem auto 6rem',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'Lato, sans-serif',
            fontSize: '0.65rem',
            fontWeight: 300,
            letterSpacing: '0.5em',
            textTransform: 'uppercase',
            color: 'rgba(220,209,191,0.5)',
            marginBottom: '1.5rem',
          }}
        >
          Three Decades of Craft
        </p>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2.5rem, 5vw, 5.5rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: '#f2f1ea',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
          }}
        >
          A legacy measured
          <br />
          in mastery, not time.
        </h2>
      </div>

      {/* Stats grid */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0',
        }}
      >
        {stats.map((stat, i) => (
          <div
            key={i}
            className="stats-col"
            style={{
              padding: '3rem 2rem',
              textAlign: 'center',
              borderLeft: i === 0 ? 'none' : '1px solid rgba(220,209,191,0.12)',
            }}
          >
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '0.85rem',
                fontStyle: 'italic',
                color: 'rgba(201,169,110,0.6)',
                letterSpacing: '0.15em',
                marginBottom: '1rem',
              }}
            >
              {stat.italian}
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(4rem, 7vw, 8rem)',
                fontWeight: 400,
                color: '#f2f1ea',
                lineHeight: 1,
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'baseline',
              }}
            >
              <span
                ref={(el) => {
                  if (el) numberRefs.current[i] = el;
                }}
              >
                0
              </span>
              <span style={{ color: 'rgba(201,169,110,0.8)', marginLeft: '0.15em' }}>
                {stat.suffix}
              </span>
            </div>
            <div
              style={{
                width: '30px',
                height: '1px',
                background: 'rgba(220,209,191,0.3)',
                margin: '0 auto 1rem',
              }}
            />
            <p
              style={{
                fontFamily: 'Lato, sans-serif',
                fontSize: '0.65rem',
                fontWeight: 300,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'rgba(220,209,191,0.55)',
              }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom marquee */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          borderTop: '1px solid rgba(220,209,191,0.1)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '3rem',
            whiteSpace: 'nowrap',
            animation: 'marquee-reverse 45s linear infinite',
          }}
        >
          {[...Array(8)].map((_, i) => (
            <React.Fragment key={i}>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1rem',
                  fontStyle: 'italic',
                  color: 'rgba(220,209,191,0.4)',
                  letterSpacing: '0.15em',
                }}
              >
                Casa
              </span>
              <span style={{ color: 'rgba(201,169,110,0.5)', fontSize: '0.5rem', alignSelf: 'center' }}>◆</span>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1rem',
                  fontStyle: 'italic',
                  color: 'rgba(220,209,191,0.4)',
                  letterSpacing: '0.15em',
                }}
              >
                Bagno
              </span>
              <span style={{ color: 'rgba(201,169,110,0.5)', fontSize: '0.5rem', alignSelf: 'center' }}>◆</span>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1rem',
                  fontStyle: 'italic',
                  color: 'rgba(220,209,191,0.4)',
                  letterSpacing: '0.15em',
                }}
              >
                Luce
              </span>
              <span style={{ color: 'rgba(201,169,110,0.5)', fontSize: '0.5rem', alignSelf: 'center' }}>◆</span>
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1rem',
                  fontStyle: 'italic',
                  color: 'rgba(220,209,191,0.4)',
                  letterSpacing: '0.15em',
                }}
              >
                Su Misura
              </span>
              <span style={{ color: 'rgba(201,169,110,0.5)', fontSize: '0.5rem', alignSelf: 'center' }}>◆</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
};

export default StatsMarquee;
