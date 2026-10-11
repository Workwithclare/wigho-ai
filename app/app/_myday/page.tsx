"use client";

import React from 'react';
import nextDynamic from 'next/dynamic';
import { AppShell } from '../../components/wihgo/AppShell';
import { useWihgo } from '../../lib/wihgo/store';

export const dynamic = 'force-dynamic';

const MyDayView = nextDynamic(
  () => import('../../components/wihgo/myday/MyDayView').then((m) => m.MyDayView),
  {
    ssr: false,
    loading: () => (
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-teal-500/20 text-sm text-slate-300">
        Loading your day…
      </div>
    ),
  }
);

function Screen() {
  const s = useWihgo();
  return <MyDayView conversations={s.conversations} events={s.events} tasks={s.tasks} openAiAssistant={() => s.setAiOpen(true)} />;
}

export default function Page() {
  return (
    <AppShell>
      <Screen />
    </AppShell>
  );
}
