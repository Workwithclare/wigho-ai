"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, TAB_TO_ROUTE } from '../../components/wihgo/AppShell';
import { BusinessAssistantView } from '../../components/wihgo/assistant/BusinessAssistantView';

function Screen() {
  const router = useRouter();
  return (
    <BusinessAssistantView
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
