export interface LearningPathMilestone {
  id: string;
  title: string;
  description: string;
  slug?: string; // Link to the tutorial MDX page (if any)
  estimatedMinutes: number;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedHours: number;
  milestones: LearningPathMilestone[];
}

export const learningPaths: LearningPath[] = [
  {
    id: "quantum-basics",
    title: "Quantum Computing Foundations",
    description: "Start from scratch and learn the core physical concepts behind quantum computation, from simple wave-particle duality to quantum gates.",
    difficulty: "beginner",
    estimatedHours: 4,
    milestones: [
      {
        id: "intro-qubits",
        title: "Introduction to Qubits",
        description: "Understand how qubits differ from classical bits and why superposition is powerful.",
        slug: "what-is-quantum-computing", // matches seed article if exists, or general slug
        estimatedMinutes: 15
      },
      {
        id: "superposition-entanglement",
        title: "Superposition & Entanglement",
        description: "Deep dive into Einstein's 'spooky action at a distance' and wave-function math.",
        slug: "understanding-quantum-entanglement",
        estimatedMinutes: 25
      },
      {
        id: "quantum-gates-math",
        title: "Quantum Gates and Operations",
        description: "Learn single-qubit rotations (H, X, Y, Z) and the CNOT gate.",
        slug: "visualizing-qubit-states-bloch-sphere",
        estimatedMinutes: 30
      }
    ]
  },
  {
    id: "quantum-programming",
    title: "Hands-on Quantum Programming",
    description: "Step into the software layer. Learn Python, Qiskit, and run simulations of quantum algorithms on real quantum hardware platforms.",
    difficulty: "intermediate",
    estimatedHours: 6,
    milestones: [
      {
        id: "qiskit-setup",
        title: "Setting up your Qiskit environment",
        description: "Install Qiskit, configure IBM Quantum API keys, and run a local noiseless simulator.",
        slug: "hands-on-quantum-programming-qiskit",
        estimatedMinutes: 20
      },
      {
        id: "first-quantum-circuit",
        title: "Building your first Quantum Circuit",
        description: "Construct a Bell state circuit using H and CNOT gates and run a simulation.",
        slug: "building-bell-states-in-qiskit",
        estimatedMinutes: 30
      },
      {
        id: "grovers-algorithm",
        title: "Unstructured Search with Grover's Algorithm",
        description: "Implement the Grover diffusion operator and oracle to search databases with quadratic speedup.",
        slug: "grover-algorithm-from-scratch",
        estimatedMinutes: 45
      }
    ]
  }
];
