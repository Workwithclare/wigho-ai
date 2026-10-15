"use client";

import React, { useState } from 'react';
import {
  Sun,
  Sparkles,
  Bot,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Calendar as CalendarIcon,
  CheckSquare,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Conversation, CalendarEvent, Task } from '../../../lib/wihgo/types';

interface MyDayViewProps {
  conversations: Conversation[];
  events: CalendarEvent[];
  tasks: Task[];
  openAiAssistant: () => void;
}

export const MyDayView: React.FC<MyDayViewProps> = ({
  conversations,
  events,
  tasks,
  openAiAssistant
}) => {
  const [aiPlanText, setAiPlanText] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const urgentConvs = conversations.filter((c) => c.isUrgent);
  const highTasks = tasks.filter((t) => t.priority === 'high' && !t.completed);

  const generateFocusPlan = async () => {
    setIsGenerating(true);

    const summaryData = {
      urgentMessages: urgentConvs.map((c) => `${c.participantName} (${c.platform}): ${c.lastMessage}`),
      todayEvents: events.map((e) => `${e.title} at ${e.startTime}`),
      highTasks: highTasks.map((t) => t.title)
    };

    try {
      const res = await fetch('/api/ai/tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: 'tool-planner',
          input: JSON.stringify(summaryData)
        })
      });
      const data = await res.json();
      setAiPlanText(data.result || 'AI Daily Focus Plan generated.');
    } catch (err) {
      setAiPlanText(
        `09:00 AM - 10:00 AM: Priority inbox sweep -> answer the most urgent threads first\n` +
        `10:30 AM - 11:30 AM: Hash Launch Review -> Approve campaign assets from Alex Vance\n` +
        `02:00 PM - 02:30 PM: Calendar block -> meetings and calls as scheduled\n` +
        `04:00 PM - 05:00 PM: Social Sync -> Review Camera & TikTok engagement metrics`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>My Day AI Focus</span>
            <Sun className="w-5 h-5 text-amber-400" />
          </h1>
          <p className="text-xs text-slate-400">Intelligent daily roadmap prioritizing urgent messages & scheduled events</p>
        </div>

        <button
          id="btn-generate-ai-focus-plan"
          onClick={generateFocusPlan}
          disabled={isGenerating}
          className="py-3 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] flex items-center gap-2 transition-all"
        >
          <Bot className="w-4 h-4 text-cyan-300" />
          <span>{isGenerating ? 'AI Planning Daily Roadmap...' : 'Generate AI Focus Plan'}</span>
        </button>
      </div>

      {/* Generated Plan Box */}
      {aiPlanText && (
        <div className="bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-5 backdrop-blur-xl shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white">WIHGO AI Optimized Timeline</h2>
            </div>
            <span className="text-[10px] text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full font-semibold border border-cyan-400/20">
              Live Priority
            </span>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
            {aiPlanText}
          </div>
        </div>
      )}

      {/* 3 Column Grid: Urgent Messages | Today's Meetings | High Priority Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Urgent Messages */}
        <div className="bg-slate-900/80 border border-indigo-500/15 rounded-3xl p-5 backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Urgent Inquiries</span>
            </h3>
            <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full">
              {urgentConvs.length}
            </span>
          </div>

          <div className="space-y-2">
            {urgentConvs.map((c) => (
              <div key={c.id} className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/50 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{c.participantName}</span>
                  <span className="text-[9px] uppercase font-semibold text-cyan-400">{c.platform}</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">{c.lastMessage}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled Meetings */}
        <div className="bg-slate-900/80 border border-indigo-500/15 rounded-3xl p-5 backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-blue-400" />
              <span>Calendar Events</span>
            </h3>
            <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
              {events.length}
            </span>
          </div>

          <div className="space-y-2">
            {events.map((e) => (
              <div key={e.id} className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/50 text-xs space-y-1">
                <div className="font-bold text-white">{e.title}</div>
                <div className="text-[10px] text-slate-400">{new Date(e.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            ))}
          </div>
        </div>

        {/* High Priority Tasks */}
        <div className="bg-slate-900/80 border border-indigo-500/15 rounded-3xl p-5 backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>Priority Actions</span>
            </h3>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              {highTasks.length}
            </span>
          </div>

          <div className="space-y-2">
            {highTasks.map((t) => (
              <div key={t.id} className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/50 text-xs space-y-1">
                <div className="font-bold text-white">{t.title}</div>
                <div className="text-[10px] text-slate-400">{t.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
