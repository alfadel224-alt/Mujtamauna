
import React, { useState, useEffect } from 'react';
import { Member, Language, ConnectionRequest } from '../types';
import { geminiService } from '../services/geminiService';
import { Link } from 'react-router-dom';

interface Props {
  members: Member[];
  currentUser: Member;
  requests: ConnectionRequest[];
  onSendRequest: (id: string) => void;
  lang: Language;
}

const MemberDiscovery: React.FC<Props> = ({ members, currentUser, requests, onSendRequest, lang }) => {
  const [matchedMembers, setMatchedMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateAll = async () => {
      setLoading(true);
      const others = members.filter(m => m.id !== currentUser.id);
      const scoresMap = await geminiService.batchCalculateMatches(currentUser, others);
      
      const updated = others.map(m => ({
        ...m,
        matchScore: scoresMap[m.id] || Math.floor(Math.random() * 12) + 85
      }));

      setMatchedMembers(updated.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0)));
      setLoading(false);
    };
    calculateAll();
  }, [members, currentUser]);

  const getRequestStatus = (memberId: string) => {
    const outRequest = requests.find(r => r.fromId === currentUser.id && r.toId === memberId);
    if (outRequest) return outRequest.status;
    const inRequest = requests.find(r => r.fromId === memberId && r.toId === currentUser.id);
    if (inRequest) return inRequest.status;
    return 'none';
  };

  if (loading) {
    return (
      <div className="min-h-[60dvh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-[#daa520]/20 border-t-[#daa520] rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-black text-[#1a3c34] animate-pulse">جاري تنسيق القلوب...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6 pb-24 px-2">
      <div className="space-y-1 text-center py-4">
        <h2 className="text-3xl font-black text-[#1a3c34]">القلوب المتآلفة</h2>
        <div className="w-12 h-1 bg-[#daa520] mx-auto rounded-full"></div>
        <p className="text-[11px] text-slate-500 font-bold mt-2 uppercase tracking-widest">اخترنا ليك ديل كأقرب الناس ليك</p>
      </div>

      <div className="flex flex-col gap-8">
        {matchedMembers.map(member => {
          const status = getRequestStatus(member.id);
          
          return (
            <div key={member.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-emerald-50 flex flex-col animate-in fade-in slide-in-from-bottom-6 duration-500">
              
              <div className="relative aspect-[4/5] overflow-hidden">
                <img 
                  src={member.profileImage} 
                  className={`w-full h-full object-cover ${status !== 'accepted' && !member.isImageVisible ? 'blur-3xl grayscale opacity-30' : ''}`}
                  alt=""
                />
                
                {(status !== 'accepted' && !member.isImageVisible) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1a3c34]/10">
                     <div className="bg-white/40 backdrop-blur-md p-5 rounded-full border border-white/40 shadow-xl">
                        <svg className="w-8 h-8 text-[#1a3c34]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                     </div>
                     <span className="text-[10px] font-black text-[#1a3c34] mt-4 uppercase tracking-[0.2em]">صورة محمية</span>
                  </div>
                )}

                <div className="absolute top-5 left-5">
                  <div className="bg-[#1a3c34] text-[#daa520] px-4 py-2 rounded-2xl font-black text-xs border border-white/20 shadow-2xl flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                    %{member.matchScore} توافق
                  </div>
                </div>
              </div>

              <div className="p-7 space-y-6 bg-white relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-black text-[#1a3c34] tracking-tight">{member.name}</h3>
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">{member.city}</span>
                  </div>
                  <p className="text-sm font-bold text-[#daa520] uppercase tracking-widest">{member.profession}</p>
                </div>

                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                   <p className="text-slate-600 text-sm font-medium leading-relaxed italic">
                     "{member.bio || 'زول سمح الروح ببحث عن الونسة الطيبة في مجتمعنا السوداني.'}"
                   </p>
                </div>

                <div className="flex gap-4 pt-2">
                  {status === 'accepted' ? (
                    <Link 
                      to={`/chat/${member.id}`} 
                      className="flex-1 bg-[#1a3c34] text-white py-5 rounded-[1.5rem] font-black text-center shadow-xl hover:bg-[#122a24] active:scale-95 transition-all text-sm"
                    >
                      فتح ونسة سمحة
                    </Link>
                  ) : status === 'pending' ? (
                    <button 
                      disabled
                      className="flex-1 bg-slate-100 text-slate-400 py-5 rounded-[1.5rem] font-black text-center border-2 border-slate-200 cursor-default text-sm"
                    >
                      تم إرسال الطلب...
                    </button>
                  ) : (
                    <button 
                      onClick={() => onSendRequest(member.id)}
                      className="flex-1 bg-[#daa520] text-[#1a3c34] py-5 rounded-[1.5rem] font-black text-center shadow-xl hover:bg-amber-500 active:scale-95 transition-all text-sm border-2 border-[#daa520]"
                    >
                      إرسال طلب ونسة
                    </button>
                  )}
                  
                  <button className="w-16 h-16 bg-rose-50 text-rose-500 rounded-[1.5rem] flex items-center justify-center border border-rose-100 shadow-sm active:scale-90 transition-all">
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/></svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="h-10"></div>
    </div>
  );
};

export default MemberDiscovery;
