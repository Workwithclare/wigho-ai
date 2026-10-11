"use client";

import React, { useState, useEffect } from 'react';
import { PlatformInfo, PlatformId, UserProfile } from '../../../lib/wihgo/types';
import {
  X,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  Key,
  Lock,
  RefreshCw,
  Unlink,
  Mail,
  Calendar,
  HardDrive,
  Video,
  Camera,
  ThumbsUp,
  Music2,
  Briefcase,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Layers,
  AlertTriangle,
  Info,
  HelpCircle,
  Server
} from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { signInWithGoogleOAuth } from '../../../lib/wihgo/demoBackend';
import { 
  requestGoogleWorkspaceAuth, 
  disconnectGmail, 
  getGoogleAccessToken,
  GMAIL_ONLY_SCOPES,
  DEFAULT_WORKSPACE_SCOPES
} from '../../../lib/wihgo/demoBackend';
import { saveConnectionRecord, createNotificationAndActivity } from '../../../lib/wihgo/demoBackend';

export type ConnectorStatusType = 
  | 'NOT CONNECTED' 
  | 'CONNECTING' 
  | 'CONNECTED' 
  | 'ACCESS REQUIRED' 
  | 'ERROR' 
  | 'RECONNECT REQUIRED';

interface PlatformConnectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: PlatformInfo | null;
  user?: UserProfile;
  onStatusChange?: (platformId: PlatformId, newStatus: ConnectorStatusType, accountHandle?: string) => void;
  onOpenWorkspace?: (platformId: PlatformId) => void;
  onRequestAuth?: (mode: 'login' | 'signup', pendingPlatformId?: PlatformId) => void;
}

