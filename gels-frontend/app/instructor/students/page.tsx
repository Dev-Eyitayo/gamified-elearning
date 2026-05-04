import React from 'react';
import { AlertCircle, Edit3, Search, TrendingUp, TrendingDown } from 'lucide-react';

export default function StudentsPage() {
  const students = [
    { id: 1, name: "Chidera Eze", mastery: 45, risk: "HIGH", streak: 2, profile: "ACHIEVER" },
    { id: 2, name: "Aisha Mohammed", mastery: 92, risk: "LOW", streak: 15, profile: "EXPLORER" },
    { id: 3, name: "Emeka Okafor", mastery: 78, risk: "MEDIUM", streak: 5, profile: "SOCIALIZER" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-700 uppercase tracking-tight">Cohort Roster</h1>
          <p className="text-slate-500 font-bold mt-1">Monitor progress and execute manual overrides.</p>
        </div>
        
        <div className="relative w-full sm:w-auto group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1CB0F6] transition-colors" size={20} strokeWidth={3} />
          <input 
            type="text" 
            placeholder="Search roster..." 
            className="w-full sm:w-64 bg-slate-100 border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-[#1CB0F6] transition-all" 
          />
        </div>
      </div>

      <div className="bg-white border-2 border-slate-200 rounded-3xl shadow-[0_6px_0_0_#E5E5E5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b-2 border-slate-200">
                <th className="px-6 py-5 font-black text-slate-500 uppercase tracking-widest">Learner</th>
                <th className="px-6 py-5 font-black text-slate-500 uppercase tracking-widest">Mastery</th>
                <th className="px-6 py-5 font-black text-slate-500 uppercase tracking-widest">Player Type</th>
                <th className="px-6 py-5 font-black text-slate-500 uppercase tracking-widest text-center">Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-100">
              {students.map((student) => (
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
                    <button className="inline-flex bg-[#1CB0F6]/10 text-[#1CB0F6] px-4 py-2 rounded-xl font-black uppercase tracking-widest border-2 border-[#1CB0F6]/20 hover:bg-[#1CB0F6] hover:text-white transition-all items-center gap-2">
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