import { useSyncExternalStore } from "react";

// Pure native React 19 global state using useSyncExternalStore (0 external dependencies)
let tasksListKey = 0;
const listeners = new Set<() => void>();

export const patternStore = {
  getSnapshot: () => tasksListKey,
  incrementTasksListKey: () => {
    tasksListKey += 1;
    listeners.forEach((listener) => listener());
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useTasksListKey(): number {
  return useSyncExternalStore(
    patternStore.subscribe,
    patternStore.getSnapshot,
    patternStore.getSnapshot // For SSR compatibility
  );
}
