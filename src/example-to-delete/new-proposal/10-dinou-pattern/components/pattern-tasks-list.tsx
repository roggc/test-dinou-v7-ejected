"use client";

export interface PatternTaskItem {
  id: string;
  text: string;
  createdAt: string;
}

export default function PatternTasksList({ tasks }: { tasks: PatternTaskItem[] }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-4 text-slate-400 text-xs italic bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
        No tasks in the store. Add one above!
      </div>
    );
  }

  return (
    <div className="space-y-1.5 overflow-y-auto max-h-[110px] pr-1 scrollbar-thin">
      {tasks.map((task, idx) => (
        <div
          key={task.id}
          className="flex items-center justify-between p-2 bg-white border border-slate-200/80 rounded-lg shadow-2xs hover:border-purple-300 transition-colors"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
            <span className="text-[11px] font-medium text-slate-800 truncate">{task.text}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <span className="text-[9px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
              {task.createdAt}
            </span>
            <span className="text-[9px] font-mono font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">
              #{idx + 1}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
