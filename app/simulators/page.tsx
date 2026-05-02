"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useState, useRef } from "react";
import {
  ArrowRight,
  Brain,
  Eye,
  Gauge,
  Layers3,
  MousePointer2,
  Sparkles,
  TrendingDown,
} from "lucide-react";
import dynamic from "next/dynamic";

const GradientDescentSimulator = dynamic(
  () => import("../components/simulators/GradientDescentSimulator"),
  { ssr: false }
);
const NeuralNetworkSimulator = dynamic(
  () => import("../components/simulators/NeuralNetworkSimulator"),
  { ssr: false }
);
const CNNSimulator = dynamic(
  () => import("../components/simulators/CNNSimulator"),
  { ssr: false }
);
const AttentionSimulator = dynamic(
  () => import("../components/simulators/AttentionSimulator"),
  { ssr: false }
);

const tabs = [
  {
    id: "gradient-descent",
    label: "Gradient Descent",
    eyebrow: "Optimization",
    Icon: TrendingDown,
    color: "#22d3ee",
    accent: "from-cyan-400/20 to-cyan-400/5",
    stat: "Loss path",
    description:
      "Tune the learning rate, switch landscapes, and watch an optimizer search for a lower-loss route.",
  },
  {
    id: "neural-network",
    label: "Neural Network",
    eyebrow: "Training Loop",
    Icon: Brain,
    color: "#8b5cf6",
    accent: "from-violet-400/20 to-violet-400/5",
    stat: "Forward + backprop",
    description:
      "Follow activations, loss, and weight updates through a compact 3D network training pass.",
  },
  {
    id: "cnn",
    label: "CNN Vision",
    eyebrow: "Computer Vision",
    Icon: Eye,
    color: "#f472b6",
    accent: "from-pink-400/20 to-pink-400/5",
    stat: "Kernel scanner",
    description:
      "Draw an image, choose a kernel, and see receptive fields become feature maps and pooled signals.",
  },
  {
    id: "attention",
    label: "Attention (LLM)",
    eyebrow: "Transformers",
    Icon: Sparkles,
    color: "#4ade80",
    accent: "from-emerald-400/20 to-emerald-400/5",
    stat: "Token context",
    description:
      "Tokenize text and step through Q, K, V projections, attention scores, softmax, and output vectors.",
  },
];

export default function SimulatorsPage() {
  const [activeTab, setActiveTab] = useState("gradient-descent");
  const pageRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Header
    gsap.fromTo(".sim-header",
       { opacity: 0, y: 30 },
       { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
    // Tabs
    gsap.fromTo(".sim-tab",
       { opacity: 0, y: 20 },
       { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.2, ease: "power2.out" }
    );
  }, { scope: pageRef });

  // Animate simulator switch
  useGSAP(() => {
      gsap.fromTo(".sim-content", 
         { opacity: 0, y: 20 },
         { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
  }, { dependencies: [activeTab], scope: containerRef });

  const renderSimulator = () => {
    switch (activeTab) {
      case "gradient-descent":
        return <GradientDescentSimulator />;
      case "neural-network":
        return <NeuralNetworkSimulator />;
      case "cnn":
        return <CNNSimulator />;
      case "attention":
        return <AttentionSimulator />;
      default:
        return null;
    }
  };

  const activeSimulator = tabs.find((t) => t.id === activeTab) ?? tabs[0];
  const ActiveIcon = activeSimulator.Icon;

  return (
    <>
      <main ref={pageRef} className="min-h-screen pt-24 pb-20 overflow-hidden">
        {/* Background */}
        <div className="fixed inset-0 -z-10 hero-bg" />
        <div className="fixed inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:44px_44px] opacity-40" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Header */}
          <div className="sim-header mb-8 grid gap-6 opacity-0 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent-light">
                <MousePointer2 className="h-3.5 w-3.5" />
                Hands-on lab
              </span>
              <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                Build intuition with focused{" "}
                <span className="gradient-text">AI simulators</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted md:text-lg">
                A cleaner workspace for experiments: choose a concept, tune the
                important parameters, and read the model state without fighting
                the interface.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-surface-light/60 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
              <div className="mb-3 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10"
                  style={{ background: `${activeSimulator.color}18`, color: activeSimulator.color }}
                >
                  <ActiveIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                    Active simulator
                  </p>
                  <h2 className="text-lg font-bold text-white">{activeSimulator.label}</h2>
                </div>
              </div>
              <p className="text-sm leading-6 text-muted">{activeSimulator.description}</p>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
            {/* Simulator picker */}
            <aside className="sim-tab opacity-0">
              <div className="sticky top-24 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-background/45 p-3">
                  <div className="mb-3 flex items-center justify-between px-1">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                      Simulators
                    </p>
                    <span className="rounded-full bg-white/[0.04] px-2 py-1 text-[10px] font-bold text-accent-light">
                      4 labs
                    </span>
                  </div>

                  <div className="space-y-2">
                    {tabs.map((tab) => {
                      const selected = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full rounded-xl border p-3 text-left transition-all duration-300 active:scale-[0.99] ${
                            selected
                              ? "border-white/15 bg-white/[0.06] shadow-[0_16px_45px_rgba(0,0,0,0.22)]"
                              : "border-transparent bg-transparent hover:border-white/10 hover:bg-white/[0.035]"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10"
                              style={{ background: `${tab.color}14`, color: tab.color }}
                            >
                              <tab.Icon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-muted">
                                {tab.eyebrow}
                              </p>
                              <div className="mt-1 flex items-center justify-between gap-2">
                                <h3 className="truncate text-sm font-bold text-white">
                                  {tab.label}
                                </h3>
                                {selected && (
                                  <ArrowRight className="h-4 w-4 shrink-0" style={{ color: tab.color }} />
                                )}
                              </div>
                              <p className="mt-2 text-xs leading-5 text-muted">{tab.stat}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                  <div className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
                    <Gauge className="mb-2 h-4 w-4 text-accent-light" />
                    <p className="text-xs font-semibold text-white">Tune first</p>
                    <p className="mt-1 text-[11px] leading-4 text-muted">
                      Change one control, run, compare the state.
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.035] p-3">
                    <Layers3 className="mb-2 h-4 w-4 text-neon-pink" />
                    <p className="text-xs font-semibold text-white">Read stages</p>
                    <p className="mt-1 text-[11px] leading-4 text-muted">
                      Watch the visual pass before changing tools.
                    </p>
                  </div>
                </div>
              </div>
            </aside>

            <section ref={containerRef} className="min-w-0">
              <div
                className={`sim-content opacity-0 rounded-3xl border border-white/10 bg-gradient-to-br ${activeSimulator.accent} p-3 shadow-[0_24px_100px_rgba(0,0,0,0.28)] sm:p-4`}
              >
                <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-background/55 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl"
                      style={{ background: `${activeSimulator.color}18`, color: activeSimulator.color }}
                    >
                      <ActiveIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted">
                        {activeSimulator.eyebrow}
                      </p>
                      <h2 className="text-xl font-bold text-white">{activeSimulator.label}</h2>
                    </div>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-muted">
                    {activeSimulator.stat}
                  </div>
                </div>

                {renderSimulator()}
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {[
                  "Make simulator controls consistent across every lab.",
                  "Add saved presets so learners can replay useful experiments.",
                  "Add short result summaries after each run for clearer takeaways.",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-muted"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
