"use client";

import React from 'react';
import { Logo } from '../common/Logo';
import {
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  return (
    <div id="wihgo-splash-screen" className="fixed inset-0 z-50 bg-[#070A12] flex flex-col items-center justify-between p-6 overflow-hidden">
      {/* Background Glowing Network Nodes */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px]" />
        <svg className="w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20%" cy="30%" r="3" fill="#00F0FF" className="animate-ping" />
          <circle cx="80%" cy="40%" r="4" fill="#3B82F6" />
          <circle cx="50%" cy="70%" r="3" fill="#A855F7" />
          <line x1="20%" y1="30%" x2="50%" y2="70%" stroke="#00F0FF" strokeWidth="0.5" strokeDasharray="3 3" />
          <line x1="80%" y1="40%" x2="50%" y2="70%" stroke="#8B5CF6" strokeWidth="0.5" strokeDasharray="3 3" />
        </svg>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center z-10 max-w-sm mx-auto space-y-6">
        {/* Official Tri-Loop Logo */}
        <div className="animate-fade-in transition-all duration-700">
          <Logo size="xl" showText={false} />
        </div>

        {/* Title & Taglines */}
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            WIHGO <span className="text-cyan-400">AI</span>
          </h1>
          <div className="text-lg font-semibold tracking-wider text-indigo-300 uppercase">
            Connect Hub
          </div>
          <div className="text-xs font-bold text-cyan-400 tracking-[0.25em] uppercase pt-1">
            CONNECT. COLLABORATE. ACHIEVE.
          </div>
          <p className="text-sm text-slate-400 pt-2 font-medium">
            One hub. All your connections.
          </p>
        </div>

        {/* Pulse Orb */}
        <div className="relative py-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 p-0.5 animate-spin-slow shadow-[0_0_30px_rgba(0,240,255,0.4)]">
            <div className="w-full h-full bg-[#070A12] rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Entry Trigger */}
      <div className="w-full max-w-xs z-10 pb-6">
        <button
          id="btn-splash-enter-hub"
          onClick={onComplete}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] flex items-center justify-center gap-2 transition-all duration-300"
        >
          <span>Enter WIHGO Hub</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
