"use client";

import React, { useState } from 'react';
import { Conversation, PlatformInfo, PlatformId } from '../../../lib/wihgo/types';
import {
  MessageSquare,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Camera,
  ThumbsUp,
  Music2,
  Briefcase,
  X as XIcon,
  Hash,
  Mail,
  Zap,
  Tag
} from 'lucide-react';

import { WhatsAppIcon } from '../common/WhatsAppIcon';

interface AllMessagesWorkspaceProps {
  conversations: Conversation[];
  platforms: PlatformInfo[];
  onOpenWorkspace: (platformId: PlatformId) => void;
  openAiAssistant: () => void;
}

export const AllMessagesWorkspace: React.FC<AllMessagesWorkspaceProps> = ({
  conversations,
  platforms,
  onOpenWorkspace,
  openAiAssistant
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'needs_reply' | 'important' | 'unread' | 'follow_up'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const renderPlatformBadge = (platformId: string) => {
    switch (platformId) {
      case 'whatsapp':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <WhatsAppIcon className="w-3 h-3" />
            <span>[WhatsApp]</span>
          </span>
        );
      case 'instagram':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-300 border border-pink-500/30">
            <Camera className="w-3 h-3 text-pink-400" />
            <span>[Camera]</span>
          </span>
        );
      case 'facebook':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <ThumbsUp className="w-3 h-3 text-blue-400" />
            <span>[ThumbsUp]</span>
          </span>
        );
      case 'tiktok':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            <Music2 className="w-3 h-3 text-cyan-400" />
            <span>[TikTok]</span>
          </span>
        );
      case 'linkedin':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 border border-sky-500/30">
            <Briefcase className="w-3 h-3 text-sky-400" />
            <span>[LinkedIn]</span>
          </span>
        );
      case 'x':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700">
            <XIcon className="w-3 h-3 text-slate-300" />
            <span>[X]</span>
          </span>
        );
      case 'slack':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Hash className="w-3 h-3 text-purple-400" />
            <span>[Hash]</span>
          </span>
        );
      case 'email':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <Mail className="w-3 h-3 text-rose-400" />
            <span>[Email]</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <span>[{platformId}]</span>
          </span>
        );
    }
  };

  const filteredConversations = conversations.filter((c) => {
    if (filterTab === 'unread' && c.unreadCount === 0) return false;
    if (filterTab === 'important' && !c.isImportant && !c.isUrgent) return false;
    if (filterTab === 'needs_reply' && c.unreadCount === 0 && !c.isUrgent) return false;
    if (filterTab === 'follow_up' && !c.summary?.toLowerCase().includes('follow') && !c.isUrgent) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.participantName.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q) ||
        c.platform.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Title & Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>All Messages Workspace</span>
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </h1>
          <p className="text-xs text-slate-400">Intelligent cross-platform overview — click any message to enter its platform workspace</p>
        </div>

        {/* Global Filter Search */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all platform messages..."
            className="w-full bg-slate-900 text-xs text-white placeholder-slate-500 rounded-xl pl-8 pr-3 py-2 border border-slate-800 focus:border-cyan-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Cross-Platform Filter Tabs (All, Needs Reply, Important, Unread, Follow-Up) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Messages' },
          { id: 'needs_reply', label: 'Needs Reply' },
          { id: 'important', label: 'Important' },
          { id: 'unread', label: 'Unread' },
          { id: 'follow_up', label: 'Follow-Up' }
        ].map((tab) => (
          <button
            key={tab.id}
            id={`filter-all-msgs-${tab.id}`}
            onClick={() => setFilterTab(tab.id as any)}
            className={`py-2 px-4 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterTab === tab.id
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Message Overview List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Showing {filteredConversations.length} Messages
          </h2>
          <span className="text-[10px] text-cyan-300">Each platform remains separate upon click</span>
        </div>

        <div className="space-y-2.5">
          {filteredConversations.map((c) => (
            <div
              key={c.id}
              onClick={() => onOpenWorkspace(c.platform)}
              className="bg-slate-900/90 border border-indigo-500/15 hover:border-cyan-400/50 p-4 rounded-2xl backdrop-blur-xl cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-3 min-w-0">
                <img
                  src={c.participantAvatar}
                  alt={c.participantName}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700 flex-shrink-0"
                />

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Source Platform Badge */}
                    {renderPlatformBadge(c.platform)}

                    <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {c.participantName}
                    </span>

                    {c.unreadCount > 0 && (
                      <span className="bg-rose-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                        {c.unreadCount} Unread
                      </span>
                    )}

                    {c.isUrgent && (
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                        <span>Action Required</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed truncate">{c.lastMessage}</p>

                  {c.summary && (
                    <div className="text-[10px] text-cyan-300/80 font-mono">
                      Context: {c.summary}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                <span className="text-[10px] text-slate-500">{c.lastMessageTime}</span>
                <button className="py-1.5 px-3 rounded-xl bg-slate-800 group-hover:bg-cyan-500/20 border border-slate-700 group-hover:border-cyan-400/40 text-slate-300 group-hover:text-cyan-300 text-xs font-semibold flex items-center gap-1 transition-all">
                  <span>Open {c.platform}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
