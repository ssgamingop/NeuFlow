"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { getLessonBySlug, getNextLesson } from "@/lib/lessons";
import { useProgressStore } from "@/lib/store";
import Navbar from "@/app/components/Navbar";
import { ChevronRight, ChevronLeft, CheckCircle, XCircle, ArrowRight, BookOpen, Award } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const ScatterPlot3D = dynamic(() => import("@/app/components/visualizers/ScatterPlot3D"), { ssr: false });
const SingleNeuron3D = dynamic(() => import("@/app/components/visualizers/SingleNeuron3D"), { ssr: false });
const GradientSurface3D = dynamic(() => import("@/app/components/visualizers/GradientSurface3D"), { ssr: false });
const WordEmbeddings3D = dynamic(() => import("@/app/components/visualizers/WordEmbeddings3D"), { ssr: false });

function VisualizerRenderer({ section, showQuiz }: { section: any, showQuiz: boolean }) {
  if (showQuiz) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.15)_0%,_transparent_100%)]">
        <Award className="w-20 h-20 text-accent/50 mb-6 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
        <h3 className="text-2xl font-bold text-foreground mb-2">Knowledge Check!</h3>
        <p className="text-muted text-center max-w-sm">
          Test your neural pathways. Answer all questions correctly to conquer this lesson.
        </p>
      </div>
    );
  }

  if (section.visualType === "3d") {
    switch (section.visualComponent) {
      case "ScatterPlot3D": return <ScatterPlot3D />;
      case "SingleNeuron3D": return <SingleNeuron3D />;
      case "GradientSurface3D": return <GradientSurface3D />;
      case "WordEmbeddings3D": return <WordEmbeddings3D />;
      default: return <div className="w-full h-full flex items-center justify-center">3D component not found</div>;
    }
  }

  if (section.visualType === "image" && section.visualUrl) {
    return (
      <img src={section.visualUrl} alt={section.title} className="w-full h-full object-cover opacity-80 mix-blend-screen" />
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-8 bg-surface-light border border-primary/10">
      <p className="text-muted font-mono text-sm opacity-50">Initializing Visualizer Matrix...</p>
    </div>
  );
}

