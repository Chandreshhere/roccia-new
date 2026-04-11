import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const panels = [
  {
    id: 1,
    label: 'Collection I',
    title: 'Casa',
    subtitle: 'Living Spaces',
    desc: 'Transform your living environment with our bespoke marble installations. From statement flooring to architectural wall pieces — each element designed to elevate.',
    bgClass: 'panel-bg-1',
    textLight: true,
  },
  {
    id: 2,
    label: 'Collection II',
    title: 'Bagno',
    subtitle: 'Sanctuary',
    desc: 'The bathroom reimagined as a marble sanctuary. Vanities, tub surrounds, and custom mosaic floors — a private world of cool luxury and sensory calm.',
    bgClass: 'panel-bg-2',
    textLight: true,
  },
  {
    id: 3,
    label: 'Collection III',
    title: 'Luce',
    subtitle: 'Sculpture & Light',
    desc: 'Standalone sculptures and carved luminaries that merge art with function. Stone shaped to hold light — our most evocative expressions of form and presence.',
    bgClass: 'panel-bg-3',
    textLight: false,
  },
  {
    id: 4,
    label: 'Bespoke',
    title: 'Su Misura',
    subtitle: 'Made for You',
    desc: 'Every extraordinary space begins with a singular vision. Our bespoke programme collaborates with architects and collectors to create one-of-a-kind marble statements.',
    bgClass: 'panel-bg-4',
    textLight: true,
  },
];

const HorizontalScroll: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const totalWidth = wrapper.scrollWidth - window.innerWidth;

      gsap.to(wrapper, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${totalWidth + window.innerWidth * 0.5}`,
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Individual panel reveals
      const panelEls = wrapper.querySelectorAll('.horizontal-scroll-panel');
      panelEls.forEach((panel) => {
        const content = panel.querySelector('.horizontal-panel__content');
        if (content) {
          gsap.from(content.children, {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: 'power3.out',
            stagger: 0.1,
            scrollTrigger: {
              trigger: panel,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="horizontal-scroll-section" id="process">
      <div ref={wrapperRef} className="horizontal-scroll-wrapper">
        {/* Intro panel */}
        <div className="horizontal-intro-panel">
          <div className="horizontal-intro-panel__content">
            <p className="horizontal-intro-panel__eyebrow">Our Collections</p>
            <h2 className="horizontal-intro-panel__title">
              A World
              <br />
              in Stone
            </h2>
            <p className="horizontal-intro-panel__sub">
              Each collection is a chapter in Roccia's story — distinct in character,
              unified by an uncompromising standard of craft.
            </p>
          </div>

          {/* Hint arrow */}
          <div className="horizontal-drag-hint" style={{ position: 'absolute', bottom: '3rem', left: '6rem' }}>
            <span>Scroll to explore</span>
            <span className="horizontal-drag-hint__arrow" />
          </div>
        </div>

        {/* Collection panels */}
        {panels.map((panel) => (
          <div key={panel.id} className="horizontal-scroll-panel">
            {/* Visual half */}
            <div className="horizontal-panel__visual">
              <div
                className={`horizontal-panel__visual-bg ${panel.bgClass}`}
                style={{ position: 'absolute', inset: 0 }}
              />
              {/* Subtle marble texture */}
              {panel.id === 3 && (
                <svg
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08 }}
                  viewBox="0 0 400 700"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <path d="M100 0 Q150 100 120 200 Q90 300 160 400 Q220 480 190 600 Q170 650 210 700" stroke="#560806" strokeWidth="2" fill="none" />
                  <path d="M250 0 Q280 120 260 250 Q240 370 300 460 Q350 530 330 650" stroke="#560806" strokeWidth="1.2" fill="none" opacity="0.6" />
                </svg>
              )}
              {/* Number in background */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-2rem',
                  right: '-1rem',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '22rem',
                  fontWeight: 300,
                  color: panel.textLight
                    ? 'rgba(242,241,234,0.04)'
                    : 'rgba(86,8,6,0.06)',
                  lineHeight: 1,
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              >
                {panel.id}
              </div>
            </div>

            {/* Content half */}
            <div
              className="horizontal-panel__content"
              style={{
                position: 'absolute',
                left: '8%',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                maxWidth: '420px',
              }}
            >
              <p
                className="horizontal-panel__label"
                style={{ color: panel.textLight ? '#c9a96e' : '#560806' }}
              >
                {panel.label}
              </p>
              <h3
                className="horizontal-panel__title"
                style={{ color: panel.textLight ? '#f2f1ea' : '#171717' }}
              >
                {panel.title}
              </h3>
              <p
                style={{
                  fontFamily: 'Lato, sans-serif',
                  fontSize: '0.6rem',
                  fontWeight: 300,
                  letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                  color: panel.textLight ? 'rgba(220,209,191,0.5)' : 'rgba(86,8,6,0.5)',
                  marginBottom: '1.5rem',
                  marginTop: '-1rem',
                }}
              >
                {panel.subtitle}
              </p>
              <p
                className="horizontal-panel__desc"
                style={{ color: panel.textLight ? 'rgba(242,241,234,0.55)' : 'rgba(23,23,23,0.55)' }}
              >
                {panel.desc}
              </p>
              <a
                href="#"
                className="horizontal-panel__link"
                style={{ color: panel.textLight ? '#dcd1bf' : '#560806' }}
              >
                <span
                  className="horizontal-panel__link-line"
                  style={{
                    background: panel.textLight ? '#dcd1bf' : '#560806',
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

export default HorizontalScroll;
