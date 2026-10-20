import React, { useState, useRef, useEffect } from 'react';
import InteractiveBook from './components/InteractiveBook';
import Controls from './components/Controls';
import Starfield from './components/Starfield';
import { bookConfig as initialConfig, bookPages as initialPages } from './bookData';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState(initialConfig);
  const [pages, setPages] = useState(initialPages);
  const [soundEnabled, setSoundEnabled] = useState(initialConfig.soundEnabledDefault ?? true);
  const [flippedCount, setFlippedCount] = useState(0);
  const [totalLeaves, setTotalLeaves] = useState(0);
  const [scale, setScale] = useState(1);

  const bookRef = useRef(null);

  // Auto-scale book on smaller screens so the opened 2-page spread fits comfortably
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // When open, book is width * 2
      const targetWidth = config.width * 2 + 100; // adding margin
      const targetHeight = config.height + 220;  // adding header & controls margin

      const scaleX = screenWidth / targetWidth;
      const scaleY = screenHeight / targetHeight;
      const fitScale = Math.min(1, Math.min(scaleX, scaleY));

      // Limit min scale to 0.45
      setScale(Math.max(0.45, Number(fitScale.toFixed(2))));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [config.width, config.height]);

  const handlePageChange = (flipped, total) => {
    setFlippedCount(flipped);
    setTotalLeaves(total);
  };

  const handleNext = () => bookRef.current?.next();
  const handlePrev = () => bookRef.current?.prev();
  const handleReset = () => bookRef.current?.reset();

  return (
    <div className="app-container">
      {/* Black night sky with glittering yellow/gold stars */}
      <Starfield />

      {/* Top Header */}
      <header className="app-header">
        <div className="header-badge">
          <Sparkles size={14} className="gold-icon" />
          <span>CELEBRATING</span>
          <Sparkles size={14} className="gold-icon" />
        </div>
        <h1 className="header-title">{config.personName}'s Birthday Book</h1>
        <p className="header-subtitle">{config.subtitle}</p>
      </header>

      {/* 3D Book Stage */}
      <main className="book-stage">
        <div
          className="book-scale-wrapper"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            transition: 'transform 0.25s ease-out',
          }}
        >
          <InteractiveBook
            ref={bookRef}
            width={config.width}
            height={config.height}
            pages={pages}
            borderRadius={config.borderRadius}
            shadow={config.shadow}
            soundEnabled={soundEnabled}
            onPageChange={handlePageChange}
            allowPrevClick={true}
          />
        </div>
      </main>

      {/* Floating Bottom Navigation Toolbar */}
      <footer className="app-footer">
        <Controls
          flippedCount={flippedCount}
          totalLeaves={totalLeaves}
          onNext={handleNext}
          onPrev={handlePrev}
          onReset={handleReset}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled((prev) => !prev)}
        />
      </footer>
    </div>
  );
}
