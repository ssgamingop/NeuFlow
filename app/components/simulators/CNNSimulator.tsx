"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Play, RotateCcw, Pause, SkipForward, Paintbrush, Eraser } from "lucide-react";
import gsap from "gsap";

/* ─── Convolution Filter Kernels ─── */
const KERNELS: Record<string, { name: string; matrix: number[][]; color: string; description: string }> = {
  edge: {
    name: "Edge Detect",
    matrix: [[-1,-1,-1],[-1,8,-1],[-1,-1,-1]],
    color: "#22d3ee",
    description: "Highlights boundaries by amplifying rapid intensity changes across neighboring pixels.",
  },
  sharpen: {
    name: "Sharpen",
    matrix: [[0,-1,0],[-1,5,-1],[0,-1,0]],
    color: "#8b5cf6",
    description: "Enhances detail by boosting the central pixel relative to its neighbors.",
  },
  blur: {
    name: "Gaussian Blur",
    matrix: [[1,2,1],[2,4,2],[1,2,1]],
    color: "#f472b6",
    description: "Smooths noise by averaging each pixel with a weighted neighborhood.",
  },
  emboss: {
    name: "Emboss",
    matrix: [[-2,-1,0],[-1,1,1],[0,1,2]],
    color: "#4ade80",
    description: "Creates a 3D relief effect by computing directional intensity gradients.",
  },
};

const GRID_SIZE = 8;
const KERNEL_SIZE = 3;
const OUTPUT_SIZE = GRID_SIZE - KERNEL_SIZE + 1; // 6

/* ─── Preset Digit Patterns (8×8) ─── */
const PRESETS: Record<string, number[][]> = {
  zero: [
    [0,0,1,1,1,1,0,0],
    [0,1,1,0,0,1,1,0],
    [1,1,0,0,0,0,1,1],
    [1,1,0,0,0,0,1,1],
    [1,1,0,0,0,0,1,1],
    [1,1,0,0,0,0,1,1],
    [0,1,1,0,0,1,1,0],
    [0,0,1,1,1,1,0,0],
  ],
  one: [
    [0,0,0,1,1,0,0,0],
    [0,0,1,1,1,0,0,0],
    [0,1,0,1,1,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,1,1,1,1,1,1,0],
  ],
  cross: [
    [1,0,0,0,0,0,0,1],
    [0,1,0,0,0,0,1,0],
    [0,0,1,0,0,1,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,0,1,1,0,0,0],
    [0,0,1,0,0,1,0,0],
    [0,1,0,0,0,0,1,0],
    [1,0,0,0,0,0,0,1],
  ],
};

function createEmptyGrid(): number[][] {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
}

function computeConvolution(input: number[][], kernel: number[][]): number[][] {
  const output: number[][] = Array.from({ length: OUTPUT_SIZE }, () => Array(OUTPUT_SIZE).fill(0));
  // Compute sum of kernel for normalization (avoid clipping)
  const kernelSum = kernel.flat().reduce((a, b) => a + Math.abs(b), 0) || 1;

  for (let oy = 0; oy < OUTPUT_SIZE; oy++) {
    for (let ox = 0; ox < OUTPUT_SIZE; ox++) {
      let sum = 0;
      for (let ky = 0; ky < KERNEL_SIZE; ky++) {
        for (let kx = 0; kx < KERNEL_SIZE; kx++) {
          sum += input[oy + ky][ox + kx] * kernel[ky][kx];
        }
      }
      // Normalize to [0, 1] range
      output[oy][ox] = Math.max(0, Math.min(1, sum / kernelSum));
    }
  }
  return output;
}

function computeMaxPool(input: number[][]): number[][] {
  const poolSize = 2;
  const h = Math.floor(input.length / poolSize);
  const w = Math.floor(input[0].length / poolSize);
  const output: number[][] = Array.from({ length: h }, () => Array(w).fill(0));
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let max = -Infinity;
      for (let py = 0; py < poolSize; py++) {
        for (let px = 0; px < poolSize; px++) {
          const iy = y * poolSize + py;
          const ix = x * poolSize + px;
          if (iy < input.length && ix < input[0].length) {
            max = Math.max(max, input[iy][ix]);
          }
        }
      }
      output[y][x] = max === -Infinity ? 0 : max;
    }
  }
  return output;
}

