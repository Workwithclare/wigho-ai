"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { WihgoProvider, useWihgo } from '../../lib/wihgo/store';
import { Header } from './navigation/Header';
import { Sidebar } from './navigation/Sidebar';
import { BottomNav } from './navigation/BottomNav';
import { MobileDrawer } from './navigation/MobileDrawer';
import { AIAssistantDrawer } from './assistant/AIAssistantDrawer';
import { NotificationsModal } from './notifications/NotificationsModal';
import { BackgroundNetwork } from './common/BackgroundNetwork';

export const TAB_TO_ROUTE: Record<string, string> = {
  home: '/dashboard',
  dashboard: '/dashboard',
  'business-hub': '/business-hub',
  business: '/business-hub',
  'business-assistant': '/business-assistant',
  inbox: '/messages',
  messages: '/messages',
  'all-messages': '/messages',
  gmail: '/gmail',
  tasks: '/tasks',
  reminders: '/reminders',
  followups: '/followups',
  calendar: '/calendar',
  connect: '/connect',
  connections: '/connect',
  'my-connections': '/connect',
  'ai-tools': '/ai-tools',
  aitools: '/ai-tools',
  create: '/content',
  'content-creation': '/content',
  content: '/content',
  social: '/social',
  'social-hub': '/social',
  analytics: '/analytics',
  assistant: '/assistant',
  'ai-assistant': '/assistant',
  myday: '/myday',
  'my-day': '/myday',
  profile: '/profile',
  important: '/important',
  settings: '/settings',
  subscription: '/subscription',
  'business-brain': '/business-brain',
  'business-pulse': '/business-brain',
  drive: '/drive',
  meet: '/meet',
};

export const ROUTE_TO_TAB: Record<string, string> = {
  '/dashboard': 'home',
  '/business-hub': 'business-hub',
  '/business-assistant': 'business-assistant',
  '/messages': 'inbox',
  '/gmail': 'inbox',
  '/tasks': 'tasks',
  '/reminders': 'reminders',
  '/followups': 'followups',
  '/calendar': 'calendar',
  '/connect': 'connect',
  '/ai-tools': 'ai-tools',
  '/content': 'content-creation',
  '/social': 'social-hub',
  '/analytics': 'analytics',
  '/assistant': 'ai-assistant',
  '/business-brain': 'business-brain',
  '/myday': 'myday',
  '/important': 'important',
  '/drive': 'drive',
  '/meet': 'meet',
  '/profile': 'profile',
  '/settings': 'settings',
  '/subscription': 'subscription',
};

function ShellInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const s = useWihgo();
  const activeTab = ROUTE_TO_TAB[pathname || ''] || 'home';
  const unread = s.conversations.reduce((a, c) => a + (c?.unreadCount || 0), 0);

  // Optimistic highlight: updates the instant the item is clicked.
  const [pendingTab, setPendingTab] = useState<string | null>(null);
  useEffect(() => {
    setPendingTab(null);
  }, [pathname]);

  // Prefetch every route once so sidebar switches feel instant (0ms).
  useEffect(() => {
    const seen = new Set<string>();
    Object.values(TAB_TO_ROUTE).forEach((route) => {
      if (!seen.has(route)) {
        seen.add(route);
        try {
          router.prefetch(route);
        } catch {}
      }
    });
  }, [router]);

  const navigate = (tab: string) => {
    if (tab === 'more') {
      s.setDrawerOpen(true);
      return;
    }
    if (tab === 'notifications') {
      s.setNotifOpen(true);
      return;
    }
    const route = TAB_TO_ROUTE[tab] || '/dashboard';
    setPendingTab(tab);
    router.push(route);
    s.setDrawerOpen(false);
  };
  const shownTab = pendingTab || activeTab;

  const openWorkspace = (platformId: any) => {
    if (platformId === 'calendar') return router.push('/calendar');
    if (platformId === 'drive') return router.push('/drive');
    if (platformId === 'meet') return router.push('/meet');
    router.push('/messages');
  };

  const firstName = (s.user.name || '').split(' ')[0];

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-teal-500 selection:text-black relative overflow-x-hidden flex flex-col">
      <BackgroundNetwork />
      <Header
        user={s.user}
        notifications={s.notifications}
        openNotifications={() => s.setNotifOpen(true)}
        openAiAssistant={() => s.setAiOpen(true)}
        setActiveTab={navigate}
        searchQuery={s.searchQuery}
        setSearchQuery={s.setSearchQuery}
        onOpenMobileDrawer={() => s.setDrawerOpen(true)}
        onLogout={s.logout}
      />
      <div className="flex flex-1 pt-16">
        <Sidebar
          activeTab={shownTab}
          setActiveTab={navigate}
          unreadCountTotal={unread}
          openAiAssistant={() => s.setAiOpen(true)}
          openNotifications={() => s.setNotifOpen(true)}
          platforms={s.platforms}
          user={s.user}
          onSelectWorkspacePlatform={openWorkspace}
          onLogout={s.logout}
        />
        <MobileDrawer
          isOpen={s.drawerOpen}
          onClose={() => s.setDrawerOpen(false)}
          activeTab={shownTab}
          setActiveTab={navigate}
          unreadCountTotal={unread}
          openAiAssistant={() => s.setAiOpen(true)}
          openNotifications={() => s.setNotifOpen(true)}
          platforms={s.platforms}
          user={s.user}
          onSelectWorkspacePlatform={openWorkspace}
          onLogout={s.logout}
        />
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full transition-all">
          <div className="mb-4">
            <p className="text-sm text-slate-400">
              {firstName ? (
                <>Welcome back, <span className="text-white font-bold">{firstName}</span></>
              ) : (
                <>Welcome back</>
              )}
            </p>
          </div>
          {children}
        </main>
      </div>
      <BottomNav
        activeTab={shownTab}
        setActiveTab={navigate}
        unreadCountTotal={unread}
        openAiAssistant={() => s.setAiOpen(true)}
        onOpenMobileDrawer={() => s.setDrawerOpen(true)}
      />
      <AIAssistantDrawer
        isOpen={s.aiOpen}
        onClose={() => s.setAiOpen(false)}
        user={s.user}
        platforms={s.platforms}
        workspaceContext={{
          conversationsCount: s.conversations.length,
          eventsCount: s.events.length,
          tasksCount: s.tasks.length,
          unreadMessagesCount: unread,
        }}
      />
      <NotificationsModal
        isOpen={s.notifOpen}
        onClose={() => s.setNotifOpen(false)}
        notifications={s.notifications}
        onMarkAllRead={s.markAllRead}
        onNavigate={navigate}
      />
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <WihgoProvider>
      <ShellInner>{children}</ShellInner>
    </WihgoProvider>
  );
}
