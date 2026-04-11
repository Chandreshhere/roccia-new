import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── SVGs matching the brand deck's last page exactly ── */

const CasaSVG: React.FC = () => (
  <svg viewBox="0 0 200 300" fill="none" width="100%" height="100%">
    {/* Stadium/pill frame */}
    <rect x="20" y="20" width="160" height="260" rx="80" ry="80" stroke="#560806" strokeWidth="2.5" fill="none" />
    {/* Top arched awning with radiating rays */}
    <path d="M 50 100 Q 100 50 150 100" stroke="#560806" strokeWidth="1.8" fill="none" />
    {/* Rays under arch */}
    <line x1="100" y1="52" x2="100" y2="100" stroke="#560806" strokeWidth="1.2" />
    <line x1="80" y1="60" x2="85" y2="100" stroke="#560806" strokeWidth="1.2" />
    <line x1="120" y1="60" x2="115" y2="100" stroke="#560806" strokeWidth="1.2" />
    <line x1="65" y1="75" x2="72" y2="100" stroke="#560806" strokeWidth="1.2" />
    <line x1="135" y1="75" x2="128" y2="100" stroke="#560806" strokeWidth="1.2" />
    {/* House outline — triangle roof + square body */}
    <path d="M 60 165 L 100 115 L 140 165" stroke="#560806" strokeWidth="2" fill="none" />
    <line x1="60" y1="165" x2="60" y2="215" stroke="#560806" strokeWidth="2" />
    <line x1="140" y1="165" x2="140" y2="215" stroke="#560806" strokeWidth="2" />
    {/* Roof extended lines past the house edges */}
    <line x1="50" y1="165" x2="60" y2="165" stroke="#560806" strokeWidth="1.5" />
    <line x1="140" y1="165" x2="150" y2="165" stroke="#560806" strokeWidth="1.5" />
    {/* Arched doorway */}
    <path d="M 85 215 L 85 180 Q 85 170 100 170 Q 115 170 115 180 L 115 215" stroke="#560806" strokeWidth="1.8" fill="none" />
    {/* Rolling hill waves */}
    <path d="M 30 225 Q 65 210 100 225 T 170 225" stroke="#560806" strokeWidth="1.5" fill="none" />
    <path d="M 30 242 Q 65 228 100 242 T 170 242" stroke="#560806" strokeWidth="1.3" fill="none" />
    <path d="M 30 260 Q 65 247 100 260 T 170 260" stroke="#560806" strokeWidth="1.1" fill="none" />
  </svg>
);

const BagnoSVG: React.FC = () => (
  <svg viewBox="0 0 200 300" fill="none" width="100%" height="100%">
    {/* Stadium/pill frame */}
    <rect x="20" y="20" width="160" height="260" rx="80" ry="80" stroke="#560806" strokeWidth="2.5" fill="none" />
    {/* Left pointed arch */}
    <path d="M 55 210 L 55 115 Q 55 60 100 60" stroke="#560806" strokeWidth="2" fill="none" />
    {/* Right pointed arch */}
    <path d="M 145 210 L 145 115 Q 145 60 100 60" stroke="#560806" strokeWidth="2" fill="none" />
    {/* Central column from peak down */}
    <line x1="100" y1="60" x2="100" y2="210" stroke="#560806" strokeWidth="2" />
    {/* Diagonal slash through arches */}
    <line x1="55" y1="170" x2="145" y2="145" stroke="#560806" strokeWidth="1.8" />
    {/* Curved element (water stream) on lower right */}
    <path d="M 100 210 Q 125 190 145 210" stroke="#560806" strokeWidth="1.8" fill="none" />
    {/* Stripe pattern on lower left */}
    <line x1="55" y1="210" x2="100" y2="210" stroke="#560806" strokeWidth="1.8" />
    <line x1="60" y1="225" x2="95" y2="225" stroke="#560806" strokeWidth="1.2" />
    <line x1="65" y1="240" x2="90" y2="240" stroke="#560806" strokeWidth="1.2" />
    <line x1="70" y1="255" x2="85" y2="255" stroke="#560806" strokeWidth="1.2" />
  </svg>
);

const LuceSVG: React.FC = () => (
  <svg viewBox="0 0 200 300" fill="none" width="100%" height="100%">
    {/* Stadium/pill frame */}
    <rect x="20" y="20" width="160" height="260" rx="80" ry="80" stroke="#560806" strokeWidth="2.5" fill="none" />
    {/* Sun circle top-right */}
    <circle cx="135" cy="100" r="14" stroke="#560806" strokeWidth="1.8" fill="none" />
    {/* Sun rays */}
    {[...Array(12)].map((_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const x1 = 135 + Math.cos(angle) * 18;
      const y1 = 100 + Math.sin(angle) * 18;
      const x2 = 135 + Math.cos(angle) * 30;
      const y2 = 100 + Math.sin(angle) * 30;
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#560806" strokeWidth="1.3" />;
    })}
    {/* Mountain peak */}
    <path d="M 50 200 L 95 125 L 130 170 L 150 150 L 170 200" stroke="#560806" strokeWidth="2" fill="none" />
    {/* Terraced curves at base */}
    <path d="M 30 240 Q 100 215 170 240" stroke="#560806" strokeWidth="1.5" fill="none" />
    <path d="M 35 255 Q 100 232 165 255" stroke="#560806" strokeWidth="1.3" fill="none" />
  </svg>
);

