import React, { useState, useEffect } from 'react';
import { Language } from '../types';

interface Props {
  lang: Language;
}

// Fixed: Removed conflicting global Window interface augmentation. 
// The environment provides the AIStudio type globally, so re-declaring it caused a conflict.

const SupportPage: React.FC<Props> = ({ lang }) => {
  const [reportText, setReportText] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    checkKeyStatus();
  }, []);

  const checkKeyStatus = async () => {
    // Fixed: Using global window.aistudio which is pre-configured in the platform
    if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setIsPro(hasKey);
    }
  };

  const handleUpgrade = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setIsPro(true); // Assume success per instructions
    }
  };

  const handleSendReport = () => {
    if (reportText.trim()) {
      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        setReportText('');
      }, 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-32 px-4 md:px-0">
      <div className="bg-[#1a3c34] p-12 rounded-[3rem] text-white text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#daa520]/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <h2 className="text-4xl font-black mb-4">الدعم الفني والاحترافي</h2>
        <p className="text-emerald-100/70 text-lg max-w-xl mx-auto font-medium">نحن هنا لخدمتك ولضمان حصولك على أقصى درجات الأمان والخصوصية في مجتمعنا.</p>
      </div>

      {/* API Key / Pro Section */}
      <div className="bg-gradient-to-br from-[#1a3c34] to-[#2d5a4e] p-10 rounded-[2.5rem] shadow-2xl border-4 border-[#daa520]/30 relative overflow-hidden group">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#daa520]/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-right space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">👑</span>
              <h3 className="text-3xl font-black text-[#daa520]">حساب مجتمعنا الاحترافي</h3>
            </div>
            <p className="text-white/80 font-bold leading-relaxed max-w-md">
              فعل الميزات المتقدمة مثل توليد الصور بالذكاء الاصطناعي (Gemini 3 Pro) والدردشة الصوتية الفائقة عبر ربط مفتاحك الخاص.
            </p>
            <div className="flex flex-col gap-2">
               <a 
                 href="https://ai.google.dev/gemini-api/docs/billing" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-[#daa520] text-xs font-black underline hover:text-amber-400 transition-colors"
               >
                 تعرف على كيفية الحصول على مفتاح API من مشروع Google Cloud مدفوع
               </a>
            </div>
          </div>
          
          <div className="shrink-0">
            {isPro ? (
              <div className="bg-[#daa520] text-[#1a3c34] px-10 py-5 rounded-3xl font-black text-center shadow-2xl">
                <p className="text-xs uppercase tracking-widest mb-1">الوضع الحالي</p>
                <p className="text-xl">مفتاحك مفعل ✓</p>
              </div>
            ) : (
              <button 
                onClick={handleUpgrade}
                className="bg-[#daa520] text-[#1a3c34] px-12 py-6 rounded-3xl font-black text-xl shadow-[0_10px_40px_rgba(218,165,32,0.4)] hover:scale-105 active:scale-95 transition-all"
              >
                ربط مفتاح API 🚀
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact & Feedback */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-emerald-50 space-y-8">
          <h3 className="text-2xl font-black text-[#1a3c34]">تواصل معنا</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#1a3c34]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold">رقم الهاتف (واتساب)</p>
                <p className="text-lg font-black text-[#1a3c34]">+249 912 345 678</p>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-[#daa520]">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold">البريد الإلكتروني</p>
                <p className="text-lg font-black text-[#1a3c34]">hello@mujtamauna.sd</p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy & App Info */}
        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-emerald-50 space-y-8">
            <h3 className="text-2xl font-black text-[#1a3c34]">سياسة الخصوصية</h3>
            <div className="space-y-6 text-sm leading-relaxed text-slate-600 font-medium">
              {[
                'يتم تشفير كافة البيانات الشخصية والمحادثات بتقنيات أمان متطورة.',
                'صور البروفايل تظل "مخفية" ولا تظهر إلا بموافقة الطرفين.',
                'التحقق من الهوية إلزامي لضمان جودة وأمان المجتمع.',
                'نحن نطبق سياسة "صفر تسامح" مع المضايقات أو الألفاظ البذيئة.'
              ].map((p, i) => (
                <div key={i} className="flex gap-4">
                  <span className="w-8 h-8 rounded-full bg-emerald-100 text-[#1a3c34] flex items-center justify-center flex-shrink-0 font-black text-xs">{i + 1}</span>
                  <p>{p}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
