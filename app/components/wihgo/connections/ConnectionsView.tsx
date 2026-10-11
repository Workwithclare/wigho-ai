"use client";

import React, { useState } from 'react';
import { PlatformInfo, PlatformId } from '../../../lib/wihgo/types';
import {
  Link as LinkIcon,
  CheckCircle2,
  RefreshCw,
  Unlink,
  ShieldCheck,
  Key,
  Lock,
  MessageSquare,
  Camera,
  ThumbsUp,
  Music2,
  Briefcase,
  X as XIcon,
  Hash,
  Mail,
  Calendar,
  HardDrive,
  Video,
  Sparkles,
  Settings,
  Layers
} from 'lucide-react';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { PlatformConnectorModal, ConnectorStatusType } from './PlatformConnectorModal';

interface ConnectionsViewProps {
  platforms: PlatformInfo[];
  onToggleConnection?: (platformId: PlatformId) => void;
  onOpenConnectorModal?: (platform: PlatformInfo) => void;
  onStatusChange?: (platformId: PlatformId, newStatus: ConnectorStatusType) => void;
  onOpenWorkspace?: (platformId: PlatformId) => void;
}

export const ConnectionsView: React.FC<ConnectionsViewProps> = ({
  platforms,
  onToggleConnection,
  onOpenConnectorModal,
  onStatusChange,
  onOpenWorkspace
}) => {
  const [selectedPlatformModal, setSelectedPlatformModal] = useState<PlatformInfo | null>(null);

  const handleCardClick = (p: PlatformInfo) => {
    if (onOpenConnectorModal) {
      onOpenConnectorModal(p);
    } else {
      setSelectedPlatformModal(p);
    }
  };

  const renderPlatformIcon = (id: string, className: string) => {
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
      case 'drive': return <HardDrive className={`${className} text-emerald-400`} />;
      case 'meet': return <Video className={`${className} text-teal-400`} />;
      default: return <LinkIcon className={className} />;
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Modular Platform Connectors</span>
            <LinkIcon className="w-5 h-5 text-cyan-400" />
          </h1>
          <p className="text-xs text-slate-400">
            Independent connector status, official OAuth credentials & synchronization controls
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-2xl text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Encrypted Direct Connections</span>
        </div>
      </div>

      {/* Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((p) => {
          const isConnected = p.connected && p.statusOverride !== 'ACCESS REQUIRED';
          const isAccessRequired = p.statusOverride === 'ACCESS REQUIRED';
          const isError = p.statusOverride === 'ERROR';
          const isReconnectRequired = p.statusOverride === 'RECONNECT REQUIRED';

          return (
            <div
              key={p.id}
              id={`connector-card-${p.id}`}
              onClick={() => handleCardClick(p)}
              className="bg-slate-900/90 border border-indigo-500/20 hover:border-cyan-400/50 p-5 rounded-3xl backdrop-blur-xl transition-all duration-300 flex flex-col justify-between space-y-4 cursor-pointer group shadow-md hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]"
            >
              {/* Platform info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 group-hover:border-slate-700 transition-colors">
                      {renderPlatformIcon(p.id, 'w-6 h-6')}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">{p.name}</h3>
                      <p className="text-[10px] text-slate-400 font-mono">{p.accountHandle || 'Not linked'}</p>
                    </div>
                  </div>

                  {/* Real Status Badge */}
                  {isConnected && (
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>CONNECTED</span>
                    </span>
                  )}
                  {isAccessRequired && (
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 text-amber-300 bg-amber-500/10 border border-amber-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      <span>ACCESS REQUIRED</span>
                    </span>
                  )}
                  {isError && (
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 text-rose-400 bg-rose-500/10 border border-rose-500/30">
                      <span>ERROR</span>
                    </span>
                  )}
                  {isReconnectRequired && (
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 text-orange-400 bg-orange-500/10 border border-orange-500/30">
                      <span>RECONNECT</span>
                    </span>
                  )}
                  {!isConnected && !isAccessRequired && !isError && !isReconnectRequired && (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full text-slate-400 bg-slate-800 border border-slate-700">
                      NOT CONNECTED
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{p.description}</p>

                {/* Capabilities Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {p.capabilities.map((cap, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-400/20 px-2 py-0.5 rounded-md font-mono"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                <span className="text-[10px] text-slate-400 font-mono">
                  {isConnected ? `Synced ${p.lastSynced || 'Active'}` : (p.lastSynced || 'Authorization required')}
                </span>

                {isConnected ? (
                  <div className="flex items-center gap-2">
                    {onOpenWorkspace && (
                      <button
                        id={`btn-workspace-${p.id}`}
                        onClick={() => onOpenWorkspace(p.id)}
                        className="py-1.5 px-2.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-cyan-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1 transition-all"
                      >
                        <Layers className="w-3 h-3" />
                        <span>Workspace</span>
                      </button>
                    )}
                    <button
                      id={`btn-manage-${p.id}`}
                      onClick={() => handleCardClick(p)}
                      className="py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-all"
                    >
                      <Settings className="w-3 h-3 text-slate-400" />
                      <span>Details</span>
                    </button>
                  </div>
                ) : (
                  <button
                    id={`btn-connect-${p.id}`}
                    onClick={() => handleCardClick(p)}
                    className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-md hover:shadow-lg flex items-center gap-1.5 transition-all"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Connect {p.name}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Standalone Modal fallback if not handled by parent */}
      {selectedPlatformModal && (
        <PlatformConnectorModal
          isOpen={true}
          onClose={() => setSelectedPlatformModal(null)}
          platform={platforms.find(p => p.id === selectedPlatformModal.id) || selectedPlatformModal}
          onStatusChange={(platformId, newStatus) => {
            if (onStatusChange) {
              onStatusChange(platformId, newStatus);
            }
            setSelectedPlatformModal(null);
          }}
          onOpenWorkspace={(platformId) => {
            if (onOpenWorkspace) {
              onOpenWorkspace(platformId);
            }
            setSelectedPlatformModal(null);
          }}
        />
      )}
    </div>
  );
};
