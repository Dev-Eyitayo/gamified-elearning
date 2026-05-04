import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';

interface Quest {
  id: string;
  title: string;
  xp: number;
  description: string;
  progress: number;
  isClaimable: boolean;
}

export default function QuestList({ quests }: { quests: Quest[] }) {
  return (
    <div className="space-y-6">
      {quests.map((quest) => (
        <div key={quest.id} className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-[0_6px_0_0_#E5E5E5]">
          
          <div className="flex justify-between items-start mb-3">
            <h4 className="text-xl font-black text-slate-700">{quest.title}</h4>
            <span className="text-sm font-black text-[#FF9600] bg-[#FF9600]/10 border-2 border-[#FF9600]/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5 uppercase tracking-widest">
              <Zap size={16} strokeWidth={3} /> {quest.xp} XP
            </span>
          </div>
          
          <p className="text-sm font-bold text-slate-500 mb-5 leading-relaxed">{quest.description}</p>
          
          {/* Chunky Progress Bar */}
          <div className={`w-full bg-slate-100 rounded-full h-5 border-2 border-slate-200 overflow-hidden ${quest.isClaimable ? 'mb-5' : ''}`}>
            <div 
              className={`h-full rounded-full transition-all duration-500 ${quest.isClaimable ? 'bg-[#58CC02]' : 'bg-[#FF9600]'}`} 
              style={{ width: `${quest.progress}%` }}
            ></div>
          </div>

          {/* 3D Claim Button */}
          {quest.isClaimable && (
            <button className="w-full text-base font-black text-white bg-[#1CB0F6] hover:bg-[#149FDF] py-3.5 rounded-2xl uppercase tracking-widest transition-all border-b-4 border-[#1899D6] active:translate-y-1 active:border-b-0 flex items-center justify-center gap-2 mt-2">
              Claim Reward <ArrowRight size={20} strokeWidth={3} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}