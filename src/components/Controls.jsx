import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Maximize2,
  Minimize2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Controls({
  flippedCount,
  totalLeaves,
  onNext,
  onPrev,
  onReset,
  soundEnabled,
  onToggleSound,
}) {
  const isCover = flippedCount === 0;
  const isBackCover = flippedCount === totalLeaves;

  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#fbbf24', '#f43f5e', '#a855f7', '#38bdf8', '#34d399', '#ec4899']
    });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Determine human-friendly page label
  let pageLabel = "Cover";
  if (isCover) {
    pageLabel = "Front Cover";
  } else if (isBackCover) {
    pageLabel = "Back Cover";
  } else {
    const leftPage = (flippedCount - 1) * 2 + 1;
    const rightPage = leftPage + 1;
    pageLabel = `Pages ${leftPage} – ${rightPage}`;
  }

  return (
    <div className="controls-container">
      {/* Navigation Pills */}
      <div className="controls-bar">
        {/* Previous Button */}
        <button
          className={`control-btn nav-btn ${isCover ? 'disabled' : ''}`}
          onClick={onPrev}
          disabled={isCover}
          title="Previous Page (Left Arrow)"
        >
          <ChevronLeft size={18} />
          <span className="btn-text">Prev</span>
        </button>

        {/* Page status */}
        <div className="page-indicator">
          <span className="indicator-label">{pageLabel}</span>
          <span className="indicator-sub">
            {isCover ? "Click to open" : `${flippedCount} / ${totalLeaves} leaves`}
          </span>
        </div>

        {/* Next Button */}
        <button
          className="control-btn nav-btn primary-nav-btn"
          onClick={onNext}
          title="Next Page (Right Arrow or Space)"
        >
          <span className="btn-text">{isBackCover ? "Reopen" : "Next"}</span>
          <ChevronRight size={18} />
        </button>

        <div className="controls-divider" />

        {/* Reset Button */}
        <button
          className="control-btn icon-btn"
          onClick={onReset}
          title="Close book and return to front cover"
        >
          <RotateCcw size={16} />
        </button>

        {/* Sound Toggle */}
        <button
          className={`control-btn icon-btn ${soundEnabled ? 'active-icon' : ''}`}
          onClick={onToggleSound}
          title={soundEnabled ? "Mute flip sound" : "Enable flip sound"}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        {/* Confetti Celebration */}
        <button
          className="control-btn icon-btn confetti-btn"
          onClick={triggerCelebration}
          title="Confetti celebration! 🎉"
        >
          <Sparkles size={16} />
        </button>

        {/* Fullscreen Button */}
        <button
          className="control-btn icon-btn"
          onClick={toggleFullscreen}
          title="Toggle Fullscreen"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      <div className="keyboard-hint">
        <span>Click left/right pages or use keys <kbd>←</kbd> <kbd>→</kbd> <kbd>Space</kbd></span>
      </div>
    </div>
  );
}
