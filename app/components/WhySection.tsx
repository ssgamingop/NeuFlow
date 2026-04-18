"use client";

import { motion } from "framer-motion";
import { Eye, Brain, Microscope, Zap, ArrowRight } from "lucide-react";

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
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#0a0a20] to-background" />

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm text-accent font-medium tracking-widest uppercase mb-4 block">
            Why NeuFlow
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Why This <span className="gradient-text">Platform</span>?
          </h2>
        </motion.div>

        {/* Reasons */}
        <div className="grid sm:grid-cols-2 gap-6">
          {reasons.map((reason, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.03 }}
              className="glass rounded-2xl p-6 flex items-center gap-5 group cursor-pointer transition-all duration-300"
              style={{
                borderColor: `${reason.color}20`,
              }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
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
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <motion.a
            href="#hero"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-primary via-accent to-neon-pink text-white text-lg font-bold shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:shadow-[0_0_50px_rgba(139,92,246,0.6)] transition-shadow duration-300"
          >
            Begin Your AI Journey
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
