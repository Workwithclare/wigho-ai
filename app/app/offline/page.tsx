"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { BackgroundNetwork } from '../../components/common/BackgroundNetwork';
import { WihgoSymbol } from '../../components/common/Logo';

export default function OfflinePage() {
  useEffect(() => {
    const onOnline = () => window.location.reload();
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, []);

  return (
    <div className="min-h-screen bg-[#05070E] text-slate-100 relative overflow-hidden flex items-center justify-center p-6">
      <BackgroundNetwork />
      <div className="relative z-10 w-full max-w-sm text-center space-y-5 animate-fade-in">
        <div className="mx-auto w-20 h-20 max-w-[180px]">
          <WihgoSymbol className="w-full h-full" />
        </div>
        <h1 className="text-2xl font-black text-white">You're offline</h1>
        <p className="text-sm text-slate-400">
          WihGo AI needs a connection to sync your business memory. Check your network and try again.
        </p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl bg-teal-500 text-black text-xs font-extrabold hover:bg-teal-400"
          >
            Retry
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs font-bold text-slate-200"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
