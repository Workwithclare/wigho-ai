"use client";

import React, { useState, useEffect, useRef } from 'react';
import { WihgoSymbol, Logo } from '../common/Logo';
import { 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Play, 
  Pause, 
  CheckCircle2, 
  Layers, 
  Clock, 
  Zap, 
  MessageSquare, 
  Brain, 
  TrendingUp, 
  Calendar, 
  Mail, 
  ShieldCheck, 
  Bell, 
  Sliders, 
  ChevronRight, 
  ExternalLink,
  Volume2,
  VolumeX,
  Maximize2
} from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

export type ExperienceStage = 'splash' | 'motion' | 'dashboard';

interface WihgoSplashMotionDashboardProps {
  initialStage?: ExperienceStage;
  autoPlaySequence?: boolean;
  onExit?: () => void;
}

export const WihgoSplashMotionDashboard: React.FC<WihgoSplashMotionDashboardProps> = ({
  initialStage = 'splash',
  autoPlaySequence = false,
  onExit
}) => {
  const [currentStage, setCurrentStage] = useState<ExperienceStage>(initialStage);
  const [motionPhase, setMotionPhase] = useState<number>(1);
  const [isMotionExiting, setIsMotionExiting] = useState<boolean>(false);
  const [motionSpeedMultiplier, setMotionSpeedMultiplier] = useState<number>(1); // 1x normal, 0.5x slow-mo
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'queue' | 'channels' | 'memory'>('queue');
  const [handledItems, setHandledItems] = useState<string[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Sound generator using Web Audio API
  const playAudioTone = (frequency: number, endFreq: number, duration: number, type: OscillatorType = 'sine') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (_) {}
  };

  const clearAllTimers = () => {
    timerRef.current.forEach(t => clearTimeout(t));
    timerRef.current = [];
  };

  // Launch motion sequence
  const startMotionSequence = () => {
    clearAllTimers();
    setCurrentStage('motion');
    setMotionPhase(1);
    setIsMotionExiting(false);
    playAudioTone(440, 880, 0.4);

    const baseDuration = 3000 * (1 / motionSpeedMultiplier);

    const t1 = setTimeout(() => {
      setMotionPhase(2);
      playAudioTone(523.25, 784, 0.35);
    }, 700 * (1 / motionSpeedMultiplier));

    const t2 = setTimeout(() => {
      setMotionPhase(3);
      playAudioTone(659.25, 1046.5, 0.4);
    }, 1600 * (1 / motionSpeedMultiplier));

    const t3 = setTimeout(() => {
      setIsMotionExiting(true);
    }, 2600 * (1 / motionSpeedMultiplier));

    const t4 = setTimeout(() => {
      setCurrentStage('dashboard');
      playAudioTone(880, 1320, 0.3);
    }, baseDuration);

    timerRef.current = [t1, t2, t3, t4];
  };

  useEffect(() => {
    if (autoPlaySequence) {
      startMotionSequence();
    }
    return () => clearAllTimers();
  }, [autoPlaySequence]);

  const handleToggleHandled = (id: string) => {
    setHandledItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
    playAudioTone(600, 900, 0.15);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#05070E] text-slate-100 font-sans selection:bg-teal-500 selection:text-black overflow-x-hidden flex flex-col">
      {/* Universal Deep Obsidian & Teal Atmospheric Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-gradient-to-b from-teal-500/15 via-[#0A2628]/20 to-transparent rounded-full blur-[150px]" />
        <div className="absolute -bottom-40 right-1/4 w-[700px] h-[500px] bg-slate-800/20 rounded-full blur-[160px]" />
        <div 
          className="absolute inset-0 opacity-[0.025]" 
          style={{
            backgroundImage: `radial-gradient(circle, #14B8A6 1px, transparent 1px)`,
            backgroundSize: '28px 28px'
          }}
        />
      </div>

      {/* Control Navigation Header Bar */}
      <header className="relative z-30 w-full border-b border-teal-500/20 bg-[#07090E]/90 backdrop-blur-md px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Sub-Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex-shrink-0">
              <WihgoSymbol className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-base font-black tracking-tight text-white">WIHGO</span>
                <span className="text-base font-black text-teal-400">AI</span>
                <span className="ml-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700">
                  CONNECT HUB
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold mt-0.5">
                W+O Silver Splash • Motion • Dashboard Master File
              </p>
            </div>
          </div>

          {/* Stage Switcher Controls */}
          <div className="flex items-center gap-1.5 bg-[#090D14] p-1 rounded-xl border border-teal-500/30">
            <button
              onClick={() => {
                clearAllTimers();
                setCurrentStage('splash');
                playAudioTone(440, 660, 0.2);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentStage === 'splash'
                  ? 'bg-teal-500 text-black shadow-[0_0_15px_rgba(20,184,166,0.5)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              1. Silver Splash
            </button>
            <button
              onClick={startMotionSequence}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                currentStage === 'motion'
                  ? 'bg-teal-500 text-black shadow-[0_0_15px_rgba(20,184,166,0.5)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Play className="w-3 h-3 fill-current" />
              2. Animation Motion
            </button>
            <button
              onClick={() => {
                clearAllTimers();
                setCurrentStage('dashboard');
                playAudioTone(600, 800, 0.2);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentStage === 'dashboard'
                  ? 'bg-teal-500 text-black shadow-[0_0_15px_rgba(20,184,166,0.5)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              3. Dashboard
            </button>
          </div>

          {/* Sound & Exit Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(prev => !prev)}
              className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300 hover:text-teal-300 transition-colors"
              title={soundEnabled ? 'Mute Chimes' : 'Enable Chimes'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {onExit && (
              <button
                onClick={onExit}
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-colors"
              >
                Return to Hub
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Experience Body */}
      <main className="relative z-10 flex-1 flex flex-col">
        {/* ========================================================================= */}
        {/* VIEW 1: THE W+O SILVER SPLASH SCREEN                                     */}
        {/* ========================================================================= */}
        {currentStage === 'splash' && (
          <div className="flex-1 flex flex-col items-center justify-between p-6 sm:p-10 min-h-[calc(100vh-70px)] animate-fade-in">
            {/* Ambient Background Nodes */}
            <div className="w-full flex justify-end">
              <span className="text-[11px] font-bold text-teal-400/80 tracking-widest uppercase px-3 py-1 rounded-full bg-teal-950/40 border border-teal-500/20">
                LOCKED DESIGN SOURCE OF TRUTH
              </span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
              {/* WIHGO W + Metallic Silver Orb Logo */}
              <div className="relative group cursor-pointer" onClick={startMotionSequence}>
                <div className="w-36 h-36 sm:w-44 sm:h-44 transition-transform duration-500 hover:scale-105 filter drop-shadow-[0_0_35px_rgba(13,148,136,0.55)]">
                  <WihgoSymbol className="w-full h-full" />
                </div>
                {/* Luminous Pulsing Ring */}
                <div className="absolute inset-0 rounded-full border border-teal-400/30 animate-ping pointer-events-none -m-3" />
              </div>

              {/* Title, Subheading & Taglines */}
              <div className="space-y-2.5">
                <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight flex items-center justify-center gap-2">
                  <span>WIHGO</span>
                  <span className="text-teal-400">AI</span>
                </h1>
                
                <div className="text-sm sm:text-base font-extrabold tracking-[0.25em] text-teal-300 uppercase">
                  CONNECT HUB
                </div>
                
                <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-sm mx-auto">
                  Your AI-Powered Business Memory & Operations Hub with Attention Platform
                </p>

                {/* Approved Tagline */}
                <div className="pt-2">
                  <span className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase text-slate-200 bg-slate-900/90 px-4 py-1.5 rounded-full border border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                    <span className="text-teal-300">CONNECT</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-100">COLLABORATE</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-teal-300">ACHIEVE</span>
                  </span>
                </div>
              </div>

              {/* Brand Motto */}
              <div className="text-xs text-slate-400 italic">
                &ldquo;Business memory, business momentum.&rdquo;
              </div>
            </div>

            {/* Launch Action */}
            <div className="w-full max-w-xs space-y-3 pb-4">
              <button
                onClick={startMotionSequence}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-teal-500 via-teal-600 to-teal-500 text-black font-extrabold text-sm tracking-wide shadow-[0_0_30px_rgba(13,148,136,0.45)] hover:shadow-[0_0_45px_rgba(13,148,136,0.7)] flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              >
                <span>Trigger Motion & Enter Dashboard</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>

              <button
                onClick={() => setCurrentStage('dashboard')}
                className="w-full py-2.5 text-xs text-slate-400 hover:text-teal-300 font-bold uppercase tracking-wider transition-colors"
              >
                Skip Directly to Dashboard &rarr;
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: ANIMATION MOTION SEQUENCE (4-PHASE CINEMATIC PIPELINE)          */}
        {/* ========================================================================= */}
        {currentStage === 'motion' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[calc(100vh-70px)] relative overflow-hidden">
            {/* Phase Progress Indicator */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-full border border-teal-500/20 backdrop-blur-md">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Phase {motionPhase}/4:
              </span>
              <span className="text-[11px] font-extrabold text-teal-300 uppercase tracking-wider">
                {motionPhase === 1 && '1. W Logo & Metallic Silver Glint'}
                {motionPhase === 2 && '2. Converging Interlocking Rings'}
                {motionPhase === 3 && '3. AI Network Active Nodes'}
                {motionPhase === 4 && '4. Transitioning to Dashboard'}
              </span>
            </div>

            {/* Main Motion Canvas */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center my-6">
              {/* Converging & Interlocking Silver Rings */}
              <svg
                viewBox="0 0 320 320"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 w-full h-full pointer-events-none"
              >
                <defs>
                  <linearGradient id="showcaseRingSilver" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="30%" stopColor="#CBD5E1" />
                    <stop offset="70%" stopColor="#F8FAFC" />
                    <stop offset="100%" stopColor="#94A3B8" />
                  </linearGradient>

                  <linearGradient id="showcaseRingTeal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0D9488" />
                    <stop offset="50%" stopColor="#14B8A6" />
                    <stop offset="100%" stopColor="#2DD4BF" />
                  </linearGradient>

                  <radialGradient id="showcasePulseNode" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="60%" stopColor="#2DD4BF" />
                    <stop offset="100%" stopColor="#0D9488" />
                  </radialGradient>
                </defs>

                {/* Orbit Ring 1 — Converging Silver */}
                <g
                  className={`transition-all duration-1000 ease-out origin-center ${
                    motionPhase === 1
                      ? 'opacity-0 -translate-x-12 -translate-y-12 scale-75'
                      : 'opacity-85 translate-x-0 translate-y-0 scale-100'
                  }`}
                >
                  <ellipse
                    cx="160"
                    cy="160"
                    rx="120"
                    ry="55"
                    transform="rotate(-28 160 160)"
                    stroke="url(#showcaseRingSilver)"
                    strokeWidth={motionPhase >= 3 ? '2' : '1.5'}
                    strokeDasharray={motionPhase >= 3 ? '12 4' : 'none'}
                    className="transition-all duration-700"
                  />
                </g>

                {/* Orbit Ring 2 — Converging Deep Teal */}
                <g
                  className={`transition-all duration-1000 ease-out origin-center delay-150 ${
                    motionPhase === 1
                      ? 'opacity-0 translate-x-12 translate-y-12 scale-75'
                      : 'opacity-85 translate-x-0 translate-y-0 scale-100'
                  }`}
                >
                  <ellipse
                    cx="160"
                    cy="160"
                    rx="120"
                    ry="55"
                    transform="rotate(32 160 160)"
                    stroke="url(#showcaseRingTeal)"
                    strokeWidth={motionPhase >= 3 ? '2' : '1.5'}
                    strokeDasharray={motionPhase >= 3 ? '16 6 4 6' : 'none'}
                    className="transition-all duration-700"
                  />
                </g>

                {/* Orbit Ring 3 — Central Circular Ring */}
                <g
                  className={`transition-all duration-1000 ease-out origin-center ${
                    motionPhase === 1
                      ? 'opacity-0 scale-50'
                      : 'opacity-90 scale-100'
                  }`}
                >
                  <circle
                    cx="160"
                    cy="160"
                    r="115"
                    stroke="url(#showcaseRingSilver)"
                    strokeWidth="1.5"
                    strokeDasharray={motionPhase >= 3 ? '20 6' : '8 4'}
                    strokeOpacity="0.75"
                  />
                </g>

                {/* Live Synaptic Nodes */}
                {motionPhase >= 3 && (
                  <g className="animate-in fade-in duration-700">
                    <circle cx="160" cy="45" r="5" fill="url(#showcasePulseNode)" stroke="#F8FAFC" strokeWidth="1" />
                    <circle cx="160" cy="45" r="9" stroke="#2DD4BF" strokeWidth="1" strokeOpacity="0.7" className="animate-ping" />

                    <circle cx="160" cy="275" r="5" fill="url(#showcasePulseNode)" stroke="#F8FAFC" strokeWidth="1" />
                    <circle cx="160" cy="275" r="9" stroke="#2DD4BF" strokeWidth="1" strokeOpacity="0.7" className="animate-ping" />

                    <circle cx="45" cy="160" r="4.5" fill="url(#showcasePulseNode)" stroke="#CBD5E1" strokeWidth="1" />
                    <circle cx="275" cy="160" r="4.5" fill="url(#showcasePulseNode)" stroke="#CBD5E1" strokeWidth="1" />

                    <circle cx="82" cy="102" r="3.5" fill="#CBD5E1" />
                    <circle cx="238" cy="218" r="3.5" fill="#2DD4BF" />
                  </g>
                )}
              </svg>

              {/* Central W + Silver Orb */}
              <div
                className={`relative z-20 w-44 h-44 sm:w-52 sm:h-52 filter drop-shadow-[0_0_35px_rgba(13,148,136,0.65)] transition-all duration-1000 ease-out ${
                  motionPhase >= 1 ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-4'
                }`}
              >
                <WihgoSymbol className="w-full h-full" />
                {/* Light Sweep */}
                <div
                  className={`absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/15 to-transparent transform -skew-x-12 transition-transform duration-1500 ease-in-out ${
                    motionPhase >= 2 ? 'translate-x-[200%]' : '-translate-x-[200%]'
                  }`}
                />
              </div>
            </div>

            {/* Motion Sequence Typography */}
            <div className="flex flex-col items-center space-y-2.5 text-center mt-2">
              <div
                className={`flex items-center justify-center gap-2 transition-all duration-700 ease-out ${
                  motionPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`}
              >
                <span className="text-3xl sm:text-4xl font-black bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent tracking-tight">
                  WIHG
                </span>
                <span className="text-3xl sm:text-4xl font-black bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  O
                </span>
                <span className="ml-1.5 text-2xl sm:text-3xl font-black bg-gradient-to-r from-teal-400 to-teal-300 bg-clip-text text-transparent tracking-wider">
                  AI
                </span>
              </div>

              <div
                className={`flex items-center gap-2 transition-all duration-700 delay-150 ease-out ${
                  motionPhase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <div className="h-[1px] w-6 bg-gradient-to-r from-transparent to-teal-500/60" />
                <span className="text-xs font-extrabold tracking-[0.3em] uppercase text-teal-300">
                  CONNECT HUB
                </span>
                <div className="h-[1px] w-6 bg-gradient-to-l from-transparent to-teal-500/60" />
              </div>

              <div
                className={`pt-1 transition-all duration-800 ease-out ${
                  motionPhase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`}
              >
                <div className="text-xs font-bold tracking-[0.24em] uppercase text-slate-200 bg-slate-900/90 px-4 py-1.5 rounded-full border border-teal-500/30 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                  <span className="text-teal-300">Connect</span>
                  <span className="text-slate-500 mx-1.5">•</span>
                  <span className="text-slate-100">Collaborate</span>
                  <span className="text-slate-500 mx-1.5">•</span>
                  <span className="text-teal-300">Achieve</span>
                </div>
              </div>
            </div>

            {/* Motion Playback Controls */}
            <div className="flex items-center gap-3 mt-8">
              <button
                onClick={startMotionSequence}
                className="px-4 py-2 rounded-xl bg-slate-800/80 border border-teal-500/30 text-xs font-bold text-teal-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Replay Animation
              </button>

              <button
                onClick={() => {
                  clearAllTimers();
                  setCurrentStage('dashboard');
                }}
                className="px-5 py-2 rounded-xl bg-teal-500 text-black text-xs font-extrabold hover:bg-teal-400 flex items-center gap-1.5 shadow-[0_0_20px_rgba(20,184,166,0.4)] transition-all"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: THE COMPLETE EXECUTIVE DASHBOARD                                 */}
        {/* ========================================================================= */}
        {currentStage === 'dashboard' && (
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 animate-fade-in">
            {/* Executive Welcome Bar with Replay Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#0C121E] via-[#09151F] to-[#0A1A24] border border-teal-500/25 shadow-xl">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                    WihGo Mind Attention Platform • Active
                  </span>
                </div>
                <h2 className="text-2xl font-black text-white mt-1">
                  Executive Operations Hub
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  Business memory, business momentum. Real-time attention score: <span className="text-teal-300 font-bold">94/100</span>
                </p>
              </div>

              {/* Quick Sequence Triggers */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentStage('splash')}
                  className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-xs font-bold text-slate-200 hover:border-teal-500/50 hover:text-teal-300 transition-all flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  View Silver Splash
                </button>
                <button
                  onClick={startMotionSequence}
                  className="px-4 py-2 rounded-xl bg-teal-500/20 border border-teal-500 text-xs font-extrabold text-teal-300 hover:bg-teal-500 hover:text-black transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(20,184,166,0.3)]"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Run Motion Sequence
                </button>
              </div>
            </div>

            {/* 4 Core Executive Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#090D16] border border-teal-500/20 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Connected Channels</span>
                  <Layers className="w-4 h-4 text-teal-400" />
                </div>
                <div className="text-2xl font-black text-white mt-2">10 Channels</div>
                <p className="text-[11px] text-teal-300 font-medium mt-1">Gmail live sync active</p>
              </div>

              <div className="p-4 rounded-xl bg-[#090D16] border border-teal-500/20 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Attention Queue</span>
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-amber-300 mt-2">3 Items</div>
                <p className="text-[11px] text-slate-400 font-medium mt-1">1 P0 Critical • 2 P1 High</p>
              </div>

              <div className="p-4 rounded-xl bg-[#090D16] border border-teal-500/20 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Business Memory</span>
                  <Brain className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-black text-white mt-2">24 Rules</div>
                <p className="text-[11px] text-indigo-300 font-medium mt-1">Episodic & semantic cache</p>
              </div>

              <div className="p-4 rounded-xl bg-[#090D16] border border-teal-500/20 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">SLA Response Pace</span>
                  <TrendingUp className="w-4 h-4 text-teal-400" />
                </div>
                <div className="text-2xl font-black text-teal-300 mt-2">18m Avg</div>
                <p className="text-[11px] text-slate-400 font-medium mt-1">+42% velocity improvement</p>
              </div>
            </div>

            {/* Attention Queue & Omnichannel Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column (2 cols): WihGo Mind 4-Vector Attention Queue */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-teal-400" />
                    <h3 className="text-lg font-bold text-white">WihGo Mind Priority Queue</h3>
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Sorted by 4-Vector Score
                  </span>
                </div>

                {/* Attention Items */}
                <div className="space-y-3">
                  {/* Item 1 - P0 Critical */}
                  <div className={`p-4 rounded-xl border transition-all ${
                    handledItems.includes('item-1')
                      ? 'bg-slate-900/40 border-slate-800 opacity-60'
                      : 'bg-[#0A101C] border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                          P0 Critical
                        </span>
                        <span className="text-xs font-bold text-slate-300">Score: 96/100</span>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-xs text-teal-400 font-medium">SLA: 35 mins remaining</span>
                      </div>
                      <button
                        onClick={() => handleToggleHandled('item-1')}
                        className={`p-1.5 rounded-lg border text-xs font-bold transition-colors ${
                          handledItems.includes('item-1')
                            ? 'bg-teal-500 text-black border-teal-500'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-white mt-2">
                      Enterprise Proposal Confirmation — Sarah Jenkins (Apex Capital)
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Received via Gmail: Client ready to sign annual SLA. Requires commercial scope sign-off before 12:00 PM EST.
                    </p>

                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800/80">
                      <button 
                        onClick={() => handleToggleHandled('item-1')}
                        className="px-3 py-1.5 rounded-lg bg-teal-500 text-black text-xs font-extrabold hover:bg-teal-400 transition-colors"
                      >
                        {handledItems.includes('item-1') ? 'Mark Unhandled' : 'Approve AI Draft & Send'}
                      </button>
                      <button className="px-3 py-1.5 rounded-lg bg-slate-800/80 text-slate-300 text-xs font-bold hover:text-white transition-colors">
                        Snooze 1h
                      </button>
                    </div>
                  </div>

                  {/* Item 2 - P1 High */}
                  <div className={`p-4 rounded-xl border transition-all ${
                    handledItems.includes('item-2')
                      ? 'bg-slate-900/40 border-slate-800 opacity-60'
                      : 'bg-[#0A101C] border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.08)]'
                  }`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          P1 High
                        </span>
                        <span className="text-xs font-bold text-slate-300">Score: 84/100</span>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-xs text-slate-400 font-medium">SLA: 2 hours</span>
                      </div>
                      <button
                        onClick={() => handleToggleHandled('item-2')}
                        className={`p-1.5 rounded-lg border text-xs font-bold transition-colors ${
                          handledItems.includes('item-2')
                            ? 'bg-teal-500 text-black border-teal-500'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-white mt-2">
                      Inbound WhatsApp Partnership Request — Marcus Vance
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Received via WhatsApp: &ldquo;We want to integrate WIHGO across 12 branch locations next week.&rdquo;
                    </p>

                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800/80">
                      <button 
                        onClick={() => handleToggleHandled('item-2')}
                        className="px-3 py-1.5 rounded-lg bg-teal-500/20 border border-teal-500 text-teal-300 text-xs font-extrabold hover:bg-teal-500 hover:text-black transition-colors"
                      >
                        Review WhatsApp Thread
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (1 col): Omnichannel Status & Business Memory */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-teal-400" />
                    <h3 className="text-lg font-bold text-white">Connected Channels</h3>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#090D16] border border-teal-500/20 space-y-3">
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-red-400" />
                      <span className="text-xs font-bold text-slate-200">Gmail Workspace</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      Connected
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <WhatsAppIcon className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-slate-200">WhatsApp Business</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      Coming Soon
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-bold text-slate-200">Google Calendar</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      Live Sync
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2.5">
                      <MessageSquare className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-bold text-slate-200">Slack & LinkedIn</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      Phase 3
                    </span>
                  </div>
                </div>

                {/* Business Memory Snapshot */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#09101C] to-[#0A1620] border border-indigo-500/20 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                      Active Business Memory
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium">
                    &ldquo;Never offer discounts over 15% without Clare&apos;s explicit confirmation. Sarah prefers morning Slack or email updates.&rdquo;
                  </p>
                  <div className="pt-1 flex items-center gap-2 text-[10px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                    <span>Private single-user memory • Encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
