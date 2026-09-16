"use client";

import { useEffect } from "react";
import { patternStore } from "../pattern-store";

export default function PatternTaskUpdater({
  id,
  taskText,
}: {
  id?: string;
  taskText?: string;
}) {
  useEffect(() => {
    // 🪄 When mounted on the client after the Server Function response,
    // atomically updates the global store.
    patternStore.incrementTasksListKey();
  }, [id, taskText]);

  return null; // Headless component: does not emit DOM
}
