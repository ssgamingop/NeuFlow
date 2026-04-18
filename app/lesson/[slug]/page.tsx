import { lessons } from "@/lib/lessons";
import LessonClient from "./LessonClient";

export function generateStaticParams() {
  return lessons.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = lessons.find((l) => l.slug === slug);
  return {
    title: lesson ? `${lesson.title} — NeuFlow` : "Lesson — NeuFlow",
    description: lesson?.description ?? "Learn AI concepts interactively.",
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <LessonClient slug={slug} />;
}
