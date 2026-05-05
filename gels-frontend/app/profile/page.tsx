"use client";

import React, { useState, useEffect } from 'react';
import { Edit2, Flame, Zap, Shield, Medal, ChevronRight, Search, Mail, UserPlus, Loader2, AlertCircle, BrainCircuit, Users } from 'lucide-react';
import { api } from '@/api/api';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'following' | 'followers'>('following');
  
  // Dynamic States
  const [profileData, setProfileData] = useState<any>(null);
  const [socialData, setSocialData] = useState<{friends: any[], feed: any[]}>({ friends: [], feed: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userId = localStorage.getItem('gels_user_id');
        if (!userId) return;

        // Fetch both Personal Profile AND Social Cohort concurrently
        const [profileRes, socialRes] = await Promise.all([
          api.gamification.getProfile(userId),
          api.gamification.getSocialData(userId)
        ]);
        
        setProfileData(profileRes);
        setSocialData(socialRes);
      } catch (err: any) {
        console.error("Failed to load profile:", err);
        setError("Failed to sync profile data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const calculateLeague = (xp: number) => {
    if (xp < 1000) return "Bronze";
    if (xp < 5000) return "Silver";
    if (xp < 15000) return "Gold";
    if (xp < 30000) return "Emerald";
    return "Sapphire";
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center font-sans text-slate-400">
        <Loader2 className="animate-spin mb-4 text-[#1CB0F6]" size={48} strokeWidth={3} />
        <h2 className="font-black tracking-widest uppercase">Loading Profile...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center font-sans">
        <div className="bg-[#FF4B4B]/10 text-[#FF4B4B] p-6 rounded-3xl border-2 border-[#FF4B4B]/20 flex flex-col items-center text-center max-w-md">
          <AlertCircle size={48} strokeWidth={2.5} className="mb-4" />
          <h2 className="font-black text-xl mb-2">Sync Error</h2>
          <p className="font-bold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 py-8 px-4 animate-in fade-in duration-500">
      
      {/* LEFT COLUMN: Main Profile Info */}
      <div className="flex-1 space-y-8">
        
        {/* Avatar Banner Area */}
        <div>
          <div className="h-48 w-full bg-[#1CB0F6] rounded-3xl relative flex items-center justify-center mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-dashed border-white/60 bg-[#149FDF] flex items-center justify-center transform translate-y-8">
               <span className="font-black text-4xl text-white tracking-widest">
                 {profileData?.username?.substring(0, 2).toUpperCase() || <UserPlus size={40} className="opacity-80" strokeWidth={3} />}
               </span>
            </div>
            
            <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors">
              <Edit2 size={20} strokeWidth={3} />
            </button>
          </div>

          <div className="mt-12 px-2">
            <h1 className="text-3xl font-black text-slate-700">{profileData?.username || "Learner"}</h1>
            <p className="text-slate-500 font-bold text-lg">@{profileData?.username || "user"}</p>
            
            <p className="text-[#CE82FF] font-bold uppercase tracking-widest text-sm mt-3 flex items-center gap-2">
              <BrainCircuit size={16} strokeWidth={3} /> {profileData?.player_type} Profile
            </p>
            
            <div className="flex items-center gap-6 mt-6">
              <button className="text-[#1CB0F6] font-black uppercase tracking-widest text-sm hover:text-[#1899D6] transition-colors">
                {socialData.friends.length} Following
              </button>
              <button className="text-[#1CB0F6] font-black uppercase tracking-widest text-sm hover:text-[#1899D6] transition-colors">
                {socialData.friends.length * 4} Followers
              </button>
            </div>
          </div>
        </div>

        <hr className="border-t-2 border-slate-200" />

        {/* Statistics Section */}
        <div>
          <h2 className="text-2xl font-black text-slate-700 mb-4">Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            
            <div className="border-2 border-slate-200 rounded-2xl p-4 flex items-center gap-4">
              <Flame size={28} strokeWidth={3} className="text-[#FF9600]" fill="currentColor" />
              <div>
                <div className="text-xl font-black text-slate-700">{profileData?.streak_days || 0}</div>
                <div className="text-sm font-bold text-slate-400">Day streak</div>
              </div>
            </div>

            <div className="border-2 border-slate-200 rounded-2xl p-4 flex items-center gap-4">
              <Zap size={28} strokeWidth={3} className="text-[#FFD900]" fill="currentColor" />
              <div>
                <div className="text-xl font-black text-slate-700">{profileData?.xp_total?.toLocaleString() || 0}</div>
                <div className="text-sm font-bold text-slate-400">Total XP</div>
              </div>
            </div>

            <div className="border-2 border-slate-200 rounded-2xl p-4 flex items-center gap-4">
              <Shield size={28} strokeWidth={3} className="text-[#1CB0F6]" fill="currentColor" />
              <div>
                <div className="text-xl font-black text-slate-700">{calculateLeague(profileData?.xp_total || 0)}</div>
                <div className="text-sm font-bold text-slate-400">Current league</div>
              </div>
            </div>

            <div className="border-2 border-slate-200 rounded-2xl p-4 flex items-center gap-4">
              <Medal size={28} strokeWidth={3} className="text-[#FF9600]" fill="currentColor" />
              <div>
                <div className="text-xl font-black text-slate-700">{Math.floor((profileData?.xp_total || 0) / 5000)}</div>
                <div className="text-sm font-bold text-slate-400">Top 3 finishes</div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Social Feed & Friends (DYNAMIC) */}
      <div className="w-full lg:w-[350px] space-y-6">
        
        {/* Dynamic Celebration Feed */}
        {socialData.feed.length > 0 ? (
          socialData.feed.map((post, idx) => (
            <div key={idx} className="border-2 border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full ${post.friend_color} flex items-center justify-center font-black text-white text-lg`}>
                  {post.friend_initials}
                </div>
                <div>
                  <h3 className="font-black text-slate-700">{post.friend_name}</h3>
                  <p className="text-sm font-bold text-slate-400">{post.time_ago}</p>
                </div>
              </div>
              
              <p className="font-bold text-slate-600 mb-4 leading-relaxed">
                {post.message}
              </p>
              
              <button className="w-full bg-white border-2 border-slate-200 text-[#1CB0F6] font-black uppercase tracking-widest py-3 rounded-2xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                🎉 Celebrate
              </button>
            </div>
          ))
        ) : (
          <div className="border-2 border-slate-200 border-dashed rounded-2xl p-6 text-center">
            <Users size={32} className="text-slate-300 mx-auto mb-2" strokeWidth={2} />
            <p className="text-slate-400 font-bold text-sm">Your feed is quiet. Invite friends to see their activity!</p>
          </div>
        )}

        {/* Dynamic Friends List */}
        <div className="border-2 border-slate-200 rounded-2xl overflow-hidden shadow-sm">
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
            {socialData.friends.length > 0 ? (
              socialData.friends.map((friend, i) => (
                <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors">
                  <div className={`w-12 h-12 rounded-full ${friend.color} flex items-center justify-center font-black text-white text-lg`}>
                    {friend.initials}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-slate-700">{friend.name}</h4>
                    <p className="text-sm font-bold text-slate-400">{friend.xp}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-slate-400 font-bold text-sm">
                No users found in your cohort yet.
              </div>
            )}
          </div>
        </div>

        {/* Add Friends Section */}
        <div className="border-2 border-slate-200 rounded-2xl p-2 shadow-sm">
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