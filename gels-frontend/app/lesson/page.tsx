"use client";

import React, { useState } from 'react';
import { X, Heart, BrainCircuit, Sparkles, ArrowRight, Lightbulb, Activity, Frown } from 'lucide-react';
import Link from 'next/link';

export default function LessonPage() {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [lessonState, setLessonState] = useState<'answering' | 'checking' | 'ai-adapting' | 'reflecting'>('answering');
  const [lives, setLives] = useState(4);
  
  // NEW: State to control the exit warning modal
  const [showExitModal, setShowExitModal] = useState(false);

  // Mock Quiz Data
  const question = "Which data structure operates on a Last-In, First-Out (LIFO) principle?";
  const options = [
    { id: 1, text: "Queue" },
    { id: 2, text: "Stack", isCorrect: true },
    { id: 3, text: "Linked List" },
    { id: 4, text: "Array" }
  ];

  const handleCheck = () => {
    setLessonState('checking');
    
    setTimeout(() => {
      const isCorrect = options.find(o => o.id === selectedOption)?.isCorrect;
      
      if (!isCorrect) {
        setLives(prev => prev - 1);
        setLessonState('ai-adapting');
      } else {
        setLessonState('reflecting');
      }
    }, 1500);
  };

  const handleContinue = () => {
    setSelectedOption(null);
    setLessonState('answering');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans relative overflow-hidden">
      
      {/* --- NEW: EXIT WARNING MODAL --- */}
      {showExitModal && (
        <div className="absolute inset-0 z-[100] bg-[#121E2A]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 text-center shadow-2xl transform animate-in zoom-in-95 duration-500">
            
            {/* Sad Icon */}
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#FF4B4B]/10 flex items-center justify-center text-[#FF4B4B] border-b-8 border-[#FF4B4B]/20">
              <Frown size={48} strokeWidth={2.5} />
            </div>
            
            <h2 className="text-2xl font-black text-slate-700 mb-2 tracking-tight">Wait, don't go!</h2>
            <p className="text-slate-500 font-bold mb-8 leading-relaxed">
              You are making great progress. If you quit now, you will lose your XP and streak for this session!
            </p>
            
            <div className="flex flex-col gap-3">
              {/* Primary Action: Stay */}
              <button
                onClick={() => setShowExitModal(false)}
                className="w-full bg-[#1CB0F6] text-white py-4 rounded-2xl text-lg font-black uppercase tracking-widest transition-all border-b-4 border-[#1899D6] hover:bg-[#149FDF] active:translate-y-1 active:border-b-0 shadow-sm"
              >
                Keep Learning
              </button>
              
              {/* Secondary Action: Actually Quit */}
              <Link
                href="/classes"
                className="w-full bg-white text-[#FF4B4B] py-4 rounded-2xl text-lg font-black uppercase tracking-widest transition-all hover:bg-[#FF4B4B]/5 active:translate-y-1"
              >
                End Session
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* --- OVERLAY: AI Path Adaptation --- */}
      {lessonState === 'ai-adapting' && (
        <div className="absolute inset-0 z-50 bg-[#121E2A]/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white max-w-lg w-full rounded-3xl p-8 shadow-2xl transform animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 rounded-full bg-[#CE82FF] flex items-center justify-center border-b-8 border-[#A568CC] mb-6 shadow-lg mx-auto text-white">
              <BrainCircuit size={40} strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl font-black text-slate-700 mb-2 text-center">Path Adapted</h2>
            
            <div className="bg-[#DDF4FF] border-2 border-[#1CB0F6] rounded-2xl p-5 my-6 relative overflow-hidden">
              <Activity size={80} strokeWidth={1} className="absolute -right-4 -bottom-4 text-[#1CB0F6]/10" />
              <p className="text-sm font-black text-[#1CB0F6] mb-1 uppercase tracking-widest flex items-center gap-2">
                <Lightbulb size={16} strokeWidth={3} /> System Rationale
              </p>
              <p className="font-bold text-slate-600 leading-relaxed">
                You selected Queue (FIFO). Since LIFO concepts are causing trouble, the Cognitive Engine is inserting a visual animation of a Stack before we try this again.
              </p>
            </div>

            <button onClick={handleContinue} className="w-full bg-[#CE82FF] text-white py-4 rounded-2xl text-lg font-black uppercase tracking-widest transition-all border-b-4 border-[#A568CC] hover:bg-[#B870E6] active:translate-y-1 active:border-b-0 shadow-sm flex items-center justify-center gap-2">
              View Animation <ArrowRight size={20} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}

      {/* --- OVERLAY: Metacognitive Checkpoint --- */}
      {lessonState === 'reflecting' && (
        <div className="absolute inset-0 z-50 bg-[#1CB0F6] flex flex-col items-center justify-center p-6 text-center animate-in slide-in-from-bottom duration-500">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-[#1CB0F6] border-b-8 border-slate-200 mb-8 shadow-xl">
            <Sparkles size={48} strokeWidth={3} />
          </div>
          
          <div className="bg-white/20 text-white border-2 border-white/30 px-4 py-2 rounded-xl font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
            <BrainCircuit size={18} strokeWidth={3} /> Metacognitive Checkpoint
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white mb-8 tracking-tight max-w-xl">
            You nailed it! How confident do you feel about Stacks vs Queues?
          </h1>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
            <button onClick={handleContinue} className="flex-1 bg-white/20 text-white border-2 border-white/40 py-5 rounded-2xl text-lg font-black uppercase tracking-widest hover:bg-white/30 active:translate-y-1 transition-all">
              Still Shaky
            </button>
            <button onClick={handleContinue} className="flex-1 bg-white text-[#1CB0F6] border-b-4 border-slate-200 py-5 rounded-2xl text-lg font-black uppercase tracking-widest hover:bg-slate-50 active:translate-y-1 active:border-b-0 transition-all">
              Got it 100%
            </button>
          </div>
        </div>
      )}


      {/* --- BASE UI: Top Bar --- */}
      <header className="w-full max-w-5xl mx-auto px-4 py-6 flex items-center gap-6">
        
        {/* MODIFIED: The X button now triggers the modal instead of routing away */}
        <button 
          onClick={() => setShowExitModal(true)} 
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={32} strokeWidth={3} />
        </button>
        
        <div className="flex-1 h-5 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-[#58CC02] w-1/3 rounded-full relative transition-all duration-500">
            <div className="absolute top-1 left-2 right-2 h-1.5 bg-white/30 rounded-full"></div>
          </div>
        </div>
        <div className={`flex items-center gap-2 font-black text-xl transition-colors duration-300 ${lives < 4 ? 'text-[#FF4B4B]' : 'text-[#FF4B4B]'}`}>
          <Heart size={32} strokeWidth={3} fill="currentColor" /> {lives}
        </div>
      </header>

      {/* --- BASE UI: Main Quiz Content --- */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 flex flex-col justify-center">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-700 mb-10 leading-tight">
          {question}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {options.map((option) => {
            const isSelected = selectedOption === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setSelectedOption(option.id)}
                disabled={lessonState !== 'answering'}
                className={`p-6 rounded-2xl text-left border-2 border-b-4 transition-all text-xl font-bold ${
                  isSelected 
                    ? 'bg-[#DDF4FF] border-[#1CB0F6] text-[#1CB0F6] transform translate-y-1 border-b-2' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-[#1CB0F6] bg-white' : 'border-slate-300'}`}>
                    {isSelected && <div className="w-4 h-4 rounded-full bg-[#1CB0F6]"></div>}
                  </div>
                  {option.text}
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* --- BASE UI: Fixed Bottom Action Bar --- */}
      <footer className="w-full border-t-2 border-slate-200 bg-white p-6 sm:p-8 mt-auto z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center gap-4">
          <button className="hidden sm:block text-slate-400 font-black uppercase tracking-widest hover:text-slate-600 transition-colors px-6 py-4 rounded-2xl border-2 border-transparent hover:bg-slate-100">
            Skip
          </button>
          
          <button 
            disabled={!selectedOption || lessonState !== 'answering'}
            onClick={handleCheck}
            className={`w-full sm:w-auto px-12 py-4 rounded-2xl text-lg font-black uppercase tracking-widest transition-all ${
              lessonState === 'checking'
                ? 'bg-slate-200 text-slate-400 cursor-wait'
                : selectedOption 
                  ? 'bg-[#58CC02] text-white border-b-4 border-[#46A302] hover:bg-[#46A302] active:translate-y-1 active:border-b-0 cursor-pointer' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {lessonState === 'checking' ? 'Checking...' : 'Check'}
          </button>
        </div>
      </footer>

    </div>
  );
}