"use client";

import React, { useState, useEffect } from 'react';
import { AlertCircle, Edit3, TrendingUp, TrendingDown, Loader2, Trophy, Zap, X } from 'lucide-react';
import { api } from '@/api/api';

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Custom Modal State
  const [overrideModal, setOverrideModal] = useState<{isOpen: boolean, studentId: string, studentName: string} | null>(null);
  const [overrideReason, setOverrideReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await api.instructor.getRoster();
        setStudents(data);
      } catch (err) {
        console.error("Failed to load roster", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const executeOverride = async () => {
    if (!overrideModal || !overrideReason) return;
    setIsSubmitting(true);
    try {
      await api.instructor.overridePath({ 
        student_id: overrideModal.studentId, 
        module_id: "manual", 
        reason: overrideReason 
      });
      setOverrideModal(null);
      setOverrideReason("");
      alert("Override successfully logged to the AI Engine."); 
    } catch (err) {
      alert("Failed to execute override.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400 font-sans">
        <Loader2 className="animate-spin mb-4 text-[#1CB0F6]" size={48} strokeWidth={3} />
        <h2 className="font-black tracking-widest uppercase">Fetching Roster...</h2>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans relative">
      
      {/* OVERRIDE MODAL */}
      {overrideModal?.isOpen && (
        <div className="fixed inset-0 z-[100] bg-[#121E2A]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-800">Manual Override</h2>
              <button onClick={() => setOverrideModal(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={28} strokeWidth={3} />
              </button>
            </div>
            
            <p className="text-slate-500 font-bold mb-4">
              Instruct the AI to adjust the learning path for <span className="text-[#1CB0F6]">{overrideModal.studentName}</span>.
            </p>
            
            <textarea 
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              placeholder="e.g. Needs simplified content for Unit 3 due to struggle with loops."
              className="w-full border-2 border-slate-200 rounded-2xl p-4 font-bold text-slate-700 focus:border-[#1CB0F6] outline-none h-32 resize-none mb-6 transition-colors"
            />
            
            <button 
              disabled={!overrideReason || isSubmitting}
              onClick={executeOverride}
              className={`w-full py-4 rounded-2xl text-lg font-black uppercase tracking-widest transition-all border-b-4 flex items-center justify-center gap-2 ${
                !overrideReason ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed' : 'bg-[#1CB0F6] text-white border-[#1899D6] hover:bg-[#149FDF] active:translate-y-1 active:border-b-0'
              }`}
            >
              {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : "Execute Override"}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-4 border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-700 uppercase tracking-tight">Cohort Roster</h1>
          <p className="text-slate-500 font-bold mt-1">Monitor Weekly XP, Leagues, and AI overrides.</p>
        </div>
      </div>

      <div className="bg-white border-2 border-slate-200 rounded-3xl shadow-[0_6px_0_0_#E5E5E5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-200">
                <th className="px-6 py-5 font-black text-slate-400 uppercase tracking-widest">Learner</th>
                <th className="px-6 py-5 font-black text-slate-400 uppercase tracking-widest">Current League</th>
                <th className="px-6 py-5 font-black text-slate-400 uppercase tracking-widest">Weekly XP</th>
                <th className="px-6 py-5 font-black text-slate-400 uppercase tracking-widest text-center">Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-10 font-bold text-slate-400">No students found in the database.</td>
                </tr>
              ) : students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-white border-b-4 ${
                        student.risk === 'HIGH' ? 'bg-[#FF4B4B] border-[#D0021B]' : 'bg-[#1CB0F6] border-[#1899D6]'
                      }`}>
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-black text-slate-700 text-base block">{student.name}</span>
                        {student.risk === 'HIGH' && <span className="text-xs font-bold text-[#FF4B4B]">At Risk</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 font-black text-slate-600">
                      <Trophy size={18} className="text-[#FFD900]" strokeWidth={3}/> 
                      {student.current_league || 'Bronze'}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 font-black text-slate-600">
                      <Zap size={18} className="text-[#1CB0F6]" strokeWidth={3}/> 
                      {student.weekly_xp || 0} XP
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <button 
                      onClick={() => setOverrideModal({ isOpen: true, studentId: student.id, studentName: student.name })} 
                      className="inline-flex bg-white text-[#1CB0F6] px-4 py-2 rounded-xl font-black uppercase tracking-widest border-2 border-slate-200 border-b-4 hover:bg-slate-50 active:translate-y-1 active:border-b-2 items-center gap-2 transition-all"
                    >
                      <Edit3 size={16} strokeWidth={3} /> Override
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}