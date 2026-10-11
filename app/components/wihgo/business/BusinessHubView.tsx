"use client";

import React, { useState } from 'react';
import { 
  UserProfile, 
  PlatformId, 
  AttentionItem, 
  AttentionCategory, 
  BusinessMemoryItem, 
  BusinessEntityType, 
  Commitment, 
  ContinuityContext,
  BusinessInsightItem,
  BusinessContextRelation
} from '../../../lib/wihgo/types';
import {
  Brain,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Lightbulb,
  TrendingUp,
  Eye,
  Layers,
  Check,
  Filter,
  Camera,
  ThumbsUp,
  Music2,
  Briefcase,
  X as XIcon,
  Hash,
  Mail,
  Calendar as CalendarIcon,
  MessageSquare,
  ChevronRight,
  Search,
  Bot,
  Send,
  Plus,
  ExternalLink,
  Users,
  Building2,
  FileText,
  DollarSign,
  Compass,
  Link2,
  User,
  ShieldCheck,
  Zap,
  Target,
  RefreshCw
} from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { AttentionEngine } from '../../../lib/wihgo/attention/attentionEngine';
import { BusinessMemoryService } from '../../../lib/wihgo/memory/businessMemory';
import { BusinessInsightsService } from '../../../lib/wihgo/insights/businessInsights';

export type BusinessHubTab = 'attention' | 'memory' | 'continuity' | 'insights' | 'context' | 'assistant';

interface BusinessHubViewProps {
  user?: UserProfile;
  initialTab?: BusinessHubTab;
  onNavigate?: (tab: string) => void;
  onOpenWorkspace?: (platformId: PlatformId | string) => void;
}

