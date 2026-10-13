"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, TAB_TO_ROUTE } from '../../components/wihgo/AppShell';
import { useWihgo } from '../../lib/wihgo/store';
import { MyDayView } from '../../components/wihgo/myday/MyDayView';

export const dynamic = 'force-dynamic';

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
