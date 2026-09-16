"use server";

import type { ReactNode } from "react";

export interface ServerTelemetry {
  queryLatencyMs: number;
  dbRecordsScanned: number;
  memoryUsageMb: number;
  activeThreads: number;
  resolvedAt: string;
  cacheStatus: "HIT" | "MISS (STREAMED)";
  payload: Array<{ id: string; metric: string; value: string; status: "optimal" | "warning" }>;
}

export async function telemetryStreamCard(latencyMs: number = 800): Promise<ReactNode> {
  // Simulate database query execution time in Node.js
  await new Promise((resolve) => setTimeout(resolve, latencyMs));
  const memoryMb = Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 10) / 10;
  const resolvedAt = new Date().toLocaleTimeString();

  const payload = [
    { id: "1", metric: "Flight RSC Serialization", value: "0.4ms" },
    { id: "2", metric: "Express Socket Pipeline", value: "Active" },
    { id: "3", metric: "Node.js Heap Utilization", value: `${memoryMb} MB` },
    { id: "4", metric: "Client Shell Time-to-Render", value: "<10ms" },
  ];

  return (
    <div className="h-full flex flex-col justify-between p-2.5 bg-white border border-emerald-200 rounded-lg shadow-2xs">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-emerald-900 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Chunk Streamed ({latencyMs}ms)
        </span>
        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
          Resolved: {resolvedAt}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-1.5 my-auto">
        {payload.map((item) => (
          <div key={item.id} className="p-1 px-1.5 rounded bg-slate-50 border border-slate-200/60 flex items-center justify-between">
            <span className="text-[10px] text-slate-600 truncate">{item.metric}</span>
            <span className="text-[10px] font-mono font-bold text-slate-800 ml-1">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="text-[10px] text-slate-500 flex items-center justify-between">
        <span>Memory: {memoryMb} MB</span>
        <span className="font-semibold text-emerald-700">MISS (STREAMED)</span>
      </div>
    </div>
  );
}

export async function fetchServerTelemetry(latencyMs: number = 800): Promise<ServerTelemetry> {
  await new Promise((resolve) => setTimeout(resolve, latencyMs));
  const memoryMb = Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 10) / 10;
  return {
    queryLatencyMs: latencyMs,
    dbRecordsScanned: 14250,
    memoryUsageMb: memoryMb,
    activeThreads: 4,
    resolvedAt: new Date().toLocaleTimeString(),
    cacheStatus: "MISS (STREAMED)",
    payload: [
      { id: "1", metric: "Flight RSC Serialization", value: "0.4ms", status: "optimal" },
      { id: "2", metric: "Express Socket Pipeline", value: "Active", status: "optimal" },
      { id: "3", metric: "Node.js Heap Utilization", value: `${memoryMb} MB`, status: "optimal" },
      { id: "4", metric: "Client Shell Time-to-Render", value: "<10ms", status: "optimal" },
    ],
  };
}