export const BusinessHubView: React.FC<BusinessHubViewProps> = ({
  user,
  initialTab = 'attention',
  onNavigate = (_tab?: string) => {},
  onOpenWorkspace = (_platformId?: PlatformId | string) => {}
}) => {
  const [activeTab, setActiveTab] = useState<BusinessHubTab>(initialTab);
  
  // What Needs Me State
  const [attentionItems, setAttentionItems] = useState<AttentionItem[]>(() => AttentionEngine.getAttentionItems());
  const [attentionFilter, setAttentionFilter] = useState<AttentionCategory | 'all'>('all');
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());

  // Business Memory State
  const [memories, setMemories] = useState<BusinessMemoryItem[]>(() => BusinessMemoryService.getAllMemories());
  const [commitments, setCommitments] = useState<Commitment[]>(() => BusinessMemoryService.getCommitments());
  const [memorySearchQuery, setMemorySearchQuery] = useState<string>('');
  const [activeEntityType, setActiveEntityType] = useState<BusinessEntityType | 'all'>('all');
  const [memorySearchResult, setMemorySearchResult] = useState<{
    synthesizedAnswer: string;
    entitiesFound: string[];
    confidence: number;
    matchingMemories: BusinessMemoryItem[];
  } | null>(null);

  // AI Continuity State
  const [selectedContinuityCustomer, setSelectedContinuityCustomer] = useState<string>('David Chen');
  const [continuityData, setContinuityData] = useState<ContinuityContext>(() => 
    BusinessMemoryService.getContinuityContext('David Chen')
  );

  // Business Insights State
  const [insights, setInsights] = useState<BusinessInsightItem[]>(() => BusinessInsightsService.getInsights());
  const [insightFilter, setInsightFilter] = useState<string>('all');

  // Business Context State
  const [contextRelations, setContextRelations] = useState<BusinessContextRelation[]>(() => 
    BusinessInsightsService.getContextRelations()
  );
  const [selectedRelationId, setSelectedRelationId] = useState<string>('rel-david-chen');

  // Business Hub AI Assistant State
  const [assistantInput, setAssistantInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<Array<{
    sender: 'user' | 'ai';
    text: string;
    timestamp: string;
    citations?: string[];
    actionSuggestion?: { label: string; tab?: string; platform?: PlatformId };
  }>>([
    {
      sender: 'ai',
      text: `Hello ${user?.name ? user.name.split(' ')[0] : 'there'}, I am your WIHGO Business Hub Intelligence. I continuously monitor and remember activity across all your connected channels (Gmail, WhatsApp, Camera, Hash, Calendar). Ask me anything about customer history, open promises, pending decisions, or what needs your attention.`,
      timestamp: 'Just now',
      citations: ['Connected Business Context Engine', 'Supabase Business RLS Layer']
    }
  ]);
  const [isAiAnswering, setIsAiAnswering] = useState<boolean>(false);

  // Derived counts for What Needs Me
  const activeAttentionItems = attentionItems.filter(i => !i.resolved && !resolvedIds.has(i.id));
  const counts = {
    urgent: activeAttentionItems.filter(i => i.category === 'urgent').length,
    decisions: activeAttentionItems.filter(i => i.category === 'decisions').length,
    followups: activeAttentionItems.filter(i => i.category === 'followups').length,
    opportunities: activeAttentionItems.filter(i => i.category === 'opportunities').length,
    information: activeAttentionItems.filter(i => i.category === 'information').length,
    total: activeAttentionItems.length
  };

  const filteredAttentionItems = attentionFilter === 'all'
    ? activeAttentionItems
    : activeAttentionItems.filter(i => i.category === attentionFilter);

  // Helper to render platform icons
  const renderPlatformIcon = (id?: string, className: string = 'w-4 h-4') => {
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
      default: return <MessageSquare className={`${className} text-teal-400`} />;
    }
  };

  const handleResolveAttention = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setResolvedIds(prev => new Set(prev).add(id));
    AttentionEngine.resolveItem(id);
  };

  const handleActionClick = (item: AttentionItem) => {
    if (item.targetPlatform) {
      onOpenWorkspace(item.targetPlatform);
    } else if (item.targetTab) {
      onNavigate(item.targetTab);
    } else {
      onNavigate('inbox');
    }
  };

  const handleMemorySearch = (queryOverride?: string) => {
    const q = (queryOverride !== undefined ? queryOverride : memorySearchQuery).trim();
    if (!q) {
      setMemorySearchResult(null);
      return;
    }

    const lower = q.toLowerCase();
    const matches = BusinessMemoryService.getMemoriesForCustomer(lower);

    let answer = `Found ${matches.length} relevant business records for "${q}".`;
    let confidence = 0.94;
    let entities: string[] = [];

    if (lower.includes('sarah') || lower.includes('support') || lower.includes('sla')) {
      answer = 'Sarah Jenkins (Lumina Design) requested clarity on 24/7 weekend SLA support 18 hours ago. We previously sent the initial onboarding presentation, and an approved decision exists to offer a 4-hour weekend response window for annual commitments.';
      entities = ['Sarah Jenkins', 'Lumina Design', 'Email Support SLA'];
      confidence = 0.98;
    } else if (lower.includes('john') || lower.includes('promise') || lower.includes('acme')) {
      answer = 'We promised John Doe (Acme Corp) a customized multi-channel architecture plan detailing Slack, Gmail, and WhatsApp sync without data overlap. Deadline is this Friday at 5:00 PM.';
      entities = ['John Doe', 'Acme Corp', 'Architecture Plan Promise'];
      confidence = 0.99;
    } else if (lower.includes('david') || lower.includes('pricing') || lower.includes('catalog') || lower.includes('tier')) {
      answer = 'David Chen (Apex Tech) is requesting updated Q3 product catalog and Tier 2 volume discount schedule for 25 seats on WhatsApp. A 15% discount has been approved by the owner and is pending dispatch.';
      entities = ['David Chen', 'Apex Tech Solutions', 'Volume Tier Matrix'];
      confidence = 0.97;
    } else if (lower.includes('jessica') || lower.includes('lead') || lower.includes('instagram')) {
      answer = 'Jessica Miller (@jessica_design32) is a hot inbound agency lead who messaged twice after viewing our Connect Hub showcase reel. She is looking to license 12 client accounts.';
      entities = ['Jessica Miller', 'Miller Creative', 'Agency Reseller Lead'];
      confidence = 0.95;
    } else if (matches.length > 0) {
      answer = `Based on connected business memory: ${matches[0].detail}`;
      entities = [matches[0].entityName, matches[0].entityType];
    } else {
      answer = `WIHGO does not have enough verified records for "${q}". Try querying by customer name (Sarah, David, John, Jessica) or topic (pricing, promise, SLA, meeting).`;
      confidence = 0.65;
    }

    setMemorySearchResult({
      synthesizedAnswer: answer,
      entitiesFound: entities,
      confidence,
      matchingMemories: matches.length > 0 ? matches : BusinessMemoryService.getAllMemories().slice(0, 3)
    });
  };

  const handleSelectContinuityContact = (name: string) => {
    setSelectedContinuityCustomer(name);
    const ctx = BusinessMemoryService.getContinuityContext(name);
    setContinuityData(ctx);
  };

  const handleSendAssistantQuery = (queryText?: string) => {
    const text = queryText || assistantInput;
    if (!text.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: text.trim(),
      timestamp: 'Just now'
    };

    setChatMessages(prev => [...prev, userMsg]);
    setAssistantInput('');
    setIsAiAnswering(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = '';
      let citations: string[] = ['Connected Workspace Streams', 'Business Memory Database'];
      let suggestion: { label: string; tab?: string; platform?: PlatformId } | undefined = undefined;

      if (lower.includes('attention') || lower.includes('need me') || lower.includes('urgent')) {
        reply = `You currently have **${counts.total} items requiring attention**:\n\n1. 🔴 **Sarah Jenkins (Email)**: Waiting 18 hours for weekend SLA response.\n2. 🟡 **David Chen (WhatsApp)**: Waiting for revised Q3 Catalog and Tier 2 volume schedule.\n3. 🟡 **Alex Vance (Hash)**: Launch campaign creative assets ready for review.\n4. 🟢 **Jessica Miller (Camera)**: Hot inbound lead ready for agency tier demo.\n5. 🔵 **John Doe (Acme Corp)**: Architecture blueprint deliverable due this Friday.`;
        suggestion = { label: 'View What Needs Me', tab: 'attention' };
        citations = ['Attention Engine v1', 'Gmail & WhatsApp Inboxes'];
      } else if (lower.includes('promise') || lower.includes('commit')) {
        reply = `Here are active commitments made to your customers:\n\n• **John Doe (Acme Corp)**: Customized multi-channel integration plan by Friday 5:00 PM (Responsible: Clare).\n• **David Chen (Apex Tech)**: Q3 volume discount tiers PDF today (Responsible: Clare).\n• **Sarah Jenkins (Lumina Design)**: Written weekend SLA terms today.\n• **Jessica Miller (Miller Creative)**: Agency Partner Deck by tomorrow.`;
        suggestion = { label: 'Explore Commitments', tab: 'memory' };
        citations = ['Business Memory Commitments Table'];
      } else if (lower.includes('lead') || lower.includes('sales') || lower.includes('opportunity')) {
        reply = `Your top prospective opportunities right now:\n\n1. 🟢 **Jessica Miller (Miller Creative)**: High intent for 12-seat agency tier (~+$9,600 ARR).\n2. 🟢 **David Chen (Apex Tech)**: 25 seats onboarding for Q3 operations (~+$12,500/yr).\n3. 🟢 **Sarah Johnson (Horizon VC)**: Venture partnership intro requested for Thursday 2:00 PM.`;
        suggestion = { label: 'Open Insights', tab: 'insights' };
        citations = ['Business Insights Engine', 'Instagram & Email Channels'];
      } else if (lower.includes('sarah')) {
        reply = `**Context for Sarah Jenkins (Lumina Design)**:\n\n• **Last interaction**: Sent email 18 hours ago asking if Premium includes dedicated weekend support.\n• **Current status**: Waiting for your confirmation.\n• **Recommended action**: Confirm 4-hour weekend response window and send approved terms.`;
        suggestion = { label: 'Open Continuity Card', tab: 'continuity' };
        citations = ['Gmail Thread #lumina-support', 'Customer Continuity Graph'];
      } else if (lower.includes('summarize') || lower.includes('activity') || lower.includes('week')) {
        reply = `**Weekly Business Activity Summary**:\n\n• **Customer Communications**: 18 cross-channel conversations across WhatsApp (8), Email (5), Camera (3), Hash (2).\n• **Response Rate**: 92% SLA compliance (1 item pending SLA recovery: Sarah Jenkins).\n• **Deals in Pipeline**: $22,100 pipeline across Apex Tech, Miller Creative, and Acme Corp.\n• **Active Commitments**: 4 promises recorded with 0 overdue.`;
        citations = ['Unified Activity Log', 'Cross-Platform Aggregator'];
      } else {
        reply = `Based on your connected business memory: I found relevant context across your Gmail, WhatsApp, and Camera interactions. No critical unhandled emergencies detected outside of the ${counts.urgent} urgent items listed in your Attention center.`;
      }

      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          timestamp: 'Just now',
          citations,
          actionSuggestion: suggestion
        }
      ]);
      setIsAiAnswering(false);
    }, 600);
  };

  const selectedRelation = contextRelations.find(r => r.id === selectedRelationId) || contextRelations[0];

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Business Hub Hero Header */}
      <div className="bg-gradient-to-r from-slate-900/95 via-teal-950/40 to-indigo-950/40 border border-teal-500/30 rounded-3xl p-5 sm:p-6 backdrop-blur-2xl shadow-[0_0_40px_rgba(20,184,166,0.15)] relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-2xl bg-teal-500/20 border border-teal-400/40 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                <Brain className="w-6 h-6 animate-pulse text-teal-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Business Hub
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-[10px] font-extrabold uppercase tracking-wider">
                    Intelligence Center
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  AI Business Memory & Attention Platform • What is happening, what to know, and what needs you
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <div 
              onClick={() => setActiveTab('attention')}
              className="p-3 rounded-2xl bg-slate-900/90 border border-rose-500/30 hover:border-rose-400 transition-all cursor-pointer text-center"
            >
              <div className="text-[10px] uppercase font-bold text-rose-400 tracking-wider flex items-center justify-center gap-1">
                <AlertCircle className="w-3 h-3" />
                <span>Attention</span>
              </div>
              <div className="text-lg font-black text-white mt-0.5">
                {counts.total} <span className="text-xs font-normal text-rose-400/80">items</span>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('memory')}
              className="p-3 rounded-2xl bg-slate-900/90 border border-teal-500/30 hover:border-teal-400 transition-all cursor-pointer text-center"
            >
              <div className="text-[10px] uppercase font-bold text-teal-400 tracking-wider flex items-center justify-center gap-1">
                <Brain className="w-3 h-3" />
                <span>Memories</span>
              </div>
              <div className="text-lg font-black text-white mt-0.5">
                {memories.length} <span className="text-xs font-normal text-teal-400/80">records</span>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('continuity')}
              className="p-3 rounded-2xl bg-slate-900/90 border border-indigo-500/30 hover:border-indigo-400 transition-all cursor-pointer text-center"
            >
              <div className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider flex items-center justify-center gap-1">
                <Compass className="w-3 h-3" />
                <span>Continuity</span>
              </div>
              <div className="text-lg font-black text-white mt-0.5">
                {commitments.length} <span className="text-xs font-normal text-indigo-400/80">promises</span>
              </div>
            </div>

            <div 
              onClick={() => setActiveTab('insights')}
              className="p-3 rounded-2xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 transition-all cursor-pointer text-center"
            >
              <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Insights</span>
              </div>
              <div className="text-lg font-black text-white mt-0.5">
                {insights.length} <span className="text-xs font-normal text-cyan-400/80">patterns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Business Hub Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 mt-5 pt-4 border-t border-teal-500/20 overflow-x-auto scrollbar-none">
          <button
            id="tab-hub-attention"
            onClick={() => setActiveTab('attention')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'attention'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-md shadow-rose-500/10'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>1. What Needs Me?</span>
            {counts.total > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black">
                {counts.total}
              </span>
            )}
          </button>

          <button
            id="tab-hub-memory"
            onClick={() => setActiveTab('memory')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'memory'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/50 shadow-md shadow-teal-500/10'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-teal-400" />
            <span>2. Business Memory</span>
          </button>

          <button
            id="tab-hub-continuity"
            onClick={() => setActiveTab('continuity')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'continuity'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/50 shadow-md shadow-indigo-500/10'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span>3. AI Continuity</span>
          </button>

          <button
            id="tab-hub-insights"
            onClick={() => setActiveTab('insights')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'insights'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-md shadow-cyan-500/10'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>4. Business Insights</span>
          </button>

          <button
            id="tab-hub-context"
            onClick={() => setActiveTab('context')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'context'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-md shadow-purple-500/10'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <Link2 className="w-3.5 h-3.5 text-purple-400" />
            <span>5. Business Context</span>
          </button>

          <button
            id="tab-hub-assistant"
            onClick={() => setActiveTab('assistant')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'assistant'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md shadow-amber-500/10'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-amber-400" />
            <span>Hub AI Assistant</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. WHAT NEEDS ME? (ATTENTION CENTER) */}
      {/* ========================================================================= */}
      {activeTab === 'attention' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>What Needs Me?</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold">
                  {counts.total} items require human attention
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Surfaced by WIHGO Attention Engine across connected channels. Every item explains WHY human attention is required.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setAttentionFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  attentionFilter === 'all'
                    ? 'bg-teal-500 text-slate-950'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                All ({counts.total})
              </button>

              <button
                onClick={() => setAttentionFilter('urgent')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  attentionFilter === 'urgent'
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-900 text-rose-400 border border-rose-500/30'
                }`}
              >
                <span>🔴 Urgent</span>
                <span>({counts.urgent})</span>
              </button>

              <button
                onClick={() => setAttentionFilter('decisions')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  attentionFilter === 'decisions'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900 text-amber-400 border border-amber-500/30'
                }`}
              >
                <span>🟡 Decisions</span>
                <span>({counts.decisions})</span>
              </button>

              <button
                onClick={() => setAttentionFilter('followups')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  attentionFilter === 'followups'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-900 text-blue-400 border border-blue-500/30'
                }`}
              >
                <span>🔵 Follow-ups</span>
                <span>({counts.followups})</span>
              </button>

              <button
                onClick={() => setAttentionFilter('opportunities')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  attentionFilter === 'opportunities'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-900 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                <span>🟢 Opportunities</span>
                <span>({counts.opportunities})</span>
              </button>
            </div>
          </div>

          {/* Attention Items List */}
          {filteredAttentionItems.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-teal-400 mx-auto" />
              <h3 className="text-base font-bold text-white">All Clear! Nothing Needs Your Attention</h3>
              <p className="text-xs text-slate-400">All customer inquiries, decisions, and follow-ups are up to date.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAttentionItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-3xl bg-slate-900/90 border transition-all duration-200 hover:shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-3 ${
                    item.category === 'urgent'
                      ? 'border-rose-500/40 hover:border-rose-400/80 shadow-[0_0_20px_rgba(244,63,94,0.08)]'
                      : item.category === 'decisions'
                      ? 'border-amber-500/40 hover:border-amber-400/80'
                      : item.category === 'opportunities'
                      ? 'border-emerald-500/40 hover:border-emerald-400/80'
                      : 'border-blue-500/40 hover:border-blue-400/80'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          item.category === 'urgent' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                          item.category === 'decisions' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          item.category === 'opportunities' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}>
                          {item.category}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          {renderPlatformIcon(item.sourcePlatform, 'w-3.5 h-3.5')}
                          <span className="capitalize">{item.sourcePlatform}</span>
                        </div>
                      </div>

                      <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{item.timeAgo || item.timestamp}</span>
                      </span>
                    </div>

                    {/* Title & Entity */}
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <div className="text-xs text-teal-300 font-semibold mt-0.5 flex items-center gap-1">
                        <span>{item.entityName}</span>
                      </div>
                    </div>

                    {/* Explicit Reason WHY */}
                    <div className="p-2.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      <span className="font-semibold text-slate-200">Why surfaced: </span>
                      {item.explanation}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <button
                      onClick={(e) => handleResolveAttention(item.id, e)}
                      className="text-[11px] font-semibold text-slate-400 hover:text-teal-300 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Handled</span>
                    </button>

                    <button
                      onClick={() => handleActionClick(item)}
                      className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1 shadow-md cursor-pointer"
                    >
                      <span>{item.actionLabel || 'Open'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. BUSINESS MEMORY (ENTITIES & NATURAL LANGUAGE SEARCH) */}
      {/* ========================================================================= */}
      {activeTab === 'memory' && (
        <div className="space-y-6">
          {/* Search Box */}
          <div className="bg-slate-900/90 border border-teal-500/30 rounded-3xl p-5 backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Brain className="w-4 h-4 text-teal-400" />
                  <span>Ask Business Memory (Natural Language Search)</span>
                </h3>
                <p className="text-xs text-slate-400">Search customer promises, past decisions, quotes, and multi-channel context.</p>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={memorySearchQuery}
                  onChange={(e) => setMemorySearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleMemorySearch()}
                  placeholder='e.g., "What did Sarah ask about last month?", "What did we promise John?", "Pricing"'
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>
              <button
                onClick={() => handleMemorySearch()}
                className="px-4 py-2.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </div>

            {/* Quick Query Suggestions */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] text-slate-500 font-medium">Try asking:</span>
              {[
                'What did we promise John?',
                'What did Sarah ask about?',
                'Who is waiting for pricing?',
                'Show all hot leads'
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setMemorySearchQuery(suggestion);
                    handleMemorySearch(suggestion);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] transition-all cursor-pointer"
                >
                  "{suggestion}"
                </button>
              ))}
            </div>

            {/* Synthesized Search Result */}
            {memorySearchResult && (
              <div className="mt-4 p-4 rounded-2xl bg-teal-950/40 border border-teal-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-teal-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                    Synthesized Memory Answer
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold">
                    {Math.round(memorySearchResult.confidence * 100)}% confidence
                  </span>
                </div>
                <p className="text-xs text-white leading-relaxed font-medium">
                  {memorySearchResult.synthesizedAnswer}
                </p>
                {memorySearchResult.entitiesFound.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Entities:</span>
                    {memorySearchResult.entitiesFound.map((ent, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-200 text-[10px] font-semibold">
                        {ent}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Entity Type Filter */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['all', 'customer', 'lead', 'commitment', 'decision', 'opportunity'] as const).map((ent) => (
                <button
                  key={ent}
                  onClick={() => setActiveEntityType(ent)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer capitalize ${
                    activeEntityType === ent
                      ? 'bg-teal-500 text-slate-950'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {ent === 'all' ? `All Entities (${memories.length})` : `${ent}s`}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-400">
              Showing {activeEntityType === 'all' ? memories.length : memories.filter(m => m.entityType === activeEntityType).length} structured records
            </span>
          </div>

          {/* Memories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {memories
              .filter(m => activeEntityType === 'all' || m.entityType === activeEntityType)
              .map((mem) => (
                <div
                  key={mem.id}
                  className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/40 transition-all backdrop-blur-xl flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-[10px] font-black uppercase">
                        {mem.entityType}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        {renderPlatformIcon(mem.platform, 'w-3 h-3')}
                        <span>{mem.date}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">{mem.title}</h4>
                      <div className="text-xs text-teal-400 font-semibold mt-0.5">
                        {mem.entityName} {mem.contactHandle ? `(${mem.contactHandle})` : ''}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {mem.detail}
                    </p>

                    {mem.amountOrValue && (
                      <div className="text-xs font-bold text-emerald-400">
                        Value: {mem.amountOrValue}
                      </div>
                    )}
                    {mem.dueDateOrTime && (
                      <div className="text-xs font-bold text-amber-400">
                        Due: {mem.dueDateOrTime}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        handleSelectContinuityContact(mem.entityName);
                        setActiveTab('continuity');
                      }}
                      className="text-[11px] text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Continuity</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>

                    {mem.platform && (
                      <button
                        onClick={() => onOpenWorkspace(mem.platform as PlatformId)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <span>Open Thread</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. AI CONTINUITY (NO LOST CONTEXT) */}
      {/* ========================================================================= */}
      {activeTab === 'continuity' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>AI Continuity Context</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-bold">
                Zero Lost Knowledge
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Prevent business knowledge from living in one person's head. Contextual summary of what happened, what was discussed, what was promised, and who is responsible.
            </p>
          </div>

          {/* Contact Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {['David Chen', 'Sarah Jenkins', 'Jessica Miller', 'John Doe (Acme Corp)'].map((name) => (
              <button
                key={name}
                onClick={() => handleSelectContinuityContact(name)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                  selectedContinuityCustomer.toLowerCase().includes(name.toLowerCase().split(' ')[0])
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{name}</span>
              </button>
            ))}
          </div>

          {/* Active Continuity Card */}
          {continuityData && (
            <div className="bg-slate-900/90 border border-indigo-500/40 rounded-3xl p-6 backdrop-blur-2xl shadow-xl space-y-6">
              {/* Top Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 font-black text-lg">
                    {continuityData.customerName[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>{continuityData.customerName}</span>
                      {continuityData.companyName && (
                        <span className="text-xs font-medium text-slate-400">
                          • {continuityData.companyName}
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="text-teal-400 font-semibold">{continuityData.handle}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 capitalize">
                        {renderPlatformIcon(continuityData.platform, 'w-3.5 h-3.5')}
                        {continuityData.platform}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenWorkspace(continuityData.platform)}
                    className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Open in Workspace</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 4 Core Pillars of Continuity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <div className="text-[10px] font-extrabold uppercase text-indigo-400 tracking-wider flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Previous Interaction & Discussion</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {continuityData.previousInteraction}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <div className="text-[10px] font-extrabold uppercase text-cyan-400 tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Previous Response Sent</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {continuityData.previousResponse}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <div className="text-[10px] font-extrabold uppercase text-amber-400 tracking-wider flex items-center gap-1">
                    <Target className="w-3.5 h-3.5" />
                    <span>Current Status</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                    {continuityData.currentStatus}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/40 space-y-1.5">
                  <div className="text-[10px] font-extrabold uppercase text-teal-400 tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Recommended Next Action</span>
                  </div>
                  <p className="text-xs text-teal-200 leading-relaxed font-bold">
                    {continuityData.recommendedNextAction}
                  </p>
                </div>
              </div>

              {/* Commitments & Responsible Owner */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    <span>Open Commitments & Owner Accountability</span>
                  </span>
                  <span className="text-xs text-purple-300 font-semibold">
                    Responsible: {continuityData.responsiblePerson}
                  </span>
                </div>

                {continuityData.commitments.length === 0 ? (
                  <p className="text-xs text-slate-400">No open promises currently tracked for this customer.</p>
                ) : (
                  <div className="space-y-2">
                    {continuityData.commitments.map((c) => (
                      <div key={c.id} className="p-3 rounded-xl bg-slate-900 border border-purple-500/30 flex items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <p className="text-xs font-semibold text-white">"{c.promiseText}"</p>
                          <span className="text-[10px] text-amber-400 font-medium">Due: {c.dueDate}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-bold capitalize">
                          {c.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. BUSINESS INSIGHTS ("WHAT SHOULD I KNOW ABOUT MY BUSINESS?") */}
      {/* ========================================================================= */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Business Insights</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold">
                  Pattern Intelligence
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Meaningful patterns detected across connected business activity: buying intent, SLA bottlenecks, and recurring inquiries.
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {['all', 'buying_intent', 'sla_risk', 'recurring_inquiry', 'bottleneck'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setInsightFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer capitalize ${
                    insightFilter === cat
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights
              .filter(i => insightFilter === 'all' || i.category === insightFilter)
              .map((insight) => (
                <div
                  key={insight.id}
                  className="p-5 rounded-3xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400/80 transition-all backdrop-blur-xl space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[10px] font-black uppercase tracking-wider">
                        {insight.category.replace('_', ' ')}
                      </span>
                      {insight.impactMetric && (
                        <span className="text-xs font-extrabold text-emerald-400">
                          {insight.impactMetric}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white">{insight.title}</h4>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {insight.explanation}
                    </p>

                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <span className="font-semibold text-slate-300">Source:</span>
                      <span>{insight.sourceContext}</span>
                    </div>

                    {insight.recommendedAction && (
                      <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 font-medium">
                        <span className="font-bold text-cyan-400">Recommended Action: </span>
                        {insight.recommendedAction}
                      </div>
                    )}
                  </div>

                  {insight.targetPlatform && (
                    <div className="pt-2 border-t border-slate-800 flex justify-end">
                      <button
                        onClick={() => onOpenWorkspace(insight.targetPlatform as PlatformId)}
                        className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1"
                      >
                        <span>Take Action</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. BUSINESS CONTEXT (RELATIONSHIP GRAPH) */}
      {/* ========================================================================= */}
      {activeTab === 'context' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Business Context Relations</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold">
                Full Traceability
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Customer → Conversations → Emails → Meetings → Tasks → Decisions → Commitments
            </p>
          </div>

          {/* Contact Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {contextRelations.map((rel) => (
              <button
                key={rel.id}
                onClick={() => setSelectedRelationId(rel.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedRelationId === rel.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {rel.customerName} ({rel.companyName})
              </button>
            ))}
          </div>

          {/* Context Map Visualization */}
          <div className="bg-slate-900/90 border border-purple-500/30 rounded-3xl p-6 backdrop-blur-xl space-y-6">
            {/* Customer Node */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40">
              <div>
                <div className="text-[10px] font-black uppercase text-purple-400 tracking-wider">Root Customer Entity</div>
                <h3 className="text-base font-extrabold text-white">{selectedRelation.customerName} • {selectedRelation.companyName}</h3>
                <p className="text-xs text-slate-300">{selectedRelation.handle}</p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold">
                  Status: {selectedRelation.currentStatus}
                </span>
              </div>
            </div>

            {/* Relationship Chain Nodes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Conversations */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
                  <span>Conversations ({selectedRelation.conversations.length})</span>
                </div>
                {selectedRelation.conversations.length === 0 ? (
                  <p className="text-xs text-slate-500">No linked conversations</p>
                ) : (
                  selectedRelation.conversations.map((c) => (
                    <div key={c.id} className="p-2 rounded-xl bg-slate-900 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="capitalize">{c.platform}</span>
                        <span>{c.date}</span>
                      </div>
                      <p className="text-slate-200">{c.summary}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Emails & Meetings */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-rose-400" />
                  <span>Emails & Meetings ({selectedRelation.emails.length + selectedRelation.meetings.length})</span>
                </div>
                {selectedRelation.emails.map((e) => (
                  <div key={e.id} className="p-2 rounded-xl bg-slate-900 text-xs space-y-0.5">
                    <span className="text-[10px] text-rose-300 font-bold block">{e.subject}</span>
                    <p className="text-slate-300 text-[11px]">{e.snippet}</p>
                  </div>
                ))}
                {selectedRelation.meetings.map((m) => (
                  <div key={m.id} className="p-2 rounded-xl bg-slate-900 text-xs flex items-center justify-between">
                    <span className="text-teal-300 font-semibold text-[11px]">{m.title}</span>
                    <span className="text-[10px] text-slate-400">{m.date}</span>
                  </div>
                ))}
              </div>

              {/* Decisions & Commitments */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Decisions & Promises</span>
                </div>
                {selectedRelation.decisions.map((d) => (
                  <div key={d.id} className="p-2 rounded-xl bg-slate-900 text-xs space-y-0.5">
                    <span className="text-[10px] text-amber-400 font-bold">Decision:</span>
                    <p className="text-slate-200 text-[11px]">{d.decisionText}</p>
                  </div>
                ))}
                {selectedRelation.commitments.map((com) => (
                  <div key={com.id} className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs space-y-0.5">
                    <span className="text-[10px] text-purple-300 font-bold">Promise:</span>
                    <p className="text-slate-100 text-[11px]">"{com.promiseText}"</p>
                    <span className="text-[10px] text-amber-400">Due: {com.dueDate}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Recommendation */}
            <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-teal-400">Prescribed Action</span>
                <p className="text-xs font-bold text-white mt-0.5">{selectedRelation.recommendedAction}</p>
              </div>
              <button
                onClick={() => onOpenWorkspace('whatsapp')}
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer whitespace-nowrap"
              >
                Execute Action
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. BUSINESS HUB AI ASSISTANT (CONVERSATIONAL GROUNDED QUERIES) */}
      {/* ========================================================================= */}
      {activeTab === 'assistant' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>Business Hub AI Assistant</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
                Grounded in Real Business Context
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Ask deep questions about your business, active promises, pipeline, or customer interactions without fabricating data.
            </p>
          </div>

          {/* Pre-made Query Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              'What needs my attention today?',
              'Which leads look most promising?',
              'What did we promise our customers this week?',
              'What happened with Sarah?',
              'Summarize my business activity this week'
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendAssistantQuery(q)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-slate-300 text-xs font-medium transition-all cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Container */}
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-5 backdrop-blur-xl space-y-4 min-h-[400px] flex flex-col justify-between">
            {/* Messages Scroll Area */}
            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-amber-500/20">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[85%] space-y-2 ${
                    msg.sender === 'user'
                      ? 'bg-amber-500 text-slate-950 font-medium rounded-2xl rounded-tr-none px-4 py-2.5 shadow-md'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-2xl rounded-tl-none p-4'
                  }`}>
                    <div className="text-xs leading-relaxed whitespace-pre-line">
                      {msg.text}
                    </div>

                    {msg.citations && msg.citations.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-800/80">
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Citations:</span>
                        {msg.citations.map((cite, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 text-[10px]">
                            {cite}
                          </span>
                        ))}
                      </div>
                    )}

                    {msg.actionSuggestion && (
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            if (msg.actionSuggestion?.tab) {
                              setActiveTab(msg.actionSuggestion.tab as BusinessHubTab);
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <span>{msg.actionSuggestion.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isAiAnswering && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 flex-shrink-0">
                    <Bot className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl rounded-tl-none text-xs text-amber-400 flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing connected business context...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="pt-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={assistantInput}
                onChange={(e) => setAssistantInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendAssistantQuery()}
                placeholder="Ask about your business, customers, promises, or pipeline..."
                className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={() => handleSendAssistantQuery()}
                disabled={!assistantInput.trim() || isAiAnswering}
                className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask AI</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
