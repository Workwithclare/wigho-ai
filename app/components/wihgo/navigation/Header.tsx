"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Logo } from '../common/Logo';
import {
  Search,
  Bell,
  Sparkles,
  Menu,
  User,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { UserProfile, NotificationItem } from '../../../lib/wihgo/types';
import { UserAvatar } from '../common/UserAvatar';

interface HeaderProps {
  user?: UserProfile;
  notifications?: NotificationItem[];
  openNotifications?: () => void;
  openAiAssistant?: () => void;
  setActiveTab?: (tab: string) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onOpenMobileDrawer?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  notifications = [],
  openNotifications = () => {},
  openAiAssistant = () => {},
  setActiveTab = (_tab: string) => {},
  searchQuery = '',
  setSearchQuery = (_query: string) => {},
  onOpenMobileDrawer,
  onLogout
}) => {
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const safeNotifs = Array.isArray(notifications) ? notifications : [];
  const unreadNotifs = safeNotifs.filter((n) => !n?.read).length;

  const safeUser: UserProfile = user || {
    id: 'default',
    name: 'WIHGO User',
    email: 'user@wihgo.ai',
    avatar: '',
    plan: 'Pro Plan',
    profileType: 'business',
    companyName: 'WIHGO Business',
    role: 'Owner',
    businessDescription: '',
    phone: '',
    autoAiRepliesEnabled: false,
    dailySparkEnabled: true,
    emailNotifications: true,
    pushNotifications: true,
    preferredTone: 'professional'
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    if (isAccountMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAccountMenuOpen]);

  return (
    <header id="main-application-header" className="sticky top-0 z-30 bg-[#0B0F19]/90 backdrop-blur-xl border-b border-teal-500/15 px-4 py-3 flex items-center justify-between gap-4">
      {/* Mobile Menu & Logo */}
      <div className="flex items-center gap-2.5 md:hidden">
        {onOpenMobileDrawer && (
          <button
            onClick={onOpenMobileDrawer}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}
        <div className="cursor-pointer" onClick={() => setActiveTab('home')}>
          <Logo size="sm" showText />
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-md relative hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search messages, tools, contacts, calendar..."
          className="w-full bg-slate-900/80 text-slate-200 placeholder-slate-500 text-xs rounded-xl pl-9 pr-4 py-2 border border-teal-500/15 focus:border-teal-400/50 focus:outline-none transition-all"
        />
      </div>

      {/* Action Triggers */}
      <div className="flex items-center gap-2.5">
        {/* Quick AI Trigger */}
        <button
          id="btn-quick-ai-trigger"
          onClick={openAiAssistant}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500/20 via-teal-700/20 to-teal-900/20 border border-teal-400/30 text-teal-300 hover:text-white hover:border-teal-400 transition-all text-xs font-semibold shadow-sm cursor-pointer"
          title="Open WihGo Mind (Chat & Voice)"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-spin-slow" />
          <span className="hidden xs:inline">WihGo Mind</span>
        </button>

        {/* Notification Bell */}
        <button
          id="btn-notifications-trigger"
          onClick={openNotifications}
          className="relative p-2 rounded-xl bg-slate-900/80 border border-teal-500/15 text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifs > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
              {unreadNotifs}
            </span>
          )}
        </button>

        {/* User Account Area with Profile Dropdown Menu */}
        <div className="relative" ref={menuRef}>
          <button
            id="btn-profile-avatar-header"
            onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
            className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-slate-800/60 border border-transparent hover:border-teal-500/20 transition-all cursor-pointer"
            aria-expanded={isAccountMenuOpen}
            aria-haspopup="true"
          >
            <UserAvatar name={safeUser.name} avatarUrl={safeUser.avatar} size="sm" showOnlineBadge />
            <span className="text-xs font-semibold text-slate-200 hidden lg:inline max-w-[120px] truncate">
              {safeUser.name}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 hidden lg:inline transition-transform duration-200 ${isAccountMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Account Dropdown Menu */}
          {isAccountMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#0B0F19] border border-teal-500/25 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* User Info Header */}
              <div className="px-3 py-2.5 border-b border-slate-800/80 mb-1">
                <div className="text-xs font-bold text-white truncate">{safeUser.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{safeUser.email}</div>
                <div className="mt-1 inline-flex items-center px-1.5 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/30 text-[9px] font-bold text-teal-300">
                  {safeUser.plan || 'Pro Plan'}
                </div>
              </div>

              {/* Menu Links */}
              <div className="space-y-0.5">
                <button
                  id="menu-item-profile"
                  onClick={() => {
                    setActiveTab('profile');
                    setIsAccountMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-xl transition-all"
                >
                  <User className="w-3.5 h-3.5 text-teal-400" />
                  <span>Profile</span>
                </button>

                <button
                  id="menu-item-settings"
                  onClick={() => {
                    setActiveTab('settings');
                    setIsAccountMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-xl transition-all"
                >
                  <Settings className="w-3.5 h-3.5 text-teal-400" />
                  <span>Settings</span>
                </button>
              </div>

              {/* Log Out Action */}
              <div className="border-t border-slate-800/80 mt-1 pt-1">
                <button
                  id="menu-item-logout"
                  onClick={() => {
                    setIsAccountMenuOpen(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
