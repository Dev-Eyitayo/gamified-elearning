"use client";

import React, { useState, useEffect } from 'react';
import { Zap, Clock, Target, Gift, Clock4, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/api/api';

export default function QuestsPage() {
  // Dynamic State for Daily Quests
  const [dailyQuests, setDailyQuests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Static Mock Data for Monthly mechanics (MVP)
  const monthlyQuest = {
    month: "MAY",
    title: "May Quest",
    daysLeft: 27,
    task: "Complete 35 quests",
    current: 1,
    total: 35
  };

  const monthlyBadges = [
    { id: 1, title: "February Quest", date: "February 2026", color: "bg-[#58CC02]" },
    { id: 2, title: "January Quest", date: "January 2026", color: "bg-[#1CB0F6]" },
    { id: 3, title: "Lily's Haunted House", date: "October 2025", color: "bg-[#CE82FF]" },
    { id: 4, title: "Duocon 2025", date: "September 2025", color: "bg-[#FF9600]" },
  ];

  // Fetch real quests from the backend on mount
  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const data = await api.gamification.getQuests();
        setDailyQuests(data);
      } catch (err: any) {
        console.error("Failed to load quests:", err);
        setError("Failed to sync quests from the Affective Engine.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuests();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center font-sans text-slate-400">
        <Loader2 className="animate-spin mb-4 text-[#FF9600]" size={48} strokeWidth={3} />
        <h2 className="font-black tracking-widest uppercase">Loading Quests...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center font-sans">
        <div className="bg-[#FF4B4B]/10 text-[#FF4B4B] p-6 rounded-3xl border-2 border-[#FF4B4B]/20 flex flex-col items-center text-center max-w-md">
          <AlertCircle size={48} strokeWidth={2.5} className="mb-4" />
          <h2 className="font-black text-xl mb-2">Quest Error</h2>
          <p className="font-bold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 py-8 px-4 animate-in fade-in duration-500">
      
      {/* LEFT COLUMN: The Quests */}
      <div className="flex-1 space-y-8">
        
        {/* Massive Monthly Quest Block (Static UI) */}
        <div className="bg-[#FF66AA] rounded-3xl p-6 shadow-[0_6px_0_0_#D94482]">
          <div className="bg-white/20 w-fit px-3 py-1 rounded-xl mb-4">
            <span className="text-white font-black uppercase tracking-widest text-sm">{monthlyQuest.month}</span>
          </div>
          
          <h1 className="text-3xl font-black text-white mb-1">{monthlyQuest.title}</h1>
          <p className="text-white/80 font-black uppercase tracking-widest text-sm flex items-center gap-1.5 mb-8">
            <Clock4 size={16} strokeWidth={3} /> {monthlyQuest.daysLeft} DAYS
          </p>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-slate-700 font-black text-lg mb-4">{monthlyQuest.task}</h3>
            <div className="relative w-full h-6 bg-slate-200 rounded-full overflow-hidden flex items-center">
              <div 
                className="absolute top-0 left-0 h-full bg-[#FF66AA] rounded-full transition-all"
                style={{ width: `${(monthlyQuest.current / monthlyQuest.total) * 100}%` }}
              ></div>
              <span className="absolute w-full text-center text-xs font-black text-slate-600 tracking-widest z-10">
                {monthlyQuest.current} / {monthlyQuest.total}
              </span>
            </div>
          </div>
        </div>

        {/* Daily Quests List (DYNAMIC) */}
        <div>
          <div className="flex justify-between items-end mb-4 px-2">
            <h2 className="text-2xl font-black text-slate-700">Daily Quests</h2>
            <span className="text-[#FF9600] font-black uppercase tracking-widest text-sm flex items-center gap-1.5">
              <Clock4 size={18} strokeWidth={3} /> 2 HOURS
            </span>
          </div>

          <div className="border-2 border-slate-200 rounded-3xl bg-white shadow-[0_6px_0_0_#E5E5E5] divide-y-2 divide-slate-100 overflow-hidden">
            {dailyQuests.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-bold">
                No active quests at the moment. Tell your instructor to create some!
              </div>
            ) : (
              dailyQuests.map((quest, index) => {
                // Dynamically assign an icon based on the index to make it look diverse
                const icons = [
                  <Zap key={`icon-1`} size={32} className="text-[#FFD900]" fill="currentColor" />,
                  <Target key={`icon-2`} size={32} className="text-[#58CC02]" fill="currentColor" />,
                  <Clock key={`icon-3`} size={32} className="text-[#1CB0F6]" fill="currentColor" />
                ];
                const QuestIcon = icons[index % icons.length];
                
                // For MVP, we mock progress as 0 out of the total XP reward.
                // In production, this would read from a user_quest progress table.
                const currentProgress = 0;
                const totalGoal = quest.reward_xp;
                const isDone = currentProgress >= totalGoal;

                return (
                  <div key={quest.id} className="p-6 flex items-center gap-6">
                    {/* Quest Icon */}
                    <div className="shrink-0">
                      {QuestIcon}
                    </div>

                    {/* Quest Details & Progress */}
                    <div className="flex-1">
                      <h3 className="font-black text-slate-700 text-lg mb-1">{quest.title}</h3>
                      <p className="font-bold text-slate-400 text-sm mb-3">{quest.description}</p>
                      
                      <div className="flex items-center gap-4">
                        <div className="relative flex-1 h-5 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`absolute top-0 left-0 h-full rounded-full transition-all ${isDone ? 'bg-[#FFD900]' : 'bg-[#FFD900]'}`}
                            style={{ width: `${(currentProgress / totalGoal) * 100}%` }}
                          ></div>
                          <span className="absolute w-full top-0.5 text-center text-[10px] font-black text-yellow-900 tracking-widest z-10">
                            {currentProgress} / {totalGoal} XP
                          </span>
                        </div>
                        {/* Chest Icon */}
                        <Gift 
                          size={28} 
                          strokeWidth={2.5} 
                          className={isDone ? "text-[#FF9600]" : "text-slate-300"} 
                          fill={isDone ? "#FFD900" : "transparent"} 
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Monthly Badges Sidebar (Static UI) */}
      <div className="w-full lg:w-[350px]">
        <div className="border-2 border-slate-200 rounded-3xl p-6 shadow-[0_6px_0_0_#E5E5E5] bg-white">
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-slate-700">Monthly Badges</h2>
            <button className="text-[#1CB0F6] font-black uppercase tracking-widest text-xs hover:text-[#1899D6]">
              VIEW ALL
            </button>
          </div>

          <div className="space-y-6">
            {monthlyBadges.map((badge) => (
              <div key={badge.id} className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full ${badge.color} flex items-center justify-center border-b-4 border-black/20 shrink-0`}>
                  <Calendar size={24} className="text-white" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="font-black text-slate-700">{badge.title}</h3>
                  <p className="text-sm font-bold text-slate-400">{badge.date}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}