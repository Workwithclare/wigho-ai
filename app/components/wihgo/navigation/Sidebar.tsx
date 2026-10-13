"use client";

import React, { useState } from 'react';
import { Logo } from '../common/Logo';
import { UserAvatar } from '../common/UserAvatar';
import { PlatformInfo, UserProfile, PlatformId } from '../../../lib/wihgo/types';
import {
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
  ChevronLeft,
  ChevronRight,
  Camera,
  ThumbsUp,
  Music2,
  Briefcase,
  X as XIcon,
  Hash,
  Mail,
  Share2,
  BarChart3,
  HardDrive,
  Video,
  LogOut
} from 'lucide-react';

import { WhatsAppIcon } from '../common/WhatsAppIcon';

interface SidebarProps {
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

export const Sidebar: React.FC<SidebarProps> = ({
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
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

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

  const renderPlatformIcon = (id: string, className: string) => {
    switch (id) {
      case 'whatsapp': return <WhatsAppIcon className={className} />;
      case 'instagram': return <Camera className={`${className} text-pink-400`} />;
      case 'facebook': return <ThumbsUp className={`${className} text-blue-400`} />;
      case 'tiktok': return <Music2 className={`${className} text-cyan-400`} />;
      case 'linkedin': return <Briefcase className={`${className} text-sky-400`} />;
      case 'x': return <XIcon className={`${className} text-slate-200`} />;
      case 'slack': return <Hash className={`${className} text-purple-400`} />;
      case 'email': return <Mail className={`${className} text-rose-400`} />;
      case 'calendar': return <CalendarIcon className={`${className} text-teal-400`} />;
      case 'drive': return <HardDrive className={`${className} text-emerald-400`} />;
      case 'meet': return <Video className={`${className} text-teal-400`} />;
      default: return <MessageSquare className={className} />;
    }
  };

  const mainSection = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'business-hub', label: 'Business Hub', icon: Brain, highlight: true },
    { id: 'inbox', label: 'Messages', icon: MessageSquare, badge: unreadCountTotal },
    { id: 'connect', label: 'Connect Hub', icon: LinkIcon },
    { id: 'social-hub', label: 'Social Hub', icon: Share2 },
    { id: 'ai-assistant', label: 'WihGo Mind', icon: Bot },
    { id: 'business-assistant', label: 'Business Assistant', icon: Briefcase },
    { id: 'important', label: 'Important', icon: Star },
    { id: 'notifications', label: 'Notifications', icon: Bell, isNotifTrigger: true }
  ];

  const connectSection = [
    { id: 'connect', label: 'Connect Hub', icon: LinkIcon },
    { id: 'connections', label: 'Modular Connectors', icon: Sparkles }
  ];

  const businessSection = [
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
  ];

  const toolsSection = [
    { id: 'aitools', label: 'AI Tools', icon: Sparkles },
    { id: 'myday', label: 'My Day', icon: Sun, highlight: true }
  ];

