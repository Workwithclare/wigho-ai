"use client";

import React, { useState } from 'react';
import { 
  BusinessMemoryItem, 
  BusinessEntityType, 
  Commitment, 
  ContinuityContext, 
  PlatformId 
} from '../../../lib/wihgo/types';
import {
  Brain,
  Search,
  Sparkles,
  Plus,
  User,
  Building2,
  Calendar as CalendarIcon,
  CheckSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  DollarSign,
  MessageSquare,
  ArrowRight,
  Camera,
  ThumbsUp,
  Music2,
  Briefcase,
  X as XIcon,
  Hash,
  Mail,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Filter,
  Layers,
  FileText
} from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { BusinessMemoryService } from '../../../lib/wihgo/memory/businessMemory';

interface BusinessMemoryExplorerProps {
  onOpenWorkspace?: (platformId: PlatformId) => void;
  onNavigateTab?: (tab: string) => void;
}

export const BusinessMemoryExplorer: React.FC<BusinessMemoryExplorerProps> = ({
  onOpenWorkspace = (_platformId?: any) => {},
  onNavigateTab = (_tab?: any) => {}
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeEntityType, setActiveEntityType] = useState<BusinessEntityType | 'all'>('all');
  const [memories, setMemories] = useState<BusinessMemoryItem[]>(() => BusinessMemoryService.getAllMemories());
  const [commitments, setCommitments] = useState<Commitment[]>(() => BusinessMemoryService.getCommitments());
  const [selectedContinuityContact, setSelectedContinuityContact] = useState<string | null>(null);
  const [continuityContext, setContinuityContext] = useState<ContinuityContext | null>(null);
  
  // Natural Language Search Result State
  const [searchResult, setSearchResult] = useState<{
    synthesizedAnswer: string;
    entitiesFound: string[];
  } | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Add Memory Modal State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newEntityType, setNewEntityType] = useState<BusinessEntityType>('customer');
  const [newEntityName, setNewEntityName] = useState<string>('');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDetail, setNewDetail] = useState<string>('');
  const [newPlatform, setNewPlatform] = useState<PlatformId>('whatsapp');

  const SUGGESTED_QUERIES = [
    "What did Sarah ask about last month?",
    "Which customers are waiting for a response?",
    "What did we promise John?",
    "Show me everything related to David Chen",
    "What decisions need owner approval?"
  ];

  const handleExecuteSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    setTimeout(() => {
      const res = BusinessMemoryService.searchBusinessMemory(query);
      setSearchResult({
        synthesizedAnswer: res.synthesizedAnswer,
        entitiesFound: res.entitiesFound
      });
      setIsSearching(false);
    }, 200);
  };

  const handleOpenContinuity = (customerName: string, platform: PlatformId = 'whatsapp') => {
    setSelectedContinuityContact(customerName);
    const ctx = BusinessMemoryService.getContinuityContext(customerName, platform);
    setContinuityContext(ctx);
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntityName.trim() || !newTitle.trim()) return;

    const created = BusinessMemoryService.addMemory({
      entityType: newEntityType,
      entityName: newEntityName,
      platform: newPlatform,
      title: newTitle,
      detail: newDetail || newTitle,
      tags: ['manual-entry', newEntityType, newPlatform],
      status: 'active',
      confidence: 1.0,
      extractedFrom: 'WIHGO AI Business Memory Hub'
    });

    setMemories(BusinessMemoryService.getAllMemories());
    setShowAddModal(false);
    setNewEntityName('');
    setNewTitle('');
    setNewDetail('');
  };

  const filteredMemories = activeEntityType === 'all'
    ? memories
    : memories.filter(m => m.entityType === activeEntityType);

  const renderPlatformIcon = (id?: string, className: string = 'w-3.5 h-3.5') => {
    switch (id) {
      case 'whatsapp': return <WhatsAppIcon className={className} />;
      case 'instagram': return <Camera className={`${className} text-pink-400`} />;
      case 'facebook': return <ThumbsUp className={`${className} text-blue-400`} />;
      case 'tiktok': return <Music2 className={`${className} text-cyan-400`} />;
      case 'linkedin': return <Briefcase className={`${className} text-sky-400`} />;
      case 'x': return <XIcon className={`${className} text-slate-200`} />;
      case 'slack': return <Hash className={`${className} text-purple-400`} />;
      case 'email': return <Mail className={`${className} text-rose-400`} />;
      case 'calendar': return <CalendarIcon className={`${className} text-teal-400`} />;
      default: return <MessageSquare className={className} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-[#0B0F19] via-slate-900 to-[#0B0F19] border border-teal-500/30 rounded-3xl p-6 shadow-[0_0_40px_rgba(20,184,166,0.1)] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/40 text-teal-300 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-teal-400" />
                <span>AI Business Memory Layer</span>
              </span>
              <span className="text-[11px] text-slate-400">Contextual Retention Engine</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Business Memory & Continuity Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Persistent, searchable business knowledge organized across all customers, commitments, decisions, and connected channels.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg flex items-center gap-2 transition-all self-start md:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record New Memory</span>
          </button>
        </div>

        {/* Natural Language Search Bar */}
        <div className="mt-6 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-teal-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  handleExecuteSearch(searchQuery);
                }
              }}
              placeholder="Ask business memory anything (e.g. 'What did Sarah ask about last month?', 'What did we promise John?')..."
              className="w-full bg-slate-950/90 text-sm text-white pl-11 pr-28 py-3.5 rounded-2xl border border-teal-500/30 focus:border-teal-400 focus:outline-none placeholder-slate-500 shadow-inner"
            />
            <button
              onClick={() => handleExecuteSearch(searchQuery || 'What needs attention?')}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Query AI</span>
            </button>
          </div>

          {/* Quick Query Suggestion Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-teal-400" />
              Try asking:
            </span>
            {SUGGESTED_QUERIES.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleExecuteSearch(q)}
                className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-teal-500/40 text-[11px] text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>

        {/* AI Synthesized Context Box */}
        {searchResult && (
          <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-teal-500/40 space-y-2.5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                  AI Synthesized Business Memory Result
                </span>
              </div>
              <button
                onClick={() => setSearchResult(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕ Close
              </button>
            </div>

            <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              {searchResult.synthesizedAnswer}
            </div>

            {searchResult.entitiesFound.length > 0 && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] font-bold text-slate-400">Related Entities:</span>
                <div className="flex flex-wrap gap-1.5">
                  {searchResult.entitiesFound.map((ent, i) => (
                    <button
                      key={i}
                      onClick={() => handleOpenContinuity(ent)}
                      className="px-2 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[10px] font-semibold hover:bg-teal-500/20 cursor-pointer flex items-center gap-1"
                    >
                      <User className="w-2.5 h-2.5" />
                      <span>{ent}</span>
                      <ExternalLink className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Entity Filters & Memory Grid */}
      <div className="space-y-4">
        {/* Entity Type Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
          {[
            { id: 'all', label: 'All Records', count: memories.length },
            { id: 'customer', label: 'Customers', count: memories.filter(m => m.entityType === 'customer').length },
            { id: 'lead', label: 'Leads', count: memories.filter(m => m.entityType === 'lead').length },
            { id: 'commitment', label: 'Commitments & Promises', count: memories.filter(m => m.entityType === 'commitment').length },
            { id: 'decision', label: 'Decisions', count: memories.filter(m => m.entityType === 'decision').length },
            { id: 'opportunity', label: 'Opportunities', count: memories.filter(m => m.entityType === 'opportunity').length },
            { id: 'meeting', label: 'Meetings', count: memories.filter(m => m.entityType === 'meeting').length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveEntityType(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeEntityType === tab.id
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/50 shadow-sm'
                  : 'bg-slate-900/90 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Memory Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMemories.map(mem => (
            <div
              key={mem.id}
              className="bg-[#0B0F19] border border-slate-800 hover:border-teal-500/40 rounded-2xl p-5 space-y-3 shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2.5">
                {/* Header line: Entity type, Entity Name, Channel */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[10px] font-extrabold uppercase tracking-wider">
                      {mem.entityType}
                    </span>
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      {renderPlatformIcon(mem.platform)}
                      <span>{mem.entityName}</span>
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400">
                    {mem.date}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                  {mem.title}
                </h3>

                {/* Detail */}
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-900">
                  {mem.detail}
                </p>

                {/* Tags & Metadata */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {mem.amountOrValue && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                      {mem.amountOrValue}
                    </span>
                  )}
                  {mem.dueDateOrTime && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-semibold flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{mem.dueDateOrTime}</span>
                    </span>
                  )}
                  {mem.tags.map((t, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 text-[9px] font-mono">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Bottom Row */}
              <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 mt-2">
                <span className="text-[10px] text-slate-400 truncate max-w-[180px]">
                  Source: {mem.extractedFrom || 'Unified Memory'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenContinuity(mem.entityName, (mem.platform as any) || 'whatsapp')}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-teal-500/40 text-teal-300 text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>Continuity Card</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>

                  {mem.platform && mem.platform !== 'system' && (
                    <button
                      onClick={() => onOpenWorkspace(mem.platform as PlatformId)}
                      className="px-2.5 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Continuity Drawer / Modal */}
      {continuityContext && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-teal-500/40 rounded-3xl p-6 max-w-xl w-full space-y-4 shadow-[0_0_50px_rgba(20,184,166,0.3)] animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    Continuity Context Card: {continuityContext.customerName}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {continuityContext.companyName || 'Business Contact'} • {continuityContext.handle}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setContinuityContext(null)}
                className="text-slate-400 hover:text-white text-xs font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Context Blocks */}
            <div className="space-y-3 text-xs max-h-[60vh] overflow-y-auto pr-1">
              {/* Previous Interaction & Response */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Previous Interaction
                  </span>
                  <p className="text-slate-200 text-[11px] leading-relaxed">
                    {continuityContext.previousInteraction}
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Previous Response Sent
                  </span>
                  <p className="text-slate-200 text-[11px] leading-relaxed">
                    {continuityContext.previousResponse}
                  </p>
                </div>
              </div>

              {/* Current Status & Recommended Action */}
              <div className="p-3.5 bg-teal-500/10 rounded-xl border border-teal-500/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider">
                    Recommended Next Action
                  </span>
                  <span className="text-[10px] font-bold text-amber-300">
                    Status: {continuityContext.currentStatus}
                  </span>
                </div>
                <p className="text-white text-xs font-semibold">
                  {continuityContext.recommendedNextAction}
                </p>
              </div>

              {/* Commitments & Promises */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckSquare className="w-3 h-3 text-teal-400" />
                  Active Commitments & Promises
                </span>
                {continuityContext.commitments.length === 0 ? (
                  <p className="text-[11px] text-slate-400">No pending commitments recorded.</p>
                ) : (
                  <div className="space-y-1.5">
                    {continuityContext.commitments.map(c => (
                      <div key={c.id} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-200 flex items-center justify-between">
                        <span>• {c.promiseText}</span>
                        <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                          Due {c.dueDate}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Responsible Team Member & Preferences */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-[11px]">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">Responsible Owner:</span>
                  <span className="text-white font-bold">{continuityContext.responsiblePerson}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">Last Active:</span>
                  <span className="text-slate-300 font-mono">{continuityContext.lastInteractionDate}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setContinuityContext(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-800"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setContinuityContext(null);
                  onOpenWorkspace(continuityContext.platform);
                }}
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-md cursor-pointer"
              >
                Open Conversation in Workspace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleAddMemory}
            className="bg-[#0B0F19] border border-teal-500/40 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-[0_0_50px_rgba(20,184,166,0.3)]"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-teal-400" />
                <h3 className="text-sm font-bold text-white">Record Business Memory</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Entity Type & Platform */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Entity Type</label>
                <select
                  value={newEntityType}
                  onChange={(e) => setNewEntityType(e.target.value as BusinessEntityType)}
                  className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-xl border border-slate-800 focus:border-teal-400"
                >
                  <option value="customer">Customer</option>
                  <option value="lead">Lead</option>
                  <option value="commitment">Commitment / Promise</option>
                  <option value="decision">Decision</option>
                  <option value="opportunity">Opportunity</option>
                  <option value="meeting">Meeting</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Channel / Platform</label>
                <select
                  value={newPlatform}
                  onChange={(e) => setNewPlatform(e.target.value as PlatformId)}
                  className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-xl border border-slate-800 focus:border-teal-400"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="tiktok">TikTok</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="slack">Slack</option>
                  <option value="email">Gmail / Email</option>
                </select>
              </div>
            </div>

            {/* Entity Name */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Entity Name / Contact</label>
              <input
                type="text"
                required
                value={newEntityName}
                onChange={(e) => setNewEntityName(e.target.value)}
                placeholder="e.g. John Doe, Apex Tech, Q3 Campaign..."
                className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-xl border border-slate-800 focus:border-teal-400"
              />
            </div>

            {/* Memory Title */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Title / Key Summary</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Promised custom quote by Friday..."
                className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-xl border border-slate-800 focus:border-teal-400"
              />
            </div>

            {/* Detail */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Detailed Context & Rules</label>
              <textarea
                rows={3}
                value={newDetail}
                onChange={(e) => setNewDetail(e.target.value)}
                placeholder="Additional notes, key client preferences, pricing terms, or follow-up milestones..."
                className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-xl border border-slate-800 focus:border-teal-400"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="py-2 px-3 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-md cursor-pointer"
              >
                Save to Business Memory
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
