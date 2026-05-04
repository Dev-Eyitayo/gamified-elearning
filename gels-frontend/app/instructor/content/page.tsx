import React from 'react';
import { Plus, FileText, Settings2, MoreHorizontal } from 'lucide-react';

export default function ContentManagementPage() {
  const modules = [
    { id: 1, title: "Module 4.1", name: "Intro to Data Structures", difficulty: "EASY", topic: "Arrays" },
    { id: 2, title: "Module 4.2", name: "LIFO vs FIFO Operations", difficulty: "MEDIUM", topic: "Stacks/Queues" },
    { id: 3, title: "Module 4.3", name: "Tree Traversal", difficulty: "HARD", topic: "Trees" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-700 uppercase tracking-tight">Curriculum Base</h1>
          <p className="text-slate-500 font-bold mt-1">Upload structured modules for AI sequencing.</p>
        </div>
        <button className="bg-[#58CC02] text-white px-6 py-3.5 rounded-2xl font-black uppercase tracking-widest transition-all border-b-4 border-[#46A302] hover:bg-[#46A302] active:translate-y-1 active:border-b-0 flex items-center gap-2 shadow-sm">
          <Plus size={20} strokeWidth={3} /> Upload Module
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod) => (
          <div key={mod.id} className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-[0_6px_0_0_#E5E5E5] flex flex-col transition-transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#CE82FF]/10 text-[#CE82FF] flex items-center justify-center border-2 border-[#CE82FF]/20">
                <FileText size={24} strokeWidth={2.5} />
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreHorizontal size={24} strokeWidth={3} />
              </button>
            </div>
            
            <span className="text-[#CE82FF] font-black uppercase tracking-widest text-xs mb-1">{mod.title}</span>
            <h3 className="font-black text-slate-700 text-xl mb-4">{mod.name}</h3>
            
            <div className="mt-auto flex gap-2">
              <span className={`px-3 py-1.5 rounded-xl font-black uppercase tracking-widest text-[10px] border-2 ${
                mod.difficulty === 'EASY' ? 'bg-[#58CC02]/10 text-[#58CC02] border-[#58CC02]/20' : 
                mod.difficulty === 'MEDIUM' ? 'bg-[#FF9600]/10 text-[#FF9600] border-[#FF9600]/20' : 
                'bg-[#FF4B4B]/10 text-[#FF4B4B] border-[#FF4B4B]/20'
              }`}>
                {mod.difficulty}
              </span>
              <span className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-xl font-black uppercase tracking-widest text-[10px] border-2 border-slate-200">
                {mod.topic}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}