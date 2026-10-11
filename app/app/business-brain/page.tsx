"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, TAB_TO_ROUTE } from '../../components/wihgo/AppShell';
import { useWihgo } from '../../lib/wihgo/store';
import { BusinessBrainView } from '../../components/wihgo/business/BusinessBrainView';
import { BusinessPulseView } from '../../components/wihgo/business/BusinessPulseView';

function Screen() {
  const router = useRouter();
  const nav = (tab: any) => router.push(TAB_TO_ROUTE[tab] || '/dashboard');
  return (
    <div className="space-y-8">
      <BusinessBrainView onOpenWorkspace={() => router.push('/messages')} onNavigateTab={nav} />
      <BusinessPulseView />
    </div>
  );
}

export default function Page() {
  return (
    <AppShell>
      <Screen />
    </AppShell>
  );
}
