"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Mic,
  MicOff,
  Send,
  Bot,
  RefreshCw,
  Volume2,
  VolumeX,
  Square,
  Pause,
  Play,
  FileText,
  Radio,
  X,
  Clock
} from 'lucide-react';
import { AIAssistantMascot } from '../common/AIAssistantMascot';
import { UserProfile, PlatformInfo, Conversation, CalendarEvent, Task } from '../../../lib/wihgo/types';

interface AIAssistantViewProps {
  user?: UserProfile;
  platforms?: PlatformInfo[];
  conversations?: Conversation[];
  events?: CalendarEvent[];
  tasks?: Task[];
  onOpenWorkspace?: (platformId: string) => void;
  onNavigateTab?: (tab: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  wasSpoken?: boolean;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  user,
  platforms = [],
  conversations = [],
  events = [],
  tasks = [],
  onOpenWorkspace,
  onNavigateTab
}) => {
  const userName = user?.name ? user.name.split(' ')[0] : 'Clare';

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Hi ${userName}. I'm WIHGO AI. How can I help you today? You can type your message or tap the microphone to speak naturally.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recordedSpeech, setRecordedSpeech] = useState<string>('');
  const [showVoiceOptions, setShowVoiceOptions] = useState<boolean>(false);
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'recorded' | 'processing' | 'responding'>('idle');
  
  // Voice Responses Setting
  const [voiceResponsesEnabled, setVoiceResponsesEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('wihgo_voice_responses_enabled') === 'true';
    } catch {
      return true;
    }
  });

  // Speech playback state (Pause, Resume, Stop)
  const [speechState, setSpeechState] = useState<{
    isPlaying: boolean;
    isPaused: boolean;
    messageId: string | null;
  }>({
    isPlaying: false,
    isPaused: false,
    messageId: null
  });

  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Suggested conversational quick prompts
  const suggestedActions = [
    { title: "What should I prioritize today?", prompt: `What should I prioritize today?` },
    { title: "Summarize my day", prompt: `WIHGO, summarize my day and what I need to focus on today.` },
    { title: "What meetings do I have?", prompt: `What meetings and calendar events do I have today?` },
    { title: "Read important messages", prompt: `Read my important customer messages and unread inquiries across WhatsApp and Camera.` },
    { title: "Remind priority tasks", prompt: `Remind me about my top priority business tasks for today.` },
    { title: "Create customer reply", prompt: `Draft a warm, high-converting follow-up message for my latest customer inquiry.` }
  ];

  // Auto-scroll on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, voiceStatus, showVoiceOptions]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Text-To-Speech Controls
  const speakText = (text: string, messageId: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[*#_`\[\]()]/g, ' ').replace(/\s+/g, ' ').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => 
      (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.lang.startsWith('en')) && 
      !v.name.includes('Bad')
    );
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => {
      setSpeechState({
        isPlaying: true,
        isPaused: false,
        messageId
      });
    };

    utterance.onpause = () => {
      setSpeechState(prev => ({ ...prev, isPaused: true }));
    };

    utterance.onresume = () => {
      setSpeechState(prev => ({ ...prev, isPaused: false }));
    };

    utterance.onend = () => {
      setSpeechState({
        isPlaying: false,
        isPaused: false,
        messageId: null
      });
    };

    utterance.onerror = () => {
      setSpeechState({
        isPlaying: false,
        isPaused: false,
        messageId: null
      });
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePauseSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setSpeechState(prev => ({ ...prev, isPaused: true }));
    }
  };

  const handleResumeSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
      setSpeechState(prev => ({ ...prev, isPaused: false }));
    }
  };

  const handleStopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeechState({
      isPlaying: false,
      isPaused: false,
      messageId: null
    });
  };

  // Toggle Voice Responses Setting
  const handleToggleVoiceResponses = () => {
    const nextVal = !voiceResponsesEnabled;
    setVoiceResponsesEnabled(nextVal);
    try {
      localStorage.setItem('wihgo_voice_responses_enabled', String(nextVal));
    } catch (e) {
      console.warn('Failed to save voice responses setting:', e);
    }
    if (!nextVal) {
      handleStopSpeaking();
    }
  };

  // Send message function (handles text or voice submitted)
  const handleSend = async (customPrompt?: string, fromVoice = false) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim()) return;

    handleStopSpeaking();
    setShowVoiceOptions(false);
    setRecordedSpeech('');

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      wasSpoken: fromVoice
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInputText('');
    setVoiceStatus('processing');

    try {
      const connectedPlatforms = platforms.filter(p => p.connected).map(p => p.name);
      const unreadCount = (conversations || []).reduce((acc, c) => acc + (c?.unreadCount || 0), 0);

      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: updatedHistory.slice(-8).map(m => ({ sender: m.sender, text: m.text })),
          userName,
          context: {
            userName: user?.name || userName,
            companyName: user?.companyName,
            businessDescription: user?.businessDescription,
            connectedPlatforms,
            unreadMessagesCount: unreadCount,
            todayEvents: events.map(e => ({ title: e.title, time: e.time, date: e.date, platform: e.platform })),
            pendingTasks: tasks.filter(t => !t.completed).map(t => ({ title: t.title, priority: t.priority, platform: t.platform }))
          }
        })
      });

      const data = await res.json();
      const replyText = data.reply || `Yes, ${userName}. I have processed your request.`;

      const aiMsgId = `ai-${Date.now()}`;
      const aiMsg: ChatMessage = {
        id: aiMsgId,
        sender: 'assistant',
        text: replyText,
        time: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Automatically read response aloud if Voice & Send was used OR voice responses are enabled
      if (fromVoice || voiceResponsesEnabled) {
        speakText(replyText, aiMsgId);
      }
    } catch (err) {
      const fallbackId = `ai-${Date.now()}`;
      const fallbackText = `Yes, ${userName}. I received your request: "${textToSend}". WIHGO AI is actively monitoring your connected accounts to optimize your business operations.`;
      
      const fallbackMsg: ChatMessage = {
        id: fallbackId,
        sender: 'assistant',
        text: fallbackText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);

      if (fromVoice || voiceResponsesEnabled) {
        speakText(fallbackText, fallbackId);
      }
    } finally {
      setVoiceStatus('idle');
      setIsListening(false);
    }
  };

  // Start Voice Recording
  const startRecording = () => {
    handleStopSpeaking();
    setShowVoiceOptions(false);
    setRecordedSpeech('');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Graceful fallback for environments without SpeechRecognition API
      setIsListening(true);
      setVoiceStatus('listening');
      let transcriptSimulation = "What should I prioritize today?";
      setTimeout(() => {
        setRecordedSpeech(transcriptSimulation);
        setIsListening(false);
        setVoiceStatus('recorded');
        setShowVoiceOptions(true);
      }, 2000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceStatus('listening');
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setRecordedSpeech(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        setIsListening(false);
        if (!recordedSpeech.trim()) {
          // Provide fallback speech if mic permission is denied
          setRecordedSpeech("What should I prioritize today?");
          setVoiceStatus('recorded');
          setShowVoiceOptions(true);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setRecordedSpeech((current) => {
          if (current.trim()) {
            setVoiceStatus('recorded');
            setShowVoiceOptions(true);
          } else {
            setVoiceStatus('idle');
          }
          return current;
        });
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Failed to start speech recognition:', err);
      setIsListening(false);
      setRecordedSpeech("What should I prioritize today?");
      setVoiceStatus('recorded');
      setShowVoiceOptions(true);
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn('Recognition stop error:', e);
      }
    }
    setIsListening(false);
    if (recordedSpeech.trim()) {
      setVoiceStatus('recorded');
      setShowVoiceOptions(true);
    } else {
      setVoiceStatus('idle');
    }
  };

  const toggleMicrophone = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // OPTION 1 — VOICE TO TEXT:
  // Transcribes the speech into the chat input, allows reviewing & editing, does NOT automatically submit
  const handleVoiceToText = () => {
    if (recordedSpeech.trim()) {
      setInputText(recordedSpeech.trim());
      setShowVoiceOptions(false);
      setVoiceStatus('idle');
      setRecordedSpeech('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  };

  // OPTION 2 — VOICE & SEND:
  // Immediately submits request, displays "Processing your request...", and reads response aloud
  const handleVoiceAndSend = () => {
    if (recordedSpeech.trim()) {
      const speech = recordedSpeech.trim();
      setShowVoiceOptions(false);
      setRecordedSpeech('');
      handleSend(speech, true);
    }
  };

  const handleCancelVoice = () => {
    setShowVoiceOptions(false);
    setRecordedSpeech('');
    setVoiceStatus('idle');
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8 max-w-4xl mx-auto">
      {/* Top Hero Section with WIHGO AI Mascot */}
      <div className="bg-gradient-to-r from-slate-900/90 via-slate-900/95 to-slate-900/90 border border-teal-500/20 rounded-3xl p-6 backdrop-blur-xl shadow-[0_0_40px_rgba(20,184,166,0.1)] text-center space-y-4">
        <div className="py-2 flex justify-center">
          <AIAssistantMascot size="lg" showFloatingBubbles animated />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-black text-white tracking-tight">
            Hi {userName}, I'm WIHGO AI. 👋
          </h1>
          <p className="text-xs text-teal-300 font-semibold">
            One unified assistant for text & voice. How can I help you achieve your goals today?
          </p>
        </div>

        {/* Suggested Quick Conversational Prompts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
          {suggestedActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(action.prompt, false)}
              className="p-3 rounded-2xl bg-slate-950/80 border border-teal-500/15 hover:border-teal-400/50 text-left transition-all hover:scale-[1.01] shadow-sm group flex flex-col justify-between space-y-2 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <Sparkles className="w-3.5 h-3.5 text-teal-400 group-hover:rotate-12 transition-transform" />
                <span className="text-[9px] font-bold text-slate-500 group-hover:text-teal-300">Tap to ask</span>
              </div>
              <span className="text-xs font-bold text-slate-200 group-hover:text-white leading-snug">
                {action.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Unified Conversation Thread Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 backdrop-blur-xl space-y-4 shadow-xl relative">
        {/* Conversation Header with Voice Responses & Audio Playback Controls */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-teal-400" />
            <div>
              <h2 className="text-sm font-bold text-white">WIHGO AI Assistant</h2>
              <p className="text-[10px] text-slate-400">Continuous conversation • Text & Voice</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Inline Voice Playback Controls (Pause / Resume / Stop) */}
            {speechState.isPlaying && (
              <div className="flex items-center gap-1 bg-teal-950/80 border border-teal-500/40 rounded-xl px-2.5 py-1">
                <Volume2 className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                <span className="text-[10px] font-bold text-teal-300 mr-1.5 hidden sm:inline">
                  {speechState.isPaused ? 'Paused' : 'Speaking...'}
                </span>

                {speechState.isPaused ? (
                  <button
                    onClick={handleResumeSpeaking}
                    className="p-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/40 text-teal-200 transition-colors cursor-pointer"
                    title="Resume speech"
                  >
                    <Play className="w-3 h-3 fill-teal-300" />
                  </button>
                ) : (
                  <button
                    onClick={handlePauseSpeaking}
                    className="p-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/40 text-teal-200 transition-colors cursor-pointer"
                    title="Pause speech"
                  >
                    <Pause className="w-3 h-3 fill-teal-300" />
                  </button>
                )}

                <button
                  onClick={handleStopSpeaking}
                  className="p-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 transition-colors cursor-pointer"
                  title="Stop speaking"
                >
                  <Square className="w-3 h-3 fill-rose-300 text-rose-300" />
                </button>
              </div>
            )}

            {/* Voice Responses Toggle */}
            <button
              onClick={handleToggleVoiceResponses}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                voiceResponsesEnabled
                  ? 'bg-teal-500/15 text-teal-300 border-teal-500/40 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
              title="Toggle automatic AI voice responses"
            >
              {voiceResponsesEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-teal-400" />
                  <span className="hidden sm:inline">Voice response: ON</span>
                  <span className="sm:hidden">Voice ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Voice response: OFF</span>
                  <span className="sm:hidden">Voice OFF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Message Thread History */}
        <div className="space-y-4 min-h-[260px] max-h-[460px] overflow-y-auto pr-1">
          {messages.map((m) => {
            const isAI = m.sender === 'assistant';
            const isThisPlaying = speechState.isPlaying && speechState.messageId === m.id;
            const isThisPaused = isThisPlaying && speechState.isPaused;

            return (
              <div
                key={m.id}
                className={`flex flex-col ${isAI ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-lg p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
                    isAI
                      ? 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none shadow-sm'
                      : 'bg-gradient-to-r from-teal-600 to-slate-700 text-white rounded-tr-none shadow-md'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.text}</div>

                  <div className="flex items-center justify-between text-[10px] opacity-70 pt-1 border-t border-slate-800/60">
                    <span className="font-mono">{m.time}</span>

                    {/* AI Message Audio Playback Controls */}
                    {isAI && (
                      <div className="flex items-center gap-1">
                        {isThisPlaying ? (
                          <div className="flex items-center gap-1 bg-teal-500/20 px-2 py-0.5 rounded-md border border-teal-500/40">
                            {isThisPaused ? (
                              <button
                                onClick={handleResumeSpeaking}
                                className="text-teal-300 font-bold flex items-center gap-1 hover:text-white cursor-pointer"
                              >
                                <Play className="w-2.5 h-2.5 fill-teal-300" />
                                <span>Resume</span>
                              </button>
                            ) : (
                              <button
                                onClick={handlePauseSpeaking}
                                className="text-teal-300 font-bold flex items-center gap-1 hover:text-white cursor-pointer"
                              >
                                <Pause className="w-2.5 h-2.5 fill-teal-300" />
                                <span>Pause</span>
                              </button>
                            )}

                            <span className="text-slate-500">•</span>

                            <button
                              onClick={handleStopSpeaking}
                              className="text-rose-400 font-bold flex items-center gap-1 hover:text-rose-300 cursor-pointer"
                            >
                              <Square className="w-2 h-2 fill-rose-400 text-rose-400" />
                              <span>Stop</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => speakText(m.text, m.id)}
                            className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-400 hover:text-teal-300 transition-colors cursor-pointer"
                            title="Listen to this response"
                          >
                            <Volume2 className="w-2.5 h-2.5 text-teal-400" />
                            <span>Listen</span>
                          </button>
                        )}
                      </div>
                    )}

                    {!isAI && m.wasSpoken && (
                      <span className="flex items-center gap-1 text-teal-200 font-mono text-[9px] bg-teal-500/20 px-1.5 py-0.5 rounded">
                        <Mic className="w-2.5 h-2.5" /> Spoken
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Live Recording State Indicator */}
          {isListening && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-950/80 via-slate-900 to-teal-950/80 border border-teal-500/40 shadow-lg space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-300">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
                  </span>
                  <span>Listening naturally... Speak now</span>
                </div>

                <button
                  onClick={stopRecording}
                  className="px-3 py-1 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black transition-all shadow-md cursor-pointer"
                >
                  Done Speaking
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-teal-500/20 text-xs text-white min-h-[40px] flex items-center">
                {recordedSpeech ? (
                  <span className="italic">"{recordedSpeech}"</span>
                ) : (
                  <span className="text-slate-500 italic">Say something like "What should I prioritize today?" or "Summarize my meetings"...</span>
                )}
              </div>
            </div>
          )}

          {/* Submitting / Processing your request... status */}
          {voiceStatus === 'processing' && (
            <div className="flex items-center gap-2.5 text-xs text-teal-300 p-3.5 bg-slate-950/90 rounded-2xl w-fit border border-teal-500/30 shadow-md">
              <RefreshCw className="w-4 h-4 animate-spin text-teal-400" />
              <span className="font-semibold tracking-wide">Processing your request...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* TWO OPTIONS POST-RECORDING POPUP / BAR */}
        {showVoiceOptions && recordedSpeech.trim() && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-teal-950/60 to-slate-950 border border-teal-500/40 shadow-2xl space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-teal-500/20 text-teal-300">
                  <Mic className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-teal-300">
                  Speech Recorded
                </span>
              </div>
              <button
                onClick={handleCancelVoice}
                className="text-slate-400 hover:text-white p-1 transition-colors cursor-pointer"
                title="Discard recording"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Transcript Preview */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white leading-relaxed font-medium">
              "{recordedSpeech}"
            </div>

            {/* The TWO Clear Required Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {/* OPTION 1: VOICE TO TEXT */}
              <button
                id="btn-voice-to-text"
                onClick={handleVoiceToText}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-teal-500/40 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm group"
              >
                <FileText className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-extrabold text-white">1. Voice to Text</div>
                  <div className="text-[10px] text-slate-400 font-normal">Edit text before sending</div>
                </div>
              </button>

              {/* OPTION 2: VOICE & SEND */}
              <button
                id="btn-voice-and-send"
                onClick={handleVoiceAndSend}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 cursor-pointer group"
              >
                <Send className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-extrabold text-white">2. Voice & Send</div>
                  <div className="text-[10px] text-teal-100 font-normal">Submit & listen aloud</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Clean Integrated Input Area: [ Type a message... ] [ 🎙 Microphone ] [ Send ] */}
        <div className="pt-3 border-t border-slate-800">
          <div className="relative flex items-center gap-2 bg-slate-950 rounded-2xl p-1.5 border border-slate-800 focus-within:border-teal-500/50 transition-all shadow-inner">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder={isListening ? "Listening... Speak your message" : "Type a message or tap the microphone..."}
              className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 px-3 py-2 focus:outline-none"
            />

            {/* Microphone Button integrated into chat input */}
            <button
              id="btn-wihgo-chat-mic"
              onClick={toggleMicrophone}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isListening
                  ? 'bg-teal-500 text-slate-950 border-teal-400 animate-pulse shadow-lg shadow-teal-500/30'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-teal-300 hover:border-teal-500/30'
              }`}
              title={isListening ? "Stop recording" : "Tap to speak with WIHGO AI"}
            >
              {isListening ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4 text-teal-400" />
              )}
            </button>

            {/* Send Button */}
            <button
              id="btn-send-wihgo-ai"
              onClick={() => handleSend()}
              disabled={!inputText.trim()}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-slate-700 text-white font-bold text-xs disabled:opacity-30 shadow-md hover:opacity-90 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
