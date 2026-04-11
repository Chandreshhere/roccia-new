import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const panels = [
  {
    id: '01',
    label: 'Living',
    title: 'Casa',
    italian: 'La Casa',
    desc: 'Transform your living environment with bespoke marble installations — statement flooring, architectural walls, sculpted furniture. Each piece is a testament to Italian heritage and precision craftsmanship.',
    img: '/assets/1.jpeg',
  },
  {
    id: '02',
    label: 'Sanctuary',
    title: 'Bagno',
    italian: 'Il Bagno',
    desc: 'The bathroom reimagined as a marble sanctuary. Custom vanities, tub surrounds, and hand-laid mosaics — a private world of cool luxury, sensory calm, and timeless refinement.',
    img: '/assets/4.jpeg',
  },
  {
    id: '03',
    label: 'Sculpture',
    title: 'Luce',
    italian: 'La Luce',
    desc: 'Standalone sculptures and carved luminaries that merge art with function. Stone shaped to hold light — our most evocative expressions of form, presence, and serenity.',
    img: '/assets/6.jpeg',
  },
  {
    id: '04',
    label: 'Bespoke',
    title: 'Su Misura',
    italian: 'Fatto a Mano',
    desc: 'For the discerning architect, the designer of vision, the collector of the eternal. Our bespoke programme creates one-of-a-kind marble statements worthy of generations.',
    img: '/assets/8.jpeg',
  },
];

const CollectionsScroll: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

    const ctx = gsap.context(() => {
      const totalWidth = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${totalWidth + window.innerHeight}`,
          pin: true,
          pinType: 'transform',
          scrub: 1.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        background: '#171717',
        zIndex: 22,
      }}
    >
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          height: '100vh',
          alignItems: 'center',
          willChange: 'transform',
        }}
      >
        {/* Intro panel */}
        <div
          style={{
            flexShrink: 0,
            width: '55vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            padding: '0 6rem',
            background: '#171717',
          }}
        >
          <div style={{ maxWidth: '460px' }}>
            <p
              style={{
                fontFamily: 'Lato, sans-serif',
                fontSize: '0.6rem',
                fontWeight: 300,
                letterSpacing: '0.5em',
                textTransform: 'uppercase',
                color: 'rgba(201,169,110,0.7)',
                marginBottom: '1.5rem',
              }}
            >
              The Collections
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(3rem, 6vw, 6.5rem)',
                fontWeight: 400,
                lineHeight: 0.95,
                color: '#f2f1ea',
                marginBottom: '2rem',
                letterSpacing: '-0.01em',
              }}
            >
              A World
              <br />
              <em style={{ fontWeight: 300 }}>in Stone.</em>
            </h2>
            <p
              style={{
                fontFamily: 'Lato, sans-serif',
                fontSize: '0.85rem',
                fontWeight: 300,
                lineHeight: 1.8,
                color: 'rgba(242,241,234,0.5)',
                marginBottom: '3rem',
                maxWidth: '42ch',
              }}
            >
              Four collections. One philosophy. Each chapter of Roccia's story —
              distinct in character, unified by an uncompromising standard of craft.
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                fontFamily: 'Lato, sans-serif',
                fontSize: '0.6rem',
                fontWeight: 300,
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                color: 'rgba(220,209,191,0.4)',
              }}
            >
              <span>Scroll to explore</span>
              <span
                style={{
                  display: 'block',
                  width: '50px',
                  height: '1px',
                  background: 'rgba(220,209,191,0.3)',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    right: '-1px',
                    top: '-3px',
                    width: '7px',
                    height: '7px',
                    borderRight: '1px solid rgba(220,209,191,0.4)',
                    borderTop: '1px solid rgba(220,209,191,0.4)',
                    transform: 'rotate(45deg)',
                  }}
                />
              </span>
            </div>
          </div>
        </div>

        {/* Collection panels */}
        {panels.map((panel) => (
          <div
            key={panel.id}
            style={{
              flexShrink: 0,
              width: '85vw',
              height: '100vh',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              padding: '0 6rem',
              borderLeft: '1px solid rgba(220,209,191,0.08)',
            }}
          >
            {/* Background image */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${panel.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: 0,
              }}
            />
            {/* Dark overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(90deg, rgba(23,23,23,0.92) 0%, rgba(23,23,23,0.75) 40%, rgba(23,23,23,0.2) 100%)',
                zIndex: 1,
              }}
            />

            {/* Huge background number */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                right: '-2rem',
                top: '50%',
                transform: 'translateY(-50%)',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '28rem',
                fontWeight: 300,
                color: 'rgba(242,241,234,0.04)',
                lineHeight: 1,
                pointerEvents: 'none',
                userSelect: 'none',
                zIndex: 1,
              }}
            >
              {panel.id}
            </div>

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 5, maxWidth: '480px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '2rem',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '0.9rem',
                    color: 'rgba(201,169,110,0.8)',
                    letterSpacing: '0.15em',
                  }}
                >
                  {panel.id}
                </span>
                <span
                  style={{
                    width: '40px',
                    height: '1px',
                    background: 'rgba(201,169,110,0.5)',
                  }}
                />
                <p
                  style={{
                    fontFamily: 'Lato, sans-serif',
                    fontSize: '0.6rem',
                    fontWeight: 300,
                    letterSpacing: '0.5em',
                    textTransform: 'uppercase',
                    color: 'rgba(201,169,110,0.7)',
                  }}
                >
                  {panel.label}
                </p>
              </div>

              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '1rem',
                  fontStyle: 'italic',
                  color: 'rgba(220,209,191,0.5)',
                  marginBottom: '0.5rem',
                  letterSpacing: '0.1em',
                }}
              >
                {panel.italian}
              </p>

              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(3.5rem, 6vw, 7rem)',
                  fontWeight: 400,
                  color: '#f2f1ea',
                  lineHeight: 0.95,
                  marginBottom: '2.5rem',
                  letterSpacing: '0.01em',
                }}
              >
                {panel.title}
              </h3>

              <p
                style={{
                  fontFamily: 'Lato, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 300,
                  lineHeight: 1.9,
                  color: 'rgba(242,241,234,0.6)',
                  marginBottom: '3rem',
                  maxWidth: '42ch',
                }}
              >
                {panel.desc}
              </p>

              <a
                href="#"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '1rem',
                  fontFamily: 'Lato, sans-serif',
                  fontSize: '0.65rem',
                  fontWeight: 300,
                  letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                  color: '#dcd1bf',
                  textDecoration: 'none',
                }}
              >
                <span
                  style={{
                    width: '40px',
                    height: '1px',
                    background: '#dcd1bf',
                  }}
                />
                Explore Collection
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CollectionsScroll;
