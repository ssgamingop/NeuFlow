"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { Play, RotateCcw, Minus, Plus } from "lucide-react";

export default function GradientDescentSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [learningRate, setLearningRate] = useState(0.1);
  const [isRunning, setIsRunning] = useState(false);
  const [position, setPosition] = useState(4.5);
  const [history, setHistory] = useState<number[]>([4.5]);
  const [step, setStep] = useState(0);
  const animRef = useRef<number>(0);

  // Cost function: f(x) = x^2 + 2*sin(2x) — has local minimum
  const costFn = useCallback((x: number) => x * x * 0.5 + 2 * Math.sin(2 * x) + 5, []);
  const gradientFn = useCallback((x: number) => x + 4 * Math.cos(2 * x), []);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Draw cost landscape
    ctx.beginPath();
    const xMin = -5;
    const xMax = 5;
    const yMax = 18;

    for (let px = 0; px < w; px++) {
      const x = xMin + (px / w) * (xMax - xMin);
      const y = costFn(x);
      const canvasY = h - (y / yMax) * h * 0.85 - 20;
      if (px === 0) ctx.moveTo(px, canvasY);
      else ctx.lineTo(px, canvasY);
    }

    // Fill under curve
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    const fillGrad = ctx.createLinearGradient(0, 0, 0, h);
    fillGrad.addColorStop(0, "rgba(139,92,246,0.15)");
    fillGrad.addColorStop(1, "rgba(139,92,246,0.02)");
    ctx.fillStyle = fillGrad;
    ctx.fill();

    // Redraw curve line
    ctx.beginPath();
    for (let px = 0; px < w; px++) {
      const x = xMin + (px / w) * (xMax - xMin);
      const y = costFn(x);
      const canvasY = h - (y / yMax) * h * 0.85 - 20;
      if (px === 0) ctx.moveTo(px, canvasY);
      else ctx.lineTo(px, canvasY);
    }
    const lineGrad = ctx.createLinearGradient(0, 0, w, 0);
    lineGrad.addColorStop(0, "#8b5cf6");
    lineGrad.addColorStop(0.5, "#06b6d4");
    lineGrad.addColorStop(1, "#f472b6");
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Draw path
    if (history.length > 1) {
      ctx.beginPath();
      history.forEach((hx, i) => {
        const px = ((hx - xMin) / (xMax - xMin)) * w;
        const py = h - (costFn(hx) / yMax) * h * 0.85 - 20;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.strokeStyle = "rgba(34,211,238,0.5)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw all history dots
    history.forEach((hx, i) => {
      const px = ((hx - xMin) / (xMax - xMin)) * w;
      const py = h - (costFn(hx) / yMax) * h * 0.85 - 20;
      ctx.beginPath();
      ctx.arc(px, py, i === history.length - 1 ? 7 : 3, 0, Math.PI * 2);
      ctx.fillStyle =
        i === history.length - 1
          ? "#22d3ee"
          : "rgba(139,92,246,0.5)";
      ctx.fill();
      if (i === history.length - 1) {
        ctx.beginPath();
        ctx.arc(px, py, 14, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(34,211,238,0.15)";
        ctx.fill();
      }
    });

    // Axis labels
    ctx.fillStyle = "rgba(148,163,184,0.6)";
    ctx.font = "11px 'Space Grotesk', sans-serif";
    ctx.fillText("Parameter Value →", w - 120, h - 5);
    ctx.save();
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Cost →", -h / 2, 14);
    ctx.restore();
  }, [costFn, history]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = 300;
      }
      drawCanvas();
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [drawCanvas]);

  useEffect(() => {
    drawCanvas();
  }, [history, drawCanvas]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setPosition((prev) => {
        const grad = gradientFn(prev);
        const next = prev - learningRate * grad;
        const clamped = Math.max(-5, Math.min(5, next));

        setHistory((h) => [...h, clamped]);
        setStep((s) => s + 1);

        // Stop conditions
        if (Math.abs(grad) < 0.001 || step > 80) {
          setIsRunning(false);
        }

        return clamped;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isRunning, learningRate, gradientFn, step]);

  const reset = () => {
    setIsRunning(false);
    setPosition(4.5);
    setHistory([4.5]);
    setStep(0);
  };

  return (
    <div className="space-y-6">
      {/* Canvas */}
      <div className="glass rounded-2xl p-4 overflow-hidden">
        <canvas ref={canvasRef} className="w-full rounded-lg" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-xl p-3 text-center">
          <p className="text-xs text-muted mb-1">Position</p>
          <p className="text-lg font-mono font-bold text-primary-light">
            {position.toFixed(3)}
          </p>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <p className="text-xs text-muted mb-1">Cost</p>
          <p className="text-lg font-mono font-bold text-accent-light">
            {costFn(position).toFixed(3)}
          </p>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <p className="text-xs text-muted mb-1">Steps</p>
          <p className="text-lg font-mono font-bold text-neon-pink">{step}</p>
        </div>
      </div>

      {/* Learning rate control */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted">Learning Rate</span>
          <span className="text-sm font-mono text-primary-light font-bold">
            {learningRate.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLearningRate((lr) => Math.max(0.01, lr - 0.02))}
            className="p-1.5 rounded-lg bg-surface-light hover:bg-primary/15 transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <input
            type="range"
            min="0.01"
            max="0.5"
            step="0.01"
            value={learningRate}
            onChange={(e) => setLearningRate(parseFloat(e.target.value))}
            className="flex-1 accent-primary"
          />
          <button
            onClick={() => setLearningRate((lr) => Math.min(0.5, lr + 0.02))}
            className="p-1.5 rounded-lg bg-surface-light hover:bg-primary/15 transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsRunning(!isRunning)}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-shadow"
        >
          <Play className="w-4 h-4" />
          {isRunning ? "Pause" : "Run Descent"}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={reset}
          className="px-5 py-3 rounded-full bg-surface-light text-muted font-semibold hover:bg-primary/10 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}
