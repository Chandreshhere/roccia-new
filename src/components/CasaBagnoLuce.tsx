import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════
   Three collections from the brand deck's final page:
   Casa · Bagno · Luce
   Each has an oval-framed SVG drawing that renders on scroll
   Large text with image clipped inside + zoom
   ═══════════════════════════════════════════════════════ */

const items = [
  {
    id: 'casa',
    title: 'Casa',
    label: 'I — The Home',
    italian: 'La Casa',
    desc: 'Living spaces transformed — statement floors, architectural walls, sculpted furniture. The home reimagined in marble.',
    img: '/assets/1.jpeg',
  },
  {
    id: 'bagno',
    title: 'Bagno',
    label: 'II — The Sanctuary',
    italian: 'Il Bagno',
    desc: 'The bathroom as a private world of cool luxury — vanities, tubs, mosaics. Where stone becomes serenity.',
    img: '/assets/4.jpeg',
  },
  {
    id: 'luce',
    title: 'Luce',
    label: 'III — The Sculpture',
    italian: 'La Luce',
    desc: 'Standalone sculptures and carved luminaries. Stone shaped to hold light — the most evocative expressions of form.',
    img: '/assets/8.jpeg',
  },
];

/* ── Oval-framed SVG for each item (drawn on scroll) ── */
const CasaSVG: React.FC<{ color?: string }> = ({ color = '#560806' }) => (
  <svg viewBox="0 0 200 300" fill="none" width="100%" height="100%">
    {/* Outer oval frame */}
    <ellipse cx="100" cy="150" rx="80" ry="130" stroke={color} strokeWidth="2" fill="none" />
    {/* Inner oval */}
    <ellipse cx="100" cy="150" rx="74" ry="124" stroke={color} strokeWidth="0.8" fill="none" opacity="0.5" />
    {/* Arch over house */}
    <path d="M 55 145 Q 100 80 145 145" stroke={color} strokeWidth="1.2" fill="none" />
    {/* House body */}
    <rect x="70" y="145" width="60" height="60" stroke={color} strokeWidth="1.2" fill="none" />
    {/* Door */}
    <path d="M 88 205 L 88 170 Q 88 160 100 160 Q 112 160 112 170 L 112 205" stroke={color} strokeWidth="1" fill="none" />
    {/* Roof */}
    <polyline points="65,145 100,115 135,145" stroke={color} strokeWidth="1.2" fill="none" />
    {/* Chimney */}
    <line x1="118" y1="125" x2="118" y2="108" stroke={color} strokeWidth="1" />
    <line x1="118" y1="108" x2="128" y2="108" stroke={color} strokeWidth="1" />
    <line x1="128" y1="108" x2="128" y2="128" stroke={color} strokeWidth="1" />
    {/* Rolling hills (waves) */}
    <path d="M 30 225 Q 65 210 100 225 Q 135 240 170 225" stroke={color} strokeWidth="1" fill="none" />
    <path d="M 30 240 Q 65 225 100 240 Q 135 255 170 240" stroke={color} strokeWidth="0.8" fill="none" opacity="0.6" />
    <path d="M 30 255 Q 65 240 100 255 Q 135 270 170 255" stroke={color} strokeWidth="0.6" fill="none" opacity="0.4" />
  </svg>
);

const BagnoSVG: React.FC<{ color?: string }> = ({ color = '#560806' }) => (
  <svg viewBox="0 0 200 300" fill="none" width="100%" height="100%">
    {/* Outer oval frame */}
    <ellipse cx="100" cy="150" rx="80" ry="130" stroke={color} strokeWidth="2" fill="none" />
    {/* Inner oval */}
    <ellipse cx="100" cy="150" rx="74" ry="124" stroke={color} strokeWidth="0.8" fill="none" opacity="0.5" />
    {/* Two arches */}
    <path d="M 60 200 L 60 110 Q 60 75 80 75 Q 100 75 100 110 L 100 200" stroke={color} strokeWidth="1.2" fill="none" />
    <path d="M 100 200 L 100 110 Q 100 75 120 75 Q 140 75 140 110 L 140 200" stroke={color} strokeWidth="1.2" fill="none" />
    {/* Central column */}
    <line x1="100" y1="75" x2="100" y2="200" stroke={color} strokeWidth="1" />
    {/* Water lines below */}
    <line x1="30" y1="220" x2="170" y2="220" stroke={color} strokeWidth="1" />
    <line x1="40" y1="232" x2="160" y2="232" stroke={color} strokeWidth="0.8" opacity="0.7" />
    <line x1="50" y1="244" x2="150" y2="244" stroke={color} strokeWidth="0.8" opacity="0.6" />
    <line x1="45" y1="256" x2="155" y2="256" stroke={color} strokeWidth="0.6" opacity="0.5" />
    <line x1="55" y1="268" x2="145" y2="268" stroke={color} strokeWidth="0.6" opacity="0.4" />
    {/* Keystone accents */}
    <circle cx="80" cy="115" r="2" fill={color} />
    <circle cx="120" cy="115" r="2" fill={color} />
  </svg>
);

