import React from 'react';
import { Language } from '../types';

interface Props {
  onStart: () => void;
  lang: Language;
}

const LandingPage: React.FC<Props> = ({ onStart, lang }) => {
  return (
    <div className="min-h-[100dvh] bg-[#fdfcf0] w-full relative font-['Tajawal'] flex flex-col overflow-hidden">
      {/* Hero Section - Fixed with controlled overflow */}
      <section className="relative flex-1 flex flex-col items-center justify-center p-6 overflow-hidden">
        
        {/* Background Layer - Contained */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* Decorative Circle 1 */}
          <div className="absolute top-[-5%] right-[-10%] w-[50%] md:w-[30%] aspect-square bg-[#daa520] opacity-[0.15] rounded-full blur-[60px] md:blur-[100px]"></div>
          
          {/* Decorative Circle 2 */}
          <div className="absolute bottom-[10%] left-[-15%] w-[60%] md:w-[40%] aspect-square bg-[#1a3c34] opacity-[0.08] rounded-full blur-[60px] md:blur-[120px]"></div>
          
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#1a3c34 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        </div>

        {/* Content Layer */}
        <div className="relative z-10 text-center space-y-8 animate-in fade-in zoom-in duration-700 max-w-lg mx-auto">
          {/* Animated Icon */}
          <div className="w-24 h-24 bg-[#1a3c34] rounded-[2.5rem] mx-auto flex items-center justify-center text-5xl shadow-[0_20px_50px_rgba(26,60,52,0.3)] transform -rotate-12 border-4 border-white transition-transform hover:rotate-0 duration-500">
            <span className="text-white drop-shadow-lg">م</span>
          </div>
          
          <div className="space-y-4 px-4">
            <h1 className="text-6xl md:text-8xl font-black text-[#1a3c34] tracking-tight">
              مجتمعنا<span className="text-[#daa520]">.</span>
            </h1>
            <p className="text-lg md:text-2xl text-[#1a3c34]/80 font-bold leading-relaxed">
              ونسة سمحة، قلوب متآلفة، <br/> وبيئة سودانية أصيلة وآمنة تماماً.
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-6 pt-4 px-4">
            <button 
              onClick={onStart}
              className="px-12 py-5 bg-[#1a3c34] text-white rounded-full text-xl font-black shadow-[0_15px_40px_rgba(26,60,52,0.4)] hover:scale-105 active:scale-95 transition-all w-full max-w-xs"
            >
              ابدأ رحلتك الآن 🇸🇩
            </button>
            
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
              <p className="text-[10px] text-[#1a3c34]/50 font-black uppercase tracking-[0.2em]">
                أكثر من 1,500 زول وزولة بانتظارك
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Cards - Mobile Optimized */}
      <section className="bg-white/80 backdrop-blur-md rounded-t-[3rem] px-6 py-12 space-y-6 shadow-[0_-20px_50px_rgba(0,0,0,0.03)] border-t border-white relative z-20">
        <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
          {[
            { title: 'خصوصية تامة', desc: 'صورك محمية ولا تظهر إلا بموافقتك الصريحة.', icon: '🛡️', color: 'bg-emerald-50 text-emerald-600' },
            { title: 'أمان عالي', desc: 'لا مكان للحسابات الوهمية، كل عضو موثق.', icon: '✅', color: 'bg-amber-50 text-amber-600' },
            { title: 'روح سودانية', desc: 'تطبيق مصمم خصيصاً ليعكس ذوقنا وقيمنا.', icon: '🇸🇩', color: 'bg-indigo-50 text-indigo-600' }
          ].map((v, i) => (
            <div key={i} className="flex items-center gap-5 p-5 bg-[#fdfcf7] rounded-3xl border border-emerald-50 hover:shadow-lg transition-all">
              <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${v.color}`}>
                {v.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-black text-[#1a3c34] text-sm mb-0.5">{v.title}</h3>
                <p className="text-[11px] text-slate-500 font-bold leading-snug">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-6 text-center">
           <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest">© 2024 مجتمعنا - كل الحقوق محفوظة</p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;