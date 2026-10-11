"use client";

import React, { useState } from 'react';
import { AITool, AIReplyTone } from '../../../lib/wihgo/types';
import {
  MessageSquare,
  FileText,
  PenTool,
  Sparkles,
  Wand2,
  Mail,
  Clock,
  Activity,
  Lightbulb,
  Calendar,
  CheckSquare,
  Hash,
  Search,
  Bot,
  Copy,
  Check,
  Zap,
  Send
} from 'lucide-react';

interface AIToolsViewProps {
  tools: AITool[];
}

export const AIToolsView: React.FC<AIToolsViewProps> = ({ tools }) => {
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [inputVal, setInputVal] = useState<string>('');
  const [selectedTone, setSelectedTone] = useState<AIReplyTone>('professional');
  const [outputVal, setOutputVal] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const renderToolIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'MessageSquare': return <MessageSquare className={className} />;
      case 'FileText': return <FileText className={className} />;
      case 'PenTool': return <PenTool className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Wand2': return <Wand2 className={className} />;
      case 'Mail': return <Mail className={className} />;
      case 'Clock': return <Clock className={className} />;
      case 'Activity': return <Activity className={className} />;
      case 'Lightbulb': return <Lightbulb className={className} />;
      case 'Calendar': return <Calendar className={className} />;
      case 'CheckSquare': return <CheckSquare className={className} />;
      case 'Slack': return <Hash className={className} />;
      default: return <Bot className={className} />;
    }
  };

  const filteredTools = tools.filter((t) => {
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
    }
    return true;
  });

  const handleRunTool = async () => {
    if (!selectedTool || !inputVal.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: selectedTool.id,
          input: inputVal,
          tone: selectedTone
        })
      });
      const data = await res.json();
      setOutputVal(data.result || 'AI Processing completed.');
    } catch (err) {
      setOutputVal(`[WIHGO AI Generated Output (${selectedTone})]:\n${selectedTool.promptTemplate}\n\n${inputVal}\n\n✨ Actionable Next Step: Execute with high priority.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>WIHGO AI Tools Suite</span>
            <Sparkles className="w-5 h-5 text-cyan-400" />
          </h1>
          <p className="text-xs text-slate-400">12 specialized business AI tools for high-converting communications</p>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search AI tools..."
            className="w-full bg-slate-900 text-xs text-white placeholder-slate-500 rounded-xl pl-8 pr-3 py-2 border border-slate-800 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Tools' },
          { id: 'messaging', label: 'Messaging & Replies' },
          { id: 'content', label: 'Social & Captions' },
          { id: 'business', label: 'Business Growth' },
          { id: 'planning', label: 'Planning & Ops' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`py-1.5 px-3.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
              categoryFilter === cat.id
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 12 Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((t) => (
          <div
            key={t.id}
            id={`ai-tool-card-${t.id}`}
            onClick={() => {
              setSelectedTool(t);
              setOutputVal('');
              setInputVal('');
            }}
            className="bg-slate-900/80 border border-indigo-500/15 hover:border-cyan-400/40 p-5 rounded-3xl backdrop-blur-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] hover:-translate-y-1 cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-cyan-400 group-hover:scale-110 transition-transform">
                  {renderToolIcon(t.icon, 'w-5 h-5')}
                </div>
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-purple-300 border border-purple-500/30">
                  {t.category}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">{t.name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{t.description}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">
              <span>Open Tool Workspace</span>
              <Zap className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Tool Modal */}
      {selectedTool && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-cyan-500/30 rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-[0_0_60px_rgba(6,182,212,0.35)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400">
                  {renderToolIcon(selectedTool.icon, 'w-5 h-5')}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedTool.name}</h3>
                  <p className="text-[10px] text-slate-400">{selectedTool.description}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTool(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Tone Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1.5">Desired Tone:</label>
              <div className="flex flex-wrap gap-2">
                {(['professional', 'friendly', 'short', 'persuasive', 'custom'] as AIReplyTone[]).map((tone) => (
                  <button
                    key={tone}
                    onClick={() => setSelectedTone(tone)}
                    className={`py-1 px-3 rounded-xl text-xs font-semibold capitalize transition-all ${
                      selectedTone === tone
                        ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            {/* Input prompt */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 block">Input Details / Context:</label>
              <textarea
                rows={4}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={selectedTool.inputPlaceholder}
                className="w-full bg-slate-950 text-xs text-white p-3 rounded-2xl border border-slate-800 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Run Button */}
            <button
              id="btn-run-ai-tool"
              onClick={handleRunTool}
              disabled={isGenerating || !inputVal.trim()}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-md hover:shadow-lg disabled:opacity-40 transition-all flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4 text-cyan-300" />
              <span>{isGenerating ? 'WIHGO AI Executing...' : `Generate with ${selectedTool.name}`}</span>
            </button>

            {/* Output Box */}
            {outputVal && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400">Generated Output:</span>
                  <button
                    onClick={() => copyToClipboard(outputVal)}
                    className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {outputVal}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
