"use client";

import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Zap, Target, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting Login:", formData);
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* Left Side: Playful Gamified Value Prop */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1CB0F6] relative overflow-hidden flex-col justify-center p-16">
        
        {/* Background blobs */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#1899D6]/30 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center font-black text-[#1CB0F6] text-3xl border-b-4 border-slate-200 mb-8 transform -rotate-6">
            G
          </div>
          
          <h1 className="text-5xl font-black text-white mb-6 leading-tight">
            Learn better, <br /> earn faster.
          </h1>
          <p className="text-white/90 text-lg font-bold mb-10 max-w-md">
            The free, fun, and highly effective way to level up your engineering skills.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border-2 border-white/20">
              <Zap size={32} className="text-[#FFD900]" fill="currentColor" />
              <span className="font-black text-white tracking-wide">Adaptive AI Lessons</span>
            </div>
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border-2 border-white/20">
              <Target size={32} className="text-[#58CC02]" fill="currentColor" />
              <span className="font-black text-white tracking-wide">Personalized Goals</span>
            </div>
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border-2 border-white/20">
              <BookOpen size={32} className="text-[#FF9600]" fill="currentColor" />
              <span className="font-black text-white tracking-wide">Bite-sized Curriculum</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-[400px]">
          
          <div className="mb-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#1CB0F6] flex items-center justify-center font-black text-white text-2xl border-b-4 border-[#1899D6] mb-6 lg:hidden mx-auto">
              G
            </div>
            <h2 className="text-3xl font-black text-slate-700 mb-2">Welcome back!</h2>
            <p className="text-slate-400 font-bold">Log in to continue your journey.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-500 uppercase tracking-widest pl-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1CB0F6] transition-colors" size={20} strokeWidth={3} />
                <input 
                  type="email" name="email" required placeholder="email@university.edu"
                  value={formData.email} onChange={handleInputChange}
                  className="w-full bg-slate-100 border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-base font-bold text-slate-700 focus:outline-none focus:border-[#1CB0F6] focus:bg-white transition-all placeholder-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center pl-1 pr-1">
                <label className="text-sm font-black text-slate-500 uppercase tracking-widest">Password</label>
                <a href="#" className="text-sm font-black text-[#1CB0F6] hover:text-[#1899D6] transition-colors">Forgot?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1CB0F6] transition-colors" size={20} strokeWidth={3} />
                <input 
                  type="password" name="password" required placeholder="••••••••"
                  value={formData.password} onChange={handleInputChange}
                  className="w-full bg-slate-100 border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-base font-bold text-slate-700 focus:outline-none focus:border-[#1CB0F6] focus:bg-white transition-all placeholder-slate-400"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-[#1CB0F6] text-white py-4 rounded-2xl text-base font-black uppercase tracking-widest transition-all border-b-4 border-[#1899D6] hover:bg-[#149FDF] active:translate-y-1 active:border-b-0 flex items-center justify-center gap-2 mt-8">
              Log In <ArrowRight size={20} strokeWidth={3} />
            </button>
          </form>

          <div className="mt-8 pt-6 text-center">
            <p className="text-slate-500 font-bold">
              Don't have an account?{' '}
              <Link href="/auth/register" className="font-black text-[#1CB0F6] hover:text-[#1899D6] transition-colors">
                Sign up
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}