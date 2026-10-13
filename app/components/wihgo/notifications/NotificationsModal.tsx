"use client";

import React, { useState } from 'react';
import { NotificationItem, PlatformId } from '../../../lib/wihgo/types';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  Trash2,
  X,
  Sparkles,
  Mail,
  Calendar,
  HardDrive,
  Video,
  Camera,
  ThumbsUp,
  Music2,
  Briefcase,
  MessageSquare,
  User,
  Info,
  ShieldCheck,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead: () => void;
  onRemoveNotification?: (id: string) => void;
  onClearAll?: () => void;
  onNavigate?: (view: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications = [],
  onMarkRead,
  onMarkAllRead,
  onRemoveNotification,
  onClearAll,
  onNavigate
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  if (!isOpen) return null;

  const unreadList = notifications.filter(n => !n.read);
  const unreadCount = unreadList.length;
  const displayList = filter === 'unread' ? unreadList : notifications;

  const renderPlatformBadge = (platform: string) => {
    switch (platform) {
      case 'email':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
            <Mail className="w-3 h-3 text-red-400" /> Gmail
          </span>
        );
      case 'calendar':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Calendar className="w-3 h-3 text-blue-400" /> Calendar
          </span>
        );
      case 'drive':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <HardDrive className="w-3 h-3 text-emerald-400" /> Drive
          </span>
        );
      case 'meet':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Video className="w-3 h-3 text-teal-400" /> Meet
          </span>
        );
      case 'whatsapp':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <WhatsAppIcon className="w-3 h-3" /> WhatsApp
          </span>
        );
      case 'instagram':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
            <Camera className="w-3 h-3 text-pink-400" /> Camera
          </span>
        );
      case 'facebook':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-600/10 text-blue-400 border border-blue-600/20">
            <ThumbsUp className="w-3 h-3 text-blue-400" /> ThumbsUp
          </span>
        );
      case 'tiktok':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Music2 className="w-3 h-3 text-cyan-400" /> TikTok
          </span>
        );
      case 'linkedin':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Briefcase className="w-3 h-3 text-sky-400" /> LinkedIn
          </span>
        );
      case 'ai':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30">
            <Sparkles className="w-3 h-3 text-cyan-300" /> WIHGO AI
          </span>
        );
      case 'profile':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
            <User className="w-3 h-3 text-purple-300" /> Profile
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            <ShieldCheck className="w-3 h-3 text-slate-400" /> System
          </span>
        );
    }
  };

  return (
    <div 
      id="notifications-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="notifications-modal-container"
        className="bg-[#0B0F19] border border-cyan-500/30 rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col max-h-[85vh] transition-all"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">Real-time alerts, connector updates & activity</p>
            </div>
          </div>

          <button 
            id="close-notifications-btn"
            onClick={onClose} 
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar & Filters */}
        <div className="flex items-center justify-between pt-3 pb-2 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
            <button
              id="filter-all-notifs"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filter === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              id="filter-unread-notifs"
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filter === 'unread'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                id="mark-all-read-btn"
                onClick={onMarkAllRead}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-cyan-400 hover:text-cyan-300 transition-colors px-2.5 py-1 rounded-lg hover:bg-cyan-500/10"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}

            {notifications.length > 0 && onClearAll && (
              showClearConfirm ? (
                <div className="flex items-center gap-1">
                  <button
                    id="confirm-clear-all-btn"
                    onClick={() => {
                      onClearAll();
                      setShowClearConfirm(false);
                    }}
                    className="text-[11px] font-bold text-rose-400 hover:text-rose-300 px-2 py-1 rounded bg-rose-500/10 border border-rose-500/30"
                  >
                    Confirm clear
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="text-[11px] text-slate-400 hover:text-white px-1.5 py-1"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  id="clear-all-notifs-btn"
                  onClick={() => setShowClearConfirm(true)}
                  className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors px-2 py-1 rounded hover:bg-slate-800"
                  title="Clear all notifications"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-2.5 overflow-y-auto pr-1 flex-1 my-2">
          {displayList.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl bg-slate-900/30 border border-dashed border-slate-800 flex flex-col items-center justify-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500">
                <CheckCircle2 className="w-6 h-6 text-emerald-400/70" />
              </div>
              <h4 className="text-sm font-semibold text-white">You're all caught up</h4>
              <p className="text-xs text-slate-400 max-w-xs">
                {filter === 'unread' 
                  ? 'No unread notifications at the moment.' 
                  : 'New messages, connector events, and AI summaries will appear here in real time.'}
              </p>
            </div>
          ) : (
            displayList.map((notif) => (
              <div
                key={notif.id}
                id={`notification-item-${notif.id}`}
                onClick={() => {
                  if (!notif.read && onMarkRead) {
                    onMarkRead(notif.id);
                  }
                }}
                className={`group relative p-3.5 rounded-2xl border text-xs transition-all cursor-pointer ${
                  notif.read
                    ? 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:bg-slate-900/70 hover:border-slate-700'
                    : 'bg-slate-900/90 border-cyan-500/30 text-white shadow-[0_0_15px_rgba(6,182,212,0.08)] hover:border-cyan-400/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {renderPlatformBadge(notif.platform)}
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4] inline-block animate-pulse" />
                    )}
                    <span className={`font-bold tracking-tight ${notif.read ? 'text-slate-300' : 'text-white font-semibold'}`}>
                      {notif.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">
                      {notif.timestamp}
                    </span>

                    {onRemoveNotification && (
                      <button
                        id={`delete-notif-${notif.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveNotification(notif.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-all ml-1"
                        title="Remove notification"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <p className={`mt-1.5 text-xs leading-relaxed ${notif.read ? 'text-slate-400' : 'text-slate-200'}`}>
                  {notif.message}
                </p>

                {notif.actionUrl && onNavigate && (
                  <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate(notif.actionUrl!);
                        onClose();
                      }}
                      className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 hover:underline"
                    >
                      <span>View details</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Synced with Neon Live</span>
          </div>
          <span>WIHGO Hub Security</span>
        </div>
      </div>
    </div>
  );
};
