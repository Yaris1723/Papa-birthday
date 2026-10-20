// Web Audio API synthesizer for realistic page flip sound
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playPageFlipSound(volume = 0.3) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const sampleRate = ctx.sampleRate;
    const duration = 0.22; // ~220ms page swoosh
    const buffer = ctx.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    // Generate shaped white noise for paper friction
    for (let i = 0; i < buffer.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sampleRate * 0.08));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter to paper flutter frequency range
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + duration);
    filter.Q.setValueAtTime(1.2, ctx.currentTime);

    // Gain envelope (soft attack, quick decay)
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noise.start();
    noise.stop(ctx.currentTime + duration);
  } catch (err) {
    // Audio context may be blocked before user gesture
    console.warn('Audio playback error:', err);
  }
}
