"use client";

import { useRef } from "react";
import { lessons } from "@/lib/lessons";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function LearningPathSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Header ScrollTrigger
    gsap.fromTo(
      ".path-header",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 75%" } }
    );

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".path-grid-container",
            start: "top 70%",
            end: "bottom 30%",
            scrub: 1.5,
        }
    });

    const nodes = document.querySelectorAll('.modern-path-node');
    nodes.forEach((node, i) => {
        tl.fromTo(node, 
            { opacity: 0.2, scale: 0.8, y: 50 },
            { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power2.out" },
            i * 0.2 // Timeline stagger
        );
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="roadmap" className="section-padding relative overflow-hidden bg-[#030014]">
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: "linear-gradient(#1e1e38 1px, transparent 1px), linear-gradient(90deg, #1e1e38 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="path-header text-center mb-20 opacity-0">
          <span className="text-sm font-mono tracking-widest text-accent uppercase mb-4 block drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
            Master the Machine
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight text-white">
            The Complete <span className="gradient-text drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">Curriculum</span>
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Follow our mathematically structured 5-module pathway. Transition seamlessly from absolute beginner concepts to cutting-edge Generative AI development architectures.
          </p>
        </div>

        {/* Modern Interactive Grid Pathway */}
        <div className="path-grid-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {lessons.slice(0, 8).map((lesson, i) => (
            <div key={lesson.slug} className="modern-path-node opacity-20 transform scale-90 relative group h-full">
              {/* Connector lines (Desktop) */}
              {i % 4 !== 3 && <div className="hidden lg:block absolute top-1/2 -right-6 w-6 h-[2px] bg-white/5 z-0" />}
              {/* Connector lines (Tablet) */}
              {i % 2 !== 1 && <div className="hidden md:block lg:hidden absolute top-1/2 -right-6 w-6 h-[2px] bg-white/5 z-0" />}

              <div className="glass-strong h-full rounded-3xl p-6 border border-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(139,92,246,0.15)] flex flex-col relative overflow-hidden">
                
                {/* Glow blob */}
                <div className="absolute -top-10 -right-10 w-32 h-32 blur-[40px] opacity-20 group-hover:opacity-60 transition-opacity duration-500" style={{ backgroundColor: lesson.color }} />

                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 shadow-lg bg-surface-light/50 backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                    <lesson.icon className="w-6 h-6" style={{ color: lesson.color, filter: `drop-shadow(0 0 8px ${lesson.color}80)` }} />
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-muted uppercase px-2 py-1 rounded-full bg-white/5">
                    Mode {i + 1}
                  </span>
                </div>

                <div className="relative z-10 flex-grow">
                  <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-primary-light transition-colors">{lesson.title}</h3>
                  <p className="text-sm text-muted/80 leading-relaxed mb-6">{lesson.description}</p>
                </div>

                <div className="relative z-10 mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-muted tracking-wider">Difficulty</span>
                      <span className="text-xs font-bold text-white">{lesson.difficulty}</span>
                   </div>
                   <Link href={`/lesson/${lesson.slug}`} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white border border-white/10 hover:bg-white/20 transition-colors group-hover:bg-primary group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                     <ArrowRight className="w-4 h-4" />
                   </Link>
                </div>

              </div>
            </div>
          ))}

        </div>

        {/* Global Action */}
        <div className="mt-20 flex justify-center">
             <Link href="/roadmap" className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-surface-light border border-white/10 rounded-full hover:border-primary/50 hover:bg-white/5">
                <span className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-20 transition-opacity blur-[10px]" />
                <span className="relative flex items-center gap-2 tracking-wide uppercase text-sm">
                   Enter Training Matrix <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
             </Link>
        </div>

      </div>
    </section>
  );
}
