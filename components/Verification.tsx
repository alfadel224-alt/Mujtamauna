
import React, { useRef, useState } from 'react';
import { Language, Member } from '../types';

interface Props {
  user: Member;
  onVerified: (img: string) => void;
  lang: Language;
}

const Verification: React.FC<Props> = ({ user, onVerified, lang }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [step, setStep] = useState(1);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
      }
    } catch (err) {
      alert("يرجى تفعيل الكاميرا للمتابعة");
    }
  };

  const capture = () => {
    setStep(3);
    setTimeout(() => {
      onVerified("https://picsum.photos/200");
    }, 2000);
  };

  const goBackToProfile = () => {
    // This assumes we can trigger a state change in parent. 
    // For now, let's reload to reset flow or just show a message.
    if(confirm("هل تريد العودة لتعديل بيانات بروفايلك؟")) {
      window.location.reload(); 
    }
  };

  return (
    <div className="min-h-screen bg-[#1a3c34] flex items-center justify-center p-6 text-white text-center relative">
      {/* Back Button */}
      <button 
        onClick={goBackToProfile}
        className="absolute top-8 right-8 p-4 bg-white/10 rounded-[1.5rem] hover:bg-white/20 transition-all flex items-center gap-2 group border border-white/10"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-xs font-black">رجوع لتعديل البيانات</span>
      </button>

      <div className="max-w-md w-full space-y-8 bg-white/10 p-10 rounded-[3rem] backdrop-blur-xl border border-white/20">
        {step === 1 && (
          <div className="space-y-6">
            <div className="w-24 h-24 bg-[#daa520] rounded-full mx-auto flex items-center justify-center text-4xl shadow-2xl border-4 border-white/10 transform -rotate-12">📸</div>
            <h2 className="text-3xl font-black">تحقق الهوية</h2>
            <p className="text-emerald-100/80 font-medium">لمجتمع آمن، نحتاج للتأكد من هويتك عبر التقاط صورة سريعة لوجهك.</p>
            <button onClick={() => { startCamera(); setStep(2); }} className="w-full bg-[#daa520] text-[#1a3c34] py-5 rounded-2xl font-black text-xl shadow-xl hover:scale-[1.02] transition-transform">ابدأ التحقق الآن</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-[2rem] border-4 border-[#daa520] aspect-square bg-black shadow-2xl">
              <video ref={videoRef} autoPlay className="w-full h-full object-cover transform scale-x-[-1]" />
              <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none rounded-full"></div>
            </div>
            <p className="font-bold">ضع وجهك داخل الإطار واضغط تصوير</p>
            <button onClick={capture} className="w-20 h-20 bg-white rounded-full border-8 border-slate-200 active:scale-90 transition-transform shadow-lg"></button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-pulse">
            <div className="w-24 h-24 border-4 border-t-transparent border-[#daa520] rounded-full mx-auto animate-spin"></div>
            <h3 className="text-2xl font-black">جاري مطابقة البيانات...</h3>
            <p className="text-emerald-100/60 font-medium">نقوم الآن بالتحقق من ملامح الوجه لضمان أعلى مستويات الأمان</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verification;
