"use client";

import React, { useState, useEffect } from 'react';
import { X, Heart, CheckCircle2, Loader2, AlertCircle, Sparkles, BrainCircuit, BookOpen } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/api/api';

export default function AdaptiveLessonPage() {
  const router = useRouter();
  const params = useParams();
  
  // --- Data State ---
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // --- Interaction State ---
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // --- Session State ---
  const [hearts, setHearts] = useState(25); // Defaults to 25 as per instruction
  const [progress, setProgress] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  // 1. Fetch ALL Questions and User Gems
  useEffect(() => {
    const fetchSessionData = async () => {
      if (!params.module || !params.lesson) return;
      
      try {
        setIsLoading(true);
        // GET all questions tagged for this lesson
        const questionsData = await api.learning.getLesson(params.module as string, params.lesson as string);
        
        // Handle both single objects and arrays from the backend
        const pool = Array.isArray(questionsData) ? questionsData : [questionsData];
        setAllQuestions(pool);

        // Fetch user gems (lives)
        const userId = localStorage.getItem('gels_user_id');
        if (userId) {
          const profile = await api.gamification.getProfile(userId);
          setHearts(profile.gems);
        }
      } catch (err: any) {
        console.error("Lesson fetch error:", err);
        setError("Cognitive Engine Sync Error.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionData();
  }, [params.module, params.lesson]);

  const currentQuestion = allQuestions[currentIndex];

  const handleCheck = () => {
    if (selectedOption === null || isAnswered) return;

    const choice = currentQuestion.options.choices.find((c: any) => c.id === selectedOption);
    const correct = choice?.isCorrect;
    
    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      setCorrectAnswersCount(prev => prev + 1);
      const step = 100 / allQuestions.length;
      setProgress(prev => Math.min(prev + step, 100));
    } else {
      setHearts(prev => Math.max(prev - 1, 0));
    }
  };

const handleNext = async () => {
    if (currentIndex < allQuestions.length - 1) {
      setIsAnswered(false);
      setIsCorrect(false);
      setSelectedOption(null);
      setCurrentIndex(prev => prev + 1);
    } else {
        setIsLoading(true);
        try {
            const userId = localStorage.getItem('gels_user_id');
            const finalScore = (correctAnswersCount / allQuestions.length) * 100;

            // 🔥 Ensure hearts (lives) and userId are passed correctly
            await api.learning.submitAssessment({
                user_id: userId || "",
                score: finalScore,
                remaining_gems: hearts, // Sends your local lives state to DB
                time_spent_seconds: 300,
                attempts: 1
            });

            router.push('/learning-path');
        } catch (err) {
            router.push('/learning-path');
        }
    }
  };


  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white font-sans">
      <Loader2 className="animate-spin text-[#58CC02] mb-4" size={64} strokeWidth={3} />
      <h2 className="font-black text-slate-400 uppercase tracking-widest">Cognitive Engine Syncing...</h2>
    </div>
  );

  if (error || !currentQuestion) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center font-sans">
      <AlertCircle size={64} className="text-[#FF4B4B] mb-4" />
      <h2 className="text-2xl font-black text-slate-700 mb-2 uppercase">Sync Failed</h2>
      <p className="font-bold text-slate-400 mb-6">{error || "No lessons available."}</p>
      <button onClick={() => router.back()} className="bg-[#1CB0F6] text-white px-10 py-4 rounded-2xl font-black uppercase border-b-4 border-[#1899D6]">Go Back</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* 1. PROGRESS HEADER */}
      <div className="max-w-5xl mx-auto w-full p-6 flex items-center gap-6">
        <button onClick={() => router.push('/learning-path')} className="text-slate-400 hover:text-slate-600 transition-colors">
          <X size={32} strokeWidth={3} />
        </button>
        <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden border-2 border-slate-100 shadow-inner">
          <div className="h-full bg-[#58CC02] transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center gap-2 text-[#FF4B4B] font-black text-2xl">
          <Heart fill="currentColor" size={28} />
          <span>{hearts}</span>
        </div>
      </div>

      {/* 2. MAIN CONTENT - CENTERED DUOLINGO STYLE */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        <div className="flex flex-col h-full">
            
            {/* Note/Guide Section */}
            <div key={`note-${currentIndex}`} className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-2 text-[#1CB0F6] mb-3">
                    <BookOpen size={20} strokeWidth={3} />
                    <span className="font-black uppercase tracking-[0.2em] text-xs">Concept Note</span>
                </div>
                <div className="bg-slate-50 border-2 border-slate-200 rounded-[2rem] p-6">
                    <p className="text-lg font-bold text-slate-600 leading-relaxed italic">
                        "{currentQuestion.options.note}"
                    </p>
                </div>
            </div>

            {/* Question Section */}
            <div key={`q-${currentIndex}`} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-3xl font-black text-slate-700 mb-8 tracking-tight">
                    {currentQuestion.question_text}
                </h1>

                <div className="grid grid-cols-1 gap-4">
                    {currentQuestion.options.choices.map((choice: any, idx: number) => (
                    <button
                        key={choice.id}
                        disabled={isAnswered}
                        onClick={() => setSelectedOption(choice.id)}
                        className={`w-full text-left p-6 rounded-2xl border-2 font-bold text-xl transition-all relative
                        ${selectedOption === choice.id ? 'border-[#1CB0F6] bg-[#DDF4FF] text-[#1CB0F6] shadow-[0_4px_0_0_#1899D6]' : 'border-slate-200 text-slate-600 hover:bg-slate-50 shadow-[0_4px_0_0_#E5E5E5]'}
                        ${isAnswered && choice.isCorrect ? 'border-[#58CC02] bg-[#D7FFB8] text-[#58CC02] shadow-[0_4px_0_0_#46A302]' : ''}
                        ${isAnswered && selectedOption === choice.id && !choice.isCorrect ? 'border-[#FF4B4B] bg-[#FFF5F5] text-[#FF4B4B] shadow-[0_4px_0_0_#CC3B3B]' : ''}
                        active:translate-y-1 active:shadow-none
                        `}
                    >
                        <div className="flex items-center gap-4">
                            <span className="w-8 h-8 rounded-lg border-2 border-slate-200 flex items-center justify-center text-sm font-black text-slate-400">
                                {idx + 1}
                            </span>
                            <span className="flex-1">{choice.text}</span>
                            {isAnswered && choice.isCorrect && <CheckCircle2 className="text-[#58CC02]" />}
                            {isAnswered && selectedOption === choice.id && !choice.isCorrect && <X className="text-[#FF4B4B]" />}
                        </div>
                    </button>
                    ))}
                </div>
            </div>
        </div>
      </main>

      {/* 3. FOOTER ACTION BAR */}
      <footer className={`border-t-4 p-8 transition-colors duration-300 ${isAnswered ? (isCorrect ? 'bg-[#D7FFB8] border-[#58CC02]' : 'bg-[#FFF5F5] border-[#FF4B4B]') : 'bg-white border-slate-100'}`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isAnswered ? (
               <>
                 <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white ${isCorrect ? 'bg-[#58CC02]' : 'bg-[#FF4B4B]'} shadow-lg`}>
                    {isCorrect ? <Sparkles size={36} /> : <X size={36} />}
                 </div>
                 <div>
                    <h3 className={`font-black text-2xl ${isCorrect ? 'text-[#58CC02]' : 'text-[#FF4B4B]'}`}>
                        {isCorrect ? 'Excellent!' : 'Correct Solution:'}
                    </h3>
                    <p className={`font-bold ${isCorrect ? 'text-[#58CC02]' : 'text-[#FF4B4B]'}`}>
                        {isCorrect ? `Question ${currentIndex + 1} cleared.` : 'Keep practicing the material!'}
                    </p>
                 </div>
               </>
            ) : (
                <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-xs">
                    <BrainCircuit size={18} /> DeepSeek Cognitive Engine
                </div>
            )}
          </div>

          <button
            onClick={isAnswered ? handleNext : handleCheck}
            disabled={selectedOption === null}
            className={`px-16 py-4 rounded-2xl font-black uppercase tracking-widest transition-all border-b-8 text-lg
              ${isAnswered 
                ? (isCorrect ? 'bg-[#58CC02] border-[#46A302] text-white hover:bg-[#46A302]' : 'bg-[#FF4B4B] border-[#CC3B3B] text-white hover:bg-[#CC3B3B]')
                : (selectedOption !== null ? 'bg-[#58CC02] border-[#46A302] text-white hover:bg-[#46A302]' : 'bg-slate-200 border-slate-300 text-slate-400 pointer-events-none')
              } active:translate-y-2 active:border-b-0`}
          >
            {isAnswered ? (currentIndex === allQuestions.length - 1 ? 'Finish' : 'Continue') : 'Check'}
          </button>
        </div>
      </footer>
    </div>
  );
}