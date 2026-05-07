"use client";

import React, { useState, useEffect } from 'react';
import { 
  X, Heart, CheckCircle2, Loader2, AlertCircle, 
  XCircle, Sparkles, BrainCircuit, Activity, 
  Lightbulb, ArrowRight, Frown 
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/api/api';

// --- GELS BRANDING COMPONENT ---
const GelsCoreBranding = ({ mood }: { mood: 'neutral' | 'happy' | 'sad' | 'thinking' }) => {
  const getStyles = () => {
    switch (mood) {
      case 'happy': return { color: 'text-[#58CC02]', border: 'border-[#58CC02]', glow: 'shadow-[0_0_25px_rgba(88,204,2,0.4)]', bg: 'bg-[#F7FFF0]' };
      case 'sad': return { color: 'text-[#FF4B4B]', border: 'border-[#FF4B4B]', glow: 'shadow-[0_0_25px_rgba(255,75,75,0.4)]', bg: 'bg-[#FFF5F5]' };
      case 'thinking': return { color: 'text-[#1CB0F6]', border: 'border-[#1CB0F6]', glow: 'shadow-[0_0_25px_rgba(28,176,246,0.4)]', bg: 'bg-[#F0F9FF]' };
      default: return { color: 'text-slate-500', border: 'border-slate-300', glow: 'shadow-none', bg: 'bg-white' };
    }
  };

  const { color, border, glow, bg } = getStyles();

  return (
    <div className={`relative flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-[2rem] border-4 border-b-[10px] transition-all duration-500 animate-[bounce_5s_infinite_ease-in-out] ${bg} ${border} ${glow}`}>
      <span className={`text-3xl sm:text-4xl font-black tracking-tighter select-none ${color}`}>
        GELS
      </span>
      {/* Decorative pulse ring for thinking state */}
      {mood === 'thinking' && (
        <div className="absolute inset-0 rounded-[2rem] border-4 border-[#1CB0F6] animate-ping opacity-20" />
      )}
    </div>
  );
};

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const moduleName = typeof params?.module === "string" ? params.module : "default";
  const lessonId = typeof params?.lesson === "string" ? params.lesson : "start";

  const [targetScore, setTargetScore] = useState(0); 
  const [progress, setProgress] = useState(0);
  const [lives, setLives] = useState(0); 
  const [isSessionInitialized, setIsSessionInitialized] = useState(false);
  const [lessonState, setLessonState] = useState<'loading' | 'answering' | 'checking' | 'correct' | 'failed_q' | 'ai-adapting' | 'reflecting'>('loading');
  const [activeQuestion, setActiveQuestion] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [aiRationale, setAiRationale] = useState('');
  const [showExitModal, setShowExitModal] = useState(false);

  const fetchNewQuestion = async () => {
    try {
      setLessonState('loading');
      const data = await api.learning.getLesson(moduleName, lessonId);
      if (!isSessionInitialized) {
        setTargetScore(data?.total_questions || 5);
        setLives(data?.lives || 5);
        setIsSessionInitialized(true);
      }
      setActiveQuestion(data);
      setSelectedOption(null);
      setLessonState('answering');
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchNewQuestion(); }, []);

  const handleCheck = async () => {
    setLessonState('checking');
    const choices = activeQuestion?.options?.choices || activeQuestion?.options || [];
    const selected = choices.find((o: any) => o.id === selectedOption);
    const isCorrect = selected?.isCorrect || false;

    try {
      const userId = localStorage.getItem('gels_user_id');
      await api.learning.submitAssessment(userId!, {
        module_id: activeQuestion?.question_id || "default",
        score: isCorrect ? 100 : 0,
        time_spent_seconds: 15,
        attempts: 1
      });
      
      const decision = await api.learning.getNextModule(userId!);
      setAiRationale(decision?.rationale || "");

      setTimeout(() => {
        if (isCorrect) {
          setProgress(p => p + 1);
          setLessonState(Math.random() > 0.8 ? 'reflecting' : 'correct');
        } else {
          setLives(l => l - 1);
          setLessonState('ai-adapting');
        }
      }, 800);
    } catch (err) { setLessonState('answering'); }
  };

  if (lessonState === 'loading' || !activeQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#1CB0F6]" size={48} />
          <span className="font-black text-[#1CB0F6] animate-pulse uppercase tracking-widest text-sm">GELS Initializing...</span>
        </div>
      </div>
    );
  }

  const choices = activeQuestion?.options?.choices || activeQuestion?.options || [];
  const lessonNote = activeQuestion?.options?.note || activeQuestion?.note;

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans relative overflow-hidden">
      
      {/* EXIT MODAL */}
      {showExitModal && (
        <div className="absolute inset-0 z-[100] bg-[#121E2A]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-3xl p-8 text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#FF4B4B]/10 flex items-center justify-center text-[#FF4B4B] border-b-4 border-[#FF4B4B]/20">
              <Frown size={40} strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-black text-slate-700 mb-2">Quit lesson?</h2>
            <p className="text-slate-500 font-bold mb-8">All progress made in this GELS session will be discarded.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => setShowExitModal(false)} className="bg-[#1CB0F6] text-white py-4 rounded-2xl font-black uppercase border-b-4 border-[#1899D6] active:translate-y-1 active:border-b-0 transition-all">Keep Learning</button>
              <Link href="/classes" className="text-[#FF4B4B] py-3 font-black uppercase tracking-widest text-sm hover:opacity-70 transition-opacity">Abort Session</Link>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="w-full max-w-5xl mx-auto px-4 py-8 flex items-center gap-6">
        <button onClick={() => setShowExitModal(true)} className="text-slate-400 hover:text-slate-600 transition-colors">
          <X size={32} strokeWidth={3} />
        </button>
        <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#58CC02] rounded-full relative transition-all duration-700 ease-out" 
            style={{ width: `${(progress / targetScore) * 100}%` }}
          >
            <div className="absolute top-1 left-2 right-2 h-1.5 bg-white/30 rounded-full"></div>
          </div>
        </div>
        <div className="flex items-center gap-2 font-black text-xl text-[#FF4B4B]">
          <Heart size={32} fill="currentColor" className={lives < 2 ? "animate-pulse" : ""} /> 
          {lives}
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-4 flex flex-col">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-10 mt-4">
          <div className="shrink-0">
            <GelsCoreBranding mood={lessonState === 'correct' ? 'happy' : (lessonState === 'failed_q' ? 'sad' : (lessonNote ? 'thinking' : 'neutral'))} />
          </div>
          
          <div className="flex-1 w-full">
            {/* REDESIGNED SPEECH BUBBLE SUGGESTION */}
            {lessonNote && lessonState === 'answering' && (
              <div className="relative mb-8 animate-in slide-in-from-left-4 fade-in duration-500">
                <div className="bg-white border-2 border-slate-200 rounded-[2rem] p-6 relative shadow-sm">
                  {/* Tail pointing at the GELS box */}
                  <div className="absolute left-1/2 -bottom-3 sm:left-[-12px] sm:top-1/2 sm:-translate-y-1/2 w-0 h-0 
                    border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] border-t-slate-200
                    sm:border-t-transparent sm:border-b-transparent sm:border-r-[14px] sm:border-r-slate-200" 
                  />
                  <div className="absolute left-1/2 -bottom-[10px] sm:left-[-10px] sm:top-1/2 sm:-translate-y-1/2 w-0 h-0 
                    border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-t-[12px] border-t-white
                    sm:border-t-transparent sm:border-b-transparent sm:border-r-[12px] sm:border-r-white z-10" 
                  />
                  
                  <div className="flex items-center gap-2 text-[#1CB0F6] mb-2">
                    <Sparkles size={16} strokeWidth={3} className="fill-[#1CB0F6]/20" />
                    <span className="font-black text-xs uppercase tracking-[0.2em]">GELS Suggestion</span>
                  </div>
                  <p className="text-slate-600 font-bold text-lg leading-relaxed italic">
                    "{lessonNote}"
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white border-2 border-slate-200 p-8 rounded-[2rem] shadow-sm">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-700 leading-tight">
                {activeQuestion?.question_text}
              </h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {choices.map((option: any) => (
            <button
              key={option.id}
              onClick={() => lessonState === 'answering' && setSelectedOption(option.id)}
              disabled={lessonState !== 'answering'}
              className={`p-6 rounded-2xl text-left border-2 border-b-4 transition-all text-xl font-bold
                ${selectedOption === option.id 
                  ? 'bg-[#DDF4FF] border-[#1CB0F6] text-[#1CB0F6] translate-y-1 border-b-2' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}
                ${lessonState !== 'answering' ? 'opacity-40 cursor-default' : ''}`}
            >
              {option.text}
            </button>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className={`w-full border-t-2 border-slate-200 p-6 sm:p-10 transition-all duration-300
        ${lessonState === 'correct' ? 'bg-[#D7FFB8] border-[#C6F2A0]' : 
          lessonState === 'failed_q' ? 'bg-[#FFDFE0] border-[#F4C2C4]' : 'bg-white'}`}>
        
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex-1">
            {lessonState === 'correct' && (
              <div className="flex items-center gap-3 text-[#58CC02] font-black text-2xl animate-in slide-in-from-bottom-2">
                <div className="bg-white rounded-full p-1 shadow-sm"><CheckCircle2 size={32} /></div> Correct Answer!
              </div>
            )}
            {lessonState === 'failed_q' && (
              <div className="text-[#FF4B4B] animate-in slide-in-from-bottom-2">
                <div className="flex items-center gap-3 font-black text-2xl">
                  <div className="bg-white rounded-full p-1 shadow-sm"><XCircle size={32} /></div> Learning Path Adapted
                </div>
                <p className="font-bold mt-1 opacity-90">{aiRationale || "Identifying conceptual gaps..."}</p>
              </div>
            )}
          </div>
          
          <button 
            disabled={!selectedOption && lessonState === 'answering'}
            onClick={['correct', 'failed_q'].includes(lessonState) ? fetchNewQuestion : handleCheck}
            className={`w-full sm:w-auto px-20 py-4 rounded-2xl text-lg font-black uppercase tracking-widest transition-all border-b-4
              ${!selectedOption && lessonState === 'answering' ? 'bg-slate-200 text-slate-400 border-none' : 
                lessonState === 'failed_q' ? 'bg-[#FF4B4B] text-white border-[#EA2B2B]' : 
                'bg-[#58CC02] text-white border-[#46A302] hover:bg-[#46A302] active:translate-y-1 active:border-b-0'}
            `}
          >
            {lessonState === 'checking' ? 'Analyzing...' : ['correct', 'failed_q'].includes(lessonState) ? 'Continue' : 'Check'}
          </button>
        </div>
      </footer>

      {/* OVERLAY: AI ADAPTATION */}
      {lessonState === 'ai-adapting' && (
        <div className="absolute inset-0 z-50 bg-[#121E2A]/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-3xl bg-[#CE82FF] flex items-center justify-center border-b-8 border-[#A568CC] mb-8 mx-auto text-white">
              <BrainCircuit size={40} strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl font-black text-slate-700 mb-2 text-center tracking-tight">Reinforcement Mode</h2>
            <div className="bg-[#F3E8FF] border-2 border-[#CE82FF] rounded-3xl p-6 my-6 relative">
              <p className="text-xs font-black text-[#CE82FF] mb-2 uppercase tracking-[0.2em] flex items-center gap-2">
                <Activity size={16} /> GELS Cognitive Engine
              </p>
              <p className="font-bold text-slate-600 leading-relaxed text-lg">
                {aiRationale || "I've detected a conceptual gap. Branching your current path to reinforce core principles."}
              </p>
            </div>
            <button onClick={() => setLessonState('failed_q')} className="w-full bg-[#CE82FF] text-white py-5 rounded-2xl font-black uppercase border-b-4 border-[#A568CC] flex items-center justify-center gap-2 active:translate-y-1 active:border-b-0 transition-all">
              Launch Review <ArrowRight size={20} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}