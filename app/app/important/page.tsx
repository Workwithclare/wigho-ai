"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, TAB_TO_ROUTE } from '../../components/wihgo/AppShell';
import { useWihgo } from '../../lib/wihgo/store';
import { ImportantView } from '../../components/wihgo/important/ImportantView';

function Screen() {
  const s = useWihgo();
  const router = useRouter();
  return <ImportantView conversations={s.conversations} tasks={s.tasks} events={s.events} onOpenWorkspace={() => router.push('/messages')} openAiAssistant={() => s.setAiOpen(true)} />;
}

export default function Page() {
  return (
    <AppShell>
      <Screen />
    </AppShell>
  );
}
