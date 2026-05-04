import React from 'react';
import { Book, Code, Database, Braces, Play, Lock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function ClassesPage() {
  const units = [
    {
      id: 1,
      title: "Unit 1",
      name: "Programming Foundations",
      desc: "Variables, loops, and basic logic.",
      color: "bg-[#CE82FF]",
      borderColor: "border-[#A568CC]",
      textColor: "text-[#CE82FF]",
      icon: <Code size={40} strokeWidth={2.5} className="text-white" />,
      progress: 100,
      status: "completed"
    },
    {
      id: 2,
      title: "Unit 2",
      name: "Data Structures",
      desc: "Arrays, Linked Lists, and Hash Maps.",
      color: "bg-[#1CB0F6]",
      borderColor: "border-[#1899D6]",
      textColor: "text-[#1CB0F6]",
      icon: <Database size={40} strokeWidth={2.5} className="text-white" />,
      progress: 45,
      status: "active"
    },
    {
      id: 3,
      title: "Unit 3",
      name: "Algorithms",
      desc: "Sorting, Searching, and Big O Notation.",
      color: "bg-[#FF9600]",
      borderColor: "border-[#D97A00]",
      textColor: "text-[#FF9600]",
      icon: <Braces size={40} strokeWidth={2.5} className="text-white" />,
      progress: 0,
      status: "locked"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-10">
      
      {/* Header */}
      <div className="border-b-4 border-slate-200 pb-6">
        <h1 className="text-4xl font-black text-slate-700 uppercase tracking-tight">Curriculum</h1>
        <p className="text-slate-500 font-bold mt-2 text-lg">Master software engineering step-by-step</p>
      </div>

      {/* Unit Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {units.map((unit) => (
          <div 
            key={unit.id} 
            className={`flex flex-col bg-white rounded-3xl border-2 transition-all transform hover:-translate-y-1 ${
              unit.status === 'locked' 
                ? 'border-slate-200 shadow-[0_6px_0_0_#E5E5E5] opacity-75 grayscale' 
                : `${unit.borderColor} shadow-[0_8px_0_0_${unit.borderColor.replace('border-', '')}]`
            }`}
          >
            {/* Unit Header Color Block */}
            <div className={`${unit.status === 'locked' ? 'bg-slate-200' : unit.color} p-6 rounded-t-3xl flex justify-between items-start border-b-4 border-black/10`}>
              <div>
                <h2 className="text-white/90 font-black uppercase tracking-widest text-sm mb-1">{unit.title}</h2>
                <h3 className="text-2xl font-black text-white leading-tight">{unit.name}</h3>
              </div>
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center shrink-0 border-2 border-white/30 backdrop-blur-sm">
                {unit.icon}
              </div>
            </div>

            {/* Unit Content */}
            <div className="p-6 flex flex-col flex-1">
              <p className="text-slate-500 font-bold mb-6 flex-1">{unit.desc}</p>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Progress</span>
                  <span className={`text-sm font-black ${unit.status === 'locked' ? 'text-slate-400' : unit.textColor}`}>
                    {unit.progress}%
                  </span>
                </div>
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border-2 border-slate-200">
                  <div 
                    className={`h-full rounded-full transition-all ${unit.status === 'locked' ? 'bg-slate-300' : unit.color}`}
                    style={{ width: `${unit.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Button */}
              {unit.status === 'completed' && (
                <button className="w-full bg-slate-100 text-slate-500 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest border-2 border-slate-200 flex items-center justify-center gap-2">
                  <CheckCircle2 size={20} strokeWidth={3} /> Review
                </button>
              )}
              {unit.status === 'active' && (
                <Link href="/lesson" className={`w-full ${unit.color} text-white py-3.5 rounded-2xl text-base font-black uppercase tracking-widest border-b-4 border-black/20 hover:brightness-110 active:translate-y-1 active:border-b-0 flex items-center justify-center gap-2 transition-all`}>
                  <Play size={20} strokeWidth={3} fill="currentColor" /> Continue
                </Link>
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
    </div>
  );
}