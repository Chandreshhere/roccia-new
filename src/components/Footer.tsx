import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import AngelStatue from './AngelStatue';

const RocciaLogoFull: React.FC = () => (
  <svg
    width="64"
    height="80"
    viewBox="0 0 80 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18 38 Q18 10 40 10 Q62 10 62 38" stroke="#dcd1bf" strokeWidth="1.5" fill="none" />
    <line x1="40" y1="12" x2="40" y2="22" stroke="#dcd1bf" strokeWidth="1" opacity="0.7" />
    <line x1="30" y1="14" x2="34" y2="23" stroke="#dcd1bf" strokeWidth="0.8" opacity="0.5" />
    <line x1="50" y1="14" x2="46" y2="23" stroke="#dcd1bf" strokeWidth="0.8" opacity="0.5" />
    <line x1="22" y1="20" x2="28" y2="27" stroke="#dcd1bf" strokeWidth="0.7" opacity="0.4" />
    <line x1="58" y1="20" x2="52" y2="27" stroke="#dcd1bf" strokeWidth="0.7" opacity="0.4" />
    <rect x="18" y="38" width="20" height="50" stroke="#dcd1bf" strokeWidth="1.5" fill="none" />
    <rect x="21" y="41" width="14" height="22" stroke="#dcd1bf" strokeWidth="0.8" fill="none" />
    <line x1="24" y1="41" x2="24" y2="63" stroke="#dcd1bf" strokeWidth="0.5" opacity="0.6" />
    <line x1="28" y1="41" x2="28" y2="63" stroke="#dcd1bf" strokeWidth="0.5" opacity="0.6" />
    <line x1="32" y1="41" x2="32" y2="63" stroke="#dcd1bf" strokeWidth="0.5" opacity="0.6" />
    <line x1="21" y1="47" x2="35" y2="47" stroke="#dcd1bf" strokeWidth="0.5" opacity="0.6" />
    <line x1="21" y1="53" x2="35" y2="53" stroke="#dcd1bf" strokeWidth="0.5" opacity="0.6" />
    <line x1="21" y1="57" x2="35" y2="57" stroke="#dcd1bf" strokeWidth="0.5" opacity="0.6" />
    <rect x="21" y="67" width="14" height="16" stroke="#dcd1bf" strokeWidth="0.8" fill="none" />
    <rect x="42" y="38" width="20" height="50" stroke="#dcd1bf" strokeWidth="1.5" fill="none" />
    <rect x="45" y="41" width="14" height="22" stroke="#dcd1bf" strokeWidth="0.8" fill="none" />
    <line x1="48" y1="41" x2="48" y2="63" stroke="#dcd1bf" strokeWidth="0.5" opacity="0.6" />
    <line x1="52" y1="41" x2="52" y2="63" stroke="#dcd1bf" strokeWidth="0.5" opacity="0.6" />
    <line x1="56" y1="41" x2="56" y2="63" stroke="#dcd1bf" strokeWidth="0.5" opacity="0.6" />
    <line x1="45" y1="47" x2="59" y2="47" stroke="#dcd1bf" strokeWidth="0.5" opacity="0.6" />
    <line x1="45" y1="53" x2="59" y2="53" stroke="#dcd1bf" strokeWidth="0.5" opacity="0.6" />
    <line x1="45" y1="57" x2="59" y2="57" stroke="#dcd1bf" strokeWidth="0.5" opacity="0.6" />
    <rect x="45" y="67" width="14" height="16" stroke="#dcd1bf" strokeWidth="0.8" fill="none" />
    <circle cx="38.5" cy="64" r="1.5" fill="#dcd1bf" />
    <circle cx="41.5" cy="64" r="1.5" fill="#dcd1bf" />
  </svg>
);

