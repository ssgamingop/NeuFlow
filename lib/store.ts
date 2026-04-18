"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProgressState {
  completedLessons: string[];
  currentLesson: string | null;
  completeLesson: (slug: string) => void;
  setCurrentLesson: (slug: string | null) => void;
  isCompleted: (slug: string) => boolean;
  getProgress: () => number;
  resetProgress: () => void;
}

const TOTAL_LESSONS = 5;

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedLessons: [],
      currentLesson: null,

      completeLesson: (slug: string) =>
        set((state) => ({
          completedLessons: state.completedLessons.includes(slug)
            ? state.completedLessons
            : [...state.completedLessons, slug],
        })),

      setCurrentLesson: (slug: string | null) =>
        set({ currentLesson: slug }),

      isCompleted: (slug: string) =>
        get().completedLessons.includes(slug),

      getProgress: () =>
        (get().completedLessons.length / TOTAL_LESSONS) * 100,

      resetProgress: () =>
        set({ completedLessons: [], currentLesson: null }),
    }),
    { name: "neuflow-progress" }
  )
);