const LuceSVG: React.FC<{ color?: string }> = ({ color = '#560806' }) => (
  <svg viewBox="0 0 200 300" fill="none" width="100%" height="100%">
    {/* Outer oval frame */}
    <ellipse cx="100" cy="150" rx="80" ry="130" stroke={color} strokeWidth="2" fill="none" />
    {/* Inner oval */}
    <ellipse cx="100" cy="150" rx="74" ry="124" stroke={color} strokeWidth="0.8" fill="none" opacity="0.5" />
    {/* Sun circle */}
    <circle cx="130" cy="110" r="20" stroke={color} strokeWidth="1.2" fill="none" />
    {/* Sun rays */}
    {[...Array(12)].map((_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const x1 = 130 + Math.cos(angle) * 25;
      const y1 = 110 + Math.sin(angle) * 25;
      const x2 = 130 + Math.cos(angle) * 35;
      const y2 = 110 + Math.sin(angle) * 35;
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="0.9" />;
    })}
    {/* Mountain peaks */}
    <polyline points="30,210 70,140 110,200 150,130 170,180 170,210" stroke={color} strokeWidth="1.2" fill="none" />
    {/* Ground lines (terraced) */}
    <path d="M 30 225 Q 100 215 170 225" stroke={color} strokeWidth="0.9" fill="none" />
    <path d="M 30 240 Q 100 230 170 240" stroke={color} strokeWidth="0.8" fill="none" opacity="0.7" />
    <path d="M 30 255 Q 100 245 170 255" stroke={color} strokeWidth="0.6" fill="none" opacity="0.5" />
  </svg>
);

