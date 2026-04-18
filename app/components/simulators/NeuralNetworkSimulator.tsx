"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { Play, RotateCcw, Plus, Minus } from "lucide-react";

interface Neuron {
  x: number;
  y: number;
  value: number;
  bias: number;
}

interface Connection {
  from: number;
  to: number;
  weight: number;
  layer: number;
}

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x));
}

export default function NeuralNetworkSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [layers, setLayers] = useState([2, 3, 2, 1]);
  const [isForwardPassing, setIsForwardPassing] = useState(false);
  const [activeConnection, setActiveConnection] = useState(-1);
  const [input1, setInput1] = useState(0.7);
  const [input2, setInput2] = useState(0.3);
  const [output, setOutput] = useState(0);
  const animRef = useRef<number>(0);

  const buildNetwork = useCallback(() => {
    const neurons: Neuron[][] = [];
    const connections: Connection[] = [];

    layers.forEach((count, layerIdx) => {
      const layerNeurons: Neuron[] = [];
      for (let i = 0; i < count; i++) {
        const x = 80 + (layerIdx / (layers.length - 1)) * 340;
        const spacing = 280 / (count + 1);
        const y = spacing * (i + 1) + 10;
        layerNeurons.push({
          x,
          y,
          value: layerIdx === 0 ? (i === 0 ? input1 : input2) : 0,
          bias: Math.random() * 0.5 - 0.25,
        });
      }
      neurons.push(layerNeurons);

      if (layerIdx > 0) {
        neurons[layerIdx - 1].forEach((_, fromIdx) => {
          layerNeurons.forEach((_, toIdx) => {
            connections.push({
              from: fromIdx,
              to: toIdx,
              weight: Math.random() * 2 - 1,
              layer: layerIdx - 1,
            });
          });
        });
      }
    });

    return { neurons, connections };
  }, [layers, input1, input2]);

  const [network, setNetwork] = useState(buildNetwork);

  useEffect(() => {
    setNetwork(buildNetwork());
  }, [buildNetwork]);

  const drawNetwork = useCallback(
    (highlightConn: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const { neurons, connections } = network;

      // Draw connections
      connections.forEach((conn, ci) => {
        const fromNeuron = neurons[conn.layer][conn.from];
        const toNeuron = neurons[conn.layer + 1][conn.to];

        const isActive = ci <= highlightConn;
        const isCurrent = ci === highlightConn;

        ctx.beginPath();
        ctx.moveTo(fromNeuron.x, fromNeuron.y);
        ctx.lineTo(toNeuron.x, toNeuron.y);

        if (isCurrent) {
          ctx.strokeStyle = "#22d3ee";
          ctx.lineWidth = 3;
          ctx.shadowColor = "#22d3ee";
          ctx.shadowBlur = 10;
        } else if (isActive) {
          const alpha = Math.min(1, Math.abs(conn.weight));
          ctx.strokeStyle =
            conn.weight > 0
              ? `rgba(139,92,246,${0.3 + alpha * 0.4})`
              : `rgba(244,114,182,${0.3 + alpha * 0.4})`;
          ctx.lineWidth = 1 + Math.abs(conn.weight);
        } else {
          ctx.strokeStyle = "rgba(139,92,246,0.1)";
          ctx.lineWidth = 0.8;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Signal pulse on active connection
        if (isCurrent) {
          const t = (Date.now() % 1000) / 1000;
          const px = fromNeuron.x + (toNeuron.x - fromNeuron.x) * t;
          const py = fromNeuron.y + (toNeuron.y - fromNeuron.y) * t;
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fillStyle = "#22d3ee";
          ctx.shadowColor = "#22d3ee";
          ctx.shadowBlur = 15;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Draw neurons
      neurons.forEach((layer, li) => {
        layer.forEach((neuron) => {
          // Glow
          ctx.beginPath();
          ctx.arc(neuron.x, neuron.y, 22, 0, Math.PI * 2);
          const glowColor =
            li === 0
              ? "rgba(139,92,246,0.1)"
              : li === neurons.length - 1
              ? "rgba(34,211,238,0.1)"
              : "rgba(167,139,250,0.08)";
          ctx.fillStyle = glowColor;
          ctx.fill();

          // Body
          ctx.beginPath();
          ctx.arc(neuron.x, neuron.y, 15, 0, Math.PI * 2);
          const colors = ["#8b5cf6", "#a78bfa", "#06b6d4", "#22d3ee"];
          ctx.fillStyle = colors[li % colors.length];
          ctx.fill();

          // Value label
          ctx.fillStyle = "#fff";
          ctx.font = "bold 9px 'Space Grotesk', monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(neuron.value.toFixed(2), neuron.x, neuron.y);
        });
      });

      // Layer labels
      ctx.fillStyle = "rgba(148,163,184,0.5)";
      ctx.font = "10px 'Space Grotesk', sans-serif";
      ctx.textAlign = "center";
      const labelNames = ["Input", ...layers.slice(1, -1).map((_, i) => `Hidden ${i + 1}`), "Output"];
      neurons.forEach((layer, li) => {
        const avg_x = layer.reduce((s, n) => s + n.x, 0) / layer.length;
        ctx.fillText(labelNames[li] || "", avg_x, h - 8);
      });
    },
    [network, layers]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = 300;
      }
      drawNetwork(-1);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [drawNetwork]);

  useEffect(() => {
    drawNetwork(activeConnection);
  }, [activeConnection, drawNetwork]);

  const runForwardPass = () => {
    setIsForwardPassing(true);
    setActiveConnection(-1);

    const { neurons, connections } = network;
    let connIdx = 0;
    const totalConns = connections.length;

    // Forward pass computation
    const newNeurons = neurons.map((layer) =>
      layer.map((n) => ({ ...n }))
    );

    const interval = setInterval(() => {
      if (connIdx >= totalConns) {
        clearInterval(interval);
        setIsForwardPassing(false);
        setOutput(newNeurons[newNeurons.length - 1][0].value);
        setNetwork({ neurons: newNeurons, connections });
        return;
      }

      const conn = connections[connIdx];
      const fromVal = newNeurons[conn.layer][conn.from].value;
      newNeurons[conn.layer + 1][conn.to].value += fromVal * conn.weight;

      // Apply activation at last connection to each neuron
      const isLastConnToNeuron =
        connIdx === totalConns - 1 ||
        connections[connIdx + 1]?.to !== conn.to ||
        connections[connIdx + 1]?.layer !== conn.layer;

      if (isLastConnToNeuron && conn.layer + 1 > 0) {
        newNeurons[conn.layer + 1][conn.to].value = sigmoid(
          newNeurons[conn.layer + 1][conn.to].value +
            newNeurons[conn.layer + 1][conn.to].bias
        );
      }

      setActiveConnection(connIdx);
      setNetwork({ neurons: newNeurons, connections });
      connIdx++;
    }, 80);
  };

  const reset = () => {
    setIsForwardPassing(false);
    setActiveConnection(-1);
    setOutput(0);
    setNetwork(buildNetwork());
  };

  const addHiddenNeuron = () => {
    if (layers.length < 5) {
      setLayers([...layers.slice(0, -1), 2, layers[layers.length - 1]]);
    } else {
      const newLayers = [...layers];
      const midIdx = Math.floor(newLayers.length / 2);
      if (newLayers[midIdx] < 5) {
        newLayers[midIdx]++;
        setLayers(newLayers);
      }
    }
  };

  const removeHiddenNeuron = () => {
    if (layers.length > 3) {
      const newLayers = [...layers];
      const midIdx = Math.floor(newLayers.length / 2);
      if (newLayers[midIdx] > 1) {
        newLayers[midIdx]--;
      } else {
        newLayers.splice(midIdx, 1);
      }
      setLayers(newLayers);
    }
  };

  return (
    <div className="space-y-6">
      {/* Canvas */}
      <div className="glass rounded-2xl p-4 overflow-hidden">
        <canvas ref={canvasRef} className="w-full rounded-lg" />
      </div>

      {/* Input controls */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-xl p-3">
          <p className="text-xs text-muted mb-2">Input 1</p>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={input1}
            onChange={(e) => setInput1(parseFloat(e.target.value))}
            className="w-full accent-primary"
          />
          <p className="text-center text-sm font-mono text-primary-light mt-1">
            {input1.toFixed(2)}
          </p>
        </div>
        <div className="glass rounded-xl p-3">
          <p className="text-xs text-muted mb-2">Input 2</p>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={input2}
            onChange={(e) => setInput2(parseFloat(e.target.value))}
            className="w-full accent-primary"
          />
          <p className="text-center text-sm font-mono text-accent-light mt-1">
            {input2.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-xl p-3 text-center">
          <p className="text-xs text-muted mb-1">Layers</p>
          <p className="text-lg font-mono font-bold text-primary-light">
            {layers.length}
          </p>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <p className="text-xs text-muted mb-1">Connections</p>
          <p className="text-lg font-mono font-bold text-accent-light">
            {network.connections.length}
          </p>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <p className="text-xs text-muted mb-1">Output</p>
          <p className="text-lg font-mono font-bold text-neon-pink">
            {output.toFixed(4)}
          </p>
        </div>
      </div>

      {/* Layer controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={removeHiddenNeuron}
          className="p-2 rounded-lg bg-surface-light hover:bg-primary/15 transition-colors text-muted"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="text-sm text-muted">Hidden Neurons</span>
        <button
          onClick={addHiddenNeuron}
          className="p-2 rounded-lg bg-surface-light hover:bg-primary/15 transition-colors text-muted"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={runForwardPass}
          disabled={isForwardPassing}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-semibold transition-all ${
            isForwardPassing
              ? "bg-surface-light text-muted cursor-not-allowed"
              : "bg-gradient-to-r from-primary to-accent text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
          }`}
        >
          <Play className="w-4 h-4" />
          {isForwardPassing ? "Processing..." : "Forward Pass"}
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
