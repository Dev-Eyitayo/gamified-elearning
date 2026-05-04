import React from 'react';
import { Shield, Trophy, Users, Zap } from 'lucide-react';

export default function GamificationSettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-slate-700 uppercase tracking-tight">Affective Engine Rules</h1>
        <p className="text-slate-500 font-bold mt-1">Configure gamification mechanics for Cohort 400L.</p>
      </div>

      <div className="space-y-6">
        
        {/* Toggle Card 1 */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-[0_6px_0_0_#E5E5E5] flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
          <div className="flex gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FF9600]/10 text-[#FF9600] flex items-center justify-center border-2 border-[#FF9600]/20 shrink-0">
              <Trophy size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-black text-slate-700 text-xl">Global Leaderboards</h3>
              <p className="text-sm font-bold text-slate-500 mt-1">Allow students to see public cohort rankings.</p>
              <span className="inline-block mt-2 text-xs font-black text-[#FF4B4B] uppercase tracking-widest bg-[#FF4B4B]/10 px-2 py-1 rounded-lg">High Anxiety Trigger</span>
            </div>
          </div>
          {/* Mock Duolingo Style Toggle (Off) */}
          <div className="w-16 h-8 bg-slate-200 rounded-full border-2 border-slate-300 relative cursor-pointer flex-shrink-0">
            <div className="absolute left-1 top-1 bottom-1 w-5 bg-white rounded-full shadow-sm"></div>
          </div>
        </div>

        {/* Toggle Card 2 */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-[0_6px_0_0_#E5E5E5] flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
          <div className="flex gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#58CC02]/10 text-[#58CC02] flex items-center justify-center border-2 border-[#58CC02]/20 shrink-0">
              <Users size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-black text-slate-700 text-xl">Team Quests</h3>
              <p className="text-sm font-bold text-slate-500 mt-1">Enable peer-collaboration missions.</p>
            </div>
          </div>
          {/* Mock Duolingo Style Toggle (On) */}
          <div className="w-16 h-8 bg-[#58CC02] rounded-full border-2 border-[#46A302] relative cursor-pointer flex-shrink-0">
            <div className="absolute right-1 top-1 bottom-1 w-5 bg-white rounded-full shadow-sm"></div>
          </div>
        </div>

        {/* Toggle Card 3 */}
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-[0_6px_0_0_#E5E5E5] flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
          <div className="flex gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#1CB0F6]/10 text-[#1CB0F6] flex items-center justify-center border-2 border-[#1CB0F6]/20 shrink-0">
              <Shield size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-black text-slate-700 text-xl">Dynamic Player Profiling</h3>
              <p className="text-sm font-bold text-slate-500 mt-1">Allow system to shift player-types based on behavior.</p>
            </div>
          </div>
          {/* Mock Duolingo Style Toggle (On) */}
          <div className="w-16 h-8 bg-[#1CB0F6] rounded-full border-2 border-[#1899D6] relative cursor-pointer flex-shrink-0">
            <div className="absolute right-1 top-1 bottom-1 w-5 bg-white rounded-full shadow-sm"></div>
          </div>
        </div>

      </div>
    </div>
  );
}