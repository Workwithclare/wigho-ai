"use client";

import React, { useState } from 'react';
import {
  Sparkles,
  Mic,
  Send,
  Briefcase,
  RefreshCw,
  TrendingUp,
  BarChart3,
  Building2,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  HardDrive,
  Share2,
  Layers,
  ArrowRight,
  Plus,
  Zap,
  CheckSquare,
  MessageSquare,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { AIAssistantMascot } from '../common/AIAssistantMascot';

interface BusinessAssistantViewProps {
  onOpenWorkspace?: (platformId: string) => void;
  onNavigateTab?: (tab: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

interface BusinessTask {
  id: string;
  title: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Normal';
  category: 'Client' | 'Strategy' | 'Social' | 'Ops';
  completed: boolean;
}

export const BusinessAssistantView: React.FC<BusinessAssistantViewProps> = ({
  onOpenWorkspace,
  onNavigateTab
}) => {
  const [activeSection, setActiveSection] = useState<'strategy' | 'productivity' | 'tasks' | 'socials' | 'connectivity'>('strategy');

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: "Hi, I'm your Business Assistant. How can I help you grow your business today? I can help you draft campaigns, analyze customer leads, generate strategies, and optimize your social media ROI.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Business Tasks State
  const [tasks, setTasks] = useState<BusinessTask[]>([
    { id: '1', title: 'Send Q3 Strategy Proposal to Enterprise Client', dueDate: 'Today, 4:00 PM', priority: 'High', category: 'Client', completed: false },
    { id: '2', title: 'Review WhatsApp automated onboarding campaign', dueDate: 'Tomorrow', priority: 'Medium', category: 'Social', completed: false },
    { id: '3', title: 'Approve scheduled Instagram & LinkedIn product launch posts', dueDate: 'Jun 24', priority: 'High', category: 'Social', completed: true },
    { id: '4', title: 'Sync weekly sales revenue table to Google Sheets', dueDate: 'Friday', priority: 'Normal', category: 'Ops', completed: false },
    { id: '5', title: 'Follow up on pending VIP inquiry in Gmail inbox', dueDate: 'Today', priority: 'High', category: 'Client', completed: false }
  ]);
  const [newTaskText, setNewTaskText] = useState('');

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    const newTask: BusinessTask = {
      id: `task-${Date.now()}`,
      title: newTaskText.trim(),
      dueDate: 'Today',
      priority: 'Normal',
      category: 'Ops',
      completed: false
    };
    setTasks(prev => [newTask, ...prev]);
    setNewTaskText('');
  };

  const suggestedBusinessActions = [
    { title: "Create marketing content", prompt: "Generate a multi-channel social marketing package for our upcoming Q3 promotional sale." },
    { title: "Analyze performance", prompt: "Evaluate my social media reach, engagement rate, and lead conversion metrics." },
    { title: "Generate a marketing strategy", prompt: "Outline a 30-day organic growth marketing strategy for Instagram, TikTok, and LinkedIn." },
    { title: "Create a social media calendar", prompt: "Build a structured content calendar with post titles, captions, and optimal posting times." },
    { title: "Analyze customers", prompt: "Identify customer sentiment and recurring inquiries across my WhatsApp & Instagram DMs." },
    { title: "Write an advert", prompt: "Write high-converting ad copy for Facebook & Instagram Ads targeting small business owners." },
    { title: "Generate product captions", prompt: "Draft 5 persuasive product feature captions highlighting key value propositions." },
    { title: "Create a campaign", prompt: "Design a launch campaign sequence across WhatsApp broadcast, Instagram posts, and Email." },
    { title: "Review business insights", prompt: "Summarize top performing channels, fastest response times, and revenue opportunities." }
  ];

  const handleSend = async (promptText?: string) => {
    const textToSend = promptText || inputText;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `[BUSINESS ASSISTANT] ${textToSend}`, task: 'chat' })
      });

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || "I've analyzed and compiled your business instruction.",
        time: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `Business strategy instruction logged: "${textToSend}". I will structure recommendations for your business channels.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMic = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTimeout(() => {
        setInputText("Summarize my day and high priority tasks");
        setIsListening(false);
      }, 2000);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8 max-w-4xl mx-auto">
      {/* Top Hero Section with Business Assistant Mascot */}
      <div className="bg-gradient-to-r from-slate-900/90 via-purple-950/80 to-slate-900/90 border border-purple-500/30 rounded-3xl p-6 backdrop-blur-xl shadow-[0_0_40px_rgba(168,85,247,0.2)] text-center space-y-4">
        <div className="py-2">
          <AIAssistantMascot size="lg" showFloatingBubbles animated />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-black text-white">Hi, I'm your Business Assistant. 💼</h1>
          <p className="text-sm text-purple-300 font-semibold">How can I help you grow your business today?</p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-purple-500/20">
          {[
            { id: 'strategy', label: 'AI Strategy & Chat', icon: Sparkles },
            { id: 'productivity', label: 'Productivity', icon: CalendarIcon },
            { id: 'tasks', label: 'Tasks & Follow-Ups', icon: CheckSquare },
            { id: 'socials', label: 'Socials & Channels', icon: Share2 },
            { id: 'connectivity', label: 'Connectivity & Hubs', icon: Layers }
          ].map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white hover:border-purple-500/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* RENDER SECTION 1: AI STRATEGY & ACTIONS */}
      {activeSection === 'strategy' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Suggested Business Action Cards Grid */}
          <div className="bg-slate-900/90 border border-purple-500/20 rounded-3xl p-5 backdrop-blur-xl space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-400" />
              <span>Recommended Strategic Actions</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {suggestedBusinessActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(action.prompt)}
                  className="p-3.5 rounded-2xl bg-slate-950/80 border border-purple-500/20 hover:border-purple-400/50 text-left transition-all hover:scale-[1.02] shadow-sm group flex flex-col justify-between space-y-2 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <Briefcase className="w-3.5 h-3.5 text-purple-400 group-hover:rotate-12 transition-transform" />
                    <span className="text-[9px] font-bold text-slate-500 group-hover:text-purple-300">Run Strategy</span>
                  </div>
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white leading-snug">
                    {action.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Chat Thread Container */}
          <div className="bg-slate-900/90 border border-purple-500/20 rounded-3xl p-4 sm:p-6 backdrop-blur-xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-400" />
                <h2 className="text-sm font-bold text-white">Business Intelligence Assistant</h2>
              </div>
              <span className="text-[10px] font-bold text-purple-300 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                Growth Engine
              </span>
            </div>

            <div className="space-y-3 min-h-[220px] max-h-[400px] overflow-y-auto pr-1">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none shadow-md'
                        : 'bg-slate-950 text-slate-200 border border-purple-500/20 rounded-tl-none'
                    }`}
                  >
                    {m.text}
                    <div className="text-[9px] text-right opacity-60 pt-1">{m.time}</div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-purple-400 p-3 bg-slate-950 rounded-2xl w-fit border border-purple-500/20">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
                  <span>Business Assistant is generating strategy model...</span>
                </div>
              )}
            </div>

            {/* Bottom Chat Bar with Voice & Send */}
            <div className="pt-2 border-t border-slate-800">
              <div className="relative flex items-center gap-2">
                <button
                  onClick={toggleMic}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    isListening
                      ? 'bg-rose-500/20 border-rose-400 text-rose-300 animate-pulse'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-purple-300'
                  }`}
                  title="Voice dictation"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend();
                  }}
                  placeholder="Ask me for marketing, strategy, or business insights..."
                  className="flex-1 bg-slate-950 text-xs text-white placeholder-slate-500 rounded-2xl px-4 py-3.5 border border-purple-500/30 focus:border-purple-400 focus:outline-none shadow-inner"
                />

                <button
                  id="btn-send-business-assistant"
                  onClick={() => handleSend()}
                  disabled={!inputText.trim()}
                  className="py-3.5 px-5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs disabled:opacity-40 shadow-md hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Send</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDER SECTION 2: PRODUCTIVITY */}
      {activeSection === 'productivity' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/90 border border-teal-500/30 p-5 rounded-3xl backdrop-blur-xl space-y-1">
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">Schedule Sync</span>
              <div className="text-xl font-black text-white">4 Meetings Today</div>
              <p className="text-[11px] text-slate-400">Next: VIP Strategy Call @ 3:00 PM</p>
            </div>
            <div className="bg-slate-900/90 border border-blue-500/30 p-5 rounded-3xl backdrop-blur-xl space-y-1">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Google Drive Context</span>
              <div className="text-xl font-black text-white">12 Files Indexed</div>
              <p className="text-[11px] text-slate-400">Proposals & Sales Decks Active</p>
            </div>
            <div className="bg-slate-900/90 border border-purple-500/30 p-5 rounded-3xl backdrop-blur-xl space-y-1">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Productivity Score</span>
              <div className="text-xl font-black text-purple-300">96.4%</div>
              <p className="text-[11px] text-slate-400">Fast response velocity</p>
            </div>
          </div>

          {/* Today's Schedule & Meetings */}
          <div className="bg-slate-900/90 border border-teal-500/20 p-5 sm:p-6 rounded-3xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-teal-400" />
                <span>Today's Google Calendar Schedule</span>
              </h2>
              <span className="text-[10px] font-mono text-teal-300 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/30">
                Google Workspace Synced
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                { time: '10:00 AM - 10:30 AM', title: 'Daily Business Standup & Lead Triage', platform: 'Google Meet', link: 'meet.google.com/abc-xyz' },
                { time: '1:30 PM - 2:15 PM', title: 'Client Onboarding Walkthrough: Acme Corp', platform: 'Google Meet', link: 'meet.google.com/vip-call' },
                { time: '3:00 PM - 3:45 PM', title: 'Q3 Growth Marketing & Campaign Review', platform: 'Google Meet', link: 'meet.google.com/growth-q3' },
                { time: '5:00 PM - 5:30 PM', title: 'Weekly Financial Sync & Invoice Review', platform: 'Google Calendar', link: 'Synced' }
              ].map((ev, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{ev.title}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">{ev.time} • {ev.platform}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSend(`Prepare agenda brief for "${ev.title}"`)}
                    className="px-3 py-1 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 text-[11px] font-bold border border-teal-500/30 transition-all cursor-pointer"
                  >
                    AI Brief
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RENDER SECTION 3: TASKS */}
      {activeSection === 'tasks' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="bg-slate-900/90 border border-indigo-500/20 p-5 sm:p-6 rounded-3xl backdrop-blur-xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-indigo-400" />
                <span>Action Items & Client Follow-Ups</span>
              </h2>
              <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                {tasks.filter(t => !t.completed).length} Pending
              </span>
            </div>

            {/* Add Task Input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddTask();
                }}
                placeholder="Add a new business task or follow-up..."
                className="flex-1 bg-slate-950 text-xs text-white placeholder-slate-500 rounded-xl px-3.5 py-2.5 border border-slate-800 focus:border-indigo-400 focus:outline-none"
              />
              <button
                onClick={handleAddTask}
                disabled={!newTaskText.trim()}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Tasks List */}
            <div className="space-y-2 pt-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    task.completed
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                      : 'bg-slate-950/90 border-slate-800 hover:border-indigo-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                      task.completed
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : 'border-slate-700 bg-slate-900'
                    }`}>
                      {task.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <span className={`text-xs font-semibold ${task.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                        {task.title}
                      </span>
                      <div className="flex items-center gap-2 pt-0.5 text-[10px] text-slate-400">
                        <span>Due: {task.dueDate}</span>
                        <span>•</span>
                        <span className="text-indigo-400 font-medium">{task.category}</span>
                      </div>
                    </div>
                  </div>

                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                    task.priority === 'High'
                      ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                      : task.priority === 'Medium'
                      ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                      : 'text-slate-400 bg-slate-800 border-slate-700'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RENDER SECTION 4: SOCIALS */}
      {activeSection === 'socials' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="bg-slate-900/90 border border-pink-500/20 p-5 sm:p-6 rounded-3xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-pink-400" />
                <span>Social Media Channels & Queue</span>
              </h2>
              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab('social')}
                  className="text-xs font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Social Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: 'WhatsApp Business', leads: '78 Active', badge: 'Connected', color: 'text-emerald-400' },
                { name: 'Instagram', leads: '1.2k Reach', badge: 'Connected', color: 'text-pink-400' },
                { name: 'Facebook Page', leads: '840 Reach', badge: 'Active', color: 'text-blue-400' },
                { name: 'LinkedIn Company', leads: '320 B2B', badge: 'Connected', color: 'text-sky-400' }
              ].map((s, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400">{s.name}</span>
                  <div className={`text-sm font-black ${s.color}`}>{s.leads}</div>
                  <div className="text-[9px] text-emerald-400 font-bold">✓ {s.badge}</div>
                </div>
              ))}
            </div>

            {/* Quick Actions for Social */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-white">AI Social Content Quick Launch</span>
              <div className="flex flex-wrap gap-2">
                {[
                  "Draft 3 Instagram captions for product launch",
                  "Create WhatsApp customer promotion broadcast",
                  "Write LinkedIn B2B thought leadership post",
                  "Generate TikTok hook & video concept"
                ].map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => {
                      setActiveSection('strategy');
                      handleSend(prompt);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-pink-400/40 text-xs text-slate-300 hover:text-pink-300 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Zap className="w-3 h-3 text-pink-400" />
                    <span>{prompt}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDER SECTION 5: CONNECTIVITY & HUBS */}
      {activeSection === 'connectivity' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="bg-slate-900/90 border border-teal-500/20 p-5 sm:p-6 rounded-3xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-400" />
                <span>Connected Business Infrastructure</span>
              </h2>
              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab('connect')}
                  className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>Manage All Connectors</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: 'Google Workspace', status: '8 Services (Gmail, Cal, Meet, Drive, Docs...)', health: 'Optimal' },
                { name: 'Meta Business Suite', status: 'WhatsApp + Instagram + Facebook', health: 'Active' },
                { name: 'Stripe & Payments', status: 'Direct webhook processing', health: 'Connected' },
                { name: 'Neon Postgres Database', status: 'PostgreSQL live sync', health: 'Operational' }
              ].map((h, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{h.name}</h4>
                    <p className="text-[10px] text-slate-400">{h.status}</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    {h.health}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

