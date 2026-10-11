"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, TAB_TO_ROUTE } from '../../components/wihgo/AppShell';
import { useWihgo } from '../../lib/wihgo/store';
import { GmailWorkspace } from '../../components/wihgo/inbox/GmailWorkspace';

function Screen() {
  const router = useRouter();
  return <GmailWorkspace onBack={() => router.push('/messages')} />;
}

export default function Page() {
  return (
    <AppShell>
      <Screen />
    </AppShell>
  );
}
