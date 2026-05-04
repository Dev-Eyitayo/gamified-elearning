"use client";

import React, { useState } from 'react';
import { Edit2, Flame, Zap, Shield, Medal, ChevronRight, Search, Mail, UserPlus } from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'following' | 'followers'>('following');

  // Mock data matching the structure in the screenshot
  const profile = {
    name: "Chidera Eze",
    handle: "ChideraEze",
    joined: "January 2026",
    following: 7,
    followers: 28,
    stats: {
      streak: 1,
      xp: 33616,
      league: "Sapphire",
      top3: 11
    }
  };

  const friends = [
    { name: "Ade wale", xp: "66638 XP", initials: "AW", color: "bg-[#58CC02]" },
    { name: "Kanyin Emmanuel", xp: "38396 XP", initials: "KE", color: "bg-[#CE82FF]" },
    { name: "Ezekiel Eyitayo", xp: "19323 XP", initials: "EE", color: "bg-[#FF9600]" },
  ];

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 py-8 px-4">
      
      {/* LEFT COLUMN: Main Profile Info */}
      <div className="flex-1 space-y-8">
        
        {/* Avatar Banner Area */}
        <div>
          <div className="h-48 w-full bg-[#1CB0F6] rounded-3xl relative flex items-center justify-center mb-6">
            {/* Dashed Avatar Placeholder */}
            <div className="w-32 h-32 rounded-full border-4 border-dashed border-white/60 bg-[#149FDF] flex items-center justify-center transform translate-y-8">
               <UserPlus size={40} className="text-white opacity-80" strokeWidth={3} />
            </div>
            
            {/* Edit Button */}
            <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors">
              <Edit2 size={20} strokeWidth={3} />
            </button>
          </div>

          <div className="mt-12 px-2">
            <h1 className="text-3xl font-black text-slate-700">{profile.name}</h1>
            <p className="text-slate-500 font-bold text-lg">{profile.handle}</p>
            <p className="text-slate-400 font-bold mt-1">Joined {profile.joined}</p>
            
            <div className="flex items-center gap-6 mt-4">
              <button className="text-[#1CB0F6] font-black uppercase tracking-widest text-sm hover:text-[#1899D6] transition-colors">
                {profile.following} Following
              </button>
              <button className="text-[#1CB0F6] font-black uppercase tracking-widest text-sm hover:text-[#1899D6] transition-colors">
                {profile.followers} Followers
              </button>
            </div>
          </div>
        </div>

        <hr className="border-t-2 border-slate-200" />

        {/* Statistics Section */}
        <div>
          <h2 className="text-2xl font-black text-slate-700 mb-4">Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            
            {/* Streak */}
            <div className="border-2 border-slate-200 rounded-2xl p-4 flex items-center gap-4">
              <Flame size={28} strokeWidth={3} className="text-[#FF9600]" fill="currentColor" />
              <div>
                <div className="text-xl font-black text-slate-700">{profile.stats.streak}</div>
                <div className="text-sm font-bold text-slate-400">Day streak</div>
              </div>
            </div>

            {/* Total XP */}
            <div className="border-2 border-slate-200 rounded-2xl p-4 flex items-center gap-4">
              <Zap size={28} strokeWidth={3} className="text-[#FFD900]" fill="currentColor" />
              <div>
                <div className="text-xl font-black text-slate-700">{profile.stats.xp}</div>
                <div className="text-sm font-bold text-slate-400">Total XP</div>
              </div>
            </div>

            {/* League */}
            <div className="border-2 border-slate-200 rounded-2xl p-4 flex items-center gap-4">
              <Shield size={28} strokeWidth={3} className="text-[#1CB0F6]" fill="currentColor" />
              <div>
                <div className="text-xl font-black text-slate-700">{profile.stats.league}</div>
                <div className="text-sm font-bold text-slate-400">Current league</div>
              </div>
            </div>

            {/* Top 3 */}
            <div className="border-2 border-slate-200 rounded-2xl p-4 flex items-center gap-4">
              <Medal size={28} strokeWidth={3} className="text-[#FF9600]" fill="currentColor" />
              <div>
                <div className="text-xl font-black text-slate-700">{profile.stats.top3}</div>
                <div className="text-sm font-bold text-slate-400">Top 3 finishes</div>
              </div>
            </div>

          </div>
        </div>

        <hr className="border-t-2 border-slate-200" />

        {/* Achievements */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-700">Achievements</h2>
          <button className="text-[#1CB0F6] font-black uppercase tracking-widest text-sm hover:text-[#1899D6]">
            View All
          </button>
        </div>

      </div>

      {/* RIGHT COLUMN: Social Feed & Friends */}
      <div className="w-full lg:w-[350px] space-y-6">
        
        {/* Celebration Card */}
        <div className="border-2 border-slate-200 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#58CC02] flex items-center justify-center font-black text-white text-lg">
              AW
            </div>
            <div>
              <h3 className="font-black text-slate-700">Ade wale</h3>
              <p className="text-sm font-bold text-slate-400">6 days</p>
            </div>
          </div>
          
          <p className="font-bold text-slate-600 mb-4 leading-relaxed">
            Finished top 3 and was promoted to the Obsidian League!
          </p>
          
          <button className="w-full bg-white border-2 border-slate-200 text-[#1CB0F6] font-black uppercase tracking-widest py-3 rounded-2xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
            🎉 Celebrate
          </button>
        </div>

        {/* Following / Followers Tabs */}
        <div className="border-2 border-slate-200 rounded-2xl overflow-hidden">
          <div className="flex border-b-2 border-slate-200">
            <button 
              onClick={() => setActiveTab('following')}
              className={`flex-1 py-4 font-black uppercase tracking-widest text-sm border-b-4 transition-colors ${activeTab === 'following' ? 'border-[#1CB0F6] text-[#1CB0F6]' : 'border-transparent text-slate-400 hover:bg-slate-50'}`}
            >
              Following
            </button>
            <button 
              onClick={() => setActiveTab('followers')}
              className={`flex-1 py-4 font-black uppercase tracking-widest text-sm border-b-4 transition-colors ${activeTab === 'followers' ? 'border-[#1CB0F6] text-[#1CB0F6]' : 'border-transparent text-slate-400 hover:bg-slate-50'}`}
            >
              Followers
            </button>
          </div>
          
          <div className="p-2">
            {friends.map((friend, i) => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors">
                <div className={`w-12 h-12 rounded-full ${friend.color} flex items-center justify-center font-black text-white text-lg`}>
                  {friend.initials}
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-slate-700">{friend.name}</h4>
                  <p className="text-sm font-bold text-slate-400">{friend.xp}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full py-4 text-center font-black text-[#1CB0F6] uppercase tracking-widest text-sm border-t-2 border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-1">
            View 4 more <ChevronRight size={18} strokeWidth={3} />
          </button>
        </div>

        {/* Add Friends Section */}
        <div className="border-2 border-slate-200 rounded-2xl p-2">
          <h3 className="font-black text-slate-700 p-3 mb-1">Add friends</h3>
          
          <button className="w-full flex items-center justify-between p-3 hover:bg-slate-100 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                <Search size={20} strokeWidth={3} />
              </div>
              <span className="font-black text-slate-700">Find friends</span>
            </div>
            <ChevronRight size={20} strokeWidth={3} className="text-slate-400" />
          </button>

          <button className="w-full flex items-center justify-between p-3 hover:bg-slate-100 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#58CC02]/20 flex items-center justify-center text-[#58CC02]">
                <Mail size={20} strokeWidth={3} />
              </div>
              <span className="font-black text-slate-700">Invite friends</span>
            </div>
            <ChevronRight size={20} strokeWidth={3} className="text-slate-400" />
          </button>
        </div>

      </div>
    </div>
  );
}