  const accountSection = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Sliders },
    { id: 'subscription', label: 'Subscription', icon: CreditCard }
  ];

  const handleItemClick = (item: any) => {
    if (item.isAiTrigger) {
      openAiAssistant();
      return;
    }
    if (item.isNotifTrigger) {
      openNotifications();
      return;
    }
    setActiveTab(item.id);
  };

  const handleConnectedAppClick = (platformId: PlatformId) => {
    const platform = safePlatforms.find(p => p.id === platformId);
    if (platform && !platform.connected && platform.statusOverride !== 'CONNECTED') {
      if (onOpenConnectorModal) {
        onOpenConnectorModal(platform);
        return;
      }
      setActiveTab('connections');
      return;
    }
    onSelectWorkspacePlatform(platformId);
    setActiveTab('inbox');
  };

  return (
    <aside
      id="desktop-sidebar-navigation"
      className={`hidden md:flex flex-col bg-[#0A1012]/95 backdrop-blur-2xl border-r border-teal-500/15 sticky top-0 z-30 transition-all duration-300 h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-teal-500/20 ${
        isCollapsed ? 'w-20 p-3' : 'w-72 p-4'
      }`}
    >
      {/* Sidebar Header & Collapse Toggle */}
      <div className="flex items-center justify-between pb-4 border-b border-teal-500/15">
        {!isCollapsed && (
          <div className="cursor-pointer" onClick={() => setActiveTab('home')}>
            <Logo size="md" showText={true} showDescriptor={true} />
          </div>
        )}

        {isCollapsed && (
          <div className="mx-auto cursor-pointer" onClick={() => setActiveTab('home')}>
            <Logo size="sm" variant="icon" />
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-xl bg-slate-900 border border-teal-500/20 text-slate-400 hover:text-teal-300 hover:border-teal-400/40 transition-all"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation Items Scroll Container */}
      <div className="flex-1 space-y-6 pt-4">
        {/* MAIN SECTION */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">
              MAIN
            </div>
          )}
          {mainSection.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleItemClick(item)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-900/50 via-teal-950/40 to-transparent text-white border-l-4 border-teal-400 shadow-[0_0_15px_rgba(13,148,136,0.2)]'
                    : 'text-slate-400 hover:text-white hover:bg-teal-950/20'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && item.badge && item.badge > 0 ? (
                  <span className="bg-gradient-to-r from-pink-500 to-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* CONNECT SECTION */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">
              CONNECT
            </div>
          )}
          {connectSection.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleItemClick(item)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-900/50 via-teal-950/40 to-transparent text-white border-l-4 border-teal-400 shadow-[0_0_15px_rgba(13,148,136,0.2)]'
                    : 'text-slate-400 hover:text-white hover:bg-teal-950/20'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* CONNECTED APPS SUBSECTION */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2 flex items-center justify-between">
              <span>CONNECTED APPS</span>
              <span className="text-[9px] text-teal-400 font-normal">Separate Workspaces</span>
            </div>
          )}

          <div className="space-y-1 pl-1">
            {safePlatforms.map((p) => {
              const unreadForP = p.unreadCount || 0;
              return (
                <button
                  key={p.id}
                  id={`sidebar-connected-app-${p.id}`}
                  onClick={() => handleConnectedAppClick(p.id)}
                  title={isCollapsed ? `${p.name} Workspace` : undefined}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-2.5 py-1.5 rounded-xl text-xs transition-all ${
                    p.connected
                      ? 'text-slate-300 hover:text-white hover:bg-teal-950/30'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative flex-shrink-0">
                      {renderPlatformIcon(p.id, 'w-3.5 h-3.5')}
                      {p.connected && (
                        <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      )}
                    </div>

                    {!isCollapsed && (
                      <span className="truncate text-[11px] font-medium">{p.name}</span>
                    )}
                  </div>

                  {!isCollapsed && unreadForP > 0 && (
                    <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow-sm">
                      {unreadForP}
                    </span>
                  )}
                </button>
              );
            })}

            {!isCollapsed && (
              <button
                onClick={() => setActiveTab('connections')}
                className="w-full flex items-center gap-2 px-3 py-1.5 mt-2 rounded-xl text-[11px] font-semibold text-teal-300 hover:text-white hover:bg-teal-900/30 transition-all border border-teal-500/25"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Connection</span>
              </button>
            )}
          </div>
        </div>

        {/* BUSINESS SECTION */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">
              BUSINESS
            </div>
          )}
          {businessSection.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleItemClick(item)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-900/50 via-teal-950/40 to-transparent text-white border-l-4 border-teal-400 shadow-[0_0_15px_rgba(13,148,136,0.2)]'
                    : 'text-slate-400 hover:text-white hover:bg-teal-950/20'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* TOOLS SECTION */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">
              TOOLS
            </div>
          )}
          {toolsSection.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleItemClick(item)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-900/50 via-teal-950/40 to-transparent text-white border-l-4 border-teal-400 shadow-[0_0_15px_rgba(13,148,136,0.2)]'
                    : 'text-slate-400 hover:text-white hover:bg-teal-950/20'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!isCollapsed && item.highlight && (
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                )}
              </button>
            );
          })}
        </div>

        {/* ACCOUNT SECTION */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">
              ACCOUNT
            </div>
          )}
          {accountSection.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleItemClick(item)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-900/50 via-teal-950/40 to-transparent text-white border-l-4 border-teal-400 shadow-[0_0_15px_rgba(13,148,136,0.2)]'
                    : 'text-slate-400 hover:text-white hover:bg-teal-950/20'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* BOTTOM SIDEBAR FOOTER */}
      <div className="pt-4 border-t border-teal-500/15 space-y-3 mt-4">
        {/* WIHGO AI POWER Usage Card */}
        {!isCollapsed ? (
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#0A1214]/90 to-teal-950/70 border border-teal-500/25 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black text-teal-300">
                <Zap className="w-3.5 h-3.5 text-teal-400" />
                <span>WIHGO AI POWER</span>
              </div>
              <button
                onClick={() => setActiveTab('subscription')}
                className="text-[10px] font-extrabold text-white bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 px-2 py-0.5 rounded-md hover:shadow-md border border-teal-400/30"
              >
                Upgrade
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-300">
                <span>Quota Usage</span>
                <span className="text-teal-400">80% remaining</span>
              </div>
              <div className="h-2 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-teal-500/20">
                <div className="h-full bg-gradient-to-r from-teal-400 via-slate-200 to-teal-300 rounded-full" style={{ width: '80%' }} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="WIHGO AI Power: 80% remaining">
            <Zap className="w-5 h-5 text-teal-400 animate-pulse" />
          </div>
        )}

        {/* User Identity Card */}
        <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-slate-900/60 hover:bg-teal-950/30 border border-teal-500/15 transition-all">
          <div
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
          >
            <UserAvatar name={safeUser.name} avatarUrl={safeUser.avatar} size="sm" showOnlineBadge />
            {!isCollapsed && (
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">{safeUser.name}</div>
                <div className="text-[10px] text-slate-400 truncate">{safeUser.email}</div>
              </div>
            )}
          </div>
          {!isCollapsed && onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
