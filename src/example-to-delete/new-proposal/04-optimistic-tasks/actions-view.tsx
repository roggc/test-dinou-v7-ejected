"use client";

import { useState, useOptimistic, useActionState, startTransition, useRef } from "react";
import {
  addTaskAction,
  toggleTaskAction,
  deleteTaskAction,
  resetTasksAction,
  type TaskItem,
} from "./server-functions/actions-demo";

type OptimisticAction =
  | { type: "add"; task: TaskItem }
  | { type: "toggle"; id: string; completed: boolean }
  | { type: "delete"; id: string }
  | { type: "reset" };

interface MutationLog {
  id: string;
  type: "ADD" | "TOGGLE" | "DELETE" | "RESET";
  target: string;
  optimisticMs: number;
  serverMs: number;
  status: "optimistic" | "synced";
  timestamp: string;
}

interface ActionsViewProps {
  initialTasks?: TaskItem[];
}

const DEFAULT_TASKS: TaskItem[] = [
  { id: "1", title: "Stream Flight RSC without blocking TTFB", category: "Server", completed: true, status: "synced" },
  { id: "2", title: "Leverage useOptimistic for 0ms Task mutations", category: "React 19", completed: false, status: "synced" },
  { id: "3", title: "Explore Dinou v6 native Server Actions", category: "Framework", completed: false, status: "synced" },
];

