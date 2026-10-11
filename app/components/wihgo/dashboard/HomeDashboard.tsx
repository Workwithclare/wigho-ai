"use client";

import React, { useState, useMemo } from 'react';
import { 
  UserProfile, 
  PlatformInfo, 
  DailySparkItem,
  PlatformId,
  FollowUpItem,
  AIMemoryRule,
  ActivityItem,
  Conversation,
  CalendarEvent,
  Task,
  Reminder
} from '../../../lib/wihgo/types';
import {
  Sparkles,
  TrendingUp,
  MessageSquare,
  Bot,
  Clock,
  ArrowRight,
  RotateCw,
  Zap,
  CheckCircle2,
  ChevronRight,
  Camera,
  ThumbsUp,
  Music2,
  Briefcase,
  X as XIcon,
  Hash,
  Mail,
  Send,
  Calendar,
  CheckSquare,
  Layers,
  Brain,
  Trash2,
  Bell,
  Search,
  Check,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { DAILY_SPARKS, INITIAL_FOLLOW_UPS, INITIAL_MEMORY_RULES } from '../../../lib/wihgo/mockData';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { PlatformConnectorModal } from '../connections/PlatformConnectorModal';
import { FloatingAIAssistantCompanion } from './FloatingAIAssistantCompanion';
import { BusinessHubCueCard } from './BusinessHubCueCard';

interface HomeDashboardProps {
  user?: UserProfile;
  platforms?: PlatformInfo[];
  sparks?: DailySparkItem[];
  dailySparks?: DailySparkItem[];
  conversations?: Conversation[];
  events?: CalendarEvent[];
  tasks?: Task[];
  reminders?: Reminder[];
  activities?: ActivityItem[];
  onClearActivities?: () => void;
  onNavigate?: (tab: string) => void;
  onOpenWorkspace?: (platformId: string) => void;
  openAiAssistant?: () => void;
  onToggleTask?: (taskId: string) => void;
  onToggleReminder?: (remId: string) => void;
  onOpenConnectorModal?: (platform: PlatformInfo) => void;
  onStatusChange?: (platformId: PlatformId, newStatus: 'CONNECTED' | 'NOT CONNECTED' | 'ACCESS REQUIRED') => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  user,
  platforms = [],
  sparks,
  dailySparks,
  conversations = [],
  events = [],
  tasks = [],
  reminders = [],
  onNavigate = (_tab: string) => {},
  onOpenWorkspace = (_platformId: string) => {},
  openAiAssistant = () => {},
  onToggleTask = (_taskId: string) => {},
  onOpenConnectorModal,
  onStatusChange
}) => {
  const [sparkIndex, setSparkIndex] = useState<number>(0);
  const [dashboardSearchQuery, setDashboardSearchQuery] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [commandInput, setCommandInput] = useState<string>('');
  const [activeModalFeature, setActiveModalFeature] = useState<string | null>(null);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [selectedLocalConnector, setSelectedLocalConnector] = useState<PlatformInfo | null>(null);

  const safeUser: UserProfile = user || {
    id: 'default',
    name: 'Clare',
    email: 'workwithclare1@gmail.com',
    avatar: '',
    plan: 'Pro Plan',
    profileType: 'business',
    companyName: 'WIHGO Business',
    role: 'Founder & Owner',
    businessDescription: '',
    phone: '',
    autoAiRepliesEnabled: false,
    dailySparkEnabled: true,
    emailNotifications: true,
    pushNotifications: true,
    preferredTone: 'professional'
  };

  // Dynamic user greeting name resolution (defaulting cleanly to "Clare" for user account)
  const greetingName = useMemo(() => {
    if (!user) return 'Clare';
    const email = user.email?.toLowerCase() || '';
    const name = user.name?.trim() || '';

    if (email.includes('clare') || name.toLowerCase().includes('clare')) {
      return 'Clare';
    }
    if (name && name !== 'WIHGO User' && name !== 'Partner') {
      const parts = name.split(/\s+/);
      return parts[0] || 'Clare';
    }
    return 'Clare';
  }, [user]);

  const safePlatforms = Array.isArray(platforms) ? platforms : [];
  const safeSparks = (Array.isArray(sparks) && sparks.length > 0)
    ? sparks
    : ((Array.isArray(dailySparks) && dailySparks.length > 0) ? dailySparks : DAILY_SPARKS);

  const rotateSpark = () => {
    if (safeSparks.length === 0) return;
    setSparkIndex((prev) => (prev + 1) % safeSparks.length);
  };

  const currentSpark = safeSparks[sparkIndex] || safeSparks[0] || { quote: 'Connect. Collaborate. Achieve.', category: 'motivation' };
  
  // Follow ups state
  const [followUps, setFollowUps] = useState<FollowUpItem[]>(INITIAL_FOLLOW_UPS);
  
  // Memory rules state
  const [memoryRules, setMemoryRules] = useState<AIMemoryRule[]>(INITIAL_MEMORY_RULES);
  const [showMemoryModal, setShowMemoryModal] = useState<boolean>(false);
  const [newRuleTitle, setNewRuleTitle] = useState<string>('');
  const [newRuleText, setNewRuleText] = useState<string>('');

  // AI Action Panel Checklist
  const [actionItems, setActionItems] = useState([
    { id: '1', title: 'Draft customer responses across Gmail & Inquiries', approved: false },
    { id: '2', title: 'Create 2 follow-up reminders for Apex Tech & Partner Leads', approved: false },
    { id: '3', title: 'Organize 3 high-priority tasks in My Day', approved: false },
    { id: '4', title: 'Prepare tomorrow\'s meeting schedule & brief', approved: false }
  ]);

  // Search Results Filtering across messages, tasks, calendar events, follow-ups, and platforms
  const searchResults = useMemo(() => {
    const q = dashboardSearchQuery.trim().toLowerCase();
    if (!q) return null;

    const matchedConvs = conversations.filter(c => 
      (c.senderName || c.participantName || '').toLowerCase().includes(q) || 
      c.lastMessage.toLowerCase().includes(q) ||
      c.platform.toLowerCase().includes(q)
    ).slice(0, 4);

    const matchedTasks = tasks.filter(t => 
      t.title.toLowerCase().includes(q) || 
      (t.tag && t.tag.toLowerCase().includes(q))
    ).slice(0, 4);

    const matchedEvents = events.filter(e => 
      e.title.toLowerCase().includes(q) ||
      (e.platform || '').toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedFollowUps = followUps.filter(f => 
      f.contactName.toLowerCase().includes(q) ||
      f.topic.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedPlatforms = safePlatforms.filter(p => 
      p.name.toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q)
    ).slice(0, 3);

    const totalMatches = matchedConvs.length + matchedTasks.length + matchedEvents.length + matchedFollowUps.length + matchedPlatforms.length;

    return {
      totalMatches,
      conversations: matchedConvs,
      tasks: matchedTasks,
      events: matchedEvents,
      followUps: matchedFollowUps,
      platforms: matchedPlatforms
    };
  }, [dashboardSearchQuery, conversations, tasks, events, followUps, safePlatforms]);

  // Business Pulse Computed Stats
  const totalUnread = useMemo(() => {
    return (conversations || []).reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  }, [conversations]);

  const pendingTasksCount = useMemo(() => {
    return (tasks || []).filter(t => !t.completed).length;
  }, [tasks]);

  const upcomingEventsCount = useMemo(() => {
    return (events || []).length;
  }, [events]);

  const pendingFollowUpsCount = useMemo(() => {
    return followUps.filter(f => f.status !== 'completed').length;
  }, [followUps]);

  // MVP active connectors vs upcoming
  const mvpPlatformIds: PlatformId[] = ['email', 'calendar'];
  const mvpPlatforms = safePlatforms.filter(p => mvpPlatformIds.includes(p.id));
  const upcomingPlatforms = safePlatforms.filter(p => !mvpPlatformIds.includes(p.id));

  // Platform Icon Helper
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
      case 'calendar': return <Calendar className={`${className} text-teal-400`} />;
      default: return <MessageSquare className={className} />;
    }
  };

  const handleCommandSubmit = (cmd?: string) => {
    const text = cmd || commandInput;
    if (!text.trim()) return;

    if (text.toLowerCase().includes('catch me up') || text.toLowerCase().includes('away')) {
      setActiveModalFeature('catch-up');
    } else if (text.toLowerCase().includes('attention')) {
      setActiveModalFeature('attention');
    } else if (text.toLowerCase().includes('plan')) {
      setActiveModalFeature('plan-day');
    } else if (text.toLowerCase().includes('reply') || text.toLowerCase().includes('who')) {
      setActiveModalFeature('needs-reply');
    } else if (text.toLowerCase().includes('follow')) {
      setActiveModalFeature('follow-ups');
    } else {
      setModalMessage(`WIHGO AI analyzed your query: "${text}". Processing across your connected business tools.`);
      setActiveModalFeature('generic');
    }
    setCommandInput('');
  };

  const toggleApproveAction = (id: string) => {
    setActionItems(prev => prev.map(item => item.id === id ? { ...item, approved: !item.approved } : item));
  };

  const toggleFollowUpComplete = (id: string) => {
    setFollowUps(prev => prev.map(f => f.id === id ? { ...f, status: f.status === 'completed' ? 'pending' : 'completed' } : f));
  };

  const addMemoryRule = () => {
    if (!newRuleTitle.trim() || !newRuleText.trim()) return;
    const rule: AIMemoryRule = {
      id: `mem-${Date.now()}`,
      title: newRuleTitle.trim(),
      rule: newRuleText.trim(),
      category: 'workflow',
      active: true
    };
    setMemoryRules(prev => [...prev, rule]);
    setNewRuleTitle('');
    setNewRuleText('');
  };

  const deleteMemoryRule = (id: string) => {
    setMemoryRules(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* ============================================================ */}
      {/* 1. WELCOME BACK, CLARE                                       */}
      {/* ============================================================ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-slate-200">{greetingName}</span> 👋
            </h1>
          </div>
          <p className="text-xs font-semibold text-teal-400/90 tracking-wide mt-1 uppercase flex flex-wrap items-center gap-1.5">
            <span>WIHGO AI CONNECT HUB</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">CONNECT. COLLABORATE. ACHIEVE.</span>
            <span className="text-slate-600">•</span>
            <span className="text-teal-300">ONE HUB. ALL YOUR CONNECTIONS.</span>
          </p>
        </div>

        {/* Daily Spark Motivational Card */}
        <div className="bg-gradient-to-r from-slate-900/90 via-teal-950/40 to-slate-900/90 border border-teal-500/20 rounded-2xl p-3 sm:p-4 shadow-[0_0_20px_rgba(20,184,166,0.12)] flex items-center justify-between gap-3 max-w-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-400/30 text-teal-400 flex-shrink-0">
              <Zap className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-wider text-teal-400 uppercase">
                Daily Spark
              </div>
              <div className="text-xs font-black text-white tracking-wide mt-0.5">
                "{currentSpark.quote}"
              </div>
            </div>
          </div>

          <button
            id="btn-rotate-spark"
            onClick={rotateSpark}
            className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors flex-shrink-0 cursor-pointer"
            title="Next Motivational Quote"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. SEARCH WIHGO (IMMEDIATELY BELOW WELCOME)                  */}
      {/* ============================================================ */}
      <div className="relative">
        <div className="bg-slate-900/90 border border-teal-500/20 hover:border-teal-400/40 rounded-2xl p-2.5 sm:p-3 shadow-lg backdrop-blur-xl transition-all">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-teal-400 pointer-events-none" />
            <input
              type="text"
              id="wihgo-dashboard-search-input"
              value={dashboardSearchQuery}
              onChange={(e) => setDashboardSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search WIHGO across messages, tasks, calendar events, follow-ups & connected services..."
              className="w-full bg-slate-950/90 text-sm text-slate-100 placeholder-slate-400 rounded-xl pl-10 pr-20 py-2.5 border border-slate-800 focus:border-teal-400/70 focus:outline-none transition-all shadow-inner"
            />
            {dashboardSearchQuery && (
              <button
                onClick={() => setDashboardSearchQuery('')}
                className="absolute right-3 p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Clear Search"
              >
                <XIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Live Search Results Dropdown */}
        {searchResults && (
          <div className="absolute top-full left-0 right-0 z-30 mt-2 bg-[#090D14] border border-teal-500/30 rounded-2xl p-4 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-2xl max-h-96 overflow-y-auto space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                Search Results ({searchResults.totalMatches} matches found)
              </span>
              <button
                onClick={() => setDashboardSearchQuery('')}
                className="text-[10px] text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            {searchResults.totalMatches === 0 && (
              <p className="text-xs text-slate-400 py-3 text-center">
                No matching messages, tasks, or records found for "{dashboardSearchQuery}".
              </p>
            )}

            {/* Matching Messages */}
            {searchResults.conversations.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3 h-3 text-teal-400" />
                  <span>Messages & Conversations</span>
                </div>
                <div className="grid gap-1.5">
                  {searchResults.conversations.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        onNavigate('inbox');
                        setDashboardSearchQuery('');
                      }}
                      className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-teal-500/30 cursor-pointer flex items-center justify-between transition-all"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>{c.senderName || c.participantName}</span>
                          <span className="text-[10px] uppercase font-mono text-teal-400 bg-teal-950/60 px-1.5 py-0.2 rounded border border-teal-500/20">{c.platform}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">{c.lastMessage}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Tasks */}
            {searchResults.tasks.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckSquare className="w-3 h-3 text-cyan-400" />
                  <span>Tasks</span>
                </div>
                <div className="grid gap-1.5">
                  {searchResults.tasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        onNavigate('tasks');
                        setDashboardSearchQuery('');
                      }}
                      className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/30 cursor-pointer flex items-center justify-between transition-all"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white">{t.title}</div>
                        {t.tag && <span className="text-[10px] text-slate-400">{t.tag}</span>}
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${t.completed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-300'}`}>
                        {t.completed ? 'Done' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Events */}
            {searchResults.events.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-purple-400" />
                  <span>Calendar Events</span>
                </div>
                <div className="grid gap-1.5">
                  {searchResults.events.map((e) => (
                    <div
                      key={e.id}
                      onClick={() => {
                        onNavigate('calendar');
                        setDashboardSearchQuery('');
                      }}
                      className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/30 cursor-pointer flex items-center justify-between transition-all"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white">{e.title}</div>
                        <div className="text-[10px] text-slate-400">{e.date} • {e.time}</div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Follow-Ups */}
            {searchResults.followUps.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>Follow-Ups</span>
                </div>
                <div className="grid gap-1.5">
                  {searchResults.followUps.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => {
                        onNavigate('followups');
                        setDashboardSearchQuery('');
                      }}
                      className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/30 cursor-pointer flex items-center justify-between transition-all"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white">{f.contactName}</div>
                        <div className="text-[10px] text-slate-400">{f.topic}</div>
                      </div>
                      <span className="text-[10px] font-bold text-amber-400">{f.followUpDate}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* 3. BUSINESS PULSE (COMPACT QUICK BUSINESS HEALTH SNAPSHOT)   */}
      {/* ============================================================ */}
      <div className="bg-slate-900/90 border border-teal-500/15 rounded-3xl p-5 backdrop-blur-xl shadow-xl space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-400" />
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">Business Pulse</h2>
          </div>
          <span className="text-[10px] font-semibold text-slate-400">Real-time operational activity overview</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
          {/* Unread Communications */}
          <div 
            onClick={() => onNavigate('inbox')}
            className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/90 hover:border-teal-500/40 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Unread Messages</div>
            <div className="text-xl font-black text-teal-400 mt-1">{totalUnread}</div>
            <div className="text-[9px] text-slate-400 mt-0.5">Across channels</div>
          </div>

          {/* Pending Tasks */}
          <div 
            onClick={() => onNavigate('tasks')}
            className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/90 hover:border-cyan-500/40 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Pending Tasks</div>
            <div className="text-xl font-black text-cyan-300 mt-1">{pendingTasksCount}</div>
            <div className="text-[9px] text-slate-400 mt-0.5">Awaiting completion</div>
          </div>

          {/* Upcoming Meetings */}
          <div 
            onClick={() => onNavigate('calendar')}
            className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/90 hover:border-purple-500/40 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Upcoming Events</div>
            <div className="text-xl font-black text-purple-400 mt-1">{upcomingEventsCount}</div>
            <div className="text-[9px] text-slate-400 mt-0.5">Google Calendar</div>
          </div>

          {/* Follow-Ups */}
          <div 
            onClick={() => onNavigate('followups')}
            className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/90 hover:border-amber-500/40 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Follow-Ups</div>
            <div className="text-xl font-black text-amber-400 mt-1">{pendingFollowUpsCount}</div>
            <div className="text-[9px] text-slate-400 mt-0.5">Attention needed</div>
          </div>

          {/* Important Notifications */}
          <div 
            onClick={() => onNavigate('important')}
            className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/90 hover:border-rose-500/40 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Key Alerts</div>
            <div className="text-xl font-black text-rose-400 mt-1">3</div>
            <div className="text-[9px] text-slate-400 mt-0.5">High priority</div>
          </div>

          {/* Connected Services Activity */}
          <div 
            onClick={() => onNavigate('connect')}
            className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800/90 hover:border-teal-500/40 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">MVP Services</div>
            <div className="text-xl font-black text-teal-300 mt-1">2 / 2</div>
            <div className="text-[9px] text-slate-400 mt-0.5">Gmail & Calendar</div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. FOLLOW-UPS ("WHAT DO I NEED TO ACT ON?")                  */}
      {/* ============================================================ */}
      <div className="bg-slate-900/90 border border-teal-500/15 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">FOLLOW-UPS</h2>
              <p className="text-xs text-slate-400">What do I need to act on? Unanswered messages, client touches & urgent actions</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('followups')}
            className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Follow-Ups Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-3">Contact & Topic</th>
                <th className="py-2.5 px-3">Platform</th>
                <th className="py-2.5 px-3">Last Contact</th>
                <th className="py-2.5 px-3">Target Date</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {followUps.map((f) => (
                <tr key={f.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                    <img src={f.contactAvatar} alt={f.contactName} className="w-7 h-7 rounded-full object-cover border border-slate-700" />
                    <div>
                      <div>{f.contactName}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{f.topic}</div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="capitalize font-semibold text-teal-400">{f.platform}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{f.lastContact}</td>
                  <td className="py-3 px-3 text-slate-300 font-mono">{f.followUpDate}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      f.status === 'completed' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : f.status === 'due_today'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {f.status === 'completed' ? 'Completed' : f.status === 'due_today' ? 'Due Today' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onOpenWorkspace(f.platform)}
                        className="p-1.5 px-2.5 rounded-lg bg-teal-500/10 text-teal-300 hover:text-white border border-teal-500/30 text-[10px] font-semibold transition-colors cursor-pointer"
                      >
                        Draft Reply
                      </button>
                      <button
                        onClick={() => toggleFollowUpComplete(f.id)}
                        className="p-1.5 px-2.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-[10px] font-semibold transition-colors cursor-pointer"
                      >
                        {f.status === 'completed' ? 'Reopen' : 'Mark Done'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 5. WIHGO INTELLIGENCE (AI BUSINESS ASSISTANT & INSIGHTS)     */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-slate-900/95 via-teal-950/60 to-slate-900/95 border border-teal-500/30 rounded-3xl p-5 sm:p-6 shadow-[0_0_35px_rgba(20,184,166,0.18)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-700 text-white shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">WIHGO Intelligence</h2>
              <p className="text-xs text-slate-400">AI business insight, priority suggestions & multi-channel assistance</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMemoryModal(true)}
              className="text-xs font-semibold text-teal-300 bg-teal-500/10 border border-teal-400/20 hover:border-teal-400/50 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Brain className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">WIHGO Memory</span>
            </button>
            <button
              onClick={openAiAssistant}
              className="text-xs font-bold text-white bg-gradient-to-r from-teal-600 to-teal-800 hover:from-teal-500 hover:to-teal-700 px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-sm border border-teal-400/30 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-200" />
              <span>Open Assistant</span>
            </button>
          </div>
        </div>

        {/* Command Search Box */}
        <div className="relative">
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCommandSubmit();
            }}
            placeholder="Ask WIHGO anything (e.g. Catch me up, What needs my attention, Plan my day)..."
            className="w-full bg-slate-950/90 text-sm text-white placeholder-slate-400 rounded-2xl pl-4 pr-12 py-3.5 border border-teal-500/30 focus:border-teal-400 focus:outline-none shadow-inner"
          />
          <button
            onClick={() => handleCommandSubmit()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-gradient-to-r from-teal-500 to-teal-700 text-white hover:opacity-90 transition-opacity shadow-md cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Suggested Command Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1">Suggested:</span>
          {[
            { label: '⚡ Catch me up', action: 'Catch me up' },
            { label: 'What needs my attention?', action: 'What needs my attention?' },
            { label: 'Plan my day', action: 'Plan my day' },
            { label: 'Who needs a reply?', action: 'Who needs a reply?' },
            { label: 'Show my follow-ups', action: 'Show my follow-ups' }
          ].map((cmd, idx) => (
            <button
              key={idx}
              onClick={() => handleCommandSubmit(cmd.action)}
              className="py-1.5 px-3 rounded-xl bg-slate-800/80 hover:bg-teal-500/20 border border-slate-700/80 hover:border-teal-400/40 text-xs font-semibold text-slate-300 hover:text-teal-300 transition-all whitespace-nowrap flex-shrink-0 shadow-sm cursor-pointer"
            >
              {cmd.label}
            </button>
          ))}
        </div>

        {/* AI Action Panel: "Take Care of It" */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">Take Care of It (Suggested Next Actions)</span>
            </div>
            <button
              onClick={() => {
                setActionItems(prev => prev.map(item => ({ ...item, approved: true })));
                setActiveModalFeature('action-approved');
              }}
              className="text-[11px] font-bold text-teal-300 hover:text-white bg-teal-950/60 border border-teal-500/30 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              Approve All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {actionItems.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleApproveAction(item.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                  item.approved
                    ? 'bg-teal-950/40 border-teal-500/50 text-teal-200 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-teal-500/30'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors ${
                    item.approved ? 'bg-teal-500 border-teal-400 text-slate-950' : 'border-slate-600 bg-slate-900'
                  }`}>
                    {item.approved && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="text-xs font-medium truncate">{item.title}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">
                  {item.approved ? 'Approved' : 'Review'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 6. CONNECTORS (MVP INTEGRATIONS & UPCOMING SERVICES)         */}
      {/* ============================================================ */}
      <div className="bg-slate-900/90 border border-teal-500/15 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-400" />
              <h2 className="text-base font-extrabold text-white">CONNECTORS</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Active MVP integrations and upcoming platform connectors
            </p>
          </div>

          <button
            onClick={() => onNavigate('connect')}
            className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Manage All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Group A: MVP Active Integrations */}
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>MVP Core Integrations (Functional)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mvpPlatforms.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  if (onOpenConnectorModal) {
                    onOpenConnectorModal(p);
                  } else {
                    setSelectedLocalConnector(p);
                  }
                }}
                className="p-3.5 rounded-2xl bg-slate-950/80 border border-teal-500/30 hover:border-teal-400/60 transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-teal-500/20">
                    {renderPlatformIcon(p.id, 'w-5 h-5')}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors flex items-center gap-1.5">
                      <span>{p.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">{p.category} • {p.lastSynced || 'Active'}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    p.connected 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-teal-500/10 text-teal-300 border-teal-500/30'
                  }`}>
                    {p.connected ? 'Connected' : 'Configure'}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Group B: Future Connectors */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-slate-500" />
            <span>Future Connectors (Available in Next Release)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {upcomingPlatforms.map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/70 flex items-center justify-between gap-2 opacity-80"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                    {renderPlatformIcon(p.id, 'w-4 h-4')}
                  </div>
                  <span className="text-xs font-semibold text-slate-300 truncate">{p.name}</span>
                </div>
                <span className="text-[9px] font-bold text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 whitespace-nowrap">
                  Coming Soon
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 7. OTHER DASHBOARD INFORMATION (BUSINESS HUB CUE & MEMORY)   */}
      {/* ============================================================ */}
      <BusinessHubCueCard
        onOpenBusinessHub={() => onNavigate('business-hub')}
      />

      {/* WIHGO MEMORY MODAL */}
      {showMemoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-teal-500/30 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-[0_0_50px_rgba(20,184,166,0.3)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Brain className="w-6 h-6 text-teal-400" />
                <div>
                  <h3 className="text-base font-bold text-white">WIHGO AI Memory</h3>
                  <p className="text-xs text-slate-400">Teach WIHGO your custom preferences and business rules</p>
                </div>
              </div>
              <button
                onClick={() => setShowMemoryModal(false)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Existing Memory Rules */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Active Memory Rules</h4>
              {memoryRules.map((m) => (
                <div key={m.id} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-white">{m.title}</div>
                    <p className="text-xs text-slate-400 mt-0.5">{m.rule}</p>
                  </div>
                  <button
                    onClick={() => deleteMemoryRule(m.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Memory Rule Form */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-teal-400">Add New Memory Instruction</h4>
              <input
                type="text"
                placeholder="Rule Title (e.g. VIP Customer Policy)"
                value={newRuleTitle}
                onChange={(e) => setNewRuleTitle(e.target.value)}
                className="w-full bg-slate-900 text-xs text-white p-2.5 rounded-xl border border-slate-800 focus:outline-none"
              />
              <textarea
                rows={2}
                placeholder="Rule Details (e.g. Treat high-value client inquiries with highest priority)..."
                value={newRuleText}
                onChange={(e) => setNewRuleText(e.target.value)}
                className="w-full bg-slate-900 text-xs text-white p-2.5 rounded-xl border border-slate-800 focus:outline-none"
              />
              <button
                onClick={addMemoryRule}
                className="w-full py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 cursor-pointer"
              >
                Save Rule to Memory
              </button>
            </div>

            <button
              onClick={() => setShowMemoryModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* FEATURE INTERACTION MODAL */}
      {activeModalFeature && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-teal-500/30 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-[0_0_50px_rgba(20,184,166,0.3)]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-400" />
                <h3 className="text-sm font-bold text-white capitalize">
                  WIHGO AI Feature Insight
                </h3>
              </div>
              <button
                onClick={() => setActiveModalFeature(null)}
                className="text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeModalFeature === 'catch-up' && "WIHGO completed a cross-platform scan across your connected Gmail, Calendar, and Inquiry accounts. Zero missed customer opportunities recorded."}
              {activeModalFeature === 'create-tasks' && "New tasks have been generated and synced directly into your Tasks view."}
              {activeModalFeature === 'action-review' && "AI action items prepared. You can review each draft before confirming send."}
              {activeModalFeature === 'action-approved' && "All requested AI actions have been approved and queued for dispatch."}
              {activeModalFeature === 'organize-next' && "WIHGO has prioritized your schedule and organized your top recommended actions for today."}
              {activeModalFeature === 'generic' && modalMessage}
            </p>

            <button
              onClick={() => setActiveModalFeature(null)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-teal-800 text-white font-bold text-xs hover:opacity-90 cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Local Platform Connector Modal fallback */}
      {selectedLocalConnector && (
        <PlatformConnectorModal
          isOpen={true}
          onClose={() => setSelectedLocalConnector(null)}
          platform={platforms.find(p => p.id === selectedLocalConnector.id) || selectedLocalConnector}
          onStatusChange={(platformId: any, newStatus: any) => {
            if (onStatusChange) {
              onStatusChange(platformId, newStatus);
            }
            setSelectedLocalConnector(null);
          }}
          onOpenWorkspace={(platformId: any) => {
            onOpenWorkspace(platformId);
            setSelectedLocalConnector(null);
          }}
        />
      )}

      {/* Floating WIHGO AI Assistant Business Companion */}
      <FloatingAIAssistantCompanion
        onOpenAssistant={openAiAssistant}
        userName={safeUser.name}
      />
    </div>
  );
};
