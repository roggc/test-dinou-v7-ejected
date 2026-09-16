"use client";

import type { ReactNode } from "react";

interface ServerSlotViewProps {
  serverSlot?: ReactNode;
}

export function ServerSlotView({ serverSlot }: ServerSlotViewProps) {
  return (
    <div className="w-full bg-white/95 border border-slate-200/90 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-lg flex flex-col justify-between font-sans">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-200/80 w-full">
        <div className="max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-slate-800">
              RSC Slot Composition: Embedding Server Components in Client Trees
            </span>
          </div>
          <span className="text-[11px] text-slate-600 block mt-0.5 leading-snug">
            Client Components cannot directly <code>import</code> Server Components. By passing <code>&lt;PureServerSlot /&gt;</code> as a <strong>slot/prop</strong> from <code>page.tsx</code>, the server renders it in Node.js with <strong>0 KB client JS</strong>.
          </span>
        </div>

        <span className="text-[11px] font-sans font-medium px-2.5 py-1 rounded-md border transition-colors text-emerald-700 bg-emerald-50 border-emerald-200">
          NODE.JS RUNTIME • 0 KB CLIENT JS
        </span>
      </div>

      {/* Main Dual-Card Stage - locked to 50/50 columns & fixed 235px height */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 w-full items-start">
        {/* Column 1: The Live Server Component Slot */}
        {serverSlot ? (
          serverSlot
        ) : (
          <div className="w-full min-w-0 rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 flex flex-col justify-between relative h-[235px] min-h-[235px] max-h-[235px] shadow-2xs overflow-hidden text-slate-700">
            <div className="flex items-center justify-between gap-2 shrink-0">
              <span className="font-semibold text-xs text-slate-900">
                Server Slot Standalone
              </span>
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
                No Slot Passed
              </span>
            </div>
            <div className="my-auto py-1 flex flex-col gap-1.5 h-[145px] shrink-0 justify-center text-[11px] text-slate-600">
              <p>
                Pass <code className="text-blue-600 font-mono text-[10px]">&lt;PureServerSlot /&gt;</code> from <code className="font-mono text-[10px]">page.tsx</code> into the <code className="font-mono text-[10px]">serverSlot</code> prop of this component to view live Node.js metrics.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400">
              Awaiting Server Component
            </div>
          </div>
        )}

        {/* Column 2: Architectural Breakdown of RSC Composition */}
        <div className="w-full min-w-0 rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 flex flex-col justify-between relative h-[235px] min-h-[235px] max-h-[235px] shadow-2xs overflow-hidden text-slate-700">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span className="font-semibold text-xs text-slate-900">
                RSC Composition Architecture
              </span>
            </div>
            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-full">
              Slot / Props Pattern
            </span>
          </div>

          {/* Body */}
          <div className="my-auto py-1 flex flex-col gap-1.5 h-[145px] shrink-0 justify-center text-[11px]">
            <div className="bg-white border border-slate-200/80 rounded-xl p-2 shadow-2xs">
              <span className="font-semibold text-slate-900 block text-xs mb-0.5">
                • The RSC Rule: Direct Imports Forbidden
              </span>
              <p className="text-slate-600 leading-snug">
                A Client Component (<code className="text-rose-600 font-mono text-[10px]">&quot;use client&quot;</code>) <strong>cannot directly import</strong> an Async Server Component because the browser bundle cannot execute Node.js code.
              </p>
            </div>

            <div className="bg-blue-50/60 border border-blue-200/60 rounded-xl p-2 text-slate-600 leading-snug">
              <span className="font-semibold text-blue-900 block text-xs mb-0.5">
                • The Solution: Pass as Props or Children
              </span>
              <p className="leading-snug">
                Parent <code className="text-blue-700 font-mono text-[10px]">page.tsx</code> instantiates the Server Component in Node.js and passes it via <code className="text-blue-700 font-mono text-[10px]">serverSlot</code>. React streams the pre-rendered JSX without backend JS.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-slate-200/80 text-[10px] font-sans font-medium text-slate-500 flex items-center justify-between shrink-0">
            <span>Server Parent &rarr; Slot Prop &rarr; Client Tree</span>
            <span className="text-blue-600 font-semibold font-mono">0 KB Client JS</span>
          </div>
        </div>
      </div>

      {/* Main Container Footer */}
      <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-sans font-medium">
        <span>
          Server Component executed in Node.js and streamed via React Flight RSC protocol.
        </span>
        <span className="text-emerald-600 font-semibold">
          Native React 19 Server Components
        </span>
      </div>
    </div>
  );
}

export function ServerSlotViewFallback() {
  return (
    <div className="w-full bg-white/95 border border-slate-200/90 rounded-2xl p-6 shadow-lg min-h-[340px] flex items-center justify-center font-sans">
      <div className="flex items-center gap-2 text-sm text-slate-500 font-sans font-medium">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span>Loading Server Component Slot...</span>
      </div>
    </div>
  );
}
