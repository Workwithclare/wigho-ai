"use client";

import React from 'react';
import {
  Zap,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Star
} from 'lucide-react';

export const SubscriptionView: React.FC = () => {
  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Subscription & AI Usage</span>
            <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-pulse" />
          </h1>
          <p className="text-xs text-slate-400">Manage your WIHGO AI Power quota, enterprise connectors, and scaling plans</p>
        </div>

        <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 px-3.5 py-1.5 rounded-2xl text-yellow-300 text-xs font-extrabold">
          <Star className="w-4 h-4 fill-yellow-400" />
          <span>AI Studio Enterprise Plan</span>
        </div>
      </div>

      {/* AI Usage Card Hero */}
      <div className="bg-gradient-to-r from-indigo-950/90 via-slate-900 to-purple-950/90 border border-cyan-500/30 p-6 rounded-3xl backdrop-blur-xl space-y-4 shadow-[0_0_35px_rgba(6,182,212,0.15)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-black tracking-wider text-cyan-400 uppercase flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>WIHGO AI POWER QUOTA</span>
            </div>
            <h2 className="text-xl font-extrabold text-white">80% AI Power Remaining</h2>
            <p className="text-xs text-slate-300">8,000 of 10,000 high-speed AI tokens available for this billing cycle.</p>
          </div>

          <button className="py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-extrabold text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>Upgrade Plan</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-bold text-slate-300">
            <span>Used: 2,000 tokens (20%)</span>
            <span className="text-cyan-300">Remaining: 8,000 tokens (80%)</span>
          </div>
          <div className="h-3.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-indigo-500/30">
            <div className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 rounded-full shadow-[0_0_10px_#00F0FF]" style={{ width: '80%' }} />
          </div>
        </div>
      </div>

      {/* Plan Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: 'Starter Connect',
            price: '$29',
            period: '/month',
            desc: 'For solo creators and small boutique brands.',
            current: false,
            features: [
              'Up to 3 Connected Apps',
              '1,000 AI Power Tokens/mo',
              'Standard Response Speed',
              'Basic Email Support'
            ]
          },
          {
            title: 'Pro Business Hub',
            price: '$79',
            period: '/month',
            desc: 'For growing businesses requiring multi-channel automation.',
            current: false,
            features: [
              'All 8 Platform Connectors',
              '5,000 AI Power Tokens/mo',
              'Business Brain Custom Rules',
              'Priority AI Response Speed'
            ]
          },
          {
            title: 'AI Studio Enterprise',
            price: '$199',
            period: '/month',
            desc: 'Unlimited power, custom OAuth, and dedicated support.',
            current: true,
            features: [
              'Unlimited Platform Connectors',
              '10,000+ AI Power Tokens/mo',
              'Full Google Workspace & Gmail OAuth',
              'Dedicated Account Architect',
              'Custom API & Webhook Integrations'
            ]
          }
        ].map((plan, idx) => (
          <div
            key={idx}
            className={`bg-slate-900/90 border p-6 rounded-3xl backdrop-blur-xl flex flex-col justify-between space-y-6 ${
              plan.current
                ? 'border-cyan-400/50 shadow-[0_0_30px_rgba(6,182,212,0.2)]'
                : 'border-indigo-500/15'
            }`}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-white">{plan.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{plan.desc}</p>
                </div>
                {plan.current && (
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                    Current Plan
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                <span className="text-xs text-slate-400">{plan.period}</span>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              disabled={plan.current}
              className={`w-full py-3 rounded-2xl font-bold text-xs transition-all ${
                plan.current
                  ? 'bg-slate-800 text-slate-400 cursor-default'
                  : 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md hover:shadow-lg'
              }`}
            >
              {plan.current ? 'Active Subscription' : 'Switch to Plan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
