"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Mail,
  RefreshCw,
  Search,
  Star,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Key,
  Unlink,
  Sparkles,
  Bot,
  Copy,
  Check,
  Clock,
  ShieldCheck,
  Inbox,
  Filter,
  Send
} from 'lucide-react';
import { 
  GmailMessageItem, 
  GmailProfile, 
  fetchGmailInbox, 
  requestGoogleWorkspaceAuth, 
  disconnectGmail, 
  getGoogleAccessToken, 
  GMAIL_ONLY_SCOPES 
} from '../../../lib/wihgo/demoBackend';
import { AIReplyTone } from '../../../lib/wihgo/types';

interface GmailWorkspaceProps {
  onBack: () => void;
}

export const GmailWorkspace: React.FC<GmailWorkspaceProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<GmailMessageItem[]>([]);
  const [profile, setProfile] = useState<GmailProfile | null>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'starred' | 'important'>('all');

  // AI draft / summarize modal
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [aiTone, setAiTone] = useState<AIReplyTone>('professional');
  const [aiOutput, setAiOutput] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [copiedAi, setCopiedAi] = useState<boolean>(false);

  const token = getGoogleAccessToken();
  const isConnected = !!token;

  const loadInbox = async (accessToken: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await fetchGmailInbox(accessToken, { maxResults: 25 });
      setMessages(result.messages);
      setProfile(result.profile);
      if (result.messages.length > 0 && !selectedMessageId) {
        setSelectedMessageId(result.messages[0].id);
      }
    } catch (err: any) {
      console.error('[GmailWorkspace] Load error:', err);
      setErrorMessage(err?.message || 'Failed to load Gmail inbox.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadInbox(token);
    }
  }, [token]);

  const handleConnectGmail = async () => {
    setIsConnecting(true);
    setErrorMessage(null);
    try {
      const { accessToken, profile: userProfile } = await requestGoogleWorkspaceAuth(GMAIL_ONLY_SCOPES);
      setProfile(userProfile);
      await loadInbox(accessToken);
    } catch (err: any) {
      const msg = err?.message || '';
      if (!msg.includes('closed') && !msg.includes('cancelled')) {
        console.warn('[GmailWorkspace] Connect notice:', err);
        setErrorMessage(msg || 'Google OAuth authorization could not be completed.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    await disconnectGmail();
    setMessages([]);
    setProfile(null);
    setSelectedMessageId(null);
    setErrorMessage(null);
  };

  const handleRefresh = () => {
    const currentToken = getGoogleAccessToken();
    if (currentToken) {
      loadInbox(currentToken);
    } else {
      handleConnectGmail();
    }
  };

  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      if (filterType === 'unread' && !m.isUnread) return false;
      if (filterType === 'starred' && !m.isStarred) return false;
      if (filterType === 'important' && !m.isImportant) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchFrom = (m.fromName || '').toLowerCase().includes(q) || (m.fromEmail || '').toLowerCase().includes(q);
        const matchSubject = m.subject.toLowerCase().includes(q);
        const matchSnippet = m.snippet.toLowerCase().includes(q);
        if (!matchFrom && !matchSubject && !matchSnippet) return false;
      }
      return true;
    });
  }, [messages, filterType, searchQuery]);

  const selectedMessage = useMemo(() => {
    return messages.find((m) => m.id === selectedMessageId) || filteredMessages[0] || null;
  }, [messages, selectedMessageId, filteredMessages]);

  const handleGenerateAiDraft = async (tone: AIReplyTone) => {
    if (!selectedMessage) return;
    setIsGeneratingAi(true);
    setAiTone(tone);
    try {
      const res = await fetch('/api/ai/tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: 'tool-reply',
          input: `Email Subject: ${selectedMessage.subject}\nFrom: ${selectedMessage.fromName} <${selectedMessage.fromEmail}>\nBody: ${selectedMessage.bodyText}`,
          tone,
          extraContext: { platform: 'email', sender: selectedMessage.fromName }
        })
      });
      const data = await res.json();
      setAiOutput(data.result || `Hi ${selectedMessage.fromName},\n\nThank you for your email regarding "${selectedMessage.subject}". I will review this and respond shortly.`);
    } catch (e) {
      setAiOutput(`Hi ${selectedMessage.fromName},\n\nThank you for reaching out regarding "${selectedMessage.subject}". I am currently reviewing your email and will follow up with you promptly.`);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="space-y-4 pb-20 md:pb-8">
      {/* Workspace Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl bg-slate-900/90 border border-indigo-500/20 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            id="btn-gmail-workspace-back"
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div className="p-2.5 rounded-2xl border border-rose-500/30 text-rose-400 bg-rose-500/10 shadow-sm">
            <Mail className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white">Gmail Workspace</h1>
              {isConnected ? (
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  VERIFIED OAUTH
                </span>
              ) : (
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  NOT CONNECTED
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {profile?.emailAddress ? (
                <span className="font-mono text-cyan-300">{profile.emailAddress} • {(profile.messagesTotal || 0).toLocaleString()} Total Messages</span>
              ) : (
                'Official Google Workspace Gmail API integration'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <button
                id="btn-refresh-gmail"
                onClick={handleRefresh}
                disabled={isLoading}
                className="text-xs font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 px-3 py-2 rounded-xl hover:bg-cyan-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Inbox</span>
              </button>

              <button
                id="btn-disconnect-gmail"
                onClick={handleDisconnect}
                className="text-xs font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/30 px-3 py-2 rounded-xl hover:bg-rose-500/20 transition-all flex items-center gap-1.5"
              >
                <Unlink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Disconnect</span>
              </button>
            </>
          ) : (
            <button
              id="btn-connect-gmail-oauth"
              onClick={handleConnectGmail}
              disabled={isConnecting}
              className="text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2 rounded-xl hover:shadow-lg transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
            >
              <Key className="w-3.5 h-3.5" />
              <span>{isConnecting ? 'Connecting...' : 'Connect Gmail via Google OAuth'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Error / Status Alert if any */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={handleConnectGmail}
            className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 font-semibold text-white text-[11px] whitespace-nowrap"
          >
            Authorize Now
          </button>
        </div>
      )}

      {!isConnected ? (
        /* Not Connected State */
        <div className="rounded-3xl border border-indigo-500/20 bg-slate-900/80 backdrop-blur-xl p-10 text-center space-y-5 max-w-2xl mx-auto my-8">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <Mail className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-lg font-extrabold text-white">Connect Your Official Gmail Inbox</h2>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              WHIGO AI connects directly to your Google Workspace account via official Google OAuth 2.0. Real inbox messages, thread details, and AI-powered reply drafting are securely authorized.
            </p>
          </div>

          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 text-left text-xs space-y-2 max-w-md mx-auto">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Direct Google Identity Services OAuth</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Only requested permission: <code className="text-cyan-300 font-mono">https://www.googleapis.com/auth/gmail.readonly</code>. Tokens remain in-memory and are never stored in localStorage.
            </p>
          </div>

          <button
            id="btn-connect-gmail-hero"
            onClick={handleConnectGmail}
            disabled={isConnecting}
            className="py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg hover:shadow-cyan-500/25 transition-all inline-flex items-center gap-2 disabled:opacity-50"
          >
            <Key className="w-4 h-4" />
            <span>{isConnecting ? 'Authorizing in Google Popup...' : 'Sign in & Authorize Gmail'}</span>
          </button>
        </div>
      ) : (
        /* Connected Layout (Inbox Split Screen) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[650px] rounded-3xl overflow-hidden border border-indigo-500/15 bg-slate-900/80 backdrop-blur-xl">
          {/* Left Column: Messages List */}
          <div className="lg:col-span-5 border-r border-slate-800 flex flex-col h-full bg-slate-950/40">
            {/* Search & Filter Bar */}
            <div className="p-3 border-b border-slate-800 space-y-2.5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Gmail messages & senders..."
                  className="w-full bg-slate-900 text-xs text-slate-200 placeholder-slate-500 rounded-xl pl-8 pr-3 py-2 border border-slate-800 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto">
                <button
                  onClick={() => setFilterType('all')}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all ${
                    filterType === 'all'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                  }`}
                >
                  All ({messages.length})
                </button>
                <button
                  onClick={() => setFilterType('unread')}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all ${
                    filterType === 'unread'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                  }`}
                >
                  Unread ({messages.filter(m => m.isUnread).length})
                </button>
                <button
                  onClick={() => setFilterType('starred')}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all ${
                    filterType === 'starred'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                  }`}
                >
                  Starred ({messages.filter(m => m.isStarred).length})
                </button>
              </div>
            </div>

            {/* Messages Scroll List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
              {isLoading && messages.length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <RefreshCw className="w-6 h-6 text-rose-400 animate-spin mx-auto" />
                  <p className="text-xs text-slate-400">Loading official Gmail inbox...</p>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <Inbox className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">No emails match your filter.</p>
                </div>
              ) : (
                filteredMessages.map((m) => (
                  <button
                    key={m.id}
                    id={`gmail-msg-${m.id}`}
                    onClick={() => setSelectedMessageId(m.id)}
                    className={`w-full text-left p-3.5 flex items-start gap-3 transition-all ${
                      m.id === selectedMessage?.id
                        ? 'bg-rose-950/20 border-l-4 border-rose-400'
                        : 'hover:bg-slate-900/60'
                    } ${m.isUnread ? 'font-semibold' : 'opacity-90'}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {(m.fromName || '').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs truncate ${m.isUnread ? 'text-white font-bold' : 'text-slate-300'}`}>
                          {(m.fromName || '')}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap ml-2">
                          {m.dateStr}
                        </span>
                      </div>
                      <p className={`text-xs truncate mb-1 ${m.isUnread ? 'text-cyan-300 font-medium' : 'text-slate-300'}`}>
                        {m.subject}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {m.snippet}
                      </p>
                    </div>
                    {m.isUnread && (
                      <span className="w-2 h-2 rounded-full bg-rose-400 flex-shrink-0 mt-1" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Selected Message Content */}
          <div className="lg:col-span-7 flex flex-col h-full bg-slate-900/40">
            {selectedMessage ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-900/60">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-sm font-bold text-white leading-snug">
                      {selectedMessage.subject}
                    </h2>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        id="btn-open-in-gmail"
                        onClick={() => window.open(`https://mail.google.com/mail/u/0/#inbox/${selectedMessage.id}`, '_blank')}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Open in Gmail"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div>
                      <span className="text-white font-medium">{selectedMessage.fromName}</span>{' '}
                      <span className="font-mono text-[11px] text-slate-400">&lt;{selectedMessage.fromEmail}&gt;</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">{selectedMessage.dateStr}</span>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {(selectedMessage.labelIds || []).map((label) => (
                      <span
                        key={label}
                        className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80">
                    {selectedMessage.bodyText || selectedMessage.snippet}
                  </div>
                </div>

                {/* AI Reply & Drafting Tools */}
                <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3">
                  <button
                    id="btn-ai-draft-reply"
                    onClick={() => {
                      setShowAiModal(true);
                      handleGenerateAiDraft('professional');
                    }}
                    className="text-xs font-bold text-purple-300 bg-purple-500/10 border border-purple-500/30 px-3.5 py-2 rounded-xl hover:bg-purple-500/20 transition-all flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>WIHGO AI Smart Reply</span>
                  </button>

                  <a
                    href={`https://mail.google.com/mail/u/0/#inbox/${selectedMessage.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
                  >
                    <span>Reply in Gmail</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-500 text-xs">
                Select an email from the inbox to read its details.
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Smart Reply Modal */}
      {showAiModal && selectedMessage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>AI Draft Reply to {selectedMessage.fromName}</span>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>

            {/* Tone Selector */}
            <div className="flex items-center gap-2">
              {(['professional', 'friendly', 'concise'] as AIReplyTone[]).map((tone) => (
                <button
                  key={tone}
                  onClick={() => handleGenerateAiDraft(tone)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl capitalize transition-all ${
                    aiTone === tone
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>

            {/* AI Output Box */}
            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 min-h-[140px] text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
              {isGeneratingAi ? (
                <div className="flex items-center gap-2 text-slate-400">
                  <RefreshCw className="w-4 h-4 animate-spin text-purple-400" />
                  <span>Drafting intelligent response...</span>
                </div>
              ) : (
                aiOutput || 'Click a tone above to generate a draft.'
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(aiOutput);
                  setCopiedAi(true);
                  setTimeout(() => setCopiedAi(false), 2000);
                }}
                className="text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all"
              >
                {copiedAi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAi ? 'Copied' : 'Copy Draft'}</span>
              </button>

              <button
                onClick={() => {
                  window.open(`https://mail.google.com/mail/u/0/#inbox/${selectedMessage.id}`, '_blank');
                  setShowAiModal(false);
                }}
                className="text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-purple-600 px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md"
              >
                <span>Open Gmail to Send</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
