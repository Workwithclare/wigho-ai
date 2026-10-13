"use client";

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  MessageSquare,
  ArrowRight,
  Bot
} from 'lucide-react';

interface FloatingAIAssistantCompanionProps {
  onOpenAssistant: (initialPrompt?: string) => void;
  userName?: string;
}

const getGreetingForTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "Good morning 👋";
  } else if (hour < 17) {
    return "Good afternoon 👋";
  } else {
    return "Good evening 👋";
  }
};

const COMPANION_MESSAGES = [
  "Good morning! Ready to plan your business day?",
  "Your connected platforms are waiting for you.",
  "Need help managing your conversations?",
  "Let's make today productive.",
  "Would you like me to help organize your tasks?"
];

export const FloatingAIAssistantCompanion: React.FC<FloatingAIAssistantCompanionProps> = ({
  onOpenAssistant,
  userName
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('wihgo_ai_companion_dismissed') === 'true';
    } catch {
      return false;
    }
  });
  const [messageIndex, setMessageIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    if (isDismissed) return;

    // Smooth entry after dashboard has loaded
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    return () => clearTimeout(showTimer);
  }, [isDismissed]);

  // Subtle message rotation every 25s if visible and not dismissed
  useEffect(() => {
    if (!isVisible || isDismissed) return;

    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % (COMPANION_MESSAGES.length + 1));
    }, 25000);

    return () => clearInterval(interval);
  }, [isVisible, isDismissed]);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
    setIsDismissed(true);
    try {
      sessionStorage.setItem('wihgo_ai_companion_dismissed', 'true');
    } catch (err) {
      console.warn('[WIHGO AI Companion] Session storage save error:', err);
    }
  };

  const welcomeMessage = userName
    ? `Hi, I'm WihGo Mind 👋 I'm here to help you manage your business conversations, connected platforms and daily tasks.`
    : "Hi, I'm WihGo Mind 👋 I'm here to help you manage your business conversations, connected platforms and daily tasks.";

  const currentMessage = messageIndex === 0 
    ? welcomeMessage 
    : COMPANION_MESSAGES[(messageIndex - 1) % COMPANION_MESSAGES.length];

  const handleCardClick = () => {
    onOpenAssistant(currentMessage);
  };

  // If dismissed during current session or not yet ready to show
  if (isDismissed || !isVisible) {
    return null;
  }

  return (
    <div
      id="floating-wihgo-ai-companion"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 max-w-sm w-[calc(100vw-2rem)] sm:w-88 transition-all duration-500 ease-out transform translate-y-0 opacity-100 animate-in fade-in slide-in-from-bottom-5"
      role="complementary"
      aria-label="WihGo Mind Companion"
    >
      <div 
        onClick={handleCardClick}
        className="group relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/95 via-[#0c1222]/95 to-[#080d1a]/95 border border-cyan-500/40 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(6,182,212,0.25)] backdrop-blur-xl transition-all duration-300 hover:border-cyan-400 hover:shadow-[0_16px_50px_rgba(6,182,212,0.35)]"
      >
        {/* Subtle Ambient Background Aura */}
        <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-cyan-500/15 blur-2xl group-hover:bg-cyan-500/25 transition-all" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-indigo-600/15 blur-2xl" />

        {/* Top Header Row with WIHGO Robot Avatar & Dismiss Button */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2.5">
            {/* Robot Avatar Mini Badge */}
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-0.5 shadow-md">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                <Bot className="h-4 w-4 text-cyan-300 animate-pulse" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400 border border-slate-900" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-wider text-white">WihGo Mind</span>
                <span className="rounded-full bg-cyan-500/20 px-1.5 py-0.2 text-[9px] font-bold text-cyan-300 border border-cyan-500/30 uppercase">
                  Companion
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-none mt-0.5">
                {userName ? `Here to assist ${userName}` : 'Smart Business Assistant'}
              </p>
            </div>
          </div>

          {/* Dismiss / Close Button */}
          <button
            id="btn-dismiss-ai-companion"
            onClick={handleDismiss}
            title="Dismiss for this session"
            aria-label="Dismiss WihGo Mind companion"
            className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Message Speech Body */}
        <div className="mb-3 rounded-xl bg-slate-950/70 border border-slate-800/90 p-2.5 text-xs font-medium text-slate-200 shadow-inner flex items-start gap-2">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed select-none">
            {currentMessage}
          </p>
        </div>

        {/* Action Prompt Strip */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
          <span className="text-[10px] font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span>Open WihGo Mind</span>
          </span>

          <span className="rounded-lg bg-cyan-500/15 group-hover:bg-cyan-500/25 border border-cyan-500/30 px-2 py-1 text-[10px] font-bold text-cyan-300 transition-all flex items-center gap-1">
            <span>Chat now</span>
            <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );
};
