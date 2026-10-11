"use client";

import React, { useState, useEffect } from 'react';
import {
  Video,
  Plus,
  Calendar,
  Copy,
  ExternalLink,
  Clock,
  CheckCircle2,
  Sparkles,
  Lock,
  Users,
  AlertCircle,
  RefreshCw,
  Link as LinkIcon,
  Trash2,
  X
} from 'lucide-react';
import { googleSignIn, getAccessToken, fetchGoogleCalendarEvents, deleteGoogleCalendarEvent } from '../../../lib/wihgo/demoBackend';
import { createGoogleMeetSpace, scheduleGoogleMeetCall, MeetSpaceItem } from '../../../lib/wihgo/demoBackend';
import { CalendarEvent } from '../../../lib/wihgo/types';

interface GoogleMeetViewProps {
  onNavigateTab?: (tab: string) => void;
}

export const GoogleMeetView: React.FC<GoogleMeetViewProps> = ({ onNavigateTab }) => {
  const [meetings, setMeetings] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);

  // Instant Meeting Link Popup
  const [activeInstantMeeting, setActiveInstantMeeting] = useState<MeetSpaceItem | null>(null);

  // Schedule Modal
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  const [meetingTitle, setMeetingTitle] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [meetingDesc, setMeetingDesc] = useState<string>('');

  // Delete Confirmation
  const [meetingToDelete, setMeetingToDelete] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    checkAndLoadMeetings();
  }, []);

  const checkAndLoadMeetings = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const token = await getAccessToken();
      if (token) {
        setIsAuthenticated(true);
        const events = await fetchGoogleCalendarEvents(token);
        const meetEvents = events.filter((e: any) => e.locationOrUrl?.includes('meet.google.com') || e.platform === 'meet');
        setMeetings(meetEvents.length > 0 ? meetEvents : MOCK_INITIAL_MEETINGS);
      } else {
        setIsAuthenticated(false);
        setMeetings(MOCK_INITIAL_MEETINGS);
      }
    } catch (err: any) {
      console.error('Error loading Google Meetings:', err);
      setMeetings(MOCK_INITIAL_MEETINGS);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setErrorMsg(null);
    try {
      const res = await googleSignIn();
      if (res?.accessToken) {
        setIsAuthenticated(true);
        setSuccessMsg('Successfully connected Google Meet!');
        setTimeout(() => setSuccessMsg(null), 3000);
        await checkAndLoadMeetings();
      }
    } catch (err: any) {
      console.error('Sign-in failed:', err);
      setErrorMsg('Google Meet sign-in failed.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleCreateInstantMeeting = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const token = await getAccessToken();
      let meetSpace: MeetSpaceItem;
      if (token) {
        meetSpace = await createGoogleMeetSpace(token);
      } else {
        meetSpace = {
          id: `meet-${Date.now()}`,
          name: 'spaces/instant-wihgo',
          meetingUri: `https://meet.google.com/wih-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`,
          meetingCode: 'wih-go-meet'
        };
      }
      setActiveInstantMeeting(meetSpace);
      setSuccessMsg('Instant Google Meet space created!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error('Failed to create instant Google Meet:', err);
      setErrorMsg('Could not create instant Google Meet call.');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingTitle || !startTime) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const token = await getAccessToken();
      if (!token) {
        await handleSignIn();
        return;
      }

      const newMeet = await scheduleGoogleMeetCall(token, {
        title: meetingTitle,
        description: meetingDesc,
        startTime
      });

      setMeetings(prev => [newMeet, ...prev]);
      setSuccessMsg(`Scheduled "${meetingTitle}" with Google Meet link!`);
      setShowScheduleModal(false);
      setMeetingTitle('');
      setStartTime('');
      setMeetingDesc('');
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      console.error('Schedule Google Meet error:', err);
      setErrorMsg('Failed to schedule meeting on Google Calendar & Meet.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteMeeting = async () => {
    if (!meetingToDelete) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const token = await getAccessToken();
      if (token && meetingToDelete.id) {
        await deleteGoogleCalendarEvent(token, meetingToDelete.id);
      }
      setMeetings(prev => prev.filter(m => m.id !== meetingToDelete.id));
      setSuccessMsg(`Cancelled meeting "${meetingToDelete.title}".`);
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      console.error('Delete meeting error:', err);
      setErrorMsg(`Could not cancel meeting: ${err.message}`);
    } finally {
      setLoading(false);
      setMeetingToDelete(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccessMsg('Meeting link copied to clipboard!');
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-teal-950/60 via-emerald-950/40 to-slate-900 border border-teal-500/30 p-6 rounded-3xl backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-teal-500 via-emerald-600 to-cyan-700 text-white shadow-lg shadow-teal-500/30">
            <Video className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white tracking-tight">Google Meet Center</h1>
              {isAuthenticated ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-extrabold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  OAuth Connected
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-extrabold flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Preview Mode
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">Start instant video conferences, schedule Google Meet calls, and copy meeting links</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {!isAuthenticated && (
            <button
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSigningIn ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
              <span>Authorize Google Meet</span>
            </button>
          )}

          <button
            id="btn-create-instant-meet"
            onClick={handleCreateInstantMeeting}
            disabled={loading}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-black text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Video className="w-4 h-4" />
            <span>Start Instant Meeting</span>
          </button>

          <button
            onClick={() => setShowScheduleModal(true)}
            className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 font-bold text-xs transition-all flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule Call</span>
          </button>
        </div>
      </div>

      {/* Status Toasts */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Instant Meeting Active Banner */}
      {activeInstantMeeting && (
        <div className="bg-gradient-to-r from-teal-900/80 via-emerald-900/80 to-slate-900 border border-emerald-400 p-5 rounded-3xl backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl animate-fade-in">
          <div className="space-y-1">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Instant Google Meet Ready</span>
            </div>
            <div className="text-sm font-extrabold text-white">{activeInstantMeeting.meetingUri}</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(activeInstantMeeting.meetingUri || '')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Link</span>
            </button>
            <a
              href={activeInstantMeeting.meetingUri}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Join Now</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Scheduled Meetings List */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal-400" />
          <span>Upcoming Google Meet Calls</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meetings.map(meet => (
            <div
              key={meet.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-teal-500/40 p-5 rounded-3xl backdrop-blur-xl transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[10px] font-bold flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    Google Meet
                  </span>
                  <button
                    onClick={() => setMeetingToDelete(meet)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Cancel Meeting"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-sm font-extrabold text-white">{meet.title}</h3>
                {meet.description && (
                  <p className="text-xs text-slate-400 line-clamp-2">{meet.description}</p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-400" />
                  <span>{new Date(meet.startTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                {meet.locationOrUrl && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => copyToClipboard(meet.locationOrUrl!)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="Copy Link"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={meet.locationOrUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/40 text-teal-300 text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <span>Join Call</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Meeting Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-teal-500/30 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-400">
                  <Video className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">Schedule Google Meet</h3>
                  <p className="text-xs text-slate-400">Generates Google Calendar event with video link</p>
                </div>
              </div>
              <button onClick={() => setShowScheduleModal(false)} className="text-slate-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Meeting Title</label>
                <input
                  type="text"
                  required
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  placeholder="e.g. Q3 Partnership Sync"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Start Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Description (Optional)</label>
                <textarea
                  rows={3}
                  value={meetingDesc}
                  onChange={(e) => setMeetingDesc(e.target.value)}
                  placeholder="Agenda points or video call guidelines..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white text-xs font-bold shadow-md"
                >
                  Schedule Google Meet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mandatory Delete Confirmation Modal */}
      {meetingToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">Cancel Google Meet Event?</h3>
                <p className="text-xs text-slate-400 mt-0.5">This will remove the event from your Google Calendar.</p>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold text-white truncate">
              {meetingToDelete.title}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setMeetingToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Keep Event
              </button>
              <button
                type="button"
                onClick={confirmDeleteMeeting}
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md"
              >
                Cancel Meeting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MOCK_INITIAL_MEETINGS: CalendarEvent[] = [
  {
    id: 'meet-1',
    title: 'Horizon VC Seed Investment Round Intro',
    description: 'Discussion with Sarah Johnson regarding WIHGO AI seed investment round.',
    type: 'meeting',
    platform: 'meet',
    startTime: '2026-08-12T14:00:00',
    endTime: '2026-08-12T14:45:00',
    locationOrUrl: 'https://meet.google.com/wih-vc-demo'
  },
  {
    id: 'meet-2',
    title: 'WIHGO Product Demo & Technical Review',
    description: 'Live demonstration of cross-channel messaging and Google Workspace integrations.',
    type: 'meeting',
    platform: 'meet',
    startTime: '2026-08-13T10:00:00',
    endTime: '2026-08-13T10:30:00',
    locationOrUrl: 'https://meet.google.com/wih-tech-sync'
  }
];
