"use client";

import React, { useState, useEffect } from 'react';
import {
  Eye,
  EyeOff,
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { UserProfile } from '../../../lib/wihgo/types';
import { INITIAL_USER_PROFILE } from '../../../lib/wihgo/mockData';
import { authClient } from '../../../lib/auth-client';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (user: UserProfile) => void;
  initialMode?: 'login' | 'signup' | 'forgot' | 'verify';
}

type Mode = 'login' | 'signup' | 'forgot' | 'verify';

function toProfile(u: { id: string; name: string; email: string }): UserProfile {
  return { ...INITIAL_USER_PROFILE, id: u.id, name: u.name || 'WIHGO User', email: u.email };
}

function friendlyError(raw: string): string {
  const m = raw.toLowerCase();
  if (m.includes('already exists') || m.includes('already registered') || m.includes('duplicate'))
    return 'An account with this email address already exists. Please switch to Login.';
  if (m.includes('invalid email') || m.includes('invalid login') || m.includes('invalid credentials') || m.includes('wrong password') || m.includes('incorrect password'))
    return 'Invalid email or password. Please verify your credentials and try again.';
  if (m.includes('not verified') || m.includes('email not verified') || m.includes('verify'))
    return 'Email confirmation pending. Please check your email inbox to verify your account.';
  if (m.includes('password') && (m.includes('8') || m.includes('short') || m.includes('weak')))
    return 'Password must be at least 8 characters long.';
  if (m.includes('rate limit') || m.includes('too many'))
    return 'Too many attempts. Please try again in a few moments.';
  if (m.includes('fetch') || m.includes('network'))
    return 'Network error. Check your connection and try again.';
  return raw || 'Authentication failed. Please check your details.';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticate,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [googleOn, setGoogleOn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode || 'login');
      setPassword('');
      setConfirmPassword('');
      setErrorMessage(null);
      setSuccessMessage(null);
      setIsLoading(false);
      fetch('/api/auth/providers')
        .then((r) => (r.ok ? r.json() : { google: false }))
        .then((d) => setGoogleOn(Boolean(d.google)))
        .catch(() => setGoogleOn(false));
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (mode === 'forgot') {
        if (!email.trim()) {
          setErrorMessage('Please enter your email address.');
          setIsLoading(false);
          return;
        }
        const res = await authClient.requestPasswordReset({ email: email.trim() });
        if (res.error) {
          setErrorMessage(friendlyError(res.error.message || ''));
        } else {
          setMode('verify');
        }
        setIsLoading(false);
        return;
      }

      if (mode === 'signup') {
        if (!name.trim()) {
          setErrorMessage('Please enter your full name.');
          setIsLoading(false);
          return;
        }
        if (!email.trim()) {
          setErrorMessage('Please enter your email address.');
          setIsLoading(false);
          return;
        }
        if (!password || password.length < 8) {
          setErrorMessage('Password must be at least 8 characters long.');
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMessage('Passwords do not match.');
          setIsLoading(false);
          return;
        }
        const res = await authClient.signUp.email({
          name: name.trim(),
          email: email.trim(),
          password,
          callbackURL: '/dashboard',
        });
        if (res.error) {
          setErrorMessage(friendlyError(res.error.message || ''));
          setIsLoading(false);
          return;
        }
        const u = (res.data as any)?.user;
        setIsLoading(false);
        if (u) {
          onAuthenticate(toProfile(u));
          onClose();
        } else {
          setSuccessMessage('Account created. Check your email to verify your account.');
          setMode('login');
        }
        return;
      }

      if (!email.trim() || !password) {
        setErrorMessage('Please provide both email and password.');
        setIsLoading(false);
        return;
      }
      const res = await authClient.signIn.email({ email: email.trim(), password });
      if (res.error) {
        setErrorMessage(friendlyError(res.error.message || ''));
        setIsLoading(false);
        return;
      }
      const u = (res.data as any)?.user;
      setIsLoading(false);
      if (u) {
        onAuthenticate(toProfile(u));
        onClose();
      } else {
        setErrorMessage('Sign in failed. Please try again.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMessage(friendlyError(err?.message || ''));
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await authClient.signIn.social({ provider: 'google', callbackURL: '/dashboard' });
      if (res.error) setErrorMessage(friendlyError(res.error.message || ''));
    } catch (err: any) {
      setErrorMessage(friendlyError(err?.message || 'Google sign-in could not be completed.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#0B0F19] border border-teal-500/20 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(13,148,136,0.15)] space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            id="btn-auth-back"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <Logo size="sm" showText showDescriptor />
          <div className="w-8" />
        </div>

        {/* Title */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'forgot' && 'Reset Password'}
            {mode === 'verify' && 'Check Your Email'}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'login' && 'Sign in to access your WIHGO AI Connect Hub'}
            {mode === 'signup' && 'Start connecting all your business tools today with WIHGO AI'}
            {mode === 'forgot' && 'Enter your email to receive a password reset link'}
            {mode === 'verify' && 'We sent a link to your email'}
          </p>
        </div>

        {/* Login / Sign Up Tabs */}
        {(mode === 'login' || mode === 'signup') && (
          <div className="grid grid-cols-2 p-1 bg-slate-900/90 rounded-2xl border border-teal-500/15">
            <button
              id="tab-auth-login"
              type="button"
              onClick={() => { setMode('login'); setErrorMessage(null); setSuccessMessage(null); }}
              className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                mode === 'login'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              id="tab-auth-signup"
              type="button"
              onClick={() => { setMode('signup'); setErrorMessage(null); setSuccessMessage(null); }}
              className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                mode === 'signup'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Success Message Banner */}
        {successMessage && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-2 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Message Banner */}
        {errorMessage && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl flex flex-col gap-2 text-xs text-red-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            {errorMessage.toLowerCase().includes('already exists') && (
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                }}
                className="text-teal-400 hover:text-teal-300 font-semibold underline text-left ml-6 text-[11px]"
              >
                Click here to Sign In with this email →
              </button>
            )}
          </div>
        )}

        {/* Verification Success View */}
        {mode === 'verify' ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <p className="text-xs text-slate-300">
              Please click the link in your email, then return here to log in.
            </p>
            <button
              id="btn-back-to-login"
              onClick={() => { setMode('login'); setErrorMessage(null); setSuccessMessage(null); }}
              className="w-full py-3 rounded-2xl bg-teal-600 text-white font-semibold text-xs hover:bg-teal-500 transition-all shadow-md shadow-teal-500/20"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-slate-900/90 text-slate-100 placeholder-slate-500 text-xs rounded-2xl px-4 py-3 border border-teal-500/20 focus:border-teal-400 focus:outline-none transition-all"
                />
              </div>
            )}

            {(mode === 'login' || mode === 'signup' || mode === 'forgot') && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full bg-slate-900/90 text-slate-100 placeholder-slate-500 text-xs rounded-2xl px-4 py-3 border border-teal-500/20 focus:border-teal-400 focus:outline-none transition-all"
                />
              </div>
            )}

            {(mode === 'login' || mode === 'signup') && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-slate-400">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setErrorMessage(null); setSuccessMessage(null); }}
                      className="text-xs font-semibold text-teal-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-900/90 text-slate-100 placeholder-slate-500 text-xs rounded-2xl pl-4 pr-10 py-3 border border-teal-500/20 focus:border-teal-400 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full bg-slate-900/90 text-slate-100 placeholder-slate-500 text-xs rounded-2xl pl-4 pr-10 py-3 border border-teal-500/20 focus:border-teal-400 focus:outline-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Main Action Button */}
            <button
              id="btn-auth-submit"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(13,148,136,0.3)] hover:shadow-[0_0_30px_rgba(13,148,136,0.5)] transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
            </button>
          </form>
        )}

        {/* Social Login Options */}
        {(mode === 'login' || mode === 'signup') && (
          <div className="space-y-3 pt-2">
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-[#0B0F19] px-3 text-[11px] text-slate-500 uppercase font-medium">
                or continue with
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {googleOn ? (
                <button
                  id="btn-social-google"
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              ) : (
                <div className="w-full py-2.5 px-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-500 font-semibold text-xs flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>Google sign-in — Coming soon</span>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
