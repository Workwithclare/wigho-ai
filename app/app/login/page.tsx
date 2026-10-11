"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BackgroundNetwork } from '../../components/common/BackgroundNetwork';
import { WihgoSymbol } from '../../components/common/Logo';
import { authClient } from '../../lib/auth-client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authClient.signIn.email({ email: email.trim(), password });
      if (res.error) {
        setError(res.error.message || 'Sign in failed. Check your email and password.');
      } else {
        try { localStorage.setItem('wihgo_demo_auth', 'true'); } catch {}
        router.push('/dashboard');
      }
    } catch {
      setError('Failed to fetch — is the dev server running and BETTER_AUTH_URL=http://localhost:3000 set?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070E] text-slate-100 relative overflow-hidden flex items-center justify-center p-6">
      <BackgroundNetwork />
      <div className="relative z-10 w-full max-w-sm space-y-6 animate-fade-in">
        <div className="text-center space-y-3">
          <div className="mx-auto w-20 h-20 max-w-[180px]">
            <WihgoSymbol className="w-full h-full" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Welcome Back</h1>
          <div className="text-xs font-extrabold tracking-[0.25em] text-teal-300 uppercase">Connect Hub</div>
        </div>
        <form onSubmit={onSubmit} className="space-y-3 p-5 rounded-2xl bg-slate-900/80 border border-teal-500/20">
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email" autoComplete="email"
            className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-500"
          />
          <input
            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Password" autoComplete="current-password"
            className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-500"
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-500 via-teal-600 to-teal-500 text-black font-extrabold text-sm disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <div className="text-center text-xs text-slate-400 space-x-1">
          <span>No account?</span>
          <Link href="/signup" className="text-teal-300 font-bold">Create Account</Link>
          <span>·</span>
          <Link href="/" className="text-slate-300">Continue as Clare (demo)</Link>
        </div>
      </div>
    </div>
  );
}
