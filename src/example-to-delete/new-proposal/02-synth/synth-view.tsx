"use client";

import * as React from "react";
import {
  use,
  useRef,
  useEffect,
  useState,
  useEffectEvent,
  startTransition,
  ViewTransition,
} from "react";
import { browser } from "react-dom";
import { getAnalyser, playHarmonicChord } from "./synth-engine";

// React 19.3 Typed Transitions API
const addTransitionType = (React as unknown as { addTransitionType?: (type: string) => void }).addTransitionType;

export function SynthView() {
  // Opt out of SSR cleanly with React 19.3
  use(browser("Requires HTML5 Canvas and Web Audio API"));

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [audioActive, setAudioActive] = useState(false);
  const [duration, setDuration] = useState<number>(6); // Default 6s
  const audioTimerRef = useRef<number | null>(null);

  // Decouple canvas rendering loop from state changes via useEffectEvent
  const onDrawOscilloscope = useEffectEvent((ctx: CanvasRenderingContext2D, width: number, height: number, analyserNode: AnalyserNode | null) => {
    ctx.fillStyle = "rgba(8, 9, 13, 0.3)";
    ctx.fillRect(0, 0, width, height);

    const bufferLength = analyserNode ? analyserNode.frequencyBinCount : 32;
    const dataArray = new Uint8Array(bufferLength);

    if (analyserNode && audioActive) {
      analyserNode.getByteTimeDomainData(dataArray);
    } else {
      // Idle harmonic sine wave animation
      const time = performance.now() * 0.0025;
      for (let i = 0; i < bufferLength; i++) {
        dataArray[i] = 128 + Math.sin(time + i * 0.25) * 28;
      }
    }

    // Oscilloscope beam
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#818cf8"; // Indigo glow
    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(129, 140, 248, 0.6)";

    ctx.beginPath();
    const sliceWidth = width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    ctx.lineTo(width, height / 2);
    ctx.stroke();
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const analyserNode = getAnalyser();
      onDrawOscilloscope(ctx, canvas.width, canvas.height, analyserNode);
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  const handlePad = (index: number) => {
    setActivePad(index);
    setAudioActive(true);

    // Play tone with selected duration
    playHarmonicChord(index, 0.22, duration);

    // Reset visual flash
    setTimeout(() => {
      setActivePad(null);
    }, 180);

    // Track active audio state based on user selected sustain duration
    if (audioTimerRef.current) {
      clearTimeout(audioTimerRef.current);
    }
    audioTimerRef.current = window.setTimeout(() => {
      setAudioActive(false);
    }, duration * 1000);
  };

  const NOTES = ["A2", "C3", "D3", "E3", "G3", "A3", "C4", "E4"];

  return (
    <div className="bg-white/95 border border-slate-200/90 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-lg flex flex-col justify-between">
      {/* Top Header: Framework & React 19.3 Capabilities */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-200/80">
        <div className="max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="text-xs font-semibold text-slate-800">
              Web Audio Synthesizer — Background Audio &amp; &lt;Activity&gt;
            </span>
          </div>
          <span className="text-[11px] text-slate-600 block mt-0.5 leading-snug">
            <strong>Demonstrates Web Audio &amp; Persistent Lifecycle:</strong> <code>use(browser())</code> defers Web Audio context safely to the client without hydration issues, while <code>&lt;Activity&gt;</code> keeps the harmonic audio oscillator and sustain timers playing uninterrupted even if you switch between use cases.
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Sustain Duration Selector with ViewTransition */}
          <div className="flex items-center gap-1.5 text-xs font-sans font-medium text-slate-500">
            <span className="hidden sm:inline">Sustain:</span>
            <div className="flex bg-slate-100 border border-slate-200 rounded-lg p-0.5 text-xs font-sans font-medium relative">
              {[
                { label: "0.8s", value: 0.8 },
                { label: "2.5s", value: 2.5 },
                { label: "6s", value: 6 },
                { label: "12s", value: 12 },
              ].map((d) => {
                const isSelected = duration === d.value;
                return (
                  <button
                    key={d.label}
                    onClick={() => {
                      startTransition(() => {
                        addTransitionType?.("duration-pill");
                        setDuration(d.value);
                      });
                    }}
                    className="relative px-2.5 py-0.5 rounded transition cursor-pointer font-sans font-medium"
                  >
                    {isSelected && (
                      <ViewTransition name="p5-duration-pill">
                        <span className="absolute inset-0 bg-white rounded shadow-xs border border-slate-200/80" />
                      </ViewTransition>
                    )}
                    <span
                      className={`relative z-10 transition-colors font-sans font-medium ${
                        isSelected
                          ? "text-slate-900"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {d.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <span className={`text-xs font-sans font-medium px-2.5 py-0.5 rounded-md border transition-colors ${
            audioActive
              ? "text-emerald-700 bg-emerald-50 border-emerald-300"
              : "text-slate-500 bg-slate-100 border-slate-200"
          }`}>
            {audioActive ? "AUDIO: PLAYING" : "HIT A PAD"}
          </span>
        </div>
      </div>

      {/* Oscilloscope Screen */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner mb-3">
        <canvas
          ref={canvasRef}
          width={720}
          height={220}
          className="w-full h-52 sm:h-56 block"
        />
        <div className="absolute top-2.5 left-3 text-[11px] font-sans font-medium text-slate-400 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>FIBER OSCILLATOR: PERSISTENT IN BACKGROUND</span>
        </div>
        <div className="absolute bottom-2.5 right-3 text-[11px] font-sans font-medium text-slate-400">
          A MINOR PENTATONIC &bull; {duration}s SUSTAIN
        </div>
      </div>

      {/* Harmonic Chord Pads */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-3">
        {NOTES.map((note, i) => (
          <button
            key={note}
            onClick={() => handlePad(i)}
            className={`py-2 px-1 rounded-xl border font-sans text-xs font-medium transition cursor-pointer active:scale-95 text-center ${
              activePad === i
                ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/30 font-semibold"
                : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900 shadow-2xs"
            }`}
          >
            {note}
          </button>
        ))}
      </div>

      {/* Persistent Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-sans font-medium text-slate-500 px-1">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>KEY CAPABILITY: Audio oscillators &amp; timers survive tab switches • Hit a pad and change case to verify</span>
        </div>
        <span>A MINOR PENTATONIC &bull; {duration}s SUSTAIN</span>
      </div>
    </div>
  );
}

export function SynthViewFallback() {
  return (
    <div className="bg-white/80 border border-slate-200 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px] animate-pulse">
      <span className="text-xs font-sans font-medium text-slate-500 uppercase tracking-wider mb-1">
        Synthesizer Skeleton (SSR Fallback)
      </span>
      <p className="text-xs text-slate-400 text-center max-w-sm">
        <code>use(browser())</code> deferred audio context to client. Ready in a flash.
      </p>
    </div>
  );
}
