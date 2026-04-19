"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { lessons } from "@/lib/lessons";
import { useProgressStore } from "@/lib/store";
import { CheckCircle, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "../components/Navbar";

export default function RoadmapPage() {
  const { isCompleted, getProgress, completedLessons } = useProgressStore();
  const progress = getProgress();
  const pageRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Header Entrance
    gsap.fromTo(".roadmap-header",
       { opacity: 0, y: 30 },
       { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );

    // Progress Bar Animation
    if (progressBarRef.current) {
        gsap.fromTo(progressBarRef.current,
           { width: "0%" },
           { width: `${progress}%`, duration: 1.5, delay: 0.5, ease: "power2.out" }
        );
    }

    // Nodes Stagger (Stagger from left and right alternately)
    const nodes = document.querySelectorAll(".roadmap-node");
    nodes.forEach((node, i) => {
        const isEven = i % 2 === 0;
        gsap.fromTo(node,
            { opacity: 0, x: isEven ? -40 : 40 },
            { opacity: 1, x: 0, duration: 0.7, delay: i * 0.15 + 0.3, ease: "back.out(1.2)" }
        );
    });

    // Trophy Pop
    gsap.fromTo(".roadmap-trophy",
       { opacity: 0, scale: 0 },
       { opacity: 1, scale: 1, duration: 0.8, delay: nodes.length * 0.15 + 0.5, ease: "elastic.out(1, 0.5)" }
    );
  }, { scope: pageRef });

  return (
    <>
      <Navbar />
      <main ref={pageRef} className="min-h-screen pt-24 pb-20">
        {/* Background */}
        <div className="fixed inset-0 -z-10 hero-bg" />
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_rgba(139,92,246,0.08)_0%,_transparent_60%)]" />

        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="roadmap-header text-center mb-16 opacity-0 translate-y-8">
            <span className="text-sm text-accent font-medium tracking-widest uppercase mb-4 block">
              Your Journey
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Learning <span className="gradient-text">Roadmap</span>
            </h1>
            <p className="text-muted max-w-lg mx-auto text-lg">
              Master AI from the ground up. Complete each lesson to unlock your understanding.
            </p>

            {/* Progress bar */}
            <div className="mt-8 max-w-md mx-auto">
              <div className="flex items-center justify-between text-sm text-muted mb-2">
                <span>{completedLessons.length} of {lessons.length} complete</span>
                <span className="font-semibold text-primary">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 rounded-full bg-surface-light overflow-hidden">
                <div
                  ref={progressBarRef}
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                  style={{ width: "0%" }}
                />
              </div>
            </div>
          </div>

          {/* Lesson nodes */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary/30 via-accent/20 to-neon-pink/30" />

            {lessons.map((lesson, i) => {
              const completed = isCompleted(lesson.slug);
              const isEven = i % 2 === 0;

              return (
                <div
                  key={lesson.slug}
                  className={`roadmap-node opacity-0 relative flex items-center mb-12 ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Node dot on the line */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                        completed
                          ? "bg-primary border-primary shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                          : "bg-surface border-primary/30"
                      }`}
                    >
                      {completed ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <span className="text-xs font-bold text-muted">
                          {lesson.order}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    className={`ml-20 md:ml-0 md:w-[calc(50%-2rem)] ${
                      isEven ? "md:pr-8 md:text-right" : "md:pl-8"
                    }`}
                  >
                    <Link href={`/lesson/${lesson.slug}`}>
                      <div
                        className={`glass rounded-2xl p-6 group cursor-pointer transition-all duration-300 hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl ${
                          completed ? "border-primary/20" : ""
                        }`}
                        style={{
                          boxShadow: completed
                            ? `0 0 20px ${lesson.color}15`
                            : "none",
                        }}
                      >
                        <div
                          className={`flex items-center gap-3 mb-3 ${
                            isEven ? "md:flex-row-reverse" : ""
                          }`}
                        >
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${lesson.color}15` }}
                          >
                            <lesson.icon
                              className="w-5 h-5"
                              style={{ color: lesson.color }}
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-foreground group-hover:text-primary-light transition-colors">
                              {lesson.title}
                            </h3>
                          </div>
                        </div>

                        <p className="text-sm text-muted mb-4 leading-relaxed">
                          {lesson.description}
                        </p>

                        <div
                          className={`flex items-center gap-3 text-xs text-muted ${
                            isEven ? "md:justify-end" : ""
                          }`}
                        >
                          <span className="px-2 py-0.5 rounded-full bg-surface-light">
                            {lesson.duration}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-surface-light">
                            {lesson.difficulty}
                          </span>
                          {completed ? (
                            <span className="text-green-400 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Done
                            </span>
                          ) : (
                            <span
                              className="flex items-center gap-1 font-medium transition-transform group-hover:translate-x-1"
                              style={{ color: lesson.color }}
                            >
                              Start <ArrowRight className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}

            {/* Completion trophy */}
            <div className="roadmap-trophy opacity-0 scale-0 relative flex justify-center">
              <div className="absolute left-8 md:left-1/2 -translate-x-1/2">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    progress === 100
                      ? "bg-gradient-to-br from-primary to-accent border-accent shadow-[0_0_25px_rgba(6,182,212,0.5)]"
                      : "bg-surface border-primary/20"
                  }`}
                >
                  <Trophy
                    className={`w-5 h-5 ${
                      progress === 100 ? "text-white" : "text-muted"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
