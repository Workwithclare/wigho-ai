"use client";

import React from 'react';
import { Logo } from '../common/Logo';
import { UserAvatar } from '../common/UserAvatar';
import { PlatformInfo, UserProfile, PlatformId } from '../../../lib/wihgo/types';
import {
  X,
  Home,
  MessageSquare,
  Star,
  Bell,
  Link as LinkIcon,
  Calendar as CalendarIcon,
  CheckSquare,
  Clock,
  Sun,
  Bot,
  Zap,
  Sparkles,
  Plus,
  Brain,
  TrendingUp,
  User,
  Sliders,
  CreditCard,
  Share2,
  Briefcase,
  BarChart3,
  HardDrive,
  Video,
  LogOut
} from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  unreadCountTotal?: number;
  openAiAssistant?: () => void;
  openNotifications?: () => void;
  platforms?: PlatformInfo[];
  user?: UserProfile;
  onSelectWorkspacePlatform?: (platformId: PlatformId) => void;
  onOpenConnectorModal?: (platform: PlatformInfo) => void;
  onLogout?: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  activeTab = 'home',
  setActiveTab = (_tab: string) => {},
  unreadCountTotal = 0,
  openAiAssistant = () => {},
  openNotifications = () => {},
  platforms = [],
  user,
  onSelectWorkspacePlatform = (_platformId: PlatformId) => {},
  onOpenConnectorModal,
  onLogout
}) => {
  if (!isOpen) return null;

  const safePlatforms = Array.isArray(platforms) ? platforms : [];
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

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    onClose();
  };

  const handleConnectedAppClick = (platformId: PlatformId) => {
    const platform = safePlatforms.find(p => p.id === platformId);
    if (platform && !platform.connected && platform.statusOverride !== 'CONNECTED') {
      if (onOpenConnectorModal) {
        onOpenConnectorModal(platform);
        onClose();
        return;
      }
      setActiveTab('connections');
      onClose();
      return;
    }
    onSelectWorkspacePlatform(platformId);
    setActiveTab('inbox');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-md flex justify-start">
      <div className="bg-[#0B0F19] border-r border-indigo-500/20 w-80 max-w-[85vw] h-full flex flex-col justify-between p-5 overflow-y-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-indigo-500/15">
          <div className="cursor-pointer" onClick={() => handleNavClick('home')}>
            <Logo size="sm" showText />
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-6 flex-1">
          {/* MAIN */}
          <div className="space-y-1">
            <div className="px-2 text-[10px] font-black text-slate-500 uppercase">MAIN</div>
            {[
              { id: 'home', label: 'Dashboard', icon: Home },
              { id: 'business-hub', label: 'Business Hub', icon: Brain, highlight: true },
              { id: 'inbox', label: 'Messages', icon: MessageSquare, badge: unreadCountTotal },
              { id: 'social-hub', label: 'Social Hub', icon: Share2 },
              { id: 'ai-assistant', label: 'WIHGO AI', icon: Bot },
              { id: 'business-assistant', label: 'Business Assistant', icon: Briefcase },
              { id: 'important', label: 'Important', icon: Star },
              { id: 'notifications', label: 'Notifications', icon: Bell }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'notifications') {
                      openNotifications();
                      onClose();
                    } else {
                      handleNavClick(item.id);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                    isActive ? 'bg-indigo-600/30 text-white border-l-4 border-cyan-400' : 'text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 ? (
                    <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full">{item.badge}</span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {/* CONNECT & CONNECTED APPS */}
          <div className="space-y-1">
            <div className="px-2 text-[10px] font-black text-slate-500 uppercase">CONNECT</div>
            <button
              onClick={() => handleNavClick('connect')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                activeTab === 'connect' ? 'bg-indigo-600/30 text-white border-l-4 border-cyan-400' : 'text-slate-400'
              }`}
            >
              <LinkIcon className="w-4 h-4 text-cyan-400" />
              <span>Connect Hub</span>
            </button>

            <button
              onClick={() => handleNavClick('connections')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                activeTab === 'connections' ? 'bg-indigo-600/30 text-white border-l-4 border-cyan-400' : 'text-slate-400'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Modular Connectors</span>
            </button>

            <div className="pt-2 pl-2 space-y-1">
              <div className="text-[10px] text-slate-500 font-bold uppercase">CONNECTED WORKSPACES</div>
              {safePlatforms.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleConnectedAppClick(p.id)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs text-slate-300 hover:bg-slate-900"
                >
                  <span className="capitalize">{p.name}</span>
                  {p.unreadCount > 0 && (
                    <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.2 rounded-full">{p.unreadCount}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* BUSINESS */}
          <div className="space-y-1">
            <div className="px-2 text-[10px] font-black text-slate-500 uppercase">BUSINESS</div>
            {[
              { id: 'content-creation', label: 'Content Studio', icon: Sparkles },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
              { id: 'drive', label: 'Google Drive', icon: HardDrive },
              { id: 'meet', label: 'Google Meet', icon: Video },
              { id: 'tasks', label: 'Tasks', icon: CheckSquare },
              { id: 'reminders', label: 'Reminders', icon: Clock },
              { id: 'followups', label: 'Follow-Ups', icon: Clock },
              { id: 'business-brain', label: 'Business Brain', icon: Brain },
              { id: 'business-pulse', label: 'Business Pulse', icon: TrendingUp }
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400"
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* ACCOUNT */}
          <div className="space-y-1">
            <div className="px-2 text-[10px] font-black text-slate-500 uppercase">ACCOUNT</div>
            {[
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'settings', label: 'Settings', icon: Sliders },
              { id: 'subscription', label: 'Subscription', icon: CreditCard }
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
                >
                  <Icon className="w-4 h-4 text-teal-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {onLogout && (
              <button
                id="btn-mobile-drawer-logout"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>

        {/* User Card */}
        <div className="pt-4 border-t border-teal-500/15 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <UserAvatar name={safeUser.name} avatarUrl={safeUser.avatar} size="sm" showOnlineBadge />
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">{safeUser.name}</div>
              <div className="text-[10px] text-teal-400 font-semibold">{safeUser.plan || 'Pro Plan'}</div>
            </div>
          </div>
          {onLogout && (
            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
