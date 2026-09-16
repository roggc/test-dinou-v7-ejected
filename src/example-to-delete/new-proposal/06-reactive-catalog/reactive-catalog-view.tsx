"use client";

import { useState, useDeferredValue, Suspense, use, useMemo, type ReactNode } from "react";
import { filterCatalog } from "./server-functions/catalog-demo";

const CATEGORIES = ["All", "React 19", "Server", "Web APIs"] as const;

function CatalogStream({ catalogPromise }: { catalogPromise: Promise<ReactNode> }) {
  const content = use(catalogPromise);
  return <>{content}</>;
}

export function ReactiveCatalogView() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const deferredQuery = useDeferredValue(searchQuery);

  const catalogPromise = useMemo(() => {
    return filterCatalog(selectedCategory, deferredQuery);
  }, [selectedCategory, deferredQuery]);

  const isFiltering = searchQuery !== deferredQuery;

  return (
    <div className="w-full bg-white/95 border border-slate-200/90 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-lg flex flex-col justify-between font-sans">
      {/* Top Header: Framework & React Capabilities */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-200/80 w-full">
        <div className="max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-xs font-semibold text-slate-800">
              Reactive Client Component: Server Functions Returning Flight JSX
            </span>
          </div>
          <span className="text-[11px] text-slate-600 block mt-0.5 leading-snug">
            In Client Components, React 19 <code>use()</code> + <code>useDeferredValue</code> re-evaluates Server Functions declaratively—<strong>without useEffect or external query libraries</strong>. The server streams rendered JSX components directly!
          </span>
        </div>

        <span
          className={`text-[11px] font-sans font-medium px-2.5 py-1 rounded-md border transition-colors ${
            isFiltering
              ? "text-purple-800 bg-purple-100 border-purple-300 animate-pulse font-semibold"
              : "text-purple-700 bg-purple-50 border-purple-200"
          }`}
        >
          {isFiltering ? "⚡ FILTERING IN NODE.JS..." : "REACT 19 NATIVE STREAM: ACTIVE"}
        </span>
      </div>

      {/* Main Dual-Card Stage - locked to 50/50 columns & fixed 235px height */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 w-full items-start">
        {/* Card 1: Reactive Catalog Viewer */}
        <div className="w-full min-w-0 rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 flex flex-col justify-between relative h-[235px] min-h-[235px] max-h-[235px] shadow-2xs overflow-hidden">
          {/* Card 1 Top Bar: Search Input */}
          <div className="flex items-center justify-between gap-2 w-full h-6 shrink-0">
            <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-slate-500 shrink-0">
              1. Live Flight JSX Catalog
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search server catalog..."
              className="bg-white border border-slate-200 rounded-md px-2 py-0.5 text-[11px] font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500 w-36 sm:w-44"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 my-1 overflow-x-auto scrollbar-thin shrink-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-0.5 rounded text-[10px] font-sans font-medium transition cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? "bg-purple-600 text-white shadow-2xs"
                    : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Suspended JSX Stream from Server Function via React 19 use() + Suspense */}
          <div className="my-auto h-[125px] overflow-hidden shrink-0">
            <Suspense
              key={`catalog-${selectedCategory}-${deferredQuery}`}
              fallback={
                <div className="flex flex-col gap-1.5 h-full justify-center">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-12 bg-white/70 border border-slate-200 rounded-lg animate-pulse p-2 flex flex-col justify-between"
                    >
                      <div className="h-3 w-1/3 bg-slate-200 rounded" />
                      <div className="h-2 w-2/3 bg-slate-100 rounded" />
                    </div>
                  ))}
                </div>
              }
            >
              <CatalogStream catalogPromise={catalogPromise} />
            </Suspense>
          </div>

          {/* Bottom Resource Key Info */}
          <div className="pt-1.5 border-t border-slate-200/80 text-[10px] font-sans font-medium text-slate-500 flex items-center justify-between shrink-0">
            <span className="truncate">Filter: <code>[{selectedCategory}]</code></span>
            <span className="text-purple-600 font-semibold shrink-0">Flight RSC Stream</span>
          </div>
        </div>

        {/* Card 2: Architecture Deep Dive */}
        <div className="w-full min-w-0 rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 flex flex-col justify-between relative h-[235px] min-h-[235px] max-h-[235px] shadow-2xs overflow-hidden">
          <div className="flex items-center justify-between w-full h-5 shrink-0">
            <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-slate-500">
              2. How Dinou Reactive Suspense Works
            </span>
            <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 border border-purple-200/60 px-1.5 py-0.2 rounded">
              Zero useEffect
            </span>
          </div>

          {/* Architectural Points */}
          <div className="my-auto py-1 flex flex-col gap-1.5 h-[145px] shrink-0 justify-center text-[11px]">
            <div className="bg-white p-2 rounded-lg border border-slate-200/80 shadow-2xs">
              <span className="font-semibold text-slate-900 block text-xs mb-0.5">
                1. Declarative Dependency Invalidation
              </span>
              <p className="text-slate-600 leading-snug">
                <code>useMemo</code> produces a fresh Promise when filters change, and React 19's native <code>use()</code> hook suspends automatically without manual effect cleanup.
              </p>
            </div>

            <div className="bg-purple-50/60 border border-purple-200/70 rounded-lg p-2 text-slate-600 leading-snug">
              <span className="font-semibold text-purple-900 block text-xs mb-0.5">
                2. Server Returns Components, Not Just JSON
              </span>
              <p className="leading-snug">
                The Node.js server executes <code>filterCatalog()</code> and serializes pre-styled JSX cards via the Flight protocol. The client downloads 0 KB of rendering logic.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/80 text-[10px] font-sans font-medium text-slate-500 flex items-center justify-between shrink-0">
            <span>React 19 native use() + Suspense</span>
            <span className="text-purple-600 font-semibold">Native Flight RPC</span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-sans font-medium">
        <span>
          Powered by React 19 native <code>use()</code> + Dinou Server Functions returning JSX.
        </span>
        <span className="text-purple-600 font-semibold">
          Component Streaming • Zero Client State Library
        </span>
      </div>
    </div>
  );
}

export function ReactiveCatalogViewFallback() {
  return (
    <div className="w-full bg-white/95 border border-slate-200/90 rounded-2xl p-6 shadow-lg min-h-[340px] flex items-center justify-center">
      <div className="flex items-center gap-2 text-sm text-slate-500 font-sans font-medium">
        <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
        <span>Loading Reactive Flight Catalog...</span>
      </div>
    </div>
  );
}
