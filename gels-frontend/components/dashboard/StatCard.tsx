import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string | React.ReactNode;
  icon: React.ReactNode;
  iconColorClass: string;
  iconBgClass: string;
  borderColorClass?: string; // Added to give the icon box a chunky border
}

export default function StatCard({ title, value, subtext, icon, iconColorClass, iconBgClass, borderColorClass = "border-transparent" }: StatCardProps) {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 flex items-start justify-between shadow-[0_6px_0_0_#E5E5E5] transform hover:-translate-y-1 hover:shadow-[0_8px_0_0_#E5E5E5] transition-all">
      <div>
        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-700">{value}</h3>
        {subtext && <div className="mt-2 font-bold text-slate-500 text-sm">{subtext}</div>}
      </div>
      <div className={`p-4 rounded-2xl border-2 ${iconBgClass} ${iconColorClass} ${borderColorClass}`}>
        {icon}
      </div>
    </div>
  );
}