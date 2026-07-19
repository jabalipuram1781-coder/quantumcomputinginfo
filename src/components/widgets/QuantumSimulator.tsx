"use client";

import * as React from "react";
import { Play, RotateCcw, HelpCircle, Activity, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// Complex number helper
interface Complex {
  r: number; // real part
  i: number; // imaginary part
}

type GateType = "I" | "H" | "X" | "Z" | "CX_C" | "CX_T";

interface CircuitCell {
  gate: GateType;
  cnotPartner?: number; // index of the control/target qubit in the same step
}

export function QuantumSimulator() {
  const numQubits = 3;
  const numSteps = 5;

  // Initialize circuit grid (3 rows, 5 columns)
  const [grid, setGrid] = React.useState<CircuitCell[][]>(() =>
    Array(numQubits)
      .fill(null)
      .map(() => Array(numSteps).fill(null).map(() => ({ gate: "I" })))
  );

  const [stateVector, setStateVector] = React.useState<Complex[]>([]);
  const [probabilities, setProbabilities] = React.useState<number[]>([]);
  const [activeStep, setActiveStep] = React.useState<number | null>(null);

  // Math gates definitions
  const H_MAT = 1 / Math.sqrt(2);

  // Apply single qubit gate to state vector
  const applySingleQubitGate = (state: Complex[], q: number, gate: GateType): Complex[] => {
    const nextState = state.map((c) => ({ ...c }));
    const bitMask = 1 << q;

    for (let i = 0; i < state.length; i++) {
      // Process each pair only once (where the q-th bit is 0)
      if ((i & bitMask) === 0) {
        const j = i | bitMask; // partner state where q-th bit is 1

        const valI = state[i];
        const valJ = state[j];

        if (gate === "H") {
          nextState[i] = {
            r: H_MAT * (valI.r + valJ.r),
            i: H_MAT * (valI.i + valJ.i),
          };
          nextState[j] = {
            r: H_MAT * (valI.r - valJ.r),
            i: H_MAT * (valI.i - valJ.i),
          };
        } else if (gate === "X") {
          nextState[i] = valJ;
          nextState[j] = valI;
        } else if (gate === "Z") {
          nextState[i] = valI;
          nextState[j] = { r: -valJ.r, i: -valJ.i };
        }
      }
    }
    return nextState;
  };

  // Apply CNOT gate to state vector
  const applyCNOT = (state: Complex[], ctrl: number, target: number): Complex[] => {
    const nextState = state.map((c) => ({ ...c }));
    const ctrlMask = 1 << ctrl;
    const targetMask = 1 << target;

    for (let i = 0; i < state.length; i++) {
      // If control bit is 1 and target bit is 0
      if ((i & ctrlMask) !== 0 && (i & targetMask) === 0) {
        const j = i | targetMask; // partner state where target bit is 1

        // Swap the amplitudes of states i and j
        const valI = state[i];
        const valJ = state[j];
        nextState[i] = valJ;
        nextState[j] = valI;
      }
    }
    return nextState;
  };

  // Run simulation
  const runSimulation = React.useCallback(() => {
    // 1. Initialize state vector to |000>
    let state: Complex[] = Array(8).fill(null).map((_, idx) => ({
      r: idx === 0 ? 1 : 0,
      i: 0,
    }));

    // 2. Loop through each step (column) in the circuit
    for (let col = 0; col < numSteps; col++) {
      // Find single qubit gates in this column
      const gatesInCol: { q: number; gate: GateType }[] = [];
      let cnotCtrl: number | null = null;
      let cnotTarget: number | null = null;

      for (let row = 0; row < numQubits; row++) {
        const cell = grid[row][col];
        if (cell.gate === "CX_C") {
          cnotCtrl = row;
        } else if (cell.gate === "CX_T") {
          cnotTarget = row;
        } else if (cell.gate !== "I") {
          gatesInCol.push({ q: row, gate: cell.gate });
        }
      }

      // Apply single qubit gates first
      for (const { q, gate } of gatesInCol) {
        state = applySingleQubitGate(state, q, gate);
      }

      // Apply CNOT if both control and target are placed in this step
      if (cnotCtrl !== null && cnotTarget !== null) {
        state = applyCNOT(state, cnotCtrl, cnotTarget);
      }
    }

    // 3. Compute probabilities P = |amplitude|^2
    const probs = state.map((c) => c.r * c.r + c.i * c.i);

    setStateVector(state);
    setProbabilities(probs);
  }, [grid]);

  // Run simulation automatically when grid updates
  React.useEffect(() => {
    runSimulation();
  }, [runSimulation]);

  const handleCellClick = (row: number, col: number, gate: GateType) => {
    const newGrid = grid.map((r) => r.map((c) => ({ ...c })));
    
    // Clear partner linkages if we are replacing a CNOT node
    if (grid[row][col].gate === "CX_C" || grid[row][col].gate === "CX_T") {
      for (let r = 0; r < numQubits; r++) {
        if (r !== row && (newGrid[r][col].gate === "CX_C" || newGrid[r][col].gate === "CX_T")) {
          newGrid[r][col] = { gate: "I" };
        }
      }
    }

    newGrid[row][col] = { gate };

    // If setting a CNOT control, check if we need to set target on another qubit in same step
    if (gate === "CX_C") {
      // Default: set target on row + 1 (or row - 1 if row is last)
      const targetRow = row < numQubits - 1 ? row + 1 : row - 1;
      newGrid[targetRow][col] = { gate: "CX_T", cnotPartner: row };
      newGrid[row][col].cnotPartner = targetRow;
    } else if (gate === "CX_T") {
      const ctrlRow = row > 0 ? row - 1 : row + 1;
      newGrid[ctrlRow][col] = { gate: "CX_C", cnotPartner: row };
      newGrid[row][col].cnotPartner = ctrlRow;
    }

    setGrid(newGrid);
  };

  const resetCircuit = () => {
    setGrid(
      Array(numQubits)
        .fill(null)
        .map(() => Array(numSteps).fill(null).map(() => ({ gate: "I" })))
    );
  };

  const loadDemo = (demoType: "superposition" | "bell" | "ghz") => {
    resetCircuit();
    const newGrid = Array(numQubits)
      .fill(null)
      .map(() => Array(numSteps).fill(null).map(() => ({ gate: "I" } as CircuitCell)));

    if (demoType === "superposition") {
      newGrid[0][0] = { gate: "H" };
    } else if (demoType === "bell") {
      newGrid[0][0] = { gate: "H" };
      newGrid[0][1] = { gate: "CX_C", cnotPartner: 1 };
      newGrid[1][1] = { gate: "CX_T", cnotPartner: 0 };
    } else if (demoType === "ghz") {
      newGrid[0][0] = { gate: "H" };
      newGrid[0][1] = { gate: "CX_C", cnotPartner: 1 };
      newGrid[1][1] = { gate: "CX_T", cnotPartner: 0 };
      newGrid[1][2] = { gate: "CX_C", cnotPartner: 2 };
      newGrid[2][2] = { gate: "CX_T", cnotPartner: 1 };
    }
    setGrid(newGrid);
  };

  // Helper to format state vector mathematically
  const formatStateVector = (): React.ReactNode => {
    const terms: React.ReactNode[] = [];
    stateVector.forEach((c, idx) => {
      if (Math.abs(c.r) > 0.01) {
        const sign = terms.length > 0 ? " + " : "";
        const coeff = Math.abs(c.r - 0.707) < 0.01 ? "0.707" : c.r.toFixed(3);
        const binary = idx.toString(2).padStart(3, "0");
        terms.push(
          <span key={idx}>
            {sign}
            <span className="text-cyan-400 font-bold">{coeff}</span>
            |{binary}⟩
          </span>
        );
      }
    });
    return terms.length > 0 ? terms : <span>|000⟩</span>;
  };

  return (
    <div className="my-8 rounded-2xl border border-white/5 bg-white/[0.01] p-6 shadow-xl relative overflow-hidden group">
      {/* Background glow */}
      <div className="absolute right-0 top-0 -z-10 size-40 rounded-full bg-violet-500/5 opacity-50 blur-2xl transition-all duration-500" />

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <Activity className="size-3.5" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-white/40">
            Interactive Quantum Simulator
          </span>
        </div>

        {/* Demo buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => loadDemo("superposition")}
            className="rounded bg-white/5 px-2 py-1 text-[10px] font-bold text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            Hadamard Demo
          </button>
          <button
            onClick={() => loadDemo("bell")}
            className="rounded bg-white/5 px-2 py-1 text-[10px] font-bold text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            Bell State Demo
          </button>
          <button
            onClick={() => loadDemo("ghz")}
            className="rounded bg-white/5 px-2 py-1 text-[10px] font-bold text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            GHZ State Demo
          </button>
        </div>
      </div>

      {/* Circuit Grid Builder */}
      <div className="rounded-xl border border-white/5 bg-slate-950/80 p-6 overflow-x-auto">
        <div className="min-w-[480px] space-y-8 relative">
          {grid.map((row, rIdx) => (
            <div key={rIdx} className="flex items-center gap-4 relative h-12">
              
              {/* Qubit Label */}
              <div className="w-10 shrink-0 font-mono text-sm text-white/40 font-bold">
                q[{rIdx}]
              </div>

              {/* Wire line background */}
              <div className="absolute left-14 right-4 top-1/2 h-[2px] bg-white/10 -translate-y-1/2" />

              {/* Steps/Gates cells */}
              <div className="flex items-center justify-between w-full pl-4 pr-2 z-10">
                {row.map((cell, cIdx) => {
                  let gateLabel = "";
                  let gateStyle = "border-white/10 text-white/40 hover:border-white/30 hover:bg-white/5";

                  if (cell.gate === "H") {
                    gateLabel = "H";
                    gateStyle = "border-violet-500/50 bg-violet-950/80 text-violet-300 shadow-md shadow-violet-500/10";
                  } else if (cell.gate === "X") {
                    gateLabel = "X";
                    gateStyle = "border-cyan-500/50 bg-cyan-950/80 text-cyan-300 shadow-md shadow-cyan-500/10";
                  } else if (cell.gate === "Z") {
                    gateLabel = "Z";
                    gateStyle = "border-emerald-500/50 bg-emerald-950/80 text-emerald-300 shadow-md shadow-emerald-500/10";
                  } else if (cell.gate === "CX_C") {
                    gateLabel = "●";
                    gateStyle = "border-white/20 bg-white/10 text-cyan-400 text-lg";
                  } else if (cell.gate === "CX_T") {
                    gateLabel = "⊕";
                    gateStyle = "border-white/20 bg-white/10 text-cyan-400 text-lg";
                  }

                  return (
                    <div key={cIdx} className="relative group/cell">
                      {/* Gate click node */}
                      <button
                        className={cn(
                          "size-10 rounded-lg border text-center font-bold font-mono text-sm flex items-center justify-center transition-all duration-200 cursor-pointer",
                          gateStyle
                        )}
                      >
                        {gateLabel || "—"}
                      </button>

                      {/* Dropdown gate selector on hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/cell:flex items-center gap-1 bg-slate-900 border border-white/10 p-1.5 rounded-lg shadow-2xl z-50">
                        {(["I", "H", "X", "Z", "CX_C"] as GateType[]).map((g) => (
                          <button
                            key={g}
                            onClick={() => handleCellClick(rIdx, cIdx, g)}
                            className="size-7 rounded bg-white/5 border border-white/5 hover:bg-violet-600 hover:border-violet-500 text-white font-mono text-[10px] font-bold flex items-center justify-center transition-colors cursor-pointer"
                          >
                            {g === "I" ? "Empty" : g === "CX_C" ? "CX" : g}
                          </button>
                        ))}
                      </div>

                      {/* Vertical line connection for CNOT */}
                      {cell.gate === "CX_C" && cell.cnotPartner !== undefined && (
                        <div
                          className="absolute left-1/2 w-[2px] bg-cyan-500/50 z-[-1]"
                          style={{
                            top: rIdx < cell.cnotPartner ? "50%" : "auto",
                            bottom: rIdx > cell.cnotPartner ? "50%" : "auto",
                            height: `${Math.abs(rIdx - cell.cnotPartner) * 80}px`,
                            transform: "translateX(-50%)",
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulator Outputs */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5 pt-6">
        
        {/* State Vector representation */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
            Output State Vector |Ψ⟩
          </h4>
          <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4 font-mono text-sm leading-relaxed text-white min-h-[50px] flex items-center">
            <div className="flex flex-wrap gap-1 items-center">
              {formatStateVector()}
            </div>
          </div>
        </div>

        {/* Probability Chart bars */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider">
              Measurement Probabilities
            </h4>
            <button
              onClick={resetCircuit}
              className="flex items-center gap-1 text-[10px] text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="size-3" />
              Reset Circuit
            </button>
          </div>
          <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4 space-y-2.5">
            {probabilities.map((prob, idx) => {
              const binStr = idx.toString(2).padStart(3, "0");
              return (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <span className="w-10 font-mono text-white/40">|{binStr}⟩</span>
                  <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 shadow-md shadow-violet-500/20 transition-all duration-300"
                      style={{ width: `${prob * 100}%` }}
                    />
                  </div>
                  <span className="w-10 text-right font-mono font-bold text-white/70">
                    {(prob * 100).toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
