"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OpeningMotionSequence } from '../components/wihgo/welcome/OpeningMotionSequence';
import { OpeningExperience } from '../components/wihgo/welcome/OpeningExperience';
import { BackgroundNetwork } from '../components/common/BackgroundNetwork';
import { Logo } from '../components/common/Logo';

export default function RootFlow() {
  const router = useRouter();
  const [stage, setStage] = useState<'splash' | 'opening' | 'gate'>('splash');

  useEffect(() => {
    try {
      if (localStorage.getItem('wihgo_demo_auth') === 'true') router.replace('/dashboard');
    } catch {}
  }, [router]);

  const enterDemo = () => {
    try {
      localStorage.setItem('wihgo_demo_auth', 'true');
      localStorage.setItem('wihgo_onboarding_done', 'true');
    } catch {}
    router.push('/dashboard');
  };

  if (stage === 'splash') {
    return <OpeningMotionSequence onComplete={() => setStage('opening')} />;
  }

  if (stage === 'opening') {
    return (
      <OpeningExperience
        onGetStarted={() => router.push('/signup')}
        onSignIn={() => router.push('/login')}
        onCreateAccount={() => router.push('/signup')}
        onSkip={() => setStage('gate')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#05070E] text-slate-100 relative overflow-hidden flex items-center justify-center p-6">
      <BackgroundNetwork />
      <div className="relative z-10 w-full max-w-sm text-center space-y-6 animate-fade-in">
        <div className="flex justify-center">
          <Logo size="lg" showText />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white">Welcome back, Clare</h1>
          <p className="text-xs text-slate-400">Demo entry — login screens are built but not enforced.</p>
        </div>
        <div className="space-y-3">
          <button
            onClick={enterDemo}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 via-teal-600 to-teal-500 text-black font-extrabold text-sm shadow-[0_0_30px_rgba(13,148,136,0.45)] hover:scale-[1.02] transition-all"
          >
            Continue as Clare
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/login')}
              className="flex-1 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs font-bold text-slate-200 hover:border-teal-500/50 hover:text-teal-300 transition-all"
            >
              Log in
            </button>
            <button
              onClick={() => router.push('/signup')}
              className="flex-1 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs font-bold text-slate-200 hover:border-teal-500/50 hover:text-teal-300 transition-all"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
