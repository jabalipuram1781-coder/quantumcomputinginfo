"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ArticleCoverProps {
  category: string;
  title: string;
  className?: string;
}

export function ArticleCover({ category, title, className }: ArticleCoverProps) {
  // Generate a deterministic index from the title to pick a pattern
  const patternIndex = React.useMemo(() => {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % 4;
  }, [title]);

  // Generate a deterministic angle for rotations
  const rotationAngle = React.useMemo(() => {
    let hash = 7;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 3) - hash);
    }
    return Math.abs(hash) % 360;
  }, [title]);

  return (
    <div
      className={cn(
        "relative w-full h-full bg-[#03020d] overflow-hidden flex items-center justify-center select-none group-hover/card:scale-105 transition-transform duration-500",
        className
      )}
    >
      {/* Background stars/grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:15px_15px]" />
      
      {/* Subtle radial ambient glow */}
      <div className="absolute inset-0 bg-radial from-violet-600/10 via-transparent to-transparent opacity-60" />

      {/* Render deterministic quantum graphic */}
      <div className="relative size-32 sm:size-36 flex items-center justify-center z-10 transition-transform duration-700 group-hover/card:rotate-12">
        {patternIndex === 0 && (
          /* Pattern 0: Bloch Sphere */
          <svg viewBox="0 0 100 100" className="w-full h-full text-cyan-400/30">
            {/* Sphere border */}
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="2 2" />
            {/* Equator ellipse */}
            <ellipse cx="50" cy="50" rx="40" ry="12" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="4 2" className="animate-spin-slow" style={{ animationDuration: "12s" }} />
            {/* Vertical axis */}
            <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
            {/* Horizontal axis */}
            <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
            
            {/* State Vector Arrow */}
            <g transform={`rotate(${rotationAngle} 50 50)`} className="transition-transform duration-500">
              <line x1="50" y1="50" x2="50" y2="20" stroke="#a78bfa" strokeWidth="1.5" markerEnd="url(#arrow)" className="drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
              <circle cx="50" cy="20" r="2.5" fill="#a78bfa" className="animate-pulse" />
            </g>

            {/* Definitions */}
            <defs>
              <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="20" fill="url(#glow)" className="animate-pulse" />
          </svg>
        )}

        {patternIndex === 1 && (
          /* Pattern 1: Wavefunction Superposition */
          <svg viewBox="0 0 100 100" className="w-full h-full text-violet-400/40">
            {/* Base guide line */}
            <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="0.25" strokeDasharray="2 4" />
            
            {/* Wave 1 */}
            <path
              d="M 10 50 Q 25 25 40 50 T 70 50 T 90 50"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="0.75"
              className="opacity-60"
            />
            {/* Wave 2 */}
            <path
              d="M 10 50 Q 30 70 50 50 T 90 50"
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="0.75"
              className="opacity-70"
            />

            {/* Interference wave */}
            <path
              d="M 10 50 C 25 75, 35 25, 50 50 C 65 75, 75 25, 90 50"
              fill="none"
              stroke="#22d3ee"
              strokeWidth="1.25"
              className="drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]"
            />
            
            {/* Pulsing particles */}
            <circle cx="30" cy="40" r="2" fill="#22d3ee" className="animate-ping" style={{ animationDuration: "2s" }} />
            <circle cx="50" cy="50" r="3" fill="#a78bfa" className="animate-pulse" />
            <circle cx="70" cy="60" r="2" fill="#06b6d4" className="animate-ping" style={{ animationDuration: "3.5s" }} />
          </svg>
        )}

        {patternIndex === 2 && (
          /* Pattern 2: Quantum Circuit Grid */
          <svg viewBox="0 0 100 100" className="w-full h-full text-cyan-400/30">
            {/* Grid tracks */}
            <line x1="20" y1="30" x2="80" y2="30" stroke="currentColor" strokeWidth="0.5" />
            <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="0.5" />
            <line x1="20" y1="70" x2="80" y2="70" stroke="currentColor" strokeWidth="0.5" />
            
            {/* Intersecting control lines */}
            <line x1="35" y1="20" x2="35" y2="80" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
            <line x1="65" y1="20" x2="65" y2="80" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
            
            {/* H Gate Box */}
            <rect x="25" y="22" width="16" height="16" rx="3" fill="#0c0a24" stroke="#06b6d4" strokeWidth="1" />
            <text x="33" y="33" fill="#22d3ee" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">H</text>

            {/* X Gate Box */}
            <rect x="57" y="62" width="16" height="16" rx="3" fill="#0c0a24" stroke="#8b5cf6" strokeWidth="1" />
            <text x="65" y="73" fill="#a78bfa" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">X</text>

            {/* Entanglement bridge */}
            <circle cx="48" cy="30" r="2" fill="#22d3ee" />
            <line x1="48" y1="30" x2="48" y2="50" stroke="#22d3ee" strokeWidth="1.25" />
            <circle cx="48" cy="50" r="3.5" stroke="#22d3ee" strokeWidth="1.25" fill="none" />
            <line x1="44" y1="50" x2="52" y2="50" stroke="#22d3ee" strokeWidth="1.25" />

            {/* Glow particles */}
            <circle cx="75" cy="50" r="1.5" fill="#22d3ee" className="animate-ping" />
          </svg>
        )}

        {patternIndex === 3 && (
          /* Pattern 3: Concentric Interference Rings */
          <svg viewBox="0 0 100 100" className="w-full h-full text-violet-400/20">
            {/* Rings */}
            <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="4 2" />
            <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="0.75" fill="none" />
            
            {/* Starburst rays */}
            <g className="animate-spin-slow" style={{ animationDuration: "25s" }}>
              <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.25" strokeDasharray="3 6" />
              <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="0.25" strokeDasharray="3 6" />
              <line x1="21.7" y1="21.7" x2="78.3" y2="78.3" stroke="currentColor" strokeWidth="0.25" strokeDasharray="3 6" />
              <line x1="21.7" y1="78.3" x2="78.3" y2="21.7" stroke="currentColor" strokeWidth="0.25" strokeDasharray="3 6" />
            </g>

            {/* Core emitter */}
            <circle cx="50" cy="50" r="5" fill="#8b5cf6" className="drop-shadow-[0_0_8px_rgba(139,92,246,0.9)]" />
            <circle cx="50" cy="50" r="10" stroke="#8b5cf6" strokeWidth="0.5" fill="none" className="animate-ping" style={{ animationDuration: "3s" }} />
          </svg>
        )}
      </div>

      {/* Decorative corner highlights */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/5 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/5 pointer-events-none" />

      {/* Gradient fade to card bottom */}
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#090d16]/90 to-transparent pointer-events-none z-10" />
    </div>
  );
}