const items = [
  { id: '01', title: 'Casa', Svg: CasaSVG },
  { id: '02', title: 'Bagno', Svg: BagnoSVG },
  { id: '03', title: 'Luce', Svg: LuceSVG },
];

const CircleCollections: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const circleWrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const circleWrap = circleWrapRef.current;
    const track = trackRef.current;
    if (!section || !circleWrap || !track) return;

    // Set initial state — small circle
    gsap.set(circleWrap, { scale: 0.08 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=500%',
        pin: true,
        pinSpacing: true,
        scrub: 1.2,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;

          // Phase 1 (0 → 0.3): Circle scales from 0.08 to 4
          if (p <= 0.3) {
            const circleP = p / 0.3;
            const eased = 1 - Math.pow(1 - circleP, 2); // easeOut
            const scale = 0.08 + eased * 3.92; // 0.08 → 4
            gsap.set(circleWrap, { scale });
            gsap.set(track, { x: 0 });

            if (labelRef.current) {
              labelRef.current.style.opacity = String(1 - eased);
            }
          } else {
            // Phase 2 (0.3 → 1): horizontal scroll
            gsap.set(circleWrap, { scale: 4 });
            if (labelRef.current) labelRef.current.style.opacity = '0';

            const hP = (p - 0.3) / 0.7;
            const totalW = track.scrollWidth;
            const vw = window.innerWidth;
            const maxScroll = Math.max(totalW - vw, 0);
            gsap.set(track, { x: -hP * maxScroll });
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
        height: '100vh',
        overflow: 'hidden',
        background: '#560806',
        zIndex: 22,
      }}
    >
      {/* Initial label — centered behind circle */}
      <div
        ref={labelRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <p
          style={{
            fontFamily: 'Lato, sans-serif',
            fontSize: '0.6rem',
            fontWeight: 300,
            letterSpacing: '0.55em',
            textTransform: 'uppercase',
            color: 'rgba(220,209,191,0.5)',
            marginBottom: '1.5rem',
          }}
        >
          House of Roccia
        </p>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2rem, 4.5vw, 4rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: '#dcd1bf',
            letterSpacing: '0.02em',
            marginBottom: '1.5rem',
          }}
        >
          Italy's finest to your doorstep.
        </h2>
        <p
          style={{
            fontFamily: 'Lato, sans-serif',
            fontSize: '0.55rem',
            fontWeight: 300,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            color: 'rgba(220,209,191,0.3)',
          }}
        >
          Scroll to Reveal
        </p>
      </div>

      {/* Expanding circle — uses scale transform */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          ref={circleWrapRef}
          style={{
            width: '100vh',
            height: '100vh',
            borderRadius: '50%',
            background: '#dcd1bf',
            overflow: 'hidden',
            willChange: 'transform',
            transformOrigin: 'center center',
          }}
        >
          {/* Horizontal scroll track inside circle */}
          <div
            ref={trackRef}
            style={{
              display: 'flex',
              height: '100%',
              willChange: 'transform',
            }}
          >
            {/* Intro panel */}
            <div
              style={{
                flexShrink: 0,
                width: '100vh',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4rem',
              }}
            >
              <svg width="50" height="62" viewBox="0 0 80 100" fill="none" style={{ marginBottom: '1.5rem' }}>
                <path d="M18 38 Q18 10 40 10 Q62 10 62 38" stroke="#560806" strokeWidth="1.8" fill="none" />
                <rect x="18" y="38" width="20" height="50" stroke="#560806" strokeWidth="1.8" fill="none" />
                <rect x="42" y="38" width="20" height="50" stroke="#560806" strokeWidth="1.8" fill="none" />
              </svg>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1.5rem',
                  fontWeight: 400,
                  color: '#560806',
                  letterSpacing: '0.08em',
                  marginBottom: '0.3rem',
                }}
              >
                House of Roccia
              </p>
              <p
                style={{
                  fontFamily: 'Lato, sans-serif',
                  fontSize: '0.55rem',
                  fontWeight: 300,
                  letterSpacing: '0.45em',
                  textTransform: 'uppercase',
                  color: 'rgba(86,8,6,0.55)',
                }}
              >
                Marble Decor &amp; Artistry
              </p>
            </div>

            {/* Casa / Bagno / Luce panels */}
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  flexShrink: 0,
                  width: '100vh',
                  height: '100vh',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '6rem 4rem',
                }}
              >
                <div
                  style={{
                    width: 'clamp(160px, 22vh, 240px)',
                    aspectRatio: '2/3',
                    marginBottom: '2.5rem',
                  }}
                >
                  <item.Svg />
                </div>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 'clamp(3rem, 6vh, 5rem)',
                    fontWeight: 400,
                    color: '#560806',
                    letterSpacing: '0.02em',
                    lineHeight: 1,
                  }}
                >
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircleCollections;
