"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { OpeningMotionSequence } from '../components/wihgo/welcome/OpeningMotionSequence';
import { OpeningExperience } from '../components/wihgo/welcome/OpeningExperience';
import { authClient } from '../lib/auth-client';

function displayFirstName(user: { name?: string | null; email?: string | null } | undefined): string {
  const n = (user?.name || '').trim();
  if (n) {
    const w = n.split(/\s+/)[0];
    return w.charAt(0).toUpperCase() + w.slice(1);
  }
  const prefix = (user?.email || '').split('@')[0].replace(/[._-]+/g, ' ').trim();
  if (!prefix) return '';
  const w = prefix.split(/\s+/)[0];
  return w.charAt(0).toUpperCase() + w.slice(1);
}

export default function RootFlow() {
  const router = useRouter();
  const [stage, setStage] = useState<'splash' | 'opening'>('splash');
  const { data: sessionData, isPending } = authClient.useSession();
  // Never auto-redirect: the landing page only goes to /dashboard on click.
  const sessionUser = sessionData?.user as { name?: string | null; email?: string | null } | undefined;
  const firstName = displayFirstName(sessionUser);

  if (stage === 'splash') {
    return <OpeningMotionSequence onComplete={() => setStage('opening')} />;
  }

  return (
    <div className="relative">
      <OpeningExperience
        onGetStarted={() => router.push('/signup')}
        onSignIn={() => router.push('/login')}
        onCreateAccount={() => router.push('/signup')}
        onSkip={() => router.push('/login')}
      />
      {!isPending && sessionUser && (
        <div className="fixed inset-x-0 bottom-6 z-[60] flex justify-center px-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="py-3.5 px-8 rounded-2xl bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 text-black font-extrabold text-sm shadow-[0_0_30px_rgba(13,148,136,0.55)] hover:scale-[1.02] transition-all cursor-pointer"
          >
            Continue to dashboard{firstName ? ` as ${firstName}` : ''}
          </button>
        </div>
      )}
    </div>
  );
}
