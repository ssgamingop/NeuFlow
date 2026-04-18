"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { getLessonBySlug, getNextLesson } from "@/lib/lessons";
import { useProgressStore } from "@/lib/store";
import Navbar from "@/app/components/Navbar";
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  XCircle,
  ArrowRight,
  BookOpen,
  Award,
} from "lucide-react";
import Link from "next/link";

export default function LessonClient({ slug }: { slug: string }) {
  const lesson = getLessonBySlug(slug);
  const nextLesson = getNextLesson(slug);
  const { completeLesson, isCompleted } = useProgressStore();
  const [currentSection, setCurrentSection] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!lesson) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-32 text-center">
          <h1 className="text-3xl font-bold">Lesson not found</h1>
          <Link href="/roadmap" className="text-primary mt-4 inline-block">
            Back to Roadmap
          </Link>
        </main>
      </>
    );
  }

  const completed = mounted && isCompleted(slug);
  const totalSections = lesson.sections.length;
  const isLastSection = currentSection === totalSections - 1;

  const handleNext = () => {
    if (isLastSection) {
      setShowQuiz(true);
      setQuizAnswers(new Array(lesson.quiz.length).fill(null));
    } else {
      setCurrentSection((s) => s + 1);
    }
  };

  const handlePrev = () => {
    if (showQuiz) {
      setShowQuiz(false);
      setQuizSubmitted(false);
    } else if (currentSection > 0) {
      setCurrentSection((s) => s - 1);
    }
  };

  const handleQuizAnswer = (qIndex: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = optionIndex;
      return next;
    });
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    const allCorrect = lesson.quiz.every(
      (q, i) => quizAnswers[i] === q.correctIndex
    );
    if (allCorrect) {
      completeLesson(slug);
    }
  };

  const allCorrect =
    quizSubmitted &&
    lesson.quiz.every((q, i) => quizAnswers[i] === q.correctIndex);
  const allAnswered = quizAnswers.every((a) => a !== null);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20">
        {/* Background */}
        <div className="fixed inset-0 -z-10 hero-bg" />
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.06)_0%,_transparent_60%)]" />

        <div className="max-w-3xl mx-auto px-6">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-muted mb-8"
          >
            <Link
              href="/roadmap"
              className="hover:text-foreground transition-colors"
            >
              Roadmap
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{lesson.title}</span>
          </motion.div>

          {/* Lesson header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${lesson.color}15` }}
              >
                <lesson.icon
                  className="w-6 h-6"
                  style={{ color: lesson.color }}
                />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  {lesson.title}
                </h1>
                <div className="flex items-center gap-3 text-sm text-muted mt-1">
                  <span>{lesson.duration}</span>
                  <span>•</span>
                  <span>{lesson.difficulty}</span>
                  {completed && (
                    <>
                      <span>•</span>
                      <span className="text-green-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Completed
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex items-center gap-2 mt-6">
              {lesson.sections.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setShowQuiz(false);
                    setCurrentSection(i);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentSection && !showQuiz
                      ? "w-8 bg-primary"
                      : i < currentSection || showQuiz
                      ? "w-4 bg-primary/40"
                      : "w-4 bg-surface-light"
                  }`}
                />
              ))}
              <button
                onClick={() => {
                  if (currentSection === totalSections - 1) setShowQuiz(true);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  showQuiz
                    ? "w-8 bg-accent"
                    : "w-4 bg-surface-light"
                }`}
              />
            </div>
          </motion.div>

          {/* Content area */}
          <AnimatePresence mode="wait">
            {!showQuiz ? (
              <motion.div
                key={`section-${currentSection}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="glass rounded-2xl p-8 md:p-10 mb-8"
              >
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted uppercase tracking-wider">
                    Section {currentSection + 1} of {totalSections}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-6 text-foreground">
                  {lesson.sections[currentSection].title}
                </h2>
                <div className="prose-custom text-muted leading-relaxed whitespace-pre-line text-[15px]">
                  {lesson.sections[currentSection].content
                    .split("\n\n")
                    .map((paragraph, pi) => (
                      <p key={pi} className="mb-4">
                        {paragraph.split("**").map((part, i) =>
                          i % 2 === 1 ? (
                            <strong key={i} className="text-foreground font-semibold">
                              {part}
                            </strong>
                          ) : (
                            <span key={i}>{part}</span>
                          )
                        )}
                      </p>
                    ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="glass rounded-2xl p-8 md:p-10 mb-8"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Award className="w-4 h-4 text-accent" />
                  <span className="text-xs text-muted uppercase tracking-wider">
                    Quick Quiz
                  </span>
                </div>

                <div className="space-y-8">
                  {lesson.quiz.map((q, qi) => (
                    <div key={qi}>
                      <p className="text-lg font-semibold text-foreground mb-4">
                        {qi + 1}. {q.question}
                      </p>
                      <div className="space-y-2">
                        {q.options.map((option, oi) => {
                          const selected = quizAnswers[qi] === oi;
                          const correct = q.correctIndex === oi;
                          let borderColor = "border-surface-border";
                          let bgColor = "";

                          if (quizSubmitted) {
                            if (correct) {
                              borderColor = "border-green-500/50";
                              bgColor = "bg-green-500/10";
                            } else if (selected && !correct) {
                              borderColor = "border-red-500/50";
                              bgColor = "bg-red-500/10";
                            }
                          } else if (selected) {
                            borderColor = "border-primary/50";
                            bgColor = "bg-primary/10";
                          }

                          return (
                            <button
                              key={oi}
                              onClick={() => handleQuizAnswer(qi, oi)}
                              className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 
                                ${borderColor} ${bgColor}
                                ${!quizSubmitted ? "hover:border-primary/30 hover:bg-primary/5 cursor-pointer" : ""}
                              `}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-muted">
                                  {String.fromCharCode(65 + oi)}.
                                </span>
                                <span className="text-sm text-foreground">
                                  {option}
                                </span>
                                {quizSubmitted && correct && (
                                  <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />
                                )}
                                {quizSubmitted && selected && !correct && (
                                  <XCircle className="w-4 h-4 text-red-400 ml-auto" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quiz submit / results */}
                <div className="mt-8">
                  {!quizSubmitted ? (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={!allAnswered}
                      className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                        allAnswered
                          ? "bg-gradient-to-r from-primary to-accent text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]"
                          : "bg-surface-light text-muted cursor-not-allowed"
                      }`}
                    >
                      Submit Answers
                    </button>
                  ) : allCorrect ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center"
                    >
                      <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-500/15 text-green-400 font-semibold mb-4">
                        <CheckCircle className="w-5 h-5" />
                        All Correct! Lesson Complete!
                      </div>
                      {nextLesson && (
                        <div className="mt-4">
                          <Link
                            href={`/lesson/${nextLesson.slug}`}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary to-accent text-white font-semibold hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-shadow"
                          >
                            Next: {nextLesson.title}
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <div className="text-center">
                      <p className="text-red-400 mb-4">
                        Some answers were incorrect. Review the lesson and try
                        again!
                      </p>
                      <button
                        onClick={() => {
                          setQuizSubmitted(false);
                          setQuizAnswers(
                            new Array(lesson.quiz.length).fill(null)
                          );
                        }}
                        className="px-6 py-3 rounded-full bg-surface-light text-foreground font-semibold hover:bg-primary/10 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentSection === 0 && !showQuiz}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                currentSection === 0 && !showQuiz
                  ? "text-muted/40 cursor-not-allowed"
                  : "text-muted hover:text-foreground hover:bg-surface-light"
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            {!showQuiz && (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/15 text-primary-light text-sm font-medium hover:bg-primary/25 transition-all"
              >
                {isLastSection ? "Take Quiz" : "Next"}{" "}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
