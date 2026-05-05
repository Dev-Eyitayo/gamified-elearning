"use client";

import React, { useState, useEffect } from 'react';
import { Plus, FileText, MoreHorizontal, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/api/api';

export default function ContentManagementPage() {
  const [modules, setModules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadModules = async () => {
      try {
        const data = await api.learning.getModules();
        setModules(data);
      } catch (err) {
        console.error("Failed to fetch modules", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadModules();
  }, []);

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="animate-spin mb-4 text-[#58CC02]" size={48} strokeWidth={3} />
        <h2 className="font-black tracking-widest uppercase">Loading Curriculum Base...</h2>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-700 uppercase tracking-tight">Curriculum Base</h1>
          <p className="text-slate-500 font-bold mt-1">Upload structured modules for AI sequencing.</p>
        </div>
        <Link href="/instructor/content/new" className="bg-[#58CC02] text-white px-6 py-3.5 rounded-2xl font-black uppercase tracking-widest transition-all border-b-4 border-[#46A302] hover:bg-[#46A302] active:translate-y-1 active:border-b-0 flex items-center gap-2 shadow-sm">
            <Plus size={20} strokeWidth={3} /> Upload Module
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-slate-400 font-bold border-2 border-dashed border-slate-200 rounded-3xl">
            No modules exist. Click "Upload Module" to populate the database.
          </div>
        ) : modules.map((mod) => (
          <div key={mod.module_id} className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-[0_6px_0_0_#E5E5E5] flex flex-col transition-transform hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#CE82FF]/10 text-[#CE82FF] flex items-center justify-center border-2 border-[#CE82FF]/20">
                <FileText size={24} strokeWidth={2.5} />
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreHorizontal size={24} strokeWidth={3} />
              </button>
            </div>
            
            <span className="text-[#CE82FF] font-black uppercase tracking-widest text-xs mb-1">{mod.title || "Module"}</span>
            <h3 className="font-black text-slate-700 text-xl mb-4 truncate">{mod.name}</h3>
            
            <div className="mt-auto flex gap-2">
              <span className={`px-3 py-1.5 rounded-xl font-black uppercase tracking-widest text-[10px] border-2 ${
                mod.difficulty === 'EASY' ? 'bg-[#58CC02]/10 text-[#58CC02] border-[#58CC02]/20' : 
                mod.difficulty === 'MEDIUM' ? 'bg-[#FF9600]/10 text-[#FF9600] border-[#FF9600]/20' : 
                'bg-[#FF4B4B]/10 text-[#FF4B4B] border-[#FF4B4B]/20'
              }`}>
                {mod.difficulty}
              </span>
              <span className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-xl font-black uppercase tracking-widest text-[10px] border-2 border-slate-200 truncate max-w-[120px]">
                {mod.topic_id}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}