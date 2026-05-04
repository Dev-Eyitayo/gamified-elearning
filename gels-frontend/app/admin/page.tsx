"use client";

import React, { useState } from 'react';
import { ShieldCheck, Server, Database, Activity, Users, ShieldAlert, Cpu, CheckCircle2 } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'health' | 'users'>('health');

  // Mock System Health Data (PRD US-015)
  const systemHealth = {
    apiLatency: "124ms",
    dbStatus: "Healthy",
    activeConnections: 142,
    geminiQuota: "45%"
  };

  // Mock User Role Data (PRD US-014)
  const users = [
    { id: 1, name: "Chidera Eze", email: "chidera@university.edu", role: "learner", lastActive: "2 mins ago" },
    { id: 2, name: "Dr. Adaeze", email: "adaeze@university.edu", role: "instructor", lastActive: "1 hour ago" },
    { id: 3, name: "Emeka Admin", email: "emeka@university.edu", role: "admin", lastActive: "Just now" },
    { id: 4, name: "Sarah Scripts", email: "sarah@university.edu", role: "learner", lastActive: "1 day ago" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-4 px-4">
      
      {/* Header */}
      <div className="border-b-4 border-slate-200 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-700 uppercase tracking-tight">System Control</h1>
          <p className="text-slate-500 font-bold mt-2 text-lg">Platform Health & Role Management</p>
        </div>
        <div className="bg-slate-800 px-4 py-2 rounded-2xl border-b-4 border-slate-900 text-white font-black uppercase tracking-widest text-sm flex items-center gap-2 shadow-sm">
          <ShieldCheck size={20} strokeWidth={3} className="text-[#58CC02]" /> Root Access
        </div>
      </div>

      {/* Chunky Admin Tabs */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={() => setActiveTab('health')}
          className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
            activeTab === 'health' 
              ? 'bg-[#1CB0F6] text-white border-b-4 border-[#1899D6] shadow-sm' 
              : 'bg-white text-slate-400 border-2 border-slate-200 hover:bg-slate-50 hover:text-slate-500'
          }`}
        >
          <Activity size={20} strokeWidth={3} /> System Health
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
            activeTab === 'users' 
              ? 'bg-[#CE82FF] text-white border-b-4 border-[#A568CC] shadow-sm' 
              : 'bg-white text-slate-400 border-2 border-slate-200 hover:bg-slate-50 hover:text-slate-500'
          }`}
        >
          <Users size={20} strokeWidth={3} /> Role Management
        </button>
      </div>

      {/* --- TAB: SYSTEM HEALTH --- */}
      {activeTab === 'health' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Gemini API Latency" 
              value={systemHealth.apiLatency} 
              icon={<Cpu size={32} strokeWidth={3} />} 
              iconColorClass="text-[#1CB0F6]" iconBgClass="bg-[#1CB0F6]/10" borderColorClass="border-[#1CB0F6]/20" 
            />
            <StatCard 
              title="Database Status" 
              value={systemHealth.dbStatus} 
              icon={<Database size={32} strokeWidth={3} />} 
              iconColorClass="text-[#58CC02]" iconBgClass="bg-[#58CC02]/10" borderColorClass="border-[#58CC02]/20" 
            />
            <StatCard 
              title="Active Connections" 
              value={systemHealth.activeConnections} 
              icon={<Server size={32} strokeWidth={3} />} 
              iconColorClass="text-[#CE82FF]" iconBgClass="bg-[#CE82FF]/10" borderColorClass="border-[#CE82FF]/20" 
            />
            <StatCard 
              title="Gemini Quota Used" 
              value={systemHealth.geminiQuota} 
              subtext={<span className="text-slate-500">Free Tier Limit</span>}
              icon={<Activity size={32} strokeWidth={3} />} 
              iconColorClass="text-[#FF9600]" iconBgClass="bg-[#FF9600]/10" borderColorClass="border-[#FF9600]/20" 
            />
          </div>

          <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 md:p-8 shadow-[0_6px_0_0_#E5E5E5]">
            <h2 className="text-xl font-black text-slate-700 uppercase tracking-widest mb-6 flex items-center gap-3">
               <Server className="text-[#1CB0F6]" size={24} strokeWidth={3} /> Infrastructure Logs
            </h2>
            <div className="bg-slate-900 rounded-2xl p-6 font-mono text-sm overflow-x-auto border-4 border-slate-800">
              <div className="text-[#58CC02] mb-2">[INFO] 2026-05-04 11:00:01 - PostgreSQL Connection Pool: Healthy (12/50)</div>
              <div className="text-[#1CB0F6] mb-2">[INFO] 2026-05-04 11:02:15 - FastAPI Background Task: EDM Pipeline executed for User ID 482</div>
              <div className="text-[#1CB0F6] mb-2">[INFO] 2026-05-04 11:02:16 - Gemini 1.5 Flash API: Prompt token count 450, Latency 112ms</div>
              <div className="text-[#FF9600] mb-2">[WARN] 2026-05-04 11:05:30 - Affective Engine: High failure rate detected in Module 4.2. Triggering supportive quests.</div>
              <div className="text-[#58CC02] mb-2">[INFO] 2026-05-04 11:06:07 - System status check: All services nominal.</div>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB: ROLE MANAGEMENT --- */}
      {activeTab === 'users' && (
        <div className="bg-white border-2 border-slate-200 rounded-3xl shadow-[0_6px_0_0_#E5E5E5] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 border-b-2 border-slate-200 flex justify-between items-center bg-slate-50">
            <h2 className="text-xl font-black text-slate-700 uppercase tracking-widest">Access Control</h2>
            <button className="bg-[#58CC02] text-white px-4 py-2 rounded-xl text-sm font-black uppercase tracking-widest border-b-4 border-[#46A302] hover:bg-[#46A302] active:translate-y-1 active:border-b-0 transition-all flex items-center gap-2">
               <Users size={18} strokeWidth={3} /> Add User
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-white border-b-2 border-slate-200">
                  <th className="px-6 py-5 font-black text-slate-500 uppercase tracking-widest">User Details</th>
                  <th className="px-6 py-5 font-black text-slate-500 uppercase tracking-widest">System Role</th>
                  <th className="px-6 py-5 font-black text-slate-500 uppercase tracking-widest">Last Active</th>
                  <th className="px-6 py-5 font-black text-slate-500 uppercase tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5">
                      <div>
                        <div className="font-black text-slate-700 text-base">{user.name}</div>
                        <div className="font-bold text-slate-400">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <select 
                        defaultValue={user.role}
                        className={`font-black uppercase tracking-widest text-xs px-3 py-2 rounded-xl border-2 appearance-none cursor-pointer outline-none ${
                          user.role === 'admin' ? 'bg-slate-800 text-white border-slate-900' :
                          user.role === 'instructor' ? 'bg-[#CE82FF]/10 text-[#CE82FF] border-[#CE82FF]/30' :
                          'bg-[#1CB0F6]/10 text-[#1CB0F6] border-[#1CB0F6]/30'
                        }`}
                      >
                        <option value="learner">Learner</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-bold text-slate-500">{user.lastActive}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button className="text-[#FF4B4B] hover:bg-[#FF4B4B]/10 p-2 rounded-xl transition-colors">
                        <ShieldAlert size={20} strokeWidth={3} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}