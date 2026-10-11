"use client";

import React, { useState } from 'react';
import {
  X,
  Check,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
  Mail,
  Calendar as CalendarIcon,
  Video,
  HardDrive,
  FileText,
  Table,
  Presentation,
  FileSpreadsheet,
  CheckCircle2,
  Lock,
  Sparkles,
  Sliders,
  Layers,
  ArrowRight
} from 'lucide-react';
import { PlatformInfo, PlatformId } from '../../../lib/wihgo/types';

interface GoogleWorkspaceGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  platforms?: PlatformInfo[];
  onOpenWorkspace?: (platformId: string) => void;
  onToggleService?: (serviceId: string, connected: boolean) => void;
}

interface GoogleServiceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  connected: boolean;
  statusText: string;
  syncFrequency: string;
  permissions: string[];
  capabilities: string[];
  platformId?: PlatformId;
}

export const GoogleWorkspaceGroupModal: React.FC<GoogleWorkspaceGroupModalProps> = ({
  isOpen,
  onClose,
  platforms = [],
  onOpenWorkspace,
  onToggleService
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'connected' | 'security'>('all');
  const [selectedService, setSelectedService] = useState<GoogleServiceItem | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  // Determine connected state based on passed platforms
  const isGmailConnected = platforms.find(p => p.id === 'email')?.connected ?? true;
  const isCalendarConnected = platforms.find(p => p.id === 'calendar')?.connected ?? true;
  const isDriveConnected = platforms.find(p => p.id === 'drive')?.connected ?? true;
  const isMeetConnected = platforms.find(p => p.id === 'meet')?.connected ?? true;

  const [serviceStates, setServiceStates] = useState<Record<string, boolean>>({
    gmail: isGmailConnected,
    calendar: isCalendarConnected,
    meet: isMeetConnected,
    drive: isDriveConnected,
    docs: true,
    sheets: true,
    slides: false,
    forms: false
  });

  if (!isOpen) return null;

  const googleServices: GoogleServiceItem[] = [
    {
      id: 'gmail',
      platformId: 'email',
      name: 'Gmail',
      category: 'Email & Communication',
      description: 'Unified inbox sync, priority email detection, and AI-assisted professional draft replies.',
      icon: Mail,
      color: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      connected: serviceStates.gmail,
      statusText: serviceStates.gmail ? 'OAuth2 Synced' : 'Ready to Connect',
      syncFrequency: 'Real-time Push Webhook',
      permissions: ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.compose'],
      capabilities: ['Read incoming emails', 'Draft AI replies in thread', 'Label priority business leads']
    },
    {
      id: 'calendar',
      platformId: 'calendar',
      name: 'Google Calendar',
      category: 'Scheduling & Meetings',
      description: 'Bi-directional schedule sync, client appointment bookings, and smart agenda prep.',
      icon: CalendarIcon,
      color: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
      connected: serviceStates.calendar,
      statusText: serviceStates.calendar ? 'Live Calendar Link' : 'Ready to Connect',
      syncFrequency: '5-minute Polling + Webhooks',
      permissions: ['https://www.googleapis.com/auth/calendar.events', 'https://www.googleapis.com/auth/calendar.readonly'],
      capabilities: ['Check availability conflict', 'Schedule client meetings from chat', 'Calendar event reminders']
    },
    {
      id: 'meet',
      platformId: 'meet',
      name: 'Google Meet',
      category: 'Video Conferencing',
      description: 'One-click meeting link generation, client call briefings, and automated agenda distribution.',
      icon: Video,
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      connected: serviceStates.meet,
      statusText: serviceStates.meet ? 'Active Integration' : 'Ready to Connect',
      syncFrequency: 'On-demand Link Provisioning',
      permissions: ['https://www.googleapis.com/auth/calendar.events'],
      capabilities: ['Generate instant Meet URLs', 'Attach Meet links to WhatsApp/Email', 'Meeting recap prep']
    },
    {
      id: 'drive',
      platformId: 'drive',
      name: 'Google Drive',
      category: 'Cloud Storage & Files',
      description: 'Access business collateral, proposals, customer files, and shared team folders securely.',
      icon: HardDrive,
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      connected: serviceStates.drive,
      statusText: serviceStates.drive ? 'Storage Mounted' : 'Ready to Connect',
      syncFrequency: 'Continuous Sync',
      permissions: ['https://www.googleapis.com/auth/drive.readonly', 'https://www.googleapis.com/auth/drive.file'],
      capabilities: ['Search business documents', 'Attach Drive assets to chat', 'Index PDF briefs with AI']
    },
    {
      id: 'docs',
      name: 'Google Docs',
      category: 'Document Creation',
      description: 'Generate client proposals, contracts, meeting notes, and summaries directly in Google Docs format.',
      icon: FileText,
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      connected: serviceStates.docs,
      statusText: serviceStates.docs ? 'Document Pipeline Active' : 'Ready to Connect',
      syncFrequency: 'Direct API v1',
      permissions: ['https://www.googleapis.com/auth/documents'],
      capabilities: ['Create new Google Docs from AI output', 'Export meeting minutes', 'Shared team templates']
    },
    {
      id: 'sheets',
      name: 'Google Sheets',
      category: 'Spreadsheets & Data',
      description: 'Log new customer leads, export weekly social analytics, and sync inventory tables in real time.',
      icon: Table,
      color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      connected: serviceStates.sheets,
      statusText: serviceStates.sheets ? 'Sheet Stream Active' : 'Ready to Connect',
      syncFrequency: 'Real-time Row Appends',
      permissions: ['https://www.googleapis.com/auth/spreadsheets'],
      capabilities: ['Append customer inquiries to CRM sheet', 'Export performance metrics', 'Read lookup data']
    },
    {
      id: 'slides',
      name: 'Google Slides',
      category: 'Presentations',
      description: 'Generate pitch decks, client presentation outlines, and quarterly business review slide decks.',
      icon: Presentation,
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      connected: serviceStates.slides,
      statusText: serviceStates.slides ? 'Deck Generator Linked' : 'Ready to Connect',
      syncFrequency: 'On-demand Generation',
      permissions: ['https://www.googleapis.com/auth/presentations'],
      capabilities: ['Create slide templates from AI outlines', 'Export social media reports as slides']
    },
    {
      id: 'forms',
      name: 'Google Forms',
      category: 'Lead Capture & Surveys',
      description: 'Receive customer feedback survey responses and client onboarding forms directly into WIHGO Hub.',
      icon: FileSpreadsheet,
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      connected: serviceStates.forms,
      statusText: serviceStates.forms ? 'Response Webhook Active' : 'Ready to Connect',
      syncFrequency: 'Real-time Webhook',
      permissions: ['https://www.googleapis.com/auth/forms.responses.readonly'],
      capabilities: ['Instant notification on new form submissions', 'AI triage of client survey inputs']
    }
  ];

  const handleToggle = (serviceId: string) => {
    const newState = !serviceStates[serviceId];
    setServiceStates(prev => ({
      ...prev,
      [serviceId]: newState
    }));
    if (onToggleService) {
      onToggleService(serviceId, newState);
    }
  };

  const handleSync = (serviceId: string) => {
    setSyncingId(serviceId);
    setTimeout(() => {
      setSyncingId(null);
    }, 1200);
  };

  const connectedCount = Object.values(serviceStates).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-[#0C1420] to-[#0A1018] border border-teal-500/40 rounded-3xl shadow-2xl shadow-teal-950/50 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-teal-500 to-emerald-500 p-0.5 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Layers className="w-6 h-6 text-teal-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">Google Workspace</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[10px] font-extrabold uppercase tracking-wide">
                  Enterprise Suite
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Unified Google Services connector • {connectedCount} of 8 services active
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-6 pt-4 border-b border-slate-800/60 bg-slate-950/30 flex items-center gap-3">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'all'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            All Google Services (8)
          </button>
          <button
            onClick={() => setActiveTab('connected')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'connected'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Active Services ({connectedCount})
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'security'
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            OAuth Security & Scopes
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {activeTab === 'security' ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-teal-200">Official Google Cloud Identity & OAuth 2.0</div>
                  <div className="text-slate-300 leading-relaxed">
                    WIHGO AI accesses Google Workspace APIs via user-consented OAuth tokens. Secrets are never exposed to third-party endpoints. You can revoke access at any time directly through Google Account Security.
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {googleServices.map(srv => (
                  <div key={srv.id} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2">
                      <srv.icon className="w-4 h-4 text-teal-400" />
                      <span className="text-xs font-bold text-white">{srv.name} Scopes</span>
                    </div>
                    <div className="space-y-1">
                      {srv.permissions.map((perm, idx) => (
                        <div key={idx} className="font-mono text-[10px] text-slate-400 bg-slate-950 p-1.5 rounded-lg border border-slate-800/80 truncate">
                          {perm}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {googleServices
                .filter(srv => activeTab === 'all' || (activeTab === 'connected' && srv.connected))
                .map((srv) => {
                  const Icon = srv.icon;
                  const isSyncing = syncingId === srv.id;

                  return (
                    <div
                      key={srv.id}
                      className={`p-4 rounded-2xl bg-slate-900/80 border transition-all space-y-3 flex flex-col justify-between ${
                        srv.connected
                          ? 'border-teal-500/30 hover:border-teal-400/60'
                          : 'border-slate-800/80 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="space-y-2.5">
                        {/* Top: Icon + Name + Toggle */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${srv.color}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white">{srv.name}</h4>
                              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                {srv.category}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {srv.connected ? (
                              <button
                                onClick={() => handleToggle(srv.id)}
                                className="px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/40 text-teal-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer hover:bg-teal-500/20 transition-colors"
                                title="Click to disconnect"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                                <span>Connected</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleToggle(srv.id)}
                                className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-bold hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
                              >
                                Connect
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                          {srv.description}
                        </p>

                        {/* Capabilities Bullet Pills */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {srv.capabilities.slice(0, 2).map((cap, cIdx) => (
                            <span key={cIdx} className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] text-slate-400">
                              ✓ {cap}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono text-slate-500 truncate">
                          {srv.syncFrequency}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {srv.connected && (
                            <button
                              onClick={() => handleSync(srv.id)}
                              disabled={isSyncing}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
                              title="Sync Now"
                            >
                              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-teal-400' : ''}`} />
                            </button>
                          )}

                          {srv.connected && srv.platformId && onOpenWorkspace && (
                            <button
                              onClick={() => {
                                onOpenWorkspace(srv.platformId!);
                                onClose();
                              }}
                              className="px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <span>Workspace</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Footer Summary Banner */}
        <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Google Workspace connects directly to your WIHGO AI Business Brain</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-xs font-bold shadow-md hover:opacity-90 transition-all cursor-pointer"
            >
              Done & Save
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
