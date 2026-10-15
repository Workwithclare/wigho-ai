"use client";

import React, { useState } from 'react';
import { FollowUpItem, PlatformId } from '../../../lib/wihgo/types';
import {
  Clock,
  CheckCircle2,
  MessageSquare,
  Calendar,
  Sparkles,
  User,
  Send,
  AlertCircle,
  Camera,
  ThumbsUp,
  Music2,
  Briefcase,
  X as XIcon,
  Hash,
  Mail
} from 'lucide-react';
import { INITIAL_FOLLOW_UPS } from '../../../lib/wihgo/mockData';

import { WhatsAppIcon } from '../common/WhatsAppIcon';

interface FollowUpsViewProps {
  onOpenWorkspace: (platformId: PlatformId) => void;
  openAiAssistant: () => void;
  // Optional live data (real Neon commitments). Falls back to local demo state.
  items?: FollowUpItem[];
  onToggleItem?: (id: string) => void;
  onAddItem?: (contactName: string, topic: string) => void;
  onDeleteItem?: (id: string) => void;
}

export const FollowUpsView: React.FC<FollowUpsViewProps> = ({
  onOpenWorkspace,
  openAiAssistant,
  items,
  onToggleItem,
  onAddItem,
  onDeleteItem
}) => {
  const [localUps, setLocalUps] = useState<FollowUpItem[]>(() => {
    try {
      const raw = localStorage.getItem('wihgo_followups_clare-demo');
      if (raw) return JSON.parse(raw);
    } catch {}
    return INITIAL_FOLLOW_UPS;
  });
  const followUps = items ?? localUps;
  const setFollowUps: React.Dispatch<React.SetStateAction<FollowUpItem[]>> = ((u: React.SetStateAction<FollowUpItem[]>) => {
    const next = typeof u === 'function' ? (u as (p: FollowUpItem[]) => FollowUpItem[])(followUps) : u;
    if (items) {
      try { localStorage.setItem('wihgo_followups_clare-demo', JSON.stringify(next)); } catch {}
    } else {
      setLocalUps(next);
    }
  }) as React.Dispatch<React.SetStateAction<FollowUpItem[]>>;
  const [newContact, setNewContact] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const persist = (items: FollowUpItem[]) => {
    setFollowUps(items);
    try { localStorage.setItem('wihgo_followups_clare-demo', JSON.stringify(items)); } catch {}
  };
  const [filter, setFilter] = useState<'all' | 'due_today' | 'pending' | 'completed'>('all');

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
      default: return <Clock className={className} />;
    }
  };

  const toggleStatus = (id: string) => {
    if (onToggleItem) {
      onToggleItem(id);
      return;
    }
    setFollowUps(prev => {
      const next = prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: (item.status === 'completed' ? 'pending' : 'completed') as FollowUpItem['status']
        };
      }
      return item;
      });
      try { localStorage.setItem('wihgo_followups_clare-demo', JSON.stringify(next)); } catch {}
      return next;
    });
  };
  const deleteFollowUp = (id: string) => {
    if (onDeleteItem) {
      onDeleteItem(id);
      return;
    }
    setFollowUps(prev => {
      const next = prev.filter(item => item.id !== id);
      try { localStorage.setItem('wihgo_followups_clare-demo', JSON.stringify(next)); } catch {}
      return next;
    });
  };
  const addFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContact.trim() || !newTopic.trim()) return;
    if (onAddItem) {
      onAddItem(newContact.trim(), newTopic.trim());
      setNewContact('');
      setNewTopic('');
      return;
    }
    const item: FollowUpItem = {
      id: `fu-${Date.now()}`,
      contactName: newContact.trim(),
      topic: newTopic.trim(),
      platform: 'whatsapp',
      lastContact: 'Just now',
      followUpDate: new Date().toLocaleDateString(),
      status: 'pending',
    } as FollowUpItem;
    persist([item, ...followUps]);
    setNewContact('');
    setNewTopic('');
  };

  const filteredItems = followUps.filter(f => {
    if (filter === 'all') return true;
    return f.status === filter;
  });

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Client & Lead Follow-Ups</span>
            <Clock className="w-5 h-5 text-cyan-400" />
          </h1>
          <p className="text-xs text-slate-400">Automated tracking & scheduled check-ins across all connected platform channels</p>
        </div>

        <button
          onClick={openAiAssistant}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-cyan-300" />
          <span>Draft AI Follow-Up Message</span>
        </button>
      </div>

      {/* Add follow-up */}
      <form onSubmit={addFollowUp} className="flex flex-col sm:flex-row gap-2 p-3 rounded-2xl bg-slate-900/80 border border-teal-500/20">
        <input
          value={newContact}
          onChange={(e) => setNewContact(e.target.value)}
          placeholder="Contact name"
          className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500"
        />
        <input
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          placeholder="Follow-up topic"
          className="flex-[2] px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500"
        />
        <button type="submit" className="px-4 py-2 rounded-xl bg-teal-500 text-black text-xs font-extrabold hover:bg-teal-400">
          Add
        </button>
      </form>
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Follow-Ups' },
          { id: 'due_today', label: 'Due Today' },
          { id: 'pending', label: 'Pending' },
          { id: 'completed', label: 'Completed' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id as any)}
            className={`py-2 px-4 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
              filter === t.id
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Follow ups Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.length === 0 && (
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 text-center md:col-span-2">
            <p className="text-sm font-bold text-white">No follow-ups yet</p>
            <p className="text-xs text-slate-400 mt-1">Add your first follow-up with contact name and topic above.</p>
          </div>
        )}
        {filteredItems.map(item => (
          <div
            key={item.id}
            className={`bg-slate-900/90 border p-5 rounded-3xl backdrop-blur-xl transition-all duration-300 flex flex-col justify-between space-y-4 ${
              item.status === 'completed'
                ? 'border-slate-800/80 opacity-60'
                : item.status === 'due_today'
                ? 'border-amber-500/40 shadow-[0_0_20px_rgba(251,191,36,0.15)]'
                : 'border-indigo-500/20 hover:border-cyan-400/40'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.contactAvatar}
                    alt={item.contactName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white">{item.contactName}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {renderPlatformIcon(item.platform, 'w-3.5 h-3.5')}
                      <span className="text-[10px] font-extrabold uppercase text-cyan-300">[{item.platform}]</span>
                    </div>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  item.status === 'due_today'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : item.status === 'completed'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {item.status === 'due_today' ? 'Due Today' : item.status === 'completed' ? 'Done' : 'Pending'}
                </span>
              </div>

              <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-2xl">
                <div className="text-[10px] text-slate-400 font-medium">Topic / Objective</div>
                <div className="text-xs font-semibold text-white mt-0.5">{item.topic}</div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Last contact: {item.lastContact}</span>
                <span className="text-cyan-300 font-medium">Scheduled: {item.followUpDate}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => toggleStatus(item.id)}
                className={`py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  item.status === 'completed'
                    ? 'bg-slate-800 text-slate-400'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{item.status === 'completed' ? 'Mark Pending' : 'Mark Completed'}</span>
              </button>

              <button
                onClick={() => deleteFollowUp(item.id)}
                className="py-1.5 px-3 rounded-xl bg-slate-800 text-slate-400 hover:text-red-300 text-xs font-semibold transition-all"
              >
                Delete
              </button>
              <button
                onClick={() => onOpenWorkspace(item.platform)}
                className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-xs shadow-md flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Open Channel</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
