import React from 'react';
import { Search, Bell } from 'lucide-react';
import Link from 'next/link';

export default function TopNav() {
  return (
    <header className="h-24 bg-white border-b-4 border-slate-200 flex items-center justify-between px-6 md:px-8 z-10 flex-shrink-0">
      
      <div className="flex items-center">
        {/* Chunky, playful title replacing the serious dark navy text */}
        <h1 className="text-xl font-black text-slate-300 uppercase tracking-widest hidden sm:block">
          Dashboard
        </h1>
      </div>
      
      <div className="flex items-center gap-6">
        
        {/* Chunky Search Input */}
        <div className="relative hidden md:block group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1CB0F6] transition-colors" size={20} strokeWidth={3} />
          <input
            type="text"
            placeholder="Search modules..."
            className="bg-slate-100 border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-[#1CB0F6] focus:bg-white w-64 transition-all placeholder-slate-400"
          />
        </div>

        {/* Playful Notification Bell linked to /notifications */}
        <Link 
          href="/notifications" 
          className="relative p-3 rounded-2xl border-2 border-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-500 active:bg-slate-200 transition-all cursor-pointer block"
        >
          <Bell size={28} strokeWidth={3} />
          {/* Vibrant Duolingo Red Notification Dot */}
          <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-[#FF4B4B] border-2 border-white rounded-full"></span>
        </Link>

        {/* 3D Avatar Button linked to /profile */}
        <Link 
          href="/profile"
          className="w-12 h-12 rounded-full bg-[#1CB0F6] flex items-center justify-center font-black text-xl text-white border-b-4 border-[#1899D6] cursor-pointer transform hover:-translate-y-1 active:translate-y-1 active:border-b-0 transition-all block text-center leading-loose"
          style={{ lineHeight: '2.5rem' }} // Centers the text vertically
        >
          C
        </Link>

      </div>
    </header>
  );
}