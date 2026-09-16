"use client";

import { useState, useEffect, Suspense, use, type ReactNode } from "react";
import { quoteCard } from "./server-functions/quote-card";

function QuoteStream({ quotePromise }: { quotePromise: Promise<ReactNode> }) {
  const content = use(quotePromise);
  return content;
}

export function RscCounterView() {
  const [count, setCount] = useState(19);
  const [quoteKey, setQuoteKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [quotePromise, setQuotePromise] = useState<Promise<ReactNode>>(() => quoteCard());

  const handleFetchNew = () => {
    setIsLoading(true);
    setQuoteKey((k) => k + 1);
    const p = quoteCard();
    p.finally(() => setIsLoading(false));
    setQuotePromise(p);
  };

  return (
    <div className="w-full bg-white/95 border border-slate-200/90 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-lg flex flex-col justify-between">
      {/* Top Header: Framework & React Capabilities */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-200/80 w-full">
        <div className="max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-xs font-semibold text-slate-800">
              Dinou Concurrency: Server Functions &amp; Suspense
            </span>
          </div>
          <span className="text-[11px] text-slate-600 block mt-0.5 leading-snug">
            Concurrency demonstration: while the Server Function resolves in Express (simulating 3s latency) and resolves over Flight RPC wrapped in React 19 native <code>&lt;Suspense&gt;</code> with <code>use()</code>, <strong>the counter and the entire page remain 100% operational and interactive</strong> without freezing the UI.
          </span>
        </div>

        <span
          className={`text-[11px] font-sans font-medium px-2.5 py-1 rounded-md border transition-colors ${isLoading
              ? "text-amber-800 bg-amber-50 border-amber-300 animate-pulse font-semibold"
              : "text-blue-700 bg-blue-50 border-blue-200"
            }`}
        >
          {isLoading
            ? "⚡ FETCHING SERVER FUNCTION (UI 100% OPERATIONAL)"
            : "SERVER FUNCTION: READY"}
        </span>
      </div>

      {/* Main Dual-Card Stage - locked to 50/50 columns & fixed height */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 w-full items-start">
        {/* Card 1: Interactive Client Counter (fixed height so button never moves) */}
        <div className="w-full min-w-0 rounded-xl border border-slate-200/90 bg-slate-50/70 p-4 flex flex-col justify-between relative h-[235px] min-h-[235px] max-h-[235px] shadow-2xs overflow-hidden">
          <div className="flex items-center justify-between w-full h-5 shrink-0">
            <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-slate-500">
              Concurrent React Client
            </span>
            <div className="flex items-center gap-1.5 text-[11px] font-sans font-medium text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>INTERACTIVE IN STREAMING</span>
            </div>
          </div>

          {/* Counter Display & Non-blocking notice (fixed height) */}
          <div className="my-auto py-1 text-center h-[96px] shrink-0 flex flex-col items-center justify-center">
            <div className="text-4xl sm:text-5xl font-sans font-bold text-slate-900 tracking-tight leading-none">
              {count}
            </div>
            <span
              className={`text-[11px] font-sans font-medium mt-1.5 inline-flex items-center justify-center px-2.5 py-0.5 rounded-md border truncate max-w-full h-6 shrink-0 transition-all ${isLoading
                  ? "text-amber-900 bg-amber-100 border-amber-300 font-semibold shadow-2xs"
                  : "text-slate-500 border-transparent"
                }`}
            >
              {isLoading
                ? "⚡ Click + or - while streaming!"
                : "State persisted in <Activity> and never freezes"}
            </span>
          </div>

          {/* Counter Actions (fixed height) */}
          <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-200/80 w-full h-11 shrink-0">
            <button
              onClick={() => setCount((c) => c - 1)}
              className="w-9 h-9 rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-sans text-base font-semibold transition active:scale-95 cursor-pointer flex items-center justify-center shadow-2xs"
              title="Decrement"
            >
              -
            </button>
            <button
              onClick={() => setCount((c) => c + 1)}
              className="w-9 h-9 rounded-lg bg-blue-600 border border-blue-500 text-white hover:bg-blue-700 font-sans text-base font-semibold transition active:scale-95 cursor-pointer flex items-center justify-center shadow-sm shadow-blue-500/20"
              title="Increment"
            >
              +
            </button>
            <button
              onClick={() => setCount(19)}
              className="px-3 h-9 rounded-lg bg-white border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-sans text-xs font-medium transition cursor-pointer shadow-2xs"
              title="Reset to 19"
            >
              Reset
            </button>
            <button
              onClick={() => setCount((c) => c + 5)}
              className="px-3 h-9 rounded-lg bg-white border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-sans text-xs font-medium transition cursor-pointer shadow-2xs"
              title="+5 Step"
            >
              +5
            </button>
          </div>
        </div>

        {/* Card 2: Server Function Quote Streamer (fixed height matching Card 1) */}
        <div className="w-full min-w-0 rounded-xl border border-slate-200/90 bg-slate-50/70 p-4 flex flex-col justify-between relative h-[235px] min-h-[235px] max-h-[235px] shadow-2xs overflow-hidden">
          <div className="flex items-center justify-between w-full h-5 shrink-0">
            <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-slate-500">
              Dinou Server Function (quoteCard)
            </span>
            <span className="text-[11px] font-sans font-medium text-slate-400">
              CALL #{quoteKey + 1}
            </span>
          </div>

          {/* Quote Viewport with Native React 19 Suspense + use() (fixed height) */}
          <div className="my-auto py-1 flex items-center justify-center h-[115px] shrink-0 w-full overflow-hidden">
            <Suspense fallback={<FetchingQuote setIsLoading={setIsLoading} />}>
              <QuoteStream quotePromise={quotePromise} />
            </Suspense>
          </div>

          {/* Trigger Button (fixed height) */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/80 h-11 shrink-0">
            <span className="text-[11px] font-sans font-medium text-slate-500 truncate hidden sm:inline">
              Simulates 3s DB latency in Express without blocking client
            </span>
            <button
              onClick={handleFetchNew}
              disabled={isLoading}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-sans font-medium transition cursor-pointer ml-auto ${isLoading
                  ? "bg-slate-200 text-slate-500 border border-slate-300 cursor-wait"
                  : "bg-blue-600 text-white border border-blue-500 hover:bg-blue-700 shadow-sm shadow-blue-500/20 active:scale-95"
                }`}
            >
              {isLoading ? "Streaming response..." : "Fetch New Quote (Server Function) →"}
            </button>
          </div>
        </div>
      </div>

      {/* Persistent Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-sans font-medium text-slate-500 px-1">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>KEY CAPABILITY: Non-blocking concurrent streaming — Counter &amp; UI remain 100% operational during server fetch</span>
        </div>
        <span>EXPRESS SERVER FUNCTION &bull; REACT 19 NATIVE SUSPENSE</span>
      </div>
    </div>
  );
}

function FetchingQuote({
  setIsLoading,
}: {
  setIsLoading: (value: boolean) => void;
}) {
  useEffect(() => {
    setIsLoading(true);
    return () => {
      setIsLoading(false);
    };
  }, [setIsLoading]);

  return (
    <div className="h-[105px] min-h-[105px] max-h-[105px] w-full max-w-md flex flex-col items-center justify-center gap-1 text-center">
      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-xs font-sans font-medium text-slate-700">
        Streaming JSX from Express process (3s)...
      </p>
      <p className="text-[11px] font-sans font-medium text-amber-700 truncate max-w-full">
        Client thread is free: increment the counter or switch tabs at any time
      </p>
    </div>
  );
}

export function RscCounterViewFallback() {
  return (
    <div className="bg-white/80 border border-slate-200 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px] animate-pulse">
      <span className="text-xs font-sans font-medium text-slate-500 uppercase tracking-wider mb-1">
        Server Function Skeleton (SSR Fallback)
      </span>
      <p className="text-xs text-slate-400 text-center max-w-sm">
        Hydrating Server Function component...
      </p>
    </div>
  );
}
