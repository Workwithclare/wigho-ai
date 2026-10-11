"use client";

import React, { useEffect, useState } from 'react';
import { WihgoSymbol } from '../common/Logo';

interface OpeningMotionSequenceProps {
  onComplete: () => void;
  durationMs?: number;
}

export const OpeningMotionSequence: React.FC<OpeningMotionSequenceProps> = ({
  onComplete,
  durationMs = 3000
}) => {
  // Phase 1: 0 - 0.7s (Logo Reveal & Metallic Glint)
  // Phase 2: 0.7 - 1.6s (Connecting Rings & WIHGO AI CONNECT HUB)
  // Phase 3: 1.6 - 2.6s (AI Network Active + Connect • Collaborate • Achieve)
  // Phase 4: 2.6 - 3.0s (Smooth transition directly to welcome or dashboard)
  const [phase, setPhase] = useState<number>(1);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  useEffect(() => {
    // Phase 2: Connecting Rings & Brand Title
    const t1 = setTimeout(() => {
      setPhase(2);
    }, 700);

    // Phase 3: Connect • Collaborate • Achieve
    const t2 = setTimeout(() => {
      setPhase(3);
    }, 1500);

    // Phase 4: Fade transition out
    const t3 = setTimeout(() => {
      setIsExiting(true);
    }, 2600);

    // Complete
    const t4 = setTimeout(() => {
      onComplete();
    }, durationMs);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [durationMs, onComplete]);

  return (
    <div
      id="wihgo-opening-motion-sequence"
      className={`fixed inset-0 z-[100] bg-[#05080A] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-700 select-none ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="WIHGO AI Opening Motion"
    >
      {/* Deep Futuristic Ambient Background Lighting */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Central Deep Teal Atmospheric Glow */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-teal-950/40 via-teal-800/25 to-slate-900/30 rounded-full blur-[140px] transition-all duration-1000 ${
            phase >= 3 ? 'scale-125 opacity-100' : 'scale-100 opacity-60'
          }`}
        />

        {/* Subtle Micro-Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle, #14B8A6 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      {/* Main Motion Canvas Container */}
      <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center max-w-lg mx-auto">
        
        {/* ============================================================ */}
        {/* MOTION COMPONENT: LOGO + INTERLOCKING RINGS + AI NETWORK     */}
        {/* ============================================================ */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">

          {/* SCENE 2 & 3: CONVERGING & INTERLOCKING RINGS */}
          <svg
            viewBox="0 0 320 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <defs>
              <linearGradient id="motionRingSilver" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="30%" stopColor="#CBD5E1" />
                <stop offset="70%" stopColor="#F8FAFC" />
                <stop offset="100%" stopColor="#94A3B8" />
              </linearGradient>

              <linearGradient id="motionRingTeal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0D9488" />
                <stop offset="50%" stopColor="#14B8A6" />
                <stop offset="100%" stopColor="#2DD4BF" />
              </linearGradient>

              <radialGradient id="motionPulseNode" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor="#2DD4BF" />
                <stop offset="100%" stopColor="#0D9488" />
              </radialGradient>
            </defs>

            {/* Orbit Ring 1 — Converging from Top Left */}
            <g
              className={`transition-all duration-1000 ease-out origin-center ${
                phase === 1
                  ? 'opacity-0 -translate-x-12 -translate-y-12 scale-75'
                  : phase >= 2
                  ? 'opacity-80 translate-x-0 translate-y-0 scale-100'
                  : ''
              }`}
            >
              <ellipse
                cx="160"
                cy="160"
                rx="120"
                ry="55"
                transform="rotate(-28 160 160)"
                stroke="url(#motionRingSilver)"
                strokeWidth={phase >= 3 ? '2' : '1.5'}
                strokeDasharray={phase >= 3 ? '12 4' : 'none'}
                className="transition-all duration-700"
              />
            </g>

            {/* Orbit Ring 2 — Converging from Bottom Right */}
            <g
              className={`transition-all duration-1000 ease-out origin-center delay-150 ${
                phase === 1
                  ? 'opacity-0 translate-x-12 translate-y-12 scale-75'
                  : phase >= 2
                  ? 'opacity-80 translate-x-0 translate-y-0 scale-100'
                  : ''
              }`}
            >
              <ellipse
                cx="160"
                cy="160"
                rx="120"
                ry="55"
                transform="rotate(32 160 160)"
                stroke="url(#motionRingTeal)"
                strokeWidth={phase >= 3 ? '2' : '1.5'}
                strokeDasharray={phase >= 3 ? '16 6 4 6' : 'none'}
                className="transition-all duration-700"
              />
            </g>

            {/* Orbit Ring 3 — Central Symmetrical Circular Network Boundary */}
            <g
              className={`transition-all duration-1000 ease-out origin-center delay-300 ${
                phase === 1
                  ? 'opacity-0 scale-50'
                  : phase >= 2
                  ? 'opacity-90 scale-100'
                  : ''
              }`}
            >
              <circle
                cx="160"
                cy="160"
                r="115"
                stroke="url(#motionRingSilver)"
                strokeWidth="1.5"
                strokeDasharray={phase >= 3 ? '20 6' : '8 4'}
                strokeOpacity="0.7"
              />
            </g>

            {/* SCENE 3: AI NETWORK ACTIVE NODES */}
            {phase >= 3 && (
              <g className="animate-in fade-in duration-700">
                {/* Node Top */}
                <circle cx="160" cy="45" r="4.5" fill="url(#motionPulseNode)" stroke="#F8FAFC" strokeWidth="1" />
                <circle cx="160" cy="45" r="8" stroke="#2DD4BF" strokeWidth="1" strokeOpacity="0.6" className="animate-ping" />

                {/* Node Bottom */}
                <circle cx="160" cy="275" r="4.5" fill="url(#motionPulseNode)" stroke="#F8FAFC" strokeWidth="1" />
                <circle cx="160" cy="275" r="8" stroke="#2DD4BF" strokeWidth="1" strokeOpacity="0.6" className="animate-ping" />

                {/* Node Left */}
                <circle cx="45" cy="160" r="4" fill="url(#motionPulseNode)" stroke="#CBD5E1" strokeWidth="1" />

                {/* Node Right */}
                <circle cx="275" cy="160" r="4" fill="url(#motionPulseNode)" stroke="#CBD5E1" strokeWidth="1" />

                {/* Sub-node Synaptic Pulses */}
                <circle cx="78" cy="100" r="3" fill="#CBD5E1" />
                <circle cx="242" cy="220" r="3" fill="#2DD4BF" />
              </g>
            )}
          </svg>

          {/* SCENE 1: WIHGO W + SILVER ORB LOGO */}
          <div
            className={`relative z-20 mx-auto w-44 h-44 max-w-[180px] md:max-w-[260px] md:w-60 md:h-60 filter drop-shadow-[0_0_35px_rgba(13,148,136,0.55)] transition-all duration-1000 ease-out ${
              phase >= 1 ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-4'
            }`}
          >
            <WihgoSymbol className="w-full h-full max-w-[180px] md:max-w-[260px]" />

            {/* Subtle Metallic Specular Light Sweep Overlay */}
            <div
              className={`absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 transition-transform duration-1500 ease-in-out ${
                phase >= 2 ? 'translate-x-[200%]' : '-translate-x-[200%]'
              }`}
            />
          </div>
        </div>

        {/* ============================================================ */}
        {/* SCENE 4: BRAND TYPOGRAPHY & DESCRIPTOR REVEAL                */}
        {/* ============================================================ */}
        <div className="mt-6 flex flex-col items-center space-y-2.5">
          {/* Brand Name: WIHGO AI */}
          <div
            className={`flex items-center justify-center gap-2 transition-all duration-700 ease-out ${
              phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          >
            <span className="text-3xl sm:text-4xl font-black bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent font-extrabold tracking-tight">
              WIHG
            </span>
            <span className="text-3xl sm:text-4xl font-black bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent font-extrabold">
              O
            </span>
            <span className="ml-1.5 text-2xl sm:text-3xl font-black bg-gradient-to-r from-teal-400 to-teal-300 bg-clip-text text-transparent tracking-wider">
              AI
            </span>
          </div>

          {/* CONNECT HUB */}
          <div
            className={`flex items-center gap-2 transition-all duration-700 delay-150 ease-out ${
              phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
          >
            <div className="h-[1px] w-5 bg-gradient-to-r from-transparent to-teal-500/60" />
            <span className="text-[11px] sm:text-xs font-extrabold tracking-[0.3em] uppercase text-teal-300">
              CONNECT HUB
            </span>
            <div className="h-[1px] w-5 bg-gradient-to-l from-transparent to-teal-500/60" />
          </div>

          {/* SCENE 4: Connect • Collaborate • Achieve */}
          <div
            className={`pt-1 transition-all duration-800 ease-out ${
              phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          >
            <div className="text-[11px] sm:text-xs font-bold tracking-[0.24em] uppercase text-slate-200 bg-slate-900/80 px-4 py-1.5 rounded-full border border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.2)] backdrop-blur-sm flex items-center gap-2">
              <span className="text-teal-300">Connect</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-100">Collaborate</span>
              <span className="text-slate-500">•</span>
              <span className="text-teal-300">Achieve</span>
            </div>
          </div>
        </div>

        {/* Skip button for instant entry */}
        <button
          onClick={onComplete}
          className="mt-8 text-[11px] font-semibold text-slate-400 hover:text-teal-300 transition-colors uppercase tracking-widest px-3 py-1 cursor-pointer"
        >
          Skip &rarr;
        </button>
      </div>
    </div>
  );
};
