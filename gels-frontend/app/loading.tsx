import React from 'react';

export default function Loading() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center min-h-[60vh]">
      
      {/* Bouncing G Logo */}
      <div className="w-16 h-16 rounded-3xl bg-[#58CC02] flex items-center justify-center font-black text-white text-4xl border-b-4 border-[#46A302] mb-6 animate-bounce shadow-lg">
        G
      </div>
      
      {/* Playful Colorful Dots */}
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-[#1CB0F6] animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-3 h-3 rounded-full bg-[#FF9600] animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-3 h-3 rounded-full bg-[#CE82FF] animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
      
      <p className="mt-6 font-bold text-slate-400 uppercase tracking-widest text-sm animate-pulse">
        Leveling Up...
      </p>
      
    </div>
  );
}