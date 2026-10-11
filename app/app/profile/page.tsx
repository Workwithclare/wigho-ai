"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, TAB_TO_ROUTE } from '../../components/wihgo/AppShell';
import { useWihgo } from '../../lib/wihgo/store';
import { ProfileView } from '../../components/wihgo/profile/ProfileView';

function Screen() {
  const s = useWihgo();
  return (
    <ProfileView
      user={s.user}
      onUpdateUser={s.setUser}
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
