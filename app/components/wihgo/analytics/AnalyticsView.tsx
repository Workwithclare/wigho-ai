"use client";

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Heart,
  Sparkles,
  ArrowUpRight,
  Bot,
  RefreshCw,
  Camera,
  ThumbsUp,
  Music2,
  MessageSquare,
  ChevronRight
} from 'lucide-react';

import { WhatsAppIcon } from '../common/WhatsAppIcon';

interface AnalyticsViewProps {
  onNavigateTab?: (tab: string) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ onNavigateTab }) => {
  const [showAiExplanation, setShowAiExplanation] = useState<boolean>(true);
  const [aiExplanationText, setAiExplanationText] = useState<string>(
    "Your engagement increased by 18% this week primarily due to your recent Instagram Reel and WhatsApp broadcast. 3 main drivers: 1) Video content reach jumped +34%, 2) Faster DM response time (under 4 minutes), 3) Call-To-Action clicks rose on product inquiries."
  );

  const metrics = [
    { label: "Total Followers", value: "24,850", change: "+12.4%", icon: Users, color: "text-cyan-400" },
    { label: "Weekly Reach", value: "142,300", change: "+28.1%", icon: Eye, color: "text-purple-400" },
    { label: "Engagement Rate", value: "6.8%", change: "+18.0%", icon: Heart, color: "text-pink-400" },
    { label: "Channel Views", value: "89,400", change: "+15.2%", icon: TrendingUp, color: "text-emerald-400" }
  ];

  const channelPerformance = [
    { name: "Instagram", followers: "12.4k", reach: "64k", engagement: "7.2%", icon: Camera, color: "text-pink-400" },
    { name: "TikTok", followers: "8.1k", reach: "48k", engagement: "8.4%", icon: Music2, color: "text-cyan-400" },
    { name: "WhatsApp Business", contacts: "2.8k", msgs: "1.2k/wk", openRate: "94%", icon: WhatsAppIcon, color: "" },
    { name: "Facebook", followers: "1.5k", reach: "18k", engagement: "4.1%", icon: ThumbsUp, color: "text-blue-400" }
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Social Analytics & Performance</span>
            <BarChart3 className="w-5 h-5 text-purple-400" />
          </h1>
          <p className="text-xs text-slate-400">
            Real-time cross-platform metrics, audience insights, and AI performance breakdown
          </p>
        </div>

        {onNavigateTab && (
          <button
            onClick={() => onNavigateTab('content-creation')}
            className="py-2 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-md hover:opacity-90 transition-all flex items-center gap-1.5 w-fit"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Optimize Content Strategy</span>
          </button>
        )}
      </div>

      {/* AI Performance Explanation Banner */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900/90 to-indigo-950/80 border border-purple-500/30 rounded-3xl p-5 backdrop-blur-xl shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
              <Bot className="w-4 h-4 text-purple-300" />
            </div>
            <div>
              <h2 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>WIHGO AI Insight</span>
                <Sparkles className="w-3 h-3 text-cyan-400" />
              </h2>
              <p className="text-[10px] text-slate-400">Automated performance diagnosis</p>
            </div>
          </div>

          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            +18% Engagement Bump
          </span>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
          "Your engagement increased by 18% this week. Would you like me to explain why? Main drivers: Video content reach jumped +34%, faster DM response time (under 4 minutes), and higher Call-To-Action clicks on product inquiries."
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900/90 border border-indigo-500/20 rounded-3xl p-5 backdrop-blur-xl space-y-2 shadow-md"
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-5 h-5 ${m.color}`} />
                <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>{m.change}</span>
                </span>
              </div>
              <div>
                <div className="text-xl font-black text-white tracking-tight">{m.value}</div>
                <div className="text-[11px] text-slate-400 font-medium">{m.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Channel Breakdown Cards */}
      <div className="bg-slate-900/90 border border-indigo-500/20 rounded-3xl p-6 backdrop-blur-xl space-y-4 shadow-xl">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Performance by Connected Channel
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {channelPerformance.map((ch, idx) => {
            const Icon = ch.icon;
            return (
              <div
                key={idx}
                className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between hover:border-cyan-400/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <Icon className={`w-5 h-5 ${ch.color}`} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">{ch.name}</h3>
                    <div className="text-[10px] text-slate-400">
                      {ch.followers ? `${ch.followers} followers` : `${ch.contacts} contacts`}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-extrabold text-cyan-300">
                    {ch.engagement || ch.openRate}
                  </div>
                  <div className="text-[9px] text-slate-500">Rate</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
