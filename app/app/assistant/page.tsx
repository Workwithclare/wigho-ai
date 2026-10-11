"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, TAB_TO_ROUTE } from '../../components/wihgo/AppShell';
import { useWihgo } from '../../lib/wihgo/store';
import { AIAssistantView } from '../../components/wihgo/assistant/AIAssistantView';

function Screen() {
  const s = useWihgo();
  const router = useRouter();
  return (
    <AIAssistantView
      user={s.user}
      platforms={s.platforms}
      conversations={s.conversations}
      events={s.events}
      tasks={s.tasks}
      onOpenWorkspace={() => router.push('/messages')}
      onNavigateTab={(tab: any) => router.push(TAB_TO_ROUTE[tab] || '/dashboard')}
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
