"use client";

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Bot,
  MessageSquare,
  Mail,
  Camera,
  ThumbsUp,
  Music2,
  Briefcase,
  Globe,
  ChevronRight,
  Send,
  Workflow,
  Layers,
  CheckCircle2,
  ShieldCheck,
  Zap,
  BarChart3
} from 'lucide-react';
import { Logo, WihgoSymbol } from '../common/Logo';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { AIAssistantMascot } from '../common/AIAssistantMascot';

// Custom X (Twitter) icon
const XTwitterIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface OpeningExperienceProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onCreateAccount: () => void;
  onSkip?: () => void;
}

export const OpeningExperience: React.FC<OpeningExperienceProps> = ({
  onGetStarted,
  onSignIn,
  onCreateAccount,
  onSkip
}) => {
  // Step 0 = Screen 1 (Brand Splash), 1 = Screen 2 (AI Smart Assistant), 
  // 2 = Screen 3 (Connect Social Media), 3 = Screen 4 (Platform Integrations), 4 = Screen 5 (AI Co-Pilot / Get Started)
  const [currentStep, setCurrentStep] = useState<number>(() => {
    try {
      const saved = sessionStorage.getItem('wihgo_onboarding_current_step');
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 4) return parsed;
      }
    } catch {}
    return 0;
  });

  // Save current step to session storage for seamless persistence without remount glitches
  useEffect(() => {
    try {
      sessionStorage.setItem('wihgo_onboarding_current_step', currentStep.toString());
    } catch {}
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      onGetStarted();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Rule 5: Skip -> Screen 5 (index 4)
  const handleSkipToFinal = () => {
    setCurrentStep(4);
  };

  return (
    <div
      id="wihgo-opening-experience"
      className="fixed inset-0 z-50 bg-[#070B0D] text-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-8 overflow-y-auto overflow-x-hidden selection:bg-teal-500 selection:text-black"
    >
      {/* Dark Futuristic Ambient Background with Deep Teal Radial Lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[760px] h-[540px] bg-gradient-to-b from-teal-500/15 via-[#0A2628]/20 to-transparent rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 right-1/4 w-[640px] h-[520px] bg-slate-800/20 rounded-full blur-[150px]" />
        <div className="absolute top-1/3 -left-32 w-88 h-88 bg-teal-900/15 rounded-full blur-[130px]" />

        {/* Micro-dot grid background pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `radial-gradient(#14B8A6 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }} 
        />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-xl mx-auto flex items-center justify-between py-2">
        {/* Brand Logo on Top Left for Screens 2-5, minimal on Screen 1 */}
        <div className="flex items-center gap-2">
          {currentStep > 0 ? (
            <button 
              onClick={() => setCurrentStep(0)} 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer text-left"
              title="Return to WIHGO Brand Intro"
            >
              <Logo size="sm" showText={true} />
            </button>
          ) : (
            <div className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
              WIHGO AI
            </div>
          )}
        </div>

        {/* Top Right Action (Skip) */}
        <div className="flex items-center gap-2">
          {/* Top Skip Button for Screens 2 and 3 */}
          {(currentStep === 1 || currentStep === 2) && (
            <button
              id="btn-intro-skip-top"
              onClick={handleSkipToFinal}
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-900/60 transition-colors cursor-pointer"
            >
              Skip
            </button>
          )}
        </div>
      </header>

      {/* Main Experience Container */}
      <main className="relative z-10 my-auto py-4 max-w-xl mx-auto w-full flex flex-col items-center justify-center">
        
        {/* ============================================================ */}
        {/* SCREEN 1 — WIHGO AI BRAND & WELCOME SCREEN                   */}
        {/* ============================================================ */}
        {currentStep === 0 && (
          <div className="w-full text-center space-y-6 animate-in fade-in zoom-in-95 duration-500 py-4 flex flex-col items-center justify-center">
            {/* Prominent Official WIHGO W + Interconnected Ring Brand Mark */}
            <div className="relative inline-flex items-center justify-center p-2">
              {/* Outer Glow Halo */}
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/25 via-teal-700/35 to-slate-400/25 rounded-full blur-3xl animate-pulse" />
              
              <div className="relative z-10 w-36 h-36 sm:w-44 sm:h-44 filter drop-shadow-[0_0_40px_rgba(13,148,136,0.55)]">
                <WihgoSymbol className="w-full h-full transform hover:scale-105 transition-transform duration-500" />
              </div>
            </div>

            {/* Typography & Brand Hierarchy */}
            <div className="space-y-2.5 max-w-lg mx-auto">
              {/* WIHGO AI */}
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight flex items-center leading-none">
                  <span className="bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent font-extrabold">
                    WIHG
                  </span>
                  <span className="bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent font-extrabold">
                    O
                  </span>
                </h1>
                <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-teal-400 to-teal-300 bg-clip-text text-transparent tracking-wider self-center">
                  AI
                </span>
              </div>

              {/* CONNECT HUB */}
              <div className="flex items-center justify-center gap-3">
                <div className="h-[1px] w-6 bg-gradient-to-r from-transparent to-teal-500/60" />
                <span className="text-xs font-extrabold tracking-[0.28em] uppercase text-teal-300">
                  CONNECT HUB
                </span>
                <div className="h-[1px] w-6 bg-gradient-to-l from-transparent to-teal-500/60" />
              </div>

              {/* Primary Message */}
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight pt-1">
                Your AI-Powered Business memory & Operations hub with attention platform
              </h2>

              {/* Supporting Message */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-md mx-auto">
                Connect your business communication, productivity tools and services in one intelligent workspace.
              </p>
            </div>

            {/* Primary (Get Started) & Secondary (Sign In) Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm mx-auto">
              <button
                id="btn-welcome-get-started"
                onClick={onGetStarted}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 text-black text-sm font-black shadow-[0_0_30px_rgba(13,148,136,0.45)] hover:shadow-[0_0_40px_rgba(13,148,136,0.65)] hover:scale-[1.02] active:scale-[0.98] border border-teal-300/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </button>

              <button
                id="btn-welcome-signin"
                onClick={onSignIn}
                className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white text-sm font-bold border border-slate-700 hover:border-teal-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Sign In</span>
              </button>
            </div>

            {/* Guided Tour Link */}
            <div className="pt-1">
              <button
                onClick={() => setCurrentStep(1)}
                className="text-[11px] font-semibold text-slate-400 hover:text-teal-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Learn how WIHGO works</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SCREEN 2 — AI SMART ASSISTANT (Matches Reference Image 3) */}
        {/* ============================================================ */}
        {currentStep === 1 && (
          <div className="w-full text-center space-y-6 animate-in fade-in slide-in-from-right-4 duration-400 py-2 flex flex-col items-center">
            
            {/* Centered AI Robot Assistant Illustration */}
            <div className="relative inline-flex items-center justify-center pt-2">
              <AIAssistantMascot size="lg" showFloatingBubbles={true} animated={true} />
            </div>

            {/* Teal/Silver Circle Badge with Number '2' */}
            <div className="pt-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-600 to-teal-800 text-white font-black text-sm flex items-center justify-center shadow-[0_0_15px_rgba(13,148,136,0.4)] border border-teal-400/40 mx-auto">
                2
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                AI Smart Assistant
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                Let AI summarize messages, suggest replies, and generate content for you.
              </p>
            </div>

            {/* Bottom Row Navigation: Back, Pagination Dots, Round Teal Next Button */}
            <div className="w-full pt-8 flex items-center justify-between px-2">
              {/* Back button */}
              <button
                id="btn-screen2-back"
                onClick={handleBack}
                className="p-3 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
                title="Previous screen"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              {/* 5 Pagination Dots */}
              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3, 4].map((stepIdx) => (
                  <button
                    key={stepIdx}
                    onClick={() => setCurrentStep(stepIdx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      currentStep === stepIdx
                        ? 'w-6 bg-gradient-to-r from-teal-400 to-slate-200'
                        : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                    }`}
                    aria-label={`Go to screen ${stepIdx + 1}`}
                  />
                ))}
              </div>

              {/* Floating Teal Round Next Button */}
              <button
                id="btn-screen2-next"
                onClick={handleNext}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-[0_0_20px_rgba(13,148,136,0.5)] border border-teal-400/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                title="Next"
              >
                <ArrowRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SCREEN 3 — CONNECT ALL YOUR SOCIAL MEDIA (Matches Reference Image 5) */}
        {/* ============================================================ */}
        {currentStep === 2 && (
          <div className="w-full text-center space-y-6 animate-in fade-in slide-in-from-right-4 duration-400 py-2 flex flex-col items-center">
            
            {/* Centered Orbit Sphere with Social Media Platforms */}
            <div className="relative w-56 h-56 flex items-center justify-center mx-auto my-2">
              {/* Radial Orbit Line Rings */}
              <div className="absolute inset-0 rounded-full border border-teal-500/20 border-dashed animate-spin-slow" />
              <div className="absolute inset-4 rounded-full border border-slate-600/30" />
              
              {/* Central Glowing Dark Core Sphere */}
              <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-tr from-teal-950 via-slate-900 to-[#070B0D] border-2 border-teal-500/50 shadow-[0_0_30px_rgba(13,148,136,0.5)] flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-teal-300 animate-pulse" />
              </div>

              {/* Orbiting Platform Icons in Curved Array */}
              {/* Top: AI Connector */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 p-2.5 rounded-2xl bg-slate-900 border border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                <Sparkles className="w-5 h-5 text-teal-400" />
              </div>

              {/* Top Right: WhatsApp */}
              <div className="absolute top-2 right-2 p-2.5 rounded-2xl bg-slate-900 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <WhatsAppIcon className="w-5 h-5 text-emerald-400" />
              </div>

              {/* Right: TikTok */}
              <div className="absolute top-1/2 -translate-y-1/2 right-0 p-2.5 rounded-2xl bg-slate-900 border border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                <Music2 className="w-5 h-5 text-teal-300" />
              </div>

              {/* Bottom Right: X / Twitter */}
              <div className="absolute bottom-2 right-4 p-2.5 rounded-2xl bg-slate-900 border border-slate-700 shadow-md">
                <XTwitterIcon className="w-4 h-4 text-slate-300" />
              </div>

              {/* Bottom: ThumbsUp */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 p-2.5 rounded-2xl bg-slate-900 border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <ThumbsUp className="w-5 h-5 text-blue-400" />
              </div>

              {/* Bottom Left: X / Messenger */}
              <div className="absolute bottom-2 left-4 p-2.5 rounded-2xl bg-slate-900 border border-teal-600/50 shadow-[0_0_15px_rgba(13,148,136,0.3)]">
                <XTwitterIcon className="w-4 h-4 text-teal-400" />
              </div>

              {/* Left: Camera */}
              <div className="absolute top-1/2 -translate-y-1/2 left-0 p-2.5 rounded-2xl bg-slate-900 border border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                <Camera className="w-5 h-5 text-pink-400" />
              </div>
            </div>

            {/* Teal Circle Badge with Number '1' */}
            <div className="pt-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-600 to-teal-800 text-white font-black text-sm flex items-center justify-center shadow-[0_0_15px_rgba(13,148,136,0.4)] border border-teal-400/40 mx-auto">
                1
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Connect All Your Social Media
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                Link Camera, WhatsApp, TikTok, X, and ThumbsUp in one place.
              </p>
            </div>

            {/* Bottom Row Navigation: Back, Pagination Dots, Round Teal Next Button */}
            <div className="w-full pt-8 flex items-center justify-between px-2">
              <button
                id="btn-screen3-back"
                onClick={handleBack}
                className="p-3 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
                title="Previous screen"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3, 4].map((stepIdx) => (
                  <button
                    key={stepIdx}
                    onClick={() => setCurrentStep(stepIdx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      currentStep === stepIdx
                        ? 'w-6 bg-gradient-to-r from-teal-400 to-slate-200'
                        : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                    }`}
                    aria-label={`Go to screen ${stepIdx + 1}`}
                  />
                ))}
              </div>

              <button
                id="btn-screen3-next"
                onClick={handleNext}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-[0_0_20px_rgba(13,148,136,0.5)] border border-teal-400/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                title="Next"
              >
                <ArrowRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SCREEN 4 — PLATFORM INTEGRATIONS (Matches Reference Image 2) */}
        {/* ============================================================ */}
        {currentStep === 3 && (
          <div className="w-full space-y-6 animate-in fade-in slide-in-from-right-4 duration-400 text-center">
            
            {/* Header Pill & Titles */}
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[10px] font-bold uppercase tracking-wider">
                <Globe className="w-3 h-3 text-teal-400" />
                <span>PLATFORM INTEGRATIONS</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Connect your business platforms.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-md mx-auto">
                Bring all your communication channels together into a single secure stream.
              </p>
            </div>

            {/* 2-Column Grid Layout matching Reference Image 2 */}
            <div className="grid grid-cols-2 gap-3 pt-2 max-w-lg mx-auto text-center">
              {[
                { name: 'WhatsApp', icon: <WhatsAppIcon className="w-5 h-5 text-emerald-400" />, desc: 'Business Messaging' },
                { name: 'Instagram', icon: <Camera className="w-5 h-5 text-pink-400" />, desc: 'DMs & Post Inquiries' },
                { name: 'Facebook', icon: <ThumbsUp className="w-5 h-5 text-blue-400" />, desc: 'Page Messenger' },
                { name: 'TikTok', icon: <Music2 className="w-5 h-5 text-teal-400" />, desc: 'Direct Messages' },
                { name: 'LinkedIn', icon: <Briefcase className="w-5 h-5 text-sky-400" />, desc: 'Professional InMail' },
                { name: 'Gmail', icon: <Mail className="w-5 h-5 text-rose-400" />, desc: 'Workspace Inbox' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#090D10]/90 border border-slate-800/90 hover:border-teal-500/30 flex flex-col items-center justify-center space-y-1.5 transition-all shadow-sm"
                >
                  <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 shadow-inner">
                    {item.icon}
                  </div>
                  <div className="text-sm font-bold text-white leading-tight">{item.name}</div>
                  <div className="text-[10px] text-slate-400">{item.desc}</div>
                </div>
              ))}
            </div>

            {/* Controls matching Reference Image 2: [Back] [Skip] [Continue >] */}
            <div className="pt-4 flex items-center justify-between gap-3 max-w-lg mx-auto">
              {/* Back Button */}
              <button
                id="btn-screen4-back"
                onClick={handleBack}
                className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              {/* Center Skip */}
              <button
                id="btn-screen4-skip"
                onClick={handleSkipToFinal}
                className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                Skip
              </button>

              {/* Continue > Gradient Button */}
              <button
                id="btn-screen4-continue"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 text-white text-xs font-bold shadow-[0_0_20px_rgba(13,148,136,0.3)] hover:shadow-[0_0_25px_rgba(13,148,136,0.5)] border border-teal-400/30 hover:scale-[1.02] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* 5 Pagination Dots */}
            <div className="pt-4 flex items-center justify-center gap-1.5">
              {[0, 1, 2, 3, 4].map((stepIdx) => (
                <button
                  key={stepIdx}
                  onClick={() => setCurrentStep(stepIdx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentStep === stepIdx
                      ? 'w-6 bg-gradient-to-r from-teal-400 to-slate-200'
                      : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to screen ${stepIdx + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SCREEN 5 — WHIGO AI CO-PILOT / GET STARTED (Matches Reference Image 4) */}
        {/* ============================================================ */}
        {currentStep === 4 && (
          <div className="w-full space-y-5 animate-in fade-in slide-in-from-right-4 duration-400 text-center max-w-lg mx-auto">
            
            {/* Centered Glowing WIHGO AI Robot Screen Card */}
            <div className="relative inline-flex items-center justify-center mx-auto">
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-b from-teal-950 via-[#091416] to-slate-950 border border-teal-500/40 p-2.5 shadow-[0_0_35px_rgba(13,148,136,0.35)] flex flex-col items-center justify-between">
                {/* Robot Top Lights */}
                <div className="w-full flex justify-between px-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400/40" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400/40" />
                </div>

                {/* Robot Visor Glowing Screen */}
                <div className="w-full flex-1 bg-black/90 rounded-xl border border-teal-500/30 flex flex-col items-center justify-center p-1 my-1 shadow-inner">
                  {/* Glowing Eyes */}
                  <div className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded-full bg-teal-400 shadow-[0_0_10px_#14B8A6] animate-pulse" />
                    <div className="w-3.5 h-3.5 rounded-full bg-teal-400 shadow-[0_0_10px_#14B8A6] animate-pulse" />
                  </div>
                  {/* Mouth */}
                  <div className="w-6 h-1 bg-teal-300/80 rounded-full mt-1.5" />
                </div>

                {/* Card Tag: ✨ WIHGO AI */}
                <div className="text-[9px] font-black text-teal-300 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-teal-400" />
                  <span>WIHGO AI</span>
                </div>
              </div>
            </div>

            {/* Pill Badge: ✨ AI CO-PILOT */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-teal-400" />
                <span>AI CO-PILOT</span>
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-1 max-w-md mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Let WIHGO AI help you work smarter.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                Instant smart reply suggestions, conversation summaries, agenda scheduling, and intelligent business task routing.
              </p>
            </div>

            {/* 3 Horizontal Stacked Cards */}
            <div className="space-y-2.5 text-left pt-1">
              {/* Card 1: Smart Replies */}
              <div className="p-3.5 rounded-2xl bg-[#090D10]/90 border border-slate-800/90 shadow-sm space-y-1 hover:border-teal-500/30 transition-all">
                <div className="flex items-center gap-2 text-teal-400 font-bold text-xs">
                  <Send className="w-3.5 h-3.5" />
                  <span>Smart Replies</span>
                </div>
                <p className="text-xs text-slate-300 font-normal">
                  Instant context-aware responses tailored to your brand voice.
                </p>
              </div>

              {/* Card 2: Summaries */}
              <div className="p-3.5 rounded-2xl bg-[#090D10]/90 border border-slate-800/90 shadow-sm space-y-1 hover:border-slate-700 transition-all">
                <div className="flex items-center gap-2 text-slate-300 font-bold text-xs">
                  <Layers className="w-3.5 h-3.5 text-teal-400" />
                  <span>Summaries</span>
                </div>
                <p className="text-xs text-slate-300 font-normal">
                  One-click digestible recaps of multi-turn customer dialogues.
                </p>
              </div>

              {/* Card 3: Task Sync */}
              <div className="p-3.5 rounded-2xl bg-[#090D10]/90 border border-slate-800/90 shadow-sm space-y-1 hover:border-teal-500/30 transition-all">
                <div className="flex items-center gap-2 text-teal-300 font-bold text-xs">
                  <Workflow className="w-3.5 h-3.5" />
                  <span>Task Sync</span>
                </div>
                <p className="text-xs text-slate-300 font-normal">
                  Automatic calendar & reminder sync with Google Workspace.
                </p>
              </div>
            </div>

            {/* Primary Get Started Button */}
            <div className="pt-2">
              <button
                id="btn-screen5-get-started"
                onClick={onGetStarted}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-600 via-teal-700 to-teal-800 text-white text-sm font-black shadow-[0_0_35px_rgba(13,148,136,0.45)] hover:shadow-[0_0_45px_rgba(13,148,136,0.65)] hover:scale-[1.02] active:scale-[0.98] border border-teal-400/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 text-teal-200" />
              </button>
            </div>

            {/* Back Button */}
            <div className="pt-1 flex items-center justify-start">
              <button
                id="btn-screen5-back"
                onClick={handleBack}
                className="px-4 py-2 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-400 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            </div>

            {/* 5 Pagination Dots */}
            <div className="pt-2 flex items-center justify-center gap-1.5">
              {[0, 1, 2, 3, 4].map((stepIdx) => (
                <button
                  key={stepIdx}
                  onClick={() => setCurrentStep(stepIdx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentStep === stepIdx
                      ? 'w-6 bg-gradient-to-r from-teal-400 to-slate-200'
                      : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to screen ${stepIdx + 1}`}
                />
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Trust Footer */}
      <footer className="relative z-10 w-full max-w-xl mx-auto py-2 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 font-medium">
        <div>
          WIHGO AI Connect Hub • All-in-one business stream
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <span>Enterprise-Grade Security</span>
          <span>•</span>
          <span>Unified Sync</span>
        </div>
      </footer>
    </div>
  );
};
