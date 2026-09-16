"use server";

import type { ReactNode } from "react";
import PatternTaskUpdater from "../components/pattern-updater";
import PatternTasksList, { type PatternTaskItem } from "../components/pattern-tasks-list";

// In-memory simulated database for use case 10
export const patternTasksDb: PatternTaskItem[] = [
  { id: "1", text: "Test Dinou Pattern with React 19", createdAt: "10:00:00" },
  { id: "2", text: "Headless Client Component Streaming", createdAt: "10:05:00" },
];

/**
 * 1. Dinou Pattern Mutation:
 * Executes the mutation in Node.js and returns the Headless client component.
 */
export async function addPatternTask(text: string): Promise<ReactNode> {
  // Simulate small database latency in Node.js (250ms)
  await new Promise((resolve) => setTimeout(resolve, 250));

  const trimmed = text.trim();
  const id = Math.random().toString(36).substring(2, 9);
  if (trimmed) {
    patternTasksDb.unshift({
      id,
      text: trimmed,
      createdAt: new Date().toLocaleTimeString(),
    });
  }

  // 🪄 The server orchestrates the client by returning the updater with a unique id
  return <PatternTaskUpdater key={id} id={id} taskText={trimmed} />;
}

/**
 * 2. Data Query:
 * Returns the tasks rendered on the server over Flight RPC.
 */
export async function fetchPatternTasks(): Promise<ReactNode> {
  // Simulate small query latency (180ms)
  await new Promise((resolve) => setTimeout(resolve, 180));

  return <PatternTasksList tasks={[...patternTasksDb]} />;
}
