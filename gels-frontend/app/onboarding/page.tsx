"use client";

import React, { useState, useEffect } from 'react';
import { BrainCircuit, Trophy, ArrowRight, Sparkles, Code, Users, Compass } from 'lucide-react';
import Link from 'next/link';

export default function OnboardingPage() {
  // Overall flow state
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'surveyIntro' | 'survey' | 'processing' | 'done'>('intro');
  
  // Quiz State (Baseline Assessment)
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  
  // Survey State (Player-Type Profiling)
  const [currentSurveyIdx, setCurrentSurveyIdx] = useState(0);
  const [selectedSurveyOption, setSelectedSurveyOption] = useState<string | null>(null);

  // Mock Diagnostic Quiz (PRD 8.1)
  const quizQuestions = [
    {
      question: "What is the time complexity of binary search?",
      options: [{ id: 1, text: "O(1)" }, { id: 2, text: "O(n)" }, { id: 3, text: "O(log n)" }, { id: 4, text: "O(n²)" }]
    },
    {
      question: "Which data structure uses LIFO (Last-In, First-Out)?",
      options: [{ id: 1, text: "Queue" }, { id: 2, text: "Stack" }, { id: 3, text: "Tree" }, { id: 4, text: "Graph" }]
    }
  ];

  // Mock Behavioral Survey (PRD 8.2)
  const surveyQuestions = [
    {
      question: "When you learn something new, you prefer to:",
      options: [
        { id: 'ACHIEVER', text: "Master it completely and get a high score", icon: <Trophy className="text-[#FFD900]" /> },
        { id: 'SOCIALIZER', text: "Discuss it and solve problems with peers", icon: <Users className="text-[#1CB0F6]" /> },
        { id: 'EXPLORER', text: "Explore related topics and hidden concepts", icon: <Compass className="text-[#CE82FF]" /> }
      ]
    }
  ];

  // Handlers
  const handleNextQuiz = () => {
    if (currentQuizIdx < quizQuestions.length - 1) {
      setCurrentQuizIdx(prev => prev + 1);
      setSelectedQuizOption(null);
    } else {
      setPhase('surveyIntro');
    }
  };

  const handleNextSurvey = () => {
    if (currentSurveyIdx < surveyQuestions.length - 1) {
      setCurrentSurveyIdx(prev => prev + 1);
      setSelectedSurveyOption(null);
    } else {
      setPhase('processing');
      // Simulate API processing delay
      setTimeout(() => setPhase('done'), 3000);
    }
  };

  // --- RENDER HELPERS ---

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

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      
      {/* PHASE: INTRO */}
      {phase === 'intro' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 rounded-3xl bg-[#1CB0F6] flex items-center justify-center font-black text-white text-5xl border-b-8 border-[#1899D6] mb-8 transform -rotate-6 shadow-xl">
            G
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-700 mb-4 tracking-tight">Let's find your level.</h1>
          <p className="text-lg font-bold text-slate-400 max-w-md mb-10">
            We'll start with a quick diagnostic to calibrate the Cognitive Engine to your exact knowledge state.
          </p>
          <button onClick={() => setPhase('quiz')} className="w-full max-w-sm bg-[#58CC02] text-white py-4 rounded-2xl text-lg font-black uppercase tracking-widest transition-all border-b-4 border-[#46A302] hover:bg-[#46A302] active:translate-y-1 active:border-b-0 shadow-sm">
            Start Diagnostic
          </button>
        </div>
      )}

      {/* PHASE: QUIZ (BASELINE ASSESSMENT) */}
      {phase === 'quiz' && (
        <div className="flex-1 flex flex-col w-full max-w-3xl mx-auto p-4 animate-in slide-in-from-right duration-300">
          {renderProgressBar(currentQuizIdx, quizQuestions.length, "bg-[#58CC02]")}
          
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-700 mb-10 leading-tight text-center">
              {quizQuestions[currentQuizIdx].question}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quizQuestions[currentQuizIdx].options.map((opt) => (
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
                selectedQuizOption ? 'bg-[#58CC02] text-white border-b-4 border-[#46A302] active:translate-y-1 active:border-b-0' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* PHASE: SURVEY INTRO */}
      {phase === 'surveyIntro' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-500">
          <div className="w-24 h-24 rounded-full bg-[#FFD900] flex items-center justify-center text-yellow-900 border-b-8 border-[#D97A00] mb-8 shadow-xl">
            <Sparkles size={48} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-700 mb-4 tracking-tight">Great job!</h1>
          <p className="text-lg font-bold text-slate-400 max-w-md mb-10">
            Now, let's personalize your rewards. How do you like to learn?
          </p>
          <button onClick={() => setPhase('survey')} className="w-full max-w-sm bg-[#1CB0F6] text-white py-4 rounded-2xl text-lg font-black uppercase tracking-widest transition-all border-b-4 border-[#1899D6] hover:bg-[#149FDF] active:translate-y-1 active:border-b-0 shadow-sm">
            Set Preferences
          </button>
        </div>
      )}

      {/* PHASE: SURVEY (PLAYER-TYPE MAPPING) */}
      {phase === 'survey' && (
        <div className="flex-1 flex flex-col w-full max-w-3xl mx-auto p-4 animate-in slide-in-from-right duration-300">
          {renderProgressBar(currentSurveyIdx, surveyQuestions.length, "bg-[#1CB0F6]")}
          
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-700 mb-10 leading-tight text-center">
              {surveyQuestions[currentSurveyIdx].question}
            </h2>
            <div className="space-y-4">
              {surveyQuestions[currentSurveyIdx].options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedSurveyOption(opt.id)}
                  className={`w-full p-6 rounded-3xl text-left border-2 border-b-4 transition-all text-xl font-bold flex items-center gap-6 ${
                    selectedSurveyOption === opt.id 
                      ? 'bg-[#DDF4FF] border-[#1CB0F6] text-[#1CB0F6] transform translate-y-1 border-b-2' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="p-4 rounded-2xl bg-white border-2 border-slate-100 shadow-sm shrink-0">
                    {opt.icon}
                  </div>
                  {opt.text}
                </button>
              ))}
            </div>
          </div>

          <div className="py-6 border-t-2 border-slate-100 mt-auto">
            <button 
              disabled={!selectedSurveyOption}
              onClick={handleNextSurvey}
              className={`w-full py-4 rounded-2xl text-lg font-black uppercase tracking-widest transition-all ${
                selectedSurveyOption ? 'bg-[#1CB0F6] text-white border-b-4 border-[#1899D6] active:translate-y-1 active:border-b-0' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* PHASE: PROCESSING */}
      {phase === 'processing' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <BrainCircuit size={80} strokeWidth={2} className="text-[#CE82FF] animate-pulse mb-8" />
          <h2 className="text-2xl font-black text-slate-700 mb-2 uppercase tracking-widest animate-bounce">
            Calibrating Engines...
          </h2>
          <p className="font-bold text-slate-400">Processing baseline vector & affective profile</p>
        </div>
      )}

      {/* PHASE: DONE */}
      {phase === 'done' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-500">
          <div className="w-24 h-24 rounded-full bg-[#58CC02] flex items-center justify-center text-white border-b-8 border-[#46A302] mb-8 shadow-xl">
            <Trophy size={48} strokeWidth={3} />
          </div>
          <div className="bg-[#FF9600]/10 text-[#FF9600] px-4 py-2 rounded-xl font-black uppercase tracking-widest text-sm border-2 border-[#FF9600]/20 mb-4">
            Profile: ACHIEVER
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-700 mb-4 tracking-tight">You're all set!</h1>
          <p className="text-lg font-bold text-slate-400 max-w-md mb-10">
            We've customized your learning path and reward mechanics. Let's start the journey.
          </p>
          <Link href="/" className="w-full max-w-sm bg-[#58CC02] text-white py-4 rounded-2xl text-lg font-black uppercase tracking-widest transition-all border-b-4 border-[#46A302] hover:bg-[#46A302] active:translate-y-1 active:border-b-0 shadow-sm flex justify-center">
            Enter Dashboard
          </Link>
        </div>
      )}

    </div>
  );
}