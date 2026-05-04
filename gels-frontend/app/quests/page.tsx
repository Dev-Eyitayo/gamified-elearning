import React from 'react';
import { Zap, Clock, Target, Gift, Clock4, Calendar } from 'lucide-react';

export default function QuestsPage() {
  // Mock Data mapped to the screenshot
  const monthlyQuest = {
    month: "MAY",
    title: "May Quest",
    daysLeft: 27,
    task: "Complete 35 quests",
    current: 1,
    total: 35
  };

  const dailyQuests = [
    { id: 1, title: "Earn 10 XP", current: 10, total: 10, icon: <Zap size={32} className="text-[#FFD900]" fill="currentColor" />, isDone: true },
    { id: 2, title: "Get 5 in a row correct in 2 modules", current: 1, total: 2, icon: <Target size={32} className="text-[#58CC02]" fill="currentColor" />, isDone: false },
    { id: 3, title: "Spend 10 minutes learning", current: 1, total: 10, icon: <Clock size={32} className="text-[#1CB0F6]" fill="currentColor" />, isDone: false },
  ];

  const monthlyBadges = [
    { id: 1, title: "February Quest", date: "February 2026", color: "bg-[#58CC02]" },
    { id: 2, title: "January Quest", date: "January 2026", color: "bg-[#1CB0F6]" },
    { id: 3, title: "Lily's Haunted House", date: "October 2025", color: "bg-[#CE82FF]" },
    { id: 4, title: "Duocon 2025", date: "September 2025", color: "bg-[#FF9600]" },
  ];

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 py-8 px-4">
      
      {/* LEFT COLUMN: The Quests */}
      <div className="flex-1 space-y-8">
        
        {/* Massive Monthly Quest Block */}
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

        {/* Daily Quests List */}
        <div>
          <div className="flex justify-between items-end mb-4 px-2">
            <h2 className="text-2xl font-black text-slate-700">Daily Quests</h2>
            <span className="text-[#FF9600] font-black uppercase tracking-widest text-sm flex items-center gap-1.5">
              <Clock4 size={18} strokeWidth={3} /> 2 HOURS
            </span>
          </div>

          <div className="border-2 border-slate-200 rounded-3xl bg-white shadow-[0_6px_0_0_#E5E5E5] divide-y-2 divide-slate-100">
            {dailyQuests.map((quest) => (
              <div key={quest.id} className="p-6 flex items-center gap-6">
                {/* Quest Icon */}
                <div className="shrink-0">
                  {quest.icon}
                </div>

                {/* Quest Details & Progress */}
                <div className="flex-1">
                  <h3 className="font-black text-slate-700 text-lg mb-3">{quest.title}</h3>
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1 h-5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`absolute top-0 left-0 h-full rounded-full transition-all ${quest.isDone ? 'bg-[#FFD900]' : 'bg-[#FFD900]'}`}
                        style={{ width: `${(quest.current / quest.total) * 100}%` }}
                      ></div>
                      <span className="absolute w-full top-0.5 text-center text-[10px] font-black text-yellow-900 tracking-widest z-10">
                        {quest.current} / {quest.total}
                      </span>
                    </div>
                    {/* Chest Icon */}
                    <Gift 
                      size={28} 
                      strokeWidth={2.5} 
                      className={quest.isDone ? "text-[#FF9600]" : "text-slate-300"} 
                      fill={quest.isDone ? "#FFD900" : "transparent"} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Monthly Badges Sidebar */}
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