"use server";

export interface TaskItem {
  id: string;
  title: string;
  category: "Framework" | "React 19" | "Server";
  completed: boolean;
  status?: "synced" | "optimistic";
}

const INITIAL_TASKS: TaskItem[] = [
  { id: "1", title: "Stream Flight RSC without blocking TTFB", category: "Server", completed: true, status: "synced" },
  { id: "2", title: "Leverage useOptimistic for 0ms Task mutations", category: "React 19", completed: false, status: "synced" },
  { id: "3", title: "Explore Dinou v6 native Server Actions", category: "Framework", completed: false, status: "synced" },
];

// Pure in-memory RAM state (no disk writes, no globalThis).
// Now perfectly shared between SSR and Server Functions thanks to Dinou's loader harmonization.
let serverTasks: TaskItem[] = [...INITIAL_TASKS];

export async function getTasks(): Promise<TaskItem[]> {
  return [...serverTasks];
}

export async function addTaskAction(formData: FormData): Promise<TaskItem[]> {
  const id = (formData.get("id") as string)?.trim() || String(Date.now());
  const title = (formData.get("title") as string)?.trim() || "New Dinou v6 Task";
  const category = ((formData.get("category") as any) || "React 19") as TaskItem["category"];
  
  // Simulate network round-trip to Node.js server
  await new Promise((resolve) => setTimeout(resolve, 550));
  
  const newTask: TaskItem = {
    id,
    title,
    category,
    completed: false,
    status: "synced",
  };
  
  serverTasks = [newTask, ...serverTasks.slice(0, 5)];
  return [...serverTasks];
}

export async function toggleTaskAction(taskId: string, targetCompleted?: boolean): Promise<TaskItem[]> {
  // Simulate network round-trip to Node.js server
  await new Promise((resolve) => setTimeout(resolve, 400));
  
  serverTasks = serverTasks.map((t) =>
    t.id === taskId
      ? {
          ...t,
          completed: targetCompleted !== undefined ? targetCompleted : !t.completed,
          status: "synced" as const,
        }
      : t
  );
  return [...serverTasks];
}

export async function deleteTaskAction(taskId: string): Promise<TaskItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 350));
  
  serverTasks = serverTasks.filter((t) => t.id !== taskId);
  return [...serverTasks];
}

export async function resetTasksAction(): Promise<TaskItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  serverTasks = [...INITIAL_TASKS];
  return [...INITIAL_TASKS];
}
