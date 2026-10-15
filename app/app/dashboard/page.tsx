"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { AppShell } from '../../components/wihgo/AppShell';
import { useWihgo } from '../../lib/wihgo/store';
import { useSession } from '../../lib/auth-client';
import { WihgoDashboard } from '../../components/wihgo/dashboard/WihgoDashboard';
import { AskMindBar, CaptureBox, CatchMeUpButton } from '../../components/wihgo/dashboard/MindWidgets';
import type { FollowUpItem } from '../../lib/wihgo/types';

function Screen() {
  const s = useWihgo();
  const { data: sessionData } = useSession();
  const remoteMode = !!sessionData?.user;
  const [items, setItems] = useState<FollowUpItem[]>([]);
  const [profile, setProfile] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    if (!remoteMode) {
      setProfile(null);
      return;
    }
    // Source of truth for the greeting: the real account row in Neon.
    fetch('/api/profile')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((p) => setProfile({ name: String(p.name || ''), email: String(p.email || '') }))
      .catch(() => setProfile(null));
  }, [remoteMode]);

  const reload = useCallback(() => {
    if (!remoteMode) {
      setItems([]);
      return;
    }
    fetch('/api/commitments')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((rows) => {
        if (Array.isArray(rows)) setItems(rows);
      })
      .catch(() => setItems([]));
  }, [remoteMode]);

  useEffect(() => {
    reload();
  }, [reload]);

  const toggleItem = (id: string) => {
    const target = items.find((f) => f.id === id);
    const completed = target?.status !== 'completed';
    setItems((p) =>
      p.map((f) => (f.id === id ? { ...f, status: (completed ? 'completed' : 'pending') as FollowUpItem['status'] } : f))
    );
    fetch(`/api/commitments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    }).catch(() => {});
  };

  return (
    <div className="space-y-6">
      <WihgoDashboard
        tasks={s.tasks}
        followUps={items}
        userName={profile?.name || (sessionData?.user as any)?.name || ''}
        userEmail={profile?.email || sessionData?.user?.email || ''}
        onToggleTask={s.toggleTask}
        onToggleFollowUp={toggleItem}
      />
      <CaptureBox onSaved={reload} />
      <CatchMeUpButton />
      <AskMindBar />
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
