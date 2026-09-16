// Pure Server Component: executed exclusively in Node.js on the server.
// Notice there is NO "use client" directive here.
// This component has direct access to Node.js APIs (process, server time, etc.)
// and sends ZERO bytes of component JavaScript to the client browser.

export default function PureServerSlot() {
  const nodeVersion = process.version;
  const platform = process.platform;
  const memoryMB = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
  const serverTimestamp = new Date().toLocaleTimeString();

  return (
    <div className="w-full min-w-0 rounded-xl border border-slate-800 bg-slate-900 p-3.5 flex flex-col justify-between relative h-[235px] min-h-[235px] max-h-[235px] shadow-2xs overflow-hidden text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-xs text-white">
            Pure Server Component (Slot)
          </span>
        </div>
        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full">
          Node.js • 0 KB Client JS
        </span>
      </div>

      {/* Body / Metrics */}
      <div className="my-auto py-1 flex flex-col gap-1.5 h-[145px] shrink-0 justify-center text-[11px]">
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-2.5">
          <div className="grid grid-cols-2 gap-2 text-slate-300">
            <div>
              <span className="text-[10px] text-slate-400 block">Runtime Environment:</span>
              <span className="font-semibold text-white font-mono text-xs">{nodeVersion} ({platform})</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Server Heap Used:</span>
              <span className="font-semibold text-emerald-400 font-mono text-xs">~{memoryMB} MB</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-2 text-slate-300 leading-snug">
          <p className="text-[11px] text-slate-300">
            Rendered in Node.js at <strong className="text-white font-mono">{serverTimestamp}</strong> and passed as a prop from <code className="text-emerald-300 font-mono text-[10px]">page.tsx</code> into this Client Component.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-800 text-[10px] font-sans font-medium text-slate-400 flex items-center justify-between shrink-0">
        <span>RSC Composition Pattern</span>
        <span className="text-emerald-400 font-semibold font-mono">Flight JSX Streamed</span>
      </div>
    </div>
  );
}
