
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Language, Member } from '../types';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  onLogout: () => void;
  title: string;
  user: Member | null;
  isAdmin: boolean;
}

const Header: React.FC<HeaderProps> = ({ lang, onToggleLang, onLogout, title, user, isAdmin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  
  const isHomeBase = location.pathname === '/';

  return (
    <header className="h-16 md:h-24 bg-white/95 backdrop-blur-lg border-b border-emerald-50 flex items-center justify-between px-4 md:px-12 sticky top-0 z-40 shadow-sm w-full">
      <div className="flex items-center gap-3 md:gap-5 min-w-0">
        {!isHomeBase && (
          <button 
            onClick={() => navigate(-1)}
            className="p-2 md:p-3 bg-emerald-50 text-[#1a3c34] rounded-xl md:rounded-2xl hover:bg-[#daa520] hover:text-white transition-all flex items-center gap-1 shadow-sm border border-emerald-100"
          >
            <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div className="flex flex-col min-w-0">
          <h1 className="text-base md:text-2xl font-black text-[#1a3c34] leading-tight truncate max-w-[150px] xs:max-w-[250px] md:max-w-none">{title}</h1>
          {isAdmin && <span className="text-[8px] md:text-xs font-black text-[#daa520] uppercase tracking-tighter">لوحة التحكم المركزية</span>}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-6 shrink-0 relative">
        {isAdmin && location.pathname !== '/admin' && (
          <Link 
            to="/admin" 
            className="flex items-center gap-2 px-2.5 md:px-5 py-1.5 md:py-3 bg-amber-100 text-[#1a3c34] rounded-xl md:rounded-2xl border border-amber-200 hover:bg-[#daa520] hover:text-white transition-all shadow-sm"
          >
            <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
            <span className="text-[10px] md:text-sm font-black hidden sm:inline ml-1">الإدارة</span>
          </Link>
        )}

        <button 
          onClick={onToggleLang}
          className="w-9 h-9 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-slate-50 text-[#1a3c34] font-black hover:bg-emerald-50 transition-colors border border-emerald-100 text-[10px] md:text-base"
        >
          {lang === 'ar' ? 'EN' : 'ع'}
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="h-9 w-9 md:h-12 md:w-auto md:px-5 bg-[#1a3c34] text-white rounded-xl md:rounded-2xl flex items-center justify-center gap-2 md:gap-4 shadow-xl border border-white/10 overflow-hidden active:scale-95 transition-all"
          >
            {user?.profileImage ? (
              <img src={user.profileImage} className="w-5 h-5 md:w-8 md:h-8 rounded-lg md:rounded-xl object-cover border border-white/20" alt="" />
            ) : (
              <div className="w-5 h-5 md:w-7 md:h-7 bg-[#daa520] rounded-lg md:rounded-xl flex items-center justify-center text-[10px] md:text-sm font-black text-[#1a3c34] shrink-0">
                {user?.name?.[0] || 'ز'}
              </div>
            )}
            <span className="hidden md:inline font-bold text-sm md:text-base truncate max-w-[100px]">{user?.name?.split(' ')[0]}</span>
            <svg className={`w-4 h-4 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
              <div className="absolute top-full mt-3 right-0 w-48 bg-white rounded-3xl shadow-2xl border border-emerald-50 py-3 z-20 animate-in zoom-in-95 duration-200">
                 <Link 
                    to="/profile" 
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-6 py-3 hover:bg-emerald-50 text-[#1a3c34] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    <span className="font-bold text-sm">بروفايلي</span>
                 </Link>
                 <button 
                    onClick={() => { setShowDropdown(false); onLogout(); }}
                    className="w-full flex items-center gap-3 px-6 py-3 hover:bg-rose-50 text-rose-500 transition-colors border-t border-slate-50 mt-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                    <span className="font-bold text-sm">تسجيل الخروج</span>
                 </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