const CasaBagnoLuce: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Header reveal ──
      gsap.from(sectionRef.current?.querySelectorAll('.cbl-header-line') ?? [], {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      });

      // ── Per-row animations ──
      rowRefs.current.forEach((row, index) => {
        if (!row) return;

        // 1. Draw the SVG on scroll (stroke-dash animation)
        const svg = row.querySelector('svg');
        if (svg) {
          const paths = svg.querySelectorAll('path, rect, line, circle, ellipse, polyline, polygon');
          paths.forEach((el) => {
            const p = el as SVGGeometryElement;
            if (p.getTotalLength) {
              try {
                const len = p.getTotalLength();
                gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
              } catch {
                // skip
              }
            }
          });

          gsap.to(paths, {
            strokeDashoffset: 0,
            duration: 2.5,
            ease: 'power2.inOut',
            stagger: 0.02,
            scrollTrigger: {
              trigger: row,
              start: 'top 70%',
              end: 'center center',
              scrub: 1,
            },
          });
        }

        // 2. Text content reveal (label, title, etc.)
        const textEls = row.querySelectorAll('.cbl-text');
        gsap.from(textEls, {
          opacity: 0,
          y: 40,
          duration: 1.2,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: row,
            start: 'top 70%',
          },
        });

        // 3. Image inside big text — zoom effect on scroll
        const bigText = row.querySelector('.cbl-big-text') as HTMLElement | null;
        if (bigText) {
          gsap.fromTo(
            bigText,
            { backgroundSize: '200% auto' },
            {
              backgroundSize: '110% auto',
              ease: 'none',
              scrollTrigger: {
                trigger: row,
                start: 'top 80%',
                end: 'bottom 20%',
                scrub: 1.5,
              },
            }
          );
        }
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
        background: '#f2f1ea',
        padding: '14rem 4rem 10rem',
        overflow: 'hidden',
        zIndex: 21,
      }}
    >
      {/* Decorative background text */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '4rem',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(10rem, 24vw, 28rem)',
          fontStyle: 'italic',
          fontWeight: 300,
          color: 'rgba(86,8,6,0.035)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
          lineHeight: 0.8,
        }}
      >
        Collezioni
      </div>

      {/* Header */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto 10rem',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <p
          className="cbl-header-line"
          style={{
            fontFamily: 'Lato, sans-serif',
            fontSize: '0.65rem',
            fontWeight: 300,
            letterSpacing: '0.55em',
            textTransform: 'uppercase',
            color: '#560806',
            opacity: 0.55,
            marginBottom: '1.5rem',
          }}
        >
          The Three Worlds
        </p>
        <h2
          className="cbl-header-line"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(3rem, 6vw, 6.5rem)',
            fontWeight: 400,
            color: '#560806',
            lineHeight: 1,
            letterSpacing: '-0.01em',
          }}
        >
          Casa · Bagno · <em style={{ fontWeight: 300 }}>Luce</em>
        </h2>
        <div
          className="cbl-header-line"
          style={{
            width: '80px',
            height: '1px',
            background: 'rgba(86,8,6,0.3)',
            margin: '2.5rem auto 0',
          }}
        />
      </div>

      {/* Rows */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '10rem',
        }}
      >
        {items.map((item, i) => {
          const Svg = item.id === 'casa' ? CasaSVG : item.id === 'bagno' ? BagnoSVG : LuceSVG;
          const reverse = i % 2 === 1;

          return (
            <div
              key={item.id}
              ref={(el) => {
                rowRefs.current[i] = el;
              }}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '6rem',
                alignItems: 'center',
                direction: reverse ? 'rtl' : 'ltr',
              }}
            >
              {/* SVG — oval ornament */}
              <div style={{ direction: 'ltr', display: 'flex', justifyContent: 'center' }}>
                <div
                  style={{
                    width: 'clamp(240px, 26vw, 380px)',
                    aspectRatio: '2 / 3',
                  }}
                >
                  <Svg color="#560806" />
                </div>
              </div>

              {/* Content */}
              <div style={{ direction: 'ltr' }}>
                <p
                  className="cbl-text"
                  style={{
                    fontFamily: 'Lato, sans-serif',
                    fontSize: '0.6rem',
                    fontWeight: 300,
                    letterSpacing: '0.5em',
                    textTransform: 'uppercase',
                    color: 'rgba(86,8,6,0.55)',
                    marginBottom: '1rem',
                  }}
                >
                  {item.label}
                </p>

                <p
                  className="cbl-text"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.1rem',
                    fontStyle: 'italic',
                    color: 'rgba(86,8,6,0.5)',
                    letterSpacing: '0.12em',
                    marginBottom: '1rem',
                  }}
                >
                  {item.italian}
                </p>

                {/* Big text with image clipped inside + zoom */}
                <h3
                  className="cbl-big-text cbl-text"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 'clamp(5rem, 12vw, 16rem)',
                    fontWeight: 400,
                    lineHeight: 0.85,
                    letterSpacing: '-0.02em',
                    marginBottom: '2.5rem',
                    color: 'transparent',
                    backgroundImage: `url(${item.img})`,
                    backgroundSize: '200% auto',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    userSelect: 'none',
                    willChange: 'background-size',
                  }}
                >
                  {item.title}
                </h3>

                <div
                  className="cbl-text"
                  style={{
                    width: '50px',
                    height: '1px',
                    background: 'rgba(86,8,6,0.25)',
                    marginBottom: '1.5rem',
                  }}
                />

                <p
                  className="cbl-text"
                  style={{
                    fontFamily: 'Lato, sans-serif',
                    fontSize: '0.9rem',
                    fontWeight: 300,
                    lineHeight: 1.9,
                    color: 'rgba(23,23,23,0.65)',
                    maxWidth: '44ch',
                    marginBottom: '2rem',
                  }}
                >
                  {item.desc}
                </p>

                <a
                  href="#"
                  className="cbl-text"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '1rem',
                    fontFamily: 'Lato, sans-serif',
                    fontSize: '0.65rem',
                    fontWeight: 300,
                    letterSpacing: '0.35em',
                    textTransform: 'uppercase',
                    color: '#560806',
                    textDecoration: 'none',
                  }}
                >
                  <span
                    style={{
                      width: '40px',
                      height: '1px',
                      background: '#560806',
                    }}
                  />
                  Explore {item.title}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CasaBagnoLuce;
