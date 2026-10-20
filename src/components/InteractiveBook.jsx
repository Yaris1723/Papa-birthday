import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { PageRenderer } from './PageTemplates';
import { playPageFlipSound } from '../utils/sound';

/**
 * InteractiveBook Component
 *
 * Implements the 3D flipping physics from Framer's InteractiveBook,
 * enhanced with backward flipping, keyboard navigation, sound effects,
 * and support for both image URLs and rich custom page components.
 */
const InteractiveBook = forwardRef(function InteractiveBook(props, ref) {
  const {
    width = 400,
    height = 600,
    frontCover,
    backCover,
    innerPages = [],
    pages = null, // Optional all-in-one pages array (supports rich templates)
    shadow = {
      color: "#000",
      opacity: 0.35,
      blur: 20,
      offsetX: 6,
      offsetY: 8,
      spread: 0
    },
    borderRadius = 10,
    soundEnabled = true,
    onPageChange = null,
    allowPrevClick = true,
  } = props;

  // Prepare images / page items array
  const rawPages = pages
    ? pages
    : [frontCover, ...innerPages, backCover].filter(Boolean);

  const allPages = rawPages.length % 2 === 0 ? rawPages : [...rawPages, null];

  // Group pages into leaves (2 faces per leaf: front [even] and back [odd])
  const leafPairs = [];
  for (let i = 0; i < allPages.length; i += 2) {
    leafPairs.push([allPages[i], allPages[i + 1]]);
  }

  const totalLeaves = leafPairs.length;
  const [flippedCount, setFlippedCount] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const flippedCountRef = useRef(flippedCount);
  flippedCountRef.current = flippedCount;

  // Book container slide controls
  const bookContainerControls = useAnimationControls();

  // Create controls pool for leaves
  const controlsPool = Array.from({ length: Math.max(totalLeaves, 50) }, () =>
    useAnimationControls()
  );

  // Helper for shadow rgba
  const getRgba = (color = "#000", alpha = 0.35) => {
    if (!color) return `rgba(0,0,0,${alpha})`;
    const hex = color.replace("#", "");
    const r = parseInt(hex.length === 3 ? hex[0] + hex[0] : hex.slice(0, 2), 16) || 0;
    const g = parseInt(hex.length === 3 ? hex[1] + hex[1] : hex.slice(2, 4), 16) || 0;
    const b = parseInt(hex.length === 3 ? hex[2] + hex[2] : hex.slice(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const shadowCol = getRgba(shadow.color, shadow.opacity);
  const closedBookShadow = `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.spread}px ${shadowCol}`;

  // Notify parent of page index changes
  useEffect(() => {
    if (onPageChange) {
      onPageChange(flippedCount, totalLeaves);
    }
  }, [flippedCount, totalLeaves, onPageChange]);

  // Flip Forward: Next page
  const flipNext = async () => {
    if (isFlipping) return;
    const current = flippedCountRef.current;

    if (current === 0) {
      // Opening book: slide container to the right so open spread is centered
      bookContainerControls.start({
        x: width / 2,
        transition: { duration: 0.6, ease: "easeInOut" }
      });
    }

    if (current < totalLeaves) {
      setIsFlipping(true);
      if (soundEnabled) playPageFlipSound();

      const indexToFlip = current;
      setFlippedCount(current + 1);

      await controlsPool[indexToFlip].start({
        rotateY: -180,
        transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] }
      });
      setIsFlipping(false);
    } else {
      // Reached the end: Close book back to start
      await resetBook();
    }
  };

  // Flip Backward: Previous page
  const flipPrev = async () => {
    if (isFlipping) return;
    const current = flippedCountRef.current;
    if (current <= 0) return;

    setIsFlipping(true);
    if (soundEnabled) playPageFlipSound();

    const indexToUnflip = current - 1;
    setFlippedCount(current - 1);

    // If un-flipping back to the front cover, slide container back to center
    if (indexToUnflip === 0) {
      bookContainerControls.start({
        x: 0,
        transition: { duration: 0.7, ease: "easeInOut" }
      });
    }

    await controlsPool[indexToUnflip].start({
      rotateY: 0,
      transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] }
    });
    setIsFlipping(false);
  };

  // Reset Book: Close all leaves sequentially
  const resetBook = async () => {
    setIsFlipping(true);
    if (soundEnabled) playPageFlipSound(0.2);

    bookContainerControls.start({
      x: 0,
      transition: { duration: 0.8, ease: "easeInOut" }
    });

    const current = flippedCountRef.current;
    for (let i = current - 1; i >= 0; i--) {
      controlsPool[i].start({
        rotateY: 0,
        transition: { duration: 0.45, ease: "easeInOut" }
      });
      await new Promise((r) => setTimeout(r, 70));
    }

    setFlippedCount(0);
    setIsFlipping(false);
  };

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    next: flipNext,
    prev: flipPrev,
    reset: resetBook,
    getFlippedCount: () => flippedCountRef.current,
    getTotalLeaves: () => totalLeaves,
  }));

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        flipNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        flipPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle click on book: detect left or right side when open
  const handleBookClick = (e) => {
    // If user clicked inside an interactive button (e.g. candle button), don't flip
    if (e.target.closest('button') || e.target.closest('.cake-stage')) {
      return;
    }

    if (flippedCount === 0) {
      // When closed, any click opens forward
      flipNext();
      return;
    }

    if (!allowPrevClick) {
      // Strict original Framer mode (always forward)
      flipNext();
      return;
    }

    // Get click position relative to the opened book
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const bookCenterX = rect.width / 2;

    if (clickX < bookCenterX) {
      // Left side clicked -> Flip backward
      flipPrev();
    } else {
      // Right side clicked -> Flip forward
      flipNext();
    }
  };

  const isBookClosed = flippedCount === 0;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        perspective: 2500,
        cursor: isFlipping ? "wait" : "pointer",
        overflow: "visible",
        userSelect: "none",
      }}
      onClick={handleBookClick}
    >
      <motion.div
        animate={bookContainerControls}
        initial={{ x: 0 }}
        style={{
          width,
          height,
          position: "relative",
          transformStyle: "preserve-3d",
          boxShadow: isBookClosed ? closedBookShadow : "0px 10px 30px rgba(0,0,0,0.15)",
          borderRadius: `${borderRadius}px`,
          transition: "box-shadow 0.4s ease",
        }}
      >
        {leafPairs.map(([frontContent, backContent], index) => {
          const isFlipped = index < flippedCount;
          const isCurrentlyMoving = index === flippedCount - 1 || index === flippedCount;

          // Subtle 3D thickness (0.4px per page)
          const zOffset = isFlipped ? index * 0.4 : (totalLeaves - index) * 0.4;

          // Prevent z-fighting during flip
          const zIndex = isCurrentlyMoving ? 100 : isFlipped ? index : totalLeaves - index;

          return (
            <motion.div
              key={index}
              animate={controlsPool[index]}
              initial={{ rotateY: 0 }}
              style={{
                position: "absolute",
                inset: 0,
                transformOrigin: "left center",
                transformStyle: "preserve-3d",
                zIndex: zIndex,
                transform: `translateZ(${zOffset}px)`,
                willChange: "transform",
              }}
            >
              {/* FRONT OF LEAF (Right side when flat, flips over) */}
              <div
                style={{
                  ...faceStyle,
                  borderRadius: `0px ${borderRadius}px ${borderRadius}px 0px`,
                }}
              >
                <PageRenderer pageData={frontContent} isBackFace={false} />
                {/* Book spine shadow gradient */}
                <div style={spineGradientFront} />
              </div>

              {/* BACK OF LEAF (Left side when flipped) */}
              <div
                style={{
                  ...faceStyle,
                  transform: "rotateY(180deg) translateZ(0.01px)",
                  borderRadius: `${borderRadius}px 0px 0px ${borderRadius}px`,
                }}
              >
                <PageRenderer pageData={backContent} isBackFace={true} />
                {/* Mirrored book spine shadow gradient */}
                <div style={spineGradientBack} />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
});

export default InteractiveBook;

// Styles matching Framer InteractiveBook specs
const faceStyle = {
  position: "absolute",
  inset: 0,
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
  backgroundColor: "#fcfbfa",
  overflow: "hidden",
};

const spineGradientFront = {
  position: "absolute",
  left: 0,
  top: 0,
  bottom: 0,
  width: "14%",
  background: "linear-gradient(to right, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.06) 40%, transparent 100%)",
  pointerEvents: "none",
  zIndex: 10,
};

const spineGradientBack = {
  position: "absolute",
  left: "auto",
  right: 0,
  top: 0,
  bottom: 0,
  width: "14%",
  background: "linear-gradient(to left, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.06) 40%, transparent 100%)",
  pointerEvents: "none",
  zIndex: 10,
};
