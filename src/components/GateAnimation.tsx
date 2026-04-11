import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── Ornamental Door Panel SVG (one half) ── */
const DoorHalfSVG: React.FC<{ side: 'left' | 'right' }> = ({ side }) => {
  const flip = side === 'right';
  const s = flip ? -1 : 1;
  const ox = flip ? 200 : 0; // origin offset for flip

  return (
    <svg
      viewBox="0 0 200 600"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        transform: flip ? 'scaleX(-1)' : 'none',
      }}
    >
      {/* Door background fill */}
      <rect x="0" y="0" width="200" height="600" fill="#3d0504" />

      {/* Vertical ornament line at split edge */}
      <line x1="198" y1="0" x2="198" y2="600" stroke="#c9a96e" strokeWidth="1.5" opacity="0.6" />
      <line x1="193" y1="0" x2="193" y2="600" stroke="#c9a96e" strokeWidth="0.5" opacity="0.3" />

      {/* Horizontal borders */}
      <line x1="0" y1="2" x2="200" y2="2" stroke="#c9a96e" strokeWidth="1" opacity="0.4" />
      <line x1="0" y1="598" x2="200" y2="598" stroke="#c9a96e" strokeWidth="1" opacity="0.4" />

      {/* ── Upper lattice panel ── */}
      {/* Outer frame */}
      <rect x="15" y="40" width="170" height="220" stroke="#c9a96e" strokeWidth="1.5" fill="none" opacity="0.8" />
      {/* Inner frame */}
      <rect x="22" y="47" width="156" height="206" stroke="#c9a96e" strokeWidth="0.8" fill="none" opacity="0.5" />

      {/* Lattice grid - 4x5 */}
      {[0, 1, 2, 3].map((col) =>
        [0, 1, 2, 3, 4].map((row) => {
          const x = 22 + col * 39;
          const y = 47 + row * 41.2;
          return (
            <g key={`${col}-${row}`}>
              <rect
                x={x + 4}
                y={y + 4}
                width={31}
                height={33}
                stroke="#c9a96e"
                strokeWidth="0.6"
                fill="none"
                opacity="0.5"
              />
              {/* Diamond inside each cell */}
              <path
                d={`M${x + 19.5},${y + 6} L${x + 33},${y + 20.5} L${x + 19.5},${y + 35} L${x + 6},${y + 20.5} Z`}
                stroke="#c9a96e"
                strokeWidth="0.4"
                fill="none"
                opacity="0.25"
              />
              {/* Center dot */}
              <circle cx={x + 19.5} cy={y + 20.5} r="1.5" fill="#c9a96e" opacity="0.2" />
            </g>
          );
        })
      )}

      {/* ── Middle panel ── */}
      <rect x="15" y="275" width="170" height="12" fill="#2a0403" stroke="#c9a96e" strokeWidth="0.8" opacity="0.5" />

      {/* ── Lower solid panel ── */}
      <rect x="15" y="295" width="170" height="160" stroke="#c9a96e" strokeWidth="1.5" fill="none" opacity="0.8" />
      <rect x="22" y="302" width="156" height="146" stroke="#c9a96e" strokeWidth="0.8" fill="none" opacity="0.5" />

      {/* Raised panel lines */}
      <rect x="30" y="310" width="140" height="130" stroke="#c9a96e" strokeWidth="0.5" fill="none" opacity="0.3" />
      <rect x="40" y="320" width="120" height="110" stroke="#c9a96e" strokeWidth="0.4" fill="none" opacity="0.2" />

      {/* Horizontal accent in lower panel */}
      <line x1="22" y1="375" x2="178" y2="375" stroke="#c9a96e" strokeWidth="0.6" opacity="0.3" />

      {/* ── Letterbox / mail slot ── */}
      <rect x="55" y="460" width="90" height="18" rx="2" stroke="#c9a96e" strokeWidth="1" fill="#1a0202" opacity="0.8" />
      <line x1="55" y1="469" x2="145" y2="469" stroke="#c9a96e" strokeWidth="0.4" opacity="0.4" />

      {/* ── Door knob ── */}
      <circle cx="188" cy="310" r="8" stroke="#c9a96e" strokeWidth="1.2" fill="#2a0403" opacity="0.9" />
      <circle cx="188" cy="310" r="4" fill="#c9a96e" opacity="0.7" />
      <circle cx="188" cy="310" r="2" fill="#dcd1bf" opacity="0.9" />

      {/* ── Bottom step ── */}
      <rect x="0" y="555" width="200" height="45" fill="#2a0403" opacity="0.5" />
      <line x1="0" y1="555" x2="200" y2="555" stroke="#c9a96e" strokeWidth="1" opacity="0.5" />

      {/* ── Gold ornament at bottom ── */}
      <path
        d="M80 570 Q100 565 120 570"
        stroke="#c9a96e"
        strokeWidth="0.8"
        fill="none"
        opacity="0.4"
      />
      <circle cx="100" cy="567" r="2" fill="#c9a96e" opacity="0.5" />
    </svg>
  );
};

