"use client";

import React, { useState } from 'react';
import { UserProfile } from '../../../lib/wihgo/types';
import {
  Sliders,
  Bell,
  Volume2,
  ShieldCheck,
  Key,
  RefreshCw,
  CheckCircle2,
  Sparkles,
  User,
  Link as LinkIcon,
  CreditCard,
  Lock,
  RotateCcw,
  X,
  LogOut
} from 'lucide-react';

interface SettingsViewProps {
  user: UserProfile;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onUpdateUser: (updated: UserProfile) => void;
  onReplayOnboarding?: () => void;
  onPlayOpeningMotion?: () => void;
  onOpenShowcaseExperience?: () => void;
  onNavigateTab?: (tab: string) => void;
  onLogout?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  soundEnabled,
  onToggleSound,
  onUpdateUser,
  onReplayOnboarding,
  onPlayOpeningMotion,
  onOpenShowcaseExperience,
  onNavigateTab,
  onLogout
}) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'account' | 'notifications' | 'connected' | 'ai' | 'security'>('all');
  
  // Settings state
  const [autoReplies, setAutoReplies] = useState(user.autoAiRepliesEnabled);
  const [emailNotifs, setEmailNotifs] = useState(user.emailNotifications);
  const [pushNotifs, setPushNotifs] = useState(user.pushNotifications);
  const [aiTone, setAiTone] = useState<'professional' | 'casual' | 'enthusiastic'>('professional');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    onUpdateUser({
      ...user,
      autoAiRepliesEnabled: autoReplies,
      emailNotifications: emailNotifs,
      pushNotifications: pushNotifs
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCancel = () => {
    setAutoReplies(user.autoAiRepliesEnabled);
    setEmailNotifs(user.emailNotifications);
    setPushNotifs(user.pushNotifications);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Application Settings</span>
            <Sliders className="w-5 h-5 text-teal-400" />
          </h1>
          <p className="text-xs text-slate-400">Configure notifications, audio chimes, AI auto-replies, connected channels and security controls</p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-bold animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings Saved Successfully!</span>
            </div>
          )}

          {onLogout && (
            <button
              id="btn-settings-logout"
              type="button"
              onClick={onLogout}
              className="py-2 px-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold text-xs flex items-center gap-1.5 transition-all w-fit cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Settings', icon: Sliders },
          { id: 'account', label: 'Account', icon: User },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'connected', label: 'Connected Accounts', icon: LinkIcon },
          { id: 'ai', label: 'AI Preferences', icon: Sparkles },
          { id: 'security', label: 'Security', icon: Lock }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`py-2 px-3.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeCategory === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-cyan-400" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Replay Onboarding Introduction Banner */}
        <div className="md:col-span-2 bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-900/80 border border-purple-500/30 p-5 rounded-3xl backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-500/20 border border-purple-500/40 text-purple-300">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Replay WIHGO Introduction</h3>
              <p className="text-xs text-slate-400">Review the 5-step onboarding walkthrough and feature tutorial</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {onOpenShowcaseExperience && (
              <button
                id="btn-showcase-experience-settings"
                type="button"
                onClick={onOpenShowcaseExperience}
                className="py-2.5 px-4 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/40 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                <span>W+O Splash & Dashboard Player</span>
              </button>
            )}

            {onPlayOpeningMotion && (
              <button
                id="btn-play-motion-settings"
                type="button"
                onClick={onPlayOpeningMotion}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-300 animate-pulse" />
                <span>Play Opening Motion</span>
              </button>
            )}

            <button
              id="btn-replay-onboarding-settings"
              onClick={onReplayOnboarding}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 w-fit cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay WIHGO Intro</span>
            </button>
          </div>
        </div>

        {/* Audio & Feedback */}
        {(activeCategory === 'all' || activeCategory === 'notifications') && (
          <div className="bg-slate-900/90 border border-indigo-500/20 p-6 rounded-3xl backdrop-blur-xl space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <span>Audio & Sound Feedback</span>
            </h2>

            <div className="flex items-center justify-between p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div>
                <div className="text-xs font-bold text-white">Audio Chimes & Notification Sounds</div>
                <div className="text-[10px] text-slate-400">Play subtle synth chimes when syncing or receiving priority messages</div>
              </div>

              <button
                onClick={onToggleSound}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  soundEnabled ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        )}

        {/* AI Preferences */}
        {(activeCategory === 'all' || activeCategory === 'ai') && (
          <div className="bg-slate-900/90 border border-indigo-500/20 p-6 rounded-3xl backdrop-blur-xl space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>WIHGO AI Auto-Pilot</span>
            </h2>

            <div className="flex items-center justify-between p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div>
                <div className="text-xs font-bold text-white">Smart Auto-Replies</div>
                <div className="text-[10px] text-slate-400">Automatically draft or send AI responses based on Business Brain rules</div>
              </div>

              <button
                onClick={() => setAutoReplies(!autoReplies)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  autoReplies ? 'bg-purple-500' : 'bg-slate-800'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  autoReplies ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-white">Default AI Communication Tone</div>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {(['professional', 'casual', 'enthusiastic'] as const).map((tone) => (
                  <button
                    key={tone}
                    type="button"
                    onClick={() => setAiTone(tone)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold capitalize transition-all ${
                      aiTone === tone
                        ? 'bg-purple-600 text-white border border-purple-400'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notifications */}
        {(activeCategory === 'all' || activeCategory === 'notifications') && (
          <div className="bg-slate-900/90 border border-indigo-500/20 p-6 rounded-3xl backdrop-blur-xl space-y-4 md:col-span-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Notification Delivery Channels</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800">
                <div>
                  <div className="text-xs font-bold text-white">Email Daily Digest & Urgent Alerts</div>
                  <div className="text-[10px] text-slate-400">Receive priority updates at {user.email}</div>
                </div>
                <button
                  onClick={() => setEmailNotifs(!emailNotifs)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    emailNotifs ? 'bg-amber-500' : 'bg-slate-800'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    emailNotifs ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800">
                <div>
                  <div className="text-xs font-bold text-white">Browser Push Notifications</div>
                  <div className="text-[10px] text-slate-400">Real-time alerts for incoming messages</div>
                </div>
                <button
                  onClick={() => setPushNotifs(!pushNotifs)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    pushNotifs ? 'bg-cyan-500' : 'bg-slate-800'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    pushNotifs ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Connected Accounts Quick Link */}
        {(activeCategory === 'all' || activeCategory === 'connected') && (
          <div className="bg-slate-900/90 border border-indigo-500/20 p-6 rounded-3xl backdrop-blur-xl space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-cyan-400" />
              <span>Connected Channels</span>
            </h2>
            <p className="text-xs text-slate-400">Manage OAuth keys and token authorizations across all 9 connected platform channels</p>
            <button
              onClick={() => onNavigateTab?.('connections')}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs border border-slate-700 flex items-center gap-2"
            >
              <span>Manage Connectors</span>
              <LinkIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Security & Subscription */}
        {(activeCategory === 'all' || activeCategory === 'security') && (
          <div className="bg-slate-900/90 border border-indigo-500/20 p-6 rounded-3xl backdrop-blur-xl space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Security & Subscription</span>
            </h2>
            <div className="space-y-2">
              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">OAuth 2.0 Security Encryption</div>
                  <div className="text-[10px] text-emerald-400">Active & Enforced</div>
                </div>
                <Lock className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Subscription Tier</div>
                  <div className="text-[10px] text-cyan-400">WIHGO AI Pro Tier</div>
                </div>
                <button
                  onClick={() => onNavigateTab?.('subscription')}
                  className="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold"
                >
                  Manage
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Global Save / Cancel Bar */}
      <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
        <button
          type="button"
          onClick={handleCancel}
          className="py-2.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all flex items-center gap-1.5"
        >
          <X className="w-3.5 h-3.5" />
          <span>Cancel Changes</span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </div>
    </div>
  );
};
