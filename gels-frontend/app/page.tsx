import React from 'react';
import { BrainCircuit, Star, Flame, Zap, Play, Trophy, Clock } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import QuestList from '@/components/dashboard/QuestList';

export default function LearnerDashboard() {
  const affectiveState = { level: 4, xp: 3450, streak: 12, playerType: "ACHIEVER" };
  const cognitiveState = { module: "Advanced Data Structures: Trees", action: "SIMPLIFIED", estMins: 25 };

  const quests = [
    { id: '1', title: 'Flawless Victory', xp: 500, description: 'Complete the next module without any compilation errors.', progress: 0, isClaimable: false },
    { id: '2', title: 'Weekend Warrior', xp: 250, description: 'Log in and complete at least one task on Saturday.', progress: 100, isClaimable: true }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-4 px-4">
      
      {/* 1. Stat Cards Row (Using the new chunky StatCard component) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Current Level" 
          value={`Level ${affectiveState.level}`} 
          icon={<Star size={32} strokeWidth={3} />} 
          iconColorClass="text-[#FF9600]" 
          iconBgClass="bg-[#FF9600]/10" 
          borderColorClass="border-[#FF9600]/20"
        />
        <StatCard 
          title="Total XP" 
          value={affectiveState.xp} 
          subtext={<span className="text-[#1CB0F6]">1,550 to Level 5</span>}
          icon={<Zap size={32} strokeWidth={3} />} 
          iconColorClass="text-[#1CB0F6]" 
          iconBgClass="bg-[#1CB0F6]/10" 
          borderColorClass="border-[#1CB0F6]/20"
        />
        <StatCard 
          title="Day Streak" 
          value={affectiveState.streak} 
          subtext={<span className="text-[#FF4B4B] flex items-center gap-1"><Flame size={14} fill="currentColor"/> +20% Bonus</span>}
          icon={<Flame size={32} strokeWidth={3} />} 
          iconColorClass="text-[#FF4B4B]" 
          iconBgClass="bg-[#FF4B4B]/10" 
          borderColorClass="border-[#FF4B4B]/20"
        />
        <StatCard 
          title="Player Profile" 
          value={affectiveState.playerType} 
          icon={<BrainCircuit size={32} strokeWidth={3} />} 
          iconColorClass="text-[#CE82FF]" 
          iconBgClass="bg-[#CE82FF]/10" 
          borderColorClass="border-[#CE82FF]/20"
        />
      </div>

      {/* 2. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Cognitive Engine (Current Lesson) */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <BrainCircuit size={32} strokeWidth={3} className="text-[#1CB0F6]" />
            <h2 className="text-2xl font-black text-slate-700 uppercase tracking-widest">Up Next</h2>
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-3xl flex flex-col shadow-[0_8px_0_0_#E5E5E5] overflow-hidden">
            <div className="p-6 border-b-2 border-slate-100 flex justify-between items-center bg-[#DDF4FF]/30">
              <span className="text-sm font-black text-[#1CB0F6] uppercase tracking-widest">Module 4.2</span>
              <span className="bg-[#CE82FF]/10 text-[#CE82FF] text-xs px-4 py-2 rounded-xl font-black flex items-center gap-2 uppercase tracking-widest border-2 border-[#CE82FF]/20">
                 <BrainCircuit size={16} strokeWidth={3} /> AI Adapted: {cognitiveState.action}
              </span>
            </div>
            
            <div className="p-8 sm:p-10 flex flex-col justify-center flex-1">
              <h3 className="text-3xl sm:text-4xl font-black text-slate-700 mb-6 leading-tight">
                {cognitiveState.module}
              </h3>
              <p className="text-slate-500 font-bold max-w-xl mb-10 leading-relaxed text-lg">
                Based on your recent quiz scores, we've removed the heavy theoretical reading and replaced it with a hands-on interactive coding sandbox to help you grasp the concepts faster.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Massive 3D Start Button */}
                <button className="w-full sm:w-auto bg-[#58CC02] text-white px-10 py-4 rounded-2xl text-lg font-black uppercase tracking-widest transition-all border-b-4 border-[#46A302] hover:bg-[#46A302] active:translate-y-1 active:border-b-0 flex items-center justify-center gap-3 shadow-sm">
                  <Play size={24} strokeWidth={3} fill="currentColor" /> Start Lesson
                </button>
                <span className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Clock size={18} strokeWidth={3} /> {cognitiveState.estMins} mins
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Affective Engine (Active Quests) */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <Trophy size={32} strokeWidth={3} className="text-[#FF9600]" />
            <h2 className="text-2xl font-black text-slate-700 uppercase tracking-widest">Daily Quests</h2>
          </div>
          
          {/* We don't wrap this in a card because the QuestList items already have massive borders and 3D shadows */}
          <div className="flex-1">
            <QuestList quests={quests} />
          </div>
        </div>

      </div>
    </div>
  );
}