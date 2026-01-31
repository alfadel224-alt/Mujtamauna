
import React, { useState } from 'react';
import { Member, Language } from '../types';
import { geminiService } from '../services/geminiService';

interface Props {
  user: Member;
  lang: Language;
  onEdit: () => void;
  onUpdateUser?: (user: Member) => void;
}

const ProfilePage: React.FC<Props> = ({ user, lang, onEdit, onUpdateUser }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const prompt = `A professional ${user.gender === 'male' ? 'man' : 'woman'} from Sudan, ${user.profession}, with ${user.interests.join(', ')} elements.`;
      const newAvatar = await geminiService.generateAvatar(prompt);
      if (newAvatar && onUpdateUser) {
        onUpdateUser({ ...user, profileImage: newAvatar });
      }
    } catch (e: any) {
      if (e.message === "KEY_RESET_REQUIRED" && window.aistudio) {
        alert("انتهت صلاحية الجلسة، يرجى اختيار مفتاح الـ API مرة أخرى.");
        await window.aistudio.openSelectKey();
      } else {
        alert("عذراً، تحتاج لربط مفتاح API خاص لتفعيل ميزة توليد الصور. اذهب لصفحة الدعم.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700 pb-24">
      {/* Header Profile Card */}
      <div className="bg-[#1a3c34] rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#daa520]/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        
        <div className="flex flex-col items-center text-center space-y-6 relative z-10">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] border-4 border-[#daa520] p-1 shadow-2xl transform rotate-3 overflow-hidden bg-emerald-900">
               <img src={user.profileImage} className="w-full h-full object-cover rounded-[2rem]" alt="" />
               {isGenerating && (
                 <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
                    <div className="w-8 h-8 border-4 border-t-transparent border-[#daa520] rounded-full animate-spin"></div>
                    <span className="text-[8px] mt-2 font-black">جاري التخيل...</span>
                 </div>
               )}
            </div>
            {user.isVerified && (
              <div className="absolute -bottom-2 -left-2 bg-emerald-500 text-white p-2 rounded-xl border-4 border-[#1a3c34] shadow-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <h2 className="text-3xl font-black">{user.name}</h2>
            <p className="text-[#daa520] font-black text-sm uppercase tracking-widest">{user.profession}</p>
          </div>

          <button 
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="bg-gradient-to-r from-amber-400 to-[#daa520] text-[#1a3c34] px-6 py-2.5 rounded-2xl font-black text-xs shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
          >
            {isGenerating ? 'جاري التوليد...' : '✨ توليد صورة رمزية بالذكاء الاصطناعي'}
          </button>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-8">
           <div className="text-center">
              <p className="text-[10px] text-emerald-200 font-black uppercase tracking-widest">المدينة</p>
              <p className="font-bold">{user.city}</p>
           </div>
           <div className="text-center">
              <p className="text-[10px] text-emerald-200 font-black uppercase tracking-widest">العمر</p>
              <p className="font-bold">
                 {user.birthDate ? new Date().getFullYear() - new Date(user.birthDate).getFullYear() : '??'} سنة
              </p>
           </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-emerald-50 space-y-4">
        <h3 className="text-xl font-black text-[#1a3c34] flex items-center gap-2">
          <span>📝</span> نبذة عني
        </h3>
        <p className="text-slate-600 font-medium leading-relaxed italic">
          "{user.bio || 'لم يتم إضافة نبذة بعد.'}"
        </p>
      </div>

      {/* Interests Section */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-emerald-50 space-y-4">
        <h3 className="text-xl font-black text-[#1a3c34] flex items-center gap-2">
          <span>🌟</span> الاهتمامات
        </h3>
        <div className="flex flex-wrap gap-3">
          {user.interests && user.interests.length > 0 ? (
            user.interests.map((interest, i) => (
              <span key={i} className="px-5 py-2.5 bg-emerald-50 text-[#1a3c34] rounded-2xl text-xs font-black border border-emerald-100 shadow-sm">
                {interest}
              </span>
            ))
          ) : (
            <p className="text-slate-400 text-xs font-bold">لا يوجد اهتمامات مضافة.</p>
          )}
        </div>
      </div>

      <button 
        onClick={onEdit}
        className="w-full py-5 bg-[#1a3c34] text-[#daa520] border-2 border-[#daa520]/20 rounded-[2rem] font-black text-sm hover:bg-[#122a24] transition-all shadow-xl active:scale-[0.98]"
      >
        تعديل بيانات البروفايل
      </button>

      <div className="h-10"></div>
    </div>
  );
};

export default ProfilePage;
