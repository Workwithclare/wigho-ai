"use client";

import React, { useState } from 'react';
import { PlatformInfo, PlatformId } from '../../../lib/wihgo/types';
import {
  Share2,
  Plus,
  MessageSquare,
  Camera,
  ThumbsUp,
  Music2,
  Briefcase,
  X as XIcon,
  Hash,
  Mail,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  BarChart2,
  Send,
  Zap,
  Settings,
  Key,
  FileText,
  Calendar as CalendarIcon,
  TrendingUp,
  Heart,
  Eye,
  Clock,
  Edit3
} from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

interface SocialHubViewProps {
  platforms: PlatformInfo[];
  onOpenWorkspace: (platformId: string) => void;
  onNavigateTab: (tab: string) => void;
  onTogglePlatformConnect?: (platformId: PlatformId) => void;
  onOpenConnectorModal?: (platform: PlatformInfo) => void;
}

type SocialSectionTab = 'accounts' | 'posts' | 'scheduled' | 'create' | 'analytics' | 'engagement';

export const SocialHubView: React.FC<SocialHubViewProps> = ({
  platforms,
  onOpenWorkspace,
  onNavigateTab,
  onTogglePlatformConnect,
  onOpenConnectorModal
}) => {
  const [activeTab, setActiveTab] = useState<SocialSectionTab>('accounts');
  const [postDraft, setPostDraft] = useState('');
  const [targetPlatform, setTargetPlatform] = useState('all');

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

  const connectedCount = platforms.filter(p => p.connected && p.statusOverride !== 'ACCESS REQUIRED').length;

  const handleCardClick = (p: PlatformInfo) => {
    if (onOpenConnectorModal) {
      onOpenConnectorModal(p);
    } else {
      onNavigateTab('connections');
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Social Media Hub</span>
            <Share2 className="w-5 h-5 text-cyan-400" />
          </h1>
          <p className="text-xs text-slate-400">
            Unified command center for all your social accounts, scheduled posts & audience engagement
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-create-content-social"
            onClick={() => setActiveTab('create')}
            className="py-2 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-md hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>+ Create Content</span>
          </button>
          <button
            id="btn-connect-accounts-social"
            onClick={() => onNavigateTab('connect')}
            className="py-2 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>Connectors</span>
          </button>
        </div>
      </div>

      {/* Connected Channels Summary Banner */}
      <div className="bg-gradient-to-r from-slate-900/90 via-indigo-950/70 to-slate-900/90 border border-indigo-500/20 rounded-3xl p-5 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 p-0.5 shadow-md flex items-center justify-center text-white font-black text-lg">
            {connectedCount}
          </div>
          <div>
            <div className="text-sm font-extrabold text-white">Active Connected Channels</div>
            <div className="text-xs text-slate-400">
              {connectedCount} of {platforms.length} platforms linked to WIHGO AI Hub
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
          {platforms.filter(p => p.connected && p.statusOverride !== 'ACCESS REQUIRED').map((p) => (
            <button
              key={p.id}
              onClick={() => onOpenWorkspace(p.id)}
              className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-400/50 text-slate-300 transition-all flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap cursor-pointer"
            >
              {renderPlatformIcon(p.id, 'w-4 h-4')}
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Section Navigation Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800">
        {[
          { id: 'accounts', label: 'Social Accounts', icon: Share2 },
          { id: 'posts', label: 'Posts & Drafts', icon: FileText },
          { id: 'scheduled', label: 'Scheduled Posts', icon: CalendarIcon },
          { id: 'create', label: 'Create Content', icon: Sparkles },
          { id: 'analytics', label: 'Social Analytics', icon: BarChart2 },
          { id: 'engagement', label: 'Engagement', icon: Heart }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SocialSectionTab)}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: SOCIAL ACCOUNTS */}
      {activeTab === 'accounts' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            All Platforms & Connectors ({platforms.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.map((p) => {
              const isConnected = p.connected && p.statusOverride !== 'ACCESS REQUIRED';
              const isAccessRequired = p.statusOverride === 'ACCESS REQUIRED';

              return (
                <div
                  key={p.id}
                  id={`social-card-${p.id}`}
                  onClick={() => handleCardClick(p)}
                  className="bg-slate-900/90 border border-indigo-500/20 rounded-3xl p-5 backdrop-blur-xl hover:border-cyan-400/40 transition-all space-y-4 shadow-md flex flex-col justify-between cursor-pointer group"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 group-hover:border-slate-700 transition-colors">
                        {renderPlatformIcon(p.id, 'w-6 h-6')}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">{p.name}</h3>
                        <p className="text-[11px] text-cyan-300 font-mono">
                          {p.accountHandle || `@${p.name.toLowerCase().replace(/\s+/g, '')}`}
                        </p>
                      </div>
                    </div>

                    {isConnected ? (
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        CONNECTED
                      </span>
                    ) : isAccessRequired ? (
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full text-amber-300 bg-amber-500/10 border border-amber-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        ACCESS REQUIRED
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-slate-400 bg-slate-800 border border-slate-700">
                        NOT CONNECTED
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800" onClick={(e) => e.stopPropagation()}>
                    {isConnected ? (
                      <>
                        <button
                          id={`btn-open-ws-social-${p.id}`}
                          onClick={() => onOpenWorkspace(p.id)}
                          className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-sm hover:opacity-90 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Workspace</span>
                        </button>

                        <button
                          id={`btn-manage-social-${p.id}`}
                          onClick={() => handleCardClick(p)}
                          className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs border border-slate-700 transition-all cursor-pointer"
                          title="Connection Details"
                        >
                          <Settings className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      </>
                    ) : (
                      <button
                        id={`btn-connect-social-${p.id}`}
                        onClick={() => handleCardClick(p)}
                        className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-cyan-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>Connect {p.name}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: POSTS & DRAFTS */}
      {activeTab === 'posts' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Published Posts & Active Drafts</span>
            </h2>
            <button
              onClick={() => setActiveTab('create')}
              className="text-xs font-bold text-cyan-300 hover:text-cyan-200 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Draft</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: '⚡ Introducing WIHGO AI Connect Hub 2.0',
                platform: 'LinkedIn & Instagram',
                status: 'Published',
                date: 'Yesterday, 3:30 PM',
                stats: '1,420 Impressions • 84 Likes',
                color: 'text-emerald-400'
              },
              {
                title: 'Summer Flash Promotion: 20% Off Business Suite',
                platform: 'WhatsApp Broadcast & Facebook',
                status: 'Published',
                date: '2 days ago',
                stats: '340 Inquiries • 42 Conversions',
                color: 'text-emerald-400'
              },
              {
                title: 'How to automate customer replies in under 60 seconds',
                platform: 'TikTok & Instagram Reels',
                status: 'Draft',
                date: 'Saved today',
                stats: 'Ready for video review',
                color: 'text-amber-400'
              },
              {
                title: 'Case Study: Scaling B2B Lead Conversion by 3.2x',
                platform: 'LinkedIn Article',
                status: 'Draft',
                date: 'Saved Jun 22',
                stats: 'AI outline generated',
                color: 'text-amber-400'
              }
            ].map((post, idx) => (
              <div key={idx} className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-white">{post.title}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    post.status === 'Published'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  }`}>
                    {post.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <span>{post.platform}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>
                <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-cyan-300">
                  {post.stats}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SCHEDULED POSTS */}
      {activeTab === 'scheduled' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-teal-400" />
              <span>Upcoming Scheduled Content Queue</span>
            </h2>
            <span className="text-[10px] font-bold text-teal-300 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/30">
              3 Scheduled
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                time: 'Tomorrow, 9:00 AM',
                title: 'Morning Motivation: Why Speed to Lead Wins',
                platforms: ['Instagram', 'LinkedIn', 'X'],
                autoPublish: true
              },
              {
                time: 'Wednesday, 2:00 PM',
                title: 'Midweek Product Feature Spotlight: Unified Inbox',
                platforms: ['Facebook', 'LinkedIn'],
                autoPublish: true
              },
              {
                time: 'Friday, 5:00 PM',
                title: 'Weekend VIP Customer Broadcast & Special Perks',
                platforms: ['WhatsApp Business'],
                autoPublish: true
              }
            ].map((sch, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{sch.title}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Scheduled for {sch.time} • {sch.platforms.join(', ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/30">
                    Auto-Publish
                  </span>
                  <button className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SOCIAL CONTENT CREATION */}
      {activeTab === 'create' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-slate-900/90 border border-purple-500/20 rounded-3xl p-5 sm:p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>AI Social Content Studio</span>
              </h2>
              <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                Multi-Channel AI
              </span>
            </div>

            <div className="space-y-3">
              <textarea
                value={postDraft}
                onChange={(e) => setPostDraft(e.target.value)}
                placeholder="What would you like to post? Enter your core message or topic, and WIHGO AI will craft optimized captions, hashtags, and schedules for all your connected channels..."
                rows={4}
                className="w-full bg-slate-950 text-xs text-white placeholder-slate-500 rounded-2xl p-4 border border-slate-800 focus:border-purple-400 focus:outline-none"
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Target:</span>
                  <select
                    value={targetPlatform}
                    onChange={(e) => setTargetPlatform(e.target.value)}
                    className="bg-slate-950 text-xs text-white border border-slate-800 rounded-xl px-3 py-1.5 focus:outline-none"
                  >
                    <option value="all">All Connected Socials</option>
                    <option value="instagram">Instagram</option>
                    <option value="whatsapp">WhatsApp Broadcast</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="facebook">Facebook</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPostDraft("🎉 Exciting announcement! We're rolling out our new seamless customer experience today. Connect with our team to get started.")}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Sample Prompt
                  </button>
                  <button
                    onClick={() => {
                      if (!postDraft.trim()) return;
                      onNavigateTab('content-creation');
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-md hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate & Schedule</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SOCIAL ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Social Impressions', value: '48.2k', change: '+24%', icon: Eye, color: 'text-cyan-400' },
              { label: 'Audience Engagement', value: '3,840', change: '+18%', icon: Heart, color: 'text-pink-400' },
              { label: 'Direct Messages / Leads', value: '412', change: '+32%', icon: MessageSquare, color: 'text-emerald-400' },
              { label: 'Conversion Velocity', value: '4.8%', change: '+1.2%', icon: TrendingUp, color: 'text-purple-400' }
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase">
                    <span>{stat.label}</span>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
                  <div className="text-[10px] text-emerald-400 font-bold">{stat.change} this month</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 6: ENGAGEMENT */}
      {activeTab === 'engagement' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-slate-900/90 border border-pink-500/20 rounded-3xl p-5 sm:p-6 backdrop-blur-xl space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-400" />
              <span>Real-Time Audience Inquiries & Engagement</span>
            </h2>

            <div className="space-y-2.5">
              {[
                { user: '@sarah_design', platform: 'Instagram DM', text: 'Loved your latest case study! Can we book a consultation call for next week?', time: '5m ago' },
                { user: 'David K. (TechCorp)', platform: 'LinkedIn InMail', text: 'Interested in the enterprise sync integration. Does this support custom webhook endpoints?', time: '22m ago' },
                { user: '', platform: '', text: '', time: '' }
              ].map((msg, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{msg.user}</span>
                      <span className="text-[10px] text-pink-400 font-mono">• {msg.platform}</span>
                    </div>
                    <p className="text-xs text-slate-300">{msg.text}</p>
                  </div>
                  <button
                    onClick={() => onOpenWorkspace('whatsapp')}
                    className="px-3 py-1 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 text-[11px] font-bold border border-pink-500/30 transition-all cursor-pointer whitespace-nowrap"
                  >
                    Reply
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

