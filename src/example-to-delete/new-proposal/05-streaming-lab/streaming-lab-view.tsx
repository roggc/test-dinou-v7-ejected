"use client";

import { useState, Suspense, use, type ReactNode } from "react";
import { telemetryStreamCard } from "./server-functions/streaming-demo";

type LabMode = "streaming" | "blocking";

function StreamCard({
  streamPromise,
}: {
  streamPromise: Promise<ReactNode>;
}) {
  const content = use(streamPromise);
  return <>{content}</>;
}

export function StreamingLabView() {
  const [mode, setMode] = useState<LabMode>("streaming");
  const [latencyMs, setLatencyMs] = useState(900);
  const [fetchKey, setFetchKey] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamPromise, setStreamPromise] = useState<Promise<ReactNode>>(() =>
    telemetryStreamCard(900)
  );

  const triggerFetch = () => {
    setIsStreaming(true);
    setFetchKey((k) => k + 1);
    if (mode === "blocking") {
      setTimeout(() => {
        setIsStreaming(false);
      }, latencyMs);
    } else {
      const p = telemetryStreamCard(latencyMs);
      p.finally(() => {
        setIsStreaming(false);
      });
      setStreamPromise(p);
    }
  };

  const switchMode = (newMode: LabMode) => {
    setMode(newMode);
    setIsStreaming(false);
  };

  const handleLatencyChange = (ms: number) => {
    setLatencyMs(ms);
    setIsStreaming(true);
    setFetchKey((k) => k + 1);
    if (mode === "blocking") {
      setTimeout(() => {
        setIsStreaming(false);
      }, ms);
    } else {
      const p = telemetryStreamCard(ms);
      p.finally(() => {
        setIsStreaming(false);
      });
      setStreamPromise(p);
    }
  };

  return (
    <div className="w-full bg-white/95 border border-slate-200/90 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-lg flex flex-col justify-between font-sans">
      {/* Top Header: Framework & React Capabilities */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-200/80 w-full">
        <div className="max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-xs font-semibold text-slate-800">
              RSC Streaming vs. Blocking TTFB: Server Latency Lab
            </span>
          </div>
          <span className="text-[11px] text-slate-600 block mt-0.5 leading-snug">
            In dynamic rendering (SSR / dev), top-level <code>await</code> blocks the initial HTML response. Wrapping Server Functions in <code>&lt;Suspense&gt;</code> delivers the shell in <strong>&lt;10ms</strong> and streams data chunks concurrently.
          </span>
        </div>

        <span
          className={`text-[11px] font-sans font-medium px-2.5 py-1 rounded-md border transition-colors ${
            isStreaming
              ? mode === "streaming"
                ? "text-blue-800 bg-blue-50 border-blue-300 animate-pulse font-semibold"
                : "text-rose-800 bg-rose-50 border-rose-300 animate-pulse font-semibold"
              : "text-blue-700 bg-blue-50 border-blue-200"
          }`}
        >
          {isStreaming
            ? mode === "streaming"
              ? "⚡ STREAMING FROM NODE.JS..."
              : `⏳ WAITING NODE.JS TTFB (${latencyMs}ms)...`
            : "STREAMING ENGINE: READY"}
        </span>
      </div>

      {/* Main Dual-Card Stage - locked to 50/50 columns & fixed 235px height */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 w-full items-start">
        {/* Card 1: Interactive Streaming Simulator */}
        <div className="w-full min-w-0 rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 flex flex-col justify-between relative h-[235px] min-h-[235px] max-h-[235px] shadow-2xs overflow-hidden">
          {/* Top Bar: Mode Selector & Latency Controller */}
          <div className="flex items-center justify-between w-full h-5 shrink-0">
            <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-slate-500">
              1. Live Stream Simulator
            </span>

            {/* Mode Pills */}
            <div className="flex items-center bg-slate-200/60 p-0.5 rounded-lg text-[10px] font-sans font-medium">
              <button
                type="button"
                onClick={() => switchMode("streaming")}
                className={`px-2 py-0.5 rounded transition cursor-pointer ${
                  mode === "streaming"
                    ? "bg-white text-blue-700 font-semibold shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Streaming (&lt;Suspense&gt;)
              </button>
              <button
                type="button"
                onClick={() => switchMode("blocking")}
                className={`px-2 py-0.5 rounded transition cursor-pointer ${
                  mode === "blocking"
                    ? "bg-white text-rose-700 font-semibold shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Blocking SSR
              </button>
            </div>
          </div>

          {/* Dynamic Stage Content */}
          <div className="my-auto py-1 flex flex-col justify-between h-[135px] shrink-0">
            {mode === "streaming" ? (
              <Suspense
                key={`stream-${fetchKey}-${latencyMs}`}
                fallback={
                  <div className="h-full flex flex-col justify-center gap-2 p-3 bg-white border border-blue-200 rounded-lg shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-blue-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                        HTML Shell Delivered (10ms)
                      </span>
                      <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/60">
                        Awaiting {latencyMs}ms chunk...
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-blue-600 h-1.5 rounded-full animate-pulse w-3/4" />
                    </div>
                    <span className="text-[10px] text-slate-500 font-sans">
                      The browser layout and UI remain 100% interactive while Express streams payload over Flight socket.
                    </span>
                  </div>
                }
              >
                <StreamCard streamPromise={streamPromise} />
              </Suspense>
            ) : isStreaming ? (
              <div className="h-full flex flex-col justify-center gap-2 p-3 bg-rose-50/90 border border-rose-300 rounded-lg shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-rose-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    HTTP Connection Paused
                  </span>
                  <span className="text-[10px] font-mono text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded border border-rose-200">
                    Awaiting server ({latencyMs}ms)...
                  </span>
                </div>
                <div className="w-full bg-rose-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-rose-500 h-1.5 rounded-full animate-pulse w-1/3" />
                </div>
                <span className="text-[10px] text-rose-700 font-sans">
                  0 bytes transferred. The browser cannot paint the shell or download assets until Node.js finishes.
                </span>
              </div>
            ) : (
              <div className="h-full flex flex-col justify-between p-3 bg-rose-50/70 border border-rose-200/80 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-rose-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Simulated TTFB Delay ({latencyMs}ms)
                  </span>
                  <span className="text-[10px] font-mono text-rose-700 bg-rose-100/70 px-1.5 py-0.5 rounded">
                    HTTP Response Blocked
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Without <code>&lt;Suspense&gt;</code>, Node.js pauses HTTP header generation until the database query completes. The browser receives 0 bytes, delaying CSS/script downloads.
                </p>
                <div className="text-[10px] font-mono bg-white p-1.5 rounded border border-rose-200 text-rose-800">
                  ⚠️ First Contentful Paint delayed by {latencyMs}ms
                </div>
              </div>
            )}
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 h-7 shrink-0 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 font-medium">Delay:</span>
              <button
                type="button"
                onClick={() => handleLatencyChange(400)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-sans font-medium transition cursor-pointer ${
                  latencyMs === 400 ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-200"
                }`}
              >
                400ms
              </button>
              <button
                type="button"
                onClick={() => handleLatencyChange(900)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-sans font-medium transition cursor-pointer ${
                  latencyMs === 900 ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-200"
                }`}
              >
                900ms
              </button>
            </div>

            <button
              type="button"
              onClick={triggerFetch}
              disabled={isStreaming}
              className={`px-2.5 py-1 rounded-md text-[11px] font-sans font-medium transition cursor-pointer shadow-2xs ${
                isStreaming
                  ? "bg-slate-400 text-slate-200 cursor-wait"
                  : mode === "streaming"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-rose-600 hover:bg-rose-700 text-white"
              }`}
            >
              {isStreaming
                ? mode === "streaming"
                  ? "Streaming..."
                  : "Waiting TTFB..."
                : mode === "streaming"
                ? "Trigger Stream ↻"
                : "Simulate TTFB ↻"}
            </button>
          </div>
        </div>

        {/* Card 2: TTFB & Web Vitals Comparison Inspector */}
        <div className="w-full min-w-0 rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 flex flex-col justify-between relative h-[235px] min-h-[235px] max-h-[235px] shadow-2xs overflow-hidden">
          <div className="flex items-center justify-between w-full h-5 shrink-0">
            <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-slate-500">
              2. TTFB &amp; Web Vitals Impact
            </span>
            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/60 px-1.5 py-0.2 rounded">
              Performance Benchmark
            </span>
          </div>

          {/* Comparison Metrics Grid */}
          <div className="my-auto py-1 flex flex-col gap-2 h-[145px] shrink-0 justify-center">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white p-2 rounded-lg border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
                  Streaming TTFB
                </span>
                <span className="text-base font-bold text-blue-600 leading-tight">~8ms</span>
                <span className="text-[9px] text-slate-500 block">Instant layout shell</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200/80 shadow-2xs">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
                  Blocking TTFB
                </span>
                <span className="text-base font-bold text-rose-600 leading-tight">{latencyMs}ms</span>
                <span className="text-[9px] text-slate-500 block">0 bytes until DB ready</span>
              </div>
            </div>

            <div className="bg-blue-50/60 border border-blue-200/70 rounded-lg p-2 text-[11px] text-slate-600 leading-snug">
              <span className="font-semibold text-blue-900 block mb-0.5">Static Pre-rendering Note:</span>
              On static routes (SSG / ISG), data is fetched once at build time or lazily cached, delivering static HTML in <strong>~2ms</strong> without either dynamic penalty.
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/80 text-[10px] font-sans font-medium text-slate-500 flex items-center justify-between shrink-0">
            <span>Dinou Concurrency Manager</span>
            <span className="text-blue-600 font-semibold">Zero UI lockup</span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-sans font-medium">
        <span>
          Evaluated via React 19 <code>&lt;Suspense&gt;</code> streaming over Express HTTP sockets.
        </span>
        <span className="text-blue-600 font-semibold">
          Native Node.js Pipeline • 0 KB Client Bundle
        </span>
      </div>
    </div>
  );
}

export function StreamingLabViewFallback() {
  return (
    <div className="w-full bg-white/95 border border-slate-200/90 rounded-2xl p-6 shadow-lg min-h-[340px] flex items-center justify-center">
      <div className="flex items-center gap-2 text-sm text-slate-500 font-sans font-medium">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
        <span>Loading Streaming &amp; Latency Lab...</span>
      </div>
    </div>
  );
}
