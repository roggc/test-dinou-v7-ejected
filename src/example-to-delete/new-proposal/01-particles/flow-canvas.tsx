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

// React 19.3 Typed Transitions API
const addTransitionType = (React as unknown as { addTransitionType?: (type: string) => void }).addTransitionType;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export function FlowCanvas() {
  // Opt out of SSR cleanly with React 19.3
  use(browser("Kinetic Particle Flow Field"));

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastTimeRef = useRef<number>(performance.now());
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [colorMode, setColorMode] = useState<"indigo" | "emerald" | "sky">("indigo");
  const [frameCount, setFrameCount] = useState(0);

  // useEffectEvent decouples continuous animation from reactive state changes
  const onRenderFrame = useEffectEvent(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      particles: Particle[]
    ) => {
      ctx.clearRect(0, 0, width, height);

      const themeColors = {
        indigo: { stroke: "rgba(99, 102, 241, 0.22)", point: "rgba(129, 140, 248, 0.9)" },
        emerald: { stroke: "rgba(16, 185, 129, 0.22)", point: "rgba(52, 211, 153, 0.9)" },
        sky: { stroke: "rgba(14, 165, 233, 0.22)", point: "rgba(56, 189, 248, 0.9)" },
      };
      const colors = themeColors[colorMode];

      // Update & render particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx * speedMultiplier;
        p.y += p.vy * speedMultiplier;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = colors.point;
        ctx.fill();

        // Connect nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 85) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = colors.stroke;
            ctx.lineWidth = 1 - dist / 85;
            ctx.stroke();
          }
        }
      }
    }
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Seed particles only once so distribution persists across <Activity> tab switches
    if (particlesRef.current.length === 0) {
      const initialParticles: Particle[] = [];
      const count = 42;
      for (let i = 0; i < count; i++) {
        initialParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          radius: Math.random() * 2 + 1.5,
        });
      }
      particlesRef.current = initialParticles;
    }

    // Kinematic fast-forward: if switching back after being hidden in <Activity>,
    // advance positions proportionally to elapsed time so movement continues naturally
    const now = performance.now();
    const elapsedSeconds = Math.min((now - lastTimeRef.current) / 1000, 5); // cap at 5s to prevent overshoot
    if (elapsedSeconds > 0.05) {
      const steps = Math.min(Math.round(elapsedSeconds * 60), 120);
      for (let s = 0; s < steps; s++) {
        for (let i = 0; i < particlesRef.current.length; i++) {
          const p = particlesRef.current[i];
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        }
      }
    }
    lastTimeRef.current = now;

    let animId: number;
    let localFrames = 0;

    const loop = () => {
      onRenderFrame(ctx, width, height, particlesRef.current);
      localFrames++;
      if (localFrames % 30 === 0) {
        setFrameCount(localFrames);
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      lastTimeRef.current = performance.now();
    };
  }, []);

  return (
    <div className="bg-white/95 border border-slate-200/90 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-lg flex flex-col justify-between">
      {/* Top Header: Framework & React 19.3 Capabilities */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-200/80">
        <div className="max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="text-xs font-semibold text-slate-800">
              Kinetic Particle Network — use(browser()) &amp; &lt;Activity&gt;
            </span>
          </div>
          <span className="text-[11px] text-slate-600 block mt-0.5 leading-snug">
            <strong>Demonstrates SSR Skip &amp; Offscreen Fiber:</strong> <code>use(browser())</code> cleanly excludes HTML5 Canvas 2D from server execution without hydration errors, while <code>&lt;Activity&gt;</code> and <code>useEffectEvent</code> preserve 60 FPS particle physics and memory state when switching across tabs.
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Color Switcher with ViewTransition */}
          <div className="flex bg-slate-100 border border-slate-200 rounded-lg p-0.5 text-xs font-sans font-medium relative">
            {(["indigo", "emerald", "sky"] as const).map((m) => {
              const isSelected = colorMode === m;
              return (
                <button
                  key={m}
                  onClick={() => {
                    startTransition(() => {
                      addTransitionType?.("color-pill");
                      setColorMode(m);
                    });
                  }}
                  className="relative px-2.5 py-0.5 rounded capitalize transition cursor-pointer font-sans font-medium"
                >
                  {isSelected && (
                    <ViewTransition name="p5-color-pill">
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
                    {m}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setSpeedMultiplier((s) => (s === 1 ? 2 : s === 2 ? 0.5 : 1))}
            className="text-xs font-sans font-medium px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 transition cursor-pointer shadow-2xs"
          >
            Velocity: {speedMultiplier}x
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner mb-3">
        <canvas
          ref={canvasRef}
          width={720}
          height={220}
          className="w-full h-52 sm:h-56 block"
        />
        <div className="absolute top-2.5 left-3 text-[11px] font-sans font-medium text-slate-400 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>FIBER STATE: PRESERVED IN MEMORY</span>
        </div>
        <div className="absolute bottom-2.5 right-3 text-[11px] font-sans font-medium text-slate-400">
          CYCLE: #{frameCount}
        </div>
      </div>

      {/* Persistent Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-sans font-medium text-slate-500 px-1">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>KEY CAPABILITY: HTML5 Canvas cleanly opted out of SSR • Physics preserved across tab switches via &lt;Activity&gt;</span>
        </div>
        <span>60 FPS KINEMATICS &bull; TYPED VIEWTRANSITION</span>
      </div>
    </div>
  );
}

export function FlowCanvasFallback() {
  return (
    <div className="bg-white/80 border border-slate-200 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px] animate-pulse">
      <span className="text-xs font-sans font-medium text-slate-500 uppercase tracking-wider mb-1">
        Canvas Skeleton (SSR Fallback)
      </span>
      <p className="text-xs text-slate-400 text-center max-w-sm">
        <code>use(browser())</code> yielded server render to Suspense. Client hydrates immediately.
      </p>
    </div>
  );
}
