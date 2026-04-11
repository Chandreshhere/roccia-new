import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero reveal
      gsap.from(heroRef.current?.querySelectorAll('.about-hero-line') ?? [], {
        opacity: 0,
        y: 60,
        duration: 1.4,
        ease: 'power3.out',
        stagger: 0.12,
      });

      // Story section reveal
      gsap.from(storyRef.current?.querySelectorAll('.story-block') ?? [], {
        opacity: 0,
        y: 80,
        duration: 1.2,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: storyRef.current,
          start: 'top 75%',
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ─── Hero ─── */}
      <section
        ref={heroRef}
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          background: '#560806',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '14rem 4rem 8rem',
          overflow: 'hidden',
        }}
      >
        {/* Decorative big italic text */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: '-3rem',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(12rem, 28vw, 32rem)',
            fontStyle: 'italic',
            fontWeight: 300,
            color: 'rgba(220,209,191,0.04)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            userSelect: 'none',
            lineHeight: 0.8,
          }}
        >
          Roccia
        </div>

        <p
          className="about-hero-line"
          style={{
            fontFamily: 'Lato, sans-serif',
            fontSize: '0.65rem',
            fontWeight: 300,
            letterSpacing: '0.55em',
            textTransform: 'uppercase',
            color: 'rgba(220,209,191,0.5)',
            marginBottom: '3rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
          }}
        >
          <span style={{ width: '40px', height: '1px', background: 'rgba(220,209,191,0.3)' }} />
          About
          <span style={{ width: '40px', height: '1px', background: 'rgba(220,209,191,0.3)' }} />
        </p>

        <h1
          className="about-hero-line"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(3rem, 7.5vw, 9rem)',
            fontWeight: 400,
            fontStyle: 'italic',
            lineHeight: 1,
            color: '#f2f1ea',
            textAlign: 'center',
            maxWidth: '16ch',
            letterSpacing: '-0.01em',
            position: 'relative',
            zIndex: 2,
          }}
        >
          Shaping the eternal, one surface at a time.
        </h1>

        <p
          className="about-hero-line"
          style={{
            fontFamily: 'Lato, sans-serif',
            fontSize: '0.95rem',
            fontWeight: 300,
            lineHeight: 1.9,
            color: 'rgba(220,209,191,0.6)',
            marginTop: '3rem',
            maxWidth: '56ch',
            textAlign: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          House of Roccia is an ultra-luxury marble decor atelier born in Indore,
          inspired by Italian artistry — crafting bespoke 3D sculptures and
          statement marble furniture for the world's most discerning clientele.
        </p>
      </section>

      {/* ─── Brand Story ─── */}
      <section
        ref={storyRef}
        style={{
          position: 'relative',
          width: '100%',
          background: '#f2f1ea',
          padding: '12rem 4rem',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div className="story-block" style={{ marginBottom: '6rem' }}>
            <p
              style={{
                fontFamily: 'Lato, sans-serif',
                fontSize: '0.6rem',
                fontWeight: 300,
                letterSpacing: '0.5em',
                textTransform: 'uppercase',
                color: '#560806',
                opacity: 0.55,
                marginBottom: '1.2rem',
              }}
            >
              Who We Are
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(2.2rem, 4.5vw, 4.5rem)',
                fontWeight: 400,
                lineHeight: 1.1,
                color: '#560806',
                marginBottom: '2.5rem',
                letterSpacing: '-0.005em',
              }}
            >
              Roccia is poised to revolutionize the ultra high-end marble
              masonry sector.
            </h2>
            <p
              style={{
                fontFamily: 'Lato, sans-serif',
                fontSize: '0.95rem',
                fontWeight: 300,
                lineHeight: 1.9,
                color: 'rgba(23,23,23,0.65)',
                maxWidth: '68ch',
              }}
            >
              Our vision is rooted in crafting bespoke 3D sculptures and statement
              marble furniture that embody artistic innovation, sustainability,
              and enduring value. With a new Indore-based landmark, Roccia
              integrates precision technology with artisanal mastery to serve the
              world's most discerning architects, interior designers, and luxury
              clientele.
            </p>
          </div>

          <div
            className="story-block"
            style={{
              marginBottom: '6rem',
              paddingTop: '4rem',
              borderTop: '1px solid rgba(86,8,6,0.15)',
            }}
          >
            <p
              style={{
                fontFamily: 'Lato, sans-serif',
                fontSize: '0.6rem',
                fontWeight: 300,
                letterSpacing: '0.5em',
                textTransform: 'uppercase',
                color: '#560806',
                opacity: 0.55,
                marginBottom: '1.2rem',
              }}
            >
              The Story
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(2.2rem, 4.5vw, 4.5rem)',
                fontWeight: 400,
                lineHeight: 1.1,
                color: '#560806',
                marginBottom: '2.5rem',
                letterSpacing: '-0.005em',
              }}
            >
              Born in Indore. <em style={{ fontWeight: 300 }}>Inspired</em> by Italy.
            </h2>
            <p
              style={{
                fontFamily: 'Lato, sans-serif',
                fontSize: '0.95rem',
                fontWeight: 300,
                lineHeight: 1.9,
                color: 'rgba(23,23,23,0.65)',
                marginBottom: '1.8rem',
                maxWidth: '68ch',
              }}
            >
              For centuries, stone has stood as a symbol of permanence, prestige,
              and architectural power. Traditionally associated with classical
              art or monumental construction, it has often been as distant, grand
              and immovable. ROCCIA reimagines this legacy.
            </p>
            <p
              style={{
                fontFamily: 'Lato, sans-serif',
                fontSize: '0.95rem',
                fontWeight: 300,
                lineHeight: 1.9,
                color: 'rgba(23,23,23,0.65)',
                maxWidth: '68ch',
              }}
            >
              We are driven by a deep, instinctive need to shape, sculpt, and
              give form to the eternal. Our objects are not merely furniture or
              fixtures — they are modern artefacts. We take raw, natural
              materials and transform them into living expressions of space,
              soul, and structure.
            </p>
          </div>

          <div
            className="story-block"
            style={{
              paddingTop: '4rem',
              borderTop: '1px solid rgba(86,8,6,0.15)',
            }}
          >
            <p
              style={{
                fontFamily: 'Lato, sans-serif',
                fontSize: '0.6rem',
                fontWeight: 300,
                letterSpacing: '0.5em',
                textTransform: 'uppercase',
                color: '#560806',
                opacity: 0.55,
                marginBottom: '1.2rem',
              }}
            >
              Tone of Voice
            </p>
            <blockquote
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
                fontWeight: 400,
                fontStyle: 'italic',
                lineHeight: 1.3,
                color: '#560806',
                margin: 0,
                maxWidth: '22ch',
              }}
            >
              "Cool to the touch. Warm in intent. Every surface holds a story of
              time made tangible."
            </blockquote>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
