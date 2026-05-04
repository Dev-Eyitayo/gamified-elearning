import React from 'react';
import { Shield, Flame, Zap, Trophy, Moon, Compass, Dumbbell, Target, Clock, Star } from 'lucide-react';

export default function AchievementsPage() {
  // 1. Personal Records Data
  const personalRecords = [
    { id: 1, title: "Highest League", value: "#2", date: "Nov 12, 2026", icon: <Shield size={48} strokeWidth={2} />, color: "text-[#1CB0F6]", bg: "bg-[#DDF4FF]", border: "border-[#1CB0F6]" },
    { id: 2, title: "Longest Streak", value: "195", date: "Nov 12, 2026", icon: <Flame size={48} strokeWidth={2} />, color: "text-[#FF9600]", bg: "bg-[#FF9600]/10", border: "border-[#FF9600]" },
    { id: 3, title: "Most XP", value: "7031", date: "Sep 28, 2026", icon: <Star size={48} strokeWidth={2} />, color: "text-[#FFD900]", bg: "bg-[#FFD900]/10", border: "border-[#FFD900]" },
  ];

  // 2. Awards Data
  const awards = [
    { id: 1, title: "Legend", metric: "250", current: 10, total: 10, icon: <Trophy size={40} strokeWidth={2.5} fill="currentColor" />, color: "text-[#1CB0F6]", bg: "bg-[#DDF4FF]" },
    { id: 2, title: "Sleepwalker", metric: "50", current: 6, total: 10, icon: <Moon size={40} strokeWidth={2.5} fill="currentColor" />, color: "text-[#CE82FF]", bg: "bg-[#F3D9FF]" },
    { id: 3, title: "Quest Explorer", metric: "300", current: 7, total: 10, icon: <Compass size={40} strokeWidth={2.5} fill="currentColor" />, color: "text-[#FF9600]", bg: "bg-[#FFE8CC]" },
    { id: 4, title: "XP Olympian", metric: "30000", current: 10, total: 10, icon: <Dumbbell size={40} strokeWidth={2.5} fill="currentColor" />, color: "text-[#1CB0F6]", bg: "bg-[#DDF4FF]" },
    { id: 5, title: "Flawless Finisher", metric: "100", current: 5, total: 5, icon: <Target size={40} strokeWidth={2.5} fill="currentColor" />, color: "text-[#58CC02]", bg: "bg-[#D7FFB8]" },
    { id: 6, title: "Speed Racer", metric: "5000", current: 5, total: 5, icon: <Clock size={40} strokeWidth={2.5} fill="currentColor" />, color: "text-[#FF4B4B]", bg: "bg-[#FFD6D6]" },
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-12">
      
      {/* Header */}
      <div className="border-b-4 border-slate-200 pb-4">
        <h1 className="text-3xl font-black text-slate-700 uppercase tracking-tight">Achievements</h1>
      </div>

      {/* SECTION 1: Personal Records */}
      <section>
        <h2 className="text-2xl font-black text-slate-700 mb-6 tracking-wide">Personal Records</h2>
        
        {/* Horizontal Scrolling Container */}
        <div className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory hide-scrollbar">
          {personalRecords.map((record) => (
            <div 
              key={record.id} 
              className="snap-start shrink-0 w-44 p-5 rounded-3xl border-2 border-slate-200 shadow-[0_6px_0_0_#E5E5E5] bg-white flex flex-col items-center text-center transform transition-transform hover:-translate-y-1"
            >
              {/* Giant Icon with glowing background */}
              <div className="relative mb-8 mt-2">
                <div className={`absolute inset-0 blur-xl opacity-50 rounded-full ${record.bg}`}></div>
                <div className={`relative z-10 ${record.color}`}>
                  {record.icon}
                </div>
                {/* Floating Value Metric */}
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

      {/* SECTION 2: Awards */}
      <section>
        <h2 className="text-2xl font-black text-slate-700 mb-6 tracking-wide">Awards</h2>
        
        {/* Dense Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-10">
          {awards.map((award) => {
            const isCompleted = award.current === award.total;
            return (
              <div key={award.id} className="flex flex-col items-center text-center group cursor-pointer">
                
                {/* The Badge Graphic */}
                <div className="relative mb-4 transform transition-transform group-hover:scale-105 group-active:scale-95">
                  <div className={`w-28 h-28 rounded-full border-b-8 flex items-center justify-center ${
                    isCompleted 
                      ? `${award.bg} ${award.color} border-${award.color.replace('text-', '')}/30` 
                      : 'bg-slate-100 text-slate-300 border-slate-200 grayscale opacity-80'
                  }`}>
                    {award.icon}
                  </div>
                  
                  {/* The Bright Metric Pill at the bottom center */}
                  <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-2xl border-b-4 font-black text-lg tracking-widest text-white shadow-sm ${
                    isCompleted ? 'bg-[#1CB0F6] border-[#1899D6]' : 'bg-slate-300 border-slate-400'
                  }`}>
                    {award.metric}
                  </div>
                </div>

                {/* Badge Text */}
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