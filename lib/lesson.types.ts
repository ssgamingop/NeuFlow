import { LucideIcon } from "lucide-react";

export interface LessonSection {
  title: string;
  content: string;
  visualType?: "image" | "3d";
  visualUrl?: string; // e.g. Unsplash URL
  visualComponent?: string; // unique ID for 3D component (e.g. "ScatterPlot3D")
}

export interface LessonQuiz {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface LessonData {
  slug: string;
  title: string;
  description: string;
  icon: any; // We'll use LucideIcon but type as any to avoid import issues in some cases
  color: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  order: number;
  module: number; // To track which module this belongs to
  sections: LessonSection[];
  quiz: LessonQuiz[];
}
