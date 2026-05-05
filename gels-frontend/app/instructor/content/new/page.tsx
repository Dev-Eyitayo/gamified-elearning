"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, FileText, Clock, Link as LinkIcon, Hash, Target, Sparkles, AlertTriangle, Flame, Loader2 } from 'lucide-react';
import { api } from '@/api/api';

export default function AddModulePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    topic_id: '',
    difficulty: 'EASY',
    estimated_minutes: 15,
    content_url: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setDifficulty = (level: string) => {
    setFormData({ ...formData, difficulty: level });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // POST the real data to the backend!
      await api.instructor.createModule(formData);
      router.push('/instructor/content');
    } catch (err) {
      console.error("Failed to create module", err);
      alert("Failed to save module. Check the backend logs.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      
      {/* Header & Back Button */}
      <div className="flex items-center gap-4 border-b-4 border-slate-200 pb-6">
        <Link 
          href="/instructor/content" 
          className="w-12 h-12 rounded-2xl border-2 border-slate-200 text-slate-400 flex items-center justify-center hover:bg-slate-50 hover:text-slate-600 active:translate-y-1 transition-all"
        >
          <ArrowLeft size={24} strokeWidth={3} />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-700 uppercase tracking-tight">Create New Module</h1>
          <p className="text-slate-500 font-bold mt-1">Configure curriculum data for the Cognitive Engine.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-[0_6px_0_0_#E5E5E5] space-y-8">
        
        {/* --- SECTION 1: Basic Details --- */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
            <FileText className="text-[#1CB0F6]" size={24} strokeWidth={3} /> Core Details
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-500 uppercase tracking-widest pl-1">Module ID (e.g. Unit 4.1)</label>
              <div className="relative group">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1CB0F6] transition-colors" size={20} strokeWidth={3} />
                <input 
                  type="text" name="title" required placeholder="Unit 4.1"
                  value={formData.title} onChange={handleInputChange}
                  className="w-full bg-slate-100 border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-base font-bold text-slate-700 focus:outline-none focus:border-[#1CB0F6] focus:bg-white transition-all placeholder-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-slate-500 uppercase tracking-widest pl-1">Display Name</label>
              <div className="relative group">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1CB0F6] transition-colors" size={20} strokeWidth={3} />
                <input 
                  type="text" name="name" required placeholder="Intro to Data Structures"
                  value={formData.name} onChange={handleInputChange}
                  className="w-full bg-slate-100 border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-base font-bold text-slate-700 focus:outline-none focus:border-[#1CB0F6] focus:bg-white transition-all placeholder-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-slate-500 uppercase tracking-widest pl-1">Topic Category</label>
              <div className="relative group">
                <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1CB0F6] transition-colors" size={20} strokeWidth={3} />
                <input 
                  type="text" name="topic_id" required placeholder="Arrays"
                  value={formData.topic_id} onChange={handleInputChange}
                  className="w-full bg-slate-100 border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-base font-bold text-slate-700 focus:outline-none focus:border-[#1CB0F6] focus:bg-white transition-all placeholder-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-slate-500 uppercase tracking-widest pl-1">Est. Minutes to Complete</label>
              <div className="relative group">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1CB0F6] transition-colors" size={20} strokeWidth={3} />
                <input 
                  type="number" name="estimated_minutes" required placeholder="15" min="1"
                  value={formData.estimated_minutes} 
                  onChange={(e) => setFormData({ ...formData, estimated_minutes: parseInt(e.target.value) })}
                  className="w-full bg-slate-100 border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-base font-bold text-slate-700 focus:outline-none focus:border-[#1CB0F6] focus:bg-white transition-all placeholder-slate-400"
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-t-2 border-slate-100" />

        {/* --- SECTION 2: AI Parameters --- */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="text-[#CE82FF]" size={24} strokeWidth={3} /> AI Parameters
            </h2>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-black text-slate-500 uppercase tracking-widest pl-1">Baseline Difficulty</label>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button 
                type="button" onClick={() => setDifficulty('EASY')}
                className={`p-5 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${formData.difficulty === 'EASY' ? 'bg-[#58CC02]/10 border-[#58CC02] border-b-4 transform -translate-y-1 shadow-[0_4px_0_0_#46A302]' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${formData.difficulty === 'EASY' ? 'bg-[#58CC02] text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <Sparkles size={24} strokeWidth={2.5} />
                </div>
                <span className={`font-black uppercase tracking-widest ${formData.difficulty === 'EASY' ? 'text-[#58CC02]' : 'text-slate-500'}`}>Easy</span>
              </button>

              <button 
                type="button" onClick={() => setDifficulty('MEDIUM')}
                className={`p-5 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${formData.difficulty === 'MEDIUM' ? 'bg-[#FF9600]/10 border-[#FF9600] border-b-4 transform -translate-y-1 shadow-[0_4px_0_0_#D97A00]' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${formData.difficulty === 'MEDIUM' ? 'bg-[#FF9600] text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <Flame size={24} strokeWidth={2.5} />
                </div>
                <span className={`font-black uppercase tracking-widest ${formData.difficulty === 'MEDIUM' ? 'text-[#FF9600]' : 'text-slate-500'}`}>Medium</span>
              </button>

              <button 
                type="button" onClick={() => setDifficulty('HARD')}
                className={`p-5 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${formData.difficulty === 'HARD' ? 'bg-[#FF4B4B]/10 border-[#FF4B4B] border-b-4 transform -translate-y-1 shadow-[0_4px_0_0_#D0021B]' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${formData.difficulty === 'HARD' ? 'bg-[#FF4B4B] text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <AlertTriangle size={24} strokeWidth={2.5} />
                </div>
                <span className={`font-black uppercase tracking-widest ${formData.difficulty === 'HARD' ? 'text-[#FF4B4B]' : 'text-slate-500'}`}>Hard</span>
              </button>
            </div>
          </div>
        </div>

        <hr className="border-t-2 border-slate-100" />

        {/* --- SECTION 3: Content Linking --- */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
            <LinkIcon className="text-[#FF9600]" size={24} strokeWidth={3} /> Asset Link
          </h2>
          
          <div className="space-y-2">
            <label className="text-sm font-black text-slate-500 uppercase tracking-widest pl-1">Content URL (Video, Markdown, or Slides)</label>
            <div className="relative group">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF9600] transition-colors" size={20} strokeWidth={3} />
              <input 
                type="url" name="content_url" required placeholder="https://cdn.gels.edu/modules/4-1.md"
                value={formData.content_url} onChange={handleInputChange}
                className="w-full bg-slate-100 border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-base font-bold text-slate-700 focus:outline-none focus:border-[#FF9600] focus:bg-white transition-all placeholder-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-6 border-t-2 border-slate-100 flex flex-col sm:flex-row justify-end gap-4">
          <Link 
            href="/instructor/content"
            className="px-8 py-4 rounded-2xl text-base font-black uppercase tracking-widest text-slate-500 border-2 border-slate-200 hover:bg-slate-50 transition-all text-center"
          >
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`text-white px-8 py-4 rounded-2xl text-base font-black uppercase tracking-widest transition-all border-b-4 flex items-center justify-center gap-2 ${
              isSubmitting ? 'bg-slate-300 border-slate-400 cursor-wait' : 'bg-[#58CC02] border-[#46A302] hover:bg-[#46A302] active:translate-y-1 active:border-b-0'
            }`}
          >
            {isSubmitting ? <Loader2 size={20} strokeWidth={3} className="animate-spin" /> : <Save size={20} strokeWidth={3} />} 
            Save Module
          </button>
        </div>
      </form>
    </div>
  );
}