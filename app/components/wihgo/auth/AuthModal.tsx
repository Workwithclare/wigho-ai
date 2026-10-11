"use client";

import React, { useState, useEffect } from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { UserProfile } from '../../../lib/wihgo/types';
import { 
  signUpWithEmail, 
  signInWithEmail, 
  resetPasswordForEmail, 
  updateUserPassword,
  signInWithGoogleOAuth,
  signInWithGitHubOAuth,
  signInWithAppleOAuth,
  signInWithSocialOAuth,
  syncUserProfile, 
  saveUserProfile,
  createDefaultUserProfile,
  isSupabaseConfigured
} from '../../../lib/wihgo/demoBackend';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (user: UserProfile) => void;
  initialMode?: 'login' | 'signup' | 'forgot' | 'verify' | 'update_password';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onAuthenticate, 
  initialMode = 'login' 
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'verify' | 'update_password'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode || 'login');
      setPassword('');
      setConfirmPassword('');
      setErrorMessage(null);
      setSuccessMessage(null);
      setIsLoading(false);
    }
  }, [isOpen, initialMode]);

  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SUPABASE_OAUTH_SUCCESS') {
        setIsLoading(false);
        setSuccessMessage('Successfully authenticated with Google!');
      } else if (event.data?.type === 'SUPABASE_OAUTH_ERROR') {
        setIsLoading(false);
        let msg = event.data.error || 'Google sign-in could not be completed. Please try again.';
        if (msg.includes('unsupported_provider') || msg.includes('provider_not_enabled') || msg.includes('Disabled')) {
          msg = 'Google Sign-In is not enabled in your Supabase project yet. Please enable the Google provider in Supabase Dashboard → Authentication → Providers → Google.';
        }
        setErrorMessage(msg);
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (mode === 'update_password') {
        if (!password || password.length < 6) {
          setErrorMessage('Password must be at least 6 characters long.');
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMessage('Passwords do not match.');
          setIsLoading(false);
          return;
        }
        await updateUserPassword(password);
        setIsLoading(false);
        setSuccessMessage('Your password has been updated successfully! Please sign in with your new password.');
        setMode('login');
        setPassword('');
        setConfirmPassword('');
        if (typeof window !== 'undefined') {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        return;
      }

      if (mode === 'forgot') {
        if (!email.trim()) {
          setErrorMessage('Please enter your email address.');
          setIsLoading(false);
          return;
        }
        await resetPasswordForEmail(email.trim());
        setIsLoading(false);
        setMode('verify');
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
        if (!password || password.length < 6) {
          setErrorMessage('Password must be at least 6 characters long.');
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMessage('Passwords do not match.');
          setIsLoading(false);
          return;
        }

        const authData = await signUpWithEmail(email.trim(), password, name.trim());
        if (authData?.session && authData?.user) {
          let profile: UserProfile;
          try {
            profile = await syncUserProfile(authData.user);
          } catch (profileErr) {
            console.error('[WIHGO Auth] Profile sync fallback on signup:', profileErr);
            profile = createDefaultUserProfile(authData.user.id, authData.user.email, name.trim());
          }
          if (name.trim()) {
            profile.name = name.trim();
            saveUserProfile(profile).catch(() => {});
          }
          setIsLoading(false);
          setErrorMessage(null);
          onAuthenticate(profile);
          onClose();
          return;
        } else if (authData?.user) {
          // Check if the user identity array was empty (indicating user exists in Supabase email enumeration protection)
          if (authData.user.identities && authData.user.identities.length === 0) {
            setErrorMessage('An account with this email address already exists. Please sign in below.');
            setMode('login');
            setIsLoading(false);
            return;
          }
          // Email confirmation is required by Supabase project settings
          setSuccessMessage('Account created! If email verification is enabled, please check your inbox to confirm your email before signing in.');
          setMode('login');
          setIsLoading(false);
          return;
        }
      }

      if (mode === 'login') {
        if (!email.trim() || !password) {
          setErrorMessage('Please provide both email and password.');
          setIsLoading(false);
          return;
        }

        const authData = await signInWithEmail(email.trim(), password);
        if (authData?.user) {
          let profile: UserProfile;
          try {
            profile = await syncUserProfile(authData.user);
          } catch (profileErr) {
            console.error('[WIHGO Auth] Profile sync fallback on login:', profileErr);
            profile = createDefaultUserProfile(authData.user.id, authData.user.email);
          }
          setIsLoading(false);
          setErrorMessage(null);
          onAuthenticate(profile);
          onClose();
          return;
        }
      }
    } catch (err: any) {
      setIsLoading(false);
      console.error('[WIHGO Auth Sign In/Up Error]', err);
      let msg = err?.message || 'Authentication failed. Please check your details.';
      
      // Standard Supabase error message cleanups
      if (msg.includes('Invalid login credentials') || msg.includes('invalid_credentials')) {
        msg = 'Invalid email or password. Please verify your credentials and try again.';
      } else if (msg.includes('User already registered') || msg.includes('already registered')) {
        msg = 'An account with this email address already exists. Please switch to Login.';
      } else if (msg.includes('Email not confirmed') || msg.includes('email_not_confirmed')) {
        msg = 'Email confirmation pending. Please check your email inbox to verify your account.';
      } else if (msg.includes('Password should be at least')) {
        msg = 'Password should be at least 6 characters long.';
      } else if (msg.includes('rate limit')) {
        msg = 'Too many attempts. Please try again in a few moments.';
      } else if (msg.includes('Invalid API key')) {
        msg = 'Supabase API key is misconfigured. Please check environment variables.';
      }
      
      setErrorMessage(msg);
    }
  };

  const [externalAuthUrl, setExternalAuthUrl] = useState<string | null>(null);

  const handleSocialSignIn = async (provider: 'google' | 'github' | 'apple') => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setExternalAuthUrl(null);
    const providerName = provider === 'google' ? 'Google' : provider === 'github' ? 'GitHub' : 'Apple';
    try {
      if (provider === 'google') {
        await signInWithGoogleOAuth();
      } else if (provider === 'github') {
        await signInWithGitHubOAuth();
      } else if (provider === 'apple') {
        await signInWithAppleOAuth();
      }
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      if (err?.authUrl) {
        setExternalAuthUrl(err.authUrl);
      }
      setErrorMessage(err?.message || `${providerName} Sign-In could not be completed.`);
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
            {mode === 'update_password' && 'Set New Password'}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'login' && 'Sign in to access your WIHGO AI Connect Hub'}
            {mode === 'signup' && 'Start connecting all your business tools today with WIHGO AI'}
            {mode === 'forgot' && 'Enter your email to receive a password reset link'}
            {mode === 'verify' && 'We sent a verification link to your email'}
            {mode === 'update_password' && 'Enter a new secure password for your WIHGO AI account'}
          </p>
        </div>

        {/* Config Warning Notice if environment variables are not set yet */}
        {!isSupabaseConfigured && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col gap-1 text-[11px] text-amber-300">
            <span className="font-bold flex items-center gap-1.5 text-amber-200">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              Supabase Configuration Notice
            </span>
            <span className="text-slate-300 leading-snug">
              To connect real Supabase Auth, set <code className="text-amber-200 bg-black/40 px-1 rounded">VITE_SUPABASE_URL</code> & <code className="text-amber-200 bg-black/40 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> in environment settings.
            </span>
          </div>
        )}

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
            {externalAuthUrl && (
              <a
                href={externalAuthUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 w-full py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-center text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Open Authentication in New Window</span>
                <span className="text-sm">↗</span>
              </a>
            )}
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
              Please click the link in your email to reset your password, then return here to log in.
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

            {mode === 'update_password' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
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

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full bg-slate-900/90 text-slate-100 placeholder-slate-500 text-xs rounded-2xl px-4 py-3 border border-teal-500/20 focus:border-teal-400 focus:outline-none transition-all"
                  />
                </div>
              </>
            )}

            {/* Main Action Button */}
            <button
              id="btn-auth-submit"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(13,148,136,0.3)] hover:shadow-[0_0_30px_rgba(13,148,136,0.5)] transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : mode === 'forgot' ? 'Send Reset Link' : 'Update Password'}
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
              {/* Google OAuth Button */}
              <button
                id="btn-social-google"
                type="button"
                onClick={() => handleSocialSignIn('google')}
                className="w-full py-2.5 px-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-3 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* GitHub OAuth Button */}
              <button
                id="btn-social-github"
                type="button"
                onClick={() => handleSocialSignIn('github')}
                className="w-full py-2.5 px-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-3 transition-all"
              >
                <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>Continue with GitHub</span>
              </button>

              {/* Apple OAuth Button */}
              <button
                id="btn-social-apple"
                type="button"
                onClick={() => handleSocialSignIn('apple')}
                className="w-full py-2.5 px-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-3 transition-all"
              >
                <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.92.04-2.02.62-2.66 1.37-.56.65-1.06 1.71-.93 2.72 1.03.08 2.07-.49 2.67-1.24z" />
                </svg>
                <span>Continue with Apple</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

