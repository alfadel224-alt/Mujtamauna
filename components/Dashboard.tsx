
import React, { useState, useEffect } from 'react';
import { Member, Language, ConnectionRequest } from '../types';
import { Link } from 'react-router-dom';

interface DashboardProps {
  members: Member[];
  requests: ConnectionRequest[];
  currentUser: Member;
  onUpdateStatus: (id: string, status: 'accepted' | 'rejected') => void;
  lang: Language;
  notify?: (msg: string, type?: 'success' | 'error') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ members, requests, currentUser, onUpdateStatus, lang, notify }) => {
  const [cleanUrl, setCleanUrl] = useState('');
  
  const recommendedMembers = members.filter(m => m.id !== currentUser.id).slice(0, 6);
  const incomingRequests = requests.filter(req => req.toId === currentUser.id && req.status === 'pending');

  useEffect(() => {
    // Logic to clean the URL from index.html or other sandbox noise
    let url = window.location.origin;
    // Ensure we don't have double slashes if origin already includes it
    if (!url.endsWith('/')) {
        // We generally want the root for the sharing link
    }
    setCleanUrl(url);
  }, []);

  const handleWhatsAppShare = () => {
    const message = `أبشر بالخير! 🇸🇩 تم إطلاق تطبيق "مجتمعنا"، أول منصة تعارف سودانية آمنة بالذكاء الاصطناعي. تعال انضم لينا وتعرف على ناس شبهك في بيئة محترمة.\n\nالرابط: ${cleanUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cleanUrl)
      .then(() => {
        if (notify) notify('تم نسخ الرابط النظيف.. أبشر بالخير! 🇸🇩');
      })
      .catch(() => {
        if (notify) notify('عفواً، فشل النسخ. انسخ الرابط يدوياً.', 'error');
      });
  };

  return (
    <div className="w-full space-y-10 animate-in fade-in duration-700">
      
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-[#1a3c34] p-8 md:p-16 shadow-xl flex flex-col gap-8 group">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none transition-transform duration-1000 group-hover:scale-110">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#daa520] rounded-full blur-[80px]"></div>
        </div>
        
        <div className="relative z-10 space-y-6 text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur rounded-full border border-white/20 text-[#daa520] text-[9px] font-black uppercase tracking-widest">
            جاهز للنشر والاستخدام 🚀
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
            مجتمعنا <br/> <span className="text-[#daa520]">لَمّتنا السودانية</span>
          </h2>
          <div className="flex flex-wrap gap-3 pt-2 justify-end">
            <Link to="/discover" className="px-6 py-4 bg-[#daa520] text-[#1a3c34] rounded-2xl font-black text-sm shadow-lg active:scale-95 transition-transform">اكتشف الأعضاء</Link>
            <button 
              onClick={handleWhatsAppShare} 
              className="px-6 py-4 bg-[#25D366] text-white rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg active:scale-95"
            >
              <span>💬</span> انشر في واتساب
            </button>
          </div>
        </div>
      </section>

      {/* Vercel Deployment & Sharing Hub */}
      <section className="bg-white p-8 rounded-[2.5rem] border-2 border-emerald-50 shadow-sm space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-[#000] text-white rounded-2xl flex items-center justify-center text-xl font-bold">▲</div>
             <div>
                <h3 className="text-xl font-black text-[#1a3c34]">دليل الرفع على Vercel</h3>
                <p className="text-[10px] font-bold text-slate-400">للحصول على رابط فعال ومستقر</p>
             </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            جاهز للنشر
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-black text-[#1a3c34] text-sm flex items-center gap-2">
              <span className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-[10px]">1</span>
              رابط النشر الحالي:
            </h4>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between gap-3 group">
              <code className="text-[10px] text-emerald-700 font-bold truncate flex-1">{cleanUrl}</code>
              <button 
                onClick={copyToClipboard}
                className="p-2 bg-white text-[#1a3c34] rounded-xl border border-slate-200 hover:border-[#daa520] transition-all shadow-sm active:scale-90"
                title="نسخ الرابط"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-black text-[#1a3c34] text-sm flex items-center gap-2">
              <span className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-[10px]">2</span>
              خطوات Vercel الصحيحة:
            </h4>
            <div className="text-[11px] font-bold text-slate-500 space-y-2 leading-relaxed">
              <p>• تأكد من رفع كل الملفات (index.html, index.tsx, App.tsx, إلخ).</p>
              <p>• في إعدادات Vercel، أضف <strong>Environment Variable</strong> باسم <code className="text-[#daa520]">API_KEY</code> وضعه قيمته.</p>
              <p>• الرابط الذي يوفره لك Vercel هو الذي يجب مشاركته.</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-50">
           <a 
             href="https://vercel.com/new" 
             target="_blank" 
             rel="noopener noreferrer"
             className="w-full flex items-center justify-center gap-3 py-4 bg-black text-white rounded-2xl font-black text-sm shadow-xl hover:bg-slate-800 transition-all active:scale-95"
           >
             <span>🚀</span> ارفع مشروعك على Vercel الآن
           </a>
        </div>
      </section>

      {/* Suggested Members */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-black text-[#1a3c34]">أعضاء مميزون</h2>
          <Link to="/discover" className="text-[10px] font-black text-[#daa520] uppercase tracking-widest underline underline-offset-4">عرض الكل</Link>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-2">
          {recommendedMembers.map(member => (
            <div key={member.id} className="min-w-[180px] bg-white rounded-[2rem] p-5 shadow-sm border border-slate-50 flex flex-col items-center text-center gap-4 hover:border-[#daa520]/30 transition-colors">
              <div className="relative">
                <div className="w-24 h-24 rounded-full p-1 border-2 border-[#daa520]">
                  <img src={member.profileImage} className="w-full h-full rounded-full object-cover blur-[2px] opacity-50 grayscale" alt="" />
                </div>
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-black text-[#1a3c34]">{member.name}</h3>
                <p className="text-[9px] font-bold text-slate-400">{member.city}</p>
              </div>
              <Link to="/discover" className="w-full py-2 bg-[#fdfcf0] text-[#1a3c34] rounded-xl font-black text-[10px] border border-emerald-50">عرض البروفايل</Link>
            </div>
          ))}
        </div>
      </section>

      <div className="pb-12"></div>
    </div>
  );
};

export default Dashboard;
