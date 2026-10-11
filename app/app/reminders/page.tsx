"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, TAB_TO_ROUTE } from '../../components/wihgo/AppShell';
import { useWihgo } from '../../lib/wihgo/store';
import { RemindersView } from '../../components/wihgo/reminders/RemindersView';

function Screen() {
  const s = useWihgo();
  return <RemindersView reminders={s.reminders} onToggleReminder={s.toggleReminder} onAddReminder={s.addReminder} onDeleteReminder={s.deleteReminder} />;
}

export default function Page() {
  return (
    <AppShell>
      <Screen />
    </AppShell>
  );
}
