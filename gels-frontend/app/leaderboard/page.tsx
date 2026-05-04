import React from 'react';
import { Activity, Users, Lock, Medal } from 'lucide-react';

export default function Leaderboard() {
  const leaderboardData = [
    { rank: 1, user: "Alex_Dev", xp: 12450, badges: 14, isCurrentUser: false },
    { rank: 2, user: "CodeNinja99", xp: 11200, badges: 12, isCurrentUser: false },
    { rank: 3, user: "Chidera (You)", xp: 10850, badges: 10, isCurrentUser: true },
    { rank: 4, user: "Sarah_Scripts", xp: 9500, badges: 8, isCurrentUser: false },
    { rank: 5, user: "ByteMe", xp: 8900, badges: 7, isCurrentUser: false },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 px-4">
      
      {/* Header */}
      <div className="border-b-4 border-slate-200 pb-6">
        <h1 className="text-4xl font-black text-slate-700 uppercase tracking-tight">Rankings</h1>
        <p className="text-slate-500 font-bold mt-2 text-lg">See how you stack up against your cohort</p>
      </div>

      {/* Chunky Tabs */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button className="flex-1 bg-[#1CB0F6] text-white px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all border-b-4 border-[#1899D6] hover:bg-[#149FDF] active:translate-y-1 active:border-b-0 flex items-center justify-center gap-3">
          <Lock size={20} strokeWidth={3} /> Private Bracket
        </button>
        <button className="flex-1 bg-white text-slate-400 border-2 border-slate-200 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all hover:bg-slate-50 hover:text-slate-500 active:translate-y-1 active:border-b-0 flex items-center justify-center gap-3">
          <Users size={20} strokeWidth={3} /> Global Class
        </button>
      </div>

      {/* 3D Leaderboard List */}
      <div className="space-y-4">
        {leaderboardData.map((row) => (
          <div 
            key={row.rank} 
            className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all transform hover:-translate-y-1 ${
              row.isCurrentUser 
                ? 'bg-[#DDF4FF] border-[#1CB0F6] shadow-[0_6px_0_0_#1CB0F6]' 
                : 'bg-white border-slate-200 shadow-[0_6px_0_0_#E5E5E5]'
            }`}
          >
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Rank Bubble */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl border-b-4 ${
                row.rank === 1 ? 'bg-[#FFD900] text-yellow-800 border-yellow-500' :
                row.rank === 2 ? 'bg-slate-300 text-slate-600 border-slate-400' :
                row.rank === 3 ? 'bg-[#FF9600] text-orange-900 border-[#D97A00]' :
                'bg-transparent border-transparent text-slate-400'
              }`}>
                {row.rank <= 3 ? row.rank : `#${row.rank}`}
              </div>
              
              <span className={`font-black text-lg sm:text-xl ${row.isCurrentUser ? 'text-[#1CB0F6]' : 'text-slate-700'}`}>
                {row.user}
              </span>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden sm:flex flex-col items-end">
                <span className="font-black text-slate-400 uppercase tracking-widest text-xs">Badges</span>
                <span className="font-bold text-slate-600">{row.badges}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-black text-[#FF9600] uppercase tracking-widest text-xs">Total XP</span>
                <span className="font-black text-slate-700 text-lg">{row.xp.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* System Note */}
      <div className="bg-[#DDF4FF]/50 border-2 border-[#1CB0F6]/30 p-5 rounded-2xl flex items-start gap-4 mt-8">
        <Activity size={24} strokeWidth={3} className="text-[#1CB0F6] shrink-0 mt-0.5" />
        <p className="text-sm font-bold text-slate-500 leading-relaxed">
          <strong className="text-[#1CB0F6] uppercase tracking-wider mr-2">System Note:</strong> 
          You are currently in the Private Bracket. The system only shows peers within 15% of your current knowledge level to ensure healthy competition.
        </p>
      </div>
    </div>
  );
}