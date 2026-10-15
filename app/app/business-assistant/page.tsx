"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { AppShell, TAB_TO_ROUTE } from '../../components/wihgo/AppShell';

const BusinessAssistantView = dynamic(
  () => import('../../components/wihgo/assistant/BusinessAssistantView').then((m) => m.BusinessAssistantView),
  {
    loading: () => (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-56 rounded-xl bg-slate-800" />
        <div className="h-40 rounded-2xl bg-slate-900 border border-slate-800" />
        <div className="h-24 rounded-2xl bg-slate-900 border border-slate-800" />
      </div>
    ),
  }
);

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
