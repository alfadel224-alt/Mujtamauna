
import React from 'react';
import { Language } from '../types';

interface Props {
  onStart: () => void;
  lang: Language;
}

const LandingPage: React.FC<Props> = ({ onStart, lang }) => {
  return (
    <div className="min-h-screen bg-[#fdfcf0] overflow-x-hidden w-full selection:bg-[#daa520] selection:text-[#1a3c34]">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center p-4 md:p-12 overflow-hidden w-full">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1547149666-769b42002e20?q=80&w=1200&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-10 grayscale"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#fdfcf0]/10 via-[#fdfcf0]/90 to-[#fdfcf0]"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl space-y-8 md:space-y-12 animate-in fade-in zoom-in duration-1000 px-4">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-[#1a3c34] rounded-[2rem] mx-auto flex items-center justify-center text-4xl md:text-5xl shadow-2xl transform -rotate-12 border-4 border-white shrink-0">م</div>
          <h1 className="text-5xl md:text-8xl font-black text-[#1a3c34] tracking-tight leading-none">
            مجتمعنا <span className="text-[#daa520]">.</span>
          </h1>
          <p className="text-lg md:text-2xl text-[#1a3c34]/80 font-bold max-w-2xl mx-auto leading-relaxed">
            المنصة السودانية الأولى للتعارف الجاد، التي تجمع بين <span className="text-[#daa520]">القيم السودانية الأصيلة</span> وأحدث تقنيات الخصوصية.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-6 pt-6">
            <button 
              onClick={onStart}
              className="px-10 py-5 bg-[#1a3c34] text-white rounded-full text-xl md:text-2xl font-black shadow-2xl hover:bg-[#122a24] hover:scale-105 active:scale-95 transition-all w-full md:w-auto"
            >
              ابدأ رحلتك الآن 🇸🇩
            </button>
            <div className="flex items-center gap-3 text-[#1a3c34]/60 font-black text-[10px] md:text-xs uppercase tracking-widest">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              +1,500 زول وزولة انضموا إلينا
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 px-4 max-w-7xl mx-auto w-full overflow-hidden">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-black text-[#1a3c34]">قيمنا السودانية الراسخة</h2>
          <div className="w-16 h-1.5 bg-[#daa520] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {[
            { 
              title: 'الخصوصية الكاملة', 
              desc: 'نظام حماية للصور لا يظهر هويتك إلا لمن تختار وبعد قبولك الصريح.', 
              icon: '🛡️',
              color: 'bg-emerald-50'
            },
            { 
              title: 'التحقق الصارم', 
              desc: 'نحن لا نسمح بالحسابات الوهمية. كل عضو يمر بعملية تحقق إجبارية بالصورة.', 
              icon: '✅',
              color: 'bg-amber-50'
            },
            { 
              title: 'الهوية السودانية', 
              desc: 'صمم التطبيق ليعكس ذوقنا وثقافتنا ولهجتنا السودانية السمحة في كل ركن.', 
              icon: '🇸🇩',
              color: 'bg-indigo-50'
            }
          ].map((val, i) => (
            <div key={i} className={`${val.color} p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border-2 border-transparent hover:border-white hover:shadow-xl transition-all group w-full`}>
              <span className="text-4xl md:text-5xl mb-6 block transform group-hover:scale-110 transition-transform">{val.icon}</span>
              <h3 className="text-xl md:text-2xl font-black text-[#1a3c34] mb-3">{val.title}</h3>
              <p className="text-sm md:text-base text-slate-600 font-bold leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Refined Scenery Section - Fixed Layout Bleed */}
      <section className="py-12 md:py-20 w-full px-4 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="aspect-[3/4] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-xl transform hover:scale-[1.02] transition-transform">
             <img src="https://images.unsplash.com/photo-1547149666-769b42002e20?w=600&auto=format" className="w-full h-full object-cover" alt="" />
          </div>
          <div className="aspect-[3/4] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-xl md:mt-12 transform hover:scale-[1.02] transition-transform">
             <img src="https://images.unsplash.com/photo-1596701062351-be3499416071?w=600&auto=format" className="w-full h-full object-cover" alt="" />
          </div>
          <div className="aspect-[3/4] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-xl transform hover:scale-[1.02] transition-transform">
             <img src="https://images.unsplash.com/photo-1563206767-5b18f218e0de?w=600&auto=format" className="w-full h-full object-cover" alt="" />
          </div>
          <div className="aspect-[3/4] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-xl md:mt-8 transform hover:scale-[1.02] transition-transform">
             <img src="https://images.unsplash.com/photo-1593642634367-d91a135587b5?w=600&auto=format" className="w-full h-full object-cover" alt="" />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <footer className="py-20 md:py-32 text-center bg-[#1a3c34] text-white rounded-t-[4rem] md:rounded-t-[6rem] px-4 w-full">
        <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">هل أنت مستعد للانضمام <br className="md:hidden"/> لمجتمعنا؟</h2>
        <button 
          onClick={onStart}
          className="bg-[#daa520] text-[#1a3c34] px-10 py-5 md:px-16 md:py-6 rounded-full text-xl md:text-2xl font-black shadow-2xl hover:scale-105 active:scale-95 transition-all"
        >
          سجل هسة - مجاناً
        </button>
        <p className="mt-10 text-emerald-100/50 text-[10px] md:text-xs font-black uppercase tracking-widest">يجب أن يكون عمرك 18 عاماً فأكثر • سياسة خصوصية صارمة</p>
      </footer>
    </div>
  );
};

export default LandingPage;
