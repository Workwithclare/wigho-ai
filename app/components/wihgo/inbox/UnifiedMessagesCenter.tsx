"use client";

import React, { useState, useMemo } from 'react';
import { 
  Conversation, 
  Message, 
  PlatformInfo, 
  PlatformId, 
  AIReplyTone,
  UserProfile 
} from '../../../lib/wihgo/types';
import {
  MessageSquare,
  Search,
  Inbox,
  Mail,
  Star,
  Send,
  Archive,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  Paperclip,
  Bot,
  Copy,
  Check,
  Clock,
  ExternalLink,
  ShieldAlert,
  Filter,
  Camera,
  ThumbsUp,
  Music2,
  Briefcase,
  ChevronRight,
  RefreshCw,
  MoreVertical,
  CornerDownRight,
  Lock,
  Plus,
  Brain
} from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { BusinessMemoryService } from '../../../lib/wihgo/memory/businessMemory';

interface UnifiedMessagesCenterProps {
  user: UserProfile;
  platforms: PlatformInfo[];
  conversations: Conversation[];
  initialPlatformId?: PlatformId;
  onSendMessage: (conversationId: string, text: string) => void;
  onNavigateTab: (tab: string) => void;
  onOpenConnectorModal: (platform: PlatformInfo) => void;
  openAiAssistant: (initialPrompt?: string) => void;
  onSaveConversation?: (conv: Conversation) => void;
}

type FolderType = 'inbox' | 'unread' | 'important' | 'sent' | 'archived';
type PlatformFilterType = 'all' | 'whatsapp' | 'instagram' | 'facebook' | 'tiktok' | 'linkedin' | 'email';

