"use client";

import { useState, useTransition, useActionState } from "react";
import {
  submitProgressiveFeedback,
  FeedbackEntry,
} from "./server-functions/progressive-demo";

export function ProgressiveActionsView() {
  const [entries, setEntries] = useState<FeedbackEntry[]>([
    {
      id: "fb-1",
      sender: "Alex Dev",
      comment: "Submitted via native HTML POST without JavaScript loaded!",
      rating: 5,
      submittedAt: "10:15 AM",
      isJsFree: true,
    },
    {
      id: "fb-2",
      sender: "Sarah Engineer",
      comment: "Server Actions work flawlessly with progressive enhancement.",
      rating: 5,
      submittedAt: "11:42 AM",
      isJsFree: true,
    },
  ]);

  const [simulateNoJs, setSimulateNoJs] = useState(false);

  // Form action handling
  const [, formAction, isSubmitting] = useActionState(
    async (_prev: any, formData: FormData) => {
      // Append flag indicating whether JS is considered active
      formData.set("js_status", simulateNoJs ? "disabled" : "active");
      const updated = await submitProgressiveFeedback(formData);
      setEntries(updated);
      return updated;
    },
    entries
  );

  return (
    <div className="w-full bg-white/95 border border-slate-200/90 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-lg flex flex-col justify-between font-sans">
      {/* Top Header: Framework & React Capabilities */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-200/80 w-full">
        <div className="max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs font-semibold text-slate-800">
              Progressive Server Actions: Zero-JS Forms in Server Components
            </span>
          </div>
          <span className="text-[11px] text-slate-600 block mt-0.5 leading-snug">
            Dinou supports Server Actions inside <strong>Server Components without the <code>&quot;use client&quot;</code> directive</strong>. Forms submit via native browser POST even before JavaScript finishes loading.
          </span>
        </div>

        <span
          className={`text-[11px] font-sans font-medium px-2.5 py-1 rounded-md border transition-colors ${
            simulateNoJs
              ? "text-amber-800 bg-amber-50 border-amber-300 font-semibold"
              : "text-emerald-700 bg-emerald-50 border-emerald-200"
          }`}
        >
          {simulateNoJs ? "⚠️ SIMULATING ZERO-JS POST" : "PROGRESSIVE ENHANCEMENT: READY"}
        </span>
      </div>

      {/* Main Dual-Card Stage - locked to 50/50 columns & fixed 235px height */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 w-full items-start">
        {/* Card 1: Progressive Form Simulator */}
        <div className="w-full min-w-0 rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 flex flex-col justify-between relative h-[235px] min-h-[235px] max-h-[235px] shadow-2xs overflow-hidden">
          {/* Card 1 Top Bar */}
          <div className="flex items-center justify-between w-full h-5 shrink-0">
            <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-slate-500">
              1. Native HTML &lt;form action&gt;
            </span>

            {/* JS Simulation Toggle */}
            <button
              type="button"
              onClick={() => setSimulateNoJs((s) => !s)}
              className={`px-2 py-0.5 rounded text-[10px] font-sans font-medium transition cursor-pointer border ${
                simulateNoJs
                  ? "bg-amber-100 text-amber-900 border-amber-300 font-semibold"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {simulateNoJs ? "Mode: Zero-JS Native" : "Mode: Standard JS"}
            </button>
          </div>

          {/* Form input fields */}
          <form action={formAction} className="flex flex-col gap-1.5 my-1 shrink-0">
            <div className="flex gap-1.5">
              <input
                type="text"
                name="sender"
                placeholder="Developer name..."
                required
                className="flex-1 bg-white border border-slate-200 rounded-md px-2 py-1 text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 min-w-0"
              />
              <select
                name="rating"
                defaultValue="5"
                className="bg-white border border-slate-200 rounded-md px-1.5 py-1 text-xs font-sans text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="5">⭐⭐⭐⭐⭐</option>
                <option value="4">⭐⭐⭐⭐</option>
                <option value="3">⭐⭐⭐</option>
              </select>
            </div>

            <div className="flex gap-1.5">
              <input
                type="text"
                name="comment"
                placeholder="Feedback or observation..."
                required
                className="flex-1 bg-white border border-slate-200 rounded-md px-2 py-1 text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500 min-w-0"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-xs font-sans font-medium transition cursor-pointer shrink-0 disabled:opacity-50 shadow-2xs"
              >
                {isSubmitting ? "Posting..." : "Submit Form"}
              </button>
            </div>
          </form>

          {/* Recent Submissions List */}
          <div className="flex flex-col gap-1 overflow-y-auto max-h-[65px] scrollbar-thin my-auto">
            {entries.slice(0, 2).map((entry) => (
              <div
                key={entry.id}
                className="p-1.5 px-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between text-[11px]"
              >
                <div className="truncate pr-2">
                  <span className="font-semibold text-slate-800">{entry.sender}: </span>
                  <span className="text-slate-600 truncate">&ldquo;{entry.comment}&rdquo;</span>
                </div>
                <span className="text-[9px] text-amber-700 bg-amber-50 border border-amber-200 px-1 py-0.2 rounded shrink-0">
                  {entry.isJsFree ? "Native POST" : "JS Action"}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-1.5 border-t border-slate-200/80 text-[10px] font-sans font-medium text-slate-500 flex items-center justify-between shrink-0">
            <span>Direct FormData parsing in Node.js</span>
            <span className="text-amber-600 font-semibold">Resilient Form Architecture</span>
          </div>
        </div>

        {/* Card 2: Actions Comparison Matrix */}
        <div className="w-full min-w-0 rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 flex flex-col justify-between relative h-[235px] min-h-[235px] max-h-[235px] shadow-2xs overflow-hidden">
          <div className="flex items-center justify-between w-full h-5 shrink-0">
            <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-slate-500">
              2. Actions Comparison Matrix
            </span>
            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-1.5 py-0.2 rounded">
              Client vs. Server
            </span>
          </div>

          {/* Comparison Cards */}
          <div className="my-auto py-1 flex flex-col gap-1.5 h-[145px] shrink-0 justify-center text-[11px]">
            <div className="bg-white p-2 rounded-lg border border-slate-200/80 shadow-2xs">
              <span className="font-semibold text-slate-900 block text-xs mb-0.5">
                • Server Actions in Server Components
              </span>
              <p className="text-slate-600 leading-snug">
                Zero client bundle. The browser submits an HTTP POST, Node.js runs the function, and re-renders the page. 100% resilient on slow connections.
              </p>
            </div>

            <div className="bg-amber-50/60 border border-amber-200/70 rounded-lg p-2 text-slate-600 leading-snug">
              <span className="font-semibold text-amber-900 block text-xs mb-0.5">
                • Server Actions in Client Components
              </span>
              <p className="leading-snug">
                Enables <code>useOptimistic</code> (0ms local UI reaction) and <code>useActionState</code> (pending spinners). Best for rich interactive apps.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/80 text-[10px] font-sans font-medium text-slate-500 flex items-center justify-between shrink-0">
            <span>Dinou Server Action Engine</span>
            <span className="text-amber-600 font-semibold">Native Web Standards</span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-sans font-medium">
        <span>
          Powered by React 19 Server Actions: works with or without JavaScript hydration.
        </span>
        <span className="text-amber-600 font-semibold">
          Progressive Enhancement • Zero External Libraries
        </span>
      </div>
    </div>
  );
}

export function ProgressiveActionsViewFallback() {
  return (
    <div className="w-full bg-white/95 border border-slate-200/90 rounded-2xl p-6 shadow-lg min-h-[340px] flex items-center justify-center">
      <div className="flex items-center gap-2 text-sm text-slate-500 font-sans font-medium">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
        <span>Loading Progressive Server Actions...</span>
      </div>
    </div>
  );
}
