"use client";

import React, { useState } from 'react';
import { Reminder } from '../../../lib/wihgo/types';
import {
  Clock,
  Plus,
  CheckCircle2,
  Circle,
  Bell,
  Trash2
} from 'lucide-react';

interface RemindersViewProps {
  reminders: Reminder[];
  onToggleReminder: (id: string) => void;
  onDeleteReminder?: (id: string) => void;
  onAddReminder: (reminder: Reminder) => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  reminders,
  onToggleReminder,
  onDeleteReminder,
  onAddReminder
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddReminder({
      id: `rem-${Date.now()}`,
      title,
      dateTime: new Date().toISOString(),
      priority: 'high',
      repeat: 'daily',
      completed: false,
      platform: 'whatsapp'
    });

    setTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Platform Reminders</span>
            <Clock className="w-5 h-5 text-purple-400" />
          </h1>
          <p className="text-xs text-slate-400">Timely follow-ups & sound notifications across connected channels</p>
        </div>

        <button
          id="btn-add-reminder"
          onClick={() => setShowAddModal(true)}
          className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold text-xs shadow-md hover:shadow-lg flex items-center gap-1.5 transition-all w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Reminder</span>
        </button>
      </div>

      <div className="space-y-3">
        {reminders.length === 0 && (
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 text-center">
            <p className="text-sm font-bold text-white">No reminders yet</p>
            <p className="text-xs text-slate-400 mt-1">Add your first reminder with the New Reminder button above.</p>
          </div>
        )}
        {reminders.map((r) => (
          <div
            key={r.id}
            onClick={() => onToggleReminder(r.id)}
            className={`p-4 rounded-3xl border backdrop-blur-xl transition-all cursor-pointer flex items-center justify-between gap-4 ${
              r.completed
                ? 'bg-slate-900/40 border-slate-800 opacity-60'
                : 'bg-slate-900/80 border-indigo-500/15 hover:border-purple-500/30'
            }`}
          >
            {onDeleteReminder && (
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteReminder(r.id); }}
                className="text-slate-500 hover:text-red-400"
                aria-label="Delete reminder"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-center gap-3">
              <button className="text-purple-400">
                {r.completed ? <CheckCircle2 className="w-5 h-5 text-purple-400" /> : <Circle className="w-5 h-5 text-slate-600" />}
              </button>
              <div>
                <div className={`text-xs font-bold ${r.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                  {r.title}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Repeat: <span className="text-cyan-400 uppercase font-semibold">{r.repeat}</span>
                </div>
              </div>
            </div>

            <span className="text-[10px] font-bold text-purple-300 bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded-full">
              {r.platform}
            </span>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="bg-[#0B0F19] border border-purple-500/30 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white">Create Reminder</h3>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Reminder Text</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Check WhatsApp DM from David"
                className="w-full bg-slate-900 text-xs text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
