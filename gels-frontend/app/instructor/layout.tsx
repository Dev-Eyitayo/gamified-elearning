"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, BookOpen, Settings } from 'lucide-react';

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { name: "Overview", path: "/instructor", icon: <LayoutDashboard size={20} strokeWidth={3} /> },
    { name: "Students", path: "/instructor/students", icon: <Users size={20} strokeWidth={3} /> },
    { name: "Content", path: "/instructor/content", icon: <BookOpen size={20} strokeWidth={3} /> },
    { name: "Settings", path: "/instructor/settings", icon: <Settings size={20} strokeWidth={3} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-4 px-4">
      
      {/* Instructor Tab Navigation */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 bg-white p-2 rounded-3xl border-2 border-slate-200 shadow-[0_4px_0_0_#E5E5E5] overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          return (
            <Link 
              key={tab.name}
              href={tab.path}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                isActive 
                  ? 'bg-[#DDF4FF] text-[#1CB0F6] border-2 border-[#1CB0F6]' 
                  : 'bg-transparent text-slate-400 border-2 border-transparent hover:bg-slate-50 hover:text-slate-500'
              }`}
            >
              {tab.icon} {tab.name}
            </Link>
          );
        })}
      </div>

      {/* Page Content Rendered Here */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children}
      </div>

    </div>
  );
}