export default function LessonClient({ slug }: { slug: string }) {
  const lesson = getLessonBySlug(slug);
  const nextLesson = getNextLesson(slug);
  const { completeLesson, isCompleted } = useProgressStore();
  const [currentSection, setCurrentSection] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // GSAP Premium Entrance Animation
  useGSAP(() => {
     if (mounted) {
         gsap.fromTo(".lesson-stagger", 
             { opacity: 0, y: 20 },
             { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }
         );
     }
  }, [mounted, currentSection, showQuiz]); // re-run specific staggers when changing tabs to give a pulse

  if (!lesson) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-32 text-center">
          <h1 className="text-3xl font-bold">Lesson not found</h1>
          <Link href="/roadmap" className="text-primary mt-4 inline-block">Back to Roadmap</Link>
        </main>
      </>
    );
  }

  const completed = mounted && isCompleted(slug);
  const totalSections = lesson.sections.length;
  const isLastSection = currentSection === totalSections - 1;
  const activeSection = lesson.sections[currentSection];

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
    const allCorrect = lesson.quiz.every((q, i) => quizAnswers[i] === q.correctIndex);
    if (allCorrect) completeLesson(slug);
  };

  const allCorrect = quizSubmitted && lesson.quiz.every((q, i) => quizAnswers[i] === q.correctIndex);
  const allAnswered = quizAnswers.every((a) => a !== null);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 relative">
        {/* Deep 3D Ambient Background */}
        <div className="fixed inset-0 -z-10 bg-[#030014]" />
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_rgba(139,92,246,0.15)_0%,_transparent_50%)]" />
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(6,182,212,0.1)_0%,_transparent_50%)]" />
        {/* Subtle grid pattern */}
        <div className="fixed inset-0 -z-10 opacity-20" style={{ backgroundImage: "linear-gradient(#1e1e38 1px, transparent 1px), linear-gradient(90deg, #1e1e38 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div ref={containerRef} className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="lesson-stagger opacity-0 flex items-center gap-2 text-sm text-muted mb-8 font-mono">
             <Link href="/roadmap" className="hover:text-primary-light transition-colors">Roadmap</Link>
             <ChevronRight className="w-3 h-3" />
             <span className="text-foreground/80">{lesson.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* LEFT COLUMN */}
            <div className="flex flex-col">
              <div className="lesson-stagger opacity-0 mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center border border-white/5 shadow-lg" style={{ backgroundColor: `${lesson.color}20` }}>
                     <lesson.icon className="w-7 h-7" style={{ color: lesson.color }} />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight">{lesson.title}</h1>
                    <div className="flex items-center gap-3 text-sm text-muted mt-2 font-mono">
                      <span>{lesson.duration}</span><span>•</span><span>{lesson.difficulty}</span>
                      {completed && (
                        <><span className="text-green-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Mastered</span></>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="flex items-center gap-2 mt-8">
                  {lesson.sections.map((_, i) => (
                    <button key={i} onClick={() => { setShowQuiz(false); setCurrentSection(i); }} 
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        i === currentSection && !showQuiz ? "w-10 bg-gradient-to-r from-primary to-accent shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                        : i < currentSection || showQuiz ? "w-4 bg-primary/40" : "w-4 bg-surface-light"
                      }`}
                    />
                  ))}
                  <button onClick={() => { if (currentSection === totalSections - 1) setShowQuiz(true); }}
                    className={`h-1.5 rounded-full transition-all duration-500 ${showQuiz ? "w-10 bg-accent shadow-[0_0_10px_rgba(6,182,212,0.5)]" : "w-4 bg-surface-light"}`}
                  />
                </div>
              </div>

              {/* Mobile Visualizer */}
              <div className="w-full h-[300px] lg:hidden mb-8 rounded-2xl overflow-hidden glass relative border border-primary/20">
                 <AnimatePresence mode="wait">
                    <motion.div key={showQuiz ? "quiz" : currentSection} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0">
                       <VisualizerRenderer section={activeSection} showQuiz={showQuiz} />
                    </motion.div>
                 </AnimatePresence>
              </div>

              {/* Content area */}
              <AnimatePresence mode="wait">
                {!showQuiz ? (
                  <motion.div key={`section-${currentSection}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="glass-strong rounded-3xl p-8 mb-8 flex-grow border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] pointer-events-none" />
                    
                    <div className="flex items-center gap-2 mb-6">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span className="text-xs text-primary-light font-bold uppercase tracking-widest">Section {currentSection + 1} of {totalSections}</span>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-6 text-white">{activeSection.title}</h2>
                    <div className="prose-custom text-muted leading-relaxed whitespace-pre-line text-[16px] md:text-[17px]">
                      {activeSection.content.split("\n\n").map((paragraph, pi) => (
                          <p key={pi} className="mb-5 last:mb-0">
                            {paragraph.split("**").map((part, i) =>
                              i % 2 === 1 ? <strong key={i} className="text-foreground font-semibold px-1 bg-primary/10 rounded">{part}</strong> : <span key={i}>{part}</span>
                            )}
                          </p>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="quiz" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }} className="glass-strong rounded-3xl p-8 mb-8 flex-grow border border-accent/20">
                     <div className="flex items-center gap-2 mb-8">
                       <Award className="w-5 h-5 text-accent" />
                       <span className="text-xs text-accent-light font-bold uppercase tracking-widest">Final Challenge</span>
                     </div>

                     <div className="space-y-8">
                        {lesson.quiz.map((q, qi) => (
                           <div key={qi}>
                              <p className="text-lg font-semibold text-white mb-4">{qi + 1}. {q.question}</p>
                              <div className="space-y-3">
                                 {q.options.map((option, oi) => {
                                    const selected = quizAnswers[qi] === oi;
                                    const correct = q.correctIndex === oi;
                                    let cls = "border-surface-border bg-surface-light/50";

                                    if (quizSubmitted) {
                                       if (correct) cls = "border-green-500/50 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.1)]";
                                       else if (selected) cls = "border-red-500/50 bg-red-500/10";
                                    } else if (selected) {
                                       cls = "border-primary/50 bg-primary/10 shadow-[0_0_15px_rgba(139,92,246,0.2)]";
                                    }

                                    return (
                                       <button key={oi} onClick={() => handleQuizAnswer(qi, oi)} className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-300 ${cls} ${!quizSubmitted ? "hover:border-primary/40 hover:bg-primary/5 active:scale-[0.99]" : ""}`}>
                                          <div className="flex items-center gap-3">
                                             <span className={`text-sm font-mono font-bold ${selected && !quizSubmitted ? 'text-primary' : 'text-muted'}`}>{String.fromCharCode(65 + oi)}.</span>
                                             <span className={`text-sm ${selected ? 'text-white font-medium' : 'text-muted'}`}>{option}</span>
                                             {quizSubmitted && correct && <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />}
                                             {quizSubmitted && selected && !correct && <XCircle className="w-5 h-5 text-red-400 ml-auto" />}
                                          </div>
                                       </button>
                                    );
                                 })}
                              </div>
                           </div>
                        ))}
                     </div>

                     <div className="mt-10">
                        {!quizSubmitted ? (
                           <button onClick={handleSubmitQuiz} disabled={!allAnswered} className={`w-full py-4 rounded-full font-bold text-sm uppercase tracking-wide transition-all duration-300 ${allAnswered ? "bg-gradient-to-r from-primary to-accent text-white shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] hover:-translate-y-0.5" : "bg-surface text-muted cursor-not-allowed"}`}>
                              Submit Answers
                           </button>
                        ) : allCorrect ? (
                           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center sm:text-left">
                              <div className="inline-flex items-center gap-2 w-full justify-center py-4 rounded-full bg-green-500/15 text-green-400 font-bold tracking-wide mb-4 border border-green-500/30">
                                 <CheckCircle className="w-5 h-5" /> Pathway Mastered!
                              </div>
                              {nextLesson && (
                                 <Link href={`/lesson/${nextLesson.slug}`} className="inline-flex items-center gap-2 w-full justify-center py-4 rounded-full bg-gradient-to-r from-primary to-accent text-white font-bold tracking-wide hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all">
                                    Next Protocol: {nextLesson.title} <ArrowRight className="w-4 h-4" />
                                 </Link>
                              )}
                           </motion.div>
                        ) : (
                           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                              <div className="inline-flex flex-col items-center gap-2 w-full justify-center p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 mb-4">
                                 <XCircle className="w-8 h-8 mb-2" />
                                 <span className="font-bold">Neural Mismatch Detected</span>
                                 <span className="text-sm opacity-80">Review the architecture and recalibrate your answers.</span>
                              </div>
                              <button onClick={() => { setQuizSubmitted(false); setQuizAnswers(new Array(lesson.quiz.length).fill(null)); }} className="text-primary hover:text-primary-light font-semibold transition-colors underline underline-offset-4">
                                 Retry Calibration
                              </button>
                           </motion.div>
                        )}
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation buttons */}
              <div className="lesson-stagger opacity-0 flex items-center justify-between mt-auto">
                <button onClick={handlePrev} disabled={currentSection === 0 && !showQuiz} className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${currentSection === 0 && !showQuiz ? "opacity-30 cursor-not-allowed text-muted" : "hover:bg-surface-light text-foreground"}`}>
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                {!showQuiz && (
                  <button onClick={handleNext} className="flex items-center gap-2 px-6 py-3 rounded-full bg-surface-light hover:bg-primary/20 text-foreground font-medium transition-all border border-transparent hover:border-primary/30">
                    {isLastSection ? "Take Check" : "Next"} <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: 3D VISUALIZER */}
            <div className="hidden lg:block h-[calc(100vh-140px)] sticky top-24">
              <div className="w-full h-full rounded-3xl overflow-hidden relative glass-strong shadow-2xl border border-primary/20">
                 {/* Visualizer header decoration */}
                 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent z-10" />
                 <div className="absolute top-4 left-4 z-10">
                    <span className="bg-background/60 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-mono text-muted border border-white/10 flex items-center gap-2 uppercase tracking-widest">
                       <span className={`w-2 h-2 rounded-full ${showQuiz ? 'bg-accent' : 'bg-primary'} animate-pulse`} />
                       {showQuiz ? "Evaluation Mode" : "Real-time Node"}
                    </span>
                 </div>
                 
                 <AnimatePresence mode="wait">
                    <motion.div key={showQuiz ? "quiz-visualizer" : `visualizer-${currentSection}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.6, ease: "easeInOut" }} className="absolute inset-0">
                       <VisualizerRenderer section={activeSection} showQuiz={showQuiz} />
                    </motion.div>
                 </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}
