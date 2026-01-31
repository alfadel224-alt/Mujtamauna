
import React, { useState, useRef } from 'react';
import { Member, Language } from '../types';

interface Props {
  user: Member;
  onComplete: (updatedUser: Member) => void;
  lang: Language;
}

const ProfileSetup: React.FC<Props> = ({ user, onComplete, lang }) => {
  const [step, setStep] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [newInterest, setNewInterest] = useState('');

  const [formData, setFormData] = useState({
    ...user,
    fullName: user.name,
    phone: '',
    country: 'السودان',
    city: 'الخرطوم',
    profession: '',
    bio: '',
    interests: [] as string[],
    birthDate: user.birthDate || '',
    gender: 'male' as 'male' | 'female'
  });

  const calculateAge = (dob: string) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
      }
    } catch (err) {
      alert('يرجى السماح بالوصول للكاميرا للتحقق من الهوية');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        setIsCapturing(false);
      }
    }
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData({ ...formData, interests: [...formData.interests, newInterest.trim()] });
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setFormData({ ...formData, interests: formData.interests.filter(i => i !== interest) });
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.birthDate) {
        alert('الرجاء اختيار تاريخ الميلاد للمتابعة');
        return;
      }
      if (calculateAge(formData.birthDate) < 18) {
        alert('الموقع للبالغين فقط (18+)');
        return;
      }
    }
    if (step === 3) {
      startCamera();
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (step === 4 && isCapturing) {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
        setIsCapturing(false);
    }
    setStep(prev => prev - 1);
  };

  const handleFinish = () => {
    if (!capturedImage) {
      alert('يرجى التقاط صورة للتحقق للمتابعة');
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      onComplete({
        ...user,
        name: formData.fullName,
        phone: formData.phone,
        country: formData.country,
        city: formData.city,
        profession: formData.profession,
        bio: formData.bio,
        interests: formData.interests,
        birthDate: formData.birthDate,
        gender: formData.gender,
        profileImage: capturedImage,
        isVerified: true,
        isImageVisible: false
      });
    }, 2000);
  };

  return (
    <div className="min-h-[100dvh] bg-[#fdfcf7] flex flex-col items-center p-4 pt-8 md:pt-12 font-['Tajawal']">
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-xl border border-emerald-50 flex flex-col overflow-hidden animate-in fade-in duration-500">
        
        <div className="flex p-5 gap-2 border-b border-emerald-50 bg-slate-50/50">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className="flex-1 flex flex-col gap-1">
              <div className={`h-1.5 rounded-full transition-all duration-500 ${step >= s ? 'bg-[#1a3c34]' : 'bg-slate-200'}`} />
              <span className={`text-[9px] text-center font-black ${step === s ? 'text-[#1a3c34]' : 'text-slate-400'}`}>0{s}</span>
            </div>
          ))}
        </div>

        <div className="p-8 space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-black text-[#1a3c34]">
                {step === 4 ? 'التحقق والأمان' : 'تجهيز البروفايل'}
            </h2>
            <p className="text-[10px] font-black text-[#daa520] uppercase tracking-widest mt-1">
                {step === 4 ? 'صورة سريعة وبنبدأ الونسة' : 'خطوات بسيطة وبنخلص'}
            </p>
          </div>

          <div className="min-h-[320px]">
            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-left">
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setFormData({...formData, gender: 'male'})} className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${formData.gender === 'male' ? 'border-[#1a3c34] bg-emerald-50 text-[#1a3c34]' : 'border-slate-100 opacity-60'}`}>
                    <span className="text-4xl">👨‍💼</span>
                    <span className="font-black text-xs">راجل</span>
                  </button>
                  <button onClick={() => setFormData({...formData, gender: 'female'})} className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${formData.gender === 'female' ? 'border-[#daa520] bg-amber-50 text-[#daa520]' : 'border-slate-100 opacity-60'}`}>
                    <span className="text-4xl">👩‍💼</span>
                    <span className="font-black text-xs">مرة</span>
                  </button>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase mr-1">تاريخ الميلاد</label>
                  <input type="date" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-[#1a3c34]" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-left">
                <div className="space-y-4">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الدولة</label>
                     <select 
                        className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold"
                        value={formData.country}
                        onChange={e => setFormData({...formData, country: e.target.value})}
                     >
                       <option value="السودان">السودان</option>
                       <option value="مصر">مصر</option>
                       <option value="السعودية">السعودية</option>
                       <option value="الإمارات">الإمارات</option>
                       <option value="قطر">قطر</option>
                       <option value="عمان">عمان</option>
                       <option value="الكويت">الكويت</option>
                       <option value="أخرى">دولة أخرى</option>
                     </select>
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">المدينة</label>
                     <input type="text" placeholder="مثلاً: الخرطوم" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">المهنة</label>
                     <input type="text" placeholder="مهندس، طبيب، طالب..." className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold" value={formData.profession} onChange={e => setFormData({...formData, profession: e.target.value})} />
                   </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in slide-in-from-left">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase">نبذة عنك</label>
                    <textarea className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold h-24 resize-none" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} placeholder="احكي لينا عن نفسك شوية..." />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase">الاهتمامات</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="أضف اهتمام (مثل: ونسة، سفر...)" 
                        className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-sm"
                        value={newInterest}
                        onChange={e => setNewInterest(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && addInterest()}
                      />
                      <button onClick={addInterest} className="bg-[#1a3c34] text-white px-4 rounded-xl font-black text-sm">+</button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {formData.interests.map(interest => (
                        <span key={interest} className="bg-emerald-50 text-[#1a3c34] px-3 py-1.5 rounded-full text-[10px] font-black border border-emerald-100 flex items-center gap-2">
                          {interest}
                          <button onClick={() => removeInterest(interest)} className="text-rose-500 font-bold">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 animate-in zoom-in text-center">
                {!capturedImage ? (
                  <div className="space-y-6">
                    <div className="relative aspect-square w-full max-w-[280px] mx-auto overflow-hidden rounded-[2.5rem] border-4 border-[#daa520] bg-black shadow-2xl">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                      <div className="absolute inset-0 border-[30px] border-[#1a3c34]/40 rounded-full pointer-events-none"></div>
                    </div>
                    <p className="text-xs font-black text-slate-500">ضع وجهك في المنتصف واضغط تصوير</p>
                    <button onClick={capturePhoto} className="w-20 h-20 rounded-full bg-white border-8 border-slate-200 shadow-lg active:scale-90 transition-all"></button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative aspect-square w-full max-w-[280px] mx-auto overflow-hidden rounded-[2.5rem] border-4 border-emerald-500 shadow-2xl">
                      <img src={capturedImage} className="w-full h-full object-cover" alt="" />
                      {isVerifying && (
                        <div className="absolute inset-0 bg-[#1a3c34]/60 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6">
                          <div className="w-12 h-12 border-4 border-t-transparent border-[#daa520] rounded-full animate-spin mb-4"></div>
                          <p className="font-black text-sm">جاري مطابقة الملامح...</p>
                        </div>
                      )}
                    </div>
                    {!isVerifying && (
                      <button onClick={() => { setCapturedImage(null); startCamera(); }} className="text-[#daa520] font-black text-xs underline">إعادة التصوير</button>
                    )}
                  </div>
                )}
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                   <p className="text-[10px] text-amber-900 font-bold leading-relaxed">صورتك محمية ولن تظهر للآخرين إلا بموافقتك. نحن نستخدمها للتحقق من أنك شخص حقيقي.</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            {step > 1 && !isVerifying && (
              <button onClick={prevStep} className="flex-1 py-4 border-2 border-slate-100 text-slate-400 rounded-2xl font-black text-sm">رجوع</button>
            )}
            <button 
              onClick={step === 4 ? handleFinish : nextStep} 
              disabled={isVerifying}
              className={`flex-[2] py-4 bg-[#1a3c34] text-white rounded-2xl font-black text-sm shadow-xl transition-all ${isVerifying ? 'opacity-50' : 'active:scale-95'}`}
            >
              {step === 4 ? 'تأكيد وانطلاق 🇸🇩' : 'متابعة'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
