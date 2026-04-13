import React from 'react';
import Hero from '../components/Hero';
import KlingVideo from '../components/KlingVideo';
import MarqueeManifesto from '../components/MarqueeManifesto';
import CasaBagnoLuceScroll from '../components/CasaBagnoLuceScroll';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <section
        className="hero-spacer"
        style={{
          position: 'relative',
          width: '100%',
          height: '60vh',
          background: '#ffffff',
          zIndex: 5,
        }}
      />
      <KlingVideo />
      <MarqueeManifesto />
      <CasaBagnoLuceScroll />
    </>
  );
};

export default Home;
