"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, TAB_TO_ROUTE } from '../../components/wihgo/AppShell';
import { useWihgo } from '../../lib/wihgo/store';
import { CalendarView } from '../../components/wihgo/calendar/CalendarView';

function Screen() {
  const s = useWihgo();
  return <CalendarView events={s.events} onAddEvent={s.addEvent} onDeleteEvent={s.deleteEvent} onSetEvents={s.setEvents} />;
}

export default function Page() {
  return (
    <AppShell>
      <Screen />
    </AppShell>
  );
}
