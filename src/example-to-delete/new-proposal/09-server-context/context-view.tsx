"use client";

import { useState, useEffect, useTransition } from "react";
import {
  getServerTelemetry,
  setServerBadgeCookie,
} from "./server-functions/context-demo";

interface TelemetryData {
  host: string;
  userAgent: string;
  method: string;
  path: string;
  nodeVersion: string;
  serverUptime: string;
  badgeMode: string;
  timestamp: string;
}

export function ContextView() {
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    host: "localhost:3000",
    userAgent: "Loading HTTP headers from Node.js...",
    method: "POST",
    path: "/____server_function____",
    nodeVersion: "Node.js v20+",
    serverUptime: "--",
    badgeMode: "Developer",
    timestamp: "--:--:--",
  });

  const [activeBadge, setActiveBadge] = useState<string>("Developer");
  const [isPending, startTransition] = useTransition();

  // Load telemetry on mount
  useEffect(() => {
    let isMounted = true;
    startTransition(async () => {
      try {
        const data = await getServerTelemetry();
        if (isMounted) {
          setTelemetry(data);
          setActiveBadge(data.badgeMode);
        }
      } catch (err) {
        console.error("Failed to load telemetry:", err);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleRefresh = () => {
    startTransition(async () => {
      const data = await getServerTelemetry();
      setTelemetry(data);
      setActiveBadge(data.badgeMode);
    });
  };

  const handleSetCookie = (badge: string) => {
    startTransition(async () => {
      await setServerBadgeCookie(badge);
      setActiveBadge(badge);
      const data = await getServerTelemetry();
      setTelemetry(data);
    });
  };

  return (
    <div className="w-full bg-white/95 border border-slate-200/90 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-lg flex flex-col justify-between">
      {/* Top Header: Framework & React Capabilities */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-200/80 w-full">
        <div className="max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-slate-800">
              Dinou HTTP Engine: Synchronous Server Request Context
            </span>
          </div>
          <span className="text-[11px] text-slate-600 block mt-0.5 leading-snug">
            Dinou exposes <code>getContext()</code> via <strong>AsyncLocalStorage</strong>: Server Functions &amp; RSC read HTTP headers, cookies, and query params synchronously, and can manipulate <code>res.cookie()</code> without Express route boilerplate.
          </span>
        </div>

        <span
          className={`text-[11px] font-sans font-medium px-2.5 py-1 rounded-md border transition-colors ${
            isPending
              ? "text-amber-800 bg-amber-50 border-amber-300 animate-pulse font-semibold"
              : "text-emerald-700 bg-emerald-50 border-emerald-200"
          }`}
        >
          {isPending ? "⚡ CALLING getContext() IN NODE.JS..." : "DINOU getContext(): READY"}
        </span>
      </div>

      {/* Main Dual-Card Stage - locked to 50/50 columns & fixed 235px height */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 w-full items-start">
        {/* Card 1: HTTP Request Telemetry */}
        <div className="w-full min-w-0 rounded-xl border border-slate-200/90 bg-slate-50/70 p-4 flex flex-col justify-between relative h-[235px] min-h-[235px] max-h-[235px] shadow-2xs overflow-hidden">
          <div className="flex items-center justify-between w-full h-5 shrink-0">
            <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-slate-500">
              1. HTTP Headers &amp; Runtime State
            </span>
            <div className="flex items-center gap-1.5 text-[11px] font-sans font-medium text-emerald-600">
              <span className={`w-1.5 h-1.5 rounded-full ${isPending ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`} />
              <span>{isPending ? "POLLING..." : "SYNCHRONOUS CTX"}</span>
            </div>
          </div>

          {/* Telemetry rows */}
          <div className="flex flex-col gap-1.5 my-auto text-xs font-sans">
            <div className="flex items-center justify-between p-1.5 rounded-md bg-white border border-slate-200/80">
              <span className="text-[11px] text-slate-500 font-medium">Host:</span>
              <span className="text-[11px] text-slate-800 font-semibold truncate max-w-[190px]">
                {telemetry.host}
              </span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-md bg-white border border-slate-200/80">
              <span className="text-[11px] text-slate-500 font-medium">User-Agent:</span>
              <span className="text-[11px] text-slate-800 font-semibold truncate max-w-[190px]" title={telemetry.userAgent}>
                {telemetry.userAgent}
              </span>
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-md bg-white border border-slate-200/80">
              <span className="text-[11px] text-slate-500 font-medium">Runtime:</span>
              <span className="text-[11px] text-slate-800 font-semibold">
                Node.js ({telemetry.nodeVersion}) &bull; {telemetry.serverUptime} uptime
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
            <span className="text-[10px] font-sans font-medium text-slate-500">
              Updated: {telemetry.timestamp}
            </span>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isPending}
              className="px-2.5 py-0.5 rounded-md bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-[11px] font-sans font-semibold transition active:scale-95 cursor-pointer shadow-2xs"
            >
              Refresh Headers
            </button>
          </div>
        </div>

        {/* Card 2: Server Cookie Manager */}
        <div className="w-full min-w-0 rounded-xl border border-slate-200/90 bg-slate-50/70 p-4 flex flex-col justify-between relative h-[235px] min-h-[235px] max-h-[235px] shadow-2xs overflow-hidden">
          <div className="flex items-center justify-between w-full h-5 shrink-0">
            <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-slate-500">
              2. Server Cookie Manager (res.cookie)
            </span>
            <div className="flex items-center gap-1.5 text-[11px] font-sans font-medium text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>HTTP-ONLY PROXY</span>
            </div>
          </div>

          {/* Active Cookie Display */}
          <div className="my-auto py-1 text-center flex flex-col items-center justify-center">
            <span className="text-[11px] text-slate-500 font-sans font-medium mb-1">
              Active Cookie: <code className="text-slate-800">dinou_badge</code>
            </span>
            <div className="px-4 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-base font-sans font-bold shadow-2xs flex items-center gap-2">
              <span>🏷️</span>
              <span>{activeBadge} Tier</span>
            </div>
            <span className="text-[10px] text-slate-400 font-sans font-medium mt-1">
              Persisted by Express &bull; Read on next SSR request
            </span>
          </div>

          {/* Cookie mutation buttons */}
          <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-200/80 w-full h-11 shrink-0">
            <button
              type="button"
              onClick={() => handleSetCookie("Pro")}
              disabled={isPending}
              className={`px-3 h-8 rounded-lg font-sans text-xs font-semibold transition active:scale-95 cursor-pointer shadow-2xs ${
                activeBadge === "Pro"
                  ? "bg-emerald-600 text-white border border-emerald-500"
                  : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
              }`}
            >
              Set &ldquo;Pro&rdquo;
            </button>
            <button
              type="button"
              onClick={() => handleSetCookie("Enterprise")}
              disabled={isPending}
              className={`px-3 h-8 rounded-lg font-sans text-xs font-semibold transition active:scale-95 cursor-pointer shadow-2xs ${
                activeBadge === "Enterprise"
                  ? "bg-emerald-600 text-white border border-emerald-500"
                  : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
              }`}
            >
              Set &ldquo;Enterprise&rdquo;
            </button>
            <button
              type="button"
              onClick={() => handleSetCookie("Developer")}
              disabled={isPending}
              className="px-2.5 h-8 rounded-lg bg-white border border-slate-300 text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-sans text-xs font-medium transition cursor-pointer shadow-2xs"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Explainer Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/80 text-[11px] text-slate-500 font-sans font-medium">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Dinou HTTP Context: Direct access to req and res in Server Functions</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60 font-sans font-medium">
            getContext().req
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60 font-sans font-medium">
            res.cookie()
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60 font-sans font-medium">
            AsyncLocalStorage
          </span>
        </div>
      </div>
    </div>
  );
}

export function ContextViewFallback() {
  return (
    <div className="w-full bg-white/95 border border-slate-200/90 rounded-2xl p-8 backdrop-blur-xl shadow-lg flex items-center justify-center min-h-[360px]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-sans font-medium text-slate-500">
          Connecting to Dinou HTTP Request Context...
        </span>
      </div>
    </div>
  );
}
