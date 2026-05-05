"use client";

import React, { useState, useEffect } from 'react';
import { Activity, Users, Lock, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/api/api';

export default function Leaderboard() {
  const [scope, setScope] = useState<'private' | 'global'>('private');
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [playerType, setPlayerType] = useState<string | undefined>(undefined);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError('');
      try {
        const userId = localStorage.getItem('gels_user_id'); // Get the logged-in user's ID
        let currentPType = playerType;

        if (scope === 'private' && !currentPType && userId) {
          const profile = await api.gamification.getProfile(userId);
          currentPType = profile.player_type;
          setPlayerType(currentPType);
        }

        const data = await api.gamification.getLeaderboard(scope, currentPType);
        
        // Map backend data to UI format
        const formattedData = data.entries.map((entry: any, index: number) => {
          // Check if this row belongs to the logged-in user
          const isMe = entry.user_id === userId; 

          return {
            rank: index + 1,
            user: isMe ? `${entry.username} (You)` : entry.username, // Append "(You)"
            xp: entry.xp,
            badges: Math.floor(entry.xp / 1000),
            isCurrentUser: isMe // Triggers the blue UI highlight
          };
        });

        setLeaderboardData(formattedData);

      } catch (err: any) {
        console.error("Failed to load leaderboard:", err);
        setError("Failed to sync rankings. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [scope, playerType]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 px-4 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="border-b-4 border-slate-200 pb-6">
        <h1 className="text-4xl font-black text-slate-700 uppercase tracking-tight">Rankings</h1>
        <p className="text-slate-500 font-bold mt-2 text-lg">See how you stack up against your cohort</p>
      </div>

      {/* Chunky Tabs for Scope Toggling */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <button 
          onClick={() => setScope('private')}
          className={`flex-1 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all border-b-4 flex items-center justify-center gap-3 ${
            scope === 'private' 
              ? 'bg-[#1CB0F6] text-white border-[#1899D6] active:translate-y-1 active:border-b-0' 
              : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50 hover:text-slate-500'
          }`}
        >
          <Lock size={20} strokeWidth={3} /> Private Bracket
        </button>
        <button 
          onClick={() => setScope('global')}
          className={`flex-1 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all border-b-4 flex items-center justify-center gap-3 ${
            scope === 'global' 
              ? 'bg-[#1CB0F6] text-white border-[#1899D6] active:translate-y-1 active:border-b-0' 
              : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50 hover:text-slate-500'
          }`}
        >
          <Users size={20} strokeWidth={3} /> Global Class
        </button>
      </div>

      {/* States */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="animate-spin mb-4 text-[#1CB0F6]" size={40} strokeWidth={3} />
          <h2 className="font-black tracking-widest uppercase text-sm">Calculating Ranks...</h2>
        </div>
      ) : error ? (
        <div className="bg-[#FF4B4B]/10 text-[#FF4B4B] p-6 rounded-3xl border-2 border-[#FF4B4B]/20 flex flex-col items-center text-center">
          <AlertCircle size={40} strokeWidth={2.5} className="mb-3" />
          <p className="font-bold">{error}</p>
        </div>
      ) : leaderboardData.length === 0 ? (
        <div className="p-10 border-2 border-slate-200 border-dashed rounded-3xl text-center text-slate-400 font-bold">
          No users found in this bracket yet.
        </div>
      ) : (
        /* 3D Leaderboard List */
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
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xl border-b-4 shrink-0 ${
                  row.rank === 1 ? 'bg-[#FFD900] text-yellow-800 border-yellow-500' :
                  row.rank === 2 ? 'bg-slate-300 text-slate-600 border-slate-400' :
                  row.rank === 3 ? 'bg-[#FF9600] text-orange-900 border-[#D97A00]' :
                  'bg-transparent border-transparent text-slate-400'
                }`}>
                  {row.rank <= 3 ? row.rank : `#${row.rank}`}
                </div>
                
                <span className={`font-black text-lg sm:text-xl truncate max-w-[120px] sm:max-w-[200px] ${row.isCurrentUser ? 'text-[#1CB0F6]' : 'text-slate-700'}`}>
                  {row.user}
                </span>
              </div>

              <div className="flex items-center gap-6 shrink-0">
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
      )}
      
      {/* System Note */}
      {scope === 'private' && !isLoading && !error && (
        <div className="bg-[#DDF4FF]/50 border-2 border-[#1CB0F6]/30 p-5 rounded-2xl flex items-start gap-4 mt-8">
          <Activity size={24} strokeWidth={3} className="text-[#1CB0F6] shrink-0 mt-0.5" />
          <p className="text-sm font-bold text-slate-500 leading-relaxed">
            <strong className="text-[#1CB0F6] uppercase tracking-wider mr-2">System Note:</strong> 
            You are currently in the Private Bracket. The system filters peers based on your Player Type profile to ensure healthy competition.
          </p>
        </div>
      )}
    </div>
  );
}