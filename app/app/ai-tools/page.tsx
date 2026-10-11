"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, TAB_TO_ROUTE } from '../../components/wihgo/AppShell';
import { useWihgo } from '../../lib/wihgo/store';
import { AIToolsView } from '../../components/wihgo/aitools/AIToolsView';
import { AI_TOOLS_LIST } from '../../lib/wihgo/mockData';

function Screen() {
  return <AIToolsView tools={AI_TOOLS_LIST} />;
}

export default function Page() {
  return (
    <AppShell>
      <Screen />
    </AppShell>
  );
}
