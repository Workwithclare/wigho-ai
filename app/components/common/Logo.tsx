"use client";

import React from 'react';

export interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'full' | 'horizontal' | 'vertical' | 'icon' | 'compact';
  showText?: boolean;
  showDescriptor?: boolean;
  showTagline?: boolean;
  descriptorText?: string;
  layout?: 'horizontal' | 'vertical';
  className?: string;
}

/**
 * WIHGO AI — Brand Symbol Component
 * Features:
 * 1. Bold, symmetrical, modern Deep Teal 'W'
 * 2. Interconnected Silver Network Ring (representing multiple business platforms flowing into one unified hub)
 * 3. Brushed Metallic Silver Orb node
 */
export const WihgoSymbol: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => {
  return (
    <svg
      viewBox="0 0 240 240"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} filter drop-shadow-[0_0_22px_rgba(13,148,136,0.45)]`}
      aria-label="WIHGO AI Connect Hub Logo Symbol"
    >
      <defs>
        {/* Deep Teal Primary Gradient for the W body */}
        <linearGradient id="wihgoTealPrimary" x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#0B4D52" />
          <stop offset="25%" stopColor="#0D9488" />
          <stop offset="70%" stopColor="#14B8A6" />
          <stop offset="100%" stopColor="#042F2E" />
        </linearGradient>

        {/* Deep Teal Left Highlight */}
        <linearGradient id="wihgoTealLeftWing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2DD4BF" />
          <stop offset="40%" stopColor="#0D9488" />
          <stop offset="100%" stopColor="#063E40" />
        </linearGradient>

        {/* Deep Teal Center Nexus / Fold Depth */}
        <linearGradient id="wihgoTealCenter" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14B8A6" />
          <stop offset="50%" stopColor="#0F766E" />
          <stop offset="100%" stopColor="#021C1C" />
        </linearGradient>

        {/* Deep Metallic Silver Accent Wing */}
        <linearGradient id="wihgoSilverWing" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="30%" stopColor="#94A3B8" />
          <stop offset="65%" stopColor="#F8FAFC" />
          <stop offset="85%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>

        {/* Interconnected Silver Network Ring Gradient */}
        <linearGradient id="wihgoInterconnectedRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#CBD5E1" stopOpacity="0.85" />
          <stop offset="25%" stopColor="#94A3B8" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#14B8A6" stopOpacity="0.75" />
          <stop offset="75%" stopColor="#64748B" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#F1F5F9" stopOpacity="0.9" />
        </linearGradient>

        {/* Brushed Metallic Silver Floating Orb (3D Sphere) */}
        <radialGradient id="wihgoSilverOrb" cx="35%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#F8FAFC" />
          <stop offset="65%" stopColor="#CBD5E1" />
          <stop offset="88%" stopColor="#64748B" />
          <stop offset="100%" stopColor="#334155" />
        </radialGradient>

        {/* Platform Node Point Gradient */}
        <radialGradient id="wihgoPlatformNode" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#0D9488" />
        </radialGradient>

        {/* Global Tech Shadow */}
        <filter id="wihgoGlobalShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#04060C" floodOpacity="0.7" />
        </filter>
      </defs>

      {/* ============================================================ */}
      {/* 3. INTERCONNECTED RING ELEMENT (Multiple Platforms -> 1 Hub) */}
      {/* ============================================================ */}
      <g className="opacity-80">
        {/* Main Orbital Interconnected Ring */}
        <circle
          cx="120"
          cy="120"
          r="86"
          stroke="url(#wihgoInterconnectedRing)"
          strokeWidth="3"
          strokeDasharray="16 5 4 5"
        />

        {/* Concentric Inner Micro-Track */}
        <circle
          cx="120"
          cy="120"
          r="78"
          stroke="#0D9488"
          strokeWidth="1"
          strokeOpacity="0.3"
        />

        {/* Interconnected Network Nodes (Platforms Connecting into the Central Ring) */}
        {/* Top Node */}
        <circle cx="120" cy="34" r="4.5" fill="url(#wihgoPlatformNode)" stroke="#CBD5E1" strokeWidth="1" />
        <circle cx="120" cy="34" r="7" stroke="#14B8A6" strokeWidth="0.75" strokeOpacity="0.6" />

        {/* Bottom Node */}
        <circle cx="120" cy="206" r="4.5" fill="url(#wihgoPlatformNode)" stroke="#CBD5E1" strokeWidth="1" />
        <circle cx="120" cy="206" r="7" stroke="#14B8A6" strokeWidth="0.75" strokeOpacity="0.6" />

        {/* Left Node */}
        <circle cx="34" cy="120" r="4" fill="url(#wihgoPlatformNode)" stroke="#CBD5E1" strokeWidth="1" />

        {/* Right Node */}
        <circle cx="206" cy="120" r="4" fill="url(#wihgoPlatformNode)" stroke="#CBD5E1" strokeWidth="1" />
      </g>

      {/* ============================================================ */}
      {/* 1. PRIMARY SYMBOL — BOLD, SYMMETRICAL, DEEP TEAL 'W'          */}
      {/* ============================================================ */}
      <g filter="url(#wihgoGlobalShadow)">
        {/* W — Left Outer Stroke (Deep Teal with Radiant Highlight) */}
        <path
          d="M 58 64 
             C 46 64, 38 78, 46 96 
             L 74 158 
             C 82 176, 98 180, 110 166 
             L 134 134 
             L 112 88 
             L 90 140 
             C 86 148, 80 148, 76 140 
             L 58 92 
             C 55 84, 58 76, 64 74 
             Z"
          fill="url(#wihgoTealLeftWing)"
        />

        {/* W — Central Symmetrical Fold & Arch (Deep Teal Nexus) */}
        <path
          d="M 98 64 
             C 86 64, 80 76, 88 94 
             L 116 156 
             C 124 174, 140 178, 152 164 
             L 178 128 
             L 156 84 
             L 134 136 
             C 130 144, 124 144, 120 136 
             L 96 88 
             C 93 80, 96 72, 102 70 
             Z"
          fill="url(#wihgoTealCenter)"
        />

        {/* W — Middle Inner Ribbon Depth */}
        <path
          d="M 52 76 
             L 78 146 
             C 84 160, 94 164, 102 154 
             L 124 126 
             L 108 92 
             L 92 128 
             C 88 136, 84 136, 80 128 
             L 64 86 
             C 60 76, 56 74, 52 76 
             Z"
          fill="url(#wihgoTealPrimary)"
          opacity="0.75"
        />

        {/* W — Right Upward Symmetrical Wing with Integrated Silver Flow */}
        <path
          d="M 134 136 
             L 164 72 
             C 170 58, 184 58, 192 70 
             C 198 80, 196 94, 188 110 
             L 156 168 
             C 146 182, 132 178, 126 164 
             L 116 142 
             Z"
          fill="url(#wihgoSilverWing)"
        />

        {/* Floating Brushed Metallic Silver Orb (Connected Node / 'i' Tittle) */}
        <circle
          cx="196"
          cy="50"
          r="15"
          fill="url(#wihgoSilverOrb)"
          stroke="#E2E8F0"
          strokeWidth="1.5"
        />
        {/* Specular Glint Highlight on Orb */}
        <circle
          cx="192"
          cy="45"
          r="3.5"
          fill="#FFFFFF"
          opacity="0.9"
        />
      </g>
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant,
  showText = true,
  showTagline = false,
  showDescriptor = false,
  descriptorText = 'AI-POWERED BUSINESS CONNECT HUB',
  layout = 'horizontal',
  className = ''
}) => {
  const isIconOnly = variant === 'icon';
  const isVertical = variant === 'vertical' || layout === 'vertical';

  const dimensionMap = {
    xs: { icon: 'w-5 h-5', title: 'text-sm', hub: 'text-[7px]', descriptor: 'text-[6px]', gap: 'gap-1.5' },
    sm: { icon: 'w-7 h-7', title: 'text-lg', hub: 'text-[9px]', descriptor: 'text-[7px]', gap: 'gap-2' },
    md: { icon: 'w-10 h-10', title: 'text-2xl', hub: 'text-[11px]', descriptor: 'text-[9px]', gap: 'gap-2.5' },
    lg: { icon: 'w-16 h-16', title: 'text-4xl', hub: 'text-xs', descriptor: 'text-[10px]', gap: 'gap-3.5' },
    xl: { icon: 'w-24 h-24', title: 'text-5xl', hub: 'text-sm', descriptor: 'text-xs', gap: 'gap-4' },
    '2xl': { icon: 'w-36 h-36', title: 'text-6xl', hub: 'text-base', descriptor: 'text-sm', gap: 'gap-5' }
  };

  const currentSize = dimensionMap[size];

  if (isIconOnly) {
    return (
      <div className={`inline-flex items-center justify-center ${currentSize.icon} ${className}`}>
        <WihgoSymbol />
      </div>
    );
  }

  return (
    <div
      className={`inline-flex ${
        isVertical ? 'flex-col items-center text-center' : 'items-center'
      } ${currentSize.gap} ${className}`}
    >
      {/* 1. PRIMARY SYMBOL (W + INTERCONNECTED RING) */}
      <div className={`relative ${currentSize.icon} flex-shrink-0 flex items-center justify-center`}>
        <WihgoSymbol />
      </div>

      {/* BRAND LOCKUP HIERARCHY */}
      {showText && (
        <div className={`flex flex-col ${isVertical ? 'items-center' : 'items-start'}`}>
          {/* WIHGO AI Brand Name */}
          <div className={`font-black tracking-tight text-white ${currentSize.title} flex items-center leading-none select-none`}>
            {/* WIHG in Metallic Brushed Silver */}
            <span className="bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent font-extrabold tracking-tight">
              WIHG
            </span>

            {/* Distinctive Deep Metallic Silver 'O' */}
            <span className="relative inline-block mx-0.5">
              <span className="bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent font-extrabold">
                O
              </span>
            </span>

            {/* AI in Deep Teal with Metallic Luster */}
            <span className="ml-2 bg-gradient-to-r from-teal-400 to-teal-300 bg-clip-text text-transparent font-black tracking-wider">
              AI
            </span>
          </div>

          {/* 2. CONNECT HUB (Refined Tracking Directly Beneath) */}
          {(showDescriptor || showTagline || isVertical) && (
            <div className="mt-1 flex items-center gap-1.5 select-none">
              <div className="h-[1px] w-2.5 bg-gradient-to-r from-transparent to-teal-500/60" />
              <span className={`font-extrabold tracking-[0.26em] uppercase text-teal-300 ${currentSize.hub}`}>
                CONNECT HUB
              </span>
              <div className="h-[1px] w-2.5 bg-gradient-to-l from-transparent to-teal-500/60" />
            </div>
          )}

          {/* 5. OFFICIAL DESCRIPTOR: AI-POWERED BUSINESS CONNECT HUB */}
          {(showDescriptor || showTagline) && (
            <div className={`mt-1 font-bold tracking-[0.16em] uppercase text-slate-300 ${currentSize.descriptor} select-none`}>
              {descriptorText}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
