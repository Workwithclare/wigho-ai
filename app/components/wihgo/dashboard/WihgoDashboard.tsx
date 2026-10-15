"use client";

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Task, FollowUpItem } from '../../../lib/wihgo/types';

function parseDue(s: string): number | null {
  if (!s) return null;
  const t = new Date(s).getTime();
  return Number.isNaN(t) ? null : t;
}
function startOfToday(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

interface Item {
  kind: 'task' | 'followup';
  id: string;
  title: string;
  detail: string;
  due: number | null;
  done: boolean;
  onToggle: () => void;
}

interface Props {
  tasks: Task[];
  followUps: FollowUpItem[];
  userName: string;
  userEmail: string;
  onToggleTask: (id: string) => void;
  onToggleFollowUp: (id: string) => void;
}

function cap(w: string): string {
  return w ? w.charAt(0).toUpperCase() + w.slice(1) : '';
}

function firstNameOf(name: string, email: string): string {
  const n = (name || '').trim();
  if (n) return cap(n.split(/\s+/)[0]);
  const prefix = (email || '').split('@')[0].replace(/[._-]+/g, ' ').trim();
  return prefix ? cap(prefix.split(/\s+/)[0]) : '';
}

export const WihgoDashboard: React.FC<Props> = ({ tasks, followUps, userName, userEmail, onToggleTask, onToggleFollowUp }) => {
  // Greeting is computed client-side only: the server renders a neutral
  // default so SSR and browser time can never hydration-mismatch.
  // Inline styles below guarantee visibility even if CSS fails to load.
  const [timeWord, setTimeWord] = useState('day');
  useEffect(() => {
    const h = new Date().getHours();
    setTimeWord(h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening');
  }, []);
  const today = startOfToday();

  const openTasks = tasks.filter((t) => !t.completed);
  const doneTasks = tasks.filter((t) => t.completed);
  const openUps = followUps.filter((f) => f.status !== 'completed');
  const doneUps = followUps.filter((f) => f.status === 'completed');

  const isOverdue = (due: number | null, done: boolean) => due !== null && !done && due < today;
  const isSoon = (due: number | null, done: boolean) =>
    due !== null && !done && due >= today && due < today + 2 * 86400000;

  const overdueCount =
    openTasks.filter((t) => isOverdue(parseDue(t.dueDate), false)).length +
    openUps.filter((f) => isOverdue(parseDue(f.followUpDate), false)).length;

  const attention: Item[] = useMemo(() => {
    const out: Item[] = [];
    for (const t of openTasks) {
      const due = parseDue(t.dueDate);
      if (isOverdue(due, false) || isSoon(due, false)) {
        out.push({
          kind: 'task', id: t.id, title: t.title,
          detail: due ? new Date(due).toLocaleDateString() : 'No date',
          due, done: false, onToggle: () => onToggleTask(t.id),
        });
      }
    }
    for (const f of openUps) {
      const due = parseDue(f.followUpDate);
      if (isOverdue(due, false) || isSoon(due, false)) {
        out.push({
          kind: 'followup', id: f.id, title: f.topic,
          detail: `${f.contactName}${due ? ' • ' + new Date(due).toLocaleDateString() : ''}`,
          due, done: false, onToggle: () => onToggleFollowUp(f.id),
        });
      }
    }
    return out.sort((a, b) => (a.due ?? Infinity) - (b.due ?? Infinity));
  }, [openTasks, openUps, onToggleTask, onToggleFollowUp, today]);

  const next3: Item[] = useMemo(() => {
    const all: Item[] = [
      ...openTasks.map((t) => ({
        kind: 'task' as const, id: t.id, title: t.title,
        detail: t.dueDate ? new Date(parseDue(t.dueDate) ?? Date.now()).toLocaleDateString() : 'No date',
        due: parseDue(t.dueDate), done: false, onToggle: () => onToggleTask(t.id),
      })),
      ...openUps.map((f) => ({
        kind: 'followup' as const, id: f.id, title: f.topic,
        detail: f.contactName, due: parseDue(f.followUpDate),
        done: false, onToggle: () => onToggleFollowUp(f.id),
      })),
    ];
    const rank = (i: Item) => (i.due !== null && i.due < today ? 0 : i.due !== null ? 1 : 2);
    return all.sort((a, b) => rank(a) - rank(b) || (a.due ?? Infinity) - (b.due ?? Infinity)).slice(0, 3);
  }, [openTasks, openUps, onToggleTask, onToggleFollowUp, today]);

  const stats = [
    { label: 'Open', value: openUps.length + openTasks.length },
    { label: 'Overdue', value: overdueCount },
    { label: 'Done', value: doneTasks.length + doneUps.length },
  ];

  const firstName = firstNameOf(userName, userEmail);
  const isNew = tasks.length === 0 && followUps.length === 0;

  const focusChat = () => {
    const el = document.getElementById('ask-mind-input');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (el as HTMLInputElement).focus({ preventScroll: true });
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8 opacity-100">
      <div className="opacity-100" style={{ backgroundColor: '#0A1116', border: '1px solid rgba(45,212,167,0.35)', borderRadius: '16px', padding: '20px', opacity: 1 }}>
        <h1
          className="text-2xl font-extrabold tracking-tight opacity-100"
          style={{ color: '#FFFFFF', opacity: 1 }}
        >
          Welcome{firstName ? ` ${firstName}` : ''}, Good {timeWord}. How may I help you?
        </h1>
        <p className="text-xs opacity-100" style={{ color: '#CBD5E1', opacity: 1 }}>WihGo Mind is ready. Here is your business at a glance.</p>
      </div>

      {isNew && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 opacity-100">
          <Link
            href="/followups"
            className="block p-4 rounded-2xl bg-slate-900 border border-teal-500/40 opacity-100 hover:border-teal-400 transition-all text-left"
            style={{ backgroundColor: '#0F172A', border: '1px solid rgba(45,212,167,0.4)', borderRadius: '16px', opacity: 1 }}
          >
            <div className="text-sm font-bold text-white" style={{ color: '#FFFFFF' }}>Add your first follow-up</div>
            <p className="text-xs text-slate-300 mt-1" style={{ color: '#CBD5E1' }}>Track a promise with a contact, topic and due date.</p>
          </Link>
          <a
            href="#capture-box"
            className="block p-4 rounded-2xl bg-slate-900 border border-teal-500/40 opacity-100 hover:border-teal-400 transition-all text-left"
            style={{ backgroundColor: '#0F172A', border: '1px solid rgba(45,212,167,0.4)', borderRadius: '16px', opacity: 1 }}
          >
            <div className="text-sm font-bold text-white" style={{ color: '#FFFFFF' }}>Paste a message and let WihGo Mind find the promises</div>
            <p className="text-xs text-slate-300 mt-1" style={{ color: '#CBD5E1' }}>Drop in WhatsApp, email or DM text and confirm what to save.</p>
          </a>
          <button
            onClick={focusChat}
            className="block w-full p-4 rounded-2xl bg-slate-900 border border-teal-500/40 opacity-100 hover:border-teal-400 transition-all text-left"
            style={{ backgroundColor: '#0F172A', border: '1px solid rgba(45,212,167,0.4)', borderRadius: '16px', opacity: 1 }}
          >
            <div className="text-sm font-bold text-white" style={{ color: '#FFFFFF' }}>Ask WihGo Mind anything</div>
            <p className="text-xs text-slate-300 mt-1" style={{ color: '#CBD5E1' }}>Get answers from your business memory and priorities.</p>
          </button>
          <Link
            href="/connect"
            className="block p-4 rounded-2xl bg-slate-900 border border-teal-500/40 opacity-100 hover:border-teal-400 transition-all text-left"
            style={{ backgroundColor: '#0F172A', border: '1px solid rgba(45,212,167,0.4)', borderRadius: '16px', opacity: 1 }}
          >
            <div className="text-sm font-bold text-white" style={{ color: '#FFFFFF' }}>Connect an app</div>
            <p className="text-xs text-slate-300 mt-1" style={{ color: '#CBD5E1' }}>Link Gmail, WhatsApp and more in Connected Apps.</p>
          </Link>
        </div>
      )}

      <div>
        <h2 className="text-sm font-bold text-white mb-3">Business Pulse</h2>
        <div className="grid grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="p-4 rounded-2xl bg-slate-900/80 border border-teal-500/20 text-center">
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-[11px] uppercase tracking-wider text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/20">
        <h2 className="text-sm font-bold text-white mb-3">What needs my attention</h2>
        {attention.length === 0 ? (
          <p className="text-xs text-slate-400">Nothing overdue or due soon. Add a follow-up with a deadline to see it here.</p>
        ) : (
          <ul className="space-y-2">
            {attention.map((a) => (
              <li key={`${a.kind}-${a.id}`} className="flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <div className="font-bold text-white truncate">{a.title}</div>
                  <div className="text-slate-400">{a.detail}</div>
                </div>
                <button onClick={a.onToggle} className="shrink-0 px-3 py-1.5 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 font-bold hover:bg-teal-500 hover:text-black transition-all">
                  Done
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-5 rounded-2xl bg-slate-900/80 border border-teal-500/20">
        <h2 className="text-sm font-bold text-white mb-3">What should I do next</h2>
        {next3.length === 0 ? (
          <p className="text-xs text-slate-400">Your list is clear. Add your first follow-up to get priorities here.</p>
        ) : (
          <ol className="space-y-2">
            {next3.map((a, i) => (
              <li key={`${a.kind}-${a.id}`} className="flex items-center gap-3 text-xs">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 font-black flex items-center justify-center shrink-0">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-white truncate">{a.title}</div>
                  <div className="text-slate-400">{a.detail}</div>
                </div>
                <button onClick={a.onToggle} className="shrink-0 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:text-white transition-all">
                  Done
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="p-5 rounded-2xl bg-slate-900/80 border border-indigo-500/20">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white">Follow-ups</h2>
          <Link href="/followups" className="text-xs font-bold text-teal-300 hover:text-teal-200">Open all →</Link>
        </div>
        {followUps.length === 0 ? (
          <p className="text-xs text-slate-400">No follow-ups yet. <Link href="/followups" className="text-teal-300 font-bold">Add your first follow-up</Link>.</p>
        ) : (
          <ul className="space-y-2">
            {followUps.slice(0, 5).map((f) => (
              <li key={f.id} className="flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <div className="font-bold text-white truncate">{f.topic}</div>
                  <div className="text-slate-400">{f.contactName}{f.status === 'completed' ? ' • Done' : ''}</div>
                </div>
                {f.status !== 'completed' && (
                  <button onClick={() => onToggleFollowUp(f.id)} className="shrink-0 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:text-white transition-all">
                    Done
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
