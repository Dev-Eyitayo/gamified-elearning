"use client";

import React, { useState, useEffect } from 'react';
import { AlertCircle, Edit3, Search, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { api } from '@/api/api';

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleOverride = async (studentId: string, studentName: string) => {
    const reason = prompt(`Enter reason for manually overriding AI path for ${studentName}:`);
    if (reason) {
      await api.instructor.overridePath({ student_id: studentId, module_id: "manual", reason });
      alert("Override logged to the AI Decision Engine.");
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="animate-spin mb-4 text-[#1CB0F6]" size={48} strokeWidth={3} />
        <h2 className="font-black tracking-widest uppercase">Fetching Roster...</h2>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-700 uppercase tracking-tight">Cohort Roster</h1>
          <p className="text-slate-500 font-bold mt-1">Monitor progress and execute manual overrides.</p>
        </div>
      </div>

      <div className="bg-white border-2 border-slate-200 rounded-3xl shadow-[0_6px_0_0_#E5E5E5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-200">
                <th className="px-6 py-5 font-black text-slate-500 uppercase tracking-widest">Learner</th>
                <th className="px-6 py-5 font-black text-slate-500 uppercase tracking-widest">Mastery Estimate</th>
                <th className="px-6 py-5 font-black text-slate-500 uppercase tracking-widest">Player Type</th>
                <th className="px-6 py-5 font-black text-slate-500 uppercase tracking-widest text-center">Intervention</th>
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
                      <span className="font-black text-slate-700 text-base">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      {student.risk === 'HIGH' ? <TrendingDown size={20} className="text-[#FF4B4B]" strokeWidth={3}/> : <TrendingUp size={20} className="text-[#58CC02]" strokeWidth={3}/>}
                      <span className={`font-black text-lg ${student.risk === 'HIGH' ? 'text-[#FF4B4B]' : 'text-slate-600'}`}>{student.mastery}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="bg-slate-200 text-slate-600 px-3 py-1.5 rounded-xl font-black uppercase tracking-widest text-xs border-2 border-slate-300">
                      {student.profile}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <button onClick={() => handleOverride(student.id, student.name)} className="inline-flex bg-[#1CB0F6]/10 text-[#1CB0F6] px-4 py-2 rounded-xl font-black uppercase tracking-widest border-2 border-[#1CB0F6]/20 hover:bg-[#1CB0F6] hover:text-white transition-all items-center gap-2">
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