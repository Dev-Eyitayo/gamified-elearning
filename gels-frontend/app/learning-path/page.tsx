"use client";

import React, { useState, useEffect } from 'react';
import { Check, Lock, BrainCircuit, Play, ArrowRight, Star, Loader2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/api/api'; 

export default function LearningPath() {
  const router = useRouter();
  
  const [modules, setModules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPathData = async () => {
      try {
        const userId = localStorage.getItem('gels_user_id');
        if (!userId) {
          router.push('/auth/login');
          return;
        }

        // Fetch the curriculum and the AI's current decision concurrently
        const [curriculumData, nextModuleData] = await Promise.all([
          api.learning.getModules(),
          api.learning.getNextModule(userId)
        ]);

        // Map the backend data to our UI's visual requirements.
        // In a full production system, we would check the 'EventLog' to see exactly 
        // which ones are complete. For the pilot, we dynamically assign status based on array order.
        const mappedModules = curriculumData.map((mod: any, index: number) => {
          
          // MVP Logic: 1st module is complete, 2nd is active, rest are locked
          let status = 'locked';
          if (index === 0) status = 'completed';
          if (index === 1) status = 'active';

          return {
            id: mod.module_id,
            title: mod.title || mod.name,
            difficulty: mod.difficulty,
            status: status,
            score: status === 'completed' ? '92%' : null, // Mock score for MVP
            action: status === 'active' ? nextModuleData.action_taken : null,
            note: status === 'locked' ? 'Pending prerequisites' : null
          };
        });

        setModules(mappedModules);

      } catch (err: any) {
        console.error("Failed to load learning path:", err);
        setError("Failed to load curriculum. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPathData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center font-sans text-slate-400">
        <Loader2 className="animate-spin mb-4 text-[#CE82FF]" size={48} strokeWidth={3} />
        <h2 className="font-black tracking-widest uppercase">Plotting Adaptive Path...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center font-sans">
        <div className="bg-[#FF4B4B]/10 text-[#FF4B4B] p-6 rounded-3xl border-2 border-[#FF4B4B]/20 flex flex-col items-center text-center max-w-md">
          <AlertCircle size={48} strokeWidth={2.5} className="mb-4" />
          <h2 className="font-black text-xl mb-2">Curriculum Error</h2>
          <p className="font-bold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-4 px-4 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 border-b-4 border-slate-200 pb-6">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-black text-slate-700 uppercase tracking-tight">Learning Path</h1>
          <p className="text-slate-500 font-bold mt-2 text-lg">Your AI-adapted journey</p>
        </div>
        
        {/* Purple AI Badge */}
        <div className="flex items-center gap-2 bg-[#CE82FF] px-5 py-2.5 rounded-2xl border-b-4 border-[#A568CC] shadow-sm text-white">
          <BrainCircuit size={24} strokeWidth={3} />
          <span className="text-sm font-black uppercase tracking-wider mt-0.5">AI Active</span>
        </div>
      </div>

      {/* Path Container */}
      <div className="relative">
        
        {/* The Thick Gray Background Line connecting the nodes */}
        <div className="absolute left-[40px] md:left-[44px] top-10 bottom-10 w-4 bg-[#E5E5E5] rounded-full z-0"></div>

        {modules.length === 0 ? (
           <div className="relative z-10 bg-white border-2 border-slate-200 border-dashed rounded-3xl p-10 text-center text-slate-400 font-bold">
             No modules found. Please ask your instructor to upload curriculum content!
           </div>
        ) : (
          <div className="space-y-8">
            {modules.map((mod) => (
              <div key={mod.id} className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8">

                {/* Column 1: The Timeline Node */}
                <div className="w-24 flex justify-center shrink-0">
                  <div className={`rounded-full flex items-center justify-center transition-transform shadow-sm ${
                    mod.status === 'completed' ? 'w-20 h-20 bg-[#58CC02] border-b-8 border-[#46A302] text-white' :
                    mod.status === 'active' ? 'w-24 h-24 bg-[#1CB0F6] border-b-8 border-[#1899D6] text-white shadow-xl animate-[bounce_3s_infinite]' :
                    'w-20 h-20 bg-[#E5E5E5] border-b-8 border-[#CECECE] text-[#AFAFAF]'
                  }`}>
                    {mod.status === 'completed' && <Check size={40} strokeWidth={4} />}
                    {mod.status === 'active' && <Play size={44} strokeWidth={3} className="ml-2" fill="currentColor" />}
                    {mod.status === 'locked' && <Lock size={32} strokeWidth={3} />}
                  </div>
                </div>

                {/* Column 2: The Content Card */}
                <div className={`flex-1 w-full rounded-3xl p-6 border-2 transition-all mt-2 md:mt-0 ${
                  mod.status === 'active' ? 'bg-[#DDF4FF] border-[#1CB0F6] shadow-[0_8px_0_0_#1CB0F6]' :
                  mod.status === 'completed' ? 'bg-white border-slate-200 shadow-[0_6px_0_0_#E5E5E5]' :
                  'bg-slate-50 border-slate-200 opacity-80'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div>
                      <h3 className={`text-xl font-black tracking-wide ${mod.status === 'locked' ? 'text-slate-400' : 'text-slate-700'}`}>
                        {mod.title}
                      </h3>
                      
                      {/* Dynamically show difficulty from backend */}
                      <span className={`text-xs font-bold uppercase tracking-widest mt-1 inline-block ${
                         mod.difficulty === 'EASY' ? 'text-[#58CC02]' : 
                         mod.difficulty === 'HARD' ? 'text-[#FF4B4B]' : 'text-[#FF9600]'
                      }`}>
                        Difficulty: {mod.difficulty}
                      </span>

                      {mod.status === 'locked' && (
                        <p className="mt-2 text-sm font-bold text-slate-400 flex items-center gap-2">
                          <Lock size={18} strokeWidth={3} /> {mod.note}
                        </p>
                      )}
                    </div>

                    {/* Badges & Scores */}
                    {mod.status === 'completed' && (
                      <div className="shrink-0 text-sm font-black text-[#FF9600] bg-[#FF9600]/10 border-2 border-[#FF9600]/20 px-3 py-1.5 rounded-xl uppercase flex items-center gap-1.5">
                        <Star size={16} strokeWidth={3} /> {mod.score}
                      </div>
                    )}
                    {mod.status === 'active' && mod.action && (
                      <div className="shrink-0 text-xs font-black text-[#CE82FF] bg-[#CE82FF]/10 border-2 border-[#CE82FF]/30 px-3 py-1.5 rounded-xl uppercase tracking-widest flex items-center gap-1.5">
                        <BrainCircuit size={16} strokeWidth={3} /> AI Adapted: {mod.action}
                      </div>
                    )}
                  </div>
                  
                  {/* 3D "Pressable" Button for Active Module */}
                  {mod.status === 'active' && (
                    <button 
                      onClick={() => router.push('/lesson')}
                      className="mt-6 w-full sm:w-auto bg-[#1CB0F6] text-white px-8 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all border-b-4 border-[#1899D6] hover:bg-[#149FDF] active:translate-y-1 active:border-b-0 flex items-center justify-center gap-2"
                    >
                      Start Lesson <ArrowRight size={20} strokeWidth={3} />
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}