"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  BookOpen, 
  Trophy, 
  Activity,
  Medal,
  LogOut, 
  GraduationCap, 
  UserCircle,
  Loader2 // <-- Added Loader2 for the spinner
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
    const router = useRouter(); 
    
    // 1. Modal control state
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    
    // 2. Animation control state
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // 3. The logout logic with an artificial delay for the animation
    const executeLogout = () => {
        setIsLoggingOut(true); // Trigger the animation UI

        // Wait 1.5 seconds so the user sees the animation, then redirect
        setTimeout(() => {
            // Wipe all session data
            localStorage.removeItem('gels_token');
            localStorage.removeItem('gels_role');
            localStorage.removeItem('gels_user_id');
            
            // Kick them back to the login screen
            router.push('/auth/login');
        }, 1500); 
    };

  return (
    <>
      <aside className="w-64 bg-white border-r-2 border-slate-200 flex flex-col h-full hidden md:flex z-20">
        
        {/* Playful Gamified Logo Area */}
        <div className="h-24 flex items-center px-6 mb-2">
          <div className="flex items-center gap-3">
            {/* Duolingo Green 3D Logo Block */}
            <div className="w-11 h-11 rounded-2xl bg-[#58CC02] border-b-4 border-[#46A302] flex items-center justify-center font-black text-white text-xl transform hover:-translate-y-0.5 transition-transform cursor-pointer">
              G
            </div>
            <span className="text-[#58CC02] font-extrabold text-2xl tracking-widest">GELS</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-2">
          
          {/* ACTIVE STATE Example (Light Blue Background + Blue Text) */}
          <Link href="/" className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-[#DDF4FF] text-[#1CB0F6] border-2 border-[#DDF4FF] font-bold uppercase tracking-wider transition-all">
              <LayoutDashboard size={28} strokeWidth={2.5} /> 
              <span className="mt-1">Dashboard</span>
          </Link>

          {/* Purple Book (Learning) */}
          <Link href="/learning-path" className="flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-500 hover:bg-slate-100 font-bold uppercase tracking-wider transition-all border-2 border-transparent active:bg-slate-200">
              <BookOpen size={28} strokeWidth={2.5} className="text-[#CE82FF]" /> 
              <span className="mt-1">Learn</span>
          </Link>

          {/* Orange Trophy (Quests) */}
          <Link href="/quests" className="flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-500 hover:bg-slate-100 font-bold uppercase tracking-wider transition-all border-2 border-transparent active:bg-slate-200">
              <Trophy size={28} strokeWidth={2.5} className="text-[#FF9600]" /> 
              <span className="mt-1">Quests</span>
          </Link>

          {/* Red Shield/Activity (Leaderboard) */}
          <Link href="/leaderboard" className="flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-500 hover:bg-slate-100 font-bold uppercase tracking-wider transition-all border-2 border-transparent active:bg-slate-200">
              <Activity size={28} strokeWidth={2.5} className="text-[#FF4B4B]" /> 
              <span className="mt-1">Rankings</span>
          </Link>

          {/* Gold Medal (Achievements) */}
          <Link href="/achievements" className="flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-500 hover:bg-slate-100 font-bold uppercase tracking-wider transition-all border-2 border-transparent active:bg-slate-200">
              <Medal size={28} strokeWidth={2.5} className="text-[#FFC800]" /> 
              <span className="mt-1">Awards</span>
          </Link>

          {/* Blue Profile */}
          <Link href="/profile" className="flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-500 hover:bg-slate-100 font-bold uppercase tracking-wider transition-all border-2 border-transparent active:bg-slate-200">
            <UserCircle size={28} strokeWidth={2.5} className="text-[#1CB0F6]" /> 
            <span className="mt-1">Profile</span>
          </Link>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 mt-auto space-y-2">
          
          {/* Subtle Gray for Instructor View */}
          <Link href="/instructor" className="flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-500 hover:bg-slate-100 font-bold uppercase tracking-wider transition-all border-2 border-transparent active:bg-slate-200">
            <GraduationCap size={28} strokeWidth={2.5} className="text-slate-400" /> 
            <span className="mt-1">Instructor</span>
          </Link>
          
          {/* Logout Button - Triggers the modal */}
          <button 
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-[#FF4B4B] border-2 border-transparent hover:bg-[#FF4B4B]/10 transition-all text-left"
          >
            <LogOut size={24} strokeWidth={3} /> Logout
          </button>
        </div>
      </aside>

      {/* The Confirmation & Animation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] bg-[#121E2A]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 text-center shadow-2xl transform animate-in zoom-in-95 duration-500">
            
            {/* If they clicked "Yes, Log Out", show the bouncing animation */}
            {isLoggingOut ? (
              <div className="flex flex-col items-center justify-center py-6 animate-in zoom-in duration-300">
                {/* Bouncing red icon */}
                <div className="w-20 h-20 mx-auto bg-[#FF4B4B] rounded-full flex items-center justify-center mb-6 shadow-xl border-b-4 border-[#D0021B] animate-bounce">
                  <LogOut size={36} className="text-white -ml-1" strokeWidth={3} />
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-2">Logging off...</h2>
                <p className="text-slate-500 font-bold mb-6">See you next time!</p>
                <Loader2 size={32} className="animate-spin text-[#FF4B4B]" strokeWidth={3} />
              </div>
            ) : (
              /* Otherwise, show the standard "Are you sure?" prompt */
              <>
                <div className="w-20 h-20 mx-auto bg-[#FFDFE0] rounded-full flex items-center justify-center mb-4 border-b-4 border-[#FF4B4B]/30">
                  <LogOut size={36} className="text-[#FF4B4B] -ml-1" strokeWidth={2.5} />
                </div>

                <h2 className="text-2xl font-black text-slate-800 mb-2 mt-2">Leaving so soon?</h2>
                <p className="text-slate-500 font-bold mb-8 leading-relaxed">
                  Are you sure you want to log out? We'll miss you!
                </p>
                
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => setShowLogoutModal(false)} 
                    className="w-full bg-[#1CB0F6] text-white py-4 rounded-2xl text-lg font-black uppercase tracking-widest border-b-4 border-[#1899D6] hover:bg-[#149FDF] active:translate-y-1 active:border-b-0 transition-all"
                  >
                    Stay Here
                  </button>
                  
                  <button 
                    onClick={executeLogout} 
                    className="w-full bg-white text-[#FF4B4B] py-4 rounded-2xl text-lg font-black uppercase tracking-widest hover:bg-[#FF4B4B]/5 active:translate-y-1 transition-all"
                  >
                    Yes, Log Out
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
}