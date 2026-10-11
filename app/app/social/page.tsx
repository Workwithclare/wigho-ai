"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, TAB_TO_ROUTE } from '../../components/wihgo/AppShell';
import { useWihgo } from '../../lib/wihgo/store';
import { SocialHubView } from '../../components/wihgo/social/SocialHubView';

function Screen() {
  const s = useWihgo();
  const router = useRouter();
  const nav = (tab: any) => router.push(TAB_TO_ROUTE[tab] || '/dashboard');
  return (
    <SocialHubView
      platforms={s.platforms}
      onOpenWorkspace={() => router.push('/messages')}
      onNavigateTab={nav}
      onTogglePlatformConnect={s.toggleConnection}
      onOpenConnectorModal={(p: any) => s.toggleConnection(p.id)}
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