const Footer: React.FC = () => {
  const navLinks = {
    Collections: ['Casa', 'Bagno', 'Luce', 'Su Misura', 'Archive'],
    Company: ['About', 'Atelier', 'Sustainability', 'Careers', 'Press'],
    Contact: ['Indore Studio', 'Enquire', 'Trade Programme', 'WWW.ROCCIA.COM'],
  };

  const footerRef = useRef<HTMLElement>(null);
  const statueWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const wrap = statueWrapRef.current;
    if (!footer || !wrap) return;

    const handleScroll = () => {
      const rect = footer.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 1.8;
      const end = -vh * 0.2;
      const range = start - end;
      let p = (start - rect.top) / range;
      p = p < 0 ? 0 : p > 1 ? 1 : p;
      const eased = 1 - Math.pow(1 - p, 2);
      const startY = 75;
      const endY = 18;
      const y = startY + (endY - startY) * eased;
      wrap.style.transform = `translate3d(-50%, ${y}vh, 0)`;
      wrap.style.opacity = String(Math.min(1, eased * 1.3));
      // Reveal from bottom upward — clip the top of the box, shrinking as p grows
      const clipTop = (1 - eased) * 100;
      const clipStr = `inset(${clipTop}% 0 0 0)`;
      wrap.style.clipPath = clipStr;
      (wrap.style as CSSStyleDeclaration & { WebkitClipPath?: string }).WebkitClipPath = clipStr;
    };

    handleScroll();
    gsap.ticker.add(handleScroll);
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      gsap.ticker.remove(handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <>
      {/* Brand marquee */}
      <div className="marquee-section">
        <div className="marquee-track">
          {[...Array(6)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="marquee-item">
                <span className="marquee-dot" />
                House of Roccia
              </span>
              <span className="marquee-item">
                <span className="marquee-dot" />
                Marble Decor &amp; Artistry
              </span>
              <span className="marquee-item">
                <span className="marquee-dot" />
                Est. 1994
              </span>
              <span className="marquee-item">
                <span className="marquee-dot" />
                Italy&apos;s Finest to Your Doorstep
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <footer ref={footerRef} className="footer" id="contact">
        {/* Large background text */}
        <div className="footer__bg-text">ROCCIA</div>

        {/* 3D angel statue — rises from below as user scrolls into footer */}
        <div
          ref={statueWrapRef}
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 0,
            width: 'min(46vw, 620px)',
            height: 'min(72vh, 820px)',
            transform: 'translate3d(-50%, 55vh, 0)',
            opacity: 0,
            pointerEvents: 'none',
            willChange: 'transform, opacity, clip-path',
            zIndex: 1,
            clipPath: 'inset(100% 0 0 0)',
            WebkitClipPath: 'inset(100% 0 0 0)',
          }}
        >
          <AngelStatue />
        </div>

        <div className="footer__inner">
          {/* Top section */}
          <div className="footer__top">
            {/* Brand column */}
            <div className="footer__brand">
              <div className="footer__brand-logo">
                <RocciaLogoFull />
                <div>
                  <div className="footer__brand-wordmark">Roccia</div>
                  <div className="footer__brand-sub">Marble Decor & Artistry</div>
                </div>
              </div>
              <p className="footer__brand-desc">
                Crafting bespoke marble sculptures and luxury marble decor since 1994. Born in
                Indore, inspired by Italian artistry — transforming raw stone into living art.
              </p>
              <div className="footer__social">
                {['IG', 'LI', 'PI', 'BE'].map((s) => (
                  <motion.a
                    key={s}
                    href="#"
                    className="footer__social-link"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {s}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(navLinks).map(([col, links]) => (
              <div key={col}>
                <h4 className="footer__col-title">{col}</h4>
                <ul className="footer__col-links">
                  {links.map((link) => (
                    <li key={link}>
                      <motion.a
                        href="#"
                        whileHover={{ x: 6, color: '#dcd1bf' }}
                        transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                      >
                        {link}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="footer__bottom">
            <p className="footer__copyright">
              © {new Date().getFullYear()} House of Roccia. All rights reserved.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '2rem',
                alignItems: 'center',
              }}
            >
              <a
                href="#"
                style={{
                  fontFamily: 'Lato, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 300,
                  letterSpacing: '0.2em',
                  color: 'rgba(220,209,191,0.45)',
                  textTransform: 'uppercase',
                  transition: 'color 0.3s',
                }}
              >
                Privacy
              </a>
              <a
                href="#"
                style={{
                  fontFamily: 'Lato, sans-serif',
                  fontSize: '0.85rem',
                  fontWeight: 300,
                  letterSpacing: '0.2em',
                  color: 'rgba(220,209,191,0.45)',
                  textTransform: 'uppercase',
                  transition: 'color 0.3s',
                }}
              >
                Terms
              </a>
            </div>
            <p className="footer__est">EST. 1994</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
