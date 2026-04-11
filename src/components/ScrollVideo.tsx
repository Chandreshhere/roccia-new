import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCanvasScrub } from '../hooks/useCanvasScrub';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 480;

const chapters = [
  {
    num: '01',
    title: 'Raw Stone',
    subtitle: 'From Earth to Vision',
    desc: 'Deep within the quarries of Rajasthan, raw stone sleeps for millennia. Each vein, each mineral trace — a record of geological time. We begin where nature leaves off.',
  },
  {
    num: '02',
    title: 'The Cut',
    subtitle: 'Precision Meets Passion',
    desc: 'Our artisans wield both ancient chisels and precision CNC tools — a union of intuition and engineering. Each curve and contour is calculated. Nothing is accidental.',
  },
  {
    num: '03',
    title: 'The Form',
    subtitle: 'Giving Shape to the Eternal',
    desc: 'Stone becomes surface. Surface becomes sculpture. We shape objects that are not merely furniture or fixtures — they are modern artefacts, living expressions of space and soul.',
  },
  {
    num: '04',
    title: 'Mastery',
    subtitle: 'Every Surface Tells a Story',
    desc: 'Cool to the touch. Warm in intent. The finished piece holds centuries of craft — transformed into something your space will carry forward for generations.',
  },
];

const ScrollVideo: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const currentChapterRef = useRef(0);
  const [loadPct, setLoadPct] = useState(0);

  const { canvasRef, preload, setProgress, isReady, loadProgress } = useCanvasScrub({
    frameDir: '/assets/frames-statue',
    frameCount: FRAME_COUNT,
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Preload frames when near viewport
    // Start preloading immediately on mount
    preload();

    // Track loading
    const loadInterval = setInterval(() => {
      setLoadPct(Math.round(loadProgress() * 100));
      if (isReady()) clearInterval(loadInterval);
    }, 100);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=500%',
        pin: true,
        pinType: 'transform',
        pinSpacing: true,
        scrub: 2,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;

          // Canvas frame update — instant, no decode lag
          setProgress(p);

          // Update progress bar
          if (progressFillRef.current) {
            progressFillRef.current.style.transform = `scaleY(${p})`;
          }

          // Update percentage text
          if (pctRef.current) {
            pctRef.current.textContent = `${Math.round(p * 100)}%`;
          }

          // Update active chapter
          const chapterIndex = Math.min(
            Math.floor(p * chapters.length),
            chapters.length - 1
          );

          if (chapterIndex !== currentChapterRef.current) {
            const old = chapterRefs.current[currentChapterRef.current];
            if (old) old.classList.remove('active');
            const next = chapterRefs.current[chapterIndex];
            if (next) next.classList.add('active');
            currentChapterRef.current = chapterIndex;
          }
        },
      });
    });

    // Set first chapter active
    if (chapterRefs.current[0]) {
      chapterRefs.current[0].classList.add('active');
    }

    return () => {
      ctx.revert();
      clearInterval(loadInterval);
    };
  }, [preload, setProgress, isReady, loadProgress]);

  return (
    <div ref={sectionRef} className="scroll-video-section" id="artistry">
      {/* Canvas */}
      <div className="scroll-video__video-wrap">
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
        {loadPct < 100 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, #1a0a0a 0%, #2d1515 50%, #171717 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
            }}
          >
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.2rem',
                color: 'rgba(220,209,191,0.3)',
                letterSpacing: '0.4em',
                fontStyle: 'italic',
              }}
            >
              Loading...
            </p>
            <div style={{ width: '80px', height: '1px', background: 'rgba(220,209,191,0.15)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${loadPct}%`, background: 'rgba(220,209,191,0.4)', transition: 'width 0.2s' }} />
            </div>
          </div>
        )}
      </div>

      {/* Dark gradient overlay */}
      <div className="scroll-video__overlay" />

      {/* Text content */}
      <div className="scroll-video__content">
        <p className="scroll-video__chapter-label">The Process</p>

        <div className="scroll-video__chapters" style={{ minHeight: '320px' }}>
          {chapters.map((ch, i) => (
            <div
              key={ch.num}
              ref={(el) => { chapterRefs.current[i] = el; }}
              className="scroll-video__chapter"
            >
              <div className="scroll-video__chapter-num">{ch.num}</div>
              <h3 className="scroll-video__chapter-title">{ch.title}</h3>
              <p
                style={{
                  fontFamily: 'Lato, sans-serif',
                  fontSize: '0.65rem',
                  fontWeight: 300,
                  letterSpacing: '0.35em',
                  textTransform: 'uppercase',
                  color: 'rgba(201,169,110,0.7)',
                  marginBottom: '1rem',
                }}
              >
                {ch.subtitle}
              </p>
              <p className="scroll-video__chapter-desc">{ch.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="scroll-video__progress">
        <span ref={pctRef} className="scroll-video__progress-pct">0%</span>
        <div className="scroll-video__progress-track">
          <div ref={progressFillRef} className="scroll-video__progress-fill" style={{ height: '100%' }} />
        </div>
        <span
          style={{
            fontFamily: 'Lato, sans-serif',
            fontSize: '0.55rem',
            fontWeight: 300,
            letterSpacing: '0.15em',
            color: 'rgba(220,209,191,0.3)',
            writingMode: 'vertical-rl',
          }}
        >
          Scroll
        </span>
      </div>
    </div>
  );
};

export default ScrollVideo;
