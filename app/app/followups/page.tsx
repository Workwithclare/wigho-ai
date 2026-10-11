"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '../../components/wihgo/AppShell';
import { useWihgo } from '../../lib/wihgo/store';
import { useSession } from '../../lib/auth-client';
import { FollowUpsView } from '../../components/wihgo/business/FollowUpsView';
import type { FollowUpItem } from '../../lib/wihgo/types';

function Screen() {
  const s = useWihgo();
  const router = useRouter();
  const { data: sessionData } = useSession();
  const remoteMode = !!sessionData?.user;
  const [items, setItems] = useState<FollowUpItem[] | undefined>(undefined);

  useEffect(() => {
    if (!remoteMode) {
      setItems(undefined);
      return;
    }
    fetch('/api/commitments')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((rows) => {
        if (Array.isArray(rows)) setItems(rows);
      })
      .catch(() => setItems(undefined));
  }, [remoteMode]);

  const toggleItem = (id: string) => {
    const target = items?.find((f) => f.id === id);
    const completed = target?.status !== 'completed';
    setItems((p) =>
      p?.map((f) => (f.id === id ? { ...f, status: (completed ? 'completed' : 'pending') as FollowUpItem['status'] } : f))
    );
    fetch(`/api/commitments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    }).catch(() => {});
  };

  const addItem = (contactName: string, topic: string) => {
    fetch('/api/commitments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactName, topic }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((saved) => setItems((p) => (p ? [saved, ...p] : [saved])))
      .catch(() => {});
  };

  const deleteItem = (id: string) => {
    setItems((p) => p?.filter((f) => f.id !== id));
    fetch(`/api/commitments/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  return (
    <FollowUpsView
      onOpenWorkspace={() => router.push('/messages')}
      openAiAssistant={() => s.setAiOpen(true)}
      items={items}
      onToggleItem={remoteMode ? toggleItem : undefined}
      onAddItem={remoteMode ? addItem : undefined}
      onDeleteItem={remoteMode ? deleteItem : undefined}
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
