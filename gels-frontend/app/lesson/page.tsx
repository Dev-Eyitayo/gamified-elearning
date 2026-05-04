"use client";

import React, { useState } from 'react';
import { X, Heart } from 'lucide-react';
import Link from 'next/link';

export default function LessonPage() {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Mock Quiz Data
  const question = "Which data structure operates on a Last-In, First-Out (LIFO) principle?";
  const options = [
    { id: 1, text: "Queue" },
    { id: 2, text: "Stack" },
    { id: 3, text: "Linked List" },
    { id: 4, text: "Array" }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      
      {/* Top Bar: Progress & Lives */}
      <header className="w-full max-w-5xl mx-auto px-4 py-6 flex items-center gap-6">
        <Link href="/classes" className="text-slate-400 hover:text-slate-600 transition-colors">
          <X size={32} strokeWidth={3} />
        </Link>
        
        {/* Progress Bar */}
        <div className="flex-1 h-5 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-[#58CC02] w-1/3 rounded-full relative">
            <div className="absolute top-1 left-2 right-2 h-1.5 bg-white/30 rounded-full"></div>
          </div>
        </div>

        {/* Lives / Hearts */}
        <div className="flex items-center gap-2 text-[#FF4B4B] font-black text-xl">
          <Heart size={32} strokeWidth={3} fill="currentColor" /> 4
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 flex flex-col justify-center">
        
        <h1 className="text-3xl sm:text-4xl font-black text-slate-700 mb-10 leading-tight">
          {question}
        </h1>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {options.map((option) => {
            const isSelected = selectedOption === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setSelectedOption(option.id)}
                className={`p-6 rounded-2xl text-left border-2 border-b-4 transition-all text-xl font-bold ${
                  isSelected 
                    ? 'bg-[#DDF4FF] border-[#1CB0F6] text-[#1CB0F6] transform translate-y-1 border-b-2' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {/* Custom Radio Button Indicator */}
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-[#1CB0F6] bg-white' : 'border-slate-300'
                  }`}>
                    {isSelected && <div className="w-4 h-4 rounded-full bg-[#1CB0F6]"></div>}
                  </div>
                  {option.text}
                </div>
              </button>
            );
          })}
        </div>

      </main>

      {/* Fixed Bottom Action Bar */}
      <footer className="w-full border-t-2 border-slate-200 bg-white p-6 sm:p-8 mt-auto">
        <div className="max-w-5xl mx-auto flex justify-between items-center gap-4">
          
          <button className="hidden sm:block text-slate-400 font-black uppercase tracking-widest hover:text-slate-600 transition-colors px-6 py-4 rounded-2xl border-2 border-transparent hover:bg-slate-100">
            Skip
          </button>
          
          <button 
            disabled={!selectedOption}
            className={`w-full sm:w-auto px-12 py-4 rounded-2xl text-lg font-black uppercase tracking-widest transition-all ${
              selectedOption 
                ? 'bg-[#58CC02] text-white border-b-4 border-[#46A302] hover:bg-[#46A302] active:translate-y-1 active:border-b-0 cursor-pointer' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Check
          </button>
          
        </div>
      </footer>

    </div>
  );
}