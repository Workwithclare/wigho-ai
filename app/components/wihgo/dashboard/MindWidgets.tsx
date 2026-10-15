"use client";

import React, { useState } from 'react';

export const AskMindBar: React.FC = () => {
  const [q, setQ] = useState('');
  const [reply, setReply] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim() || busy) return;
    setBusy(true);
    setReply(null);
    try {
      const r = await fetch('/api/ai/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q.trim(), task: 'chat' }),
      });
      if (!r.ok) throw new Error();
      const d = await r.json();
      setReply(d.reply || 'WihGo Mind has no answer right now — try again shortly.');
    } catch {
      setReply('WihGo Mind is temporarily offline — your data is safe, try again shortly.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-teal-950/40 to-slate-900/90 border border-teal-500/25 space-y-3">
      <h2 className="text-sm font-bold text-white">Ask WihGo Mind</h2>
      <form onSubmit={send} className="flex gap-2">
        <input
          id="ask-mind-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask WihGo Mind anything…"
          className="flex-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-500"
        />
        <button
          type="submit" disabled={busy || !q.trim()}
          className="px-4 py-2.5 rounded-xl bg-teal-500 text-black text-xs font-extrabold hover:bg-teal-400 disabled:opacity-50"
        >
          {busy ? '…' : 'Ask'}
        </button>
      </form>
      {reply && <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">{reply}</p>}
    </div>
  );
};

export const CaptureBox: React.FC<{ onSaved?: () => void }> = ({ onSaved }) => {
  const [text, setText] = useState('');
  const [preview, setPreview] = useState<{ contactName: string; promise: string; dueDate: string } | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);

  const extract = async () => {
    if (!text.trim() || busy) return;
    setBusy(true);
    setNote(null);
    setPreview(null);
    try {
      const r = await fetch('/api/ai/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error();
      setPreview(d.data);
      if (d.message) setNote(d.message);
    } catch {
      setNote('Extraction failed — you can still type the details below and confirm.');
      setPreview({ contactName: '', promise: text.trim().slice(0, 280), dueDate: '' });
    } finally {
      setBusy(false);
    }
  };

  const confirm = async () => {
    if (!preview || saving) return;
    setSaving(true);
    try {
      const r = await fetch('/api/commitments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactName: preview.contactName || 'Unknown', topic: preview.promise, followUpDate: preview.dueDate }),
      });
      if (!r.ok) throw new Error();
      setText('');
      setPreview(null);
      setNote('Saved to follow-ups.');
      onSaved?.();
    } catch {
      setNote('Could not save — try again shortly.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div id="capture-box" className="p-5 rounded-2xl bg-slate-900/80 border border-teal-500/25 space-y-3 scroll-mt-24">
      <h2 className="text-sm font-bold text-white">Capture — paste a message</h2>
      <p className="text-xs text-slate-400">Paste WhatsApp, email or DM text. WihGo Mind extracts the details; nothing saves until you confirm.</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste the message here…"
        rows={3}
        className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-500"
      />
      {!preview ? (
        <button
          onClick={extract} disabled={busy || !text.trim()}
          className="px-4 py-2.5 rounded-xl bg-teal-500 text-black text-xs font-extrabold hover:bg-teal-400 disabled:opacity-50"
        >
          {busy ? 'Extracting…' : 'Extract details'}
        </button>
      ) : (
        <div className="space-y-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
          <input
            value={preview.contactName}
            onChange={(e) => setPreview({ ...preview, contactName: e.target.value })}
            placeholder="Contact name"
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500"
          />
          <input
            value={preview.promise}
            onChange={(e) => setPreview({ ...preview, promise: e.target.value })}
            placeholder="Commitment / promise"
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500"
          />
          <input
            value={preview.dueDate}
            onChange={(e) => setPreview({ ...preview, dueDate: e.target.value })}
            placeholder="Due date"
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500"
          />
          <div className="flex gap-2">
            <button
              onClick={confirm} disabled={saving || !preview.promise.trim()}
              className="px-4 py-2 rounded-xl bg-teal-500 text-black text-xs font-extrabold hover:bg-teal-400 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Confirm & save'}
            </button>
            <button
              onClick={() => { setPreview(null); setNote(null); }}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:text-white"
            >
              Discard
            </button>
          </div>
        </div>
      )}
      {note && <p className="text-xs text-teal-300">{note}</p>}
    </div>
  );
};

export const CatchMeUpButton: React.FC = () => {
  const [brief, setBrief] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    if (busy) return;
    setBusy(true);
    setBrief(null);
    try {
      const r = await fetch('/api/ai/brief');
      const d = await r.json();
      if (!r.ok) throw new Error();
      setBrief(d.brief || 'No brief available right now.');
    } catch {
      setBrief('Could not load your brief — try again shortly.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/80 border border-indigo-500/25 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-white">Catch Me Up</h2>
        <button
          onClick={load} disabled={busy}
          className="px-4 py-2 rounded-xl bg-indigo-500 text-white text-xs font-extrabold hover:bg-indigo-400 disabled:opacity-50"
        >
          {busy ? 'Thinking…' : 'Get daily brief'}
        </button>
      </div>
      {brief && <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">{brief}</p>}
    </div>
  );
};