/* ── Arch Top ── */
const ArchTop: React.FC = () => (
  <svg
    viewBox="0 0 400 120"
    style={{
      position: 'absolute',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '600px',
      pointerEvents: 'none',
      zIndex: 20,
    }}
  >
    {/* Arch fill */}
    <path d="M0 120 L0 60 Q200 0 400 60 L400 120 Z" fill="#3d0504" />
    {/* Arch border */}
    <path d="M20 120 Q200 10 380 120" stroke="#c9a96e" strokeWidth="1.5" fill="none" opacity="0.7" />
    {/* Sunburst */}
    {[...Array(9)].map((_, i) => {
      const angle = (i / 8) * Math.PI;
      const x1 = 200 + Math.cos(Math.PI - angle) * 20;
      const y1 = 85 + Math.sin(Math.PI - angle) * 20;
      const x2 = 200 + Math.cos(Math.PI - angle) * 50;
      const y2 = 85 + Math.sin(Math.PI - angle) * 50;
      return (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#c9a96e"
          strokeWidth="0.8"
          opacity="0.5"
        />
      );
    })}
    {/* Center arch circle */}
    <circle cx="200" cy="85" r="12" stroke="#c9a96e" strokeWidth="1" fill="none" opacity="0.6" />
    <circle cx="200" cy="85" r="4" fill="#c9a96e" opacity="0.5" />
    {/* EST 1994 text */}
    <text
      x="140"
      y="105"
      fontFamily="Lato, sans-serif"
      fontSize="10"
      fill="#c9a96e"
      opacity="0.6"
      letterSpacing="2"
    >
      EST.
    </text>
    <text
      x="235"
      y="105"
      fontFamily="Lato, sans-serif"
      fontSize="10"
      fill="#c9a96e"
      opacity="0.6"
      letterSpacing="2"
    >
      1994
    </text>
  </svg>
);

const GateAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const archRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initially hide what's behind
      gsap.set(revealRef.current, { opacity: 0 });
      gsap.set(labelRef.current, { opacity: 0, y: 20 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
        },
      });

      // Gate opens
      tl.to(
        leftPanelRef.current,
        { x: '-100%', ease: 'power2.inOut', duration: 1 },
        0
      )
        .to(
          rightPanelRef.current,
          { x: '100%', ease: 'power2.inOut', duration: 1 },
          0
        )
        .to(
          archRef.current,
          { y: '-110%', ease: 'power2.inOut', duration: 0.8 },
          0.1
        )
        // Reveal behind-gate content
        .to(
          revealRef.current,
          { opacity: 1, duration: 0.5 },
          0.4
        )
        // Label fades in
        .to(
          labelRef.current,
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          0.6
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="gate-section" id="gate">
      {/* What's revealed inside gate */}
      <div ref={revealRef} className="gate-reveal">
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.45) saturate(0.8)',
          }}
        >
          <source src="/assets/kling-video.mp4" type="video/mp4" />
        </video>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(23,23,23,0.8) 0%, rgba(23,23,23,0.2) 60%, transparent 100%)',
          }}
        />
        <div
          ref={labelRef}
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            zIndex: 10,
          }}
        >
          <p
            style={{
              fontFamily: 'Lato, sans-serif',
              fontSize: '0.6rem',
              fontWeight: 300,
              letterSpacing: '0.5em',
              textTransform: 'uppercase',
              color: 'rgba(201,169,110,0.8)',
              marginBottom: '1rem',
            }}
          >
            Enter the World of
          </p>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(3rem, 7vw, 8rem)',
              fontWeight: 400,
              letterSpacing: '0.25em',
              color: '#f2f1ea',
              textTransform: 'uppercase',
              lineHeight: 1,
            }}
          >
            Roccia
          </h2>
        </div>
      </div>

      {/* Gate wrapper */}
      <div className="gate-wrapper">
        {/* Left door panel */}
        <div
          ref={leftPanelRef}
          className="gate-panel gate-panel--left"
        >
          <DoorHalfSVG side="left" />
        </div>

        {/* Right door panel */}
        <div
          ref={rightPanelRef}
          className="gate-panel gate-panel--right"
        >
          <DoorHalfSVG side="right" />
        </div>

        {/* Arch top */}
        <div
          ref={archRef}
          className="gate-center-arch"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 30,
            pointerEvents: 'none',
          }}
        >
          <ArchTop />
        </div>
      </div>
    </div>
  );
};

export default GateAnimation;
