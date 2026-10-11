"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, TAB_TO_ROUTE } from '../../components/wihgo/AppShell';
import { useWihgo } from '../../lib/wihgo/store';
import { HomeDashboard } from '../../components/wihgo/dashboard/HomeDashboard';
import { DAILY_SPARKS } from '../../lib/wihgo/mockData';

function Screen() {
  const s = useWihgo();
  const router = useRouter();
  const nav = (tab: any) => router.push(TAB_TO_ROUTE[tab] || '/dashboard');
  return (
    <HomeDashboard
      user={s.user}
      platforms={s.platforms}
      conversations={s.conversations}
      events={s.events}
      tasks={s.tasks}
      reminders={s.reminders}
      dailySparks={DAILY_SPARKS}
      onNavigate={nav}
      onOpenWorkspace={() => router.push('/messages')}
      openAiAssistant={() => s.setAiOpen(true)}
      onToggleTask={s.toggleTask}
      onToggleReminder={s.toggleReminder}
      onOpenConnectorModal={(p: any) => s.toggleConnection(p.id)}
      onStatusChange={(id: any, st: any) => s.toggleConnection(id)}
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