export const UnifiedMessagesCenter: React.FC<UnifiedMessagesCenterProps> = ({
  user,
  platforms,
  conversations,
  initialPlatformId,
  onSendMessage,
  onNavigateTab,
  onOpenConnectorModal,
  openAiAssistant,
  onSaveConversation
}) => {
  // Folder Navigation
  const [activeFolder, setActiveFolder] = useState<FolderType>('inbox');
  
  // Platform Filter
  const [activePlatformFilter, setActivePlatformFilter] = useState<PlatformFilterType>(
    (initialPlatformId as PlatformFilterType) || 'all'
  );

  // Search & Active Thread
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);

  // Message Composer
  const [inputText, setInputText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [showAttachmentNotice, setShowAttachmentNotice] = useState<boolean>(false);

  // AI Assistant Drawer / Inline state
  const [showAiReplyModal, setShowAiReplyModal] = useState<boolean>(false);
  const [showContinuityModal, setShowContinuityModal] = useState<boolean>(false);
  const [aiActionType, setAiActionType] = useState<'summarize' | 'draft_professional' | 'draft_friendly' | 'follow_up' | 'custom'>('draft_professional');
  const [aiResultText, setAiResultText] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [copiedAi, setCopiedAi] = useState<boolean>(false);

  // Platform Connector Status Helper
  const getPlatformInfo = (platformId: string): PlatformInfo | undefined => {
    return platforms.find(p => p.id === platformId || (platformId === 'email' && p.id === 'email'));
  };

  const isPlatformConnected = (platformId: string): boolean => {
    const p = getPlatformInfo(platformId);
    if (!p) return false;
    // Check if status is explicitly CONNECTED or connected is true and not requiring access
    return (p.connected && p.statusOverride === 'CONNECTED') || (p.connected && !p.statusOverride);
  };

  // Connected platform IDs list
  const connectedPlatformIds = useMemo(() => {
    return platforms
      .filter(p => (p.connected && p.statusOverride === 'CONNECTED') || (p.connected && !p.statusOverride))
      .map(p => p.id);
  }, [platforms]);

  // Real connected conversations: only include conversations from connected platforms
  const realConversations = useMemo(() => {
    return conversations.filter(c => {
      // Must belong to a connected platform
      const isConnected = isPlatformConnected(c.platform);
      return isConnected;
    });
  }, [conversations, platforms]);

  // Filtered conversations based on Folder, Platform Filter & Search
  const filteredConversations = useMemo(() => {
    return realConversations.filter(conv => {
      // Platform filter
      if (activePlatformFilter !== 'all') {
        const targetPlatform = activePlatformFilter === 'email' ? 'email' : activePlatformFilter;
        if (conv.platform !== targetPlatform) return false;
      }

      // Folder filter
      if (activeFolder === 'unread') {
        if (conv.unreadCount <= 0) return false;
      } else if (activeFolder === 'important') {
        if (!conv.isImportant && !conv.isUrgent) return false;
      } else if (activeFolder === 'archived') {
        if (!conv.isArchived) return false;
      } else if (activeFolder === 'sent') {
        // Conversation where the latest message was from user
        const lastMsg = conv.messages[conv.messages.length - 1];
        if (!lastMsg?.isFromUser) return false;
      } else {
        // Standard 'inbox' folder: show non-archived
        if (conv.isArchived) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = conv.participantName.toLowerCase().includes(q);
        const matchesHandle = conv.participantHandle?.toLowerCase().includes(q);
        const matchesMessage = conv.lastMessage.toLowerCase().includes(q);
        const matchesPlatform = conv.platform.toLowerCase().includes(q);
        if (!matchesName && !matchesHandle && !matchesMessage && !matchesPlatform) {
          return false;
        }
      }

      return true;
    });
  }, [realConversations, activePlatformFilter, activeFolder, searchQuery]);

  // Selected Active Conversation
  const activeConversation = useMemo(() => {
    if (!selectedConvId) return null;
    return realConversations.find(c => c.id === selectedConvId) || null;
  }, [selectedConvId, realConversations]);

  // Active platform details
  const activePlatformMeta = activeConversation ? getPlatformInfo(activeConversation.platform) : null;
  const activePlatformIsConnected = activeConversation ? isPlatformConnected(activeConversation.platform) : false;

  // Render Platform Icon Helper
  const renderPlatformIcon = (platformId: string, className = 'w-4 h-4') => {
    switch (platformId) {
      case 'whatsapp':
        return <WhatsAppIcon className={className} />;
      case 'instagram':
        return <Camera className={`${className} text-pink-400`} />;
      case 'facebook':
        return <ThumbsUp className={`${className} text-blue-400`} />;
      case 'tiktok':
        return <Music2 className={`${className} text-cyan-400`} />;
      case 'linkedin':
        return <Briefcase className={`${className} text-sky-400`} />;
      case 'email':
      case 'gmail':
        return <Mail className={`${className} text-rose-400`} />;
      default:
        return <MessageSquare className={`${className} text-slate-400`} />;
    }
  };

  // Toggle Important Flag
  const handleToggleImportant = (e: React.MouseEvent, conv: Conversation) => {
    e.stopPropagation();
    const updated = { ...conv, isImportant: !conv.isImportant };
    if (onSaveConversation) {
      onSaveConversation(updated);
    }
  };

  // Toggle Archive Flag
  const handleToggleArchive = (e: React.MouseEvent, conv: Conversation) => {
    e.stopPropagation();
    const updated = { 
      ...conv, 
      isArchived: !conv.isArchived,
      folder: (!conv.isArchived ? 'archived' : 'inbox') as any
    };
    if (onSaveConversation) {
      onSaveConversation(updated);
    }
    if (selectedConvId === conv.id) {
      setSelectedConvId(null);
    }
  };

  // Mark conversation read
  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConvId(conv.id);
    if (conv.unreadCount > 0) {
      const updated = {
        ...conv,
        unreadCount: 0,
        messages: conv.messages.map(m => ({ ...m, isRead: true }))
      };
      if (onSaveConversation) {
        onSaveConversation(updated);
      }
    }
  };

  // AI Actions inside conversation
  const handleTriggerAiAction = async (action: 'summarize' | 'draft_professional' | 'draft_friendly' | 'follow_up') => {
    if (!activeConversation) return;
    setAiActionType(action);
    setShowAiReplyModal(true);
    setIsGeneratingAi(true);
    setAiResultText('');

    const threadContent = activeConversation.messages
      .map(m => `${m.senderName} (${m.timestamp}): ${m.content}`)
      .join('\n');

    let toolId = 'tool-reply';
    let promptTone: AIReplyTone = 'professional';

    if (action === 'summarize') {
      toolId = 'tool-summarize';
    } else if (action === 'draft_friendly') {
      promptTone = 'friendly';
    } else if (action === 'follow_up') {
      promptTone = 'persuasive';
    }

    try {
      const res = await fetch('/api/ai/tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId,
          input: threadContent,
          tone: promptTone,
          extraContext: {
            platform: activeConversation.platform,
            sender: activeConversation.participantName,
            action
          }
        })
      });

      const data = await res.json();
      if (data.result) {
        setAiResultText(data.result);
      } else {
        fallbackAiResponse(action);
      }
    } catch (err) {
      fallbackAiResponse(action);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const fallbackAiResponse = (action: string) => {
    if (!activeConversation) return;
    if (action === 'summarize') {
      setAiResultText(`Summary for ${activeConversation.participantName} (${activeConversation.platform.toUpperCase()}):\n• Inquiry: Follow-up regarding business collaboration and inquiries.\n• Key Intent: Awaiting active review and response.\n• Status: Active thread.`);
    } else if (action === 'draft_friendly') {
      setAiResultText(`Hi ${activeConversation.participantName}! 😊 Thanks so much for reaching out. I'd love to help you with this. Let me check the details and get right back to you!`);
    } else if (action === 'follow_up') {
      setAiResultText(`Hi ${activeConversation.participantName}, just following up on our previous conversation to see if you had any questions or needed further assistance. Looking forward to connecting!`);
    } else {
      setAiResultText(`Hello ${activeConversation.participantName},\n\nThank you for reaching out via ${activeConversation.platform}. We have received your inquiry and are reviewing the details.\n\nBest regards,\n${user.name || 'WIHGO Business Team'}`);
    }
  };

  // Copy AI response
  const handleCopyAi = () => {
    if (!aiResultText) return;
    navigator.clipboard.writeText(aiResultText);
    setCopiedAi(true);
    setTimeout(() => setCopiedAi(false), 2000);
  };

  // Insert AI response into Composer
  const handleInsertAiToComposer = () => {
    if (!aiResultText) return;
    setInputText(aiResultText);
    setShowAiReplyModal(false);
  };

  // Send Message Handler
  const handleSend = () => {
    if (!inputText.trim() || !activeConversation) return;

    if (!activePlatformIsConnected) {
      alert(`Reply requires active platform authorization for ${activeConversation.platform.toUpperCase()}. Please configure this connector in Connectors settings.`);
      return;
    }

    setIsSending(true);
    onSendMessage(activeConversation.id, inputText.trim());
    setInputText('');
    setIsSending(false);
  };

  // Platform Filter Buttons config
  const PLATFORM_FILTER_OPTIONS: { id: PlatformFilterType; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All', icon: <Filter className="w-3.5 h-3.5" /> },
    { id: 'whatsapp', label: 'WhatsApp', icon: renderPlatformIcon('whatsapp', 'w-3.5 h-3.5') },
    { id: 'instagram', label: 'Instagram', icon: renderPlatformIcon('instagram', 'w-3.5 h-3.5') },
    { id: 'facebook', label: 'Facebook', icon: renderPlatformIcon('facebook', 'w-3.5 h-3.5') },
    { id: 'tiktok', label: 'TikTok', icon: renderPlatformIcon('tiktok', 'w-3.5 h-3.5') },
    { id: 'linkedin', label: 'LinkedIn', icon: renderPlatformIcon('linkedin', 'w-3.5 h-3.5') },
    { id: 'email', label: 'Gmail', icon: renderPlatformIcon('email', 'w-3.5 h-3.5') }
  ];

  // Folder Navigation Tabs config
  const FOLDER_TABS: { id: FolderType; label: string; icon: React.ReactNode; count?: number }[] = [
    { 
      id: 'inbox', 
      label: 'Inbox', 
      icon: <Inbox className="w-4 h-4" />, 
      count: realConversations.filter(c => !c.isArchived).length 
    },
    { 
      id: 'unread', 
      label: 'Unread', 
      icon: <Mail className="w-4 h-4" />, 
      count: realConversations.filter(c => c.unreadCount > 0).length 
    },
    { 
      id: 'important', 
      label: 'Important', 
      icon: <Star className="w-4 h-4" />, 
      count: realConversations.filter(c => c.isImportant || c.isUrgent).length 
    },
    { 
      id: 'sent', 
      label: 'Sent', 
      icon: <Send className="w-4 h-4" />,
      count: realConversations.filter(c => c.messages[c.messages.length - 1]?.isFromUser).length
    },
    { 
      id: 'archived', 
      label: 'Archived', 
      icon: <Archive className="w-4 h-4" />, 
      count: realConversations.filter(c => c.isArchived).length 
    }
  ];

  return (
    <div id="wihgo-unified-messages-center" className="space-y-4 pb-20 md:pb-8 max-w-7xl mx-auto">
      {/* Top Header & Overview Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-indigo-500/15 p-4 sm:p-5 rounded-3xl backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Unified Messages Center</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                  Live Hub
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage all cross-platform business conversations in one secure place
              </p>
            </div>
          </div>
        </div>

        {/* Global Search & Connector Quick Link */}
        <div className="flex items-center gap-3">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              id="input-search-messages"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations, senders..."
              className="w-full bg-slate-950/80 text-xs text-white placeholder-slate-500 rounded-2xl pl-8 pr-3 py-2 border border-slate-800 focus:border-cyan-400 focus:outline-none transition-colors"
            />
          </div>

          <button
            id="btn-nav-connectors"
            onClick={() => onNavigateTab('connections')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-all shrink-0"
            title="Manage platform connectors"
          >
            <span>Connectors</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* Main Unified Center Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[640px]">
        {/* Left Column: Folders & Platform Filters (Desktop: 3 cols, Mobile: full) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Folders Card */}
          <div className="bg-slate-900/80 border border-indigo-500/15 p-3 rounded-3xl backdrop-blur-xl">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-3 py-1 mb-1">
              Folders
            </div>
            <div className="space-y-1">
              {FOLDER_TABS.map((folder) => {
                const isActive = activeFolder === folder.id;
                return (
                  <button
                    key={folder.id}
                    id={`folder-tab-${folder.id}`}
                    onClick={() => setActiveFolder(folder.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-600/30 text-white border border-cyan-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>
                        {folder.icon}
                      </span>
                      <span>{folder.label}</span>
                    </div>
                    {typeof folder.count === 'number' && folder.count > 0 && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {folder.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Platform Status & Quick Connectors Summary */}
          <div className="bg-slate-900/80 border border-indigo-500/15 p-3.5 rounded-3xl backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Platform Status
              </span>
              <button
                onClick={() => onNavigateTab('connections')}
                className="text-[10px] font-bold text-cyan-400 hover:underline flex items-center gap-0.5"
              >
                Configure
              </button>
            </div>

            <div className="space-y-2">
              {[
                { id: 'email', name: 'Gmail' },
                { id: 'whatsapp', name: 'WhatsApp' },
                { id: 'instagram', name: 'Instagram' },
                { id: 'facebook', name: 'Facebook' },
                { id: 'tiktok', name: 'TikTok' },
                { id: 'linkedin', name: 'LinkedIn' }
              ].map(item => {
                const connected = isPlatformConnected(item.id);
                const info = getPlatformInfo(item.id);
                const statusLabel = connected 
                  ? 'Connected' 
                  : (info?.statusOverride === 'ACCESS REQUIRED' ? 'Access Required' : 'Not Connected');

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      {renderPlatformIcon(item.id, 'w-4 h-4')}
                      <span className="font-semibold text-slate-200 text-xs">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                      <span className={`text-[10px] font-medium ${
                        connected ? 'text-emerald-400' : 'text-slate-400'
                      }`}>
                        {statusLabel}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Middle & Right Columns: Platform Filters + Message List & Conversation View (9 cols) */}
        <div className="lg:col-span-9 flex flex-col space-y-4">
          {/* Platform Filters Bar */}
          <div className="bg-slate-900/80 border border-indigo-500/15 p-2.5 rounded-3xl backdrop-blur-xl flex items-center gap-1.5 overflow-x-auto">
            {PLATFORM_FILTER_OPTIONS.map((filter) => {
              const isSelected = activePlatformFilter === filter.id;
              const isConn = filter.id === 'all' || isPlatformConnected(filter.id);

              return (
                <button
                  key={filter.id}
                  id={`platform-filter-${filter.id}`}
                  onClick={() => setActivePlatformFilter(filter.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                      : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {filter.icon}
                  <span>{filter.label}</span>
                  {!isConn && filter.id !== 'all' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 ml-0.5" title="Access Required" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Split Content: Message List vs Conversation View */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1">
            {/* Conversations List Column (5 cols on desktop, hidden on mobile if active thread is open) */}
            <div className={`md:col-span-5 bg-slate-900/80 border border-indigo-500/15 rounded-3xl overflow-hidden backdrop-blur-xl flex flex-col h-[560px] ${
              selectedConvId ? 'hidden md:flex' : 'flex'
            }`}>
              {/* List Header */}
              <div className="p-3.5 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 capitalize">
                  {activeFolder} Messages ({filteredConversations.length})
                </span>
                <span className="text-[10px] text-slate-500">
                  {activePlatformFilter === 'all' ? 'All Channels' : activePlatformFilter.toUpperCase()}
                </span>
              </div>

              {/* Message List Items Stream */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40 p-1.5 space-y-1">
                {/* Check if active platform filter is NOT connected */}
                {activePlatformFilter !== 'all' && !isPlatformConnected(activePlatformFilter) ? (
                  <div className="p-6 text-center space-y-3 my-auto">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white capitalize">
                        {activePlatformFilter} Not Connected
                      </h3>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                        Connect and authorize your {activePlatformFilter} business account in Connectors to start managing conversations.
                      </p>
                    </div>
                    <button
                      id={`btn-connect-platform-${activePlatformFilter}`}
                      onClick={() => {
                        const target = platforms.find(p => p.id === activePlatformFilter);
                        if (target) {
                          onOpenConnectorModal(target);
                        } else {
                          onNavigateTab('connections');
                        }
                      }}
                      className="px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
                    >
                      Connect {activePlatformFilter.toUpperCase()}
                    </button>
                  </div>
                ) : filteredConversations.length === 0 ? (
                  /* Useful Empty State */
                  <div className="p-8 text-center space-y-4 my-auto">
                    <div className="w-14 h-14 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto text-cyan-400">
                      <Inbox className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-white">Your unified inbox is ready.</h3>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto">
                        Connect your business platforms to manage conversations from one place.
                      </p>
                    </div>
                    <button
                      id="btn-empty-connect-platform"
                      onClick={() => onNavigateTab('connections')}
                      className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-bold shadow-md hover:scale-105 transition-all inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Connect a Platform</span>
                    </button>
                  </div>
                ) : (
                  /* Render Real Conversations */
                  filteredConversations.map((conv) => {
                    const isSelected = selectedConvId === conv.id;
                    const isUnread = conv.unreadCount > 0;

                    return (
                      <div
                        key={conv.id}
                        id={`conv-item-${conv.id}`}
                        onClick={() => handleSelectConversation(conv)}
                        className={`group relative p-3 rounded-2xl cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 border border-cyan-500/40 shadow-sm'
                            : 'bg-slate-950/30 hover:bg-slate-900/60 border border-transparent hover:border-slate-800'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Avatar & Platform Badge */}
                          <div className="relative shrink-0">
                            {conv.participantAvatar ? (
                              <img
                                src={conv.participantAvatar}
                                alt={conv.participantName}
                                className="w-10 h-10 rounded-full object-cover border border-slate-700"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-800 to-indigo-900 flex items-center justify-center text-xs font-bold text-white border border-slate-700">
                                {conv.participantName.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-slate-950 border border-slate-800 shadow-sm">
                              {renderPlatformIcon(conv.platform, 'w-3 h-3')}
                            </div>
                          </div>

                          {/* Content & Metadata */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <span className={`text-xs truncate ${isUnread ? 'font-black text-white' : 'font-semibold text-slate-200'}`}>
                                {conv.participantName}
                              </span>
                              <span className="text-[10px] text-slate-500 shrink-0">
                                {conv.lastMessageTime}
                              </span>
                            </div>

                            <p className={`text-xs truncate leading-relaxed ${isUnread ? 'font-medium text-cyan-200' : 'text-slate-400'}`}>
                              {conv.lastMessage}
                            </p>

                            {/* Badges & Flags */}
                            <div className="flex items-center gap-1.5 mt-2">
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-slate-800/90 text-cyan-300 border border-slate-700/80">
                                {conv.platform}
                              </span>

                              {conv.isUrgent && (
                                <span className="text-[9px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-1.5 py-0.2 rounded">
                                  Urgent
                                </span>
                              )}

                              {isUnread && (
                                <span className="text-[9px] font-bold text-cyan-300 bg-cyan-500/20 border border-cyan-500/30 px-1.5 py-0.2 rounded">
                                  {conv.unreadCount} new
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action Hover Controls: Star & Archive */}
                          <div className="flex flex-col items-center gap-1 shrink-0">
                            <button
                              onClick={(e) => handleToggleImportant(e, conv)}
                              className={`p-1 rounded-lg transition-colors ${
                                conv.isImportant ? 'text-amber-400' : 'text-slate-500 hover:text-amber-400'
                              }`}
                              title={conv.isImportant ? 'Unmark important' : 'Mark important'}
                            >
                              <Star className={`w-3.5 h-3.5 ${conv.isImportant ? 'fill-amber-400' : ''}`} />
                            </button>
                            <button
                              onClick={(e) => handleToggleArchive(e, conv)}
                              className="p-1 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
                              title={conv.isArchived ? 'Move to inbox' : 'Archive conversation'}
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Conversation Detail View (7 cols on desktop, full screen on mobile when opened) */}
            <div className={`md:col-span-7 bg-slate-900/80 border border-indigo-500/15 rounded-3xl overflow-hidden backdrop-blur-xl flex flex-col h-[560px] ${
              !selectedConvId ? 'hidden md:flex' : 'flex'
            }`}>
              {activeConversation ? (
                <>
                  {/* Conversation Header */}
                  <div className="p-3.5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Mobile Back to List Button */}
                      <button
                        id="btn-back-to-messages-list"
                        onClick={() => setSelectedConvId(null)}
                        className="md:hidden p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                        aria-label="Back to conversations list"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>

                      <div className="relative shrink-0">
                        {activeConversation.participantAvatar ? (
                          <img
                            src={activeConversation.participantAvatar}
                            alt={activeConversation.participantName}
                            className="w-9 h-9 rounded-full object-cover border border-slate-700"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-800 to-indigo-900 flex items-center justify-center text-xs font-bold text-white border border-slate-700">
                            {activeConversation.participantName.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-slate-950 border border-slate-800">
                          {renderPlatformIcon(activeConversation.platform, 'w-2.5 h-2.5')}
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h2 className="text-xs font-bold text-white truncate">
                            {activeConversation.participantName}
                          </h2>
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                            {activeConversation.platform}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono truncate">
                          {activeConversation.participantHandle || `${activeConversation.platform} direct`}
                        </p>
                      </div>
                    </div>

                    {/* Quick AI & Flag Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setShowContinuityModal(true)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[11px] font-semibold transition-all cursor-pointer"
                        title="View Business Continuity Context"
                      >
                        <Brain className="w-3 h-3 text-teal-400" />
                        <span className="hidden sm:inline">Continuity</span>
                      </button>

                      <button
                        id="btn-ask-wihgo-ai-summarize"
                        onClick={() => handleTriggerAiAction('summarize')}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-semibold transition-all"
                        title="Summarize conversation with AI"
                      >
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        <span className="hidden sm:inline">Summarize</span>
                      </button>

                      <button
                        onClick={(e) => handleToggleImportant(e, activeConversation)}
                        className={`p-2 rounded-xl border transition-all ${
                          activeConversation.isImportant
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                        title="Toggle Important"
                      >
                        <Star className={`w-3.5 h-3.5 ${activeConversation.isImportant ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Ask WIHGO AI Quick Actions Bar */}
                  <div className="px-3.5 py-2 bg-slate-950/40 border-b border-slate-800/60 flex items-center gap-2 overflow-x-auto text-[11px]">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-cyan-400 uppercase tracking-wider shrink-0">
                      <Bot className="w-3 h-3" />
                      <span>Ask WIHGO AI:</span>
                    </span>

                    <button
                      id="btn-ai-draft-professional"
                      onClick={() => handleTriggerAiAction('draft_professional')}
                      className="px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 font-medium whitespace-nowrap transition-all"
                    >
                      ✨ Draft Professional Reply
                    </button>

                    <button
                      id="btn-ai-draft-friendly"
                      onClick={() => handleTriggerAiAction('draft_friendly')}
                      className="px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 font-medium whitespace-nowrap transition-all"
                    >
                      ✨ Make Reply Friendlier
                    </button>

                    <button
                      id="btn-ai-draft-followup"
                      onClick={() => handleTriggerAiAction('follow_up')}
                      className="px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 font-medium whitespace-nowrap transition-all"
                    >
                      ✨ Create Follow-Up
                    </button>
                  </div>

                  {/* Messages Stream Container */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/20">
                    {activeConversation.messages.map((m) => {
                      const isUser = m.isFromUser;
                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed space-y-1 shadow-sm ${
                              isUser
                                ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-tr-none'
                                : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-4 text-[10px] opacity-75 font-semibold">
                              <span>{m.senderName}</span>
                              <span className="font-mono text-[9px]">{m.timestamp}</span>
                            </div>
                            <p className="whitespace-pre-wrap">{m.content}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Platform Authorization Notice or Composer */}
                  {!activePlatformIsConnected ? (
                    <div className="p-3.5 border-t border-slate-800 bg-amber-950/20 text-center space-y-2">
                      <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-400">
                        <Lock className="w-4 h-4" />
                        <span>Reply requires platform authorization.</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Live sending to {activeConversation.platform.toUpperCase()} requires active authentication in Connectors.
                      </p>
                      <button
                        onClick={() => {
                          const p = getPlatformInfo(activeConversation.platform);
                          if (p) onOpenConnectorModal(p);
                          else onNavigateTab('connections');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all"
                      >
                        Authorize {activeConversation.platform.toUpperCase()}
                      </button>
                    </div>
                  ) : (
                    /* Active Composer */
                    <div className="p-3 border-t border-slate-800 bg-slate-950/60 space-y-2">
                      {showAttachmentNotice && (
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                          <span>Attach documents, images, or contracts for {activeConversation.platform}.</span>
                          <button
                            onClick={() => setShowAttachmentNotice(false)}
                            className="text-slate-500 hover:text-white font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          id="btn-composer-attachment"
                          onClick={() => setShowAttachmentNotice(!showAttachmentNotice)}
                          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
                          title="Attach document or asset"
                        >
                          <Paperclip className="w-4 h-4" />
                        </button>

                        <input
                          type="text"
                          id="input-composer-message"
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSend();
                            }
                          }}
                          placeholder={`Write reply to ${activeConversation.participantName} on ${activeConversation.platform}...`}
                          className="flex-1 bg-slate-900 text-xs text-white placeholder-slate-500 rounded-2xl px-3.5 py-2.5 border border-slate-800 focus:border-cyan-400 focus:outline-none transition-colors"
                        />

                        <button
                          id="btn-composer-send"
                          onClick={handleSend}
                          disabled={!inputText.trim() || isSending}
                          className="p-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white disabled:opacity-40 shadow-md hover:shadow-cyan-500/20 transition-all shrink-0"
                          title="Send message"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* No Active Conversation Selected */
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3 text-slate-500">
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-slate-300">No conversation selected</h3>
                    <p className="text-[11px] text-slate-500 max-w-xs">
                      Choose a conversation from the list to view the full chat thread and reply.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* WIHGO AI Conversation Assistant Modal */}
      {showAiReplyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-purple-500/30 rounded-3xl p-5 sm:p-6 max-w-lg w-full space-y-4 shadow-[0_0_50px_rgba(168,85,247,0.3)]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">WIHGO AI Message Assistant</h3>
                  <p className="text-[10px] text-slate-400">Contextual smart business response engine</p>
                </div>
              </div>

              <button
                id="btn-close-ai-modal"
                onClick={() => setShowAiReplyModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Generated Output Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <label className="font-semibold text-slate-300">
                  {aiActionType === 'summarize' ? 'Thread Summary:' : 'Drafted Response:'}
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTriggerAiAction(aiActionType as any)}
                    disabled={isGeneratingAi}
                    className="text-cyan-400 hover:underline flex items-center gap-1 text-[10px]"
                  >
                    <RefreshCw className={`w-3 h-3 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                    <span>Regenerate</span>
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed max-h-56 overflow-y-auto whitespace-pre-wrap">
                {isGeneratingAi ? (
                  <div className="flex items-center gap-2 text-purple-300 animate-pulse py-4">
                    <Sparkles className="w-4 h-4" />
                    <span>WIHGO AI is drafting contextual response...</span>
                  </div>
                ) : (
                  aiResultText || 'No response generated.'
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                id="btn-copy-ai-result"
                onClick={handleCopyAi}
                disabled={isGeneratingAi || !aiResultText}
                className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 hover:text-white disabled:opacity-50"
              >
                {copiedAi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAi ? 'Copied' : 'Copy'}</span>
              </button>

              {aiActionType !== 'summarize' ? (
                <button
                  id="btn-insert-ai-composer"
                  onClick={handleInsertAiToComposer}
                  disabled={isGeneratingAi || !aiResultText}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-md disabled:opacity-50 hover:scale-105 transition-all"
                >
                  Insert into Composer
                </button>
              ) : (
                <button
                  onClick={() => setShowAiReplyModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Continuity Context Modal */}
      {showContinuityModal && activeConversation && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-teal-500/40 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-[0_0_50px_rgba(20,184,166,0.3)] animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-teal-400" />
                <h3 className="text-sm font-bold text-white">
                  Continuity Context: {activeConversation.participantName}
                </h3>
              </div>
              <button
                onClick={() => setShowContinuityModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {(() => {
              const cont = BusinessMemoryService.getContinuityContext(activeConversation.participantName, activeConversation.platform);
              return (
                <div className="space-y-2.5 text-xs max-h-[60vh] overflow-y-auto">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Previous Interaction:</span>
                    <p className="text-slate-200 text-xs">{cont.previousInteraction}</p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Previous Response Sent:</span>
                    <p className="text-slate-200 text-xs">{cont.previousResponse}</p>
                  </div>

                  <div className="p-3 bg-teal-500/10 rounded-xl border border-teal-500/30 space-y-1">
                    <span className="text-[10px] font-bold text-teal-300 uppercase">Recommended Next Action:</span>
                    <p className="text-white font-semibold text-xs">{cont.recommendedNextAction}</p>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Active Promises / Commitments:
                    </span>
                    {cont.commitments.length === 0 ? (
                      <p className="text-[11px] text-slate-400">None currently pending.</p>
                    ) : (
                      cont.commitments.map(c => (
                        <div key={c.id} className="text-[11px] text-slate-300 bg-slate-900 p-2 rounded-lg border border-slate-800">
                          • {c.promiseText} <span className="text-amber-400 font-mono">({c.dueDate})</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })()}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowContinuityModal(false)}
                className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
