"use client";

import React, { useState, useEffect } from 'react';
import { CalendarEvent } from '../../../lib/wihgo/types';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  Video,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  CalendarDays,
  UserCheck,
  LogOut
} from 'lucide-react';
import { 
  googleSignIn, 
  googleLogout, 
  fetchGoogleCalendarEvents, 
  createGoogleCalendarEvent, 
  deleteGoogleCalendarEvent, 
  initAuth,
  getAccessToken 
} from '../../../lib/wihgo/demoBackend';
import { UserProfile } from '../../../lib/wihgo/types';

interface CalendarViewProps {
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
  onDeleteEvent?: (eventId: string) => void;
  onSetEvents?: (events: CalendarEvent[]) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ 
  events, 
  onAddEvent, 
  onDeleteEvent,
  onSetEvents 
}) => {
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [startTime, setStartTime] = useState<string>(() => {
    const now = new Date();
    now.setMinutes(0);
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  });
  const [endTime, setEndTime] = useState<string>(() => {
    const now = new Date();
    now.setMinutes(0);
    now.setHours(now.getHours() + 2);
    return now.toISOString().slice(0, 16);
  });
  const [locationOrUrl, setLocationOrUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Delete confirmation modal
  const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Initialize auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user: any, token: any) => {
        setGoogleUser(user);
        setAccessTokenState(token);
        loadCalendarEvents(token);
      },
      () => {
        // Not authenticated with Google
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const loadCalendarEvents = async (token: string) => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      const gcalEvents = await fetchGoogleCalendarEvents(token);
      if (onSetEvents && gcalEvents.length > 0) {
        onSetEvents(gcalEvents);
      }
      setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err: any) {
      console.error('Failed to load Google Calendar events:', err);
      setSyncError(err.message || 'Failed to sync with Google Calendar');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleGoogleConnect = async () => {
    setIsConnecting(true);
    setSyncError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setAccessTokenState(result.accessToken);
        await loadCalendarEvents(result.accessToken);
      }
    } catch (err: any) {
      console.error('Google Connect Error:', err);
      setSyncError(err?.message || 'Authentication with Google failed');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleGoogleDisconnect = async () => {
    try {
      await googleLogout();
      setGoogleUser(null);
      setAccessTokenState(null);
    } catch (err) {
      console.error('Google Logout Error:', err);
    }
  };

  const handleManualSync = async () => {
    if (!accessToken) {
      handleGoogleConnect();
      return;
    }
    await loadCalendarEvents(accessToken);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    setSyncError(null);

    try {
      let createdEv: CalendarEvent;

      if (accessToken) {
        // Post directly to Google Calendar
        createdEv = await createGoogleCalendarEvent(accessToken, {
          title,
          description,
          startTime,
          endTime,
          locationOrUrl
        });
      } else {
        // Local fallback
        createdEv = {
          id: `ev-${Date.now()}`,
          title,
          description,
          type: 'meeting',
          platform: 'calendar',
          startTime,
          endTime,
          locationOrUrl,
          completed: false
        };
      }

      onAddEvent(createdEv);
      setTitle('');
      setDescription('');
      setLocationOrUrl('');
      setShowAddModal(false);
      setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err: any) {
      console.error('Error creating event:', err);
      setSyncError(err?.message || 'Failed to create event on Google Calendar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteEvent = async () => {
    if (!eventToDelete) return;
    setIsDeleting(true);
    setSyncError(null);

    try {
      if (accessToken && eventToDelete.id.length > 5 && !eventToDelete.id.startsWith('ev-')) {
        await deleteGoogleCalendarEvent(accessToken, eventToDelete.id);
      }

      if (onDeleteEvent) {
        onDeleteEvent(eventToDelete.id);
      } else if (onSetEvents) {
        onSetEvents(events.filter(e => e.id !== eventToDelete.id));
      }

      setEventToDelete(null);
      setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err: any) {
      console.error('Error deleting event:', err);
      setSyncError(err?.message || 'Failed to delete event from Google Calendar');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900/90 via-indigo-950/40 to-slate-900/90 border border-indigo-500/20 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-400/30 text-blue-400">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>Google Calendar</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold uppercase tracking-wider">
                    Official Sync
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Manage Google Calendar events, meeting links, and schedules with permission
                </p>
              </div>
            </div>
          </div>

          {/* Connect / Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {googleUser ? (
              <div className="flex items-center gap-2">
                <button
                  id="btn-sync-gcal"
                  onClick={handleManualSync}
                  disabled={isSyncing}
                  className="py-2.5 px-4 rounded-2xl bg-slate-800/90 border border-slate-700 text-slate-200 hover:text-white font-medium text-xs flex items-center gap-2 transition-all hover:bg-slate-800"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-400' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                </button>

                <button
                  id="btn-add-calendar-event"
                  onClick={() => setShowAddModal(true)}
                  className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-md hover:shadow-lg flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Event</span>
                </button>
              </div>
            ) : (
              /* Google Sign-In standard button */
              <button
                id="btn-connect-google-calendar"
                onClick={handleGoogleConnect}
                disabled={isConnecting}
                className="py-2.5 px-5 rounded-2xl bg-slate-900 border border-slate-700 hover:border-blue-400 text-white font-semibold text-xs flex items-center gap-3 transition-all shadow-md hover:shadow-blue-500/10"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{isConnecting ? 'Connecting...' : 'Connect Google Calendar'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Sync Status Badge */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          {googleUser ? (
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Connected as <strong className="text-white">{googleUser.email}</strong></span>
              {lastSyncedTime && <span className="text-slate-500 ml-2">• Last synced at {lastSyncedTime}</span>}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-amber-400/90 font-medium">
              <AlertCircle className="w-4 h-4" />
              <span>Sign in with Google to sync your live events and meetings automatically.</span>
            </div>
          )}

          {googleUser && (
            <button
              onClick={handleGoogleDisconnect}
              className="text-slate-400 hover:text-rose-400 transition-colors text-[11px] flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              <span>Disconnect</span>
            </button>
          )}
        </div>

        {/* Sync Error Banner */}
        {syncError && (
          <div className="mt-3 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{syncError}</span>
          </div>
        )}
      </div>

      {/* Events Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-cyan-400" />
            <span>Upcoming Schedule ({events.length})</span>
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-xs text-cyan-400 hover:underline font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Event</span>
          </button>
        </div>

        {events.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/60 border border-slate-800/80 rounded-3xl space-y-3">
            <CalendarIcon className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">No Upcoming Events</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {googleUser 
                ? "Your Google Calendar is up to date! Click 'New Event' above to schedule an appointment."
                : "Connect your Google Calendar account above to sync your meetings and schedule."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="bg-slate-900/80 border border-indigo-500/15 p-4 rounded-3xl backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-500/30 transition-all shadow-md group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-400/30 text-blue-400 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-white">{ev.title}</h3>
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30">
                        {ev.platform || 'Google Calendar'}
                      </span>
                    </div>

                    {ev.description && (
                      <p className="text-xs text-slate-400 line-clamp-2">{ev.description}</p>
                    )}

                    {ev.locationOrUrl && (
                      <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-medium pt-1">
                        <Video className="w-3.5 h-3.5 shrink-0" />
                        <a 
                          href={ev.locationOrUrl.startsWith('http') ? ev.locationOrUrl : `https://${ev.locationOrUrl}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="hover:underline flex items-center gap-1 truncate max-w-xs"
                        >
                          <span>{ev.locationOrUrl}</span>
                          <ExternalLink className="w-3 h-3 opacity-70" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
                  <div className="text-left sm:text-right text-xs font-semibold text-slate-300">
                    <div className="text-cyan-300 font-bold">
                      {new Date(ev.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(ev.startTime).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                  </div>

                  <button
                    id={`btn-delete-event-${ev.id}`}
                    onClick={() => setEventToDelete(ev)}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors border border-slate-700/80 hover:border-rose-500/30"
                    title="Delete event with permission"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleCreateEvent} className="bg-[#0B0F19] border border-blue-500/30 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-400" />
                <span>Create Calendar Event</span>
              </h3>
              {googleUser && (
                <span className="text-[10px] text-emerald-400 font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  Syncing to Google Calendar
                </span>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Event Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. WIHGO Strategy & Client Sync"
                className="w-full bg-slate-900 text-xs text-white p-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Description / Notes</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Meeting agenda, action items, or notes..."
                className="w-full bg-slate-900 text-xs text-white p-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">Start Time</label>
                <input
                  type="datetime-local"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-slate-900 text-xs text-white p-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">End Time</label>
                <input
                  type="datetime-local"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-slate-900 text-xs text-white p-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Location or Meeting Link</label>
              <input
                type="text"
                value={locationOrUrl}
                onChange={(e) => setLocationOrUrl(e.target.value)}
                placeholder="e.g. https://meet.google.com/xyz-abc or Office Boardroom"
                className="w-full bg-slate-900 text-xs text-white p-3 rounded-2xl border border-slate-800 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="py-3 rounded-2xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-md hover:shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Saving...' : 'Save & Sync Event'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mandatory User Confirmation Dialog for Deleting Event */}
      {eventToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B0F19] border border-rose-500/30 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">Delete Event?</h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to remove <strong className="text-white">"{eventToDelete.title}"</strong>? This will remove it with permission from Google Calendar.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEventToDelete(null)}
                disabled={isDeleting}
                className="py-3 rounded-2xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteEvent}
                disabled={isDeleting}
                className="py-3 rounded-2xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition-colors flex items-center justify-center gap-2"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
