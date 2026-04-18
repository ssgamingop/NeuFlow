"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { Brain, TrendingDown, Sparkles, ArrowRight } from "lucide-react";

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
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative group cursor-pointer"
    >
      {/* Glow border on hover */}
      <div
        className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
        style={{
          background: `linear-gradient(135deg, ${card.glowColor}, transparent, ${card.glowColor})`,
        }}
      />

      <div className="relative glass rounded-2xl p-8 h-full overflow-hidden">
        {/* Background gradient */}
        <div
          className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.gradient} opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2`}
        />

        {/* Tag */}
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4"
          style={{
            backgroundColor: `${card.glowColor.replace("0.4", "0.15")}`,
            color: card.glowColor.replace("0.4)", "1)"),
          }}
        >
          {card.tag}
        </span>

        {/* Icon */}
        <div
          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-5 shadow-lg`}
          style={{ transform: "translateZ(30px)" }}
        >
          <card.Icon className="w-6 h-6 text-white" />
        </div>

        {/* Content */}
        <h3
          className="text-xl font-bold mb-3 text-foreground"
          style={{ transform: "translateZ(20px)" }}
        >
          {card.title}
        </h3>
        <p
          className="text-sm text-muted leading-relaxed"
          style={{ transform: "translateZ(10px)" }}
        >
          {card.description}
        </p>

        {/* CTA arrow */}
        <motion.div
          className="mt-6 flex items-center gap-2 text-sm font-medium"
          style={{
            color: card.glowColor.replace("0.4)", "1)"),
            transform: "translateZ(15px)",
          }}
        >
          Try it now
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function InteractiveCardsSection() {
  return (
    <section id="simulators" className="section-padding relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[200px]" />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
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
        </motion.div>

        {/* Cards Grid */}
        <div
          className="grid md:grid-cols-3 gap-6"
          style={{ perspective: "1200px" }}
        >
          {cards.map((card, i) => (
            <TiltCard key={card.title} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
