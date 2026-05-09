"use client";

import React, { useState, useEffect } from 'react';
import { Search, Bell, Flame } from 'lucide-react'; // Added Flame icon
import Link from 'next/link';
import { api } from '@/api/api';

export default function TopNav() {
  const [initial, setInitial] = useState('U');
  const [streak, setStreak] = useState(0); // 🔥 New state for streak
  const [hasUnread, setHasUnread] = useState(false);

useEffect(() => {
  const fetchNavData = async () => {
    try {
      const userId = localStorage.getItem('gels_user_id');
      if (userId && userId !== "undefined") {
        const profile = await api.gamification.getProfile(userId);
        
        if (profile) {
          setInitial(profile.username?.charAt(0).toUpperCase() || 'U');
          // 🔥 SYNC: This replaces the "waiting..." text with the real number
            setStreak(profile.streak_days ?? 0);
        }
      }
    } catch (e) {
      console.error("TopNav failed to sync", e);
    }
  };
  fetchNavData();
}, []);

  return (
    <header className="h-24 bg-white border-b-4 border-slate-200 flex items-center justify-between px-6 md:px-8 z-10 flex-shrink-0">
      <div className="flex items-center">
        <h1 className="text-xl font-black text-slate-300 uppercase tracking-widest hidden sm:block">Dashboard</h1>
      </div>
      
      <div className="flex items-center gap-6">
        {/* 🔥 STREAK DISPLAY */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-orange-50 border-2 border-orange-100 group">
          <Flame 
            size={24} 
            className={`${streak > 0 ? 'text-[#FF9600] fill-[#FF9600]' : 'text-slate-300'} transition-all group-hover:scale-110`} 
            strokeWidth={3} 
          />
          <span className={`font-black text-lg ${streak > 0 ? 'text-[#FF9600]' : 'text-slate-400'}`}>
            {streak}
          </span>
        </div>

        <Link 
          href="/notifications" 
          className="relative p-3 rounded-2xl border-2 border-transparent text-slate-400 hover:bg-slate-100 transition-all"
        >
          <Bell size={28} strokeWidth={3} />
          {hasUnread && <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-[#FF4B4B] border-2 border-white rounded-full"></span>}
        </Link>

        <Link 
          href="/profile"
          className="w-12 h-12 rounded-full bg-[#1CB0F6] flex items-center justify-center font-black text-xl text-white border-b-4 border-[#1899D6] hover:-translate-y-1 transition-all"
        >
          {initial}
        </Link>
      </div>
    </header>
  );
}