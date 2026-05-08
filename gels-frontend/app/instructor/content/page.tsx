"use client";

import React, { useState, useEffect } from 'react';
import { Plus, FolderTree, BookOpen, Loader2, ChevronDown, ChevronRight, AlertCircle, Layers, FileCode2 } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/api/api';

export default function ContentManagementPage() {
  const [pathData, setPathData] = useState<any>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [instructorId, setInstructorId] = useState<string | null>(null);

  useEffect(() => {
  const fetchTree = async () => {
    // 1. Safely grab the ID
    const userId = typeof window !== 'undefined' ? localStorage.getItem('gels_user_id') : null;
    
    // 2. STOP if the ID is missing or literally the string "undefined"
    if (!userId || userId === "undefined") {
      console.warn("No instructor session found yet.");
      setIsLoading(false);
      return; 
    }

    setInstructorId(userId);
    setIsLoading(true);

    try {
      // Now it's safe to call the API
      const paths = await api.learning.getAllPaths(userId);
      
      if (paths && paths.length > 0) {
        const fullTree = await api.learning.getFullPath(paths[0].id);
        setPathData(fullTree);
        if (fullTree?.sections?.length > 0) {
          setExpandedSections({ [fullTree.sections[0].section_id]: true });
        }
      } else {
        setPathData(null);
      }
    } catch (err) {
      console.error("Path fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  fetchTree();
}, []);

  const toggleSection = (id: string) => setExpandedSections(prev => ({...prev, [id]: !prev[id]}));

  // Handlers for creating new hierarchy levels
  const handleCreateCourse = async () => {
    const title = prompt("Enter new Course name (e.g. Intro to Python):");
    if (title && instructorId) {
      await api.learning.createCourse({ instructor_id: instructorId, title });
      window.location.reload();
    }
  };

  const handleCreateSection = async () => {
    const title = prompt("Enter new Section name (e.g. Section 1: Variables):");
    if (title && pathData?.course_id) {
      await api.learning.createSection({ course_id: pathData.course_id, title });
      window.location.reload();
    }
  };

  const handleCreateUnit = async (sectionId: string) => {
    const title = prompt("Enter new Unit name (e.g. Unit 1: Integers):");
    if (title) {
      await api.learning.createUnit({ section_id: sectionId, title });
      window.location.reload();
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400 font-sans">
        <Loader2 className="animate-spin mb-4 text-[#58CC02]" size={48} strokeWidth={3} />
        <h2 className="font-black tracking-widest uppercase">Loading Database Tree...</h2>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-4 border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-700 uppercase tracking-tight">Curriculum Path</h1>
          <p className="text-slate-500 font-bold mt-1">Build and manage your class curriculum.</p>
        </div>
        {pathData && (
          <Link href="/instructor/content/new" className="bg-[#58CC02] text-white px-6 py-3.5 rounded-2xl font-black uppercase tracking-widest transition-all border-b-4 border-[#46A302] hover:bg-[#46A302] active:translate-y-1 active:border-b-0 flex items-center gap-2 shadow-sm">
              <Plus size={20} strokeWidth={3} /> Add Lesson Node
          </Link>
        )}
      </div>

      {!pathData ? (
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-12 text-center shadow-sm">
          <FolderTree size={64} className="text-slate-300 mx-auto mb-6" strokeWidth={2} />
          <h2 className="text-2xl font-black text-slate-700 uppercase tracking-widest mb-2">No Courses Found</h2>
          <p className="text-slate-500 font-bold mb-8">You haven't created a curriculum path for your students yet.</p>
          <button onClick={handleCreateCourse} className="bg-[#1CB0F6] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest border-b-4 border-[#1899D6] hover:bg-[#149FDF] active:translate-y-1 active:border-b-0 transition-all inline-flex items-center gap-2">
            <Plus size={20} strokeWidth={3} /> Create First Course
          </button>
        </div>
      ) : (
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-[0_6px_0_0_#E5E5E5]">
          <div className="flex items-center justify-between mb-8 border-b-2 border-slate-100 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#1CB0F6]/10 rounded-2xl flex items-center justify-center text-[#1CB0F6]">
                <FolderTree size={28} strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl font-black text-slate-700">{pathData.title}</h2>
            </div>
            <button onClick={handleCreateSection} className="text-[#1CB0F6] font-black uppercase tracking-widest text-sm hover:text-[#1899D6] flex items-center gap-1">
              <Plus size={18} strokeWidth={3}/> Add Section
            </button>
          </div>

          <div className="space-y-4">
            {pathData.sections.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold">
                Course is empty. Add your first section!
              </div>
            ) : pathData.sections.map((section: any) => (
              <div key={section.section_id} className="border-2 border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="w-full bg-slate-50 p-4 flex items-center justify-between transition-colors">
                  <button onClick={() => toggleSection(section.section_id)} className="flex items-center gap-3 font-black text-slate-700 text-lg hover:text-[#1CB0F6] transition-colors">
                    {expandedSections[section.section_id] ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
                    {section.title}
                  </button>
                  <button onClick={() => handleCreateUnit(section.section_id)} className="text-[#CE82FF] font-black uppercase tracking-widest text-xs border-2 border-[#CE82FF]/30 px-3 py-1.5 rounded-xl hover:bg-[#CE82FF]/10 transition-colors">
                    + Add Unit
                  </button>
                </div>
                
                {expandedSections[section.section_id] && (
                  <div className="p-4 space-y-3 bg-white border-t-2 border-slate-100">
                    {section.units.length === 0 ? (
                      <p className="text-slate-400 font-bold text-sm px-4">No units inside this section yet.</p>
                    ) : section.units.map((unit: any) => (
                      <div key={unit.unit_id} className="flex items-center justify-between p-4 border-2 border-slate-100 rounded-xl bg-slate-50 hover:border-slate-200 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#CE82FF]/10 text-[#CE82FF] rounded-lg flex items-center justify-center border-2 border-[#CE82FF]/20">
                            <Layers size={20} strokeWidth={2.5} />
                          </div>
                          <span className="font-bold text-slate-700">{unit.title}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-black text-slate-400 uppercase tracking-widest text-xs border-2 border-slate-200 px-3 py-1 rounded-lg">
                            {unit.levels.length} Lessons
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}