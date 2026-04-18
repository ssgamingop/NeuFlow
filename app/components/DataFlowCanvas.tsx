"use client";

import { useEffect, useRef } from "react";

/**
 * Full-screen canvas overlay that draws flowing "data stream" curves
 * with traveling particles — creates the "inside an AI system" feel.
 */
export default function DataFlowCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create flowing curves
    const curves = Array.from({ length: 6 }, (_, i) => ({
      startX: -50,
      startY: h * (0.15 + i * 0.12),
      cp1x: w * 0.25,
      cp1y: h * (0.1 + Math.random() * 0.3),
      cp2x: w * 0.75,
      cp2y: h * (0.2 + Math.random() * 0.4),
      endX: w + 50,
      endY: h * (0.2 + i * 0.1),
      color: i % 3 === 0 ? "139,92,246" : i % 3 === 1 ? "6,182,212" : "244,114,182",
      speed: 0.0003 + Math.random() * 0.0002,
      particleCount: 4 + Math.floor(Math.random() * 3),
    }));

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);

      curves.forEach((curve) => {
        // Draw the path (very subtle)
        ctx.beginPath();
        ctx.moveTo(curve.startX, curve.startY);
        ctx.bezierCurveTo(
          curve.cp1x,
          curve.cp1y + Math.sin(time * 0.0005) * 20,
          curve.cp2x,
          curve.cp2y + Math.cos(time * 0.0004) * 20,
          curve.endX,
          curve.endY
        );
        ctx.strokeStyle = `rgba(${curve.color}, 0.03)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw traveling particles along the curve
        for (let p = 0; p < curve.particleCount; p++) {
          const t = ((time * curve.speed + p / curve.particleCount) % 1);
          const invT = 1 - t;

          // Cubic bezier point
          const x =
            invT * invT * invT * curve.startX +
            3 * invT * invT * t * curve.cp1x +
            3 * invT * t * t * curve.cp2x +
            t * t * t * curve.endX;
          const y =
            invT * invT * invT * curve.startY +
            3 * invT * invT * t * (curve.cp1y + Math.sin(time * 0.0005) * 20) +
            3 * invT * t * t * (curve.cp2y + Math.cos(time * 0.0004) * 20) +
            t * t * t * curve.endY;

          const fade = Math.sin(t * Math.PI);
          const radius = 1.5 + fade * 1.5;

          // Glow
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 4);
          gradient.addColorStop(0, `rgba(${curve.color}, ${fade * 0.4})`);
          gradient.addColorStop(1, `rgba(${curve.color}, 0)`);
          ctx.beginPath();
          ctx.arc(x, y, radius * 4, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          // Core
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${curve.color}, ${fade * 0.8})`;
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[1] pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}
