"use client";

import React, { useState, useEffect } from 'react';
import { BrainCircuit, ShieldAlert, Activity, Users, Loader2, AlertCircle, ArrowUpRight, RotateCcw, Database, PlusCircle, CheckCircle2 } from 'lucide-react';
import { api } from '@/api/api';

export default function InstructorDashboard() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'content'>('analytics');
  
  // Data States
  const [analytics, setAnalytics] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form States
  const [questForm, setQuestForm] = useState({ title: '', description: '', reward_xp: 50, quest_type: 'solo' });
  const [moduleForm, setModuleForm] = useState({ title: '', name: '', topic_id: '', difficulty: 'EASY', content_url: 'https://', estimated_minutes: 15 });

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch both Analytics and Logs concurrently
      const [analyticsData, logsData] = await Promise.all([
        api.instructor.getAnalytics(),
        api.instructor.getLogs()
      ]);
      setAnalytics(analyticsData);
      setLogs(logsData);
      setError('');
    } catch (err: any) {
      console.error("Failed to load dashboard:", err);
      setError("Failed to connect to the Cognitive Engine.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddQuest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.instructor.addQuest(questForm);
      setSuccessMsg(`Quest "${questForm.title}" added to database!`);
      setQuestForm({ title: '', description: '', reward_xp: 50, quest_type: 'solo' });
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError("Failed to add Quest.");
    }
  };

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.instructor.addModule(moduleForm);
      setSuccessMsg(`Module "${moduleForm.name}" added to database!`);
      setModuleForm({ title: '', name: '', topic_id: '', difficulty: 'EASY', content_url: 'https://', estimated_minutes: 15 });
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError("Failed to add Module.");
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'ADVANCE':
        return <span className="bg-[#58CC02]/10 text-[#58CC02] border-2 border-[#58CC02]/20 px-3 py-1 rounded-xl text-xs font-black tracking-widest uppercase flex items-center gap-1 w-fit"><ArrowUpRight size={14} strokeWidth={3}/> {action}</span>;
      case 'REMEDIATE':
        return <span className="bg-[#FF9600]/10 text-[#FF9600] border-2 border-[#FF9600]/20 px-3 py-1 rounded-xl text-xs font-black tracking-widest uppercase flex items-center gap-1 w-fit"><RotateCcw size={14} strokeWidth={3}/> {action}</span>;
      default:
        return <span className="bg-slate-100 text-slate-500 border-2 border-slate-200 px-3 py-1 rounded-xl text-xs font-black tracking-widest uppercase w-fit">{action}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center font-sans text-slate-400">
        <Loader2 className="animate-spin mb-4 text-[#CE82FF]" size={48} strokeWidth={3} />
        <h2 className="font-black tracking-widest uppercase">Syncing Instructor Portal...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-500">
      
      {/* Header & Tabs */}
      <div className="border-b-4 border-slate-200 pb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-700 uppercase tracking-tight flex items-center gap-3">
            <BrainCircuit size={40} className="text-[#CE82FF]" strokeWidth={2.5} /> Control Center
          </h1>
          <p className="text-slate-500 font-bold mt-2 text-lg">Manage content and monitor AI decisions</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-2xl border-2 border-slate-200">
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 rounded-xl font-black uppercase tracking-widest text-sm transition-all ${activeTab === 'analytics' ? 'bg-white text-[#1CB0F6] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Analytics & Logs
          </button>
          <button 
            onClick={() => setActiveTab('content')}
            className={`px-6 py-3 rounded-xl font-black uppercase tracking-widest text-sm transition-all ${activeTab === 'content' ? 'bg-white text-[#CE82FF] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Content Manager
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-[#FF4B4B]/10 text-[#FF4B4B] p-4 rounded-2xl border-2 border-[#FF4B4B]/20 flex items-center gap-3">
          <AlertCircle size={24} strokeWidth={2.5} />
          <p className="font-bold">{error}</p>
        </div>
      )}
      
      {successMsg && (
        <div className="bg-[#58CC02]/10 text-[#58CC02] p-4 rounded-2xl border-2 border-[#58CC02]/20 flex items-center gap-3">
          <CheckCircle2 size={24} strokeWidth={2.5} />
          <p className="font-bold">{successMsg}</p>
        </div>
      )}

      {/* TAB 1: ANALYTICS & LOGS */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* Top Level Metrics (DYNAMIC) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border-2 border-slate-200 p-5 rounded-3xl shadow-[0_4px_0_0_#E5E5E5]">
              <p className="text-slate-400 font-black uppercase tracking-widest text-xs mb-1">Total Students</p>
              <p className="text-3xl font-black text-slate-700">{analytics?.total_active || 0}</p>
            </div>
            <div className="bg-white border-2 border-slate-200 p-5 rounded-3xl shadow-[0_4px_0_0_#E5E5E5]">
              <p className="text-slate-400 font-black uppercase tracking-widest text-xs mb-1">Avg Mastery</p>
              <p className="text-3xl font-black text-[#1CB0F6]">{analytics?.avg_mastery_estimate || "0%"}</p>
            </div>
            <div className="bg-white border-2 border-[#FF4B4B]/30 p-5 rounded-3xl shadow-[0_4px_0_0_#FF4B4B]/20 bg-[#FF4B4B]/5">
              <p className="text-[#FF4B4B]/70 font-black uppercase tracking-widest text-xs mb-1">At Risk</p>
              <p className="text-3xl font-black text-[#FF4B4B]">{analytics?.at_risk_count || 0}</p>
            </div>
            <div className="bg-white border-2 border-slate-200 p-5 rounded-3xl shadow-[0_4px_0_0_#E5E5E5]">
              <p className="text-slate-400 font-black uppercase tracking-widest text-xs mb-1">Drop Off Rate</p>
              <p className="text-3xl font-black text-slate-700">{analytics?.drop_off_rate || 0}</p>
            </div>
          </div>

          {/* AI Decision Log (DYNAMIC) */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="p-6 border-b-2 border-slate-100 bg-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ShieldAlert size={24} className="text-slate-400" strokeWidth={2.5} />
                <h2 className="font-black text-slate-600 uppercase tracking-widest text-sm">Glass-Box AI Log</h2>
              </div>
              <button onClick={fetchDashboardData} className="text-[#1CB0F6] font-bold text-sm uppercase tracking-widest hover:underline">Refresh</button>
            </div>
            
            <div className="divide-y-2 divide-slate-100">
              {logs.length === 0 ? (
                <div className="p-12 text-center text-slate-400 font-bold">
                  No AI decisions logged yet. Students need to take a lesson!
                </div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className="p-6 flex flex-col md:flex-row md:items-center gap-6 hover:bg-slate-50 transition-colors">
                    <div className="w-full md:w-48 shrink-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Users size={16} className="text-slate-400" strokeWidth={3} />
                        <span className="font-black text-slate-700 truncate">{log.user_id.substring(0,8)}...</span>
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {new Date(log.time).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="w-40 shrink-0">{getActionBadge(log.action)}</div>
                    <div className="flex-1 bg-[#DDF4FF]/50 border-2 border-[#1CB0F6]/20 p-4 rounded-2xl flex items-start gap-3">
                      <Activity size={20} className="text-[#1CB0F6] shrink-0 mt-0.5" strokeWidth={3} />
                      <p className="font-bold text-slate-600 text-sm leading-relaxed">
                        <span className="text-[#1CB0F6] uppercase tracking-wider font-black mr-2 text-xs">AI Rationale:</span>
                        {log.rationale}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONTENT MANAGER */}
      {activeTab === 'content' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Add Module Form */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Database size={24} className="text-[#CE82FF]" strokeWidth={2.5} />
              <h2 className="font-black text-slate-700 uppercase tracking-widest text-lg">Add Module</h2>
            </div>
            <form onSubmit={handleAddModule} className="space-y-4">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Unit Title (e.g. Unit 1)</label>
                <input required type="text" value={moduleForm.title} onChange={e => setModuleForm({...moduleForm, title: e.target.value})} className="w-full mt-1 border-2 border-slate-200 p-3 rounded-xl font-bold text-slate-700 focus:border-[#CE82FF] outline-none" />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Module Name</label>
                <input required type="text" value={moduleForm.name} onChange={e => setModuleForm({...moduleForm, name: e.target.value})} className="w-full mt-1 border-2 border-slate-200 p-3 rounded-xl font-bold text-slate-700 focus:border-[#CE82FF] outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Difficulty</label>
                  <select value={moduleForm.difficulty} onChange={e => setModuleForm({...moduleForm, difficulty: e.target.value})} className="w-full mt-1 border-2 border-slate-200 p-3 rounded-xl font-bold text-slate-700 focus:border-[#CE82FF] outline-none bg-white">
                    <option value="EASY">EASY</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HARD">HARD</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Est. Mins</label>
                  <input required type="number" value={moduleForm.estimated_minutes} onChange={e => setModuleForm({...moduleForm, estimated_minutes: parseInt(e.target.value)})} className="w-full mt-1 border-2 border-slate-200 p-3 rounded-xl font-bold text-slate-700 focus:border-[#CE82FF] outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full mt-4 bg-[#CE82FF] text-white font-black uppercase tracking-widest py-4 rounded-xl border-b-4 border-[#A568CC] active:border-b-0 active:translate-y-1 flex justify-center items-center gap-2">
                <PlusCircle size={20} strokeWidth={3} /> Save Module
              </button>
            </form>
          </div>

          {/* Add Quest Form */}
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm h-fit">
            <div className="flex items-center gap-3 mb-6">
              <Database size={24} className="text-[#FF9600]" strokeWidth={2.5} />
              <h2 className="font-black text-slate-700 uppercase tracking-widest text-lg">Add Quest</h2>
            </div>
            <form onSubmit={handleAddQuest} className="space-y-4">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Quest Title</label>
                <input required type="text" value={questForm.title} onChange={e => setQuestForm({...questForm, title: e.target.value})} className="w-full mt-1 border-2 border-slate-200 p-3 rounded-xl font-bold text-slate-700 focus:border-[#FF9600] outline-none" />
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Description</label>
                <input required type="text" value={questForm.description} onChange={e => setQuestForm({...questForm, description: e.target.value})} className="w-full mt-1 border-2 border-slate-200 p-3 rounded-xl font-bold text-slate-700 focus:border-[#FF9600] outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Type</label>
                  <select value={questForm.quest_type} onChange={e => setQuestForm({...questForm, quest_type: e.target.value})} className="w-full mt-1 border-2 border-slate-200 p-3 rounded-xl font-bold text-slate-700 focus:border-[#FF9600] outline-none bg-white">
                    <option value="solo">Solo</option>
                    <option value="team">Team</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">XP Reward</label>
                  <input required type="number" value={questForm.reward_xp} onChange={e => setQuestForm({...questForm, reward_xp: parseInt(e.target.value)})} className="w-full mt-1 border-2 border-slate-200 p-3 rounded-xl font-bold text-slate-700 focus:border-[#FF9600] outline-none" />
                </div>
              </div>
              <button type="submit" className="w-full mt-4 bg-[#FF9600] text-white font-black uppercase tracking-widest py-4 rounded-xl border-b-4 border-[#D97A00] active:border-b-0 active:translate-y-1 flex justify-center items-center gap-2">
                <PlusCircle size={20} strokeWidth={3} /> Save Quest
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
}