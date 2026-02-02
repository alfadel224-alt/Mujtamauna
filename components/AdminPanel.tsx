import React, { useState, useEffect } from 'react';
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
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  
  // تحميل الموظفين من التخزين المحلي أو استخدام الافتراضيين
  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem('mujtamauna_staff');
    return saved ? JSON.parse(saved) : [
      { id: 's1', name: 'محمد علي', email: 'm.ali@mujtamauna.sd', role: 'admin', status: 'active', lastActive: 'الآن' },
      { id: 's2', name: 'هبة عمر', email: 'heba@mujtamauna.sd', role: 'moderator', status: 'active', lastActive: 'قبل ساعة' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('mujtamauna_staff', JSON.stringify(staff));
  }, [staff]);

  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    role: 'moderator' as UserRole
  });

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email) return;

    const staffMember: StaffMember = {
      id: 's' + Math.random().toString(36).substr(2, 9),
      name: newStaff.name,
      email: newStaff.email,
      role: newStaff.role,
      status: 'active',
      lastActive: 'الآن'
    };

    setStaff(prev => [staffMember, ...prev]);
    setShowAddStaffModal(false);
    setNewStaff({ name: '', email: '', role: 'moderator' });
    alert('تم إضافة الموظف بنجاح 🇸🇩');
  };

  const deleteStaff = (id: string) => {
    if (confirm("هل تريد إزالة هذا الموظف من فريق العمل؟")) {
      setStaff(prev => prev.filter(s => s.id !== id));
    }
  };

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-2 md:px-0">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex bg-white p-2 rounded-[2rem] shadow-sm border border-emerald-50 gap-2 max-w-fit overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('members')}
            className={`px-6 md:px-8 py-3 rounded-2xl font-black text-sm transition-all whitespace-nowrap ${activeTab === 'members' ? 'bg-[#1a3c34] text-white shadow-lg' : 'text-slate-400 hover:text-[#1a3c34]'}`}
          >
            الأعضاء ({members.length})
          </button>
          <button 
            onClick={() => setActiveTab('staff')}
            className={`px-6 md:px-8 py-3 rounded-2xl font-black text-sm transition-all whitespace-nowrap ${activeTab === 'staff' ? 'bg-[#1a3c34] text-white shadow-lg' : 'text-slate-400 hover:text-[#1a3c34]'}`}
          >
            فريق العمل ({staff.length})
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-6 md:px-8 py-3 rounded-2xl font-black text-sm transition-all whitespace-nowrap ${activeTab === 'settings' ? 'bg-[#1a3c34] text-white shadow-lg' : 'text-slate-400 hover:text-[#1a3c34]'}`}
          >
            الإعدادات
          </button>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-6 py-3 bg-[#daa520] text-[#1a3c34] rounded-2xl font-black text-xs shadow-lg hover:bg-amber-500 transition-all group"
        >
          <svg className="w-5 h-5 transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
          الرجوع للمنصة
        </button>
      </div>

      {activeTab === 'members' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-emerald-50">
              <span className="text-2xl mb-2 block">👥</span>
              <p className="text-[10px] font-black text-slate-400 uppercase">إجمالي الأعضاء</p>
              <h4 className="text-xl font-black text-[#1a3c34]">{members.length}</h4>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-emerald-50">
              <span className="text-2xl mb-2 block">⏳</span>
              <p className="text-[10px] font-black text-slate-400 uppercase">بانتظار التحقق</p>
              <h4 className="text-xl font-black text-[#1a3c34]">{members.filter(m => !m.isVerified).length}</h4>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-6 shadow-xl border border-emerald-100">
            <h2 className="text-xl font-black text-[#1a3c34] mb-6">إدارة الأعضاء</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-right min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-50 text-slate-400 font-black text-[10px] uppercase">
                    <th className="pb-4">العضو</th>
                    <th className="pb-4">الموقع</th>
                    <th className="pb-4">الحالة</th>
                    <th className="pb-4 pl-6 text-left">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {members.map(member => (
                    <tr key={member.id} className="group hover:bg-emerald-50/30 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <img src={member.profileImage || `https://ui-avatars.com/api/?name=${member.name}&background=1a3c34&color=fff`} className="w-9 h-9 rounded-xl object-cover" alt="" />
                          <div>
                            <p className="font-black text-slate-800 text-sm">{member.name}</p>
                            <p className="text-[9px] text-slate-400 font-bold">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-xs font-bold text-slate-700">{member.city}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-lg text-[9px] font-black ${member.isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {member.isVerified ? '✓ موثق' : 'غير موثق'}
                        </span>
                      </td>
                      <td className="py-4 pl-6 text-left">
                        <div className="flex items-center justify-end gap-2">
                          {!member.isVerified && (
                            <button onClick={() => verifyMember(member.id)} className="p-2 bg-emerald-500 text-white rounded-lg hover:scale-105">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                            </button>
                          )}
                          <button onClick={() => deleteMember(member.id)} className="p-2 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
        <div className="bg-white rounded-[3rem] p-6 shadow-xl border border-emerald-100 animate-in fade-in duration-500">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black text-[#1a3c34]">فريق عمل مجتمعنا</h2>
            <button 
              onClick={() => setShowAddStaffModal(true)}
              className="bg-[#1a3c34] text-[#daa520] px-6 py-3 rounded-2xl font-black text-xs shadow-lg hover:bg-[#122a24] active:scale-95 transition-all"
            >
              إضافة موظف جديد +
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-slate-50 text-slate-400 font-black text-[10px] uppercase">
                  <th className="pb-4">الاسم والبريد</th>
                  <th className="pb-4">الدور الوظيفي</th>
                  <th className="pb-4">الحالة</th>
                  <th className="pb-4 pl-6 text-left">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {staff.map(member => (
                  <tr key={member.id}>
                    <td className="py-4">
                      <p className="font-black text-slate-800 text-sm">{member.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{member.email}</p>
                    </td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black border ${getRoleBadge(member.role)}`}>
                        {roleLabels[member.role]}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] font-black text-slate-600">نشط</span>
                      </div>
                    </td>
                    <td className="py-4 pl-6 text-left">
                       <button 
                        onClick={() => deleteStaff(member.id)}
                        className="text-rose-500 p-2 hover:bg-rose-50 rounded-xl transition-colors"
                       >
                         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAddStaffModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1a3c34]/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-[#1a3c34]">إضافة عضو للفريق</h3>
              <button onClick={() => setShowAddStaffModal(false)} className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            
            <form onSubmit={handleAddStaff} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الاسم الكامل</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#daa520] font-bold"
                  value={newStaff.name}
                  onChange={e => setNewStaff({...newStaff, name: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">البريد الإلكتروني</label>
                <input 
                  required
                  type="email" 
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#daa520] font-bold"
                  value={newStaff.email}
                  onChange={e => setNewStaff({...newStaff, email: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الدور الوظيفي</label>
                <select 
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none font-bold"
                  value={newStaff.role}
                  onChange={e => setNewStaff({...newStaff, role: e.target.value as UserRole})}
                >
                  <option value="moderator">مشرف محتوى</option>
                  <option value="support_agent">دعم فني</option>
                  <option value="admin">مدير نظام</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-[#1a3c34] text-[#daa520] py-4 rounded-2xl font-black shadow-xl hover:bg-[#122a24] transition-all transform active:scale-95">
                تثبيت الموظف في النظام
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-emerald-100 animate-in fade-in duration-500">
          <h2 className="text-xl font-black text-[#1a3c34] mb-8">إعدادات النظام العامة</h2>
          <p className="text-slate-400 text-sm font-bold">يمكنك هنا تخصيص إعدادات التواصل وسياسات المجتمع (قريباً).</p>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;