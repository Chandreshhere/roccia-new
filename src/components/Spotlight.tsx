import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const spotlightItems = [
  { name: 'Forma Divina', img: '/assets/frames-kling/frame_0100.jpg' },
  { name: 'Piano Eterno', img: '/assets/frames-kling/frame_0200.jpg' },
  { name: 'Superficie Viva', img: '/assets/frames-kling/frame_0300.jpg' },
  { name: 'Acqua Pietra', img: '/assets/frames-kling/frame_0400.jpg' },
  { name: 'Luce Sacra', img: '/assets/frames-kling/frame_0500.jpg' },
  { name: 'Pietra Nobile', img: '/assets/frames-kling/frame_0600.jpg' },
  { name: 'Marmo Vivo', img: '/assets/frames-kling/frame_0700.jpg' },
  { name: 'Arco Celeste', img: '/assets/frames-kling/frame_0800.jpg' },
];

const arcConfig = { gap: 0.08, speed: 0.3, arcRadius: 500 };

function getBezierPos(t: number, sx: number, sy: number, ey: number, cx: number, cy: number) {
  return {
    x: (1 - t) ** 2 * sx + 2 * (1 - t) * t * cx + t * t * sx,
    y: (1 - t) ** 2 * sy + 2 * (1 - t) * t * cy + t * t * ey,
  };
}

function getImgProgress(index: number, progress: number) {
  const start = index * arcConfig.gap;
  const end = start + arcConfig.speed;
  if (progress < start) return -1;
  if (progress > end) return 2;
  return (progress - start) / arcConfig.speed;
}

const Spotlight: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titlesRef = useRef<HTMLDivElement>(null);
  const imagesContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const titlesContainer = titlesRef.current;
    const imagesContainer = imagesContainerRef.current;
    const header = headerRef.current;
    if (!section || !titlesContainer || !imagesContainer || !header) return;

    // Build titles + floating images
    titlesContainer.innerHTML = '';
    imagesContainer.innerHTML = '';
    const imageEls: HTMLDivElement[] = [];

    spotlightItems.forEach((item, index) => {
      const h1 = document.createElement('h1');
      h1.textContent = item.name;
      h1.style.opacity = index === 0 ? '1' : '0.35';
      h1.style.fontFamily = "'Cormorant Garamond', serif";
      h1.style.fontSize = 'clamp(2.5rem, 5vw, 4.5rem)';
      h1.style.fontWeight = '400';
      h1.style.letterSpacing = '0.08em';
      h1.style.lineHeight = '1';
      h1.style.color = '#f2f1ea';
      h1.style.transition = 'opacity 0.3s ease';
      titlesContainer.appendChild(h1);

      const wrap = document.createElement('div');
      wrap.className = 'spotlight-img';
      const img = document.createElement('img');
      img.src = item.img;
      img.alt = '';
      wrap.appendChild(img);
      imagesContainer.appendChild(wrap);
      imageEls.push(wrap);
    });

    const titleEls = titlesContainer.querySelectorAll('h1');
    let currentActive = 0;

    const cw = window.innerWidth * 0.3;
    const ch = window.innerHeight;
    const asx = cw - 220;
    const asy = -200;
    const aey = ch + 200;
    const acx = asx + arcConfig.arcRadius;
    const acy = ch / 2;

    imageEls.forEach((img) => gsap.set(img, { opacity: 0 }));

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: `+=${window.innerHeight * 10}`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          // Titles scroll + floating images + active title switching
          header.style.opacity = progress > 0.02 && progress < 0.95 ? '1' : '0';

          const switchP = Math.min(Math.max(progress / 0.95, 0), 1);
          const vh = window.innerHeight;
          const scrollH = titlesContainer.scrollHeight;
          const currentY = vh - switchP * (vh + scrollH);
          gsap.set(titlesContainer, { y: currentY });

          imageEls.forEach((img, index) => {
            const imgP = getImgProgress(index, switchP);
            if (imgP < 0 || imgP > 1) {
              gsap.set(img, { opacity: 0 });
            } else {
              const pos = getBezierPos(imgP, asx, asy, aey, acx, acy);
              gsap.set(img, { x: pos.x - 100, y: pos.y - 75, opacity: 1 });
            }
          });

          const mid = vh / 2;
          let closestIdx = 0;
          let closestDist = Infinity;
          titleEls.forEach((t, i) => {
            const rect = t.getBoundingClientRect();
            const dist = Math.abs(rect.top + rect.height / 2 - mid);
            if (dist < closestDist) { closestDist = dist; closestIdx = i; }
          });
          if (closestIdx !== currentActive) {
            (titleEls[currentActive] as HTMLElement).style.opacity = '0.35';
            (titleEls[closestIdx] as HTMLElement).style.opacity = '1';
            currentActive = closestIdx;
          }
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="spotlight-section"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        zIndex: 10,
      }}
    >
      {/* Dark overlay — video last frame visible behind */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(23,23,23,0.75)',
          zIndex: 0,
        }}
      />

      {/* Titles with diagonal clip */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '15vw',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          clipPath: 'polygon(50vh 0px, 0px 50%, 50vh 100%, 100% calc(100% + 100vh), 100% -100vh)',
          zIndex: 5,
        }}
      >
        <div
          ref={titlesRef}
          style={{
            position: 'relative',
            left: '15%',
            width: '75%',
            display: 'flex',
            flexDirection: 'column',
            gap: '5rem',
            transform: 'translateY(100%)',
          }}
        />
      </div>

      {/* Floating images */}
      <div
        ref={imagesContainerRef}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          minWidth: '300px',
          height: '100%',
          zIndex: 6,
          pointerEvents: 'none',
        }}
      />

      {/* Discover header */}
      <div
        ref={headerRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '10%',
          transform: 'translateY(-50%)',
          opacity: 0,
          zIndex: 7,
          transition: 'opacity 0.3s ease',
        }}
      >
        <p style={{
          fontFamily: 'Lato, sans-serif',
          fontSize: '0.7rem',
          fontWeight: 300,
          letterSpacing: '0.5em',
          textTransform: 'uppercase',
          color: 'rgba(220,209,191,0.7)',
        }}>Discover</p>
      </div>

      {/* Diagonal line decorations */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '15vw',
          width: '100vh',
          height: '2px',
          background: 'rgba(220,209,191,0.15)',
          transform: 'rotate(-45deg) translate(-7rem)',
          transformOrigin: 'top left',
          zIndex: 8,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '15vw',
          width: '100vh',
          height: '2px',
          background: 'rgba(220,209,191,0.15)',
          transform: 'rotate(45deg) translate(-7rem)',
          transformOrigin: 'bottom left',
          zIndex: 8,
          pointerEvents: 'none',
        }}
      />
    </section>
  );
};

export default Spotlight;
