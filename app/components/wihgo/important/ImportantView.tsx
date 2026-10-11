"use client";

import React from 'react';
import { Conversation, Task, CalendarEvent, PlatformId } from '../../../lib/wihgo/types';
import {
  Star,
  AlertTriangle,
  MessageSquare,
  CheckSquare,
  Calendar as CalendarIcon,
  ArrowRight,
  Sparkles,
  Camera,
  ThumbsUp,
  Music2,
  Briefcase,
  X as XIcon,
  Hash,
  Mail
} from 'lucide-react';

import { WhatsAppIcon } from '../common/WhatsAppIcon';

interface ImportantViewProps {
  conversations: Conversation[];
  tasks: Task[];
  events: CalendarEvent[];
  onOpenWorkspace: (platformId: PlatformId) => void;
  openAiAssistant: () => void;
}

export const ImportantView: React.FC<ImportantViewProps> = ({
  conversations,
  tasks,
  events,
  onOpenWorkspace,
  openAiAssistant
}) => {
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

  const importantConvs = conversations.filter(c => c.isImportant || c.isUrgent || c.unreadCount > 0);
  const urgentTasks = tasks.filter(t => t.priority === 'high' && !t.completed);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Important Items</span>
            <Star className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
          </h1>
          <p className="text-xs text-slate-400">High-priority messages, urgent tasks, and key client communications</p>
        </div>

        <button
          onClick={openAiAssistant}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-500/20 via-indigo-600/20 to-purple-600/20 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:border-amber-400 transition-all shadow-md self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>WIHGO Priority Summary</span>
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Important Conversations Stream */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Priority Communications ({importantConvs.length})</span>
            </h2>
            <span className="text-[10px] text-slate-400">Click to enter workspace</span>
          </div>

          <div className="space-y-3">
            {importantConvs.map((c) => (
              <div
                key={c.id}
                onClick={() => onOpenWorkspace(c.platform)}
                className="bg-slate-900/90 border border-indigo-500/20 hover:border-amber-400/50 p-4 rounded-2xl backdrop-blur-xl cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.15)] flex items-start justify-between gap-4 group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="relative flex-shrink-0">
                    <img
                      src={c.participantAvatar}
                      alt={c.participantName}
                      className="w-10 h-10 rounded-full object-cover border border-amber-500/40"
                    />
                    <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-slate-950 border border-slate-800">
                      {renderPlatformIcon(c.platform, 'w-3 h-3')}
                    </div>
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">{c.participantName}</span>
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300">
                        [{c.platform.toUpperCase()}]
                      </span>
                      {c.isUrgent && (
                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-400" />
                          <span>Urgent</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{c.lastMessage}</p>

                    {c.summary && (
                      <div className="mt-2 p-2 rounded-xl bg-slate-950/70 border border-indigo-500/15 text-[11px] text-cyan-200/90 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span>AI Insight: {c.summary}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-[10px] text-slate-400">{c.lastMessageTime}</span>
                  <div className="p-1.5 rounded-xl bg-slate-800 border border-slate-700 group-hover:bg-amber-500/20 group-hover:border-amber-400/40 text-slate-400 group-hover:text-amber-300 transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High Priority Tasks & Events */}
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-indigo-500/20 p-5 rounded-3xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-rose-400" />
                <span>Urgent Action Items</span>
              </h2>
              <span className="text-[10px] text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                High Priority
              </span>
            </div>

            <div className="space-y-2.5">
              {urgentTasks.map((task) => (
                <div key={task.id} className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white">{task.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Due: {task.dueDate}</div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 p-5 rounded-3xl backdrop-blur-xl space-y-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Today's Key Events</h3>
            </div>
            {events.slice(0, 3).map((evt) => (
              <div key={evt.id} className="p-3 bg-slate-900/90 border border-indigo-500/20 rounded-2xl">
                <div className="text-xs font-bold text-white">{evt.title}</div>
                <div className="text-[10px] text-cyan-300 mt-1">{evt.startTime}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
