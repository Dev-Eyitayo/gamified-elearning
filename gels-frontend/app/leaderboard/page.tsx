"use client";

import React, { useState, useEffect } from 'react';
import { Trophy, Clock, Loader2, AlertCircle, ArrowUpCircle, ArrowDownCircle, Shield, ChevronUp, ChevronDown } from 'lucide-react';
import { api } from '@/api/api';

// --- LEAGUE CONSTANTS ---
const PROMOTION_ZONES: Record<string, number> = {
  "Bronze": 15, "Silver": 12, "Gold": 10, "Sapphire": 7, "Ruby": 5,
  "Emerald": 5, "Amethyst": 5, "Pearl": 4, "Obsidian": 4, "Diamond": 0
};

const LEAGUE_COLORS: Record<string, { bg: string, border: string, text: string, shadow: string }> = {
  "Bronze": { bg: "bg-[#CD7F32]/10", border: "border-[#CD7F32]", text: "text-[#CD7F32]", shadow: "shadow-[#CD7F32]/20" },
  "Silver": { bg: "bg-[#C0C0C0]/10", border: "border-[#C0C0C0]", text: "text-[#9CA3AF]", shadow: "shadow-[#C0C0C0]/20" },
  "Gold": { bg: "bg-[#FFD700]/10", border: "border-[#FFD700]", text: "text-[#D9A404]", shadow: "shadow-[#FFD700]/20" },
  "Sapphire": { bg: "bg-[#0F52BA]/10", border: "border-[#0F52BA]", text: "text-[#0F52BA]", shadow: "shadow-[#0F52BA]/20" },
  "Ruby": { bg: "bg-[#E0115F]/10", border: "border-[#E0115F]", text: "text-[#E0115F]", shadow: "shadow-[#E0115F]/20" },
  "Emerald": { bg: "bg-[#50C878]/10", border: "border-[#50C878]", text: "text-[#50C878]", shadow: "shadow-[#50C878]/20" },
  "Amethyst": { bg: "bg-[#9966CC]/10", border: "border-[#9966CC]", text: "text-[#9966CC]", shadow: "shadow-[#9966CC]/20" },
  "Pearl": { bg: "bg-[#EAE0C8]/20", border: "border-[#D1C7B1]", text: "text-[#B3A891]", shadow: "shadow-[#EAE0C8]/30" },
  "Obsidian": { bg: "bg-[#3B3C36]/10", border: "border-[#3B3C36]", text: "text-[#3B3C36]", shadow: "shadow-[#3B3C36]/20" },
  "Diamond": { bg: "bg-[#B9F2FF]/20", border: "border-[#1CB0F6]", text: "text-[#1CB0F6]", shadow: "shadow-[#1CB0F6]/20" }
};

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [currentLeague, setCurrentLeague] = useState<string>("Bronze");
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState<string>('');

  // 1. Fetch Cohort Data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError('');
      try {
        const userId = typeof window !== "undefined" ? localStorage.getItem('gels_user_id') : null;
        if (!userId) throw new Error("No user session found");

        const profile = await api.gamification.getProfile(userId);
        const league = profile.current_league || "Bronze";
        setCurrentLeague(league);

        const data = await api.gamification.getLeaderboard('global'); 
        
        let sortedEntries = data.entries || [];
        sortedEntries.sort((a: any, b: any) => b.xp - a.xp);

        const formattedData = sortedEntries.map((entry: any, index: number) => ({
          rank: index + 1,
          user: entry.user_id === userId ? `${entry.username} (You)` : entry.username,
          xp: entry.xp, 
          isCurrentUser: entry.user_id === userId
        }));

        setLeaderboardData(formattedData);
      } catch (err: any) {
        console.error("Failed to load leaderboard:", err);
        setError("Failed to sync rankings. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // 2. Countdown Timer to Sunday Midnight
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const nextSunday = new Date();
      nextSunday.setDate(now.getDate() + ((7 - now.getDay()) % 7 || 7));
      nextSunday.setHours(23, 59, 59, 999);

      const diff = nextSunday.getTime() - now.getTime();
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / 1000 / 60) % 60);

      setTimeLeft(`${d}d ${h}h ${m}m`);
    }, 60000); 

    const now = new Date();
    const nextSunday = new Date();
    nextSunday.setDate(now.getDate() + ((7 - now.getDay()) % 7 || 7));
    nextSunday.setHours(23, 59, 59, 999);
    const diff = nextSunday.getTime() - now.getTime();
    setTimeLeft(`${Math.floor(diff / (1000 * 60 * 60 * 24))}d ${Math.floor((diff / (1000 * 60 * 60)) % 24)}h ${Math.floor((diff / 1000 / 60) % 60)}m`);

    return () => clearInterval(timer);
  }, []);

  const theme = LEAGUE_COLORS[currentLeague] || LEAGUE_COLORS["Bronze"];
  
  // 🔥 CRITICAL FIX: Smart Math for Small Test Cohorts!
  const totalUsers = leaderboardData.length;
  
  // 1. Never demote more than 5, but protect small cohorts (max 1/3 demote so tests don't break)
  const demoteCount = currentLeague === "Bronze" ? 0 : Math.min(5, Math.floor(totalUsers / 3));
  
  // 2. Cap promotion so it never eats into the demotion zone
  const basePromotion = PROMOTION_ZONES[currentLeague] || 0;
  const promotionCutoff = Math.min(basePromotion, Math.max(0, totalUsers - demoteCount));
  
  // 3. Set the demotion cutoff safely
  const demotionCutoff = currentLeague === "Bronze" ? 999 : Math.max(promotionCutoff, totalUsers - demoteCount);

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-8 px-4 animate-in fade-in duration-500 font-sans">
      
      {/* Top Header & Timer */}
      <div className="flex flex-col items-center justify-center text-center mb-8 border-b-4 border-slate-200 pb-8">
        <div className={`w-24 h-24 rounded-3xl ${theme.bg} ${theme.border} border-b-8 flex items-center justify-center mb-6 transform -rotate-3`}>
          <Shield size={48} className={theme.text} strokeWidth={2.5} />
        </div>
        <h1 className={`text-4xl font-black uppercase tracking-tight mb-2 ${theme.text}`}>
          {currentLeague} League
        </h1>
        
        <div className="flex items-center gap-2 bg-slate-100 text-slate-500 px-4 py-2 rounded-xl font-bold uppercase tracking-widest text-sm border-2 border-slate-200 mt-2">
          <Clock size={18} strokeWidth={2.5} /> Ends in {timeLeft}
        </div>
      </div>

      {/* States */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="animate-spin mb-4 text-[#1CB0F6]" size={48} strokeWidth={3} />
          <h2 className="font-black tracking-widest uppercase">Syncing Cohort...</h2>
        </div>
      ) : error ? (
        <div className="bg-[#FF4B4B]/10 text-[#FF4B4B] p-6 rounded-3xl border-2 border-[#FF4B4B]/20 flex flex-col items-center text-center">
          <AlertCircle size={40} strokeWidth={2.5} className="mb-3" />
          <p className="font-bold">{error}</p>
        </div>
      ) : leaderboardData.length === 0 ? (
        <div className="p-10 border-2 border-slate-200 border-dashed rounded-3xl text-center text-slate-400 font-bold">
          No users found in this bracket. Complete a lesson to join a cohort!
        </div>
      ) : (
        /* The League List */
        <div className="space-y-3 relative pb-20">
          
          {leaderboardData.map((row, index) => {
            // 🔥 Uses our new protected cutoffs
            const isPromoting = index < promotionCutoff;
            const isDemoting = index >= demotionCutoff;

            return (
              <React.Fragment key={row.rank}>
                
                {/* PROMOTION DIVIDER */}
                {index === promotionCutoff && promotionCutoff > 0 && promotionCutoff < totalUsers && (
                  <div className="flex items-center gap-4 py-4 opacity-80">
                    <div className="flex-1 h-1 bg-[#58CC02] rounded-full"></div>
                    <div className="flex items-center gap-1 font-black text-[#58CC02] uppercase tracking-widest text-xs">
                      <ChevronUp size={16} strokeWidth={4} /> Promotion Zone
                    </div>
                    <div className="flex-1 h-1 bg-[#58CC02] rounded-full"></div>
                  </div>
                )}

                {/* DEMOTION DIVIDER */}
                {index === demotionCutoff && demotionCutoff < totalUsers && demotionCutoff !== promotionCutoff && (
                  <div className="flex items-center gap-4 py-4 opacity-80">
                    <div className="flex-1 h-1 bg-[#FF4B4B] rounded-full"></div>
                    <div className="flex items-center gap-1 font-black text-[#FF4B4B] uppercase tracking-widest text-xs">
                      <ChevronDown size={16} strokeWidth={4} /> Demotion Zone
                    </div>
                    <div className="flex-1 h-1 bg-[#FF4B4B] rounded-full"></div>
                  </div>
                )}

                {/* USER ROW */}
                <div 
                  className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl border-2 transition-all ${
                    row.isCurrentUser 
                      ? `bg-[#DDF4FF] border-[#1CB0F6] shadow-[0_4px_0_0_#1899D6] z-10 relative` 
                      : 'bg-white border-slate-200 hover:bg-slate-50 active:translate-y-[2px] active:shadow-none'
                  }`}
                >
                  <div className="flex items-center gap-4 sm:gap-6 w-full">
                    
                    {/* Rank Number */}
                    <div className={`w-10 font-black text-xl text-center shrink-0 ${
                      isPromoting && !row.isCurrentUser ? 'text-[#58CC02]' :
                      isDemoting && !row.isCurrentUser ? 'text-[#FF4B4B]' :
                      row.isCurrentUser ? 'text-[#1CB0F6]' : 'text-slate-400'
                    }`}>
                      {row.rank}
                    </div>

                    {/* Avatar Initial */}
                    <div className={`w-12 h-12 rounded-full hidden sm:flex items-center justify-center font-black text-white text-xl shrink-0 ${
                      row.isCurrentUser ? 'bg-[#1CB0F6]' : 'bg-slate-300'
                    }`}>
                      {row.user.charAt(0)}
                    </div>
                    
                    {/* Name */}
                    <span className={`font-black text-lg truncate flex-1 ${
                      row.isCurrentUser ? 'text-[#1CB0F6]' : 'text-slate-700'
                    }`}>
                      {row.user}
                    </span>

                    {/* Weekly XP */}
                    <div className="flex flex-col items-end shrink-0">
                      <span className="font-black text-slate-400 uppercase tracking-widest text-[10px] mb-0.5">Weekly XP</span>
                      <span className={`font-black text-lg ${
                        row.isCurrentUser ? 'text-[#1CB0F6]' : 'text-slate-700'
                      }`}>
                        {row.xp.toLocaleString()}
                      </span>
                    </div>

                    {/* Status Indicator Icon */}
                    <div className="w-6 shrink-0 flex justify-end">
                      {isPromoting && <ArrowUpCircle size={24} className={row.isCurrentUser ? 'text-[#1CB0F6]' : 'text-[#58CC02]'} strokeWidth={2.5} />}
                      {isDemoting && <ArrowDownCircle size={24} className={row.isCurrentUser ? 'text-[#1CB0F6]' : 'text-[#FF4B4B]'} strokeWidth={2.5} />}
                    </div>

                  </div>
                </div>

              </React.Fragment>
            );
          })}

        </div>
      )}
      
    </div>
  );
}