export const PlatformConnectorModal: React.FC<PlatformConnectorModalProps> = ({
  isOpen,
  onClose,
  platform,
  user,
  onStatusChange,
  onOpenWorkspace,
  onRequestAuth
}) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [localStatus, setLocalStatus] = useState<ConnectorStatusType | null>(null);

  useEffect(() => {
    setErrorMessage(null);
    setNoticeMessage(null);
    setLocalStatus(null);
    setIsProcessing(false);
  }, [platform?.id, isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !platform) return null;

  // Determine active status:
  const currentEffectiveStatus: ConnectorStatusType = 
    localStatus ||
    (isProcessing ? 'CONNECTING' : null) ||
    platform.statusOverride ||
    (platform.connected ? 'CONNECTED' : 'NOT CONNECTED');

  const renderIcon = (id: PlatformId, className: string) => {
    switch (id) {
      case 'whatsapp': return <WhatsAppIcon className={className} />;
      case 'instagram': return <Camera className={`${className} text-pink-400`} />;
      case 'facebook': return <ThumbsUp className={`${className} text-blue-400`} />;
      case 'tiktok': return <Music2 className={`${className} text-cyan-400`} />;
      case 'linkedin': return <Briefcase className={`${className} text-sky-400`} />;
      case 'email': return <Mail className={`${className} text-rose-400`} />;
      case 'calendar': return <Calendar className={`${className} text-teal-400`} />;
      case 'drive': return <HardDrive className={`${className} text-emerald-400`} />;
      case 'meet': return <Video className={`${className} text-teal-400`} />;
      default: return <MessageSquare className={className} />;
    }
  };

  const getPlatformDetails = () => {
    switch (platform.id) {
      case 'email':
        return {
          title: 'Gmail & Business Email',
          subtitle: 'Google Workspace Gmail API',
          headline: 'Direct Google OAuth authorization for synchronized inbox, real-time message summaries, and smart drafting.',
          authType: 'Google OAuth 2.0 (Gmail API)',
          permissions: ['https://mail.google.com/', 'https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send', 'Read & Send Messages', 'Thread Sync'],
          scopeNote: 'Secured via standard Google Identity Services and Supabase OAuth token exchange.',
          setupRequirements: 'Requires Google OAuth consent screen & enabled Gmail scopes in your Google Cloud / Supabase project.'
        };
      case 'whatsapp':
        return {
          title: 'WhatsApp Business',
          subtitle: 'Meta WhatsApp Cloud API v20.0',
          headline: 'Official Meta WhatsApp Business Cloud API integration for client conversations, catalogs, and automated customer messaging.',
          authType: 'Meta WhatsApp Cloud API v20.0',
          permissions: ['whatsapp_business_messaging', 'whatsapp_business_management', 'business_management'],
          scopeNote: 'Direct API connection using Meta Developer App access tokens and Webhooks.',
          setupRequirements: 'Requires verified WhatsApp Business Account (WABA), registered Meta phone number ID, and System User Access Token.'
        };
      case 'instagram':
        return {
          title: 'Instagram Business',
          subtitle: 'Meta Graph API v20.0 (Instagram)',
          headline: 'Official Instagram Graph API connection for direct messaging, comment replies, story mentions, and creator feeds.',
          authType: 'Meta Graph API v20.0 (Instagram Graph)',
          permissions: ['instagram_basic', 'instagram_manage_messages', 'instagram_manage_comments', 'pages_show_list'],
          scopeNote: 'Official Meta Graph API OAuth token authorization for connected Instagram accounts.',
          setupRequirements: 'Requires Instagram Professional/Creator account connected to a Facebook Business Page and Meta Developer App authorization.'
        };
      case 'facebook':
        return {
          title: 'Facebook Messenger',
          subtitle: 'Meta Graph API v20.0 (Messenger)',
          headline: 'Official Facebook Messenger & Business Page API connection for inquiries, customer lead alerts, and thread synchronization.',
          authType: 'Meta Graph API v20.0 (Pages Messaging)',
          permissions: ['pages_messaging', 'pages_read_engagement', 'pages_manage_metadata', 'pages_show_list'],
          scopeNote: 'Encrypted Page Access Token and Webhook subscription via Meta Developer Platform.',
          setupRequirements: 'Requires Facebook Page Administrator rights and Meta Developer App review approval.'
        };
      case 'tiktok':
        return {
          title: 'TikTok Business',
          subtitle: 'TikTok Login Kit & Business Open API',
          headline: 'Official TikTok Business Open API connection for direct creator messages, video comments, and commercial inbox synchronization.',
          authType: 'TikTok Business Open API & Login Kit',
          permissions: ['user.info.basic', 'video.list', 'dm.read', 'dm.send', 'business.messaging'],
          scopeNote: 'OAuth 2.0 PKCE token handshake with TikTok Developer Center.',
          setupRequirements: 'Requires TikTok Developer Account, registered TikTok App Client Key/Secret, and verified Business Account.'
        };
      case 'linkedin':
        return {
          title: 'LinkedIn Enterprise',
          subtitle: 'LinkedIn OAuth 2.0 & Community API',
          headline: 'Official LinkedIn integration for InMail communication, connection requests, company page leads, and professional engagement.',
          authType: 'LinkedIn OAuth 2.0 & Community Management API',
          permissions: ['r_liteprofile', 'r_emailaddress', 'w_member_social', 'rw_organization_admin'],
          scopeNote: 'Official 3-legged OAuth 2.0 authorization with LinkedIn Developer Services.',
          setupRequirements: 'Requires verified LinkedIn Company Page, Client ID & Secret from LinkedIn Developer Portal.'
        };
      case 'calendar':
        return {
          title: 'Google Calendar',
          subtitle: 'Google Workspace Calendar API v3',
          headline: 'Synchronize business events, client schedule appointments, and meeting invitations with WIHGO AI Daily Brief.',
          authType: 'Google Workspace Calendar API v3',
          permissions: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events', 'Read/Write Calendar Events'],
          scopeNote: 'Integrated via Google OAuth authorization token.',
          setupRequirements: 'Requires Google Account sign-in with calendar access permissions.'
        };
      case 'drive':
        return {
          title: 'Google Drive',
          subtitle: 'Google Drive API v3',
          headline: 'Access documents, contract files, and cloud storage assets directly from your WIHGO Business Workspace.',
          authType: 'Google Drive API v3',
          permissions: ['https://www.googleapis.com/auth/drive.readonly', 'https://www.googleapis.com/auth/drive.file', 'File Metadata Access'],
          scopeNote: 'Secured Google Cloud token authorization.',
          setupRequirements: 'Requires Google Account sign-in with Google Drive permissions.'
        };
      case 'meet':
        return {
          title: 'Google Meet',
          subtitle: 'Google Meet & Calendar Conference API',
          headline: 'Instantly generate video meeting spaces, share call links with clients, and optimize your virtual meeting schedule.',
          authType: 'Google Meet & Calendar Conference API',
          permissions: ['https://www.googleapis.com/auth/meetings.space.created', 'Instant Conference Link Generation'],
          scopeNote: 'Direct Google Workspace conference integration.',
          setupRequirements: 'Requires Google Account with Google Meet capability.'
        };
      default:
        return {
          title: platform.name,
          subtitle: `${platform.name} Integration`,
          headline: `Connect your official ${platform.name} account to WIHGO AI Hub.`,
          authType: 'Official API Integration',
          permissions: platform.capabilities || ['Read & Write Messages'],
          scopeNote: 'Official protocol access token authorization.',
          setupRequirements: `Requires valid ${platform.name} API developer credentials and permissions.`
        };
    }
  };

  const details = getPlatformDetails();

  const handleConnectAction = async () => {
    setErrorMessage(null);
    setNoticeMessage(null);

    // CASE 1 — USER IS NOT LOGGED INTO WIHGO
    if (!user?.id || user.id === 'default') {
      setIsProcessing(false);
      if (onRequestAuth) {
        onRequestAuth('login', platform.id);
      }
      onClose();
      return;
    }

    setIsProcessing(true);

    try {
      // 1. GMAIL / GOOGLE CALENDAR / DRIVE / MEET (Official Google Workspace OAuth)
      if (['email', 'calendar', 'drive', 'meet'].includes(platform.id)) {
        try {
          const scopes = platform.id === 'email' ? GMAIL_ONLY_SCOPES : DEFAULT_WORKSPACE_SCOPES;
          const { profile } = await requestGoogleWorkspaceAuth(scopes);
          setLocalStatus('CONNECTED');
          setNoticeMessage(`Successfully connected to ${profile.emailAddress}! Official ${platform.name} integration is active and verified.`);
          setIsProcessing(false);
          
          if (user?.id && user.id !== 'default') {
            await saveConnectionRecord({
              userId: user.id,
              platformId: platform.id,
              accountName: profile.emailAddress,
              accountHandle: profile.emailAddress,
              status: 'CONNECTED',
              lastSynced: new Date().toISOString()
            });
            await createNotificationAndActivity(user.id, {
              title: `${platform.name} Connected`,
              message: `Authorized ${profile.emailAddress} with WIHGO AI Connect Hub.`,
              platform: platform.id,
              type: 'connector',
              status: 'success'
            });
          }

          if (onStatusChange) {
            onStatusChange(platform.id, 'CONNECTED', profile.emailAddress);
          }
          return;
        } catch (oauthErr: any) {
          setIsProcessing(false);
          const msg = oauthErr?.message || '';
          if (msg.includes('closed') || msg.includes('cancelled')) {
            setLocalStatus('NOT CONNECTED');
            setNoticeMessage('Google authorization window was closed. Click Connect below whenever you are ready to authorize.');
          } else {
            setLocalStatus('ERROR');
            setErrorMessage(msg || 'Connection failed. Please try again.');
            if (onStatusChange) onStatusChange(platform.id, 'ERROR');
          }
          return;
        }
      }

      // 2. INSTAGRAM
      if (platform.id === 'instagram') {
        setTimeout(() => {
          setIsProcessing(false);
          setLocalStatus('ACCESS REQUIRED');
          setErrorMessage('Connection not configured yet. Official Meta Graph API authorization requires an approved Meta Developer App and connected Instagram Professional account.');
          if (onStatusChange) onStatusChange('instagram', 'ACCESS REQUIRED');
        }, 500);
        return;
      }

      // 4. WHATSAPP
      if (platform.id === 'whatsapp') {
        setTimeout(() => {
          setIsProcessing(false);
          setLocalStatus('ACCESS REQUIRED');
          setErrorMessage('Connection not configured yet. Official WhatsApp Business Cloud API requires verified WABA account credentials and a registered phone number ID.');
          if (onStatusChange) onStatusChange('whatsapp', 'ACCESS REQUIRED');
        }, 500);
        return;
      }

      // 5. TIKTOK
      if (platform.id === 'tiktok') {
        setTimeout(() => {
          setIsProcessing(false);
          setLocalStatus('ACCESS REQUIRED');
          setErrorMessage('Connection not configured yet. TikTok Business Open API credentials and TikTok Login Kit client configuration are required.');
          if (onStatusChange) onStatusChange('tiktok', 'ACCESS REQUIRED');
        }, 500);
        return;
      }

      // 6. LINKEDIN
      if (platform.id === 'linkedin') {
        setTimeout(() => {
          setIsProcessing(false);
          setLocalStatus('ACCESS REQUIRED');
          setErrorMessage('Connection not configured yet. LinkedIn OAuth 2.0 client credentials and Community Management API permissions are required.');
          if (onStatusChange) onStatusChange('linkedin', 'ACCESS REQUIRED');
        }, 500);
        return;
      }

      // 7. FACEBOOK
      if (platform.id === 'facebook') {
        setTimeout(() => {
          setIsProcessing(false);
          setLocalStatus('ACCESS REQUIRED');
          setErrorMessage('Connection not configured yet. Facebook Pages Messaging requires Meta Graph API permissions and Page Administrator token.');
          if (onStatusChange) onStatusChange('facebook', 'ACCESS REQUIRED');
        }, 500);
        return;
      }

      // Fallback
      setTimeout(() => {
        setIsProcessing(false);
        setLocalStatus('ACCESS REQUIRED');
        setErrorMessage(`Connection not configured yet. ${platform.name} official authorization credentials are required.`);
        if (onStatusChange) onStatusChange(platform.id, 'ACCESS REQUIRED');
      }, 500);
    } catch (err: any) {
      setIsProcessing(false);
      setLocalStatus('ERROR');
      setErrorMessage(err?.message || 'Could not initiate connection.');
      if (onStatusChange) onStatusChange(platform.id, 'ERROR');
    }
  };

  const handleDisconnectAction = async () => {
    if (['email', 'calendar', 'drive', 'meet'].includes(platform.id)) {
      await disconnectGmail();
    }
    setLocalStatus('NOT CONNECTED');
    setErrorMessage(null);
    setNoticeMessage(`${platform.name} connector has been disconnected.`);

    if (user?.id && user.id !== 'default') {
      await saveConnectionRecord({
        userId: user.id,
        platformId: platform.id,
        status: 'disconnected',
        lastSynced: new Date().toISOString()
      });
      await createNotificationAndActivity(user.id, {
        title: `${platform.name} Disconnected`,
        message: `${platform.name} authorization has been disconnected.`,
        platform: platform.id,
        type: 'connector',
        status: 'info'
      });
    }

    if (onStatusChange) {
      onStatusChange(platform.id, 'NOT CONNECTED');
    }
  };

  const handleReconnectAction = () => {
    handleConnectAction();
  };

  const isConnected = currentEffectiveStatus === 'CONNECTED';
  const isAccessRequired = currentEffectiveStatus === 'ACCESS REQUIRED';
  const isError = currentEffectiveStatus === 'ERROR';
  const isReconnectRequired = currentEffectiveStatus === 'RECONNECT REQUIRED';
  const isConnecting = currentEffectiveStatus === 'CONNECTING';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        id="platform-connector-modal"
        className="bg-[#0B0F19] border border-cyan-500/30 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-[0_0_60px_rgba(6,182,212,0.25)] relative max-h-[90vh] overflow-y-auto"
      >
        {/* Top Header Buttons */}
        <div className="flex items-center justify-between pb-1">
          <button
            id="btn-back-connector-modal"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            id="btn-close-connector-modal"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Header with Icon, Title & Status Badge */}
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md shrink-0">
            {renderIcon(platform.id, 'w-8 h-8')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-black text-white tracking-tight">{details.title}</h2>
              
              {/* REAL CONNECTION STATE BADGES */}
              {isConnected && (
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  CONNECTED
                </span>
              )}
              {isConnecting && (
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
                  CONNECTING
                </span>
              )}
              {isAccessRequired && (
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full text-amber-300 bg-amber-500/10 border border-amber-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  ACCESS REQUIRED
                </span>
              )}
              {isError && (
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full text-rose-400 bg-rose-500/10 border border-rose-500/30 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-rose-400" />
                  ERROR
                </span>
              )}
              {isReconnectRequired && (
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full text-orange-400 bg-orange-500/10 border border-orange-500/30 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 text-orange-400" />
                  RECONNECT REQUIRED
                </span>
              )}
              {currentEffectiveStatus === 'NOT CONNECTED' && (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full text-slate-400 bg-slate-800 border border-slate-700">
                  NOT CONNECTED
                </span>
              )}
            </div>
            <p className="text-[11px] text-cyan-400 font-mono mt-0.5">{details.subtitle}</p>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{details.headline}</p>
          </div>
        </div>

        {/* Error / Diagnostic Message Banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-white">Requirement Notice</p>
              <p className="leading-relaxed text-slate-300">{errorMessage}</p>
            </div>
          </div>
        )}

        {noticeMessage && (
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-white">Status Update</p>
              <p className="leading-relaxed text-slate-300">{noticeMessage}</p>
            </div>
          </div>
        )}

        {/* Connection Specs & Scope Box */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400 font-medium">Protocol & Version</span>
            <span className="font-mono text-cyan-300 font-bold">{details.authType}</span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400 font-medium">Connection State</span>
            <span className={`font-bold ${
              isConnected ? 'text-emerald-400' :
              isAccessRequired ? 'text-amber-300' :
              isError ? 'text-rose-400' :
              isReconnectRequired ? 'text-orange-400' :
              isConnecting ? 'text-cyan-300' : 'text-slate-400'
            }`}>
              {currentEffectiveStatus}
            </span>
          </div>

          {platform.accountHandle && isConnected && (
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400 font-medium">Authorized Identity</span>
              <span className="font-mono text-slate-200">{platform.accountHandle}</span>
            </div>
          )}

          {/* Setup Requirements Guidance */}
          <div className="space-y-1 pt-1">
            <span className="text-slate-400 font-medium block">Access & Authorization Requirements:</span>
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
              {details.setupRequirements}
            </div>
          </div>

          {/* Requested Capabilities */}
          <div className="space-y-1.5 pt-1">
            <span className="text-slate-400 font-medium block">Requested Permissions & Scopes:</span>
            <div className="flex flex-wrap gap-1.5">
              {details.permissions.map((perm, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700/80 text-[11px] text-slate-300 font-mono">
                  {perm}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{details.scopeNote}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            id="btn-connector-cancel"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isConnected && (
              <>
                {onOpenWorkspace && (
                  <button
                    id={`btn-open-workspace-${platform.id}`}
                    onClick={() => {
                      onOpenWorkspace(platform.id);
                      onClose();
                    }}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-cyan-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Open Workspace</span>
                  </button>
                )}

                <button
                  id={`btn-disconnect-${platform.id}`}
                  onClick={handleDisconnectAction}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <Unlink className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              </>
            )}

            {(isError || isReconnectRequired) && (
              <button
                id={`btn-reconnect-${platform.id}`}
                onClick={handleReconnectAction}
                disabled={isProcessing}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:opacity-95 text-slate-950 text-xs font-extrabold shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                <span>Reconnect {platform.name}</span>
              </button>
            )}

            {!isConnected && !isReconnectRequired && !isError && (
              <button
                id={`btn-connect-${platform.id}`}
                onClick={handleConnectAction}
                disabled={isProcessing}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs font-extrabold shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Authorizing...</span>
                  </>
                ) : (
                  <>
                    <Key className="w-3.5 h-3.5" />
                    <span>Connect {platform.name}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
