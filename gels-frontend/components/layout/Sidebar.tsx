import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  BookOpen, 
  Trophy, 
  Activity,
  Medal, // <-- Added Medal icon for Achievements
  LogOut, 
  GraduationCap, 
  UserCircle 
} from 'lucide-react';

export default function Sidebar() {
  return (
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
        
        {/* Logout (Red Hover) */}
        <Link href="/logout" className="group flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-400 hover:bg-[#FF4B4B]/10 hover:text-[#FF4B4B] font-bold uppercase tracking-wider transition-all border-2 border-transparent active:bg-[#FF4B4B]/20">
          <LogOut size={28} strokeWidth={2.5} className="group-hover:text-[#FF4B4B] transition-colors" /> 
          <span className="mt-1">Logout</span>
        </Link>
      </div>
      
    </aside>
  );
}