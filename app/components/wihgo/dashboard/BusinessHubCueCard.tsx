"use client";

import React from 'react';
import {
  Brain,
  AlertCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { AttentionEngine } from '../../../lib/wihgo/attention/attentionEngine';

interface BusinessHubCueCardProps {
  onOpenBusinessHub: () => void;
}

export const BusinessHubCueCard: React.FC<BusinessHubCueCardProps> = ({
  onOpenBusinessHub
}) => {
  const counts = AttentionEngine.getActiveCountByCategory();

  return (
    <div className="bg-gradient-to-r from-slate-900/95 via-teal-950/40 to-slate-900/95 border border-teal-500/30 rounded-3xl p-4 sm:p-5 backdrop-blur-xl shadow-[0_0_25px_rgba(20,184,166,0.1)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <div className="p-2.5 rounded-2xl bg-teal-500/20 border border-teal-400/40 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.25)] flex-shrink-0">
          <Brain className="w-5 h-5 text-teal-300 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white tracking-tight">
              Business Hub
            </h3>
            {counts.urgent > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[10px] font-black uppercase">
                {counts.urgent} Urgent
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            <span className="font-bold text-teal-400">{counts.total} items</span> need your attention across connected channels
          </p>
        </div>
      </div>

      <button
        id="btn-open-business-hub-cue"
        onClick={onOpenBusinessHub}
        className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-extrabold transition-all shadow-md shadow-teal-500/20 flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0"
      >
        <span>Open Business Hub</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
