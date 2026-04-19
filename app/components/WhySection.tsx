"use client";

import { useRef } from "react";
import { Eye, Brain, Microscope, Zap, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const reasons = [
  {
    text: "Stop memorizing — start visualizing",
    Icon: Eye,
    color: "#8b5cf6",
  },
  {
    text: "Understand models, not just use them",
    Icon: Brain,
    color: "#06b6d4",
  },
  {
    text: "See every layer, every token, every step",
    Icon: Microscope,
    color: "#f472b6",
  },
  {
    text: "Learn at your own pace with interactive tools",
    Icon: Zap,
    color: "#22d3ee",
  },
];

export default function WhySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { contextSafe } = useGSAP();

  useGSAP(() => {
    // Header ScrollTrigger
    gsap.fromTo(".why-header", 
        { opacity: 0, y: 40 },
        {
            opacity: 1, 
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 75%"
            }
        }
    );

    // Staggered Cards ScrollTrigger
    gsap.fromTo(".why-card", 
        { opacity: 0, scale: 0.9, y: 30 },
        {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: "back.out(1.2)",
            scrollTrigger: {
                trigger: ".why-card",
                start: "top 85%"
            }
        }
    );

    // CTA ScrollTrigger
    gsap.fromTo(".why-cta",
        { opacity: 0, y: 30 },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.3,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".why-cta",
                start: "top 95%"
            }
        }
    );

  }, { scope: sectionRef });

  const handleHover = contextSafe((e: React.MouseEvent<HTMLDivElement>, isEnter: boolean) => {
     gsap.to(e.currentTarget, {
         scale: isEnter ? 1.03 : 1,
         duration: 0.4,
         ease: "power2.out"
     });
     
     const iconDiv = e.currentTarget.querySelector('.why-icon-container');
     if (iconDiv) {
         gsap.to(iconDiv, {
             scale: isEnter ? 1.15 : 1,
             rotation: isEnter ? 5 : 0,
             duration: 0.4,
             ease: "back.out(1.5)"
         });
     }
  });

  return (
    <section ref={sectionRef} className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#0a0a20] to-background" />

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div className="why-header text-center mb-16 opacity-0">
          <span className="text-sm text-accent font-medium tracking-widest uppercase mb-4 block">
            Why NeuFlow
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Why This <span className="gradient-text">Platform</span>?
          </h2>
        </div>

        {/* Reasons */}
        <div className="grid sm:grid-cols-2 gap-6">
          {reasons.map((reason, i) => (
            <div
              key={i}
              onMouseEnter={(e) => handleHover(e, true)}
              onMouseLeave={(e) => handleHover(e, false)}
              className="why-card opacity-0 glass rounded-2xl p-6 flex items-center gap-5 cursor-pointer"
              style={{
                borderColor: `${reason.color}20`,
              }}
            >
              <div
                className="why-icon-container w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${reason.color}15` }}
              >
                <reason.Icon
                  className="w-6 h-6"
                  style={{ color: reason.color }}
                />
              </div>
              <p className="text-lg font-semibold text-foreground leading-snug">
                &ldquo;{reason.text}&rdquo;
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="why-cta text-center mt-16 opacity-0">
          <Link
            href="/roadmap"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-primary via-accent to-neon-pink text-white text-lg font-bold shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:shadow-[0_0_50px_rgba(139,92,246,0.6)] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Begin Your AI Journey
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
