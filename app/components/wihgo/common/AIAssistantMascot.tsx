"use client";

import React from 'react';
import {
  Sparkles,
  MessageSquare,
  BarChart3,
  Bot,
  Send,
  Flame
} from 'lucide-react';

interface AIAssistantMascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showFloatingBubbles?: boolean;
  animated?: boolean;
  className?: string;
  statusText?: string;
}

export const AIAssistantMascot: React.FC<AIAssistantMascotProps> = ({
  size = 'md',
  showFloatingBubbles = true,
  animated = true,
  className = '',
  statusText
}) => {
  // Size dimensions
  const dimensions = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    xl: 'w-60 h-60'
  }[size];

  const eyeSize = {
    sm: 'w-2.5 h-2.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  }[size];

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* Floating Action Bubbles around Mascot */}
      {showFloatingBubbles && (
        <>
          <div className="absolute -top-3 left-0 bg-slate-900/90 border border-cyan-400/40 px-2.5 py-1.5 rounded-2xl text-[10px] font-bold text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-1.5 animate-bounce-slow z-20">
            <MessageSquare className="w-3 h-3 text-cyan-400" />
            <span>Messages</span>
          </div>

          <div className="absolute -top-2 right-0 bg-slate-900/90 border border-purple-400/40 px-2.5 py-1.5 rounded-2xl text-[10px] font-bold text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)] flex items-center gap-1.5 animate-pulse z-20">
            <BarChart3 className="w-3 h-3 text-purple-400" />
            <span>Analytics</span>
          </div>

          <div className="absolute -bottom-1 -left-2 bg-slate-900/90 border border-indigo-400/40 px-2.5 py-1.5 rounded-2xl text-[10px] font-bold text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)] flex items-center gap-1.5 z-20">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Content</span>
          </div>

          <div className="absolute -bottom-2 -right-2 bg-slate-900/90 border border-pink-400/40 px-2.5 py-1.5 rounded-2xl text-[10px] font-bold text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.3)] flex items-center gap-1.5 z-20">
            <Flame className="w-3 h-3 text-pink-400" />
            <span>Replies</span>
          </div>
        </>
      )}

      {/* Main Mascot Robot Container */}
      <div className={`relative ${dimensions} flex items-center justify-center`}>
        {/* Outer Glowing Neon Ring & Aura */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/20 via-indigo-600/30 to-purple-600/20 blur-xl ${animated ? 'animate-pulse' : ''}`} />
        <div className="absolute -inset-2 rounded-full border border-purple-500/30 border-dashed animate-spin-slow opacity-60" />

        {/* Robot Visual Head & Body Composite */}
        <div className="relative z-10 w-full h-full rounded-3xl bg-gradient-to-b from-indigo-950 via-[#0E1528] to-[#0A0D18] border-2 border-indigo-500/40 shadow-[0_0_35px_rgba(99,102,241,0.4)] p-3 flex flex-col items-center justify-between overflow-hidden">
          
          {/* Subtle Top Antennas/Ears */}
          <div className="w-full flex justify-between px-2 -mt-1 z-10">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 border border-white shadow-[0_0_10px_#00F0FF] animate-ping" />
            <div className="w-2.5 h-2.5 rounded-full bg-purple-400 border border-white shadow-[0_0_10px_#A855F7] animate-ping" />
          </div>

          {/* Robot Visor Screen */}
          <div className="w-full flex-1 bg-black/80 rounded-2xl border border-indigo-500/30 p-2 flex flex-col items-center justify-center relative my-1 shadow-inner">
            {/* Soft Cyan Glow inside visor */}
            <div className="absolute inset-2 bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-purple-500/10 rounded-xl blur-md" />

            {/* Glowing Eyes */}
            <div className="flex items-center gap-4 z-10 my-auto">
              {/* Left Eye */}
              <div className={`${eyeSize} rounded-full bg-cyan-400 shadow-[0_0_12px_#00F0FF] flex items-center justify-center transition-all ${animated ? 'animate-pulse' : ''}`}>
                <div className="w-1/3 h-1/3 rounded-full bg-white" />
              </div>

              {/* Right Eye */}
              <div className={`${eyeSize} rounded-full bg-cyan-400 shadow-[0_0_12px_#00F0FF] flex items-center justify-center transition-all ${animated ? 'animate-pulse' : ''}`}>
                <div className="w-1/3 h-1/3 rounded-full bg-white" />
              </div>
            </div>

            {/* Friendly Smiling Curved Mouth */}
            <div className="w-8 h-2 border-b-2 border-cyan-300 rounded-full z-10 mt-1 shadow-[0_0_8px_#00F0FF]" />
          </div>

          {/* Bottom Chest Indicator / Badge */}
          <div className="flex items-center justify-center gap-1 text-[9px] font-black text-cyan-300 uppercase tracking-widest pt-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>WihGo Mind</span>
          </div>
        </div>
      </div>

      {statusText && (
        <div className="mt-3 text-center">
          <span className="text-xs font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-400/20 px-3 py-1 rounded-full">
            {statusText}
          </span>
        </div>
      )}
    </div>
  );
};
