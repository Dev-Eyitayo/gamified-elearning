"use client";

import React, { useState, useEffect } from 'react';
import { BrainCircuit, Star, Flame, Zap, Play, Trophy, Clock, Loader2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import StatCard from '@/components/dashboard/StatCard';
import QuestList from '@/components/dashboard/QuestList';
import { api } from '@/api/api'; 

export default function LearnerDashboard() {
  const router = useRouter();

  // Dynamic Data States
  const [profile, setProfile] = useState<any>(null);
  const [nextModule, setNextModule] = useState<any>(null);
  const [quests, setQuests] = useState<any[]>([]);
  
  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userId = localStorage.getItem('gels_user_id');
        
        if (!userId) {
          router.push('/auth/login');
          return;
        }

        // Fetch all dashboard data concurrently for speed
        const [profileData, moduleData, questsData] = await Promise.all([
          api.gamification.getProfile(userId),
          api.learning.getNextModule(userId),
          api.gamification.getQuests()
        ]);

        setProfile(profileData);
        setNextModule(moduleData);
        setQuests(questsData);

      } catch (err: any) {
        console.error(err);
        setError('Failed to sync with GELS engines. Please refresh.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center font-sans text-slate-400">
        <Loader2 className="animate-spin mb-4 text-[#1CB0F6]" size={48} strokeWidth={3} />
        <h2 className="font-black tracking-widest uppercase">Syncing Engines...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center font-sans">
        <div className="bg-[#FF4B4B]/10 text-[#FF4B4B] p-6 rounded-3xl border-2 border-[#FF4B4B]/20 flex flex-col items-center text-center max-w-md">
          <AlertCircle size={48} strokeWidth={2.5} className="mb-4" />
          <h2 className="font-black text-xl mb-2">Connection Error</h2>
          <p className="font-bold">{error}</p>
        </div>
      </div>
    );
  }

  // Calculate XP needed for next level (Assuming 1000 XP per level for MVP)
  const xpForNextLevel = (profile.current_level * 1000) - profile.xp_total;

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-4 px-4 animate-in fade-in duration-500">
      
      {/* 1. Stat Cards Row (Affective Engine Output) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Current Level" 
          value={`Level ${profile.current_level}`} 
          icon={<Star size={32} strokeWidth={3} />} 
          iconColorClass="text-[#FF9600]" 
          iconBgClass="bg-[#FF9600]/10" 
          borderColorClass="border-[#FF9600]/20"
        />
        <StatCard 
          title="Total XP" 
          value={profile.xp_total} 
          subtext={<span className="text-[#1CB0F6]">{xpForNextLevel > 0 ? `${xpForNextLevel} to Level ${profile.current_level + 1}` : 'Max Level!'}</span>}
          icon={<Zap size={32} strokeWidth={3} />} 
          iconColorClass="text-[#1CB0F6]" 
          iconBgClass="bg-[#1CB0F6]/10" 
          borderColorClass="border-[#1CB0F6]/20"
        />
        <StatCard 
          title="Day Streak" 
          value={profile.streak_days} 
          subtext={profile.streak_days > 0 ? <span className="text-[#FF4B4B] flex items-center gap-1"><Flame size={14} fill="currentColor"/> Active</span> : <span className="text-slate-400">No streak</span>}
          icon={<Flame size={32} strokeWidth={3} />} 
          iconColorClass="text-[#FF4B4B]" 
          iconBgClass="bg-[#FF4B4B]/10" 
          borderColorClass="border-[#FF4B4B]/20"
        />
        <StatCard 
          title="Player Profile" 
          value={profile.player_type} 
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

          <div className="bg-white border-2 border-slate-200 rounded-3xl flex flex-col shadow-[0_8px_0_0_#E5E5E5] overflow-hidden transition-all hover:-translate-y-1">
            <div className="p-6 border-b-2 border-slate-100 flex justify-between items-center bg-[#DDF4FF]/30">
              <span className="text-sm font-black text-[#1CB0F6] uppercase tracking-widest">Adaptive Path</span>
              
              <span className={`text-xs px-4 py-2 rounded-xl font-black flex items-center gap-2 uppercase tracking-widest border-2 ${
                nextModule.action_taken === 'REMEDIATE' || nextModule.action_taken === 'SIMPLIFY' 
                  ? 'bg-[#FF9600]/10 text-[#FF9600] border-[#FF9600]/20'
                  : 'bg-[#CE82FF]/10 text-[#CE82FF] border-[#CE82FF]/20'
              }`}>
                 <BrainCircuit size={16} strokeWidth={3} /> AI Action: {nextModule.action_taken}
              </span>
            </div>
            
            <div className="p-8 sm:p-10 flex flex-col justify-center flex-1">
              <h3 className="text-3xl sm:text-4xl font-black text-slate-700 mb-6 leading-tight">
                {nextModule.title || "Continue Your Curriculum"}
              </h3>
              
              {/* Glass-Box AI Rationale displayed to the student */}
              <p className="text-slate-500 font-bold max-w-xl mb-10 leading-relaxed text-lg">
                <span className="text-slate-700 font-black">System Note:</span> {nextModule.rationale}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <button 
                  onClick={() => router.push('/lesson')}
                  className="w-full sm:w-auto bg-[#58CC02] text-white px-10 py-4 rounded-2xl text-lg font-black uppercase tracking-widest transition-all border-b-4 border-[#46A302] hover:bg-[#46A302] active:translate-y-1 active:border-b-0 flex items-center justify-center gap-3 shadow-sm"
                >
                  <Play size={24} strokeWidth={3} fill="currentColor" /> Start Lesson
                </button>
                <span className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Clock size={18} strokeWidth={3} /> {nextModule.estMins || '15'} mins
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
          
          <div className="flex-1">
            {quests.length > 0 ? (
              <QuestList quests={quests} />
            ) : (
              <div className="p-8 border-2 border-slate-200 border-dashed rounded-3xl text-center text-slate-400 font-bold">
                No active quests. Check back tomorrow!
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}