"use client";

import { useState, useEffect, Suspense, use, type ReactNode } from "react";
import { addPatternTask, fetchPatternTasks } from "./server-functions/pattern-demo";
import { useTasksListKey } from "./pattern-store";

function TasksStream({ promise }: { promise: Promise<ReactNode> }) {
  const content = use(promise);
  return <>{content}</>;
}

function MutationStream({ promise }: { promise: Promise<ReactNode> }) {
  const content = use(promise);
  return <>{content}</>;
}

export function PatternView() {
  const tasksListKey = useTasksListKey();
  const [text, setText] = useState("");
  const [isMutating, setIsMutating] = useState(false);
  const [mutationKey, setMutationKey] = useState(0);
  const [mutationPromise, setMutationPromise] = useState<Promise<ReactNode> | null>(null);
  const [tasksPromise, setTasksPromise] = useState<Promise<ReactNode>>(() => fetchPatternTasks());

  // When the Headless Updater increments tasksListKey in the store,
  // we request the new list from the server (Flight streaming)
  useEffect(() => {
    if (tasksListKey > 0) {
      setTasksPromise(fetchPatternTasks());
    }
  }, [tasksListKey]);

  const handleAddTask = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isMutating) return;

    setIsMutating(true);
    setMutationKey((k) => k + 1);
    const p = addPatternTask(trimmed);
    p.finally(() => {
      setIsMutating(false);
      setText("");
    });
    setMutationPromise(p);
  };

  return (
    <div className="w-full bg-white/95 border border-slate-200/90 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-lg flex flex-col justify-between font-sans">
      {/* Top Header: Framework & React Capabilities */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-200/80 w-full">
        <div className="max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-xs font-semibold text-slate-800">
              The &quot;Dinou Pattern&quot;: Headless State Updater &amp; Pure React Store
            </span>
          </div>
          <span className="text-[11px] text-slate-600 block mt-0.5 leading-snug">
            A Server Function executes backend mutations and returns an invisible Client Component. When mounted, the updater syncs a native <code>useSyncExternalStore</code>, invalidating dependent queries with <strong>zero external dependencies</strong>.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-sans font-medium px-2.5 py-1 rounded-md border text-purple-700 bg-purple-50 border-purple-200">
            STORE KEY: <strong>#{tasksListKey}</strong>
          </span>
          <span className="text-[11px] font-sans font-medium px-2 py-1 rounded-md border text-emerald-700 bg-emerald-50 border-emerald-200 hidden sm:inline">
            REACT 19 PURE
          </span>
        </div>
      </div>

      {/* Main Dual-Card Stage - locked to 50/50 columns & fixed 235px height */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 w-full items-start">
        {/* Card 1: Interactive Stage */}
        <div className="w-full min-w-0 rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 flex flex-col justify-between relative h-[235px] min-h-[235px] max-h-[235px] shadow-2xs overflow-hidden">
          {/* Top Bar: Mode Selector & Latency Controller */}
          <div className="flex items-center justify-between w-full h-5 shrink-0">
            <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-slate-500">
              1. Live Flight Mutation &amp; Stream
            </span>
            <span className="text-[10px] font-mono text-purple-700 bg-purple-50 border border-purple-200/60 px-1.5 py-0.2 rounded">
              tasks-${tasksListKey}
            </span>
          </div>

          {/* Dynamic Stage Content */}
          <div className="my-auto py-1 flex flex-col justify-between h-[135px] shrink-0 overflow-hidden">
            {/* Mutation Status & Headless Updater Mount */}
            {mutationPromise && (
              <div className="shrink-0">
                <Suspense
                  key={`mutation-${mutationKey}`}
                  fallback={
                    <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] text-amber-800 bg-amber-50/90 rounded border border-amber-200 animate-pulse mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                      <span>Node.js: executing <code>addPatternTask()</code>...</span>
                    </div>
                  }
                >
                  <MutationStream promise={mutationPromise} />
                </Suspense>
              </div>
            )}

            {/* Tasks List Stream Boundary */}
            <div className="flex-1 overflow-hidden">
              <Suspense
                key={`pattern-tasks-${tasksListKey}`}
                fallback={
                  <div className="h-full flex flex-col justify-center items-center gap-1.5 p-3 bg-white border border-purple-200 rounded-lg shadow-2xs">
                    <div className="flex items-center gap-2 text-xs font-medium text-purple-800">
                      <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                      <span>Streaming updated list from Node.js...</span>
                    </div>
                    <div className="w-36 bg-slate-100 rounded-full h-1 overflow-hidden">
                      <div className="bg-purple-600 h-1 rounded-full animate-pulse w-3/4" />
                    </div>
                  </div>
                }
              >
                <TasksStream promise={tasksPromise} />
              </Suspense>
            </div>
          </div>

          {/* Controls Bar */}
          <form onSubmit={handleAddTask} className="flex items-center gap-1.5 pt-2 border-t border-slate-200/80 h-7 shrink-0">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="New task for the Dinou Pattern..."
              disabled={isMutating}
              className="flex-1 px-2 py-0.5 text-[11px] font-sans rounded border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500/30 focus:border-purple-500 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={isMutating || !text.trim()}
              className={`px-2.5 py-0.5 rounded text-[11px] font-sans font-medium transition cursor-pointer shadow-2xs shrink-0 ${
                isMutating || !text.trim()
                  ? "bg-slate-300 text-slate-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              {isMutating ? "Adding..." : "Add Task +"}
            </button>
          </form>
        </div>

        {/* Card 2: Architecture Flow Visualizer */}
        <div className="w-full min-w-0 rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 flex flex-col justify-between relative h-[235px] min-h-[235px] max-h-[235px] shadow-2xs overflow-hidden">
          <div className="flex items-center justify-between w-full h-5 shrink-0">
            <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-slate-500">
              2. Architectural Execution Flow
            </span>
            <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 border border-purple-200/60 px-1.5 py-0.2 rounded">
              Zero External Libraries
            </span>
          </div>

          {/* Comparison / Mechanism Grid */}
          <div className="my-auto py-1 flex flex-col gap-1.5 h-[145px] shrink-0 justify-center text-xs">
            <div className="grid grid-cols-5 gap-1 text-center">
              <div className="p-1 rounded bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-center">
                <span className="text-[9px] font-bold text-blue-600 uppercase">1. Call</span>
                <span className="text-[8px] text-slate-500 leading-tight">addTask()</span>
              </div>
              <div className="p-1 rounded bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-center">
                <span className="text-[9px] font-bold text-emerald-600 uppercase">2. DB</span>
                <span className="text-[8px] text-slate-500 leading-tight">Node.js Mutate</span>
              </div>
              <div className="p-1 rounded bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-center">
                <span className="text-[9px] font-bold text-purple-600 uppercase">3. Stream</span>
                <span className="text-[8px] text-slate-500 leading-tight">&lt;Updater /&gt;</span>
              </div>
              <div className="p-1 rounded bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-center">
                <span className="text-[9px] font-bold text-amber-600 uppercase">4. Store</span>
                <span className="text-[8px] text-slate-500 leading-tight">Sync Key++</span>
              </div>
              <div className="p-1 rounded bg-white border border-slate-200/80 shadow-2xs flex flex-col justify-center">
                <span className="text-[9px] font-bold text-blue-600 uppercase">5. List</span>
                <span className="text-[8px] text-slate-500 leading-tight">&lt;Suspense&gt;</span>
              </div>
            </div>

            <div className="bg-purple-50/70 border border-purple-200/80 rounded-lg p-2 text-[11px] text-slate-600 leading-snug">
              <span className="font-semibold text-purple-900 block mb-0.5">The Magic of Headless Updaters:</span>
              Server Functions return Client Components! When <code>&lt;PatternTaskUpdater /&gt;</code> mounts, it executes client effects, notifying <code>useSyncExternalStore</code> without full-page reloads.
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/80 text-[10px] font-sans font-medium text-slate-500 flex items-center justify-between shrink-0">
            <span>Official Pattern: <a href="https://dinou.dev/docs/pattern" target="_blank" rel="noreferrer" className="text-purple-600 underline font-semibold hover:text-purple-800">dinou.dev/docs/pattern</a></span>
            <span className="text-purple-600 font-semibold">Surgical Reactivity</span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-sans font-medium">
        <span>
          Evaluated via React 19 <code>&lt;Suspense&gt;</code>, Flight RPC, and native <code>useSyncExternalStore</code>.
        </span>
        <span className="text-purple-600 font-semibold">
          Dinou Architectural Pattern • 0 External Dependencies
        </span>
      </div>
    </div>
  );
}

export function PatternViewFallback() {
  return (
    <div className="w-full bg-white/95 border border-slate-200/90 rounded-2xl p-6 shadow-lg min-h-[340px] flex items-center justify-center">
      <div className="flex items-center gap-2 text-sm text-slate-500 font-sans font-medium">
        <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
        <span>Loading Dinou Pattern Lab...</span>
      </div>
    </div>
  );
}
