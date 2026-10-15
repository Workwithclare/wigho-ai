"use client";

// Demo offline backend — local mock data for the clickable demo (no backend calls).
// Everything is any-typed on purpose: legacy screens expect rich shapes; demo returns safe empties.

import { INITIAL_USER_PROFILE } from './mockData';
import type { UserProfile } from './types';

const demoUser = (email?: string): UserProfile => ({
  ...INITIAL_USER_PROFILE,
  id: 'clare-demo',
  name: 'Clare',
  email: email || INITIAL_USER_PROFILE.email || 'clare@wihgo.ai',
});

export async function signUpWithEmail(..._a: any[]): Promise<any> {
  return { data: { user: demoUser(), session: null }, error: null, user: demoUser() };
}
export async function signInWithEmail(..._a: any[]): Promise<any> {
  return { data: { user: demoUser(), session: null }, error: null, user: demoUser() };
}
export async function resetPasswordForEmail(..._a: any[]): Promise<any> {
  return { data: {}, error: null };
}
export async function updateUserPassword(..._a: any[]): Promise<any> {
  return { data: {}, error: null };
}
export async function signInWithGoogleOAuth(..._a: any[]): Promise<any> {
  return { data: { user: demoUser() }, user: demoUser(), error: null };
}
export async function signInWithGitHubOAuth(..._a: any[]): Promise<any> {
  return { data: { user: demoUser() }, user: demoUser(), error: null };
}
export async function signInWithAppleOAuth(..._a: any[]): Promise<any> {
  return { data: { user: demoUser() }, user: demoUser(), error: null };
}
export async function signInWithSocialOAuth(..._a: any[]): Promise<any> {
  return { data: { user: demoUser() }, user: demoUser(), error: null };
}
export async function syncUserProfile(u: any): Promise<any> {
  return demoUser(u?.email);
}
export async function saveUserProfile(u: any): Promise<any> {
  try { localStorage.setItem('wihgo_profile_clare-demo', JSON.stringify(u)); } catch {}
  return u;
}
export function createDefaultUserProfile(..._a: any[]): any {
  const [id, email] = _a;
  return { ...demoUser(email), id: id || 'clare-demo', identities: [] };
}
export async function uploadAvatarImage(..._a: any[]): Promise<any> {
  return '';
}
export async function removeAvatarImage(..._a: any[]): Promise<any> {
  return { error: null };
}

export async function saveConnectionRecord(..._a: any[]): Promise<any> { return { error: null }; }
export async function createNotificationAndActivity(..._a: any[]): Promise<any> { return { error: null }; }
export async function submitConnectorRequest(..._a: any[]): Promise<any> { return { ok: true }; }

export const GMAIL_ONLY_SCOPES: any = [];
export const DEFAULT_WORKSPACE_SCOPES: any = [];
export async function requestGoogleWorkspaceAuth(..._a: any[]): Promise<any> {
  return { ok: false, demo: true, profile: null, accessToken: null };
}
export async function disconnectGmail(..._a: any[]): Promise<any> { return { ok: true }; }
export function getGoogleAccessToken(..._a: any[]): any { return null; }
export async function getGoogleAccessTokenAsync(..._a: any[]): Promise<any> { return null; }
export async function googleSignIn(..._a: any[]): Promise<any> {
  return { ok: false, demo: true, user: null, accessToken: null };
}
export async function googleLogout(..._a: any[]): Promise<any> { return { ok: true }; }
export function initAuth(..._a: any[]): any { return () => {}; }
export function getAccessToken(..._a: any[]): any { return null; }
export async function fetchGoogleCalendarEvents(..._a: any[]): Promise<any> { return []; }
export async function createGoogleCalendarEvent(..._a: any[]): Promise<any> { return _a[0] || _a[1] || { id: `evt-${Date.now()}` }; }
export async function deleteGoogleCalendarEvent(..._a: any[]): Promise<any> { return { ok: true }; }
export async function fetchGmailInbox(..._a: any[]): Promise<any> {
  return { messages: [], profile: null };
}
export async function fetchGoogleDriveFiles(..._a: any[]): Promise<any> { return []; }
export async function uploadGoogleDriveFile(..._a: any[]): Promise<any> { return { ok: false, demo: true, id: `file-${Date.now()}`, name: 'demo' }; }
export async function createGoogleDriveFolder(..._a: any[]): Promise<any> {
  return { id: `folder-${Date.now()}`, name: _a[0] || 'Untitled' };
}
export async function deleteGoogleDriveFile(..._a: any[]): Promise<any> { return { ok: true }; }
export async function createGoogleMeetSpace(..._a: any[]): Promise<any> {
  return { id: `meet-${Date.now()}`, meetingUri: 'https://meet.google.com/demo' };
}
export async function scheduleGoogleMeetCall(..._a: any[]): Promise<any> {
  return { id: `meet-${Date.now()}`, meetingUri: 'https://meet.google.com/demo' };
}

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType?: string;
  modifiedTime?: string;
  webViewLink?: string;
  thumbnailLink?: string;
  size?: string | number;
  [k: string]: any;
}
export interface MeetSpaceItem {
  id: string;
  name?: string;
  uri?: string;
  meetingUri?: string;
  [k: string]: any;
}
export interface GmailMessageItem {
  id: string;
  subject: string;
  from: string;
  snippet: string;
  date: string;
  fromName?: string;
  fromEmail?: string;
  bodyText?: string;
  dateStr?: string;
  isUnread?: boolean;
  isStarred?: boolean;
  isImportant?: boolean;
  labelIds?: string[];
  [k: string]: any;
}
export interface GmailProfile {
  emailAddress: string;
  messagesTotal?: number;
  [k: string]: any;
}
