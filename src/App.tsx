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

    // Get all stroked paths for draw animation
    const paths = svg.querySelectorAll('path, rect, line, circle');
    paths.forEach((el) => {
      const pathEl = el as SVGGeometryElement;
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

    // Phase 1: Draw the logo stroke by stroke
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
      {/* SVG Logo — draw animation */}
      <svg
        ref={svgRef}
        width="70"
        height="88"
        viewBox="0 0 80 100"
        fill="none"
      >
        {/* Arch */}
        <path d="M18 38 Q18 10 40 10 Q62 10 62 38" stroke="#dcd1bf" strokeWidth="1.5" fill="none" opacity="0" />
        {/* Sunburst */}
        <line x1="40" y1="12" x2="40" y2="24" stroke="#dcd1bf" strokeWidth="1" opacity="0" />
        <line x1="30" y1="14" x2="34" y2="24" stroke="#dcd1bf" strokeWidth="0.8" opacity="0" />
        <line x1="50" y1="14" x2="46" y2="24" stroke="#dcd1bf" strokeWidth="0.8" opacity="0" />
        <line x1="23" y1="20" x2="28" y2="27" stroke="#dcd1bf" strokeWidth="0.7" opacity="0" />
        <line x1="57" y1="20" x2="52" y2="27" stroke="#dcd1bf" strokeWidth="0.7" opacity="0" />
        {/* Left door */}
        <rect x="18" y="38" width="20" height="50" stroke="#dcd1bf" strokeWidth="1.5" fill="none" opacity="0" />
        <rect x="21" y="41" width="14" height="22" stroke="#dcd1bf" strokeWidth="0.8" fill="none" opacity="0" />
        {/* Left lattice */}
        <line x1="24" y1="41" x2="24" y2="63" stroke="#dcd1bf" strokeWidth="0.5" opacity="0" />
        <line x1="28" y1="41" x2="28" y2="63" stroke="#dcd1bf" strokeWidth="0.5" opacity="0" />
        <line x1="32" y1="41" x2="32" y2="63" stroke="#dcd1bf" strokeWidth="0.5" opacity="0" />
        <line x1="21" y1="47" x2="35" y2="47" stroke="#dcd1bf" strokeWidth="0.5" opacity="0" />
        <line x1="21" y1="53" x2="35" y2="53" stroke="#dcd1bf" strokeWidth="0.5" opacity="0" />
        <line x1="21" y1="57" x2="35" y2="57" stroke="#dcd1bf" strokeWidth="0.5" opacity="0" />
        {/* Left lower */}
        <rect x="21" y="67" width="14" height="16" stroke="#dcd1bf" strokeWidth="0.8" fill="none" opacity="0" />
        {/* Right door */}
        <rect x="42" y="38" width="20" height="50" stroke="#dcd1bf" strokeWidth="1.5" fill="none" opacity="0" />
        <rect x="45" y="41" width="14" height="22" stroke="#dcd1bf" strokeWidth="0.8" fill="none" opacity="0" />
        {/* Right lattice */}
        <line x1="48" y1="41" x2="48" y2="63" stroke="#dcd1bf" strokeWidth="0.5" opacity="0" />
        <line x1="52" y1="41" x2="52" y2="63" stroke="#dcd1bf" strokeWidth="0.5" opacity="0" />
        <line x1="56" y1="41" x2="56" y2="63" stroke="#dcd1bf" strokeWidth="0.5" opacity="0" />
        <line x1="45" y1="47" x2="59" y2="47" stroke="#dcd1bf" strokeWidth="0.5" opacity="0" />
        <line x1="45" y1="53" x2="59" y2="53" stroke="#dcd1bf" strokeWidth="0.5" opacity="0" />
        <line x1="45" y1="57" x2="59" y2="57" stroke="#dcd1bf" strokeWidth="0.5" opacity="0" />
        {/* Right lower */}
        <rect x="45" y="67" width="14" height="16" stroke="#dcd1bf" strokeWidth="0.8" fill="none" opacity="0" />
        {/* Door knobs */}
        <circle cx="38.5" cy="64" r="1.8" fill="#dcd1bf" fillOpacity="0" stroke="#dcd1bf" strokeWidth="0.5" opacity="0" />
        <circle cx="41.5" cy="64" r="1.8" fill="#dcd1bf" fillOpacity="0" stroke="#dcd1bf" strokeWidth="0.5" opacity="0" />
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
