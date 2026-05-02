"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { Play, RotateCcw, Type, Thermometer } from "lucide-react";
import gsap from "gsap";

/* ─── Attention Math Core ─── */

// Deterministic seeded random for reproducible "learned" matrices
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function createMatrix(rows: number, cols: number, seed: number): number[][] {
  const rng = seededRandom(seed);
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => parseFloat((rng() * 2 - 1).toFixed(3)))
  );
}

function matMul(a: number[][], b: number[][]): number[][] {
  const rows = a.length;
  const cols = b[0].length;
  const inner = b.length;
  const result: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let sum = 0;
      for (let k = 0; k < inner; k++) {
        sum += a[i][k] * b[k][j];
      }
      result[i][j] = parseFloat(sum.toFixed(4));
    }
  }
  return result;
}

function transpose(m: number[][]): number[][] {
  return m[0].map((_, ci) => m.map(row => row[ci]));
}

function softmaxRows(matrix: number[][], temperature: number): number[][] {
  return matrix.map(row => {
    const scaled = row.map(v => v / temperature);
    const max = Math.max(...scaled);
    const exps = scaled.map(v => Math.exp(v - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(e => parseFloat((e / sum).toFixed(4)));
  });
}

// Simple word-level tokenizer
function tokenize(sentence: string): string[] {
  return sentence.trim().split(/\s+/).filter(Boolean).slice(0, 8); // Cap at 8 tokens
}

// Simple hash-based embedding (deterministic from token string)
function tokenToEmbedding(token: string, dim: number): number[] {
  const rng = seededRandom(token.split("").reduce((a, c) => a + c.charCodeAt(0) * 31, 0));
  return Array.from({ length: dim }, () => parseFloat((rng() * 2 - 1).toFixed(3)));
}

type Phase = "idle" | "embedding" | "qkv" | "scores" | "softmax" | "output" | "done";

const PHASE_LABELS: Record<Phase, string> = {
  idle: "Enter a sentence and run attention",
  embedding: "Encoding tokens into vector embeddings...",
  qkv: "Projecting embeddings into Query, Key, Value matrices...",
  scores: "Computing attention scores via Q · Kᵀ...",
  softmax: "Applying Softmax (temperature-scaled)...",
  output: "Computing weighted output via Attention × V...",
  done: "Self-attention complete!",
};

const PRESET_SENTENCES = [
  "The cat sat on mat",
  "AI learns from data",
  "Attention is all you need",
  "Neural networks transform inputs",
];

const D_MODEL = 4; // embedding dimension (small for visualization)
type MatrixData = (number | null)[][];

// Color helper for heatmap cells
const heatColor = (val: number | null, isProbability: boolean = false): string => {
  if (val === null) return "#0a0a1f";
  if (isProbability) {
    const intensity = Math.round(val * 255);
    return `rgb(${Math.round(intensity * 0.08)}, ${Math.round(intensity * 0.83)}, ${Math.round(intensity * 0.93)})`;
  }
  const norm = Math.max(-1, Math.min(1, val));
  if (norm >= 0) {
    const intensity = norm;
    return `rgba(34, 211, 238, ${intensity * 0.8 + 0.1})`;
  }
  const intensity = -norm;
  return `rgba(244, 114, 182, ${intensity * 0.8 + 0.1})`;
};

const textColorForHeat = (val: number | null, isProbability: boolean = false): string => {
  if (val === null) return "#334155";
  if (isProbability) return val > 0.4 ? "#000" : "#22d3ee";
  return Math.abs(val) > 0.5 ? "#fff" : "#94a3b8";
};

function MatrixGrid({
  data,
  label,
  color,
  tokens: headerTokens,
  isProbability,
  showRowHighlight,
  compact,
  highlightRow,
}: {
  data: MatrixData | null;
  label: string;
  color: string;
  tokens?: string[];
  isProbability?: boolean;
  showRowHighlight?: boolean;
  compact?: boolean;
  highlightRow: number;
}) {
  if (!data) return null;
  const cellSize = compact ? "w-11 h-7" : "w-12 h-8";
  return (
    <div className="matrix-reveal">
      <div className="text-[10px] font-mono text-muted uppercase tracking-widest mb-2 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
        {label}
      </div>
      <div className="overflow-x-auto">
        <table className="border-collapse">
          {headerTokens && (
            <thead>
              <tr>
                <th className="p-0.5" />
                {headerTokens.map((t, i) => (
                  <th key={i} className="p-0.5 text-[9px] font-mono text-muted text-center max-w-[50px] truncate">{t}</th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {data.map((row, ri) => (
              <tr key={ri} className={showRowHighlight && ri === highlightRow ? "ring-1 ring-accent" : ""}>
                {headerTokens && (
                  <td className="pr-1.5 text-[9px] font-mono text-muted text-right max-w-[50px] truncate">{headerTokens[ri]}</td>
                )}
                {row.map((val, ci) => (
                  <td key={ci} className="p-0.5">
                    <div
                      className={`${cellSize} rounded-[3px] flex items-center justify-center text-[9px] font-mono font-medium transition-all duration-300`}
                      style={{
                        background: heatColor(val, isProbability),
                        color: textColorForHeat(val, isProbability),
                        boxShadow: (showRowHighlight && ri === highlightRow && val !== null) ? `0 0 8px ${color}50` : "none",
                        border: `1px solid ${val !== null ? `${color}20` : "rgba(255,255,255,0.03)"}`,
                      }}
                    >
                      {val !== null ? val.toFixed(2) : ""}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AttentionSimulator() {
  const [sentence, setSentence] = useState("The cat sat on mat");
  const [temperature, setTemperature] = useState(1.0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [isRunning, setIsRunning] = useState(false);

  // Computed matrices
  const [tokens, setTokens] = useState<string[]>([]);
  const [embeddings, setEmbeddings] = useState<number[][] | null>(null);
  const [queryMatrix, setQueryMatrix] = useState<number[][] | null>(null);
  const [keyMatrix, setKeyMatrix] = useState<number[][] | null>(null);
  const [valueMatrix, setValueMatrix] = useState<number[][] | null>(null);
  const [attentionScores, setAttentionScores] = useState<MatrixData | null>(null);
  const [attentionWeights, setAttentionWeights] = useState<MatrixData | null>(null);
  const [outputMatrix, setOutputMatrix] = useState<number[][] | null>(null);

  // Animation highlight
  const [highlightRow, setHighlightRow] = useState<number>(-1);

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Weight matrices (pretend these are "learned" - seeded deterministic)
  const Wq = useMemo(() => createMatrix(D_MODEL, D_MODEL, 42), []);
  const Wk = useMemo(() => createMatrix(D_MODEL, D_MODEL, 137), []);
  const Wv = useMemo(() => createMatrix(D_MODEL, D_MODEL, 256), []);

  const resetAll = useCallback(() => {
    if (tlRef.current) { tlRef.current.kill(); tlRef.current = null; }
    setPhase("idle");
    setIsRunning(false);
    setTokens([]);
    setEmbeddings(null);
    setQueryMatrix(null);
    setKeyMatrix(null);
    setValueMatrix(null);
    setAttentionScores(null);
    setAttentionWeights(null);
    setOutputMatrix(null);
    setHighlightRow(-1);
  }, []);

  const runAttention = useCallback(() => {
    if (isRunning) return;
    resetAll();
    setIsRunning(true);

    const toks = tokenize(sentence);
    if (toks.length < 2) {
      setIsRunning(false);
      return;
    }

    const n = toks.length;
    const emb = toks.map(t => tokenToEmbedding(t, D_MODEL));

    // Compute all matrices ahead of time
    const Q = matMul(emb, Wq);
    const K = matMul(emb, Wk);
    const V = matMul(emb, Wv);
    const scores = matMul(Q, transpose(K));
    // Scale by sqrt(d_k)
    const scaledScores = scores.map(row => row.map(v => parseFloat((v / Math.sqrt(D_MODEL)).toFixed(4))));
    const weights = softmaxRows(scaledScores, temperature);
    const output = matMul(weights, V);

    // Build GSAP timeline to reveal step by step
    const tl = gsap.timeline({
      onComplete: () => {
        setPhase("done");
        setHighlightRow(-1);
        setTimeout(() => setIsRunning(false), 500);
      },
    });
    tlRef.current = tl;

    // Phase 1: Tokenize & Embed
    tl.to({}, {
      duration: 0.8,
      onStart: () => {
        setTokens(toks);
        setPhase("embedding");
      },
    });
    tl.to({}, {
      duration: 1.0,
      onStart: () => {
        setEmbeddings(emb);
      },
    });

    // Phase 2: Q, K, V projection
    tl.to({}, {
      duration: 0.8,
      onStart: () => {
        setPhase("qkv");
        setQueryMatrix(Q);
      },
    });
    tl.to({}, {
      duration: 0.6,
      onStart: () => setKeyMatrix(K),
    });
    tl.to({}, {
      duration: 0.6,
      onStart: () => setValueMatrix(V),
    });

    // Phase 3: Score computation (highlight row by row)
    tl.to({}, {
      duration: 0.3,
      onStart: () => setPhase("scores"),
    });
    for (let i = 0; i < n; i++) {
      tl.to({}, {
        duration: 0.25,
        onStart: () => {
          setHighlightRow(i);
          // Reveal scores row by row
          setAttentionScores(prev => {
            const current: MatrixData = prev ? prev.map(r => [...r]) : Array.from({ length: n }, () => Array(n).fill(null));
            current[i] = scaledScores[i];
            return current;
          });
        },
      });
    }

    // Phase 4: Softmax
    tl.to({}, {
      duration: 0.3,
      onStart: () => {
        setPhase("softmax");
        setHighlightRow(-1);
      },
    });
    for (let i = 0; i < n; i++) {
      tl.to({}, {
        duration: 0.25,
        onStart: () => {
          setHighlightRow(i);
          setAttentionWeights(prev => {
            const current: MatrixData = prev ? prev.map(r => [...r]) : Array.from({ length: n }, () => Array(n).fill(null));
            current[i] = weights[i];
            return current;
          });
        },
      });
    }

    // Phase 5: Output
    tl.to({}, {
      duration: 0.5,
      onStart: () => {
        setPhase("output");
        setHighlightRow(-1);
        setOutputMatrix(output);
      },
    });
  }, [isRunning, sentence, temperature, Wq, Wk, Wv, resetAll]);

  // Cleanup
  useEffect(() => {
    return () => { if (tlRef.current) tlRef.current.kill(); };
  }, []);

  return (
    <div className="space-y-6" ref={containerRef}>
      {/* Main Visual Area */}
      <div className="sim-stage rounded-2xl p-5 md:p-6 relative overflow-hidden">
        {/* Phase indicator */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex gap-1.5">
            {(["embedding", "qkv", "scores", "softmax", "output"] as Phase[]).map((p) => {
              const active = phase === p;
              const past = ["embedding", "qkv", "scores", "softmax", "output"].indexOf(phase) > ["embedding", "qkv", "scores", "softmax", "output"].indexOf(p);
              return (
                <div
                  key={p}
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: active ? 32 : 12,
                    background: active ? "linear-gradient(90deg, #8b5cf6, #06b6d4)" : past || phase === "done" ? "#8b5cf6" : "#1e1e38",
                    boxShadow: active ? "0 0 10px rgba(139,92,246,0.5)" : "none",
                  }}
                />
              );
            })}
          </div>
          <span className="text-xs font-mono text-muted">{PHASE_LABELS[phase]}</span>
        </div>

        {/* Token chips */}
        {tokens.length > 0 && (
          <div className="mb-6">
            <div className="text-[10px] font-mono text-muted uppercase tracking-widest mb-2">Tokens</div>
            <div className="flex gap-2 flex-wrap">
              {tokens.map((token, i) => (
                <div
                  key={i}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-500 border"
                  style={{
                    background: highlightRow === i ? "#8b5cf620" : "#12122e",
                    borderColor: highlightRow === i ? "#8b5cf650" : "rgba(255,255,255,0.08)",
                    color: highlightRow === i ? "#a78bfa" : "#e2e8f0",
                    boxShadow: highlightRow === i ? "0 0 15px rgba(139,92,246,0.3)" : "none",
                  }}
                >
                  {token}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Matrix displays */}
        <div className="space-y-6">
          {/* Embeddings */}
          <MatrixGrid data={embeddings} label={`Embeddings (${tokens.length}×${D_MODEL})`} color="#a78bfa" compact />

          {/* Q, K, V in a row */}
          {(queryMatrix || keyMatrix || valueMatrix) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MatrixGrid data={queryMatrix} label="Query (Q)" color="#8b5cf6" compact />
              <MatrixGrid data={keyMatrix} label="Key (K)" color="#22d3ee" compact />
              <MatrixGrid data={valueMatrix} label="Value (V)" color="#f472b6" compact />
            </div>
          )}

          {/* Attention scores + weights side by side */}
          {(attentionScores || attentionWeights) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MatrixGrid
                data={attentionScores}
                label={`Scores: Q·Kᵀ / √${D_MODEL}`}
                color="#8b5cf6"
                tokens={tokens}
                showRowHighlight={phase === "scores"}
              />
              <MatrixGrid
                data={attentionWeights}
                label={`Attention Weights (Softmax, τ=${temperature.toFixed(1)})`}
                color="#06b6d4"
                tokens={tokens}
                isProbability
                showRowHighlight={phase === "softmax"}
              />
            </div>
          )}

          {/* Output */}
          <MatrixGrid data={outputMatrix} label={`Output: Attention × V (${tokens.length}×${D_MODEL})`} color="#4ade80" compact />
        </div>
      </div>

      {/* Control Panel */}
      <div className="sim-control-panel grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl">
        {/* Left */}
        <div className="space-y-5">
          <div>
            <h4 className="sim-section-title mb-3 flex items-center gap-2">
              <Type className="w-4 h-4 text-primary" /> Input Sentence
            </h4>
            <input
              type="text"
              value={sentence}
              onChange={(e) => { if (!isRunning) setSentence(e.target.value); }}
              disabled={isRunning}
              className="w-full bg-background/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground font-medium focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all disabled:opacity-50 placeholder:text-muted"
              placeholder="Type a sentence (max 8 words)..."
            />
          </div>

          <div>
            <h4 className="sim-section-title mb-2">Preset Sentences</h4>
            <div className="flex flex-wrap gap-2">
              {PRESET_SENTENCES.map((s, i) => (
                <button
                  key={i}
                  onClick={() => { if (!isRunning) { setSentence(s); resetAll(); } }}
                  disabled={isRunning}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-background/50 text-muted hover:text-foreground hover:bg-surface border border-white/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  &ldquo;{s}&rdquo;
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted font-medium flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5" /> Temperature (τ)
              </span>
              <span className="text-white font-mono">{temperature.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.1"
              value={temperature}
              onChange={(e) => { if (!isRunning) setTemperature(parseFloat(e.target.value)); }}
              disabled={isRunning}
              className="w-full accent-accent"
            />
            <p className="text-[10px] text-muted mt-1">Low τ → sharp focus on one token. High τ → spread attention equally.</p>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-5 flex flex-col justify-between">
          <div>
            <h4 className="sim-section-title mb-3">The Attention Mechanism</h4>
            <p className="sim-note">
              Every word in a sentence needs context from other words. <span className="text-primary-light font-bold">Self-Attention</span> achieves this through three projections: <span className="text-primary font-bold">Query</span> (what am I looking for?), <span className="text-accent font-bold">Key</span> (what do I contain?), and <span className="text-neon-pink font-bold">Value</span> (what information do I carry?).
            </p>
            <p className="sim-note mt-2">
              The <span className="text-white font-semibold">attention score</span> is computed as <code className="text-accent text-[10px]">Q · Kᵀ / √d</code>, then <span className="text-accent font-bold">Softmax</span> converts these into probabilities. The final output is a weighted sum of Values — each word&apos;s representation is now enriched with context from the entire sentence.
            </p>
          </div>

          <div className="flex gap-3 mt-auto">
            <button
              onClick={runAttention}
              disabled={isRunning || sentence.trim().split(/\s+/).length < 2}
              className="flex-1 bg-gradient-to-r from-primary to-accent text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_4px_20px_rgba(139,92,246,0.3)]"
            >
              <Play className="w-4 h-4" /> {isRunning ? "Computing..." : "Run Self-Attention"}
            </button>
            <button
              onClick={resetAll}
              disabled={phase === "idle"}
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
