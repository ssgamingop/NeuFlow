"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import { Play, RotateCcw, Layers } from "lucide-react";

const demoTokens = ["Hello", " ", "AI", ",", " how", " do", " you", " think", "?"];
const demoOutput = "I process your words through layers of neural networks, transforming tokens into meaning through attention mechanisms...";

export default function LiveDemoSection() {
  const [stage, setStage] = useState<"idle" | "tokenizing" | "processing" | "output">("idle");
  const [visibleTokens, setVisibleTokens] = useState<number>(0);
  const [outputText, setOutputText] = useState("");
  const [hasPlayed, setHasPlayed] = useState(false);

  const runDemo = useCallback(() => {
    if (hasPlayed) {
      setStage("idle");
      setVisibleTokens(0);
      setOutputText("");
      setHasPlayed(false);
      return;
    }

    setStage("tokenizing");
    setVisibleTokens(0);

    let tokenIdx = 0;
    const tokenInterval = setInterval(() => {
      tokenIdx++;
      setVisibleTokens(tokenIdx);
      if (tokenIdx >= demoTokens.length) {
        clearInterval(tokenInterval);
        setTimeout(() => {
          setStage("processing");
          setTimeout(() => {
            setStage("output");
            let charIdx = 0;
            const typeInterval = setInterval(() => {
              charIdx++;
              setOutputText(demoOutput.slice(0, charIdx));
              if (charIdx >= demoOutput.length) {
                clearInterval(typeInterval);
                setHasPlayed(true);
              }
            }, 20);
          }, 1500);
        }, 800);
      }
    }, 150);
  }, [hasPlayed]);

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-[#080820] to-background" />

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-sm text-neon-cyan font-medium tracking-widest uppercase mb-4 block">
            Try It Now
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Watch AI <span className="gradient-text">Process</span> in
            Real-Time
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            Click the button below and see a live simulation of how a language
            model transforms your input into output.
          </p>
        </motion.div>

        {/* Demo Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-strong rounded-3xl p-8 md:p-10"
        >
          {/* Input display */}
          <div className="mb-6">
            <p className="text-xs text-muted mb-2 uppercase tracking-wider">
              Input Prompt
            </p>
            <div className="glass rounded-xl p-4 font-mono text-lg text-foreground">
              Hello AI, how do you think?
              <span className="animate-pulse text-primary">|</span>
            </div>
          </div>

          {/* Tokenization */}
          <AnimatePresence>
            {(stage === "tokenizing" || stage === "processing" || stage === "output") && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-6"
              >
                <p className="text-xs text-muted mb-2 uppercase tracking-wider">
                  Tokenization
                </p>
                <div className="flex flex-wrap gap-2">
                  {demoTokens.map((token, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={
                        i < visibleTokens
                          ? { opacity: 1, scale: 1 }
                          : { opacity: 0, scale: 0 }
                      }
                      transition={{ duration: 0.2 }}
                      className="px-3 py-1.5 rounded-lg bg-primary/15 border border-primary/25 text-sm font-mono text-primary-light"
                    >
                      {token === " " ? "⎵" : token}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Processing indicator */}
          <AnimatePresence>
            {stage === "processing" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-6"
              >
                <p className="text-xs text-muted mb-3 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-3 h-3" />
                  Processing Through Transformer Layers
                </p>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5].map((layer) => (
                    <motion.div
                      key={layer}
                      animate={{
                        backgroundColor: [
                          "rgba(139,92,246,0.1)",
                          "rgba(139,92,246,0.4)",
                          "rgba(6,182,212,0.4)",
                          "rgba(6,182,212,0.1)",
                        ],
                        scale: [1, 1.08, 1.08, 1],
                      }}
                      transition={{
                        duration: 1.2,
                        delay: layer * 0.15,
                        repeat: Infinity,
                      }}
                      className="flex-1 h-10 rounded-lg border border-primary/20 flex items-center justify-center"
                    >
                      <span className="text-xs text-muted">L{layer}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Output */}
          <AnimatePresence>
            {stage === "output" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-6"
              >
                <p className="text-xs text-muted mb-2 uppercase tracking-wider">
                  Generated Output
                </p>
                <div className="glass rounded-xl p-4 text-accent-light font-mono text-sm leading-relaxed min-h-[60px]">
                  {outputText}
                  {outputText.length < demoOutput.length && (
                    <span className="animate-pulse">▊</span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Button */}
          <div className="text-center mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={runDemo}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-[0_0_25px_rgba(139,92,246,0.4)] hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] transition-shadow duration-300"
            >
              {hasPlayed ? (
                <>
                  <RotateCcw className="w-4 h-4" /> Reset & Run Again
                </>
              ) : stage === "idle" ? (
                <>
                  <Play className="w-4 h-4" /> Run Demo
                </>
              ) : (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Layers className="w-4 h-4" />
                  </motion.div>
                  Processing...
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
