"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BackgroundNetwork } from '../../components/common/BackgroundNetwork';
import { WihgoSymbol } from '../../components/common/Logo';
import { authClient } from '../../lib/auth-client';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        callbackURL: "/dashboard",
      });
      if (res.error) {
        setError(res.error.message || 'Could not create account. Try a stronger password (8+ chars).');
      } else {
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
          <h1 className="text-2xl font-black text-white tracking-tight">Create Account</h1>
          <div className="text-xs font-extrabold tracking-[0.25em] text-teal-300 uppercase">Connect Hub</div>
        </div>
        <form onSubmit={onSubmit} className="space-y-3 p-5 rounded-2xl bg-slate-900/80 border border-teal-500/20">
          <input
            type="text" required value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Full Name" autoComplete="name"
            className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-500"
          />
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email" autoComplete="email"
            className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-500"
          />
          <input
            type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (8+ characters)" autoComplete="new-password"
            className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-500"
          />
          <input
            type="password" required minLength={8} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password" autoComplete="new-password"
            className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder:text-slate-500"
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-teal-500 via-teal-600 to-teal-500 text-black font-extrabold text-sm disabled:opacity-60"
          >
            {loading ? 'Creating…' : 'Create Account'}
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
        <button
          onClick={() => {
            try { localStorage.setItem('wihgo_demo_auth', 'true'); } catch {}
            router.push('/dashboard');
          }}
          className="w-full py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs font-bold text-slate-200 hover:border-teal-500/50 hover:text-teal-300 transition-all"
        >
          Continue as demo
        </button>
        <div className="text-center text-xs text-slate-400 space-x-1">
          <span>Have an account?</span>
          <Link href="/login" className="text-teal-300 font-bold">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
