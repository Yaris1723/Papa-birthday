import React, { useEffect, useRef } from 'react';

/**
 * High-performance Canvas Starfield
 * Renders glowing, pulsating yellow/golden glittering stars on a pure black background.
 */
export default function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener('resize', handleResize);

    // Star data structures
    const stars = [];
    const numStars = Math.min(220, Math.floor((width * height) / 5000));

    // Warm, glittering yellow/gold palettes
    const starColors = [
      '#fef08a', // light golden yellow
      '#fde047', // bright sunflower yellow
      '#fbbf24', // warm amber gold
      '#eab308', // pure gold
      '#ffffff', // diamond white core
    ];

    function initStars() {
      stars.length = 0;
      for (let i = 0; i < numStars; i++) {
        // Distribute star types:
        // 70% tiny glittering dots
        // 20% medium glowing stars
        // 10% brilliant 4-point sparkle stars
        const rand = Math.random();
        let type = 'dot';
        if (rand > 0.88) {
          type = 'sparkle';
        } else if (rand > 0.68) {
          type = 'glow';
        }

        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.8 + 0.6,
          color: starColors[Math.floor(Math.random() * starColors.length)],
          alpha: Math.random() * 0.7 + 0.3,
          minAlpha: Math.random() * 0.2 + 0.1,
          maxAlpha: Math.random() * 0.6 + 0.4,
          speed: Math.random() * 0.03 + 0.015,
          phase: Math.random() * Math.PI * 2,
          type,
          sparkleSize: Math.random() * 5 + 4,
          sparkleRotation: Math.random() * Math.PI,
          rotationSpeed: (Math.random() - 0.5) * 0.005,
        });
      }
    }

    initStars();

    // Draw 4-point diamond sparkle star
    function drawSparkle(ctx, cx, cy, size, color, alpha, rotation) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.globalAlpha = alpha;

      // Glow behind sparkle
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 2.2);
      grad.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
      grad.addColorStop(0.3, 'rgba(251, 191, 36, 0.4)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, size * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Sharp 4-point cross rays
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      // Horizontal ray
      ctx.moveTo(-size * 1.8, 0);
      ctx.quadraticCurveTo(0, 0, 0, -size * 0.3);
      ctx.quadraticCurveTo(0, 0, size * 1.8, 0);
      ctx.quadraticCurveTo(0, 0, 0, size * 0.3);
      ctx.closePath();
      ctx.fill();

      // Vertical ray
      ctx.beginPath();
      ctx.moveTo(0, -size * 1.8);
      ctx.quadraticCurveTo(0, 0, size * 0.3, 0);
      ctx.quadraticCurveTo(0, 0, 0, size * 1.8);
      ctx.quadraticCurveTo(0, 0, -size * 0.3, 0);
      ctx.closePath();
      ctx.fill();

      // Golden center point
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // Animation Loop
    function render() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Twinkle oscillation
        star.phase += star.speed;
        const currentAlpha =
          star.minAlpha +
          (Math.sin(star.phase) * 0.5 + 0.5) * (star.maxAlpha - star.minAlpha);

        if (star.type === 'sparkle') {
          star.sparkleRotation += star.rotationSpeed;
          drawSparkle(
            ctx,
            star.x,
            star.y,
            star.sparkleSize,
            star.color,
            currentAlpha,
            star.sparkleRotation
          );
        } else if (star.type === 'glow') {
          ctx.save();
          ctx.globalAlpha = currentAlpha;

          // Radial golden haze
          const grad = ctx.createRadialGradient(
            star.x,
            star.y,
            0,
            star.x,
            star.y,
            star.radius * 3.5
          );
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.3, star.color);
          grad.addColorStop(1, 'transparent');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          // Standard twinkling golden dot
          ctx.save();
          ctx.globalAlpha = currentAlpha;
          ctx.fillStyle = star.color;
          ctx.shadowBlur = 4;
          ctx.shadowColor = '#fbbf24';
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
