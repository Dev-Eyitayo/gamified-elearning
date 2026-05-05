"use client";

import React, { useState, useEffect } from 'react';
import { BrainCircuit, Trophy, Sparkles, Users, Compass, Code, Database, Layout, Book, Rocket, Flame, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/api/api'; 

// Helper to map string icon names from backend to real React components
const IconMap: any = {
  Code, Database, Layout, Book, Rocket, Flame, Trophy, Users, Compass
};

export default function OnboardingPage() {
  const [phase, setPhase] = useState<'loading' | 'course' | 'level' | 'quizIntro' | 'quiz' | 'surveyIntro' | 'survey' | 'processing' | 'done'>('loading');
  
  // Dynamic Data States from Backend
  const [config, setConfig] = useState<any>(null);

  // User Selection States
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  // Quiz State
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [score, setScore] = useState(0); 
  
  // Survey State
  const [currentSurveyIdx, setCurrentSurveyIdx] = useState(0);
  const [selectedSurveyOption, setSelectedSurveyOption] = useState<string | null>(null);

  // --- FETCH DYNAMIC DATA ON MOUNT ---
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await api.learning.getOnboardingConfig();
        setConfig(data);
        setPhase('course');
      } catch (error) {
        console.error("Failed to load onboarding config", error);
      }
    };
    fetchConfig();
  }, []);

  // Determine which quiz to show based on backend data
  const activeQuiz = config && selectedLevel ? config.diagnosticQuizzes[selectedLevel] : [];

  // --- HANDLERS ---
  const handleNextQuiz = () => {
    const isCorrect = activeQuiz[currentQuizIdx].options.find((o: any) => o.id === selectedQuizOption)?.isCorrect;
    if (isCorrect) setScore(prev => prev + 1);

    if (currentQuizIdx < activeQuiz.length - 1) {
      setCurrentQuizIdx(prev => prev + 1);
      setSelectedQuizOption(null);
    } else {
      setPhase('surveyIntro');
    }
  };

  const handleNextSurvey = async () => {
    if (currentSurveyIdx < config.surveyQuestions.length - 1) {
      setCurrentSurveyIdx(prev => prev + 1);
      setSelectedSurveyOption(null);
    } else {
      setPhase('processing');
      try {
        const userId = localStorage.getItem('gels_user_id');
        let baselineScore = score / activeQuiz.length; 
        
        if (selectedLevel === 'intermediate') baselineScore = Math.min(baselineScore + 0.3, 1.0);
        if (selectedLevel === 'advanced') baselineScore = Math.min(baselineScore + 0.6, 1.0);

        if (userId && selectedSurveyOption) {
          await api.learning.completeOnboarding({
            user_id: userId,
            baseline_score: baselineScore,
            player_type: selectedSurveyOption
          });
        }
      } catch (err) {
        console.error("Failed to sync onboarding data:", err);
      } finally {
        setTimeout(() => setPhase('done'), 1500);
      }
    }
  };

  const renderProgressBar = (current: number, total: number, color: string) => (
    <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border-2 border-slate-200 mb-8 max-w-2xl mx-auto mt-6">
      <div 
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${((current) / total) * 100}%` }}
      >
        <div className="w-full h-1/3 bg-white/30 rounded-full mt-0.5 ml-1"></div>
      </div>
    </div>
  );

  // --- RENDERS ---

  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans text-slate-400">
        <Loader2 className="animate-spin mb-4 text-[#1CB0F6]" size={48} strokeWidth={3} />
        <h2 className="font-black tracking-widest uppercase">Loading Modules...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      
      {/* PHASE 1: DYNAMIC COURSE SELECTION */}
      {phase === 'course' && config && (
        <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto p-4 animate-in fade-in zoom-in duration-500 justify-center">
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-700 mb-4 tracking-tight">What do you want to learn?</h1>
            <p className="text-lg font-bold text-slate-400">Select a course to begin your journey.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {config.courses.map((course: any) => {
              const IconComponent = IconMap[course.icon] || Code;
              return (
                <button 
                  key={course.id}
                  onClick={() => setSelectedCourse(course.id)} 
                  className={`p-8 rounded-3xl border-2 border-b-4 transition-all flex flex-col items-center text-center ${selectedCourse === course.id ? `${course.bgClass} ${course.borderClass} transform -translate-y-1` : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'}`}
                >
                  <IconComponent size={48} className={`${course.colorClass} mb-4`} strokeWidth={2.5}/>
                  <h3 className="font-black text-slate-700 text-xl">{course.title}</h3>
                </button>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <button 
              disabled={!selectedCourse}
              onClick={() => setPhase('level')}
              className={`w-full max-w-sm py-4 rounded-2xl text-lg font-black uppercase tracking-widest transition-all mx-auto ${selectedCourse ? 'bg-[#1CB0F6] text-white border-b-4 border-[#1899D6] hover:bg-[#149FDF] active:translate-y-1 active:border-b-0' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: DYNAMIC LEVEL SELECTION */}
      {phase === 'level' && config && (
        <div className="flex-1 flex flex-col w-full max-w-3xl mx-auto p-4 animate-in slide-in-from-right duration-300 justify-center">
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-700 mb-4 tracking-tight">What's your experience level?</h1>
            <p className="text-lg font-bold text-slate-400">We'll adjust the diagnostic quiz based on your answer.</p>
          </div>
          
          <div className="space-y-4">
            {config.levels.map((level: any) => {
              const IconComponent = IconMap[level.icon] || Book;
              return (
                <button 
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id)} 
                  className={`w-full p-6 rounded-3xl border-2 border-b-4 transition-all flex items-center gap-6 ${selectedLevel === level.id ? `${level.bgHex}/10 border-[${level.bgHex.replace('bg-', '')}] transform -translate-y-1` : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                >
                  <div className={`w-16 h-16 rounded-2xl ${level.bgHex} flex items-center justify-center text-white shrink-0 shadow-sm`}>
                    <IconComponent size={32} strokeWidth={2.5} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-black text-slate-700 text-2xl mb-1">{level.title}</h3>
                    <p className="font-bold text-slate-500">{level.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <button 
              disabled={!selectedLevel}
              onClick={() => setPhase('quizIntro')}
              className={`w-full max-w-sm py-4 rounded-2xl text-lg font-black uppercase tracking-widest transition-all mx-auto ${selectedLevel ? 'bg-[#58CC02] text-white border-b-4 border-[#46A302] hover:bg-[#46A302] active:translate-y-1 active:border-b-0' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* PHASE 3: QUIZ INTRO */}
      {phase === 'quizIntro' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-500">
          <div className="w-24 h-24 rounded-3xl bg-[#1CB0F6] flex items-center justify-center font-black text-white text-5xl border-b-8 border-[#1899D6] mb-8 transform -rotate-6 shadow-xl">
            G
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-700 mb-4 tracking-tight">Let's find your exact level.</h1>
          <p className="text-lg font-bold text-slate-400 max-w-md mb-10">
            We've prepared a diagnostic based on your {selectedLevel} status to calibrate the Cognitive Engine.
          </p>
          <button onClick={() => setPhase('quiz')} className="w-full max-w-sm bg-[#1CB0F6] text-white py-4 rounded-2xl text-lg font-black uppercase tracking-widest transition-all border-b-4 border-[#1899D6] hover:bg-[#149FDF] active:translate-y-1 active:border-b-0 shadow-sm">
            Start Diagnostic
          </button>
        </div>
      )}

      {/* PHASE 4: DYNAMIC QUIZ */}
      {phase === 'quiz' && activeQuiz && (
        <div className="flex-1 flex flex-col w-full max-w-3xl mx-auto p-4 animate-in slide-in-from-right duration-300">
          {renderProgressBar(currentQuizIdx, activeQuiz.length, "bg-[#1CB0F6]")}
          
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-700 mb-10 leading-tight text-center">
              {activeQuiz[currentQuizIdx].question}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeQuiz[currentQuizIdx].options.map((opt: any) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedQuizOption(opt.id)}
                  className={`p-6 rounded-2xl text-left border-2 border-b-4 transition-all text-xl font-bold flex items-center gap-4 ${
                    selectedQuizOption === opt.id 
                      ? 'bg-[#DDF4FF] border-[#1CB0F6] text-[#1CB0F6] transform translate-y-1 border-b-2' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedQuizOption === opt.id ? 'border-[#1CB0F6] bg-white' : 'border-slate-300'}`}>
                    {selectedQuizOption === opt.id && <div className="w-4 h-4 rounded-full bg-[#1CB0F6]"></div>}
                  </div>
                  {opt.text}
                </button>
              ))}
            </div>
          </div>

          <div className="py-6 border-t-2 border-slate-100 mt-auto">
            <button 
              disabled={!selectedQuizOption}
              onClick={handleNextQuiz}
              className={`w-full py-4 rounded-2xl text-lg font-black uppercase tracking-widest transition-all ${
                selectedQuizOption ? 'bg-[#1CB0F6] text-white border-b-4 border-[#1899D6] active:translate-y-1 active:border-b-0' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* PHASE 5: SURVEY INTRO */}
      {phase === 'surveyIntro' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-500">
          <div className="w-24 h-24 rounded-full bg-[#FFD900] flex items-center justify-center text-yellow-900 border-b-8 border-[#D97A00] mb-8 shadow-xl">
            <Sparkles size={48} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-700 mb-4 tracking-tight">Diagnostic Complete!</h1>
          <p className="text-lg font-bold text-slate-400 max-w-md mb-10">
            Now, let's personalize your rewards. How do you like to learn?
          </p>
          <button onClick={() => setPhase('survey')} className="w-full max-w-sm bg-[#CE82FF] text-white py-4 rounded-2xl text-lg font-black uppercase tracking-widest transition-all border-b-4 border-[#A568CC] hover:bg-[#B870E6] active:translate-y-1 active:border-b-0 shadow-sm">
            Set Preferences
          </button>
        </div>
      )}

      {/* PHASE 6: DYNAMIC SURVEY */}
      {phase === 'survey' && config && (
        <div className="flex-1 flex flex-col w-full max-w-3xl mx-auto p-4 animate-in slide-in-from-right duration-300">
          {renderProgressBar(currentSurveyIdx, config.surveyQuestions.length, "bg-[#CE82FF]")}
          
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-700 mb-10 leading-tight text-center">
              {config.surveyQuestions[currentSurveyIdx].question}
            </h2>
            <div className="space-y-4">
              {config.surveyQuestions[currentSurveyIdx].options.map((opt: any) => {
                const IconComponent = IconMap[opt.icon] || Sparkles;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedSurveyOption(opt.id)}
                    className={`w-full p-6 rounded-3xl text-left border-2 border-b-4 transition-all text-xl font-bold flex items-center gap-6 ${
                      selectedSurveyOption === opt.id 
                        ? 'bg-[#F4E0FF] border-[#CE82FF] text-[#CE82FF] transform translate-y-1 border-b-2' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="p-4 rounded-2xl bg-white border-2 border-slate-100 shadow-sm shrink-0">
                      <IconComponent className={opt.color} />
                    </div>
                    {opt.text}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="py-6 border-t-2 border-slate-100 mt-auto">
            <button 
              disabled={!selectedSurveyOption}
              onClick={handleNextSurvey}
              className={`w-full py-4 rounded-2xl text-lg font-black uppercase tracking-widest transition-all ${
                selectedSurveyOption ? 'bg-[#CE82FF] text-white border-b-4 border-[#A568CC] active:translate-y-1 active:border-b-0' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* PHASE 7: PROCESSING */}
      {phase === 'processing' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <BrainCircuit size={80} strokeWidth={2} className="text-[#1CB0F6] animate-pulse mb-8" />
          <h2 className="text-2xl font-black text-slate-700 mb-2 uppercase tracking-widest animate-bounce">
            Calibrating Engines...
          </h2>
          <p className="font-bold text-slate-400">Processing baseline vector & affective profile</p>
        </div>
      )}

      {/* PHASE 8: DONE */}
      {phase === 'done' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-500">
          <div className="w-24 h-24 rounded-full bg-[#58CC02] flex items-center justify-center text-white border-b-8 border-[#46A302] mb-8 shadow-xl">
            <Trophy size={48} strokeWidth={3} />
          </div>
          
          <div className="bg-[#FF9600]/10 text-[#FF9600] px-4 py-2 rounded-xl font-black uppercase tracking-widest text-sm border-2 border-[#FF9600]/20 mb-4">
            Profile: {selectedSurveyOption || 'ACHIEVER'}
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-black text-slate-700 mb-4 tracking-tight">You're all set!</h1>
          <p className="text-lg font-bold text-slate-400 max-w-md mb-10">
            We've customized your learning path based on your {selectedLevel} level. Let's start the journey.
          </p>
          <Link href="/" className="w-full max-w-sm bg-[#58CC02] text-white py-4 rounded-2xl text-lg font-black uppercase tracking-widest transition-all border-b-4 border-[#46A302] hover:bg-[#46A302] active:translate-y-1 active:border-b-0 shadow-sm flex justify-center">
            Enter Dashboard
          </Link>
        </div>
      )}

    </div>
  );
}