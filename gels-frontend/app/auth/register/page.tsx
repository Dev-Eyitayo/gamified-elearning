"use client";

import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Phone, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: 'learner'
  });

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/onboarding');
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* Left Side: Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-y-auto">
        <div className="w-full max-w-[450px] py-8">
          
          <div className="mb-10 text-center lg:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#58CC02] flex items-center justify-center font-black text-white text-2xl border-b-4 border-[#46A302] mb-6 lg:hidden mx-auto">
              G
            </div>
            <h2 className="text-3xl font-black text-slate-700 mb-2">Create your profile</h2>
            <p className="text-slate-400 font-bold">Join the GELS ecosystem today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-500 uppercase tracking-widest pl-1">First Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#58CC02] transition-colors" size={20} strokeWidth={3} />
                  <input 
                    type="text" name="firstName" required placeholder="Jane"
                    value={formData.firstName} onChange={handleInputChange}
                    className="w-full bg-slate-100 border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-base font-bold text-slate-700 focus:outline-none focus:border-[#58CC02] focus:bg-white transition-all placeholder-slate-400"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-black text-slate-500 uppercase tracking-widest pl-1">Last Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#58CC02] transition-colors" size={20} strokeWidth={3} />
                  <input 
                    type="text" name="lastName" required placeholder="Doe"
                    value={formData.lastName} onChange={handleInputChange}
                    className="w-full bg-slate-100 border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-base font-bold text-slate-700 focus:outline-none focus:border-[#58CC02] focus:bg-white transition-all placeholder-slate-400"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-slate-500 uppercase tracking-widest pl-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#58CC02] transition-colors" size={20} strokeWidth={3} />
                <input 
                  type="email" name="email" required placeholder="email@university.edu"
                  value={formData.email} onChange={handleInputChange}
                  className="w-full bg-slate-100 border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-base font-bold text-slate-700 focus:outline-none focus:border-[#58CC02] focus:bg-white transition-all placeholder-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-slate-500 uppercase tracking-widest pl-1">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#58CC02] transition-colors" size={20} strokeWidth={3} />
                <input 
                  type="tel" name="phone" required placeholder="+1 234 567 8900"
                  value={formData.phone} onChange={handleInputChange}
                  className="w-full bg-slate-100 border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-base font-bold text-slate-700 focus:outline-none focus:border-[#58CC02] focus:bg-white transition-all placeholder-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-slate-500 uppercase tracking-widest pl-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#58CC02] transition-colors" size={20} strokeWidth={3} />
                <input 
                  type="password" name="password" required placeholder="••••••••"
                  value={formData.password} onChange={handleInputChange}
                  className="w-full bg-slate-100 border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-base font-bold text-slate-700 focus:outline-none focus:border-[#58CC02] focus:bg-white transition-all placeholder-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-slate-500 uppercase tracking-widest pl-1">I am a...</label>
              <div className="relative group">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#58CC02] transition-colors" size={20} strokeWidth={3} />
                <select 
                  name="role" value={formData.role} onChange={handleInputChange}
                  className="w-full bg-slate-100 border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-base font-bold text-slate-700 focus:outline-none focus:border-[#58CC02] focus:bg-white transition-all appearance-none cursor-pointer"
                >
                  <option value="learner">Learner (Student)</option>
                  <option value="instructor">Instructor (Teacher)</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full bg-[#58CC02] text-white py-4 rounded-2xl text-base font-black uppercase tracking-widest transition-all border-b-4 border-[#46A302] hover:bg-[#46A302] active:translate-y-1 active:border-b-0 flex items-center justify-center gap-2 mt-8">
              Create Account <ArrowRight size={20} strokeWidth={3} />
            </button>
          </form>

          <div className="mt-8 pt-6 text-center lg:text-left">
            <p className="text-slate-500 font-bold">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-black text-[#58CC02] hover:text-[#46A302] transition-colors">
                Log in
              </Link>
            </p>
          </div>

        </div>
      </div>

      {/* Right Side: Visual Art (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#58CC02] relative overflow-hidden flex-col justify-center items-center p-16">
        
        <div className="absolute top-20 left-20 w-80 h-80 bg-[#46A302]/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-3xl bg-white flex items-center justify-center font-black text-[#58CC02] text-5xl border-b-8 border-slate-200 mb-10 transform rotate-3 shadow-xl">
            G
          </div>
          <h2 className="text-5xl font-black text-white tracking-tight leading-tight max-w-md">
            Start your <br/> learning streak today.
          </h2>
        </div>
      </div>

    </div>
  );
}