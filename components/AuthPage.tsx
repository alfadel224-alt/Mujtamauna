
import React, { useState } from 'react';
import { Member, Language } from '../types';

interface Props {
  onAuth: (user: Member) => void;
  lang: Language;
}

const AuthPage: React.FC<Props> = ({ onAuth, lang }) => {
  const [view, setView] = useState<'login' | 'signup' | 'forgot-password'>('login');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    birthDate: '',
  });

  const calculateAge = (dob: string) => {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (view === 'forgot-password') {
      // Mock forgot password flow
      setSuccess('تم إرسال رابط إعادة تعيين كلمة المرور لبريدك الإلكتروني. شيك البريد (والسبام برضه) وبترجع لـ "ديوانك" في أسرع وقت.');
      return;
    }

    // Handle Admin login via email check
    if (view === 'login' && formData.email.toLowerCase().includes('admin')) {
      onAuth({
        id: 'admin-1',
        name: 'مدير النظام',
        email: formData.email,
        phone: '0900000000',
        bio: 'إدارة مجتمعنا السوداني',
        city: 'الخرطوم',
        country: 'السودان',
        profession: 'إدارة الأنظمة',
        interests: ['تقنية', 'أمان'],
        gender: 'male',
        birthDate: '1990-01-01',
        isVerified: true,
        profileImage: '',
        isImageVisible: true,
        joinedAt: new Date().toISOString()
      });
      return;
    }

    if (view === 'signup') {
      const age = calculateAge(formData.birthDate);
      if (age < 18) {
        setError('المعذرة يا حبيبنا.. سياستنا الصارمة تمنع تسجيل من هم دون الـ 18 عاماً (القاصرين). ننتظرك بكل ود عندما تكمل السن القانوني!');
        return;
      }
    }

    onAuth({
      id: Math.random().toString(),
      name: formData.name || 'مستخدم جديد',
      email: formData.email,
      phone: '',
      bio: '',
      city: 'الخرطوم',
      country: 'السودان',
      profession: '',
      interests: [],
      gender: 'male',
      birthDate: formData.birthDate,
      isVerified: false,
      profileImage: '',
      isImageVisible: false,
      joinedAt: new Date().toISOString()
    });
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#fdfcf0]">
      <div className="hidden lg:flex flex-col items-center justify-center bg-[#1a3c34] p-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%23daa520' fill-rule='evenodd'/%3E%3C/svg%3E")`, backgroundSize: '40px' }}></div>
        <div className="relative z-10 text-center space-y-8 animate-in fade-in zoom-in duration-1000">
           <div className="w-32 h-32 bg-[#daa520] rounded-[3rem] mx-auto flex items-center justify-center text-6xl shadow-2xl transform rotate-12 border-4 border-white/20">م</div>
           <h1 className="text-7xl font-black tracking-tight drop-shadow-lg">مجتمعنا</h1>
           <p className="text-2xl font-medium text-emerald-100/90 max-w-md leading-relaxed">أول منصة تعارف سودانية ذكية.. آمنة، محترمة، وبتبحث ليك عن الناس الشبهك.</p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12 relative">
        <div className="w-full max-w-lg space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
          <div className="text-center">
            <h2 className="text-3xl font-black text-[#1a3c34] mb-2">
              {view === 'login' ? 'أهلاً بيك من جديد' : view === 'signup' ? 'افتح حسابك السوداني' : 'استعادة الحساب'}
            </h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
              {view === 'forgot-password' ? 'ما تشيل هم، بنرجعك لونسة أصحابك' : 'ادخل لعمق التواصل الحقيقي'}
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border-2 border-rose-100 p-6 rounded-3xl text-rose-700 font-bold flex items-start gap-4 animate-in slide-in-from-top duration-500 shadow-sm">
              <span className="text-2xl">⚠️</span>
              <p className="text-sm leading-relaxed">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border-2 border-emerald-100 p-6 rounded-3xl text-emerald-700 font-bold flex items-start gap-4 animate-in slide-in-from-top duration-500 shadow-sm">
              <span className="text-2xl">✅</span>
              <p className="text-sm leading-relaxed">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {view === 'signup' && (
               <div className="space-y-4">
                 <input 
                   required
                   type="text" 
                   placeholder="الاسم بالكامل" 
                   className="w-full px-6 py-4 bg-white border-2 border-emerald-50 rounded-2xl outline-none focus:border-[#daa520] transition-all font-bold text-base shadow-sm"
                   value={formData.name}
                   onChange={e => setFormData({...formData, name: e.target.value})}
                 />
                 <div className="bg-emerald-50/50 p-5 rounded-2xl border-2 border-dashed border-emerald-100 space-y-1">
                   <label className="block text-xs font-black text-[#1a3c34]">تاريخ الميلاد</label>
                   <input 
                     required
                     type="date" 
                     className="w-full bg-transparent outline-none font-black text-[#1a3c34] text-lg"
                     value={formData.birthDate}
                     onChange={e => setFormData({...formData, birthDate: e.target.value})}
                   />
                 </div>
               </div>
            )}
            
            <div className="space-y-4">
              <input 
                required
                type="email" 
                placeholder="البريد الإلكتروني" 
                className="w-full px-6 py-4 bg-white border-2 border-emerald-50 rounded-2xl outline-none focus:border-[#daa520] transition-all font-bold text-base shadow-sm"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
              
              {view !== 'forgot-password' && (
                <div className="space-y-2">
                  <input 
                    required
                    type="password" 
                    placeholder="كلمة المرور" 
                    className="w-full px-6 py-4 bg-white border-2 border-emerald-50 rounded-2xl outline-none focus:border-[#daa520] transition-all font-bold text-base shadow-sm"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                  {view === 'login' && (
                    <div className="text-left">
                      <button 
                        type="button"
                        onClick={() => { setView('forgot-password'); setError(''); setSuccess(''); }}
                        className="text-[11px] font-black text-slate-400 hover:text-[#daa520] transition-colors"
                      >
                        نسيت كلمة المرور؟
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <button 
              type="submit"
              className="w-full bg-[#1a3c34] text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-[#122a24] transition-all transform active:scale-[0.98]"
            >
              {view === 'login' ? 'تسجيل الدخول' : view === 'signup' ? 'إنشاء حساب جديد' : 'إعادة تعيين الآن'}
            </button>
          </form>

          <div className="flex flex-col gap-4 text-center">
            {view === 'forgot-password' ? (
              <button 
                onClick={() => { setView('login'); setError(''); setSuccess(''); }}
                className="w-full text-[#1a3c34] font-black text-xs hover:underline flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7"/></svg>
                رجوع لتسجيل الدخول
              </button>
            ) : (
              <button 
                onClick={() => { setView(view === 'login' ? 'signup' : 'login'); setError(''); setSuccess(''); }}
                className="w-full text-[#1a3c34] font-black text-xs hover:underline"
              >
                {view === 'login' ? 'ما عندك حساب؟ انضم لأسرتنا السودانية' : 'عندك حساب أصلاً؟ ادخل من هنا'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
