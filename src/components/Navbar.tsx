import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const Navbar: React.FC = () => {
  const navRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show navbar after loader delay
    const showTimer = setTimeout(() => setVisible(true), 1300);

    const nav = navRef.current;
    if (!nav) return;

    let lastScrollY = 0;
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const goingDown = currentY > lastScrollY;
        const pastThreshold = currentY > 100;

        if (goingDown && pastThreshold) {
          nav.style.transform = 'translateX(-50%) translateY(-120px)';
          nav.style.opacity = '0';
        } else {
          nav.style.transform = 'translateX(-50%) translateY(0)';
          nav.style.opacity = '1';
        }

        // Floating style
        if (currentY > 80) {
          nav.classList.add('navbar--floating');
        } else {
          nav.classList.remove('navbar--floating');
        }

        lastScrollY = currentY;
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(showTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className="navbar"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? 'translateX(-50%) translateY(0)'
          : 'translateX(-50%) translateY(-30px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
      }}
    >
      {/* Left Nav */}
      <ul className="navbar__nav">
        {[
          { label: 'Collections', to: '/#collections' },
          { label: 'About', to: '/about' },
        ].map((item) => (
          <li key={item.label}>
            <motion.div
              whileHover={{ letterSpacing: '0.35em' }}
              transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            >
              <Link to={item.to}>{item.label}</Link>
            </motion.div>
          </li>
        ))}
      </ul>

      {/* Center Logo */}
      <Link to="/" className="navbar__logo">
        <span className="navbar__logo-wordmark">Roccia</span>
        <span className="navbar__logo-sub">Marble Decor & Artistry</span>
      </Link>

      {/* Right Nav */}
      <ul className="navbar__nav">
        {[
          { label: 'Artistry', to: '/#artistry' },
          { label: 'Contact', to: '/#contact' },
        ].map((item) => (
          <li key={item.label}>
            <motion.div
              whileHover={{ letterSpacing: '0.35em' }}
              transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            >
              <Link to={item.to}>{item.label}</Link>
            </motion.div>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
