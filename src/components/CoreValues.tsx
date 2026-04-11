import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const values = [
  {
    num: '01',
    title: 'Artistry',
    body: 'At the heart of our brand lies Artistry — the pursuit of beauty in every detail. Each sculpture and surface reflects our devotion to craft and creative vision.',
  },
  {
    num: '02',
    title: 'Innovation',
    body: 'Pioneering advanced 3D design and digital masonry techniques, the brand blends technology with craftsmanship to redefine modern luxury.',
  },
  {
    num: '03',
    title: 'Heritage',
    body: 'Rooted in Italian design philosophy and timeless craftsmanship, the brand honours centuries-old traditions while adapting them to contemporary aesthetics.',
  },
  {
    num: '04',
    title: 'Integrity',
    body: 'Commitment to authenticity, transparency, and uncompromised quality at every stage — from raw material to finished masterpiece.',
  },
  {
    num: '05',
    title: 'Excellence',
    body: "Precision, perfection, and passion define the brand's approach to design, execution, and client experience.",
  },
];

const stats = [
  { num: '30+', label: 'Years of Craft' },
  { num: '500+', label: 'Commissions' },
  { num: '12', label: 'Countries' },
  { num: '100%', label: 'Bespoke' },
];

const CoreValues: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left column reveal
      gsap.from(leftRef.current?.querySelectorAll('.core-value-item') ?? [], {
        opacity: 0,
        x: -40,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: leftRef.current,
          start: 'top 80%',
        },
      });

      // Right column: sticky visual reveal
      gsap.from(rightRef.current, {
        opacity: 0,
        x: 50,
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: rightRef.current,
          start: 'top 80%',
        },
      });

      // Stats count-up
      const statNums = sectionRef.current?.querySelectorAll('.core-values__stat-num');
      statNums?.forEach((el) => {
        const text = el.textContent || '';
        const numMatch = text.match(/\d+/);
        if (!numMatch) return;
        const target = parseInt(numMatch[0]);
        const suffix = text.replace(/\d+/, '');
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = `${Math.round(obj.val)}${suffix}`;
          },
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            once: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="core-values" id="values">
      <div className="core-values__inner">
        {/* Left: values list */}
        <div ref={leftRef} className="core-values__left">
          <p className="core-values__eyebrow">What We Stand For</p>
          <h2 className="core-values__title">
            Five Pillars
            <br />
            of Roccia
          </h2>

          <div className="core-values__list">
            {values.map((v) => (
              <motion.div
                key={v.num}
                className="core-value-item"
                whileHover={{ x: 8 }}
                transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
              >
                <span className="core-value-item__num">{v.num}</span>
                <div>
                  <h4 className="core-value-item__title">{v.title}</h4>
                  <p className="core-value-item__body">{v.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: visual */}
        <div ref={rightRef} className="core-values__right">
          <div className="core-values__visual-wrap">
            {/* Main visual */}
            <div className="core-values__visual-img">
              {/* Marble texture block */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `
                    radial-gradient(ellipse 60% 40% at 30% 30%, rgba(86,8,6,0.15) 0%, transparent 60%),
                    radial-gradient(ellipse 70% 50% at 70% 70%, rgba(201,169,110,0.08) 0%, transparent 60%),
                    linear-gradient(135deg, #dcd1bf 0%, #ede7db 40%, #d5c8b4 100%)
                  `,
                }}
              />
              {/* Marble veins */}
              <svg
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.2 }}
                viewBox="0 0 500 600"
                preserveAspectRatio="xMidYMid slice"
              >
                <path d="M60 0 Q100 60 80 120 Q60 180 120 230 Q180 280 150 360 Q130 420 190 500 Q230 560 210 600" stroke="#560806" strokeWidth="1.5" fill="none" />
                <path d="M200 0 Q240 80 220 160 Q200 240 260 300 Q310 350 290 430 Q275 490 320 560 Q350 590 340 600" stroke="#560806" strokeWidth="1" fill="none" opacity="0.7" />
                <path d="M380 20 Q350 100 380 180 Q410 260 370 340 Q340 400 370 470" stroke="#560806" strokeWidth="0.7" fill="none" opacity="0.4" />
                <path d="M0 300 Q80 320 140 290 Q200 260 270 300 Q340 340 400 310 Q450 290 500 300" stroke="#560806" strokeWidth="0.8" fill="none" opacity="0.25" />
              </svg>

              {/* Centered quote text */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '3rem',
                }}
              >
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.6rem',
                    fontWeight: 400,
                    fontStyle: 'italic',
                    color: 'rgba(86,8,6,0.6)',
                    textAlign: 'center',
                    lineHeight: 1.4,
                  }}
                >
                  "Each curve and contour is calculated — a union of intuition and expertise."
                </p>
              </div>
            </div>

            {/* Stats block */}
            <div className="core-values__stat-block">
              {stats.map((stat) => (
                <div key={stat.label} className="core-values__stat">
                  <div className="core-values__stat-num">{stat.num}</div>
                  <div className="core-values__stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoreValues;
