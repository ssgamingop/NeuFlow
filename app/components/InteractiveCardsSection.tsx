"use client";

import { useRef } from "react";
import { Brain, TrendingDown, Sparkles, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const cards = [
  {
    title: "Neural Network Simulator",
    description: "Adjust neurons, layers, and watch forward propagation in real-time. See how weights shape predictions.",
    Icon: Brain,
    gradient: "from-[#8b5cf6] to-[#6d28d9]",
    glowColor: "rgba(139,92,246,0.4)",
    tag: "Interactive",
  },
  {
    title: "Gradient Descent Visualizer",
    description: "Control the learning rate and watch how models converge — or diverge — towards the optimal solution.",
    Icon: TrendingDown,
    gradient: "from-[#06b6d4] to-[#0891b2]",
    glowColor: "rgba(6,182,212,0.4)",
    tag: "Simulator",
  },
  {
    title: "LLM Playground",
    description: "Type a prompt and watch tokens flow through transformer layers with animated attention heads.",
    Icon: Sparkles,
    gradient: "from-[#f472b6] to-[#db2777]",
    glowColor: "rgba(244,114,182,0.4)",
    tag: "Flagship",
  },
];

function TiltCard({
  card,
  index,
}: {
  card: (typeof cards)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP();

  const handleMouseMove = contextSafe((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !contentRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    // Advanced 3D tilt with GSAP
    gsap.to(contentRef.current, {
      rotationY: px * 16, // Rotate up to 8 degrees
      rotationX: -py * 16,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 1200,
      transformOrigin: "center center"
    });
  });

  const handleMouseLeave = contextSafe(() => {
    if (!contentRef.current) return;
    gsap.to(contentRef.current, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.4)"
    });
  });

  const hoverArrow = contextSafe((enter: boolean) => {
    if (!arrowRef.current) return;
    gsap.to(arrowRef.current, {
        x: enter ? 4 : 0,
        duration: 0.3,
        ease: "power2.out"
    });
  });

  return (
    <Link href="/simulators">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { handleMouseLeave(); hoverArrow(false); }}
        onMouseEnter={() => hoverArrow(true)}
        className="simulator-card opacity-0 translate-y-10 relative group cursor-pointer h-full"
        style={{ perspective: "1200px" }}
      >
        {/* Glow border on hover */}
        <div
          className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${card.glowColor}, transparent, ${card.glowColor})`,
          }}
        />

        <div ref={contentRef} className="relative glass rounded-2xl p-8 h-full overflow-hidden transform-style-3d">
          {/* Background gradient */}
          <div
            className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.gradient} opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none`}
          />

          {/* Tag */}
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4"
            style={{
              backgroundColor: `${card.glowColor.replace("0.4", "0.15")}`,
              color: card.glowColor.replace("0.4)", "1)"),
              transform: "translateZ(30px)"
            }}
          >
            {card.tag}
          </span>

          {/* Icon */}
          <div
            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-5 shadow-lg relative`}
            style={{ transform: "translateZ(40px)" }}
          >
            <card.Icon className="w-6 h-6 text-white" />
          </div>

          {/* Content */}
          <h3
            className="text-xl font-bold mb-3 text-foreground"
            style={{ transform: "translateZ(30px)" }}
          >
            {card.title}
          </h3>
          <p
            className="text-sm text-muted leading-relaxed"
            style={{ transform: "translateZ(20px)" }}
          >
            {card.description}
          </p>

          {/* CTA arrow */}
          <div
            className="mt-6 flex items-center gap-2 text-sm font-medium"
            style={{
              color: card.glowColor.replace("0.4)", "1)"),
              transform: "translateZ(40px)",
            }}
          >
            Try it now
            <ArrowRight ref={arrowRef} className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function InteractiveCardsSection() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
     // ScrollTrigger for the section header
     gsap.fromTo(".simulator-header", 
        { opacity: 0, y: 30 },
        {
            opacity: 1, 
            y: 0, 
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%", // triggers when top of section hits 80% down viewport
            }
        }
     );

     // ScrollTrigger stagger for the cards
     gsap.to(".simulator-card", {
         opacity: 1,
         y: 0,
         duration: 0.8,
         stagger: 0.15,
         ease: "power3.out",
         scrollTrigger: {
             trigger: ".simulator-card", // trigger on the first card
             start: "top 85%",
         }
     });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="simulators" className="section-padding relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[200px]" />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="simulator-header text-center mb-16 opacity-0 translate-y-10">
          <span className="text-sm text-neon-purple font-medium tracking-widest uppercase mb-4 block">
            Hands-On Tools
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Interactive <span className="gradient-text">Simulators</span>
          </h2>
          <p className="text-muted max-w-xl mx-auto text-lg">
            Don&apos;t just read about AI — interact with it. Tweak parameters and
            see results instantly.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <TiltCard key={card.title} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
