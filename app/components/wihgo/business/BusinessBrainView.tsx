"use client";

import React, { useState } from 'react';
import { AIMemoryRule, PlatformId } from '../../../lib/wihgo/types';
import {
  Brain,
  Plus,
  Trash2,
  Sparkles,
  ShieldCheck,
  Sliders,
  CheckCircle2,
  Layers,
  Search
} from 'lucide-react';
import { INITIAL_MEMORY_RULES } from '../../../lib/wihgo/mockData';
import { BusinessMemoryExplorer } from './BusinessMemoryExplorer';

interface BusinessBrainViewProps {
  onOpenWorkspace?: (platformId: PlatformId) => void;
  onNavigateTab?: (tab: string) => void;
}

export const BusinessBrainView: React.FC<BusinessBrainViewProps> = ({
  onOpenWorkspace = () => {},
  onNavigateTab = () => {}
}) => {
  const [activeTab, setActiveTab] = useState<'memory-explorer' | 'directives'>('memory-explorer');
  const [rules, setRules] = useState<AIMemoryRule[]>(INITIAL_MEMORY_RULES);
  const [newTitle, setNewTitle] = useState('');
  const [newRule, setNewRule] = useState('');
  const [newCategory, setNewCategory] = useState<'tone' | 'workflow' | 'policy' | 'vip'>('workflow');

  const handleAddRule = () => {
    if (!newTitle.trim() || !newRule.trim()) return;
    const ruleItem: AIMemoryRule = {
      id: `rule-${Date.now()}`,
      title: newTitle.trim(),
      rule: newRule.trim(),
      category: newCategory,
      active: true
    };
    setRules(prev => [...prev, ruleItem]);
    setNewTitle('');
    setNewRule('');
  };

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const deleteRule = (id: string) => {
    setRules(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Navigation Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('memory-explorer')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'memory-explorer'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/50 shadow-md'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Brain className="w-4 h-4 text-teal-400" />
          <span>Business Memory & Continuity</span>
        </button>

        <button
          onClick={() => setActiveTab('directives')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'directives'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-md'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4 text-purple-400" />
          <span>Directives & Voice Rules ({rules.length})</span>
        </button>
      </div>

      {activeTab === 'memory-explorer' ? (
        <BusinessMemoryExplorer
          onOpenWorkspace={onOpenWorkspace}
          onNavigateTab={onNavigateTab}
        />
      ) : (
        <div className="space-y-6">
          {/* Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>WIHGO Business Directives</span>
                <Brain className="w-5 h-5 text-purple-400 animate-pulse" />
              </h1>
              <p className="text-xs text-slate-400">Configure brand voice, AI response policies, and custom business rules</p>
            </div>

            <div className="flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 px-3 py-1.5 rounded-2xl text-purple-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>WIHGO Brain Engine Active</span>
            </div>
          </div>

          {/* Add Rule Card */}
          <div className="bg-slate-900/90 border border-indigo-500/20 p-5 rounded-3xl backdrop-blur-xl space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Add Custom Memory Directive / Rule</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Directive Title (e.g., VIP Response Time)"
                className="bg-slate-950 text-xs text-white placeholder-slate-500 rounded-xl px-3 py-2.5 border border-slate-800 focus:border-cyan-400 focus:outline-none"
              />

              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as any)}
                className="bg-slate-950 text-xs text-white rounded-xl px-3 py-2.5 border border-slate-800 focus:border-cyan-400 focus:outline-none"
              >
                <option value="tone">Tone & Brand Voice</option>
                <option value="workflow">Workflow & Automation</option>
                <option value="policy">Business Policy</option>
                <option value="vip">VIP Contacts Protocol</option>
              </select>

              <button
                onClick={handleAddRule}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>Store Directive</span>
              </button>
            </div>

            <textarea
              value={newRule}
              onChange={e => setNewRule(e.target.value)}
              placeholder="Describe how WIHGO AI should handle inquiries, pricing, tone, or specific client categories..."
              className="w-full bg-slate-950 text-xs text-white placeholder-slate-500 rounded-xl p-3 border border-slate-800 focus:border-cyan-400 focus:outline-none h-20"
            />
          </div>

          {/* Rules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rules.map(rule => (
              <div
                key={rule.id}
                className={`bg-slate-900/90 border p-5 rounded-3xl backdrop-blur-xl transition-all duration-300 flex flex-col justify-between space-y-3 ${
                  rule.active
                    ? 'border-indigo-500/20 hover:border-purple-400/50'
                    : 'border-slate-800 opacity-50'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300">
                      {rule.category}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleRule(rule.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          rule.active
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {rule.active ? 'Active' : 'Disabled'}
                      </button>

                      <button
                        onClick={() => deleteRule(rule.id)}
                        className="p-1 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white">{rule.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{rule.rule}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
