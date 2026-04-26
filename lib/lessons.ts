import { LessonData } from "./lesson.types";
import { module1 } from "./modules/module1";
import { module2 } from "./modules/module2";
import { module3 } from "./modules/module3";
import { module4 } from "./modules/module4";
import { module5 } from "./modules/module5";

// Re-export the types for backwards compatibility in case other components import them directly from here
export type { LessonData, LessonSection, LessonQuiz } from "./lesson.types";

export const lessons: LessonData[] = [
  ...module1,
  ...module2,
  ...module3,
  ...module4,
  ...module5
];

export function getLessonBySlug(slug: string): LessonData | undefined {
  return lessons.find((l) => l.slug === slug);
}

export function getNextLesson(currentSlug: string): LessonData | undefined {
  const current = lessons.find((l) => l.slug === currentSlug);
  if (!current) return undefined;
  return lessons.find((l) => l.order === current.order + 1);
}
