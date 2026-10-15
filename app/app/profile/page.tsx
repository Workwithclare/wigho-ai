"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, TAB_TO_ROUTE } from '../../components/wihgo/AppShell';
import { useWihgo } from '../../lib/wihgo/store';
import { ProfileView } from '../../components/wihgo/profile/ProfileView';

function Screen() {
  const s = useWihgo();
  const handleUpdateUser = (u: typeof s.user) => {
    s.setUser(u);
    fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: u.name }),
    }).catch(() => {});
  };
  return (
    <ProfileView
      user={s.user}
      onUpdateUser={handleUpdateUser}
      platforms={s.platforms}
      soundEnabled={s.soundEnabled}
      onToggleSound={s.toggleSound}
      onLogout={s.logout}
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
