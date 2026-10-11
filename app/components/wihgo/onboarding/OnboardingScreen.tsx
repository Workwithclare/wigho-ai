"use client";

import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  Camera,
  ThumbsUp,
  Music2,
  Briefcase,
  X as XIcon,
  Mail,
  Hash,
  Calendar,
  Sparkles,
  BarChart2,
  TrendingUp,
  LayoutDashboard,
  CheckCircle2,
  Bot,
  Zap,
  Check
} from 'lucide-react';
import { AIAssistantMascot } from '../common/AIAssistantMascot';

import { WhatsAppIcon } from '../common/WhatsAppIcon';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['messages', 'content']);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>(['whatsapp', 'email']);

  const totalSteps = 5;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) ? prev.filter(g => g !== goalId) : [...prev, goalId]
    );
  };

  const togglePlatform = (platformId: string) => {
    setConnectedPlatforms(prev =>
      prev.includes(platformId) ? prev.filter(p => p !== platformId) : [...prev, platformId]
    );
  };

  return (
    <div id="wihgo-onboarding-screen" className="fixed inset-0 z-50 bg-[#05070E] flex flex-col justify-between p-6 overflow-y-auto">
      {/* Top Header - Back & Skip Buttons */}
      <div className="flex items-center justify-between w-full max-w-md mx-auto">
        <div className="flex items-center gap-2">
          {currentStep > 1 && (
            <button
              id="btn-onboarding-back"
              onClick={prevStep}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Go Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/40 text-purple-300 font-bold text-xs flex items-center gap-1 shadow-sm">
            <span>Step</span>
            <span>{currentStep}</span>
            <span>/</span>
            <span>{totalSteps}</span>
          </div>
        </div>

        <button
          id="btn-onboarding-skip"
          onClick={onComplete}
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          Skip Intro
        </button>
      </div>

      {/* Screen Graphic & Text Content */}
      <div className="my-auto py-6 max-w-md mx-auto w-full text-center space-y-6">
        {/* Screen 1: Overview */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="relative w-56 h-56 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-purple-500/20 animate-spin-slow" />
              <div className="absolute inset-6 rounded-full border border-cyan-500/30" />
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-400 via-indigo-600 to-purple-600 flex items-center justify-center shadow-[0_0_35px_rgba(6,182,212,0.6)] z-10 animate-pulse">
                <Sparkles className="w-9 h-9 text-white" />
              </div>
              <div className="absolute top-1 left-1/2 -translate-x-1/2 p-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-lg">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="absolute top-10 right-2 p-2 rounded-2xl bg-pink-500/20 border border-pink-500/40 text-pink-400 shadow-lg">
                <Camera className="w-4 h-4" />
              </div>
              <div className="absolute bottom-10 right-2 p-2 rounded-2xl bg-black/80 border border-slate-700 text-cyan-400 shadow-lg">
                <Music2 className="w-4 h-4" />
              </div>
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 p-2 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 shadow-lg">
                <ThumbsUp className="w-4 h-4" />
              </div>
              <div className="absolute top-10 left-2 p-2 rounded-2xl bg-sky-600/20 border border-sky-500/40 text-sky-400 shadow-lg">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white tracking-tight">Welcome to WIHGO AI</h2>
              <p className="text-xs text-slate-300 leading-relaxed px-4">
                Connect all your social media channels, WhatsApp, emails, and calendar in one unified AI command center.
              </p>
            </div>
          </div>
        )}

        {/* Screen 2: Selectable Options */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <h2 className="text-xl font-black text-white tracking-tight">What are your primary goals?</h2>
              <p className="text-xs text-slate-300">Select options to personalize WIHGO AI for your workflow:</p>
            </div>

            <div className="grid grid-cols-1 gap-2.5 text-left">
              {[
                { id: 'messages', title: 'Unify & Reply to All Messages', desc: 'WhatsApp, IG, Email, Facebook, TikTok, Slack' },
                { id: 'content', title: 'Generate & Schedule Social Content', desc: 'Viral captions, posts, ad copy, video scripts' },
                { id: 'analytics', title: 'Track Audience Reach & Growth', desc: 'Cross-platform metrics and AI insights' },
                { id: 'tasks', title: 'Automate Tasks & Follow-ups', desc: 'Extract reminders and daily agenda items' }
              ].map(goal => {
                const isSelected = selectedGoals.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-indigo-600/20 border-cyan-400/60 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{goal.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{goal.desc}</div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isSelected ? 'bg-cyan-500 border-cyan-400 text-white' : 'border-slate-700'
                    }`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Screen 3: Connect Channels */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-2">
              <h2 className="text-xl font-black text-white tracking-tight">Connect Platforms</h2>
              <p className="text-xs text-slate-300">Select channels to link via secure OAuth 2.0:</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-left">
              {[
                { id: 'whatsapp', name: 'WhatsApp', icon: WhatsAppIcon, color: '' },
                { id: 'email', name: 'Gmail / Email', icon: Mail, color: 'text-rose-400' },
                { id: 'instagram', name: 'Instagram', icon: Camera, color: 'text-pink-400' },
                { id: 'facebook', name: 'Facebook', icon: ThumbsUp, color: 'text-blue-400' },
                { id: 'tiktok', name: 'TikTok', icon: Music2, color: 'text-cyan-400' },
                { id: 'linkedin', name: 'LinkedIn', icon: Briefcase, color: 'text-sky-400' }
              ].map(platform => {
                const isConn = connectedPlatforms.includes(platform.id);
                const Icon = platform.icon;
                return (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      isConn
                        ? 'bg-slate-900 border-cyan-400/50 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className={`w-4 h-4 ${platform.color}`} />
                      <span className="text-xs font-bold truncate">{platform.name}</span>
                    </div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      isConn ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                    }`}>
                      {isConn ? 'Linked' : 'Connect'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Screen 4: Meet WIHGO AI */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="py-2">
              <AIAssistantMascot size="lg" showFloatingBubbles animated />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white tracking-tight">Meet WIHGO AI</h2>
              <p className="text-xs text-slate-300 leading-relaxed px-4">
                Your 24/7 AI partner for cross-channel message summarizing, smart replies, content creation, and business scheduling.
              </p>
            </div>
          </div>
        )}

        {/* Screen 5: Enter My Dashboard */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-emerald-500 to-cyan-500 mx-auto flex items-center justify-center text-white shadow-[0_0_35px_rgba(16,185,129,0.5)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white tracking-tight">You are all set!</h2>
              <p className="text-xs text-slate-300 leading-relaxed px-4">
                Your WIHGO AI Connect Hub is configured and ready. Enter your workspace dashboard to begin.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Controls */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between pt-4 pb-2 border-t border-slate-900">
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentStep === step ? 'w-5 bg-cyan-400' : 'w-2 bg-slate-800'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          {currentStep === 5 ? (
            <button
              id="btn-onboarding-enter-dashboard"
              onClick={onComplete}
              className="py-3 px-6 rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-600 text-white font-extrabold text-xs shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:shadow-[0_0_35px_rgba(16,185,129,0.8)] transition-all flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Enter My Dashboard</span>
            </button>
          ) : (
            <button
              id="btn-onboarding-continue"
              onClick={nextStep}
              className="py-3 px-5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.7)] transition-all flex items-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
