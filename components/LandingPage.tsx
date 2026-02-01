import React from 'react';
import { Language } from '../types';

interface Props {
  onStart: () => void;
  lang: Language;
}

const LandingPage: React.FC<Props> = ({ onStart, lang }) => {
  return (
    <div className="min-h-[100dvh] bg-[#fdfcf0] w-full relative font-['Tajawal'] flex flex-col overflow-hidden">
      {/* Hero Section - Fixed background blobs */}
      <section className="relative flex-1 flex flex-col items-center justify-center p-6 overflow-hidden">
        
        {/* Decorative Background Layer - Strictly contained */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          {/* Top Right Blob */}
          <div className="absolute top-[-10%] right-[-10%] w-[50%] aspect-square bg-[#daa520] opacity-[0.1] rounded-full blur-[60px] md:blur-[100px]"></div>
          
          {/* Bottom Left Blob */}
          <div className="absolute bottom-[5%] left-[-15%] w-[60%] aspect-square bg-[#1a3c34] opacity-[0.05] rounded-full blur-[70px] md:blur-[120px]"></div>
          
          {/* Pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#1a3c34 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        </div>

        {/* Content Layer */}
        <div className="relative z-10 text-center space-y-8 animate-in fade-in zoom-in duration-700 max-w-sm mx-auto">
          {/* Logo Icon */}
          <div className="w-20 h-20 md:w-24 md:h-24 bg-[#1a3c34] rounded-[2rem] md:rounded-[2.5rem] mx-auto flex items-center justify-center text-4xl md:text-5xl font-black shadow-2xl transform -rotate-12 border-4 border-white">
            <span className="text-white">م</span>
          </div>
          
          <div className="space-y-4 px-2">
            <h1 className="text-5xl md:text-7xl font-black text-[#1a3c34]">
              مجتمعنا<span className="text-[#daa520]">.</span>
            </h1>
            <p className="text-base md:text-xl text-[#1a3c34]/80 font-bold leading-relaxed">
              ونسة سمحة، قلوب متآلفة، <br/> وبيئة سودانية أصيلة وآمنة.
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-6 pt-4">
            <button 
              onClick={onStart}
              className="px-10 py-5 bg-[#1a3c34] text-white rounded-full text-xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all w-full"
            >
              ابدأ الآن 🇸🇩
            </button>
            
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <p className="text-[10px] text-[#1a3c34]/40 font-black uppercase tracking-widest">
                أكثر من 1,500 زول وزولة بانتظارك
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Cards Section */}
      <section className="bg-white rounded-t-[3rem] px-6 py-10 shadow-[0_-10px_40px_rgba(0,0,0,0.02)] border-t border-white relative z-10">
        <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
          {[
            { title: 'خصوصية تامة', desc: 'صورك محمية ولا تظهر إلا بموافقتك.', icon: '🛡️', color: 'bg-emerald-50 text-emerald-600' },
            { title: 'أمان عالي', desc: 'لا مكان للحسابات الوهمية، الكل موثق.', icon: '✅', color: 'bg-amber-50 text-amber-700' },
            { title: 'روح سودانية', desc: 'تطبيق مصمم خصيصاً لذوقنا وقيمنا.', icon: '🇸🇩', color: 'bg-indigo-50 text-indigo-600' }
          ].map((v, i) => (
            <div key={i} className="flex items-center gap-4 p-5 bg-[#fdfcf7] rounded-[2rem] border border-emerald-50">
              <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center text-2xl ${v.color}`}>
                {v.icon}
              </div>
              <div>
                <h3 className="font-black text-[#1a3c34] text-xs">{v.title}</h3>
                <p className="text-[10px] text-slate-500 font-bold leading-tight">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-[9px] text-slate-300 font-black uppercase tracking-widest">© 2024 مجتمعنا - الخصوصية أولاً</p>
      </section>
    </div>
  );
};

export default LandingPage;