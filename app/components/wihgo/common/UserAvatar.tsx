"use client";

import React, { useState, useEffect } from 'react';

interface UserAvatarProps {
  name: string;
  avatarUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showOnlineBadge?: boolean;
}

export function getInitials(name?: string): string {
  if (!name || typeof name !== 'string' || !name.trim()) return 'W';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'W';
  if (parts.length === 1) {
    return parts[0] ? parts[0].substring(0, 2).toUpperCase() : 'W';
  }
  const firstChar = parts[0]?.[0] || '';
  const lastChar = parts[parts.length - 1]?.[0] || '';
  const initials = (firstChar + lastChar).toUpperCase();
  return initials || 'W';
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  avatarUrl,
  size = 'md',
  className = '',
  showOnlineBadge = false
}) => {
  const [imageError, setImageError] = useState<boolean>(false);

  // Reset image error state whenever avatarUrl prop updates
  useEffect(() => {
    setImageError(false);
  }, [avatarUrl]);

  const initials = getInitials(name);

  // Size mapping
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-24 h-24 text-3xl'
  }[size];

  const badgeSizeClasses = {
    xs: 'w-1.5 h-1.5 ring-1',
    sm: 'w-2 h-2 ring-1',
    md: 'w-2.5 h-2.5 ring-2',
    lg: 'w-3 h-3 ring-2',
    xl: 'w-3.5 h-3.5 ring-2',
    '2xl': 'w-5 h-5 ring-4'
  }[size];

  const hasImage = Boolean(avatarUrl && avatarUrl.trim() && !imageError);

  return (
    <div className="relative inline-block flex-shrink-0">
      <div
        className={`${sizeClasses} rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-300 ${
          hasImage
            ? 'bg-slate-900 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
            : 'bg-gradient-to-tr from-cyan-950 via-indigo-900 to-slate-900 border border-cyan-400/40 text-cyan-300 font-extrabold tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.3)]'
        } ${className}`}
      >
        {hasImage ? (
          <img
            src={avatarUrl}
            alt={name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="select-none text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
            {initials}
          </span>
        )}
      </div>

      {showOnlineBadge && (
        <span
          className={`absolute bottom-0 right-0 rounded-full bg-emerald-400 ring-slate-950 ${badgeSizeClasses} animate-pulse`}
          title="Online & Synced"
        />
      )}
    </div>
  );
};
