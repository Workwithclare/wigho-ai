"use client";

import React, { useState, useEffect } from 'react';
import { 
  Conversation, 
  Message, 
  PlatformId, 
  AIReplyTone,
  ContinuityContext,
  ConversationAIInsight
} from '../../../lib/wihgo/types';
import {
  ArrowLeft,
  Send,
  Sparkles,
  Copy,
  Check,
  Bot,
  AlertTriangle,
  Search,
  Filter,
  MessageSquare,
  Camera,
  ThumbsUp,
  Music2,
  Briefcase,
  X as XIcon,
  Hash,
  Mail,
  Info,
  Clock,
  ShieldAlert,
  CheckSquare,
  Calendar as CalendarIcon,
  Brain,
  ChevronDown,
  CheckCircle2,
  FileText,
  UserCheck
} from 'lucide-react';

import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { GmailWorkspace } from './GmailWorkspace';
import { BusinessMemoryService } from '../../../lib/wihgo/memory/businessMemory';

interface PlatformWorkspaceProps {
  platformId: PlatformId;
  conversations: Conversation[];
  onBack: () => void;
  onSendMessage: (conversationId: string, text: string) => void;
  onAddTask?: (task: any) => void;
}

export const PlatformWorkspace: React.FC<PlatformWorkspaceProps> = ({
  platformId,
  conversations,
  onBack,
  onSendMessage,
  onAddTask
}) => {
  // Direct dedicated workspace for official Google Workspace Gmail
  if (platformId === 'email') {
    return <GmailWorkspace onBack={onBack} />;
  }
  const platformConvs = conversations.filter((c) => c.platform === platformId);
  const [selectedConvId, setSelectedConvId] = useState<string>(
    platformConvs[0]?.id || ''
  );
  const [inputText, setInputText] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAiReplyModal, setShowAiReplyModal] = useState<boolean>(false);
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [showContinuityModal, setShowContinuityModal] = useState<boolean>(false);
  const [showExtractTaskModal, setShowExtractTaskModal] = useState<boolean>(false);
  
  const [selectedTone, setSelectedTone] = useState<AIReplyTone>('professional');
  const [generatedAiReply, setGeneratedAiReply] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [summaryText, setSummaryText] = useState<string>('');

  // Task Extraction State
  const [extractedTask, setExtractedTask] = useState<{
    taskTitle: string;
    priority: string;
    dueDate: string;
    notes: string;
  } | null>(null);
  const [taskAddedSuccess, setTaskAddedSuccess] = useState<boolean>(false);

  const activeConv = platformConvs.find((c) => c.id === selectedConvId) || platformConvs[0];
  const continuity = activeConv ? BusinessMemoryService.getContinuityContext(activeConv.participantName, platformId) : null;

  const getPlatformMeta = (id: PlatformId) => {
    switch (id) {
      case 'whatsapp': return { name: 'WhatsApp Workspace', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10', icon: WhatsAppIcon };
      case 'instagram': return { name: 'Instagram Workspace', color: 'border-pink-500/30 text-pink-400 bg-pink-500/10', icon: Camera };
      case 'facebook': return { name: 'Facebook Workspace', color: 'border-blue-500/30 text-blue-400 bg-blue-500/10', icon: ThumbsUp };
      case 'tiktok': return { name: 'TikTok Workspace', color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10', icon: Music2 };
      case 'linkedin': return { name: 'LinkedIn Workspace', color: 'border-sky-500/30 text-sky-400 bg-sky-500/10', icon: Briefcase };
      case 'x': return { name: 'X (Twitter) Workspace', color: 'border-slate-500/30 text-slate-200 bg-slate-500/10', icon: XIcon };
      case 'slack': return { name: 'Slack Workspace', color: 'border-purple-500/30 text-purple-400 bg-purple-500/10', icon: Hash };
      case 'email': return { name: 'Email Workspace', color: 'border-rose-500/30 text-rose-400 bg-rose-500/10', icon: Mail };
      default: return { name: `${id.toUpperCase()} Workspace`, color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10', icon: MessageSquare };
    }
  };

  const meta = getPlatformMeta(platformId);
  const PlatformIcon = meta.icon;

  const handleGenerateAiReply = async (tone: AIReplyTone) => {
    setIsGenerating(true);
    setSelectedTone(tone);

    const lastIncomingMessage = activeConv?.messages.filter((m) => !m.isFromUser).pop()?.content || activeConv?.lastMessage || '';

    try {
      const res = await fetch('/api/ai/tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: 'tool-reply',
          input: lastIncomingMessage,
          tone,
          extraContext: { 
            platform: platformId, 
            sender: activeConv?.participantName,
            previousInteraction: continuity?.previousInteraction,
            commitments: continuity?.commitments
          }
        })
      });
      const data = await res.json();
      setGeneratedAiReply(data.result || 'Thank you for reaching out!');
    } catch (err) {
      setGeneratedAiReply(`Hi ${activeConv?.participantName || 'there'}! Thank you for your message. I'm reviewing the details and will get back to you shortly.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSummarizeChat = async () => {
    setShowSummaryModal(true);
    setIsGenerating(true);

    const fullThread = activeConv?.messages.map((m) => `${m.senderName}: ${m.content}`).join('\n') || '';

    try {
      const res = await fetch('/api/ai/tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: 'tool-summarize',
          input: fullThread,
          extraContext: { platform: platformId, customer: activeConv?.participantName }
        })
      });
      const data = await res.json();
      setSummaryText(data.result || 'Thread summary generated.');
    } catch (err) {
      setSummaryText(`Executive Summary for ${activeConv?.participantName}:\n- Key Request: Q3 pricing and catalog follow-up.\n- Urgency: High\n- Next Action: Send catalog attachment.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExtractTask = async () => {
    setShowExtractTaskModal(true);
    setIsGenerating(true);
    setTaskAddedSuccess(false);

    const lastMsg = activeConv?.messages.filter((m) => !m.isFromUser).pop()?.content || activeConv?.lastMessage || '';

    try {
      const res = await fetch('/api/ai/conversation/extract-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: lastMsg,
          sender: activeConv?.participantName
        })
      });
      const data = await res.json();
      setExtractedTask(data);
    } catch (err) {
      setExtractedTask({
        taskTitle: `Send Q3 catalog & follow up with ${activeConv?.participantName || 'client'}`,
        priority: 'high',
        dueDate: 'Today',
        notes: lastMsg
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveExtractedTask = () => {
    if (!extractedTask) return;
    if (onAddTask) {
      onAddTask({
        id: `t-${Date.now()}`,
        title: extractedTask.taskTitle,
        priority: extractedTask.priority,
        dueDate: extractedTask.dueDate,
        completed: false,
        platform: platformId,
        category: 'client_followup'
      });
    }
    setTaskAddedSuccess(true);
    setTimeout(() => {
      setShowExtractTaskModal(false);
      setTaskAddedSuccess(false);
    }, 1200);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyAiReplyToInput = () => {
    setInputText(generatedAiReply);
    setShowAiReplyModal(false);
  };

  const confirmAndSend = () => {
    if (!inputText.trim() || !activeConv) return;
    onSendMessage(activeConv.id, inputText.trim());
    setInputText('');
    setShowConfirmation(false);
  };

  return (
    <div className="space-y-4 pb-20 md:pb-8">
      {/* Workspace Header Bar */}
      <div className="flex items-center justify-between p-4 rounded-3xl bg-slate-900/90 border border-indigo-500/20 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            id="btn-workspace-back"
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div className={`p-2.5 rounded-2xl ${meta.color} border shadow-sm`}>
            <PlatformIcon className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white">{meta.name}</h1>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-cyan-400 bg-cyan-500/10 border border-cyan-400/20 px-2 py-0.5 rounded-full">
                SEPARATED WORKSPACE
              </span>
            </div>
            <p className="text-xs text-slate-400">Isolated workspace for all {platformId.toUpperCase()} communications</p>
          </div>
        </div>

        <button
          id="btn-summarize-chat"
          onClick={handleSummarizeChat}
          className="text-xs font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/30 px-3 py-2 rounded-xl hover:bg-purple-500/20 transition-all flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden sm:inline">Summarize Chat</span>
        </button>
      </div>

      {/* Main Workspace Layout (Conversation List + Chat Thread) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[600px] rounded-3xl overflow-hidden border border-indigo-500/15 bg-slate-900/80 backdrop-blur-xl">
        {/* Left Column: Conversations List */}
        <div className="lg:col-span-4 border-r border-slate-800 flex flex-col h-full bg-slate-950/40">
          <div className="p-3 border-b border-slate-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${platformId} chats...`}
                className="w-full bg-slate-900 text-xs text-slate-200 placeholder-slate-500 rounded-xl pl-8 pr-3 py-2 border border-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
            {platformConvs.length === 0 ? (
              <div className="p-6 text-center space-y-2">
                <Info className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">No active {platformId} messages.</p>
              </div>
            ) : (
              platformConvs.map((c) => (
                <button
                  key={c.id}
                  id={`conv-item-${c.id}`}
                  onClick={() => setSelectedConvId(c.id)}
                  className={`w-full text-left p-3.5 flex items-start gap-3 transition-all ${
                    c.id === activeConv?.id
                      ? 'bg-indigo-600/20 border-l-4 border-cyan-400'
                      : 'hover:bg-slate-900/60'
                  }`}
                >
                  <img
                    src={c.participantAvatar}
                    alt={c.participantName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white truncate">{c.participantName}</span>
                      <span className="text-[10px] text-slate-500">{c.lastMessageTime}</span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">{c.lastMessage}</p>
                  </div>
                  {c.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-cyan-500 text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                      {c.unreadCount}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Active Conversation Chat Thread */}
        <div className="lg:col-span-8 flex flex-col h-full bg-slate-900/40">
          {activeConv ? (
            <>
              {/* Chat Thread Header */}
              <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <img
                    src={activeConv.participantAvatar}
                    alt={activeConv.participantName}
                    className="w-9 h-9 rounded-full object-cover border border-cyan-400/30"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-white">{activeConv.participantName}</h3>
                    <div className="text-[10px] text-slate-400 font-mono">{activeConv.participantHandle}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Continuity Context Button */}
                  <button
                    onClick={() => setShowContinuityModal(true)}
                    className="px-2.5 py-1 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[11px] font-bold hover:bg-teal-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Brain className="w-3.5 h-3.5 text-teal-400" />
                    <span>Continuity Card</span>
                  </button>

                  {activeConv.isUrgent && (
                    <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Urgent Request
                    </span>
                  )}
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeConv.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.isFromUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed space-y-1 ${
                        m.isFromUser
                          ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-tr-none shadow-md'
                          : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-none'
                      }`}
                    >
                      <div className="font-semibold text-[10px] opacity-80">{m.senderName}</div>
                      <div>{m.content}</div>
                      <div className="text-[9px] text-right opacity-60 pt-1">{m.timestamp}</div>
                    </div>

                    {/* AI Suggested Reply Chip */}
                    {!m.isFromUser && m.aiSuggestedReply && (
                      <div className="mt-2 p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 max-w-md space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] text-purple-300 font-semibold">
                          <span className="flex items-center gap-1">
                            <Bot className="w-3 h-3 text-cyan-400" />
                            WIHGO AI Suggested Reply
                          </span>
                          <button
                            onClick={() => {
                              setGeneratedAiReply(m.aiSuggestedReply!);
                              setShowAiReplyModal(true);
                            }}
                            className="text-cyan-400 hover:underline text-[10px] cursor-pointer font-bold"
                          >
                            Use This Reply
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-300 italic">"{m.aiSuggestedReply}"</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* IN-CONVERSATION CONTEXTUAL AI TOOLBAR */}
              <div className="px-3 pt-2 bg-slate-900/90 border-t border-slate-800/80 flex items-center justify-between gap-1.5 overflow-x-auto pb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold text-teal-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-teal-400" />
                    AI Actions:
                  </span>

                  <button
                    onClick={handleSummarizeChat}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1 border border-slate-700 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <FileText className="w-3 h-3 text-indigo-400" />
                    <span>Summarize Thread</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowAiReplyModal(true);
                      handleGenerateAiReply('professional');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 text-[11px] font-bold flex items-center gap-1 border border-purple-500/30 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Bot className="w-3 h-3 text-purple-400" />
                    <span>Draft Reply</span>
                  </button>

                  <button
                    onClick={handleExtractTask}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1 border border-slate-700 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <CheckSquare className="w-3 h-3 text-teal-400" />
                    <span>Extract Task</span>
                  </button>
                </div>

                <button
                  onClick={() => setShowContinuityModal(true)}
                  className="px-2 py-1 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 text-[10px] font-semibold border border-teal-500/30 transition-all cursor-pointer whitespace-nowrap"
                >
                  Continuity Context
                </button>
              </div>

              {/* Message Composer Footer */}
              <div className="p-3 bg-slate-900/80 space-y-2">
                <div className="flex items-center gap-2">
                  {/* AI Reply Trigger */}
                  <button
                    id="btn-ai-reply-trigger"
                    onClick={() => {
                      setShowAiReplyModal(true);
                      handleGenerateAiReply('professional');
                    }}
                    className="py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600/30 to-indigo-600/30 border border-purple-500/40 text-purple-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>AI REPLY</span>
                  </button>

                  {/* Input field */}
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && inputText.trim()) {
                        setShowConfirmation(true);
                      }
                    }}
                    placeholder={`Write response on ${platformId}...`}
                    className="flex-1 bg-slate-950 text-xs text-white placeholder-slate-500 rounded-xl px-3.5 py-2.5 border border-slate-800 focus:border-cyan-400 focus:outline-none"
                  />

                  {/* Send Button */}
                  <button
                    id="btn-send-message-trigger"
                    disabled={!inputText.trim()}
                    onClick={() => setShowConfirmation(true)}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white disabled:opacity-40 shadow-md transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
              Select a conversation to begin.
            </div>
          )}
        </div>
      </div>

      {/* Continuity Context Modal */}
      {showContinuityModal && continuity && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-teal-500/40 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-[0_0_50px_rgba(20,184,166,0.3)] animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-teal-400" />
                <h3 className="text-sm font-bold text-white">
                  Continuity Context: {continuity.customerName}
                </h3>
              </div>
              <button
                onClick={() => setShowContinuityModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs max-h-[60vh] overflow-y-auto">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Previous Interaction:</span>
                <p className="text-slate-200 text-xs">{continuity.previousInteraction}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Previous Response Sent:</span>
                <p className="text-slate-200 text-xs">{continuity.previousResponse}</p>
              </div>

              <div className="p-3 bg-teal-500/10 rounded-xl border border-teal-500/30 space-y-1">
                <span className="text-[10px] font-bold text-teal-300 uppercase">Recommended Next Action:</span>
                <p className="text-white font-semibold text-xs">{continuity.recommendedNextAction}</p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <CheckSquare className="w-3.5 h-3.5 text-teal-400" />
                  Active Promises / Commitments:
                </span>
                {continuity.commitments.length === 0 ? (
                  <p className="text-[11px] text-slate-400">None currently pending.</p>
                ) : (
                  continuity.commitments.map(c => (
                    <div key={c.id} className="text-[11px] text-slate-300 bg-slate-900 p-2 rounded-lg border border-slate-800">
                      • {c.promiseText} <span className="text-amber-400 font-mono">({c.dueDate})</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowContinuityModal(false)}
                className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Extraction Modal */}
      {showExtractTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-indigo-500/40 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-[0_0_50px_rgba(99,102,241,0.3)] animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Extract Task from Conversation</h3>
              </div>
              <button
                onClick={() => setShowExtractTaskModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {isGenerating ? (
              <div className="py-8 text-center space-y-2">
                <Sparkles className="w-6 h-6 text-teal-400 animate-spin mx-auto" />
                <p className="text-xs text-slate-300">Extracting action item from message...</p>
              </div>
            ) : extractedTask ? (
              <div className="space-y-3 text-xs">
                {taskAddedSuccess && (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 font-bold text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Task saved to your Tasks list!</span>
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Task Title:</label>
                  <input
                    type="text"
                    value={extractedTask.taskTitle}
                    onChange={(e) => setExtractedTask({ ...extractedTask, taskTitle: e.target.value })}
                    className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-xl border border-slate-800 focus:border-teal-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Priority:</label>
                    <select
                      value={extractedTask.priority}
                      onChange={(e) => setExtractedTask({ ...extractedTask, priority: e.target.value })}
                      className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-xl border border-slate-800 focus:border-teal-400"
                    >
                      <option value="high">High Priority</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Due Date:</label>
                    <input
                      type="text"
                      value={extractedTask.dueDate}
                      onChange={(e) => setExtractedTask({ ...extractedTask, dueDate: e.target.value })}
                      className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-xl border border-slate-800 focus:border-teal-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Context Notes:</label>
                  <textarea
                    rows={2}
                    value={extractedTask.notes}
                    onChange={(e) => setExtractedTask({ ...extractedTask, notes: e.target.value })}
                    className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-xl border border-slate-800 focus:border-teal-400"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setShowExtractTaskModal(false)}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveExtractedTask}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-bold text-xs shadow-md hover:shadow-lg cursor-pointer"
                  >
                    Confirm & Save Task
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Explicit User Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-cyan-500/30 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-[0_0_40px_rgba(6,182,212,0.3)]">
            <div className="flex items-center gap-3 text-amber-400">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="text-sm font-bold text-white">Confirm Message Sending</h3>
            </div>

            <p className="text-xs text-slate-300">
              In accordance with WIHGO AI security rules, please confirm that you want to dispatch this message directly to <strong className="text-white">{activeConv?.participantName}</strong> on <strong className="text-cyan-400">{platformId.toUpperCase()}</strong>:
            </p>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-200 italic">
              "{inputText}"
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowConfirmation(false)}
                className="py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-and-send"
                onClick={confirmAndSend}
                className="py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-bold shadow-md hover:shadow-lg"
              >
                Confirm & Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Reply Modal */}
      {showAiReplyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-purple-500/30 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-[0_0_50px_rgba(168,85,247,0.3)]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">WIHGO AI Reply Generator</h3>
              </div>
              <button
                onClick={() => setShowAiReplyModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Tone Selector */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-2">Select Response Tone:</label>
              <div className="flex flex-wrap gap-2">
                {(['professional', 'friendly', 'short', 'persuasive', 'custom'] as AIReplyTone[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => handleGenerateAiReply(t)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-semibold capitalize transition-all ${
                      selectedTone === t
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Output Box */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 block">Generated Response:</label>
              <textarea
                rows={4}
                value={generatedAiReply}
                onChange={(e) => setGeneratedAiReply(e.target.value)}
                placeholder={isGenerating ? 'WIHGO AI is drafting response...' : 'Generated reply...'}
                className="w-full bg-slate-950 text-xs text-slate-200 p-3 rounded-xl border border-slate-800 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Actions: Edit -> Copy -> Apply */}
            <div className="flex items-center justify-between gap-2 pt-2">
              <button
                onClick={() => copyToClipboard(generatedAiReply)}
                className="py-2 px-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 hover:text-white"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>

              <button
                id="btn-apply-ai-reply"
                onClick={applyAiReplyToInput}
                className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-md"
              >
                Use in Composer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summarize Chat Modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-indigo-500/30 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-[0_0_50px_rgba(59,130,246,0.3)]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Conversation Summary</h3>
              </div>
              <button
                onClick={() => setShowSummaryModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
              {isGenerating ? 'WIHGO AI is summarizing this thread...' : summaryText}
            </div>

            <button
              onClick={() => setShowSummaryModal(false)}
              className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
