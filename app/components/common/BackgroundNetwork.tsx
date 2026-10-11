"use client";

import React from 'react';

export const BackgroundNetwork: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#070A12]">
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[140px]" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[140px]" />
      <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-indigo-950/30 rounded-full blur-[160px]" />
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </radialGradient>
        </defs>
        <line x1="10%" y1="20%" x2="40%" y2="50%" stroke="#3B82F6" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="40%" y1="50%" x2="70%" y2="25%" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="70%" y1="25%" x2="90%" y2="60%" stroke="#3B82F6" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="40%" y1="50%" x2="30%" y2="85%" stroke="#A855F7" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="30%" y1="85%" x2="75%" y2="80%" stroke="#06B6D4" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="10%" cy="20%" r="4" fill="#00F0FF" className="animate-ping" />
        <circle cx="40%" cy="50%" r="6" fill="#8B5CF6" />
        <circle cx="70%" cy="25%" r="5" fill="#3B82F6" />
        <circle cx="90%" cy="60%" r="4" fill="#06B6D4" />
        <circle cx="30%" cy="85%" r="5" fill="#A855F7" />
        <circle cx="75%" cy="80%" r="4" fill="#00F0FF" />
      </svg>
    </div>
  );
};
