import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const Philosophy: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background parallax
      gsap.to(bgRef.current, {
        backgroundPositionY: '30%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Label reveal
      gsap.from(labelRef.current, {
        opacity: 0,
        x: -30,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: labelRef.current,
          start: 'top 85%',
        },
      });

      // Quote words reveal – stagger each word
      const words = quoteRef.current?.querySelectorAll('.philosophy__quote-inner');
      if (words) {
        gsap.to(words, {
          y: '0%',
          duration: 1.2,
          ease: 'power3.out',
          stagger: 0.06,
          scrollTrigger: {
            trigger: quoteRef.current,
            start: 'top 80%',
          },
        });
      }

      // Divider
      gsap.to(dividerRef.current, {
        opacity: 1,
        width: '80px',
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: dividerRef.current,
          start: 'top 85%',
        },
      });

      // Body text
      gsap.to(bodyRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: bodyRef.current,
          start: 'top 85%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const quoteText = '"Every surface tells a story — not of excess, but of mastery."';
  const words = quoteText.split(' ');

  return (
    <section ref={sectionRef} className="philosophy" id="philosophy">
      {/* Subtle background texture */}
      <div
        ref={bgRef}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(ellipse 80% 60% at 30% 50%, rgba(86,8,6,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="philosophy__inner">
        {/* Left: label */}
        <div ref={labelRef} className="philosophy__label">
          Brand Philosophy
        </div>

        {/* Right: content */}
        <div className="philosophy__text">
          <blockquote ref={quoteRef as React.RefObject<HTMLQuoteElement>} className="philosophy__quote">
            {words.map((word, i) => (
              <span key={i} className="philosophy__quote-word">
                <span className="philosophy__quote-inner">{word}</span>
              </span>
            ))}
          </blockquote>

          <div
            ref={dividerRef}
            className="philosophy__divider"
            style={{ width: 0 }}
          />

          <p ref={bodyRef} className="philosophy__body">
            Born in Indore with inspiration drawn from Italian artistry, Roccia redefines luxury
            marble design through the union of technology, craftsmanship, and vision. Each creation
            narrates a story of precision, sustainability, and passion — transforming raw stone into
            living art.
            <br />
            <br />
            For centuries, stone has stood as a symbol of permanence, prestige and architectural
            power. ROCCIA reimagines this legacy. Our objects are not merely furniture or fixtures —
            they are modern artefacts, living expressions of space, soul and structure.
          </p>

          {/* Signature line */}
          <motion.div
            style={{
              marginTop: '4rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              opacity: 0,
            }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6, ease: [0.19, 1, 0.22, 1] }}
          >
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.1rem',
                fontWeight: 400,
                fontStyle: 'italic',
                color: 'rgba(220,209,191,0.5)',
                letterSpacing: '0.1em',
              }}
            >
              House of Roccia
            </div>
            <div
              style={{
                flex: 1,
                maxWidth: '80px',
                height: '1px',
                background: 'linear-gradient(to right, rgba(201,169,110,0.4), transparent)',
              }}
            />
            <div
              style={{
                fontFamily: 'Lato, sans-serif',
                fontSize: '0.6rem',
                fontWeight: 300,
                letterSpacing: '0.4em',
                color: 'rgba(201,169,110,0.5)',
                textTransform: 'uppercase',
              }}
            >
              Est. 1994
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
