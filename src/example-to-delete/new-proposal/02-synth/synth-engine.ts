// Clean Minimalist Web Audio Synthesizer Engine
let audioCtx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.connect(audioCtx.destination);
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function getAnalyser(): AnalyserNode | null {
  getAudioContext();
  return analyser;
}

// Play an elegant ambient harmonic synth tone with configurable sustain duration
export function playHarmonicChord(
  noteIndex: number = 0,
  volume: number = 0.25,
  duration: number = 2.5
) {
  const ctx = getAudioContext();
  if (!ctx || !analyser) return;

  const now = ctx.currentTime;
  // Pentatonic musical scale (A2, C3, D3, E3, G3, A3, C4, E4)
  const freqs = [110, 130.81, 146.83, 164.81, 196.0, 220.0, 261.63, 329.63];
  const rootFreq = freqs[noteIndex % freqs.length];

  // Dual oscillator: sine + gentle triangle for warm, elegant tone
  [rootFreq, rootFreq * 1.5, rootFreq * 2].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = i === 0 ? "sine" : "triangle";
    osc.frequency.setValueAtTime(freq, now);

    // Smooth ambient envelope (soft attack, lingering warm decay)
    const attackTime = Math.min(0.06, duration * 0.1);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume * (0.6 / (i + 1)), now + attackTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(analyser!);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  });
}
