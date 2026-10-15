"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { BackgroundNetwork } from '../../components/common/BackgroundNetwork';
import { WihgoSymbol } from '../../components/common/Logo';
import { authClient } from '../../lib/auth-client';

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    p.then(
      (v) => { clearTimeout(t); resolve(v); },
      (e) => { clearTimeout(t); reject(e); }
    );
  });
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleOn, setGoogleOn] = useState(false);

  React.useEffect(() => {
    fetch('/api/auth/providers')
      .then((r) => (r.ok ? r.json() : { google: false }))
      .then((d) => setGoogleOn(Boolean(d.google)))
      .catch(() => setGoogleOn(false));
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await withTimeout(
        authClient.signIn.email({ email: email.trim(), password }),
        25000
      );
      if (res.error) {
        setError(res.error.message || 'Sign in failed. Check your email and password.');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(
        err?.message === 'timeout'
          ? 'Sign-in is taking too long — your account may already exist. Wait a moment, then try signing in again.'
          : 'Cannot reach the server. Check your connection and try again.'
      );
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
            id="login-email" name="email"
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email" autoComplete="email"
            className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-500"
          />
          <div className="relative">
            <input
              id="login-password" name="password"
              type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" autoComplete="current-password"
              className="w-full px-3 py-2.5 pr-10 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-500 via-teal-600 to-teal-500 text-black font-extrabold text-sm disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-[#05070E] px-3 text-[11px] text-slate-500 uppercase font-medium">
            or continue
          </span>
        </div>
        {googleOn ? (
          <button
            onClick={async () => {
              setError(null);
              try {
                const res = await authClient.signIn.social({ provider: 'google', callbackURL: '/dashboard' });
                if (res.error) setError(res.error.message || 'Google sign-in could not be completed.');
              } catch {
                setError('Google sign-in could not be completed.');
              }
            }}
            className="w-full py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs font-bold text-white hover:border-slate-600 transition-all"
          >
            Continue with Google
          </button>
        ) : (
          <div className="w-full py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-500 font-semibold text-xs text-center">
            Google sign-in — Coming soon
          </div>
        )}
        <div className="text-center text-xs text-slate-400 space-x-1">
          <span>No account?</span>
          <Link href="/signup" className="text-teal-300 font-bold">Create Account</Link>
        </div>
      </div>
    </div>
  );
}
