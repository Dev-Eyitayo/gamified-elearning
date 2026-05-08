"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, FolderTree, Target, FileIcon, UploadCloud, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/api/api';

export default function AddNodePage() {
  const [pathData, setPathData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // 🔥 ADDED MISSING STATE VARIABLES
  const [instructorId, setInstructorId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState({
    section_id: '',
    unit_id: '',
    icon_type: 'star',
    title: ''
  });

  // 1. Fetch Dynamic Database Hierarchy
  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s Timeout

    const fetchTree = async () => {
      try {
        const userId = localStorage.getItem('gels_user_id');
        if (!userId || userId === "undefined") {
          setIsLoading(false);
          return;
        }

        setInstructorId(userId);
        setIsLoading(true);

        const paths = await api.learning.getAllPaths(userId);
        
        if (paths && paths.length > 0) {
          const fullTree = await api.learning.getFullPath(paths[0].id);
          setPathData(fullTree);
          
          if (fullTree?.sections?.length > 0) {
            // Pre-select first section and expand it
            setFormData(prev => ({ ...prev, section_id: fullTree.sections[0].section_id }));
            setExpandedSections({ [fullTree.sections[0].section_id]: true });
          }
        } else {
          setPathData(null);
        }
      } catch (err) {
        console.error("Fetch failed or timed out:", err);
        setError("The database took too long to respond. Please check your connection.");
      } finally {
        clearTimeout(timeoutId);
        setIsLoading(false);
      }
    };

    fetchTree();
    return () => controller.abort();
  }, []);

  // 2. Dynamically calculate which Units belong to the chosen Section
  const activeSection = pathData?.sections?.find((s: any) => s.section_id === formData.section_id);
  const availableUnits = activeSection?.units || [];

  // 3. Auto-select the first Unit when the Section changes
  useEffect(() => {
    if (availableUnits.length > 0) {
      setFormData(prev => ({ ...prev, unit_id: availableUnits[0].unit_id }));
    } else {
      setFormData(prev => ({ ...prev, unit_id: '' }));
    }
  }, [formData.section_id, activeSection]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please upload source material.");
      return;
    }
    if (!formData.unit_id) {
      alert("Please select a valid parent unit.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("unit_id", formData.unit_id);
      payload.append("icon_type", formData.icon_type);
      payload.append("title", formData.title);
      payload.append("file", selectedFile);

      const response = await fetch('http://localhost:8000/api/learning/path-node', {
        method: 'POST',
        body: payload,
      });

      if (!response.ok) throw new Error("Database injection failed");
      
      window.location.href = '/instructor/content';
    } catch (err) {
      console.error(err);
      alert("Failed to inject node into path.");
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="py-20 flex flex-col items-center justify-center font-sans">
        <AlertCircle size={48} className="text-[#FF4B4B] mb-4" strokeWidth={2.5} />
        <p className="font-bold text-[#FF4B4B]">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-slate-500 font-bold underline">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl font-sans">
      <div className="flex items-center gap-4 border-b-4 border-slate-200 pb-6">
        <Link 
          href="/instructor/content" 
          className="w-12 h-12 rounded-2xl border-2 border-slate-200 text-slate-400 flex items-center justify-center hover:bg-slate-50 hover:text-slate-600 active:translate-y-1 transition-all"
        >
          <ArrowLeft size={24} strokeWidth={3} />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-700 uppercase tracking-tight">Add Lesson Node</h1>
          <p className="text-slate-500 font-bold mt-1">Insert a new stepping stone into the curriculum path.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-[0_6px_0_0_#E5E5E5] space-y-8">
        <div className="space-y-6">
          <h2 className="text-xl font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
            <FolderTree className="text-[#CE82FF]" size={24} strokeWidth={3} /> Path Placement
          </h2>
          
          {isLoading ? (
            <div className="flex items-center gap-3 text-slate-400 font-bold">
               <Loader2 className="animate-spin" size={20}/> Fetching Database Hierarchy...
            </div>
          ) : !pathData ? (
            <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-2xl text-amber-700 font-bold">
                No course paths found. Please create a Course and Section first in the Content Manager.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-500 uppercase tracking-widest pl-1">Parent Section</label>
                <select 
                  value={formData.section_id}
                  onChange={(e) => setFormData({...formData, section_id: e.target.value})}
                  className="w-full bg-slate-100 border-2 border-slate-200 rounded-2xl px-4 py-3.5 text-base font-bold text-slate-700 focus:outline-none focus:border-[#CE82FF] transition-all appearance-none"
                >
                  {pathData.sections?.map((sec: any) => (
                    <option key={sec.section_id} value={sec.section_id}>{sec.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-slate-500 uppercase tracking-widest pl-1">Parent Unit</label>
                <select 
                  value={formData.unit_id}
                  onChange={(e) => setFormData({...formData, unit_id: e.target.value})}
                  disabled={availableUnits.length === 0}
                  className="w-full bg-slate-100 border-2 border-slate-200 rounded-2xl px-4 py-3.5 text-base font-bold text-slate-700 focus:outline-none focus:border-[#CE82FF] transition-all appearance-none disabled:opacity-50"
                >
                  {availableUnits.map((unit: any) => (
                    <option key={unit.unit_id} value={unit.unit_id}>{unit.title}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-500 uppercase tracking-widest pl-1">Level Type</label>
                <select 
                  value={formData.icon_type}
                  onChange={(e) => setFormData({...formData, icon_type: e.target.value})}
                  className="w-full bg-slate-100 border-2 border-slate-200 rounded-2xl px-4 py-3.5 text-base font-bold text-slate-700 focus:outline-none focus:border-[#CE82FF] transition-all appearance-none"
                >
                  <option value="star">⭐ Standard Lesson (Star)</option>
                  <option value="book">📖 Story/Reading (Book)</option>
                  <option value="dumbbell">💪 Practice (Dumbbell)</option>
                  <option value="trophy">🏆 Unit Review (Trophy)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-black text-slate-500 uppercase tracking-widest pl-1">Lesson Title</label>
                <input 
                  type="text" required placeholder="e.g., Arrays vs Lists" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-100 border-2 border-slate-200 rounded-2xl px-4 py-3.5 text-base font-bold text-slate-700 focus:outline-none focus:border-[#CE82FF] transition-all placeholder-slate-400" 
                />
              </div>
            </div>
          )}
        </div>

        <hr className="border-t-2 border-slate-100" />

        {/* Source Material */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
            <Target className="text-[#FF9600]" size={24} strokeWidth={3} /> Source Material
          </h2>
          <p className="text-sm font-bold text-slate-500 leading-relaxed">
            Upload the content for this node. The AI will slice this into bite-sized questions for the user.
          </p>
          
          <div className="relative border-2 border-dashed border-slate-300 rounded-3xl p-10 bg-slate-50 flex flex-col items-center justify-center hover:bg-slate-100 transition-colors group cursor-pointer">
            <input type="file" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            
            {selectedFile ? (
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#58CC02]/10 text-[#58CC02] rounded-full flex items-center justify-center mb-4 border-2 border-[#58CC02]/20">
                  <FileIcon size={32} strokeWidth={2.5} />
                </div>
                <h3 className="font-black text-slate-700 text-lg">{selectedFile.name}</h3>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-[#FF9600]/10 text-[#FF9600] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border-2 border-[#FF9600]/20">
                  <UploadCloud size={32} strokeWidth={2.5} />
                </div>
                <h3 className="font-black text-slate-700 text-lg">Click to browse or drag file here</h3>
                <p className="text-slate-500 font-bold text-sm mt-1">Markdown, PDF, or MP4 Video</p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-6 border-t-2 border-slate-100 flex justify-end">
          <button type="submit" disabled={isSubmitting || isLoading || !pathData} className="text-white px-8 py-4 rounded-2xl text-base font-black uppercase tracking-widest transition-all border-b-4 flex items-center gap-2 bg-[#58CC02] border-[#46A302] hover:bg-[#46A302] active:translate-y-1 active:border-b-0 disabled:opacity-50">
            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} strokeWidth={3} />} 
            Save to Path
          </button>
        </div>
      </form>
    </div>
  );
}