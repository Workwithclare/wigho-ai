"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OpeningMotionSequence } from '../components/wihgo/welcome/OpeningMotionSequence';
import { OpeningExperience } from '../components/wihgo/welcome/OpeningExperience';
import { authClient } from '../lib/auth-client';

export default function RootFlow() {
  const router = useRouter();
  const [stage, setStage] = useState<'splash' | 'opening'>('splash');
  const { data: sessionData, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && sessionData?.user) router.replace('/dashboard');
  }, [isPending, sessionData, router]);

  if (stage === 'splash') {
    return <OpeningMotionSequence onComplete={() => setStage('opening')} />;
  }

  return (
    <OpeningExperience
      onGetStarted={() => router.push('/signup')}
      onSignIn={() => router.push('/login')}
      onCreateAccount={() => router.push('/signup')}
      onSkip={() => router.push('/login')}
    />
  );
}
