"use server";

import type { ReactNode } from "react";

export interface CatalogItem {
  id: string;
  name: string;
  category: "React 19" | "Server" | "Web APIs" | "Engine";
  description: string;
  badge: string;
  badgeColor: string;
}

const CATALOG_DATABASE: CatalogItem[] = [
  {
    id: "vt",
    name: "View Transitions",
    category: "React 19",
    description: "Declarative cross-fade and morph animations via native browser API.",
    badge: "v19.3.0",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
  },
  {
    id: "rsc",
    name: "Flight RSC Streaming",
    category: "Server",
    description: "Zero-bundle server components streamed concurrently over HTTP sockets.",
    badge: "Dinou v6",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    id: "opt",
    name: "useOptimistic Mutations",
    category: "React 19",
    description: "0ms immediate UI updates backed by Node.js Server Actions.",
    badge: "React 19",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
  },
  {
    id: "aud",
    name: "Web Audio Synthesizer",
    category: "Web APIs",
    description: "Native AudioContext oscillator preserved invisibly through <Activity>.",
    badge: "Browser API",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  {
    id: "ctx",
    name: "Server Context Proxy",
    category: "Server",
    description: "Direct access to cookies, request headers and redirect helpers via getContext().",
    badge: "Express RPC",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    id: "act",
    name: "Activity Tab Preservation",
    category: "React 19",
    description: "Offscreen DOM caching preserving canvas frame loops and WebGL state.",
    badge: "v19.3.0",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
  },
];

export async function filterCatalog(
  category: string = "All",
  query: string = ""
): Promise<ReactNode> {
  // Simulate network round-trip from Client Component to Node.js Server Function
  await new Promise((resolve) => setTimeout(resolve, 350));

  const filtered = CATALOG_DATABASE.filter((item) => {
    const matchesCategory = category === "All" || item.category === category;
    const matchesQuery =
      !query ||
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-4">
        <span className="text-xs text-slate-400 font-sans font-medium">
          No matching modules found on server for &ldquo;{query}&rdquo;
        </span>
      </div>
    );
  }

  // 🪄 Dinou capability: Return rendered JSX directly from Node.js (Flight RSC)
  return (
    <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[125px] pr-1 scrollbar-thin">
      {filtered.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors"
        >
          <div className="min-w-0 pr-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-sans font-semibold text-slate-900 truncate">
                {item.name}
              </span>
              <span
                className={`text-[9px] font-sans font-medium px-1.5 py-0.2 rounded border ${item.badgeColor}`}
              >
                {item.badge}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-sans truncate mt-0.5">
              {item.description}
            </p>
          </div>
          <span className="text-[9px] font-mono text-slate-400 shrink-0 bg-slate-50 px-1 py-0.5 rounded border border-slate-200/60">
            RSC Flight
          </span>
        </div>
      ))}
    </div>
  );
}
