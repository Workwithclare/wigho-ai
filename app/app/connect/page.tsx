"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, TAB_TO_ROUTE } from '../../components/wihgo/AppShell';
import { useWihgo } from '../../lib/wihgo/store';
import { BusinessConnectHubView } from '../../components/wihgo/connections/BusinessConnectHubView';

function Screen() {
  const s = useWihgo();
  const router = useRouter();
  return (
    <BusinessConnectHubView
      platforms={s.platforms}
      user={s.user}
      onToggleConnection={s.toggleConnection}
      onOpenWorkspace={() => router.push('/messages')}
      onStatusChange={(id: any) => s.toggleConnection(id)}
      onNavigateTab={(tab: any) => router.push(TAB_TO_ROUTE[tab] || '/dashboard')}
      openAiAssistant={() => s.setAiOpen(true)}
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
