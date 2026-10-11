"use client";

import React from 'react';
import {
  TrendingUp,
  MessageSquare,
  Clock,
  Zap,
  BarChart3,
  Users,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export const BusinessPulseView: React.FC = () => {
  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Business Pulse Analytics</span>
            <TrendingUp className="w-5 h-5 text-emerald-400 animate-pulse" />
          </h1>
          <p className="text-xs text-slate-400">Real-time cross-platform metrics, response speed analysis & audience engagement</p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-2xl text-emerald-400 text-xs font-semibold">
          <Zap className="w-4 h-4" />
          <span>Live Stream Synced</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Messages Handled', value: '248', sub: '+18% this week', color: 'text-cyan-400', icon: MessageSquare },
          { label: 'Avg Response Speed', value: '1.4 min', sub: '94% faster with AI', color: 'text-emerald-400', icon: Clock },
          { label: 'Active Leads Engaged', value: '84', sub: 'Across 8 channels', color: 'text-purple-400', icon: Users },
          { label: 'Resolution Rate', value: '98.2%', sub: 'High customer satisfaction', color: 'text-amber-400', icon: CheckCircle2 }
        ].map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-slate-900/90 border border-indigo-500/20 p-5 rounded-3xl backdrop-blur-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{m.label}</span>
                <Icon className={`w-4 h-4 ${m.color}`} />
              </div>
              <div className={`text-2xl font-extrabold ${m.color}`}>{m.value}</div>
              <div className="text-[10px] text-slate-400">{m.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Channel Volume Distribution */}
      <div className="bg-slate-900/90 border border-indigo-500/20 p-6 rounded-3xl backdrop-blur-xl space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <span>Channel Volume Breakdown (Past 7 Days)</span>
        </h2>

        <div className="space-y-3">
          {[
            { platform: 'WhatsApp', count: 78, share: '31%', color: 'bg-emerald-500' },
            { platform: 'Instagram DMs', count: 52, share: '21%', color: 'bg-pink-500' },
            { platform: 'Slack Connect', count: 42, share: '17%', color: 'bg-purple-500' },
            { platform: 'Email / Gmail', count: 36, share: '15%', color: 'bg-rose-500' },
            { platform: 'TikTok / LinkedIn / X', count: 40, share: '16%', color: 'bg-cyan-500' }
          ].map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-white">{item.platform}</span>
                <span className="text-slate-400">{item.count} msgs ({item.share})</span>
              </div>
              <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div className={`h-full ${item.color} rounded-full`} style={{ width: item.share }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
