import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useLenis } from './hooks/useLenis';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';

gsap.registerPlugin(ScrollTrigger);

/* ── Page Loader ── */
const PageLoader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const loaderRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const wordmarkRef = useRef<SVGSVGElement>(null);
  const subRef = useRef<SVGSVGElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const loader = loaderRef.current;
    if (!svg || !loader) return;

    // Collect all drawable elements and sort by distance from SVG center
    // so the draw animation radiates outward from the middle.
    const CENTER_X = 130;
    const CENTER_Y = 170;

    const elementCenter = (el: SVGGeometryElement): { x: number; y: number } => {
      const tag = el.tagName.toLowerCase();
      if (tag === 'circle') {
        return {
          x: parseFloat(el.getAttribute('cx') || '0'),
          y: parseFloat(el.getAttribute('cy') || '0'),
        };
      }
      if (tag === 'rect') {
        const x = parseFloat(el.getAttribute('x') || '0');
        const y = parseFloat(el.getAttribute('y') || '0');
        const w = parseFloat(el.getAttribute('width') || '0');
        const h = parseFloat(el.getAttribute('height') || '0');
        return { x: x + w / 2, y: y + h / 2 };
      }
      if (tag === 'line') {
        const x1 = parseFloat(el.getAttribute('x1') || '0');
        const x2 = parseFloat(el.getAttribute('x2') || '0');
        const y1 = parseFloat(el.getAttribute('y1') || '0');
        const y2 = parseFloat(el.getAttribute('y2') || '0');
        return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
      }
      try {
        const bb = el.getBBox();
        return { x: bb.x + bb.width / 2, y: bb.y + bb.height / 2 };
      } catch {
        return { x: CENTER_X, y: CENTER_Y };
      }
    };

    const ranked = Array.from(svg.querySelectorAll('path, rect, line, circle'))
      .map((node) => {
        const el = node as SVGGeometryElement;
        const { x, y } = elementCenter(el);
        return { el, dist: Math.hypot(x - CENTER_X, y - CENTER_Y) };
      })
      .sort((a, b) => a.dist - b.dist);

    const paths = ranked.map(({ el }) => el);

    paths.forEach((pathEl) => {
      if (pathEl.getTotalLength) {
        const len = pathEl.getTotalLength();
        gsap.set(pathEl, {
          strokeDasharray: len,
          strokeDashoffset: len,
          opacity: 1,
        });
      }
    });

    const tl = gsap.timeline();

    // Phase 1: Draw the logo from the center outward
    tl.to(paths, {
      strokeDashoffset: 0,
      duration: 0.9,
      ease: 'power2.inOut',
      stagger: 0.015,
    });

    // Phase 2: Fill in the door knobs
    const circles = svg.querySelectorAll('circle');
    tl.to(circles, {
      fillOpacity: 1,
      duration: 0.25,
      ease: 'power2.out',
    }, '-=0.2');

    // Phase 3: Draw the wordmark text (stroke-dash draw)
    const wordmarkText = wordmarkRef.current?.querySelector('text');
    const subText = subRef.current?.querySelector('text');

    if (wordmarkText) {
      gsap.set(wordmarkText, { strokeDasharray: 2000, strokeDashoffset: 2000 });
      tl.to(wordmarkText, {
        strokeDashoffset: 0,
        duration: 1.1,
        ease: 'power2.inOut',
      }, '-=0.3');

      tl.to(wordmarkText, {
        fill: '#dcd1bf',
        duration: 0.3,
        ease: 'power2.out',
      }, '-=0.15');
    }

    if (subText) {
      gsap.set(subText, { strokeDasharray: 1200, strokeDashoffset: 1200 });
      tl.to(subText, {
        strokeDashoffset: 0,
        duration: 0.8,
        ease: 'power2.inOut',
      }, '-=1');

      tl.to(subText, {
        fill: 'rgba(220, 209, 191, 0.6)',
        duration: 0.25,
        ease: 'power2.out',
      }, '-=0.1');
    }

    // Phase 5: Line expands
    tl.fromTo(
      lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.5, ease: 'power2.inOut' },
      '-=0.2'
    );

    // Phase 6: Exit — slide up
    tl.to(loader, {
      yPercent: -100,
      duration: 0.8,
      ease: 'power3.inOut',
      delay: 0.1,
      onComplete,
    });

    return () => { tl.kill(); };
  }, [onComplete]);

  return (
    <div
      ref={loaderRef}
      className="page-loader"
      style={{
        position: 'fixed',
        inset: 0,
        background: '#560806',
        zIndex: 9997,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
      }}
    >
      {/* SVG Logo — draw animation (ornate arched double-door) */}
      <svg
        ref={svgRef}
        width="200"
        height="260"
        viewBox="0 0 260 340"
        fill="none"
      >
        {/* ── Outer arch ── */}
        <path d="M 22 122 A 108 108 0 0 1 238 122" stroke="#dcd1bf" strokeWidth="2" fill="none" opacity="0" />
        {/* ── Inner arch ── */}
        <path d="M 33 122 A 97 97 0 0 1 227 122" stroke="#dcd1bf" strokeWidth="1.2" fill="none" opacity="0" />

        {/* ── Small circle at top of fan ── */}
        <circle cx="130" cy="42" r="4.5" stroke="#dcd1bf" strokeWidth="1.2" fill="#dcd1bf" fillOpacity="0" opacity="0" />

        {/* ── Sunburst rays ── */}
        {[...Array(15)].map((_, i) => {
          const total = 15;
          const angle = (Math.PI * (i + 0.5)) / total;
          const innerR = 14;
          const outerR = 94;
          const cx = 130;
          const cy = 122;
          const x1 = cx + Math.cos(Math.PI - angle) * innerR;
          const y1 = cy - Math.sin(angle) * innerR;
          const x2 = cx + Math.cos(Math.PI - angle) * outerR;
          const y2 = cy - Math.sin(angle) * outerR;
          return (
            <line
              key={`ray-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#dcd1bf"
              strokeWidth="0.8"
              opacity="0"
            />
          );
        })}

        {/* ── Fan hub arc ── */}
        <path d="M 116 122 A 14 14 0 0 1 144 122" stroke="#dcd1bf" strokeWidth="1" fill="none" opacity="0" />

        {/* ── Horizontal bands below arch ── */}
        <line x1="18" y1="122" x2="242" y2="122" stroke="#dcd1bf" strokeWidth="2" opacity="0" />
        <line x1="18" y1="130" x2="242" y2="130" stroke="#dcd1bf" strokeWidth="1" opacity="0" />

        {/* ── Door outer frames ── */}
        <rect x="22" y="134" width="105" height="188" stroke="#dcd1bf" strokeWidth="2" fill="none" opacity="0" />
        <rect x="133" y="134" width="105" height="188" stroke="#dcd1bf" strokeWidth="2" fill="none" opacity="0" />

        {/* ── Glass panel frames ── */}
        <rect x="37" y="148" width="75" height="110" stroke="#dcd1bf" strokeWidth="1.2" fill="none" opacity="0" />
        <rect x="148" y="148" width="75" height="110" stroke="#dcd1bf" strokeWidth="1.2" fill="none" opacity="0" />

        {/* ── Lattice pattern: overlapping circles grid ── */}
        {[37, 148].map((panelX) =>
          [0, 1, 2].map((col) =>
            [0, 1, 2, 3, 4].map((row) => {
              const cx = panelX + 15 + col * 22.5;
              const cy = 160 + row * 19;
              return (
                <circle
                  key={`lat-c-${panelX}-${col}-${row}`}
                  cx={cx}
                  cy={cy}
                  r="11"
                  stroke="#dcd1bf"
                  strokeWidth="0.6"
                  fill="none"
                  opacity="0"
                />
              );
            })
          )
        )}

        {/* ── Lattice pattern: center dots ── */}
        {[37, 148].map((panelX) =>
          [0, 1, 2].map((col) =>
            [0, 1, 2, 3, 4].map((row) => {
              const cx = panelX + 15 + col * 22.5;
              const cy = 160 + row * 19;
              return (
                <circle
                  key={`lat-d-${panelX}-${col}-${row}`}
                  cx={cx}
                  cy={cy}
                  r="1.6"
                  fill="#dcd1bf"
                  fillOpacity="0"
                  stroke="#dcd1bf"
                  strokeWidth="0.3"
                  opacity="0"
                />
              );
            })
          )
        )}

        {/* ── Door knobs (center, between doors) ── */}
        <circle cx="120" cy="234" r="2.4" stroke="#dcd1bf" strokeWidth="0.9" fill="#dcd1bf" fillOpacity="0" opacity="0" />
        <circle cx="140" cy="234" r="2.4" stroke="#dcd1bf" strokeWidth="0.9" fill="#dcd1bf" fillOpacity="0" opacity="0" />

        {/* ── Horizontal handle bars ── */}
        <rect x="45" y="266" width="60" height="11" rx="5" stroke="#dcd1bf" strokeWidth="1.2" fill="none" opacity="0" />
        <rect x="155" y="266" width="60" height="11" rx="5" stroke="#dcd1bf" strokeWidth="1.2" fill="none" opacity="0" />

        {/* ── Lower solid panels ── */}
        <rect x="41" y="287" width="67" height="28" stroke="#dcd1bf" strokeWidth="1.2" fill="none" opacity="0" />
        <rect x="152" y="287" width="67" height="28" stroke="#dcd1bf" strokeWidth="1.2" fill="none" opacity="0" />
      </svg>

      {/* Wordmark — SVG stroke draw */}
      <svg
        ref={wordmarkRef}
        width="340"
        height="60"
        viewBox="0 0 340 60"
        style={{ display: 'block' }}
      >
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="none"
          stroke="#dcd1bf"
          strokeWidth="0.6"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '42px',
            fontWeight: 400,
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
          }}
          className="loader-stroke-text"
        >
          ROCCIA
        </text>
      </svg>

      {/* Subtitle — SVG stroke draw */}
      <svg
        ref={subRef}
        width="280"
        height="14"
        viewBox="0 0 280 14"
        style={{ display: 'block', marginTop: '0' }}
      >
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="none"
          stroke="rgba(220, 209, 191, 0.9)"
          strokeWidth="0.5"
          style={{
            fontFamily: 'Lato, sans-serif',
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.5em',
            textTransform: 'uppercase',
          }}
          className="loader-stroke-text"
        >
          Marble Decor &amp; Artistry
        </text>
      </svg>

      {/* Animated line */}
      <div
        ref={lineRef}
        style={{
          width: '100px',
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(220,209,191,0.4), transparent)',
          marginTop: '1rem',
          transformOrigin: 'center',
          transform: 'scaleX(0)',
        }}
      />
    </div>
  );
};

/* ── Custom Cursor ── */
const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let rafId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isHoverable =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('marble-card');
      ringRef.current?.classList.toggle('is-hovering', !!isHoverable);
    };

    function animateRing() {
      ringX += (mouseX - ringX) * 0.08;
      ringY += (mouseY - ringY) * 0.08;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(animateRing);
    }

    animateRing();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="cursor cursor-dot"
        style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 9999 }}
      />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
};

/* ── Section Transition (dark to light) ── */
const SectionDivider: React.FC = () => (
  <div className="section-divider" />
);

/* ── App ── */
const App: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  useLenis();

  useEffect(() => {
    // Refresh ScrollTrigger on load
    if (loaded) {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    }
  }, [loaded]);

  return (
    <>
      {/* Grain overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Custom cursor */}
      <CustomCursor />

      {/* Page loader */}
      <AnimatePresence>
        {!loaded && <PageLoader onComplete={() => setLoaded(true)} />}
      </AnimatePresence>

      {/* Main content — routed */}
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