export default function CNNSimulator() {
  const [inputGrid, setInputGrid] = useState<number[][]>(PRESETS.zero);
  const [activeKernel, setActiveKernel] = useState<string>("edge");
  const [outputGrid, setOutputGrid] = useState<number[][] | null>(null);
  const [pooledGrid, setPooledGrid] = useState<number[][] | null>(null);

  // Animation state
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [animStep, setAnimStep] = useState<{ row: number; col: number } | null>(null);
  const [currentDotProduct, setCurrentDotProduct] = useState<string | null>(null);
  const [animProgress, setAnimProgress] = useState(0);
  const [completedCells, setCompletedCells] = useState<boolean[][]>(
    Array.from({ length: OUTPUT_SIZE }, () => Array(OUTPUT_SIZE).fill(false))
  );

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawMode, setDrawMode] = useState<"paint" | "erase">("paint");

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const kernel = KERNELS[activeKernel];
  const totalSteps = OUTPUT_SIZE * OUTPUT_SIZE;

  // Handle pixel drawing
  const handlePixelInteraction = useCallback((row: number, col: number) => {
    setInputGrid((prev) => {
      const next = prev.map(r => [...r]);
      next[row][col] = drawMode === "paint" ? 1 : 0;
      return next;
    });
  }, [drawMode]);

  // Reset the animation state
  const resetAnimation = useCallback(() => {
    if (tlRef.current) {
      tlRef.current.kill();
      tlRef.current = null;
    }
    setIsRunning(false);
    setIsPaused(false);
    setAnimStep(null);
    setCurrentDotProduct(null);
    setAnimProgress(0);
    setOutputGrid(null);
    setPooledGrid(null);
    setCompletedCells(Array.from({ length: OUTPUT_SIZE }, () => Array(OUTPUT_SIZE).fill(false)));
  }, []);

  // Run convolution with animation
  const runConvolution = useCallback(() => {
    if (isRunning) return;
    resetAnimation();
    setIsRunning(true);

    const kernelMatrix = kernel.matrix;
    const finalOutput = computeConvolution(inputGrid, kernelMatrix);
    const kernelSum = kernelMatrix.flat().reduce((a, b) => a + Math.abs(b), 0) || 1;

    // Build fresh empty output grid to fill step-by-step
    const buildingOutput: number[][] = Array.from({ length: OUTPUT_SIZE }, () => Array(OUTPUT_SIZE).fill(0));
    setOutputGrid(buildingOutput);

    const tl = gsap.timeline({
      onComplete: () => {
        // Compute and show pooling after convolution completes
        const pooled = computeMaxPool(finalOutput);
        setPooledGrid(pooled);
        setAnimStep(null);
        setCurrentDotProduct(null);

        // Animate pooled grid appearing
        gsap.fromTo(".pool-cell",
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.3, stagger: 0.05, ease: "back.out(1.7)" }
        );

        setTimeout(() => setIsRunning(false), 600);
      },
    });
    tlRef.current = tl;

    let stepCount = 0;
    for (let oy = 0; oy < OUTPUT_SIZE; oy++) {
      for (let ox = 0; ox < OUTPUT_SIZE; ox++) {
        const capturedOy = oy;
        const capturedOx = ox;
        tl.to({}, {
          duration: 0.15,
          onStart: () => {
            setAnimStep({ row: capturedOy, col: capturedOx });

            // Calculate dot product string
            const terms: string[] = [];
            let sum = 0;
            for (let ky = 0; ky < KERNEL_SIZE; ky++) {
              for (let kx = 0; kx < KERNEL_SIZE; kx++) {
                const pixelVal = inputGrid[capturedOy + ky][capturedOx + kx];
                const kernelVal = kernelMatrix[ky][kx];
                terms.push(`${pixelVal}×${kernelVal}`);
                sum += pixelVal * kernelVal;
              }
            }
            const normalized = Math.max(0, Math.min(1, sum / kernelSum));
            setCurrentDotProduct(`(${terms.join(" + ")}) / ${kernelSum} = ${normalized.toFixed(2)}`);

            // Fill in the output cell
            buildingOutput[capturedOy][capturedOx] = finalOutput[capturedOy][capturedOx];
            setOutputGrid([...buildingOutput.map(r => [...r])]);

            // Mark cell as completed
            setCompletedCells((prev) => {
              const next = prev.map(r => [...r]);
              next[capturedOy][capturedOx] = true;
              return next;
            });

            stepCount++;
            setAnimProgress(stepCount / totalSteps);
          },
        });
      }
    }
  }, [isRunning, inputGrid, kernel, totalSteps, resetAnimation]);

  // Pause / resume
  const togglePause = () => {
    if (!tlRef.current) return;
    if (isPaused) {
      tlRef.current.resume();
    } else {
      tlRef.current.pause();
    }
    setIsPaused(!isPaused);
  };

  // Step forward one cell
  const stepForward = () => {
    if (!tlRef.current || !isPaused) return;
    // advance by one step duration
    const currentTime = tlRef.current.time();
    tlRef.current.time(currentTime + 0.15);
  };

  // Load preset
  const loadPreset = (name: string) => {
    if (isRunning) return;
    resetAnimation();
    setInputGrid(PRESETS[name].map(r => [...r]));
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (tlRef.current) tlRef.current.kill();
    };
  }, []);

  // Check if a pixel is within the active kernel window
  const isInReceptiveField = (row: number, col: number): boolean => {
    if (!animStep) return false;
    return (
      row >= animStep.row && row < animStep.row + KERNEL_SIZE &&
      col >= animStep.col && col < animStep.col + KERNEL_SIZE
    );
  };

  return (
    <div className="space-y-6" ref={containerRef}>
      {/* Main Visual Area */}
      <div className="sim-stage rounded-2xl p-5 md:p-6 relative overflow-hidden">
        {/* Pipeline Label */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-1 flex-1 rounded-full overflow-hidden bg-surface-light">
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${animProgress * 100}%`,
                background: `linear-gradient(90deg, ${kernel.color}, ${kernel.color}88)`,
                boxShadow: `0 0 15px ${kernel.color}40`,
              }}
            />
          </div>
          <span className="text-xs font-mono text-muted whitespace-nowrap">
            {isRunning ? `${Math.round(animProgress * 100)}%` : pooledGrid ? "Complete" : "Ready"}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
          {/* Input Grid */}
          <div className="flex-shrink-0">
            <div className="text-xs font-mono text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Input (8×8)
            </div>
            <div
               className="grid gap-[2px] p-1 rounded-lg border border-white/10 bg-background/50"
               style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
               onMouseLeave={() => setIsDrawing(false)}
            >
              {inputGrid.map((row, ry) =>
                row.map((val, cx) => {
                  const inField = isInReceptiveField(ry, cx);
                  return (
                    <div
                      key={`${ry}-${cx}`}
                      className="w-7 h-7 md:w-8 md:h-8 rounded-sm cursor-crosshair transition-all duration-150 relative"
                      style={{
                        background: val
                          ? inField
                            ? kernel.color
                            : "#e2e8f0"
                          : inField
                            ? `${kernel.color}30`
                            : "#0f0f2e",
                        boxShadow: inField ? `0 0 12px ${kernel.color}60, inset 0 0 6px ${kernel.color}30` : "none",
                        transform: inField ? "scale(1.1)" : "scale(1)",
                        zIndex: inField ? 10 : 1,
                        border: inField ? `2px solid ${kernel.color}` : "1px solid rgba(255,255,255,0.05)",
                      }}
                      onMouseDown={() => {
                        if (isRunning) return;
                        setIsDrawing(true);
                        handlePixelInteraction(ry, cx);
                      }}
                      onMouseEnter={() => {
                        if (isDrawing && !isRunning) handlePixelInteraction(ry, cx);
                      }}
                      onMouseUp={() => setIsDrawing(false)}
                    />
                  );
                })
              )}
            </div>
            {/* Draw tools */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setDrawMode("paint")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${drawMode === "paint" ? "bg-primary/20 text-primary-light border border-primary/30" : "text-muted hover:text-foreground border border-transparent"}`}
              >
                <Paintbrush className="w-3 h-3" /> Paint
              </button>
              <button
                onClick={() => setDrawMode("erase")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${drawMode === "erase" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "text-muted hover:text-foreground border border-transparent"}`}
              >
                <Eraser className="w-3 h-3" /> Erase
              </button>
              <button
                onClick={() => { if (!isRunning) { resetAnimation(); setInputGrid(createEmptyGrid()); } }}
                className="text-muted hover:text-foreground text-xs px-3 py-1.5 rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Convolution Arrow & Kernel */}
          <div className="flex flex-col items-center gap-4 self-center flex-shrink-0">
            <div className="text-xs font-mono text-muted uppercase tracking-widest mb-1">Kernel (3×3)</div>
            <div className="grid grid-cols-3 gap-[2px] p-1.5 rounded-lg border bg-background/50" style={{ borderColor: `${kernel.color}40` }}>
              {kernel.matrix.flat().map((val, i) => (
                <div
                  key={i}
                  className="w-8 h-8 md:w-9 md:h-9 rounded-sm flex items-center justify-center text-xs font-mono font-bold transition-all"
                  style={{
                    background: val > 0 ? `${kernel.color}25` : val < 0 ? "#ef444425" : "#0f0f2e",
                    color: val > 0 ? kernel.color : val < 0 ? "#f87171" : "#64748b",
                    border: `1px solid ${val !== 0 ? `${kernel.color}30` : "rgba(255,255,255,0.05)"}`,
                  }}
                >
                  {val > 0 ? `+${val}` : val}
                </div>
              ))}
            </div>
            {/* Animated arrow */}
            <div className="flex flex-col items-center gap-1">
              <div className="text-lg" style={{ color: kernel.color }}>⊛</div>
              <span className="text-[10px] text-muted font-mono">CONVOLVE</span>
            </div>
          </div>

          {/* Output Feature Map */}
          <div className="flex-shrink-0">
            <div className="text-xs font-mono text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: kernel.color, opacity: outputGrid ? 1 : 0.3 }} />
              Feature Map (6×6)
            </div>
            <div
              className="grid gap-[2px] p-1 rounded-lg border border-white/10 bg-background/50"
              style={{ gridTemplateColumns: `repeat(${OUTPUT_SIZE}, 1fr)` }}
            >
              {(outputGrid || Array.from({ length: OUTPUT_SIZE }, () => Array(OUTPUT_SIZE).fill(0))).map((row, ry) =>
                row.map((val: number, cx: number) => {
                  const isActive = animStep?.row === ry && animStep?.col === cx;
                  const done = completedCells[ry]?.[cx];
                  return (
                    <div
                      key={`o-${ry}-${cx}`}
                      className="w-7 h-7 md:w-8 md:h-8 rounded-sm transition-all duration-200 relative"
                      style={{
                        background: done
                          ? `rgba(${kernel.color === "#22d3ee" ? "34,211,238" : kernel.color === "#8b5cf6" ? "139,92,246" : kernel.color === "#f472b6" ? "244,114,182" : "74,222,128"}, ${val})`
                          : "#0a0a1f",
                        boxShadow: isActive ? `0 0 20px ${kernel.color}80` : "none",
                        transform: isActive ? "scale(1.15)" : "scale(1)",
                        border: isActive ? `2px solid ${kernel.color}` : done ? `1px solid ${kernel.color}30` : "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      {done && (
                        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono font-bold" style={{ color: val > 0.5 ? "#000" : kernel.color }}>
                          {val.toFixed(1)}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* MaxPool Output */}
          {pooledGrid && (
            <div className="flex-shrink-0 flex flex-col items-center gap-4 self-center">
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg text-accent">↓</span>
                <span className="text-[10px] text-muted font-mono">MAX POOL 2×2</span>
              </div>
              <div>
                <div className="text-xs font-mono text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  Pooled (3×3)
                </div>
                <div
                  className="grid gap-[2px] p-1 rounded-lg border border-accent/20 bg-background/50"
                  style={{ gridTemplateColumns: `repeat(3, 1fr)` }}
                >
                  {pooledGrid.map((row, ry) =>
                    row.map((val: number, cx: number) => (
                      <div
                        key={`p-${ry}-${cx}`}
                        className="pool-cell w-9 h-9 md:w-10 md:h-10 rounded-sm flex items-center justify-center text-[10px] font-mono font-bold border border-accent/20"
                        style={{
                          background: `rgba(6, 182, 212, ${val})`,
                          color: val > 0.5 ? "#000" : "#22d3ee",
                        }}
                      >
                        {val.toFixed(2)}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dot Product Readout */}
        {currentDotProduct && (
          <div className="mt-6 glass p-3 rounded-lg border border-white/10 overflow-x-auto">
            <div className="text-[10px] text-muted font-mono uppercase tracking-widest mb-1">Dot Product Calculation</div>
            <div className="text-xs font-mono break-all leading-relaxed" style={{ color: kernel.color }}>
              {currentDotProduct}
            </div>
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="sim-control-panel grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl">
        {/* Left: Filter Select + Presets */}
        <div className="space-y-5">
          <div>
            <h4 className="sim-section-title mb-3">Convolution Filter</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(KERNELS).map(([key, k]) => (
                <button
                  key={key}
                  onClick={() => { if (!isRunning) { setActiveKernel(key); resetAnimation(); } }}
                  className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all border ${
                    activeKernel === key
                      ? "border-opacity-40 shadow-lg"
                      : "border-white/5 bg-background/30 text-muted hover:text-foreground hover:bg-surface"
                  }`}
                  style={
                    activeKernel === key
                      ? {
                          borderColor: `${k.color}60`,
                          background: `${k.color}15`,
                          color: k.color,
                          boxShadow: `0 0 20px ${k.color}20`,
                        }
                      : {}
                  }
                >
                  {k.name}
                </button>
              ))}
            </div>
            <p className="sim-note mt-3">{kernel.description}</p>
          </div>

          <div>
            <h4 className="sim-section-title mb-3">Digit Presets</h4>
            <div className="flex gap-2">
              {Object.keys(PRESETS).map((name) => (
                <button
                  key={name}
                  onClick={() => loadPreset(name)}
                  disabled={isRunning}
                  className="px-4 py-2 rounded-lg text-xs font-medium bg-background/50 text-muted hover:text-foreground hover:bg-surface border border-white/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed capitalize"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Controls + Info */}
        <div className="space-y-5 flex flex-col justify-between">
          <div>
            <h4 className="sim-section-title mb-3">How It Works</h4>
            <p className="sim-note">
              A <span className="font-bold" style={{ color: kernel.color }}>Convolutional Neural Network</span> scans the input image with a small filter (kernel), computing a <span className="text-accent font-bold">dot product</span> at each position. The resulting <span className="text-white font-semibold">Feature Map</span> highlights specific patterns (edges, textures). <span className="text-accent font-bold">Max Pooling</span> then downsamples, keeping only the strongest activations — making the representation compact and translation-invariant.
            </p>
          </div>

          <div className="flex gap-3 mt-auto">
            <button
              onClick={runConvolution}
              disabled={isRunning}
              className="flex-1 bg-gradient-to-r from-primary to-accent text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_4px_20px_rgba(139,92,246,0.3)]"
            >
              <Play className="w-4 h-4" /> {isRunning ? "Convolving..." : "Run Convolution"}
            </button>
            {isRunning && (
              <button
                onClick={togglePause}
                className="sim-icon-button py-3 px-4 rounded-xl"
                title={isPaused ? "Resume" : "Pause"}
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>
            )}
            {isPaused && (
              <button
                onClick={stepForward}
                className="sim-icon-button py-3 px-4 rounded-xl"
                title="Step Forward"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => { resetAnimation(); }}
              disabled={!isRunning && !outputGrid}
              className="sim-icon-button py-3 px-4 rounded-xl disabled:opacity-50"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
