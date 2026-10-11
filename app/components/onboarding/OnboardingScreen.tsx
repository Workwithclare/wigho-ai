"use client";

import React, { useState } from 'react';
import {
  ArrowRight,
  Bot,
  MessageSquare,
  Camera,
  ThumbsUp,
  Music2,
  Briefcase,
  Mail,
  Hash,
  Check,
  Sparkles,
  LayoutDashboard
} from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div id="wihgo-onboarding-screen" className="fixed inset-0 z-50 bg-[#070A12] flex flex-col justify-between p-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-cyan-400 font-bold text-xs flex items-center justify-center">
            {currentStep}
          </span>
          <span className="text-xs text-slate-400 font-medium">Step {currentStep} of 3</span>
        </div>
        <button
          id="btn-onboarding-skip"
          onClick={onComplete}
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          Skip
        </button>
      </div>
      <div className="my-auto py-8 max-w-sm mx-auto w-full text-center space-y-6">
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-indigo-500/20 animate-spin-slow" />
              <div className="absolute inset-8 rounded-full border border-cyan-500/30" />
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-400 via-indigo-600 to-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.5)] z-10">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div className="absolute top-2 left-1/2 -translate-x-1/2 p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-md">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="absolute top-12 right-2 p-2.5 rounded-2xl bg-pink-500/20 border border-pink-500/40 text-pink-400 shadow-md">
                <Camera className="w-5 h-5" />
              </div>
              <div className="absolute bottom-12 right-2 p-2.5 rounded-2xl bg-black/40 border border-slate-700 text-cyan-400 shadow-md">
                <Music2 className="w-5 h-5" />
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 p-2.5 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 shadow-md">
                <ThumbsUp className="w-5 h-5" />
              </div>
              <div className="absolute bottom-12 left-2 p-2.5 rounded-2xl bg-sky-600/20 border border-sky-500/40 text-sky-400 shadow-md">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="absolute top-12 left-2 p-2.5 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-400 shadow-md">
                <Hash className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Connect Your Business World</h2>
              <p className="text-xs text-slate-300 leading-relaxed px-2">
                Connect WhatsApp, Instagram, Facebook, TikTok, LinkedIn, Slack, email and other business tools in one unified hub.
              </p>
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
              <div className="w-40 h-40 rounded-3xl bg-gradient-to-tr from-indigo-900/60 to-purple-900/60 border border-purple-500/30 flex flex-col items-center justify-center p-4 shadow-[0_0_40px_rgba(168,85,247,0.3)]">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 flex items-center justify-center shadow-lg mb-3">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <div className="text-xs font-bold text-white">WIHGO Assistant</div>
                <div className="text-[10px] text-cyan-300">Auto-Summaries &amp; Smart Replies</div>
              </div>
              <div className="absolute -top-2 left-2 bg-slate-900/90 border border-cyan-400/30 p-2 rounded-xl text-[10px] text-cyan-300 shadow-lg flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                <span>&quot;Summarized 12 WhatsApp chats&quot;</span>
              </div>
              <div className="absolute -bottom-2 right-2 bg-slate-900/90 border border-purple-400/30 p-2 rounded-xl text-[10px] text-purple-300 shadow-lg flex items-center gap-1.5">
                <Check className="w-3 h-3" />
                <span>&quot;Drafted client response&quot;</span>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Meet Your AI Business Assistant</h2>
              <p className="text-xs text-slate-300 leading-relaxed px-2">
                WIHGO AI helps summarize conversations, draft replies, organize tasks, plan your day and manage follow-ups.
              </p>
            </div>
          </div>
        )}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
              <div className="w-56 h-44 rounded-2xl bg-slate-900/90 border border-indigo-500/30 p-3 flex flex-col justify-between shadow-[0_0_40px_rgba(59,130,246,0.3)]">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5">
                    <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                    <span className="text-[11px] font-bold text-white">Command Center</span>
                  </div>
                  <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    All Synced
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-left">
                  <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/50">
                    <div className="text-[9px] text-slate-400">Total Messages</div>
                    <div className="text-sm font-bold text-white">120</div>
                  </div>
                  <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/50">
                    <div className="text-[9px] text-slate-400">Urgent</div>
                    <div className="text-sm font-bold text-rose-400">3 Action</div>
                  </div>
                </div>
                <div className="text-[9px] text-indigo-300 flex items-center justify-between pt-1 border-t border-slate-800">
                  <span>9 Connected Connectors</span>
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">One Powerful Business Hub</h2>
              <p className="text-xs text-slate-300 leading-relaxed px-2">
                Manage your communications, connections, calendar, tasks, reminders and content from one intelligent workspace.
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="w-full max-w-xs mx-auto pb-6 space-y-4">
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentStep === step ? 'w-8 bg-cyan-400' : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>
        <button
          id="btn-onboarding-next"
          onClick={nextStep}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] flex items-center justify-center gap-2 transition-all duration-300"
        >
          <span>{currentStep === 3 ? 'Get Started' : 'Next'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <div className="flex items-center justify-center gap-2 text-slate-500">
          <Mail className="w-3 h-3" />
          <span className="text-[10px]">Gmail + Calendar coming next</span>
        </div>
      </div>
    </div>
  );
};
