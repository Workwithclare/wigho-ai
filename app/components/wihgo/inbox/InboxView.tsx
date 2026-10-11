"use client";

import React, { useState } from 'react';
import { Conversation, PlatformInfo, PlatformId } from '../../../lib/wihgo/types';
import {
  MessageSquare,
  Search,
  Filter,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Camera,
  ThumbsUp,
  Music2,
  Briefcase,
  X as XIcon,
  Hash,
  Mail
} from 'lucide-react';

import { WhatsAppIcon } from '../common/WhatsAppIcon';

interface InboxViewProps {
  conversations: Conversation[];
  platforms: PlatformInfo[];
  onOpenWorkspace: (platformId: PlatformId) => void;
}

export const InboxView: React.FC<InboxViewProps> = ({
  conversations,
  platforms,
  onOpenWorkspace
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'urgent' | 'ai'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

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
      default: return <MessageSquare className={className} />;
    }
  };

  const filteredConversations = conversations.filter((c) => {
    if (filterTab === 'unread' && c.unreadCount === 0) return false;
    if (filterTab === 'urgent' && !c.isUrgent) return false;
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
      {/* Title & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Connected Inboxes</h1>
          <p className="text-xs text-slate-400">Isolated platform workspaces to manage all incoming business inquiries</p>
        </div>

        {/* Search */}
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

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Inboxes' },
          { id: 'unread', label: 'Unread Messages' },
          { id: 'urgent', label: 'Urgent Actions' }
        ].map((tab) => (
          <button
            key={tab.id}
            id={`filter-tab-${tab.id}`}
            onClick={() => setFilterTab(tab.id as any)}
            className={`py-2 px-4 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterTab === tab.id
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Platform Entry Hub Grid (Separate Workspaces) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {platforms.map((p) => {
          const unreadForP = conversations
            .filter((c) => c.platform === p.id)
            .reduce((acc, curr) => acc + curr.unreadCount, 0);

          return (
            <button
              key={p.id}
              id={`open-workspace-card-${p.id}`}
              onClick={() => onOpenWorkspace(p.id)}
              className="bg-slate-900/80 border border-indigo-500/15 hover:border-cyan-400/40 p-4 rounded-2xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] text-left flex flex-col justify-between space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                  {renderPlatformIcon(p.id, 'w-5 h-5')}
                </div>
                {unreadForP > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    {unreadForP} new
                  </span>
                )}
              </div>

              <div>
                <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">{p.name}</div>
                <div className="text-[10px] text-slate-400">Open Workspace →</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Message Stream grouped with explicit platform identity badges */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider text-[11px]">Recent Activity Stream</h2>

        <div className="space-y-2">
          {filteredConversations.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-2xl text-center space-y-2">
              <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="text-xs font-semibold text-slate-300">No conversations yet.</div>
              <p className="text-[11px] text-slate-500">Connect a platform or start a conversation to see messages here.</p>
            </div>
          ) : (
            filteredConversations.map((c) => (
              <div
                key={c.id}
                onClick={() => onOpenWorkspace(c.platform)}
                className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/30 p-4 rounded-2xl backdrop-blur-xl cursor-pointer transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative">
                    <img
                      src={c.participantAvatar}
                      alt={c.participantName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700"
                    />
                    <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-slate-950 border border-slate-800">
                      {renderPlatformIcon(c.platform, 'w-3 h-3')}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white truncate">{c.participantName}</span>
                      {/* Explicit Platform Tag */}
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300">
                        {c.platform}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{c.lastMessage}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-[10px] text-slate-500">{c.lastMessageTime}</span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
