"use client";

import React, { useState, useEffect } from 'react';
import { Shield, Flame, Zap, Trophy, Moon, Compass, Dumbbell, Target, Clock, Star, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/api/api';

// Dynamic Icon Mapper
const IconMap: any = {
  Shield, Flame, Zap, Trophy, Moon, Compass, Dumbbell, Target, Clock, Star
};

export default function AchievementsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [awards, setAwards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAchievementsData = async () => {
      try {
        const userId = localStorage.getItem('gels_user_id');
        if (!userId) return;

        // Fetch real XP/Streak data and real Awards concurrently
        const [profileData, awardsData] = await Promise.all([
          api.gamification.getProfile(userId),
          api.gamification.getAchievements(userId)
        ]);

        setProfile(profileData);
        setAwards(awardsData);
      } catch (err: any) {
        console.error("Failed to fetch achievements:", err);
        setError("Failed to sync data. Please refresh.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAchievementsData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center font-sans text-slate-400">
        <Loader2 className="animate-spin mb-4 text-[#FFD900]" size={48} strokeWidth={3} />
        <h2 className="font-black tracking-widest uppercase">Loading Trophies...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center font-sans">
        <div className="bg-[#FF4B4B]/10 text-[#FF4B4B] p-6 rounded-3xl border-2 border-[#FF4B4B]/20 flex flex-col items-center text-center max-w-md">
          <AlertCircle size={48} strokeWidth={2.5} className="mb-4" />
          <h2 className="font-black text-xl mb-2">Sync Error</h2>
          <p className="font-bold">{error}</p>
        </div>
      </div>
    );
  }

  // Map Backend Profile Data to the Personal Records format
  const personalRecords = [
    { id: 1, title: "Highest League", value: "#1", date: "Current", icon: <Shield size={48} strokeWidth={2} />, color: "text-[#1CB0F6]", bg: "bg-[#DDF4FF]", border: "border-[#1CB0F6]" },
    { id: 2, title: "Longest Streak", value: profile?.streak_days || "0", date: "Current", icon: <Flame size={48} strokeWidth={2} />, color: "text-[#FF9600]", bg: "bg-[#FF9600]/10", border: "border-[#FF9600]" },
    { id: 3, title: "Total XP", value: profile?.xp_total || "0", date: "All Time", icon: <Star size={48} strokeWidth={2} />, color: "text-[#FFD900]", bg: "bg-[#FFD900]/10", border: "border-[#FFD900]" },
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-12 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="border-b-4 border-slate-200 pb-4">
        <h1 className="text-3xl font-black text-slate-700 uppercase tracking-tight">Achievements</h1>
      </div>

      {/* SECTION 1: Personal Records (Driven by Real Profile Data) */}
      <section>
        <h2 className="text-2xl font-black text-slate-700 mb-6 tracking-wide">Personal Records</h2>
        
        <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory hide-scrollbar">
          {personalRecords.map((record) => (
            <div 
              key={record.id} 
              className="snap-start shrink-0 w-44 p-5 rounded-3xl border-2 border-slate-200 shadow-[0_6px_0_0_#E5E5E5] bg-white flex flex-col items-center text-center transform transition-transform hover:-translate-y-1"
            >
              <div className="relative mb-8 mt-2">
                <div className={`absolute inset-0 blur-xl opacity-50 rounded-full ${record.bg}`}></div>
                <div className={`relative z-10 ${record.color}`}>
                  {record.icon}
                </div>
                <span className={`absolute -bottom-4 left-1/2 -translate-x-1/2 font-black text-xl px-3 py-0.5 rounded-xl border-2 bg-white z-20 ${record.color} ${record.border}`}>
                  {record.value}
                </span>
              </div>
              
              <h3 className="font-black text-slate-700 leading-tight mb-1">{record.title}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{record.date}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: Awards (Driven by Database endpoint) */}
      <section>
        <h2 className="text-2xl font-black text-slate-700 mb-6 tracking-wide">Awards</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10">
          {awards.map((award) => {
            const isCompleted = award.current === award.total;
            const IconComponent = IconMap[award.icon] || Trophy;

            return (
              <div key={award.id} className="flex flex-col items-center text-center group cursor-pointer">
                
                <div className="relative mb-4 transform transition-transform group-hover:scale-105 group-active:scale-95">
                  <div className={`w-28 h-28 rounded-full border-b-8 flex items-center justify-center ${
                    isCompleted 
                      ? `${award.bg} ${award.color} border-${award.color.replace('text-', '')}/30` 
                      : 'bg-slate-100 text-slate-300 border-slate-200 grayscale opacity-80'
                  }`}>
                    <IconComponent size={40} strokeWidth={2.5} fill="currentColor" />
                  </div>
                  
                  <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-2xl border-b-4 font-black text-lg tracking-widest text-white shadow-sm ${
                    isCompleted ? 'bg-[#1CB0F6] border-[#1899D6]' : 'bg-slate-300 border-slate-400'
                  }`}>
                    {award.metric}
                  </div>
                </div>

                <h3 className={`font-black text-lg leading-tight mt-2 ${isCompleted ? 'text-slate-700' : 'text-slate-500'}`}>
                  {award.title}
                </h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {award.current} of {award.total}
                </p>

              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}