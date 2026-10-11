"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, TAB_TO_ROUTE } from '../../components/wihgo/AppShell';
import { useWihgo } from '../../lib/wihgo/store';
import { UnifiedMessagesCenter } from '../../components/wihgo/inbox/UnifiedMessagesCenter';

function Screen() {
  const s = useWihgo();
  const router = useRouter();
  return (
    <UnifiedMessagesCenter
      user={s.user}
      platforms={s.platforms}
      conversations={s.conversations}
      onSendMessage={s.sendMessage}
      onNavigateTab={(tab: any) => router.push(TAB_TO_ROUTE[tab] || '/dashboard')}
      onOpenConnectorModal={(p: any) => s.toggleConnection(p.id)}
      openAiAssistant={() => s.setAiOpen(true)}
      onSaveConversation={s.saveConversation}
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
