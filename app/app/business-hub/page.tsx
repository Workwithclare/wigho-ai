"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, TAB_TO_ROUTE } from '../../components/wihgo/AppShell';
import { useWihgo } from '../../lib/wihgo/store';
import { BusinessHubView } from '../../components/wihgo/business/BusinessHubView';

function Screen() {
  const s = useWihgo();
  const router = useRouter();
  return (
    <BusinessHubView
      user={s.user}
      onNavigate={(tab: any) => router.push(TAB_TO_ROUTE[tab] || '/dashboard')}
      onOpenWorkspace={() => router.push('/messages')}
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
