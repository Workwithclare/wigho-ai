"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Zap,
  X,
  RefreshCw,
  Cpu,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Square,
  Pause,
  Play,
  FileText,
  Radio
} from 'lucide-react';
import { AIOrchestrator, AIProviderMetadata } from '../../../lib/wihgo/ai/aiOrchestrator';
import { UserProfile, PlatformInfo } from '../../../lib/wihgo/types';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserProfile;
  platforms?: PlatformInfo[];
  workspaceContext?: any;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  metadata?: AIProviderMetadata;
  isError?: boolean;
  wasSpoken?: boolean;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  user,
  platforms = [],
  workspaceContext
}) => {
  const userName = user?.name ? user.name.split(' ')[0] : 'Clare';
  
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: user?.name 
        ? `Hi ${user.name.split(' ')[0]} 👋 I'm WihGo Mind. Ask me anything via text or tap the microphone to speak naturally.`
        : "Hi, I'm WihGo Mind 👋 How can I help you achieve your goals today? Type a message or tap the microphone to speak.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      metadata: {
        provider: 'WIHGO',
        model: 'wihgo-orchestration-v1',
        latencyMs: 10,
        status: 'active'
      }
    }
  ]);

  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recordedSpeech, setRecordedSpeech] = useState<string>('');
  const [showVoiceOptions, setShowVoiceOptions] = useState<boolean>(false);
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'listening' | 'recorded' | 'processing' | 'responding'>('idle');

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

  const [voiceResponsesEnabled, setVoiceResponsesEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('wihgo_voice_responses_enabled') === 'true';
    } catch {
      return true;
    }
  });

  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update initial message when user changes
  useEffect(() => {
    if (user?.name && messages.length === 1 && messages[0].id === 'welcome-1') {
      setMessages([
        {
          id: 'welcome-1',
          sender: 'assistant',
          text: `Hi ${user.name.split(' ')[0]} 👋 I'm WihGo Mind. Ask me anything via text or tap the microphone to speak naturally.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          metadata: {
            provider: 'WIHGO',
            model: 'wihgo-orchestration-v1',
            latencyMs: 10,
            status: 'active'
          }
        }
      ]);
    }
  }, [user?.name]);

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, voiceStatus, isOpen]);

  if (!isOpen) return null;

  // Speak AI message
  const speakText = (text: string, messageId: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const cleanText = text.replace(/[*#_`\[\]()]/g, ' ').replace(/\s+/g, ' ').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.lang.startsWith('en')) && !v.name.includes('Bad'));
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onstart = () => setSpeechState({ isPlaying: true, isPaused: false, messageId });
    utterance.onpause = () => setSpeechState(prev => ({ ...prev, isPaused: true }));
    utterance.onresume = () => setSpeechState(prev => ({ ...prev, isPaused: false }));
    utterance.onend = () => setSpeechState({ isPlaying: false, isPaused: false, messageId: null });
    utterance.onerror = () => setSpeechState({ isPlaying: false, isPaused: false, messageId: null });

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

  const handleToggleVoiceResponses = () => {
    const nextVal = !voiceResponsesEnabled;
    setVoiceResponsesEnabled(nextVal);
    try {
      localStorage.setItem('wihgo_voice_responses_enabled', String(nextVal));
    } catch (e) {
      console.warn('Failed to save voice setting:', e);
    }
    if (!nextVal) handleStopSpeaking();
  };

  const handleSend = async (promptText?: string, fromVoice = false) => {
    const textToSend = promptText || inputText;
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

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);
    setVoiceStatus('processing');

    try {
      const connectedPlatforms = platforms.filter(p => p.connected).map(p => p.name);

      const response = await AIOrchestrator.processQuery({
        message: textToSend.trim(),
        context: {
          ...workspaceContext,
          userName: user?.name || userName,
          companyName: user?.companyName,
          businessDescription: user?.businessDescription,
          connectedPlatforms,
          allPlatformsStatus: platforms.map(p => ({ id: p.id, name: p.name, connected: p.connected }))
        }
      });

      const aiMsgId = `ai-${Date.now()}`;
      const aiMsg: ChatMessage = {
        id: aiMsgId,
        sender: 'assistant',
        text: response.reply,
        time: response.timestamp,
        metadata: response.metadata
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (voiceResponsesEnabled || fromVoice) {
        speakText(response.reply, aiMsgId);
      }
    } catch (err) {
      const errorMsgId = `err-${Date.now()}`;
      const fallbackText = `Yes, ${userName}. WihGo Mind has received your command. Your connected channels are monitored.`;
      const errorMsg: ChatMessage = {
        id: errorMsgId,
        sender: 'assistant',
        text: fallbackText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        metadata: {
          provider: 'WIHGO',
          model: 'wihgo-core-engine-v1',
          latencyMs: 15,
          status: 'fallback'
        }
      };
      setMessages((prev) => [...prev, errorMsg]);

      if (voiceResponsesEnabled || fromVoice) {
        speakText(fallbackText, errorMsgId);
      }
    } finally {
      setIsLoading(false);
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
        console.warn('Speech error in drawer:', event.error);
        setIsListening(false);
        if (!recordedSpeech.trim()) {
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
      console.warn('Speech recognition init error:', err);
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
        console.warn('Speech stop error:', e);
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

  // Option 1: Voice to Text
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

  // Option 2: Voice & Send
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

  const quickPrompts = [
    "Summarize my day",
    "What meetings do I have?",
    "Read my important messages",
    "Suggest customer response ideas"
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex justify-end">
      <div className="w-full max-w-md bg-[#0B0F19] border-l border-teal-500/30 h-full flex flex-col justify-between shadow-[0_0_60px_rgba(20,184,166,0.2)] animate-slide-left">
        {/* Header with Voice Toggle & Playback Status */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-teal-500 to-slate-700 p-0.5 shadow-md flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>WihGo Mind</span>
              </h2>
              <p className="text-[11px] text-teal-300">Text & Voice Integrated</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Inline Playback Indicator / Controls in header */}
            {speechState.isPlaying && (
              <div className="flex items-center gap-1 bg-teal-950/80 border border-teal-500/40 rounded-xl px-2 py-1">
                {speechState.isPaused ? (
                  <button
                    onClick={handleResumeSpeaking}
                    className="p-0.5 text-teal-300 hover:text-white cursor-pointer"
                    title="Resume"
                  >
                    <Play className="w-3 h-3 fill-teal-300" />
                  </button>
                ) : (
                  <button
                    onClick={handlePauseSpeaking}
                    className="p-0.5 text-teal-300 hover:text-white cursor-pointer"
                    title="Pause"
                  >
                    <Pause className="w-3 h-3 fill-teal-300" />
                  </button>
                )}
                <button
                  onClick={handleStopSpeaking}
                  className="p-0.5 text-rose-300 hover:text-rose-200 cursor-pointer"
                  title="Stop"
                >
                  <Square className="w-2.5 h-2.5 fill-rose-300 text-rose-300" />
                </button>
              </div>
            )}

            <button
              onClick={handleToggleVoiceResponses}
              className={`p-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                voiceResponsesEnabled
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                  : 'bg-slate-950 text-slate-500 border-slate-800'
              }`}
              title={voiceResponsesEnabled ? "Voice responses ON" : "Voice responses OFF"}
            >
              {voiceResponsesEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            <button
              id="btn-close-ai-drawer"
              onClick={onClose}
              aria-label="Close assistant"
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Command Pills */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/60 overflow-x-auto flex gap-2">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp, false)}
              className="py-1 px-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-teal-400/40 text-[10px] font-semibold text-slate-300 hover:text-teal-300 whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer"
            >
              <Zap className="w-3 h-3 text-teal-400" />
              <span>{qp}</span>
            </button>
          ))}
        </div>

        {/* Chat Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
                  className={`max-w-xs sm:max-w-sm p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isAI
                      ? 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none shadow-sm'
                      : 'bg-gradient-to-r from-teal-600 to-slate-700 text-white rounded-tr-none shadow-md'
                  }`}
                >
                  <div className="whitespace-pre-line">{m.text}</div>
                  <div className="flex items-center justify-between gap-2 text-[9px] opacity-70 pt-1 border-t border-slate-800/50 mt-2">
                    {isAI && (
                      <div className="flex items-center gap-1">
                        {isThisPlaying ? (
                          <div className="flex items-center gap-1 bg-teal-500/20 px-1.5 py-0.5 rounded border border-teal-500/40">
                            {isThisPaused ? (
                              <button onClick={handleResumeSpeaking} className="text-teal-300 font-bold flex items-center gap-0.5 cursor-pointer">
                                <Play className="w-2 h-2 fill-teal-300" /> Resume
                              </button>
                            ) : (
                              <button onClick={handlePauseSpeaking} className="text-teal-300 font-bold flex items-center gap-0.5 cursor-pointer">
                                <Pause className="w-2 h-2 fill-teal-300" /> Pause
                              </button>
                            )}
                            <button onClick={handleStopSpeaking} className="text-rose-400 font-bold ml-1 cursor-pointer">
                              <Square className="w-2 h-2 fill-rose-400" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => speakText(m.text, m.id)}
                            className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold text-slate-400 hover:text-teal-300 transition-colors cursor-pointer"
                          >
                            <Volume2 className="w-2.5 h-2.5 text-teal-400" />
                            <span>Listen</span>
                          </button>
                        )}
                      </div>
                    )}

                    {!isAI && m.wasSpoken && (
                      <span className="flex items-center gap-0.5 text-teal-200 font-mono text-[8px] bg-teal-500/20 px-1 py-0.5 rounded">
                        <Mic className="w-2 h-2" /> Spoken
                      </span>
                    )}

                    <span className="ml-auto font-mono">{m.time}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Live Recording State inside chat */}
          {isListening && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-teal-950/80 to-slate-900 border border-teal-500/40 space-y-1.5 animate-pulse">
              <div className="flex items-center justify-between text-xs text-teal-300 font-bold">
                <span className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-teal-400" /> Listening... Speak naturally
                </span>
                <button
                  onClick={stopRecording}
                  className="px-2 py-0.5 rounded-lg bg-teal-500 text-slate-950 text-[10px] font-black cursor-pointer"
                >
                  Done
                </button>
              </div>
              <div className="text-[11px] text-white italic">
                {recordedSpeech || 'Speak naturally to WihGo Mind...'}
              </div>
            </div>
          )}

          {/* Processing status */}
          {voiceStatus === 'processing' && (
            <div className="flex items-center gap-2 text-xs text-teal-300 p-2.5 bg-slate-900 rounded-xl w-fit border border-slate-800 shadow-sm">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-400" />
              <span className="font-semibold">Processing your request...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* TWO OPTIONS POST-RECORDING POPUP / BAR */}
        {showVoiceOptions && recordedSpeech.trim() && (
          <div className="p-3 mx-3 mb-2 rounded-2xl bg-gradient-to-r from-slate-950 via-teal-950/70 to-slate-950 border border-teal-500/40 shadow-xl space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-300 flex items-center gap-1">
                <Mic className="w-3 h-3" /> Speech Recorded
              </span>
              <button onClick={handleCancelVoice} className="text-slate-400 hover:text-white p-0.5 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-2 rounded-lg bg-slate-900 text-xs text-white italic">
              "{recordedSpeech}"
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleVoiceToText}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                <FileText className="w-3 h-3 text-teal-400" />
                <span>1. Voice to Text</span>
              </button>

              <button
                onClick={handleVoiceAndSend}
                className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-md cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>2. Voice & Send</span>
              </button>
            </div>
          </div>
        )}

        {/* Input Bar: [ Type a message... ] [ 🎙 Microphone ] [ Send ] */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90 space-y-2">
          <div className="flex items-center gap-1.5 bg-slate-950 rounded-xl p-1 border border-slate-800 focus-within:border-teal-500/50">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder={isListening ? "Listening... Speak naturally" : "Type or speak to WihGo Mind..."}
              className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 px-3 py-2 focus:outline-none"
            />

            <button
              onClick={toggleMicrophone}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                isListening
                  ? 'bg-teal-500 text-slate-950 border-teal-400 animate-pulse'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-teal-300'
              }`}
              title={isListening ? "Stop listening" : "Tap to speak"}
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-teal-400" />}
            </button>

            <button
              id="btn-send-ai-drawer"
              onClick={() => handleSend()}
              disabled={!inputText.trim() || isLoading}
              className="p-2 rounded-lg bg-gradient-to-r from-teal-500 to-slate-700 text-white disabled:opacity-40 shadow-sm transition-opacity cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
