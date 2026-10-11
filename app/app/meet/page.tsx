"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, TAB_TO_ROUTE } from '../../components/wihgo/AppShell';
import { useWihgo } from '../../lib/wihgo/store';
import { GoogleMeetView } from '../../components/wihgo/meet/GoogleMeetView';

function Screen() {
  const router = useRouter();
  return <GoogleMeetView onNavigateTab={(tab: any) => router.push(TAB_TO_ROUTE[tab] || '/dashboard')} />;
}

export default function Page() {
  return (
    <AppShell>
      <Screen />
    </AppShell>
  );
}
