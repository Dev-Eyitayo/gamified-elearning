"use client";

import React, { useState, useEffect } from 'react';
import { Book, Code, Database, Braces, Play, Lock, Loader2, LayoutTemplate, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/api/api';

const colorPalettes = [
  { color: "bg-[#CE82FF]", border: "border-[#A568CC]", text: "text-[#CE82FF]" },
  { color: "bg-[#1CB0F6]", border: "border-[#1899D6]", text: "text-[#1CB0F6]" },
  { color: "bg-[#FF9600]", border: "border-[#D97A00]", text: "text-[#FF9600]" },
  { color: "bg-[#58CC02]", border: "border-[#46A302]", text: "text-[#58CC02]" }
];

const icons = [Code, Database, Braces, Book, LayoutTemplate];

export default function ClassesPage() {
  const router = useRouter();
  const [units, setUnits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        const modulesData = await api.learning.getModules();
        
        const formattedUnits = modulesData.map((mod: any, index: number) => {
          let status = 'active';
          let progress = 0; 
          const palette = colorPalettes[index % colorPalettes.length];
          const IconComponent = icons[index % icons.length];

          return {
            id: mod.module_id,
            title: mod.title || `Unit ${index + 1}`,
            name: mod.name,
            desc: `Difficulty: ${mod.difficulty} | Topic: ${mod.topic_id}`,
            color: palette.color,
            borderColor: palette.border,
            textColor: palette.text,
            icon: <IconComponent size={40} strokeWidth={2.5} className="text-white" />,
            progress: progress,
            status: status
          };
        });

        setUnits(formattedUnits);
      } catch (err: any) {
        setError("Failed to sync curriculum with the database.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurriculum();
  }, []);

  if (isLoading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[#CE82FF]" size={48} /></div>;
  if (error) return <div className="text-center text-[#FF4B4B] font-bold p-10">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-10 animate-in fade-in duration-500">
      <div className="border-b-4 border-slate-200 pb-6">
        <h1 className="text-4xl font-black text-slate-700 uppercase tracking-tight">Curriculum</h1>
        <p className="text-slate-500 font-bold mt-2 text-lg">Master software engineering step-by-step</p>
      </div>

      {units.length === 0 ? (
        <div className="p-12 border-2 border-slate-200 border-dashed rounded-3xl text-center">
          <Book size={64} className="mx-auto mb-4 text-slate-300" strokeWidth={2} />
          <h2 className="text-2xl font-black text-slate-400 uppercase tracking-widest">No Modules Found</h2>
          <p className="text-slate-400 font-bold mt-2">Waiting for instructors to add content to the database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {units.map((unit) => (
            <div key={unit.id} className={`flex flex-col bg-white rounded-3xl border-2 transition-all transform hover:-translate-y-1 ${unit.status === 'locked' ? 'border-slate-200 shadow-[0_6px_0_0_#E5E5E5] opacity-75 grayscale' : `${unit.borderColor} shadow-[0_8px_0_0_${unit.borderColor.replace('border-', '')}]`}`}>
              <div className={`${unit.status === 'locked' ? 'bg-slate-200' : unit.color} p-6 rounded-t-3xl flex justify-between items-start border-b-4 border-black/10`}>
                <div>
                  <h2 className="text-white/90 font-black uppercase tracking-widest text-sm mb-1">{unit.title}</h2>
                  <h3 className="text-2xl font-black text-white leading-tight">{unit.name}</h3>
                </div>
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center shrink-0 border-2 border-white/30 backdrop-blur-sm">
                  {unit.icon}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <p className="text-slate-500 font-bold mb-6 flex-1">{unit.desc}</p>
                
                {unit.status === 'active' && (
                  <button
                    onClick={() => router.push(`/learning/${unit.id}/start`)}
                    className={`mt-6 w-full sm:w-auto ${unit.color} text-white px-8 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all border-b-4 border-black/20 hover:brightness-110 active:translate-y-1 active:border-b-0 flex items-center justify-center gap-2`}
                  >
                    Start Lesson <ArrowRight size={20} strokeWidth={3} />
                  </button>
                )}
                
                {unit.status === 'locked' && (
                  <button className="w-full bg-slate-100 text-slate-400 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest border-2 border-slate-200 flex items-center justify-center gap-2 cursor-not-allowed">
                    <Lock size={20} strokeWidth={3} /> Locked
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}