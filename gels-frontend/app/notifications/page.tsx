"use client";

import React, { useState, useEffect } from 'react';
import { Trophy, UserPlus, BrainCircuit, Target, CheckCheck, BellRing, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/api/api';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const userId = localStorage.getItem('gels_user_id');
        if (!userId) return;

        const data = await api.gamification.getNotifications(userId);
        setNotifications(data);
      } catch (err: any) {
        console.error("Failed to load notifications:", err);
        setError("Failed to sync alerts.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifs();
  }, []);

  const markAllAsRead = () => {
    // In a real app, this would send a PUT request to the backend to update the DB
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return (
          <div className="w-14 h-14 rounded-full bg-[#FFD900] flex items-center justify-center border-b-4 border-[#D97A00] shrink-0 text-yellow-900 shadow-sm">
            <Trophy size={28} strokeWidth={2.5} />
          </div>
        );
      case 'social':
        return (
          <div className="w-14 h-14 rounded-full bg-[#58CC02] flex items-center justify-center border-b-4 border-[#46A302] shrink-0 text-white shadow-sm">
            <UserPlus size={28} strokeWidth={2.5} />
          </div>
        );
      case 'ai':
        return (
          <div className="w-14 h-14 rounded-full bg-[#CE82FF] flex items-center justify-center border-b-4 border-[#A568CC] shrink-0 text-white shadow-sm">
            <BrainCircuit size={28} strokeWidth={2.5} />
          </div>
        );
      case 'quest':
        return (
          <div className="w-14 h-14 rounded-full bg-[#FF9600] flex items-center justify-center border-b-4 border-[#D97A00] shrink-0 text-white shadow-sm">
            <Target size={28} strokeWidth={2.5} />
          </div>
        );
      default:
        return (
          <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center border-b-4 border-slate-300 shrink-0 text-slate-500 shadow-sm">
            <BellRing size={28} strokeWidth={2.5} />
          </div>
        );
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center font-sans text-slate-400">
        <Loader2 className="animate-spin mb-4 text-[#FF4B4B]" size={48} strokeWidth={3} />
        <h2 className="font-black tracking-widest uppercase">Fetching Alerts...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center font-sans">
        <div className="bg-[#FF4B4B]/10 text-[#FF4B4B] p-6 rounded-3xl border-2 border-[#FF4B4B]/20 flex flex-col items-center text-center max-w-md">
          <AlertCircle size={48} strokeWidth={2.5} className="mb-4" />
          <h2 className="font-black text-xl mb-2">Sync Error</h2>
          <p className="font-bold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-500">
      
      {/* Header Area */}
      <div className="border-b-4 border-slate-200 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-700 uppercase tracking-tight flex items-center gap-3">
            Notifications
            {unreadCount > 0 && (
              <span className="bg-[#FF4B4B] text-white text-lg px-3 py-1 rounded-xl shadow-sm">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-slate-500 font-bold mt-2 text-lg">Stay updated on your learning journey</p>
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="text-[#1CB0F6] font-black uppercase tracking-widest text-sm hover:text-[#1899D6] transition-colors flex items-center gap-2 bg-[#DDF4FF]/50 px-4 py-2 rounded-xl"
          >
            <CheckCheck size={18} strokeWidth={3} /> Mark all read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`flex items-start gap-4 sm:gap-6 p-5 sm:p-6 rounded-3xl border-2 transition-all cursor-pointer transform hover:-translate-y-1 ${
              notification.isRead 
                ? 'bg-white border-slate-200 shadow-[0_4px_0_0_#E5E5E5] opacity-80 hover:opacity-100' 
                : 'bg-[#DDF4FF] border-[#1CB0F6] shadow-[0_6px_0_0_#1CB0F6]'
            }`}
          >
            {renderIcon(notification.type)}
            
            <div className="flex-1 pt-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className={`text-xl font-black tracking-wide ${notification.isRead ? 'text-slate-700' : 'text-[#1899D6]'}`}>
                  {notification.title}
                </h3>
                <span className={`text-xs font-black uppercase tracking-widest shrink-0 ml-4 ${notification.isRead ? 'text-slate-400' : 'text-[#1CB0F6]'}`}>
                  {notification.time}
                </span>
              </div>
              
              <p className={`font-bold leading-relaxed ${notification.isRead ? 'text-slate-500' : 'text-slate-600'}`}>
                {notification.message}
              </p>
            </div>

            {/* Unread Indicator Dot */}
            {!notification.isRead && (
              <div className="w-4 h-4 rounded-full bg-[#FF4B4B] border-2 border-[#DDF4FF] shrink-0 mt-2"></div>
            )}
            
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="text-center py-20 bg-slate-50 border-2 border-slate-200 rounded-3xl border-dashed">
            <BellRing size={64} className="text-slate-300 mx-auto mb-4" strokeWidth={2} />
            <h3 className="text-2xl font-black text-slate-400 uppercase tracking-widest">You're all caught up!</h3>
          </div>
        )}
      </div>
      
    </div>
  );
}