import React, { useState, useEffect } from 'react';
import { Member, Language, ConnectionRequest, WallPost } from '../types';
import { Link } from 'react-router-dom';
import { geminiService } from '../services/geminiService';

interface DashboardProps {
  members: Member[];
  requests: ConnectionRequest[];
  currentUser: Member;
  onUpdateStatus: (id: string, status: 'accepted' | 'rejected') => void;
  lang: Language;
  notify?: (msg: string, type?: 'success' | 'error') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ members, requests, currentUser, onUpdateStatus, lang, notify }) => {
  const [wallPosts, setWallPosts] = useState<WallPost[]>([]);
  const [newPostText, setNewPostText] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [onlineCount, setOnlineCount] = useState(48);
  
  const recommendedMembers = members.filter(m => m.id !== currentUser.id).slice(0, 6);

  useEffect(() => {
    const timer = setInterval(() => {
      setOnlineCount(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 5000);

    const initialPosts: WallPost[] = [
      { id: 'p1', authorId: '1', authorName: 'أحمد الطيب', authorImage: 'https://i.pravatar.cc/150?u=1', content: 'يا جماعة جمعة مباركة عليكم جميعاً.. أبشروا بالخير 🇸🇩', timestamp: 'منذ ساعة', likes: 24 },
      { id: 'p2', authorId: '2', authorName: 'سارة محمد', authorImage: 'https://i.pravatar.cc/150?u=2', content: 'سؤال للناس الخبرة: أحسن مكان للقهوة في أم درمان وين؟ ☕', timestamp: 'منذ ساعتين', likes: 15 }
    ];
    setWallPosts(initialPosts);

    return () => clearInterval(timer);
  }, []);

  const handleCreatePost = async () => {
    if (!newPostText.trim() || isPosting) return;
    setIsPosting(true);
    try {
      const sanitized = await geminiService.filterProfanity(newPostText);
      const post: WallPost = {
        id: Math.random().toString(),
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorImage: currentUser.profileImage,
        content: sanitized,
        timestamp: 'الآن',
        likes: 0
      };
      setWallPosts([post, ...wallPosts]);
      setNewPostText('');
      if (notify) notify('تم النشر بنجاح ✨');
    } catch (err) {
      if (notify) notify('حدث خطأ ما', 'error');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500 px-4 pt-6 pb-24 max-w-full overflow-hidden">
      
      {/* Banner - Responsive and Contained */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-[#1a3c34] p-8 shadow-xl flex flex-col gap-4">
        <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-[#daa520]/15 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 mb-2">
             <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
             <span className="text-[9px] font-black text-emerald-100 uppercase tracking-widest">{onlineCount} متصل الآن</span>
          </div>
          <h2 className="text-3xl font-black text-white leading-tight">
            مرحب بيك <br/> <span className="text-[#daa520]">في دارك</span>
          </h2>
        </div>
      </section>

      {/* Post Input */}
      <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-emerald-50 space-y-4">
        <textarea 
          value={newPostText}
          onChange={(e) => setNewPostText(e.target.value)}
          placeholder="كيف الحال يا أهلنا؟"
          className="w-full bg-slate-50 rounded-2xl p-4 outline-none font-bold text-sm h-24 resize-none border border-transparent focus:border-emerald-100 transition-all"
        />
        <div className="flex justify-end">
          <button 
            onClick={handleCreatePost}
            disabled={!newPostText.trim() || isPosting}
            className={`px-8 py-3 rounded-xl font-black text-xs shadow-lg transition-all active:scale-95 ${!newPostText.trim() || isPosting ? 'bg-slate-100 text-slate-300' : 'bg-[#1a3c34] text-[#daa520]'}`}
          >
            {isPosting ? 'جاري النشر...' : 'انشر الآن ✨'}
          </button>
        </div>
      </div>

      {/* Wall Posts */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-[#1a3c34] px-2">الديوان العام</h3>
        {wallPosts.map(post => (
          <div key={post.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-emerald-50 space-y-4">
            <div className="flex items-center gap-3">
              <img src={post.authorImage} className="w-10 h-10 rounded-xl object-cover grayscale" alt="" />
              <div>
                <h4 className="font-black text-xs text-[#1a3c34]">{post.authorName}</h4>
                <p className="text-[9px] font-bold text-slate-400">{post.timestamp}</p>
              </div>
            </div>
            <p className="text-sm font-medium leading-relaxed text-slate-700 bg-slate-50/50 p-4 rounded-xl">
              {post.content}
            </p>
          </div>
        ))}
      </div>

      {/* Suggested - Horizontal Scroll Container */}
      <div className="space-y-4 overflow-hidden">
        <h3 className="text-xl font-black text-[#1a3c34] px-2">أعضاء جدد</h3>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-2">
          {recommendedMembers.map(member => (
            <div key={member.id} className="min-w-[140px] bg-white rounded-[2rem] p-5 shadow-sm border border-emerald-50 flex flex-col items-center text-center gap-3">
              <img src={member.profileImage} className="w-16 h-16 rounded-full grayscale border-2 border-emerald-50" alt="" />
              <div className="space-y-0.5">
                <h4 className="text-[11px] font-black text-[#1a3c34] truncate w-24">{member.name}</h4>
                <p className="text-[9px] font-bold text-slate-400">{member.city}</p>
              </div>
              <Link to="/discover" className="w-full py-2 bg-emerald-50 text-[#1a3c34] rounded-lg font-black text-[9px]">عرض</Link>
            </div>
          ))}
        </div>
      </div>

      <div className="pb-8"></div>
    </div>
  );
};

export default Dashboard;