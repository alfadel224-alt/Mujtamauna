import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Member, Language, StaffMember, SupportConfig, UserRole } from '../types';

interface Props {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  lang: Language;
}

const AdminPanel: React.FC<Props> = ({ members, setMembers, lang }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'members' | 'staff' | 'settings'>('members');
  
  const [staff, setStaff] = useState<StaffMember[]>([
    { id: 's1', name: 'محمد علي', email: 'm.ali@mujtamauna.sd', role: 'admin', status: 'active', lastActive: 'الآن' },
    { id: 's2', name: 'هبة عمر', email: 'heba@mujtamauna.sd', role: 'moderator', status: 'active', lastActive: 'قبل ساعة' },
    { id: 's3', name: 'ياسر خالد', email: 'yasser@mujtamauna.sd', role: 'support_agent', status: 'inactive', lastActive: 'أمس' },
  ]);

  const [supportConfig, setSupportConfig] = useState<SupportConfig>({
    phone: '+249 912 345 678',
    email: 'support@mujtamauna.sd',
    privacyPoints: [
      'يتم تشفير كافة البيانات الشخصية والمحادثات بتقنيات أمان متطورة.',
      'صور البروفايل تظل "مخفية" لجميع المستخدمين ولا يتم كشفها إلا بعد موافقة الطرفين.',
      'التحقق من الهوية هو إجراء إلزامي لضمان جدية المستخدمين.',
      'الإدارة تتدخل فوراً في حال وجود أي مضايقات أو مخالفات.'
    ]
  });

  const deleteMember = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا العضو نهائياً؟")) {
      setMembers(prev => prev.filter(m => m.id !== id));
    }
  };

  const verifyMember = (id: string) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, isVerified: true } : m));
  };

  const getRoleBadge = (role: UserRole) => {
    switch(role) {
      case 'admin': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'moderator': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'support_agent': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const roleLabels: Record<UserRole, string> = {
    admin: 'مدير نظام',
    moderator: 'مشرف محتوى',
    support_agent: 'دعم فني'
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex bg-white p-2 rounded-[2rem] shadow-sm border border-emerald-50 gap-2 max-w-fit overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('members')}
            className={`px-6 md:px-8 py-3 rounded-2xl font-black text-sm transition-all whitespace-nowrap ${activeTab === 'members' ? 'bg-[#1a3c34] text-white shadow-lg' : 'text-slate-400 hover:text-[#1a3c34]'}`}
          >
            الأعضاء
          </button>
          <button 
            onClick={() => setActiveTab('staff')}
            className={`px-6 md:px-8 py-3 rounded-2xl font-black text-sm transition-all whitespace-nowrap ${activeTab === 'staff' ? 'bg-[#1a3c34] text-white shadow-lg' : 'text-slate-400 hover:text-[#1a3c34]'}`}
          >
            فريق العمل
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-6 md:px-8 py-3 rounded-2xl font-black text-sm transition-all whitespace-nowrap ${activeTab === 'settings' ? 'bg-[#1a3c34] text-white shadow-lg' : 'text-slate-400 hover:text-[#1a3c34]'}`}
          >
            إعدادات الدعم
          </button>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-6 py-3 bg-[#daa520] text-[#1a3c34] rounded-2xl font-black text-xs shadow-lg hover:bg-amber-500 transition-all group"
        >
          <svg className="w-5 h-5 transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
          الرجوع لنبض المجتمع
        </button>
      </div>

      {activeTab === 'members' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-emerald-50">
              <span className="text-2xl mb-2 block">👥</span>
              <p className="text-xs font-black text-slate-400 uppercase">إجمالي الأعضاء</p>
              <h4 className="text-2xl font-black text-[#1a3c34]">{members.length}</h4>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-emerald-50">
              <span className="text-2xl mb-2 block">⏳</span>
              <p className="text-xs font-black text-slate-400 uppercase">بانتظار التحقق</p>
              <h4 className="text-2xl font-black text-[#1a3c34]">{members.filter(m => !m.isVerified).length}</h4>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-emerald-50">
              <span className="text-2xl mb-2 block">🚩</span>
              <p className="text-xs font-black text-slate-400 uppercase">بلاغات اليوم</p>
              <h4 className="text-2xl font-black text-[#1a3c34]">2</h4>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-emerald-50">
              <span className="text-2xl mb-2 block">📈</span>
              <p className="text-xs font-black text-slate-400 uppercase">نشط حالياً</p>
              <h4 className="text-2xl font-black text-[#1a3c34]">48</h4>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-6 md:p-10 shadow-xl border border-emerald-100">
            <h2 className="text-2xl font-black text-[#1a3c34] mb-8">إدارة الأعضاء</h2>
            <div className="overflow-x-auto -mx-6 md:mx-0">
              <table className="w-full text-right min-w-[800px]">
                <thead>
                  <tr className="border-b-2 border-slate-50 text-slate-400 font-black uppercase text-[10px] tracking-widest">
                    <th className="pb-4 pr-6">العضو</th>
                    <th className="pb-4">المهنة والموقع</th>
                    <th className="pb-4">الحالة</th>
                    <th className="pb-4 pl-6 text-left">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {members.map(member => (
                    <tr key={member.id} className="group hover:bg-emerald-50/30 transition-colors">
                      <td className="py-5 pr-6">
                        <div className="flex items-center gap-4">
                          <img src={member.profileImage || `https://ui-avatars.com/api/?name=${member.name}&background=1a3c34&color=fff`} className="w-10 h-10 rounded-xl object-cover shadow-sm" alt="" />
                          <div>
                            <p className="font-black text-slate-800 text-sm">{member.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 text-sm">
                        <p className="font-bold text-slate-700">{member.profession}</p>
                        <p className="text-[10px] text-emerald-600 font-black">{member.city}, {member.country}</p>
                      </td>
                      <td className="py-5">
                        <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black ${member.isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {member.isVerified ? '✓ موثق' : 'بانتظار التحقق'}
                        </span>
                      </td>
                      <td className="py-5 pl-6 text-left">
                        <div className="flex items-center justify-end gap-2">
                          {!member.isVerified && (
                            <button onClick={() => verifyMember(member.id)} className="p-2 bg-emerald-500 text-white rounded-lg hover:scale-105 transition-transform">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                              </svg>
                            </button>
                          )}
                          <button onClick={() => deleteMember(member.id)} className="p-2 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'staff' && (
        <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-emerald-100 animate-in fade-in duration-500">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-[#1a3c34]">إدارة فريق العمل</h2>
            <button className="bg-[#1a3c34] text-white px-6 py-3 rounded-2xl font-black text-sm shadow-lg hover:bg-[#122a24]">إضافة عضو فريق +</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b-2 border-slate-50 text-slate-400 font-black uppercase text-[10px] tracking-widest">
                  <th className="pb-4">الاسم</th>
                  <th className="pb-4">الدور</th>
                  <th className="pb-4">الحالة</th>
                  <th className="pb-4">آخر نشاط</th>
                  <th className="pb-4 pl-6 text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {staff.map(member => (
                  <tr key={member.id}>
                    <td className="py-5">
                      <p className="font-black text-slate-800 text-sm">{member.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{member.email}</p>
                    </td>
                    <td className="py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black border ${getRoleBadge(member.role)}`}>
                        {roleLabels[member.role]}
                      </span>
                    </td>
                    <td className="py-5">
                      <span className={`w-2 h-2 rounded-full inline-block mr-2 ${member.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                      <span className="text-xs font-bold">{member.status === 'active' ? 'نشط' : 'غير نشط'}</span>
                    </td>
                    <td className="py-5 text-xs font-bold text-slate-500">{member.lastActive}</td>
                    <td className="py-5 pl-6 text-left">
                       <button className="text-slate-400 hover:text-[#1a3c34] transition-colors">
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
                         </svg>
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-emerald-100 animate-in fade-in duration-500">
          <h2 className="text-2xl font-black text-[#1a3c34] mb-8">إعدادات الدعم والسياسات</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">هاتف الدعم المباشر</label>
                <input 
                  type="text" 
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-black text-[#1a3c34]" 
                  value={supportConfig.phone}
                  onChange={(e) => setSupportConfig({...supportConfig, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">بريد الدعم الإلكتروني</label>
                <input 
                  type="text" 
                  className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-black text-[#1a3c34]" 
                  value={supportConfig.email}
                  onChange={(e) => setSupportConfig({...supportConfig, email: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">نقاط سياسة الخصوصية</label>
              <div className="space-y-3">
                {supportConfig.privacyPoints.map((point, i) => (
                  <div key={i} className="flex gap-3">
                    <input 
                      type="text" 
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-[#1a3c34]" 
                      value={point}
                      onChange={(e) => {
                        const newPoints = [...supportConfig.privacyPoints];
                        newPoints[i] = e.target.value;
                        setSupportConfig({...supportConfig, privacyPoints: newPoints});
                      }}
                    />
                    <button className="text-rose-500 hover:scale-110 transition-transform">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button className="text-[#daa520] font-black text-xs hover:underline">+ إضافة نقطة جديدة</button>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-50 flex justify-end">
            <button className="bg-emerald-500 text-white px-10 py-4 rounded-2xl font-black shadow-lg hover:bg-emerald-600 transition-colors">حفظ التغييرات</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;