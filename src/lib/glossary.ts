export interface GlossaryEntry {
  term: string;
  definition: string;
  category: "theory" | "hardware" | "software" | "industry";
  tags: string[];
}

export const glossaryEntries: GlossaryEntry[] = [
  {
    term: "Qubit",
    definition: "The fundamental unit of quantum information, analogous to the classical bit. Unlike a classical bit which must be in state 0 or 1, a qubit can exist in a superposition of both states simultaneously.",
    category: "theory",
    tags: ["basics", "quantum-mechanics"]
  },
  {
    term: "Superposition",
    definition: "A principle of quantum mechanics that allows a quantum system to be in multiple states at the same time until it is measured. For a qubit, this means being in a linear combination of |0⟩ and |1⟩.",
    category: "theory",
    tags: ["basics", "principles"]
  },
  {
    term: "Entanglement",
    definition: "A quantum phenomenon where two or more particles become correlated in such a way that the quantum state of each particle cannot be described independently of the others, even when separated by large distances.",
    category: "theory",
    tags: ["basics", "principles"]
  },
  {
    term: "Decoherence",
    definition: "The loss of quantum coherence in a quantum system, typically caused by interaction with the external environment. This leads to quantum noise and causes qubits to lose their quantum behavior and return to classical states.",
    category: "hardware",
    tags: ["noise", "challenges"]
  },
  {
    term: "Hadamard Gate",
    definition: "A single-qubit quantum logic gate that maps the basis state |0⟩ to (|0⟩ + |1⟩)/√2 and |1⟩ to (|0⟩ - |1⟩)/√2, creating an equal superposition of the two basis states.",
    category: "theory",
    tags: ["gates", "circuits"]
  },
  {
    term: "CNOT Gate",
    definition: "Controlled-NOT gate. A multi-qubit gate that performs a Pauli-X (NOT) operation on a target qubit only if the control qubit is in state |1⟩. It is commonly used to create entangled states.",
    category: "theory",
    tags: ["gates", "circuits"]
  },
  {
    term: "NISQ",
    definition: "Noisy Intermediate-Scale Quantum. The current era of quantum computing where processors contain 50 to a few hundred qubits but lack full quantum error correction, meaning they are prone to noise and errors.",
    category: "industry",
    tags: ["hardware", "timeline"]
  },
  {
    term: "Quantum Supremacy",
    definition: "Also called quantum advantage. The milestone demonstrating that a quantum computer can solve a specific calculation that is practically impossible for any classical supercomputer to solve in a reasonable timeframe.",
    category: "industry",
    tags: ["milestones", "benchmarks"]
  },
  {
    term: "Qiskit",
    definition: "An open-source software development kit created by IBM for working with quantum computers at the level of circuits, pulses, and algorithms. It is written in Python.",
    category: "software",
    tags: ["programming", "ibm"]
  },
  {
    term: "Quantum Error Correction",
    definition: "A set of techniques used to protect quantum information from noise, decoherence, and operational errors by encoding logical qubits into larger groups of physical qubits.",
    category: "theory",
    tags: ["hardware", "noise"]
  },
  {
    term: "Bloch Sphere",
    definition: "A geometrical representation of the pure state space of a two-level quantum mechanical system (a qubit). The poles represent the classical states |0⟩ and |1⟩, and the surface represents all pure superposition states.",
    category: "theory",
    tags: ["basics", "geometry"]
  },
  {
    term: "Cryostat",
    definition: "A device used to maintain extremely low temperatures. Superconducting quantum computers require cryostats (dilution refrigerators) to cool their quantum processors down to near absolute zero (~15 millikelvin).",
    category: "hardware",
    tags: ["infrastructure", "cooling"]
  }
];

export function getGlossaryEntry(termName: string): GlossaryEntry | undefined {
  const normName = termName.toLowerCase().trim();
  return glossaryEntries.find((e) => e.term.toLowerCase() === normName);
}
