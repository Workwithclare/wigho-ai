"use client";

import React, { useState } from 'react';
import { 
  AttentionItem, 
  AttentionCategory, 
  UserProfile, 
  PlatformId 
} from '../../../lib/wihgo/types';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Lightbulb,
  TrendingUp,
  Eye,
  Layers,
  Check,
  Filter,
  Camera,
  ThumbsUp,
  Music2,
  Briefcase,
  X as XIcon,
  Hash,
  Mail,
  Calendar as CalendarIcon,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { AttentionEngine } from '../../../lib/wihgo/attention/attentionEngine';

interface WhatNeedsMeBannerProps {
  user?: UserProfile;
  onNavigate?: (tab: string) => void;
  onOpenWorkspace?: (platformId: PlatformId) => void;
  onOpenMemorySearch?: (query: string) => void;
}

export const WhatNeedsMeBanner: React.FC<WhatNeedsMeBannerProps> = ({
  user,
  onNavigate = (_tab?: string) => {},
  onOpenWorkspace = (_platformId?: PlatformId | string) => {},
  onOpenMemorySearch = (_query?: string) => {}
}) => {
  const userName = user?.name ? user.name.split(' ')[0] : 'Clare';
  const [items, setItems] = useState<AttentionItem[]>(() => AttentionEngine.getAttentionItems());
  const [activeCategory, setActiveCategory] = useState<AttentionCategory | 'all'>('all');
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());

  const activeItems = items.filter(i => !i.resolved && !resolvedIds.has(i.id));

  const counts = {
    urgent: activeItems.filter(i => i.category === 'urgent').length,
    decisions: activeItems.filter(i => i.category === 'decisions').length,
    followups: activeItems.filter(i => i.category === 'followups').length,
    opportunities: activeItems.filter(i => i.category === 'opportunities').length,
    information: activeItems.filter(i => i.category === 'information').length,
    total: activeItems.length
  };

  const filteredItems = activeCategory === 'all'
    ? activeItems
    : activeItems.filter(i => i.category === activeCategory);

  const handleResolve = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setResolvedIds(prev => new Set(prev).add(id));
    AttentionEngine.resolveItem(id);
  };

  const handleActionClick = (item: AttentionItem) => {
    if (item.targetPlatform) {
      onOpenWorkspace(item.targetPlatform);
    } else if (item.targetTab) {
      onNavigate(item.targetTab);
    } else {
      onNavigate('inbox');
    }
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
      default: return <MessageSquare className={className} />;
    }
  };

  const getCategoryBadge = (category: AttentionCategory) => {
    switch (category) {
      case 'urgent':
        return {
          label: 'URGENT',
          dot: 'bg-rose-500 animate-pulse',
          bg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
          accent: 'border-l-rose-500'
        };
      case 'decisions':
        return {
          label: 'DECISION',
          dot: 'bg-amber-400',
          bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          accent: 'border-l-amber-500'
        };
      case 'followups':
        return {
          label: 'FOLLOW-UP',
          dot: 'bg-sky-400',
          bg: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
          accent: 'border-l-sky-500'
        };
      case 'opportunities':
        return {
          label: 'OPPORTUNITY',
          dot: 'bg-emerald-400',
          bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
          accent: 'border-l-emerald-500'
        };
      default:
        return {
          label: 'INFO',
          dot: 'bg-slate-400',
          bg: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
          accent: 'border-l-slate-500'
        };
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-[#0B0F19] to-slate-900 border border-teal-500/30 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-[0_0_50px_rgba(20,184,166,0.12)] space-y-5">
      {/* Header: Intelligent Daily Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/40 text-teal-300 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-teal-400" />
              <span>Intelligence Layer</span>
            </span>
            <span className="text-[11px] text-slate-400">Attention Engine Active</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Good morning, {userName}.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Your business at a glance: <strong className="text-teal-300">{counts.total} items</strong> require your attention today.
          </p>
        </div>

        {/* Category Count Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              activeCategory === 'all'
                ? 'bg-slate-800 text-white border-teal-500/60 shadow-sm'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            All ({counts.total})
          </button>

          <button
            onClick={() => setActiveCategory('urgent')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              activeCategory === 'urgent'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/60 shadow-sm'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-rose-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>🔴 {counts.urgent} Urgent</span>
          </button>

          <button
            onClick={() => setActiveCategory('decisions')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              activeCategory === 'decisions'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-amber-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>🟡 {counts.decisions} Decisions</span>
          </button>

          <button
            onClick={() => setActiveCategory('followups')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              activeCategory === 'followups'
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/60 shadow-sm'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-sky-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span>🔵 {counts.followups} Follow-ups</span>
          </button>

          <button
            onClick={() => setActiveCategory('opportunities')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              activeCategory === 'opportunities'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-sm'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-emerald-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>🟢 {counts.opportunities} Opportunities</span>
          </button>
        </div>
      </div>

      {/* Attention Items Grid */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-teal-400 mx-auto" />
            <div className="text-sm font-bold text-white">All caught up!</div>
            <p className="text-xs text-slate-400">No pending attention items in this category.</p>
          </div>
        ) : (
          filteredItems.map(item => {
            const badge = getCategoryBadge(item.category);
            return (
              <div
                key={item.id}
                onClick={() => handleActionClick(item)}
                className="group relative bg-slate-950/90 border border-slate-800 hover:border-teal-500/40 rounded-2xl p-4 transition-all hover:scale-[1.008] cursor-pointer shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 max-w-2xl">
                  {/* Category, Entity & Channel Tag */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border flex items-center gap-1.5 ${badge.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      <span>{badge.label}</span>
                    </span>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-white bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md">
                      {renderPlatformIcon(item.sourcePlatform, 'w-3.5 h-3.5')}
                      <span>{item.entityName}</span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 ml-auto sm:ml-0">
                      {item.timeAgo || item.timestamp}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                    {item.title}
                  </h3>

                  {/* AI Explanation (WHY it's prioritized) */}
                  <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 flex items-start gap-2">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-200">AI Context:</strong> {item.explanation}
                    </span>
                  </div>
                </div>

                {/* Direct Action Controls */}
                <div className="flex items-center gap-2 flex-shrink-0 sm:self-center">
                  <button
                    onClick={(e) => handleResolve(item.id, e)}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-300 hover:border-emerald-500/40 text-xs transition-colors cursor-pointer"
                    title="Mark resolved"
                  >
                    <Check className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleActionClick(item)}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-slate-700 hover:from-teal-400 hover:to-slate-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer group-hover:shadow-teal-500/20"
                  >
                    <span>{item.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
