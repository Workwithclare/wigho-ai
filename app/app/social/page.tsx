"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { AppShell, TAB_TO_ROUTE } from '../../components/wihgo/AppShell';
import { useWihgo } from '../../lib/wihgo/store';

const SocialHubView = dynamic(
  () => import('../../components/wihgo/social/SocialHubView').then((m) => m.SocialHubView),
  {
    loading: () => (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 rounded-xl bg-slate-800" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-slate-900 border border-slate-800" />
          ))}
        </div>
        <div className="h-64 rounded-2xl bg-slate-900 border border-slate-800" />
      </div>
    ),
  }
);

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
