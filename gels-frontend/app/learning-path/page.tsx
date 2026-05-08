"use client";

import React, { useState, useEffect } from 'react';
import { Star, Book, Dumbbell, Trophy, BookOpen, Loader2, AlertCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/api/api';

export default function LearningPathPage() {
  const [pathData, setPathData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPath = async () => {
      try {
        setIsLoading(true);
        const userId = typeof window !== 'undefined' ? localStorage.getItem('gels_user_id') : null;
        
        // 🛑 Stop if the ID is missing or literally "undefined"
        if (!userId || userId === "undefined") {
          console.warn("Instructor/User ID not found in storage yet.");
          setIsLoading(false);
          return; 
        }

        const paths = await api.learning.getAllPaths(userId); 
        
        if (paths && paths.length > 0) {
          const fullTree = await api.learning.getFullPath(paths[0].id);
          setPathData(fullTree);
        } else {
          setPathData(null);
        }
      } catch (err: any) {
        console.error("Path sync error:", err);
        setError("Failed to sync curriculum. Please refresh.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPath();
  }, []);

  const renderIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'book': return <Book size={36} strokeWidth={2.5} fill="currentColor" />;
      case 'dumbbell': return <Dumbbell size={36} strokeWidth={2.5} fill="currentColor" />;
      case 'trophy': return <Trophy size={36} strokeWidth={2.5} fill="currentColor" />;
      default: return <Star size={36} strokeWidth={2.5} fill="currentColor" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-sans text-slate-400 bg-white">
        <Loader2 className="animate-spin mb-4 text-[#58CC02]" size={48} strokeWidth={3} />
        <h2 className="font-black tracking-widest uppercase">Loading Path...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-sans bg-white px-6 text-center">
        <AlertCircle size={64} className="text-[#FF4B4B] mb-4" strokeWidth={2.5} />
        <p className="font-bold text-[#FF4B4B] text-xl">{error}</p>
      </div>
    );
  }

  if (!pathData || !pathData.sections || pathData.sections.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-sans bg-white px-6 text-center">
        <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mb-8 border-4 border-dashed border-slate-200">
           <Book size={48} className="text-slate-300" />
        </div>
        <h2 className="text-2xl font-black text-slate-700 uppercase tracking-tight">Path Under Construction</h2>
        <p className="font-bold text-slate-400 mt-2">Check back soon for lessons!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans pb-40">
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b-4 border-slate-200 p-5 flex justify-center shadow-sm">
        <h1 className="text-2xl font-black text-slate-700 uppercase tracking-tight">{pathData.title}</h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-10 space-y-20">
        {pathData.sections.map((section: any) => (
          <div key={section.section_id} className="space-y-16">
            <div className="text-center relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-1 bg-slate-200 rounded-full"></div>
              </div>
              <span className="relative bg-white px-8 py-3 font-black text-slate-400 uppercase tracking-widest text-sm border-2 border-slate-200 rounded-2xl">
                {section.title}
              </span>
            </div>

            {section.units.map((unit: any) => (
              <div key={unit.unit_id} className="relative">
                <div className="rounded-3xl p-6 mb-12 shadow-[0_6px_0_0_rgba(0,0,0,0.1)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-white z-10 relative overflow-hidden"
                     style={{ backgroundColor: unit.theme_color || '#1CB0F6' }}>
                  <div className="relative z-10">
                    <h2 className="text-2xl font-black tracking-tight uppercase">{unit.title}</h2>
                    <p className="font-bold opacity-80 text-sm mt-1">Complete all levels to advance.</p>
                  </div>
                  <button className="flex items-center gap-2 bg-black/10 hover:bg-black/20 px-6 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all">
                    <BookOpen size={18} strokeWidth={3} /> Guidebook
                  </button>
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full" />
                </div>

                <div className="flex flex-col items-center py-4 relative">
                  <div className="absolute top-0 bottom-0 w-4 bg-[#E5E5E5] rounded-full -z-10" />
                  {unit.levels.map((level: any, idx: number) => {
                    const offset = Math.sin(idx * 1.1) * 80; 
                    return (
                      <div key={level.level_id} className="my-6 relative group" style={{ transform: `translateX(${offset}px)` }}>
                        <Link href={`/learning/${unit.unit_id}/${level.level_id || 'start'}`}
                              className="w-24 h-24 rounded-full flex items-center justify-center text-white relative transition-all active:translate-y-2 hover:brightness-110 shadow-[0_10px_0_0_rgba(0,0,0,0.1)] active:shadow-none z-10"
                              style={{ backgroundColor: unit.theme_color || '#1CB0F6' }}>
                          <div className="absolute inset-2 rounded-full border-t-4 border-white/25 pointer-events-none"></div>
                          {renderIcon(level.icon_type)}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}