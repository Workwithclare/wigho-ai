"use client";

import React from 'react';
import {
  Home,
  MessageSquare,
  Bot,
  Share2,
  Sparkles,
  Briefcase,
  Menu
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadCountTotal: number;
  openAiAssistant: () => void;
  onOpenMobileDrawer: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  unreadCountTotal,
  openAiAssistant,
  onOpenMobileDrawer
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'social-hub', label: 'Social', icon: Share2 },
    { id: 'content-creation', label: 'Create', icon: Sparkles },
    { id: 'ai-assistant', label: 'WIHGO AI', icon: Bot },
    { id: 'business-assistant', label: 'Business', icon: Briefcase },
    { id: 'more', label: 'More', icon: Menu, isDrawer: true }
  ];

  return (
    <nav id="bottom-navigation-bar" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F19]/95 backdrop-blur-2xl border-t border-indigo-500/15 px-1 py-1.5">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          const handleClick = () => {
            if (item.isDrawer) {
              onOpenMobileDrawer();
              return;
            }
            setActiveTab(item.id);
          };

          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={handleClick}
              className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-cyan-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1.5 w-6 h-1 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full shadow-[0_0_10px_#00F0FF]" />
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-cyan-400' : ''}`} />
              </div>

              <span className="text-[9px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
