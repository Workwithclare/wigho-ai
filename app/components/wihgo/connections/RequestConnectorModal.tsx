"use client";

import React, { useState } from 'react';
import {
  X,
  Send,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Layers
} from 'lucide-react';
import { submitConnectorRequest } from '../../../lib/wihgo/demoBackend';

interface RequestConnectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  onRequestAuth?: () => void;
}

export const RequestConnectorModal: React.FC<RequestConnectorModalProps> = ({
  isOpen,
  onClose,
  userId,
  onRequestAuth
}) => {
  const [toolName, setToolName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toolName.trim() || !purpose.trim()) {
      setError('Please provide the tool name and what you want WIHGO to do with it.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await submitConnectorRequest(userId || 'default', {
        toolName: toolName.trim(),
        purpose: purpose.trim(),
        description: description.trim()
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit connector request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#090D14] border border-teal-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(13,148,136,0.2)] text-white space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-tight">Request an Integration</h2>
              <p className="text-xs text-slate-400">Tell us what tool you need connected to WIHGO AI</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Integration Request Received!</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Thank you! Your request for <strong className="text-teal-300">{toolName}</strong> has been logged to your account and forwarded to our connector roadmap team.
              </p>
            </div>

            <button
              onClick={() => {
                setSuccess(false);
                setToolName('');
                setPurpose('');
                setDescription('');
                onClose();
              }}
              className="mt-4 px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold transition-all shadow-md"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                App or Service Name <span className="text-teal-400">*</span>
              </label>
              <input
                type="text"
                required
                value={toolName}
                onChange={(e) => setToolName(e.target.value)}
                placeholder="e.g. Shopify, QuickBooks, Notion, HubSpot, Stripe..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                What should WIHGO do with it? <span className="text-teal-400">*</span>
              </label>
              <input
                type="text"
                required
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Notify me when high-priority orders arrive or sync customer leads"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Additional Details <span className="text-slate-500">(Optional)</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Any specific workflows, data fields, or permissions you'd like supported..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:border-teal-400 focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-teal-500/20 text-[11px] text-slate-400 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>
                No technical API keys or developer setup needed from you. We build and maintain official certified OAuth integrations.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
