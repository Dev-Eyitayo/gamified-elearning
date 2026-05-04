import React from 'react';
import { Users, AlertCircle, Activity, BrainCircuit, Search, ChevronRight, Edit3, ShieldAlert } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';

export default function InstructorDashboard() {
  const cohortStats = { totalStudents: 48, avgMastery: "72%", atRiskCount: 4, activeOverrides: 2 };

  const decisionLog = [
    {
      id: "log-1", student: "Chidera Eze", timestamp: "10 mins ago", topic: "Recursion", action: "REMEDIATE",
      rationale: "knowledge_state for 'recursion' = 0.28 (below 0.70). Scored 40% on Module 12 (4 attempts). Engagement = 0.35. Inserted foundational module before Module 13."
    },
    {
      id: "log-2", student: "Aisha Mohammed", timestamp: "1 hour ago", topic: "Graphs", action: "ESCALATE",
      rationale: "time_on_task << estimated_minutes AND score > 0.9. Learner is bored. Increased difficulty by one level."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-4 px-4">
      
      {/* Header */}
      <div className="border-b-4 border-slate-200 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-700 uppercase tracking-tight">Cohort 400L</h1>
          <p className="text-slate-500 font-bold mt-2 text-lg">Glass-Box AI Monitoring & Overrides</p>
        </div>
        <div className="bg-[#CE82FF] px-4 py-2 rounded-2xl border-b-4 border-[#A568CC] text-white font-black uppercase tracking-widest text-sm flex items-center gap-2">
          <BrainCircuit size={20} strokeWidth={3} /> AI Active
        </div>
      </div>

      {/* 1. Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Avg. Mastery" 
          value={cohortStats.avgMastery} 
          icon={<Activity size={32} strokeWidth={3} />} 
          iconColorClass="text-[#1CB0F6]" iconBgClass="bg-[#1CB0F6]/10" borderColorClass="border-[#1CB0F6]/20" 
        />
        <StatCard 
          title="Total Active" 
          value={cohortStats.totalStudents} 
          icon={<Users size={32} strokeWidth={3} />} 
          iconColorClass="text-[#CE82FF]" iconBgClass="bg-[#CE82FF]/10" borderColorClass="border-[#CE82FF]/20" 
        />
        <StatCard 
          title="At-Risk" 
          value={cohortStats.atRiskCount} 
          subtext={<span className="text-[#FF4B4B]">High drop-off risk</span>} 
          icon={<AlertCircle size={32} strokeWidth={3} />} 
          iconColorClass="text-[#FF4B4B]" iconBgClass="bg-[#FF4B4B]/10" borderColorClass="border-[#FF4B4B]/20" 
        />
        <StatCard 
          title="Overrides" 
          value={cohortStats.activeOverrides} 
          icon={<ShieldAlert size={32} strokeWidth={3} />} 
          iconColorClass="text-[#FF9600]" iconBgClass="bg-[#FF9600]/10" borderColorClass="border-[#FF9600]/20" 
        />
      </div>

      {/* 2. AI Decision Log Panel */}
      <div className="flex flex-col space-y-6">
        
        {/* Panel Header & Search */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-[0_6px_0_0_#E5E5E5]">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#1CB0F6]/10 rounded-2xl border-2 border-[#1CB0F6]/20 text-[#1CB0F6]">
              <BrainCircuit size={28} strokeWidth={3} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-700 uppercase tracking-widest">Decision Log</h2>
              <p className="text-sm font-bold text-slate-400">Real-time pedagogical actions taken by Gemini 1.5</p>
            </div>
          </div>
          
          <div className="relative w-full sm:w-auto group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1CB0F6] transition-colors" size={20} strokeWidth={3} />
            <input 
              type="text" 
              placeholder="Search student..." 
              className="w-full sm:w-72 bg-slate-100 border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-[#1CB0F6] focus:bg-white transition-all placeholder-slate-400" 
            />
          </div>
        </div>
        
        {/* The Logs */}
        <div className="space-y-6">
          {decisionLog.map((log) => (
            <div key={log.id} className="bg-white border-2 border-slate-200 rounded-3xl p-6 md:p-8 shadow-[0_6px_0_0_#E5E5E5] flex flex-col xl:flex-row gap-8 transition-all hover:-translate-y-1">
              
              {/* Left Column: Log Details */}
              <div className="flex-1 space-y-6">
                
                {/* Header info */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#1CB0F6] flex items-center justify-center font-black text-white text-xl border-b-4 border-[#1899D6]">
                    {log.student.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-700 text-xl">{log.student}</h3>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{log.timestamp}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-slate-100 text-slate-500 text-xs px-3 py-1.5 rounded-xl font-black uppercase tracking-widest border-2 border-slate-200">
                    Topic: {log.topic}
                  </span>
                  <span className={`text-xs px-3 py-1.5 rounded-xl font-black uppercase tracking-widest border-2 ${
                    log.action === 'REMEDIATE' 
                      ? 'bg-[#FF4B4B]/10 text-[#FF4B4B] border-[#FF4B4B]/20' 
                      : 'bg-[#58CC02]/10 text-[#58CC02] border-[#58CC02]/20'
                  }`}>
                    Action: {log.action}
                  </span>
                </div>

                {/* Glass-Box Rationale (The "Why") */}
                <div className="bg-[#DDF4FF] p-5 rounded-2xl border-2 border-[#1CB0F6]/30 relative overflow-hidden">
                  <BrainCircuit size={100} strokeWidth={1} className="absolute -right-4 -bottom-4 text-[#1CB0F6]/10 pointer-events-none" />
                  <p className="text-xs font-black text-[#1CB0F6] mb-2 uppercase tracking-widest">System Rationale:</p>
                  <p className="text-slate-700 font-bold leading-relaxed relative z-10">
                    {log.rationale}
                  </p>
                </div>
              </div>

              {/* Right Column: Interventions */}
              <div className="w-full xl:w-72 flex flex-col gap-3 justify-center border-t-2 xl:border-t-0 xl:border-l-2 border-slate-100 pt-6 xl:pt-0 xl:pl-8">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 text-center xl:text-left">
                  Available Interventions
                </p>
                
                {/* 3D Action Buttons */}
                <button className="w-full bg-[#1CB0F6] text-white py-3.5 px-5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all border-b-4 border-[#1899D6] hover:bg-[#149FDF] active:translate-y-1 active:border-b-0 flex items-center justify-between">
                  Override Path <Edit3 size={20} strokeWidth={3} />
                </button>
                
                <button className="w-full bg-white border-2 border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-600 py-3.5 px-5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all active:translate-y-1 flex items-center justify-between shadow-[0_4px_0_0_#E5E5E5] active:shadow-none mb-1">
                  Mark Understood <ChevronRight size={20} strokeWidth={3} />
                </button>
                
                <button className="w-full bg-white border-2 border-[#FF4B4B]/20 text-[#FF4B4B] hover:bg-[#FF4B4B]/5 py-3.5 px-5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all active:translate-y-1 flex items-center justify-between shadow-[0_4px_0_0_rgba(255,75,75,0.2)] active:shadow-none">
                  Flag for Review <AlertCircle size={20} strokeWidth={3} />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}