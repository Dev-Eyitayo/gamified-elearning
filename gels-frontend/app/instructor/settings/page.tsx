"use client";

import React, { useState } from 'react';
import { Shield, Trophy, Users, CalendarClock, Zap } from 'lucide-react';

export default function GamificationSettingsPage() {
  const [toggles, setToggles] = useState({
    leagues: true,
    weeklyReset: true,
    quests: true,
  });

  const toggleSetting = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-500 font-sans">
      <div className="border-b-4 border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-700 uppercase tracking-tight">Gamification Rules</h1>
        <p className="text-slate-500 font-bold mt-1">Configure leagues, cohorts, and weekly resets for the class.</p>
      </div>

      <div className="space-y-6">
        
        {/* Toggle 1: 10-Tier Leagues */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-[0_6px_0_0_#E5E5E5] flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between transition-colors hover:border-slate-300">
          <div className="flex gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 shrink-0 transition-colors ${toggles.leagues ? 'bg-[#FFD900]/10 text-[#FFD900] border-[#FFD900]/20' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
              <Trophy size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-black text-slate-700 text-xl">10-Tier League System</h3>
              <p className="text-sm font-bold text-slate-500 mt-1">Enable Bronze through Diamond competitive brackets.</p>
            </div>
          </div>
          <div 
            onClick={() => toggleSetting('leagues')}
            className={`w-16 h-8 rounded-full border-2 relative cursor-pointer flex-shrink-0 transition-colors duration-300 ${toggles.leagues ? 'bg-[#58CC02] border-[#46A302]' : 'bg-slate-200 border-slate-300'}`}
          >
            <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ease-spring ${toggles.leagues ? 'translate-x-8' : 'translate-x-1'}`}></div>
          </div>
        </div>

        {/* Toggle 2: Weekly Reset */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-[0_6px_0_0_#E5E5E5] flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between transition-colors hover:border-slate-300">
          <div className="flex gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 shrink-0 transition-colors ${toggles.weeklyReset ? 'bg-[#FF4B4B]/10 text-[#FF4B4B] border-[#FF4B4B]/20' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
              <CalendarClock size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-black text-slate-700 text-xl">Sunday Midnight Resets</h3>
              <p className="text-sm font-bold text-slate-500 mt-1">Automatically clear Weekly XP and evaluate Promotes/Demotes.</p>
              <span className="inline-block mt-2 text-xs font-black text-[#FF4B4B] uppercase tracking-widest bg-[#FF4B4B]/10 px-2 py-1 rounded-lg">High Anxiety Trigger</span>
            </div>
          </div>
          <div 
            onClick={() => toggleSetting('weeklyReset')}
            className={`w-16 h-8 rounded-full border-2 relative cursor-pointer flex-shrink-0 transition-colors duration-300 ${toggles.weeklyReset ? 'bg-[#58CC02] border-[#46A302]' : 'bg-slate-200 border-slate-300'}`}
          >
            <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ease-spring ${toggles.weeklyReset ? 'translate-x-8' : 'translate-x-1'}`}></div>
          </div>
        </div>

      </div>
    </div>
  );
}