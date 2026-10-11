"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, TAB_TO_ROUTE } from '../../components/wihgo/AppShell';
import { useWihgo } from '../../lib/wihgo/store';
import { SettingsView } from '../../components/wihgo/account/SettingsView';

function Screen() {
  const s = useWihgo();
  const router = useRouter();
  const nav = (tab: any) => router.push(TAB_TO_ROUTE[tab] || '/dashboard');
  return (
    <SettingsView
      user={s.user}
      soundEnabled={s.soundEnabled}
      onToggleSound={s.toggleSound}
      onUpdateUser={s.setUser}
      onReplayOnboarding={() => router.push('/')}
      onPlayOpeningMotion={() => router.push('/')}
      onOpenShowcaseExperience={() => router.push('/showcase')}
      onNavigateTab={nav}
      onLogout={s.logout}
    />
  );
}

export default function Page() {
  return (
    <AppShell>
      <Screen />
    </AppShell>
  );
}
