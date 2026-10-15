"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useSession } from '../auth-client';
import {
  INITIAL_PLATFORMS,
  INITIAL_CONVERSATIONS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_TASKS,
  INITIAL_REMINDERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_USER_PROFILE,
} from './mockData';
import type {
  PlatformInfo,
  PlatformId,
  Conversation,
  Message,
  CalendarEvent,
  Task,
  Reminder,
  NotificationItem,
  UserProfile,
} from './types';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {}
  return fallback;
}
function save(key: string, val: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

export function playChime(kind: 'sync' | 'ai' | 'notify', enabled: boolean) {
  if (!enabled) return;
  try {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    if (kind === 'sync') {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2);
    } else if (kind === 'ai') {
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.25);
    } else {
      osc.frequency.setValueAtTime(659.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.15);
    }
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {}
}

interface WihgoStore {
  remote: boolean;
  user: UserProfile;
  setUser: (u: UserProfile) => void;
  platforms: PlatformInfo[];
  conversations: Conversation[];
  events: CalendarEvent[];
  tasks: Task[];
  reminders: Reminder[];
  notifications: NotificationItem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  aiOpen: boolean;
  setAiOpen: (v: boolean) => void;
  notifOpen: boolean;
  setNotifOpen: (v: boolean) => void;
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
  toggleTask: (id: string) => void;
  addTask: (t: Task) => void;
  deleteTask: (id: string) => void;
  toggleReminder: (id: string) => void;
  addReminder: (r: Reminder) => void;
  deleteReminder: (id: string) => void;
  addEvent: (e: CalendarEvent) => void;
  deleteEvent: (id: string) => void;
  setEvents: (e: CalendarEvent[]) => void;
  sendMessage: (convId: string, text: string) => void;
  saveConversation: (conv: Conversation) => void;
  toggleConnection: (id: PlatformId) => void;
  markAllRead: () => void;
  logout: () => void;
}

const Ctx = createContext<WihgoStore | null>(null);

export function WihgoProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [platforms, setPlatforms] = useState<PlatformInfo[]>(INITIAL_PLATFORMS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [events, setEventsState] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [reminders, setReminders] = useState<Reminder[]>(INITIAL_REMINDERS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [aiOpen, setAiOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [remote, setRemote] = useState(false);
  const { data: sessionData } = useSession();
  const sessionUser = (sessionData?.user as { id: string } | undefined) ?? null;
  const remoteMode = !!sessionUser;

  const uid = sessionUser?.id ?? 'local';
  useEffect(() => {
    if (sessionData?.user) {
      setUser((prev) => ({
        ...prev,
        id: (sessionData.user as any).id || prev.id,
        name: sessionData.user.name || prev.name,
        email: sessionData.user.email || prev.email,
      }));
    }
    setReminders(load(`wihgo_reminders_${uid}`, []));
    setEventsState(load(`wihgo_events_${uid}`, []));
    setPlatforms(load(`wihgo_connectors_${uid}`, INITIAL_PLATFORMS));
    if (remoteMode) {
      // Real Neon data for the logged-in user (every query filtered by user id server-side).
      fetch('/api/tasks')
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((rows) => {
          if (Array.isArray(rows)) {
            setTasks(rows);
            setRemote(true);
          }
        })
        .catch(() => {
          setTasks([]);
          setRemote(false);
        });
    } else {
      setTasks([]);
      setRemote(false);
    }
  }, [remoteMode]);
  useEffect(() => save(`wihgo_tasks_${uid}`, tasks), [tasks]);
  useEffect(() => save(`wihgo_reminders_${uid}`, reminders), [reminders]);
  useEffect(() => save(`wihgo_events_${uid}`, events), [events]);

  const toggleSound = () => setSoundEnabled((v) => !v);

  const toggleTask = (id: string) => {
    const next = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    setTasks(next);
    const toggled = next.find((t) => t.id === id);
    if (remoteMode && toggled) {
      fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: toggled.completed }),
      }).catch(() => {});
    }
    playChime('notify', soundEnabled);
  };
  const addTask = (t: Task) => {
    if (remoteMode) {
      fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: t.title }),
      })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((saved) => setTasks((p) => [{ ...t, id: saved.id }, ...p]))
        .catch(() => setTasks((p) => [t, ...p]));
    } else {
      setTasks((p) => [t, ...p]);
    }
    playChime('sync', soundEnabled);
  };
  const deleteTask = (id: string) => {
    if (remoteMode) {
      fetch(`/api/tasks/${id}`, { method: 'DELETE' }).catch(() => {});
    }
    setTasks((p) => p.filter((t) => t.id !== id));
  };

  const toggleReminder = (id: string) => {
    setReminders((p) => p.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r)));
    playChime('notify', soundEnabled);
  };
  const addReminder = (r: Reminder) => {
    setReminders((p) => [r, ...p]);
    playChime('sync', soundEnabled);
  };
  const deleteReminder = (id: string) => setReminders((p) => p.filter((r) => r.id !== id));

  const addEvent = (e: CalendarEvent) => {
    setEventsState((p) => [e, ...p]);
    playChime('sync', soundEnabled);
  };
  const deleteEvent = (id: string) => setEventsState((p) => p.filter((e) => e.id !== id));
  const setEvents = (e: CalendarEvent[]) => setEventsState(e);

  const saveConversation = (conv: Conversation) => {
    setConversations((prev) => {
      const idx = prev.findIndex((c) => c.id === conv.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = conv;
        return copy;
      }
      return [conv, ...prev];
    });
  };

  const sendMessage = (convId: string, text: string) => {
    const target = conversations.find((c) => c.id === convId);
    const platform = target?.platform || 'whatsapp';
    const msg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: convId,
      platform,
      senderName: user.name || 'You',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isFromUser: true,
      isRead: true,
    };
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, lastMessage: text, lastMessageTime: 'Just now', messages: [...c.messages, msg] } : c))
    );
    playChime('notify', soundEnabled);
  };

  const toggleConnection = (id: PlatformId) => {
    setPlatforms((prev) => {
      const next = prev.map((p) =>
        p.id === id ? { ...p, connected: !p.connected, lastSynced: !p.connected ? 'Just now' : 'Disconnected' } : p
      );
      save(`wihgo_connectors_${uid}`, next);
      return next;
    });
    playChime('notify', soundEnabled);
  };

  const markAllRead = () => setNotifications((p) => p.map((n) => ({ ...n, read: true })));

  const logout = async () => {
    try {
      const { signOut } = await import('../auth-client');
      await signOut();
    } catch {}
    window.location.href = '/login';
  };

  const val: WihgoStore = {
    remote: remoteMode,
    user,
    setUser,
    platforms,
    conversations,
    events,
    tasks,
    reminders,
    notifications,
    searchQuery,
    setSearchQuery,
    soundEnabled,
    toggleSound,
    aiOpen,
    setAiOpen,
    notifOpen,
    setNotifOpen,
    drawerOpen,
    setDrawerOpen,
    toggleTask,
    addTask,
    deleteTask,
    toggleReminder,
    addReminder,
    deleteReminder,
    addEvent,
    deleteEvent,
    setEvents,
    sendMessage,
    saveConversation,
    toggleConnection,
    markAllRead,
    logout,
  };

  return <Ctx.Provider value={val}>{children}</Ctx.Provider>;
}

export function useWihgo(): WihgoStore {
  const v = useContext(Ctx);
  if (!v) throw new Error('useWihgo must be used inside WihgoProvider');
  return v;
}
