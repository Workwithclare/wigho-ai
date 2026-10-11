"use client";

import React, { useState } from 'react';
import { PlatformInfo, PlatformId, UserProfile } from '../../../lib/wihgo/types';
import {
  Link as LinkIcon,
  ShieldCheck,
  Key,
  Lock,
  Unlink,
  Settings,
  CheckCircle2,
  MessageSquare,
  Camera,
  ThumbsUp,
  Music2,
  Briefcase,
  X as XIcon,
  Hash,
  Mail,
  Calendar,
  Sparkles,
  Brain,
  CheckSquare,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { PlatformConnectorModal } from './PlatformConnectorModal';
import { RequestConnectorModal } from './RequestConnectorModal';
import {
  PlusCircle,
  HelpCircle
} from 'lucide-react';

interface MyConnectionsPageProps {
  platforms: PlatformInfo[];
  user?: UserProfile;
  onToggleConnection: (platformId: PlatformId) => void;
  onOpenWorkspace?: (platformId: PlatformId) => void;
  onStatusChange?: (platformId: PlatformId, newStatus: 'CONNECTED' | 'NOT CONNECTED' | 'ACCESS REQUIRED', accountHandle?: string) => void;
  onRequestAuth?: (mode: 'login' | 'signup', pendingPlatformId?: PlatformId) => void;
}

export const MyConnectionsPage: React.FC<MyConnectionsPageProps> = ({
  platforms,
  user,
  onToggleConnection,
  onOpenWorkspace,
  onStatusChange,
  onRequestAuth
}) => {
  const [selectedPlatformForModal, setSelectedPlatformForModal] = useState<PlatformInfo | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const getPlatformById = (id: string): PlatformInfo => {
    const found = platforms.find(p => p.id === id);
    if (found) return found;
    return {
      id: id as PlatformId,
      name: id,
      icon: 'Link',
      color: '#6366F1',
      gradient: 'from-slate-800 to-slate-900',
      description: `${id} integration`,
      connected: false,
      statusOverride: 'ACCESS REQUIRED',
      lastSynced: 'Requires Authorization',
      messageCount: 0,
      urgentCount: 0,
      unreadCount: 0,
      capabilities: ['Integration Authorization']
    };
  };

  const categories = [
    {
      id: 'google-workspace',
      title: 'GOOGLE WORKSPACE',
      subtitle: 'Google Cloud & Workspace productivity suite integrations',
      items: ['email', 'calendar', 'drive', 'meet']
    },
    {
      id: 'communication',
      title: 'COMMUNICATION',
      subtitle: 'Direct messaging, team chat spaces & business mailboxes',
      items: ['whatsapp', 'slack']
    },
    {
      id: 'social',
      title: 'SOCIAL',
      subtitle: 'Social media DMs, comments, creator feeds & brand mentions',
      items: ['instagram', 'facebook', 'tiktok', 'linkedin', 'x']
    }
  ];

  const handleCardClick = (platformId: string) => {
    const platform = getPlatformById(platformId);
    setSelectedPlatformForModal(platform);
  };

  const renderIcon = (id: string, className: string) => {
    switch (id) {
      case 'whatsapp': return <WhatsAppIcon className={className} />;
      case 'instagram': return <Camera className={`${className} text-pink-400`} />;
      case 'facebook': return <ThumbsUp className={`${className} text-blue-400`} />;
      case 'tiktok': return <Music2 className={`${className} text-cyan-400`} />;
      case 'linkedin': return <Briefcase className={`${className} text-sky-400`} />;
      case 'x': return <XIcon className={`${className} text-slate-200`} />;
      case 'slack': return <Hash className={`${className} text-purple-400`} />;
      case 'email': return <Mail className={`${className} text-rose-400`} />;
      case 'calendar': return <Calendar className={`${className} text-amber-400`} />;
      case 'drive': return <CheckSquare className={`${className} text-emerald-400`} />;
      case 'meet': return <Sparkles className={`${className} text-indigo-400`} />;
      default: return <MessageSquare className={className} />;
    }
  };

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>CONNECT YOUR BUSINESS WORLD</span>
            <LinkIcon className="w-6 h-6 text-cyan-400" />
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage all official connectors across Communication, Social & Productivity channels
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-2xl text-emerald-400 text-xs font-semibold self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4" />
          <span>Encrypted Direct Connections Active</span>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-8">
        {categories.map((cat) => (
          <div key={cat.id} className="space-y-4">
            <div className="border-b border-indigo-500/15 pb-2">
              <h2 className="text-xs font-black tracking-widest text-cyan-400 uppercase">
                {cat.title}
              </h2>
              <p className="text-[11px] text-slate-400">{cat.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.items.map((itemId) => {
                const item = getPlatformById(itemId);
                const isConnected = item.connected && item.statusOverride !== 'ACCESS REQUIRED';
                const isAccessRequired = item.statusOverride === 'ACCESS REQUIRED';

                return (
                  <div
                    key={item.id}
                    id={`connection-card-${item.id}`}
                    onClick={() => handleCardClick(item.id)}
                    className={`bg-slate-900/90 border p-5 rounded-3xl backdrop-blur-xl transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer group ${
                      isConnected
                        ? 'border-indigo-500/25 hover:border-cyan-400/50 shadow-sm'
                        : 'border-slate-800 hover:border-cyan-500/40 opacity-90'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 group-hover:border-slate-700 transition-colors">
                            {renderIcon(item.id, 'w-6 h-6')}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">{item.name}</h3>
                            <span className="text-[10px] text-slate-500 uppercase font-mono">{cat.title}</span>
                          </div>
                        </div>

                        {/* Connection Status Badge */}
                        {isConnected ? (
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Connected
                          </span>
                        ) : isAccessRequired ? (
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-amber-300 bg-amber-500/10 border border-amber-500/30 tracking-wider flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            ACCESS REQUIRED
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-slate-400 bg-slate-800 border border-slate-700">
                            Not Connected
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                      {isConnected ? (
                        <>
                          <button
                            id={`btn-manage-${item.id}`}
                            onClick={() => handleCardClick(item.id)}
                            className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-all"
                          >
                            <Settings className="w-3.5 h-3.5 text-slate-400" />
                            <span>Manage</span>
                          </button>

                          <button
                            id={`btn-disconnect-card-${item.id}`}
                            onClick={() => {
                              if (onStatusChange) {
                                onStatusChange(item.id, 'NOT CONNECTED');
                              } else {
                                onToggleConnection(item.id);
                              }
                            }}
                            className="py-1.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1 transition-all"
                          >
                            <Unlink className="w-3.5 h-3.5" />
                            <span>Disconnect</span>
                          </button>
                        </>
                      ) : (
                        <button
                          id={`btn-connect-card-${item.id}`}
                          onClick={() => handleCardClick(item.id)}
                          className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Key className="w-3.5 h-3.5" />
                          <span>Connect {item.name}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Missing a Connector Request Section */}
      <div className="p-6 rounded-3xl bg-[#090D14] border border-teal-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-teal-400 font-bold text-sm">
            <PlusCircle className="w-4 h-4" />
            <span>Missing a Connector?</span>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            Need a tool like Shopify, QuickBooks, Notion, HubSpot, or Stripe connected to WIHGO AI? Request an integration and we will build it.
          </p>
        </div>

        <button
          id="btn-request-connector"
          onClick={() => setIsRequestModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold transition-all shrink-0 hover:scale-[1.02] flex items-center gap-2"
        >
          <HelpCircle className="w-4 h-4 text-teal-400" />
          <span>Request an Integration</span>
        </button>
      </div>

      {/* Platform Connector Modal */}
      {selectedPlatformForModal && (
        <PlatformConnectorModal
          isOpen={true}
          onClose={() => setSelectedPlatformForModal(null)}
          platform={platforms.find(p => p.id === selectedPlatformForModal.id) || selectedPlatformForModal}
          user={user}
          onStatusChange={(platformId: any, newStatus: any, accountHandle: any) => {
            if (onStatusChange) {
              onStatusChange(platformId, newStatus, accountHandle);
            }
            setSelectedPlatformForModal(null);
          }}
          onOpenWorkspace={(platformId) => {
            if (onOpenWorkspace) {
              onOpenWorkspace(platformId);
            }
            setSelectedPlatformForModal(null);
          }}
          onRequestAuth={onRequestAuth}
        />
      )}

      {/* Request Connector Modal */}
      <RequestConnectorModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        userId={user?.id}
        onRequestAuth={() => {
          setIsRequestModalOpen(false);
          if (onRequestAuth) onRequestAuth('login');
        }}
      />
    </div>
  );
};