export function ActionsView({ initialTasks }: ActionsViewProps) {
  const formRef = useRef<HTMLFormElement>(null);

  // 1. Task Board State (hydrated from Server Component or default fallback)
  const [tasks, setTasks] = useState<TaskItem[]>(
    initialTasks !== undefined ? initialTasks : DEFAULT_TASKS
  );

  // 2. Mutation Lifecycle Log for real-time visual telemetry
  const [lastLog, setLastLog] = useState<MutationLog>({
    id: "init",
    type: "RESET",
    target: "Initial Tasks Synced with Node.js",
    optimisticMs: 0,
    serverMs: 0,
    status: "synced",
    timestamp: new Date().toLocaleTimeString(),
  });

  // 3. React 19 useOptimistic hook
  const [optimisticTasks, setOptimisticTasks] = useOptimistic(
    tasks,
    (currentTasks: TaskItem[], action: OptimisticAction): TaskItem[] => {
      switch (action.type) {
        case "add": {
          const exists = currentTasks.some(
            (t) => t.id === action.task.id || (t.title === action.task.title && t.category === action.task.category)
          );
          if (exists) return currentTasks;
          return [action.task, ...currentTasks.slice(0, 5)];
        }
        case "toggle":
          return currentTasks.map((t) =>
            t.id === action.id ? { ...t, completed: action.completed, status: "optimistic" } : t
          );
        case "delete":
          return currentTasks.filter((t) => t.id !== action.id);
        case "reset":
          return DEFAULT_TASKS;
        default:
          return currentTasks;
      }
    }
  );

  // Set of task IDs currently synchronizing with Node.js in the background
  const [syncingIds, setSyncingIds] = useState<Set<string>>(new Set());

  // 4. Form Action using React 19 useActionState with auto-reset and useOptimistic
  const [, formAction, isFormPending] = useActionState(
    async (_prev: any, formData: FormData) => {
      const title = (formData.get("title") as string)?.trim();
      const category = ((formData.get("category") as any) || "React 19") as TaskItem["category"];
      if (!title) return tasks;

      // Instantly reset input box so user doesn't see lingering text
      formRef.current?.reset();

      const startTime = performance.now();
      const newId = String(Date.now());
      formData.set("id", newId);

      const optimisticNew: TaskItem = {
        id: newId,
        title,
        category,
        completed: false,
        status: "optimistic",
      };

      // 0ms optimistic trigger
      setOptimisticTasks({ type: "add", task: optimisticNew });
      setLastLog({
        id: newId,
        type: "ADD",
        target: `"${title}"`,
        optimisticMs: 0,
        serverMs: 0,
        status: "optimistic",
        timestamp: new Date().toLocaleTimeString(),
      });

      // Persist to Node.js backend
      const updated = await addTaskAction(formData);
      const elapsed = Math.round(performance.now() - startTime);

      setTasks(updated);
      setLastLog((prev) => ({
        ...prev,
        serverMs: elapsed,
        status: "synced",
      }));

      return updated;
    },
    tasks
  );

  const handleToggle = (task: TaskItem) => {
    const targetCompleted = !task.completed;
    const startTime = performance.now();

    // 1. Instant 0ms local mutation: completely unblocked, allowing rapid concurrent clicks
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, completed: targetCompleted, status: "optimistic" } : t
      )
    );
    setSyncingIds((prev) => new Set(prev).add(task.id));

    setLastLog({
      id: task.id,
      type: "TOGGLE",
      target: `"${task.title}" -> ${targetCompleted ? "Done" : "Pending"}`,
      optimisticMs: 0,
      serverMs: 0,
      status: "optimistic",
      timestamp: new Date().toLocaleTimeString(),
    });

    // 2. Fire Server Action in the background without blocking the UI
    startTransition(async () => {
      try {
        await toggleTaskAction(task.id, targetCompleted);
        const elapsed = Math.round(performance.now() - startTime);

        // Mark this specific task as synced without touching or overwriting other in-flight tasks
        setTasks((prev) =>
          prev.map((t) => (t.id === task.id ? { ...t, status: "synced" } : t))
        );
        setSyncingIds((prev) => {
          const next = new Set(prev);
          next.delete(task.id);
          return next;
        });

        setLastLog((prev) => ({
          ...prev,
          serverMs: elapsed,
          status: "synced",
        }));
      } catch (err) {
        // Rollback on network/server error
        setTasks((prev) =>
          prev.map((t) => (t.id === task.id ? { ...t, completed: !targetCompleted, status: "synced" } : t))
        );
        setSyncingIds((prev) => {
          const next = new Set(prev);
          next.delete(task.id);
          return next;
        });
      }
    });
  };

  const handleDelete = (task: TaskItem) => {
    const startTime = performance.now();
    const deletedTask = task;

    // 0ms instant local removal
    setTasks((prev) => prev.filter((t) => t.id !== task.id));
    setSyncingIds((prev) => new Set(prev).add(task.id));

    setLastLog({
      id: task.id,
      type: "DELETE",
      target: `"${task.title}"`,
      optimisticMs: 0,
      serverMs: 0,
      status: "optimistic",
      timestamp: new Date().toLocaleTimeString(),
    });

    startTransition(async () => {
      try {
        await deleteTaskAction(task.id);
        const elapsed = Math.round(performance.now() - startTime);

        setSyncingIds((prev) => {
          const next = new Set(prev);
          next.delete(task.id);
          return next;
        });

        setLastLog((prev) => ({
          ...prev,
          serverMs: elapsed,
          status: "synced",
        }));
      } catch (err) {
        // Rollback if delete fails
        setTasks((prev) => [deletedTask, ...prev]);
        setSyncingIds((prev) => {
          const next = new Set(prev);
          next.delete(task.id);
          return next;
        });
      }
    });
  };

  const handleReset = () => {
    const startTime = performance.now();
    setTasks(DEFAULT_TASKS);
    setSyncingIds(new Set());

    setLastLog({
      id: "reset",
      type: "RESET",
      target: "Default Tasks (3 items)",
      optimisticMs: 0,
      serverMs: 0,
      status: "optimistic",
      timestamp: new Date().toLocaleTimeString(),
    });

    startTransition(async () => {
      await resetTasksAction();
      const elapsed = Math.round(performance.now() - startTime);

      setLastLog((prev) => ({
        ...prev,
        serverMs: elapsed,
        status: "synced",
      }));
    });
  };

  const isPending = syncingIds.size > 0 || isFormPending;
  const completedCount = optimisticTasks.filter((t) => t.completed).length;

  return (
    <div className="w-full bg-white/95 border border-slate-200/90 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-lg flex flex-col justify-between font-sans">
      {/* Top Header: Framework & React Capabilities */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-200/80 w-full">
        <div className="max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="text-xs font-semibold text-slate-800">
              React 19 &amp; Dinou Data Fetching: Server Actions &amp; 0ms Optimistic UI
            </span>
          </div>
          <span className="text-[11px] text-slate-600 block mt-0.5 leading-snug">
            Full-stack Task Board with zero external dependencies: <code>useOptimistic</code> delivers <strong>0ms local UI updates</strong> while Dinou Server Actions persist changes in Node.js.
          </span>
        </div>

        <span
          className={`text-[11px] font-sans font-medium px-2.5 py-1 rounded-md border transition-colors ${
            isPending
              ? "text-amber-800 bg-amber-50 border-amber-300 animate-pulse font-semibold"
              : "text-indigo-700 bg-indigo-50 border-indigo-200"
          }`}
        >
          {syncingIds.size > 0
            ? `⚡ PERSISTING ${syncingIds.size > 1 ? `(${syncingIds.size} ACTIONS)` : ""} IN NODE.JS...`
            : isFormPending
            ? "⚡ ADDING TASK IN NODE.JS..."
            : "OPTIMISTIC ACTIONS: READY"}
        </span>
      </div>

      {/* Main Dual-Card Stage - locked to 50/50 columns & fixed 235px height */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 w-full items-start">
        {/* Card 1: Full-Stack Optimistic Task Board */}
        <div className="w-full min-w-0 rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 flex flex-col justify-between relative h-[235px] min-h-[235px] max-h-[235px] shadow-2xs overflow-hidden">
          {/* Card 1 Top Bar */}
          <div className="flex items-center justify-between w-full h-5 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-slate-500">
                1. Optimistic Tasks
              </span>
              <span className="text-[10px] font-sans font-semibold px-1.5 py-0.2 rounded bg-indigo-100/70 text-indigo-700 border border-indigo-200/60">
                {completedCount}/{optimisticTasks.length} Done
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="text-[10px] font-sans font-medium text-slate-400 hover:text-slate-700 underline cursor-pointer transition-colors"
                title="Reset to default tasks"
              >
                Reset
              </button>
              <div className="flex items-center gap-1 text-[11px] font-sans font-medium text-indigo-600">
                <span className={`w-1.5 h-1.5 rounded-full ${isPending ? "bg-amber-500 animate-pulse" : "bg-indigo-500"}`} />
                <span>{isPending ? "SYNCING..." : "0MS OPTIMISTIC"}</span>
              </div>
            </div>
          </div>

          {/* Task List (Scrollable, fixed height) */}
          <div className="flex flex-col gap-1.5 my-1 overflow-y-auto max-h-[125px] pr-1 scrollbar-thin">
            {optimisticTasks.map((task) => {
              const isItemOptimistic = task.status === "optimistic" || syncingIds.has(task.id);
              return (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-1.5 px-2 rounded-lg bg-white border transition-all ${
                    isItemOptimistic
                      ? "border-amber-300 bg-amber-50/40 shadow-2xs"
                      : "border-slate-200/80 shadow-2xs"
                  }`}
                >
                  {/* Checkbox and Title */}
                  <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                    <button
                      type="button"
                      onClick={() => handleToggle(task)}
                      className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer shrink-0 transition-colors ${
                        task.completed
                          ? "bg-emerald-500 border-emerald-600 text-white"
                          : "border-slate-300 bg-white hover:border-slate-400"
                      }`}
                      title={task.completed ? "Mark incomplete" : "Mark completed"}
                    >
                      {task.completed && (
                        <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M2.5 6L5 8.5L9.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>

                    <span
                      className={`text-xs font-sans truncate ${
                        task.completed ? "line-through text-slate-400" : "text-slate-800 font-medium"
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  {/* Category & Status Pill & Delete */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`text-[9px] font-sans font-medium px-1.5 py-0.5 rounded border ${
                        task.category === "Server"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : task.category === "React 19"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {task.category}
                    </span>

                    {isItemOptimistic && (
                      <span className="text-[9px] font-sans font-semibold px-1 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                        ⚡ 0ms
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(task)}
                      className="w-4 h-4 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center cursor-pointer transition text-xs leading-none"
                      title="Delete task"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Task Compact Form with auto-reset ref */}
          <form
            ref={formRef}
            action={formAction}
            className="flex items-center gap-1.5 pt-1.5 border-t border-slate-200/80 shrink-0"
          >
            <input
              name="title"
              placeholder="Add task (optimistic)..."
              required
              className="flex-1 bg-white border border-slate-200 rounded-md px-2 py-1 text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 min-w-0"
            />
            <select
              name="category"
              defaultValue="React 19"
              className="bg-white border border-slate-200 rounded-md px-1.5 py-1 text-[11px] font-sans text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="React 19">React 19</option>
              <option value="Server">Server</option>
              <option value="Framework">Framework</option>
            </select>
            <button
              type="submit"
              disabled={isPending}
              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-sans font-medium transition cursor-pointer shrink-0 disabled:opacity-50"
            >
              + Add
            </button>
          </form>
        </div>

        {/* Card 2: Live Optimistic Lifecycle & Event Monitor */}
        <div className="w-full min-w-0 rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 flex flex-col justify-between relative h-[235px] min-h-[235px] max-h-[235px] shadow-2xs overflow-hidden">
          {/* Card 2 Top Bar */}
          <div className="flex items-center justify-between w-full h-5 shrink-0">
            <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-slate-500">
              2. Optimistic Lifecycle Monitor
            </span>

            {lastLog.status === "optimistic" ? (
              <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-full animate-pulse flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                ⚡ 0ms Optimistic (In Flight)
              </span>
            ) : (
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {lastLog.serverMs > 0 ? `✓ Synced in ${lastLog.serverMs}ms` : "✓ Synced with Node.js"}
              </span>
            )}
          </div>

          {/* Dynamic Telemetry Box */}
          <div className="my-auto py-1 flex flex-col gap-1.5 h-[145px] shrink-0 justify-center text-[11px]">
            {/* Live Mutation Details */}
            <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-2xs">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                    lastLog.type === "ADD" ? "bg-indigo-100 text-indigo-700" :
                    lastLog.type === "TOGGLE" ? "bg-purple-100 text-purple-700" :
                    lastLog.type === "DELETE" ? "bg-rose-100 text-rose-700" :
                    "bg-slate-100 text-slate-700"
                  }`}>
                    {lastLog.type}
                  </span>
                  <span className="font-semibold text-slate-800 truncate max-w-[180px] text-xs">
                    {lastLog.target}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{lastLog.timestamp}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-[10px]">
                <div>
                  <span className="text-slate-400 block">UI Render Latency:</span>
                  <span className="font-bold text-amber-600 font-mono">⚡ 0ms (Instant)</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Node.js RPC Roundtrip:</span>
                  <span className="font-bold font-mono text-emerald-600">
                    {lastLog.status === "optimistic" ? (
                      <span className="text-amber-600 animate-pulse">Running in Node...</span>
                    ) : (
                      `${lastLog.serverMs}ms (Confirmed)`
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Architecture Explanation */}
            <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-2 text-slate-600 leading-snug">
              <span className="font-semibold text-indigo-950 block text-[11px] mb-0.5">
                • How useOptimistic(tasks, updateFn) Operates:
              </span>
              <p className="text-[10px] text-slate-600">
                1. Local reducer applies mutation ahead of network at <strong>0ms</strong>.<br />
                2. Server Action executes in Node.js backend concurrently.<br />
                3. Transition completes and reconciles with confirmed server state.
              </p>
            </div>
          </div>

          {/* Card 2 Footer */}
          <div className="pt-2 border-t border-slate-200/80 text-[10px] font-sans font-medium text-slate-500 flex items-center justify-between shrink-0">
            <span>useOptimistic + Server Actions</span>
            <span className="text-indigo-600 font-semibold font-mono">React 19 Native</span>
          </div>
        </div>
      </div>

      {/* Main Container Footer */}
      <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-sans font-medium">
        <span>
          Powered by React 19 <code>useOptimistic</code> + <code>useActionState</code> + Dinou Server Functions.
        </span>
        <span className="text-indigo-600 font-semibold">
          100% Native Standard • 0 External State Stores
        </span>
      </div>
    </div>
  );
}

export function ActionsViewFallback() {
  return (
    <div className="w-full bg-white/95 border border-slate-200/90 rounded-2xl p-6 shadow-lg min-h-[340px] flex items-center justify-center font-sans">
      <div className="flex items-center gap-2 text-sm text-slate-500 font-sans font-medium">
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
        <span>Loading Optimistic Actions &amp; Tasks...</span>
      </div>
    </div>
  );
}
