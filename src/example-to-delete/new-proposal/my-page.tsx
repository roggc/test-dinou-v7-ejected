"use client";

import {
  useState,
  useTransition,
  startTransition,
  Activity,
  ViewTransition,
  Suspense as ReactSuspense,
} from "react";
import dinouLogo from "@/example-to-delete/assets/dinou.png";
import reactLogo from "@/example-to-delete/assets/react-logo.svg";
import { FlowCanvas, FlowCanvasFallback } from "./01-particles/flow-canvas";
import { SynthView, SynthViewFallback } from "./02-synth/synth-view";
import { RscCounterView, RscCounterViewFallback } from "./03-rsc-suspense/rsc-counter-view";
import { ActionsView, ActionsViewFallback } from "./04-optimistic-tasks/actions-view";
import { StreamingLabView, StreamingLabViewFallback } from "./05-streaming-lab/streaming-lab-view";
import { ReactiveCatalogView, ReactiveCatalogViewFallback } from "./06-reactive-catalog/reactive-catalog-view";
import { ServerSlotView, ServerSlotViewFallback } from "./07-rsc-slots/server-slot-view";
import { ProgressiveActionsView, ProgressiveActionsViewFallback } from "./08-progressive-forms/progressive-actions-view";
import { ContextView, ContextViewFallback } from "./09-server-context/context-view";
import { PatternView, PatternViewFallback } from "./10-dinou-pattern/pattern-view";
import type { TaskItem } from "./04-optimistic-tasks/server-functions/actions-demo";

type UseCase =
  | "particles"
  | "synth"
  | "rsc"
  | "actions"
  | "streaming"
  | "catalog"
  | "slot"
  | "progressive"
  | "context"
  | "pattern";

interface NewProposal5PageProps {
  initialTasks?: TaskItem[];
  serverSlot?: React.ReactNode;
}

