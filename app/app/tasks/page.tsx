"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, TAB_TO_ROUTE } from '../../components/wihgo/AppShell';
import { useWihgo } from '../../lib/wihgo/store';
import { TasksView } from '../../components/wihgo/tasks/TasksView';

function Screen() {
  const s = useWihgo();
  return <TasksView tasks={s.tasks} onToggleTask={s.toggleTask} onAddTask={s.addTask} onDeleteTask={s.deleteTask} />;
}

export default function Page() {
  return (
    <AppShell>
      <Screen />
    </AppShell>
  );
}
