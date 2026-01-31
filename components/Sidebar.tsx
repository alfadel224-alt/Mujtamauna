
import React from 'react';
import { Link } from 'react-router-dom';
import { Language } from '../types';
import { UI_TEXT } from '../constants';

interface SidebarProps {
  lang: Language;
  currentPath: string;
  isAdmin?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ lang, currentPath, isAdmin }) => {
  const menuItems = [
    { id: 'dashboard', path: '/', label: lang === 'ar' ? 'الرئيسية' : 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'discover', path: '/discover', label: UI_TEXT[lang].members, icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { id: 'profile', path: '/profile', label: lang === 'ar' ? 'بروفايلي' : 'My Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'support', path: '/support', label: lang === 'ar' ? 'الدعم والخصوصية' : 'Support & Privacy', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  ];

  if (isAdmin) {
    menuItems.push({ id: 'admin', path: '/admin', label: 'لوحة الإدارة', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' });
  }

  return (
    <aside className="hidden md:flex flex-col w-72 bg-[#1a3c34] text-white h-screen sticky top-0 shadow-2xl z-20 overflow-hidden">
      <div className="p-8">
        <div className="flex items-center space-x-4 space-x-reverse mb-12">
          <div className="w-14 h-14 bg-[#daa520] rounded-[1.5rem] flex items-center justify-center shadow-lg transform rotate-6 border-4 border-[#1a3c34]">
            <span className="text-3xl font-black text-[#1a3c34]">م</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight leading-none">مجتمعنا</span>
            <span className="text-[10px] text-emerald-300 font-bold mt-1 uppercase tracking-widest">Sudanese Community</span>
          </div>
        </div>

        <nav className="space-y-3">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center px-6 py-4 rounded-[1.5rem] transition-all duration-300 group ${
                currentPath === item.path 
                ? 'bg-[#daa520] text-[#1a3c34] font-black shadow-xl scale-105' 
                : 'text-emerald-100/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={item.icon} />
              </svg>
              <span className="mx-4 font-bold">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 space-y-4">
        <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-emerald-200">النسخة المستقرة</span>
          </div>
          <p className="text-[10px] text-emerald-100/50 leading-relaxed font-black">
            v1.0.0-PROD
          </p>
        </div>
        <p className="text-center text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">
          صنع بكل حب في السودان 🇸🇩
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
