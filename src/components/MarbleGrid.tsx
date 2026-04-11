import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const marbleItems = [
  {
    id: 1,
    category: 'Sculpture',
    name: 'Forma Divina',
    texture: 'marble-texture-1',
    dark: false,
  },
  {
    id: 2,
    category: 'Table Tops',
    name: 'Piano Eterno',
    texture: 'marble-texture-2',
    dark: true,
  },
  {
    id: 3,
    category: 'Wall Cladding',
    name: 'Superficie Viva',
    texture: 'marble-texture-3',
    dark: false,
  },
  {
    id: 4,
    category: 'Flooring',
    name: 'Pavimento Reale',
    texture: 'marble-texture-4',
    dark: true,
  },
  {
    id: 5,
    category: 'Fountain',
    name: 'Acqua Pietra',
    texture: 'marble-texture-5',
    dark: false,
  },
  {
    id: 6,
    category: 'Bespoke Collection',
    name: 'Su Misura',
    texture: 'marble-texture-6',
    dark: true,
  },
];

const MarbleGrid: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveal
      gsap.from(headerRef.current?.children ?? [], {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 85%',
        },
      });

      // Cards stagger reveal
      const cards = gridRef.current?.querySelectorAll('.marble-card');
      if (cards) {
        gsap.from(cards, {
          opacity: 0,
          y: 60,
          duration: 1.1,
          ease: 'power3.out',
          stagger: {
            each: 0.12,
            from: 'start',
          },
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="marble-grid-section" id="collections">
      <div ref={headerRef} className="marble-grid-section__header">
        <div>
          <p className="marble-grid-section__eyebrow">Our Artistry</p>
          <h2 className="marble-grid-section__title">
            Crafted in
            <br />
            Stone &amp; Vision
          </h2>
        </div>
        <p className="marble-grid-section__tagline">
          Each piece narrates a story of precision,
          <br />
          sustainability, and passion.
          <br />
          Raw stone into living art.
        </p>
      </div>

      <div ref={gridRef} className="marble-grid">
        {marbleItems.map((item) => (
          <motion.div
            key={item.id}
            className={`marble-card ${item.dark ? 'marble-card--dark' : ''}`}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          >
            {/* Marble texture background */}
            <div className={`marble-card__bg ${item.texture}`} style={{ position: 'absolute', inset: 0 }} />

            {/* Light shimmer */}
            <div className="marble-card__shimmer" />

            {/* Subtle grain for depth */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
                backgroundSize: '200px 200px',
                opacity: 0.025,
                pointerEvents: 'none',
                zIndex: 2,
              }}
            />

            {/* Marble veining overlay for first card */}
            {item.id === 1 && (
              <svg
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12, zIndex: 2 }}
                viewBox="0 0 400 600"
                preserveAspectRatio="xMidYMid slice"
              >
                <path
                  d="M80 0 Q120 80 90 160 Q70 240 140 300 Q200 360 160 440 Q130 500 180 600"
                  stroke="#560806"
                  strokeWidth="1.5"
                  fill="none"
                />
                <path
                  d="M200 0 Q250 100 220 200 Q190 300 260 380 Q310 440 280 540 Q260 580 300 600"
                  stroke="#560806"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.6"
                />
                <path
                  d="M320 50 Q290 130 340 200 Q380 270 350 370"
                  stroke="#560806"
                  strokeWidth="0.8"
                  fill="none"
                  opacity="0.4"
                />
              </svg>
            )}

            {/* Info on hover */}
            <div className="marble-card__info">
              <p className="marble-card__category">{item.category}</p>
              <h3 className="marble-card__name">{item.name}</h3>
            </div>

            {/* Number watermark */}
            <div
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '0.75rem',
                fontWeight: 400,
                letterSpacing: '0.2em',
                color: item.dark ? 'rgba(220,209,191,0.2)' : 'rgba(86,8,6,0.2)',
                zIndex: 4,
              }}
            >
              0{item.id}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default MarbleGrid;