export default function NewProposal5Page({ initialTasks, serverSlot }: NewProposal5PageProps = {}) {
  const [activeCase, setActiveCase] = useState<UseCase>("particles");
  const [, startTabTransition] = useTransition();

  const switchCase = (next: UseCase) => {
    startTabTransition(() => {
      setActiveCase(next);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-800 p-4 sm:p-6 lg:p-8 flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900 font-sans">
      {/* TOP HEADER: BRAND LINKS, TITLE, TAGLINE & USE-CASE SWITCHER */}
      <header className="max-w-5xl mx-auto w-full pt-1 pb-1">
        {/* Top Header Row: Brand Links + Title + Tagline */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Clickable Brand Tabs */}
            <div className="flex items-center gap-2">
              {/* Dinou Doc Tab */}
              <a
                href="https://dinou.dev"
                target="_blank"
                rel="noreferrer"
                title="Open Dinou v6 documentation (dinou.dev)"
                className="group flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer shadow-xs"
              >
                <img
                  src={dinouLogo}
                  alt="Dinou"
                  className="w-5 h-5 transition-transform group-hover:scale-105 drop-shadow-xs"
                />
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                    Dinou
                  </span>
                  <span className="text-[11px] font-sans font-medium text-slate-400 group-hover:text-slate-600 transition-colors">
                    v6.0.1
                  </span>
                </div>
                <svg
                  className="w-2.5 h-2.5 text-slate-400 group-hover:text-slate-600 transition-colors hidden sm:inline"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

              <span className="text-slate-300 text-xs px-0.5">•</span>

              {/* React Doc Tab with Spinning Logo */}
              <a
                href="https://react.dev"
                target="_blank"
                rel="noreferrer"
                title="Open React 19.3.0 documentation (react.dev)"
                className="group flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer shadow-xs"
              >
                <img
                  src={reactLogo}
                  alt="React"
                  className="w-4.5 h-4.5 animate-spin-slow drop-shadow-xs"
                />
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                    React
                  </span>
                  <span className="text-[11px] font-sans font-medium text-slate-400 group-hover:text-slate-600 transition-colors">
                    v19.3.0
                  </span>
                </div>
                <svg
                  className="w-2.5 h-2.5 text-slate-400 group-hover:text-slate-600 transition-colors hidden sm:inline"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>

            {/* Vertical separator */}
            <div className="h-5 w-px bg-slate-200 hidden sm:block" />

            {/* Dinou Title and Full-Stack React 19 Framework */}
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Dinou
              </span>
              <span className="text-sm text-slate-500 font-medium hidden sm:inline">
                Full-Stack React 19 Framework
              </span>
            </div>
          </div>
        </div>

        {/* Separator Line */}
        <div className="border-b border-slate-200/90 mb-3.5" />

        {/* Sub-header Navigation Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-sm font-medium text-slate-900">
              Demonstrations &amp; Use Cases
            </span>
            <span className="text-sm font-medium text-slate-500 hidden sm:inline">
              / 10 Live Scenarios
            </span>
          </div>

          {/* Use-Case Switcher (ViewTransition Sliding Pill) */}
          <div className="flex items-center overflow-x-auto max-w-full bg-slate-100/90 border border-slate-200/80 rounded-xl p-1 text-sm font-sans font-medium relative shadow-xs scrollbar-thin">
            <button
              onClick={() => switchCase("particles")}
              className="relative px-3 py-1.5 rounded-lg transition cursor-pointer text-xs font-sans font-medium whitespace-nowrap shrink-0"
            >
              {activeCase === "particles" && (
                <ViewTransition name="proposal5-tab-pill">
                  <span className="absolute inset-0 bg-white rounded-lg shadow-xs border border-slate-200/90" />
                </ViewTransition>
              )}
              <span
                className={`relative z-10 transition-colors font-sans font-medium ${
                  activeCase === "particles" ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                1. Kinetic Flow
              </span>
            </button>

            <button
              onClick={() => switchCase("synth")}
              className="relative px-3 py-1.5 rounded-lg transition cursor-pointer text-xs font-sans font-medium whitespace-nowrap shrink-0"
            >
              {activeCase === "synth" && (
                <ViewTransition name="proposal5-tab-pill">
                  <span className="absolute inset-0 bg-white rounded-lg shadow-xs border border-slate-200/90" />
                </ViewTransition>
              )}
              <span
                className={`relative z-10 transition-colors font-sans font-medium ${
                  activeCase === "synth" ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                2. Audio Synth
              </span>
            </button>

            <button
              onClick={() => switchCase("rsc")}
              className="relative px-3 py-1.5 rounded-lg transition cursor-pointer text-xs font-sans font-medium whitespace-nowrap shrink-0"
            >
              {activeCase === "rsc" && (
                <ViewTransition name="proposal5-tab-pill">
                  <span className="absolute inset-0 bg-white rounded-lg shadow-xs border border-slate-200/90" />
                </ViewTransition>
              )}
              <span
                className={`relative z-10 transition-colors font-sans font-medium ${
                  activeCase === "rsc" ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                3. Server Function + Suspense
              </span>
            </button>

            <button
              onClick={() => switchCase("actions")}
              className="relative px-3 py-1.5 rounded-lg transition cursor-pointer text-xs font-sans font-medium whitespace-nowrap shrink-0"
            >
              {activeCase === "actions" && (
                <ViewTransition name="proposal5-tab-pill">
                  <span className="absolute inset-0 bg-white rounded-lg shadow-xs border border-slate-200/90" />
                </ViewTransition>
              )}
              <span
                className={`relative z-10 transition-colors font-sans font-medium ${
                  activeCase === "actions" ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                4. Optimistic Tasks
              </span>
            </button>

            <button
              onClick={() => switchCase("streaming")}
              className="relative px-3 py-1.5 rounded-lg transition cursor-pointer text-xs font-sans font-medium whitespace-nowrap shrink-0"
            >
              {activeCase === "streaming" && (
                <ViewTransition name="proposal5-tab-pill">
                  <span className="absolute inset-0 bg-white rounded-lg shadow-xs border border-slate-200/90" />
                </ViewTransition>
              )}
              <span
                className={`relative z-10 transition-colors font-sans font-medium ${
                  activeCase === "streaming" ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                5. Streaming Lab
              </span>
            </button>

            <button
              onClick={() => switchCase("catalog")}
              className="relative px-3 py-1.5 rounded-lg transition cursor-pointer text-xs font-sans font-medium whitespace-nowrap shrink-0"
            >
              {activeCase === "catalog" && (
                <ViewTransition name="proposal5-tab-pill">
                  <span className="absolute inset-0 bg-white rounded-lg shadow-xs border border-slate-200/90" />
                </ViewTransition>
              )}
              <span
                className={`relative z-10 transition-colors font-sans font-medium ${
                  activeCase === "catalog" ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                6. Reactive Catalog
              </span>
            </button>

            <button
              onClick={() => switchCase("slot")}
              className="relative px-3 py-1.5 rounded-lg transition cursor-pointer text-xs font-sans font-medium whitespace-nowrap shrink-0"
            >
              {activeCase === "slot" && (
                <ViewTransition name="proposal5-tab-pill">
                  <span className="absolute inset-0 bg-white rounded-lg shadow-xs border border-slate-200/90" />
                </ViewTransition>
              )}
              <span
                className={`relative z-10 transition-colors font-sans font-medium ${
                  activeCase === "slot" ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                7. RSC Slot Composition
              </span>
            </button>

            <button
              onClick={() => switchCase("progressive")}
              className="relative px-3 py-1.5 rounded-lg transition cursor-pointer text-xs font-sans font-medium whitespace-nowrap shrink-0"
            >
              {activeCase === "progressive" && (
                <ViewTransition name="proposal5-tab-pill">
                  <span className="absolute inset-0 bg-white rounded-lg shadow-xs border border-slate-200/90" />
                </ViewTransition>
              )}
              <span
                className={`relative z-10 transition-colors font-sans font-medium ${
                  activeCase === "progressive" ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                8. Progressive Forms
              </span>
            </button>

            <button
              onClick={() => switchCase("context")}
              className="relative px-3 py-1.5 rounded-lg transition cursor-pointer text-xs font-sans font-medium whitespace-nowrap shrink-0"
            >
              {activeCase === "context" && (
                <ViewTransition name="proposal5-tab-pill">
                  <span className="absolute inset-0 bg-white rounded-lg shadow-xs border border-slate-200/90" />
                </ViewTransition>
              )}
              <span
                className={`relative z-10 transition-colors font-sans font-medium ${
                  activeCase === "context" ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                9. Server Context
              </span>
            </button>

            <button
              onClick={() => switchCase("pattern")}
              className="relative px-3 py-1.5 rounded-lg transition cursor-pointer text-xs font-sans font-medium whitespace-nowrap shrink-0"
            >
              {activeCase === "pattern" && (
                <ViewTransition name="proposal5-tab-pill">
                  <span className="absolute inset-0 bg-white rounded-lg shadow-xs border border-slate-200/90" />
                </ViewTransition>
              )}
              <span
                className={`relative z-10 transition-colors font-sans font-medium ${
                  activeCase === "pattern" ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                10. Dinou Pattern
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN INTERACTIVE STAGE (Preserved across tabs via React 19.3 <Activity>) */}
      <main className="max-w-5xl mx-auto w-full my-auto py-2">
        <ViewTransition name="proposal5-main-stage">
          <div className="w-full">
            {/* Tab 1: Kinetic Flow */}
            <div className="w-full" style={{ display: activeCase === "particles" ? "block" : "none" }}>
              <Activity mode={activeCase === "particles" ? "visible" : "hidden"}>
                <ReactSuspense fallback={<FlowCanvasFallback />}>
                  <FlowCanvas />
                </ReactSuspense>
              </Activity>
            </div>

            {/* Tab 2: Audio Synthesizer */}
            <div className="w-full" style={{ display: activeCase === "synth" ? "block" : "none" }}>
              <Activity mode={activeCase === "synth" ? "visible" : "hidden"}>
                <ReactSuspense fallback={<SynthViewFallback />}>
                  <SynthView />
                </ReactSuspense>
              </Activity>
            </div>

            {/* Tab 3: RSC & Quote */}
            <div className="w-full" style={{ display: activeCase === "rsc" ? "block" : "none" }}>
              <Activity mode={activeCase === "rsc" ? "visible" : "hidden"}>
                <ReactSuspense fallback={<RscCounterViewFallback />}>
                  <RscCounterView />
                </ReactSuspense>
              </Activity>
            </div>

            {/* Tab 4: Optimistic Tasks */}
            <div className="w-full" style={{ display: activeCase === "actions" ? "block" : "none" }}>
              <Activity mode={activeCase === "actions" ? "visible" : "hidden"}>
                <ReactSuspense fallback={<ActionsViewFallback />}>
                  <ActionsView initialTasks={initialTasks} />
                </ReactSuspense>
              </Activity>
            </div>

            {/* Tab 5: Streaming Lab */}
            <div className="w-full" style={{ display: activeCase === "streaming" ? "block" : "none" }}>
              <Activity mode={activeCase === "streaming" ? "visible" : "hidden"}>
                <ReactSuspense fallback={<StreamingLabViewFallback />}>
                  <StreamingLabView />
                </ReactSuspense>
              </Activity>
            </div>

            {/* Tab 6: Reactive Catalog */}
            <div className="w-full" style={{ display: activeCase === "catalog" ? "block" : "none" }}>
              <Activity mode={activeCase === "catalog" ? "visible" : "hidden"}>
                <ReactSuspense fallback={<ReactiveCatalogViewFallback />}>
                  <ReactiveCatalogView />
                </ReactSuspense>
              </Activity>
            </div>

            {/* Tab 7: RSC Slot Composition */}
            <div className="w-full" style={{ display: activeCase === "slot" ? "block" : "none" }}>
              <Activity mode={activeCase === "slot" ? "visible" : "hidden"}>
                <ReactSuspense fallback={<ServerSlotViewFallback />}>
                  <ServerSlotView serverSlot={serverSlot} />
                </ReactSuspense>
              </Activity>
            </div>

            {/* Tab 8: Progressive Forms */}
            <div className="w-full" style={{ display: activeCase === "progressive" ? "block" : "none" }}>
              <Activity mode={activeCase === "progressive" ? "visible" : "hidden"}>
                <ReactSuspense fallback={<ProgressiveActionsViewFallback />}>
                  <ProgressiveActionsView />
                </ReactSuspense>
              </Activity>
            </div>

            {/* Tab 9: Server Context */}
            <div className="w-full" style={{ display: activeCase === "context" ? "block" : "none" }}>
              <Activity mode={activeCase === "context" ? "visible" : "hidden"}>
                <ReactSuspense fallback={<ContextViewFallback />}>
                  <ContextView />
                </ReactSuspense>
              </Activity>
            </div>

            {/* Tab 10: Dinou Pattern */}
            <div className="w-full" style={{ display: activeCase === "pattern" ? "block" : "none" }}>
              <Activity mode={activeCase === "pattern" ? "visible" : "hidden"}>
                <ReactSuspense fallback={<PatternViewFallback />}>
                  <PatternView />
                </ReactSuspense>
              </Activity>
            </div>
          </div>
        </ViewTransition>
      </main>
    </div>
  );
}

