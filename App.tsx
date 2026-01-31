
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Member, Language, ConnectionRequest } from './types';
import { INITIAL_MEMBERS, UI_TEXT } from './constants';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MemberDiscovery from './components/MemberDiscovery';
import ChatRoom from './components/ChatRoom';
import AuthPage from './components/AuthPage';
import AdminPanel from './components/AdminPanel';
import ProfileSetup from './components/ProfileSetup';
import ProfilePage from './components/ProfilePage';
import SupportPage from './components/SupportPage';
import LandingPage from './components/LandingPage';
import MobileNav from './components/MobileNav';

const AppContent: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [hasCompletedProfile, setHasCompletedProfile] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isAppLoading, setIsAppLoading] = useState(true);
  
  const location = useLocation();

  useEffect(() => {
    const savedUser = localStorage.getItem('mujtamauna_user');
    const savedRequests = localStorage.getItem('mujtamauna_requests');
    const profileCompleted = localStorage.getItem('mujtamauna_profile_complete');

    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('mujtamauna_user');
      }
    }
    
    if (savedRequests) {
      try {
        setRequests(JSON.parse(savedRequests));
      } catch (e) {
        localStorage.removeItem('mujtamauna_requests');
      }
    }
    
    if (profileCompleted === 'true') setHasCompletedProfile(true);

    const timer = setTimeout(() => setIsAppLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const toggleLang = () => setLang(prev => (prev === 'en' ? 'ar' : 'en'));

  const handleAuth = (user: Member) => {
    setCurrentUser(user);
    localStorage.setItem('mujtamauna_user', JSON.stringify(user));
    if (user.email.toLowerCase().includes('admin')) {
      setHasCompletedProfile(true);
      localStorage.setItem('mujtamauna_profile_complete', 'true');
    }
    showMessage(lang === 'ar' ? 'أهلاً بيك في دارك' : 'Welcome to your home');
  };

  const handleProfileComplete = (updatedUser: Member) => {
    setCurrentUser(updatedUser);
    setHasCompletedProfile(true);
    setIsEditingProfile(false);
    localStorage.setItem('mujtamauna_user', JSON.stringify(updatedUser));
    localStorage.setItem('mujtamauna_profile_complete', 'true');
    showMessage(lang === 'ar' ? 'تم تحديث البيانات بنجاح 🇸🇩' : 'Profile updated successfully');
  };

  const handleLogout = () => {
    localStorage.removeItem('mujtamauna_user');
    localStorage.removeItem('mujtamauna_profile_complete');
    setCurrentUser(null);
    setHasCompletedProfile(false);
    setIsEditingProfile(false);
    setShowAuth(false);
    showMessage(lang === 'ar' ? 'في أمان الله، نتمنى نشوفك قريب' : 'Goodbye, see you soon');
  };

  const handleSendRequest = (toId: string) => {
    if (!currentUser) return;
    const newRequest: ConnectionRequest = {
      id: Math.random().toString(),
      fromId: currentUser.id,
      toId,
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    const updatedRequests = [...requests, newRequest];
    setRequests(updatedRequests);
    localStorage.setItem('mujtamauna_requests', JSON.stringify(updatedRequests));
    showMessage(lang === 'ar' ? 'تم إرسال طلب الونسة، في انتظار الرد' : 'Request sent, waiting for response');
  };

  const handleUpdateRequestStatus = (requestId: string, status: 'accepted' | 'rejected') => {
    const updatedRequests = requests.map(req => req.id === requestId ? { ...req, status } : req);
    setRequests(updatedRequests);
    localStorage.setItem('mujtamauna_requests', JSON.stringify(updatedRequests));
    showMessage(status === 'accepted' ? (lang === 'ar' ? 'مبروك! بدأت ونسة جديدة' : 'Congrats! New chat started') : (lang === 'ar' ? 'تم رفض الطلب' : 'Request rejected'));
  };

  const isRtl = lang === 'ar';
  const isAdmin = currentUser?.email.toLowerCase().includes('admin') || false;

  if (isAppLoading) {
    return (
      <div className="h-screen w-full bg-[#1a3c34] flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500 pb-safe pt-safe">
        <div className="w-24 h-24 bg-[#daa520] rounded-[2rem] flex items-center justify-center text-5xl font-black shadow-2xl animate-bounce">م</div>
        <div className="text-center">
           <h1 className="text-white text-3xl font-black tracking-tight">مجتمعنا</h1>
           <p className="text-[#daa520] text-xs font-bold uppercase tracking-[0.3em] mt-2 animate-pulse">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!currentUser && !showAuth) {
    return <LandingPage onStart={() => setShowAuth(true)} lang={lang} />;
  }

  if (!currentUser) {
    return <AuthPage onAuth={handleAuth} lang={lang} />;
  }

  if ((!isAdmin && !hasCompletedProfile) || isEditingProfile) {
    return <ProfileSetup user={currentUser} onComplete={handleProfileComplete} lang={lang} />;
  }

  return (
    <div className={`min-h-[100dvh] w-full flex bg-[#fdfcf7] text-slate-900 ${isRtl ? 'rtl' : 'ltr'} relative overflow-x-hidden font-['Tajawal'] pb-safe pt-safe`}>
      <Sidebar lang={lang} isAdmin={isAdmin} currentPath={location.pathname} />
      
      <div className="flex-1 flex flex-col min-w-0 min-h-[100dvh] relative z-10 max-w-full">
        <Header 
          lang={lang} 
          onToggleLang={toggleLang} 
          onLogout={handleLogout}
          title={isAdmin && location.pathname === '/admin' ? 'لوحة التحكم' : UI_TEXT[lang].title}
          user={currentUser}
          isAdmin={isAdmin}
        />
        
        <main className="flex-1 w-full overflow-x-hidden pb-32">
          <div className="w-full max-w-2xl mx-auto px-4 md:px-0">
            <Routes>
              <Route 
                path="/" 
                element={
                  <Dashboard 
                    members={members} 
                    requests={requests} 
                    currentUser={currentUser} 
                    onUpdateStatus={handleUpdateRequestStatus}
                    lang={lang} 
                    notify={showMessage}
                  />
                } 
              />
              <Route 
                path="/discover" 
                element={
                  <MemberDiscovery 
                    members={members} 
                    currentUser={currentUser}
                    requests={requests}
                    onSendRequest={handleSendRequest}
                    lang={lang} 
                  />
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProfilePage 
                    user={currentUser} 
                    lang={lang} 
                    onEdit={() => setIsEditingProfile(true)} 
                    onUpdateUser={(updated) => {
                      setCurrentUser(updated);
                      localStorage.setItem('mujtamauna_user', JSON.stringify(updated));
                    }}
                  />
                } 
              />
              <Route path="/chat/:id" element={<ChatRoom currentUser={currentUser} lang={lang} />} />
              <Route path="/support" element={<SupportPage lang={lang} />} />
              {isAdmin && <Route path="/admin" element={<AdminPanel members={members} setMembers={setMembers} lang={lang} />} />}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>

        <MobileNav lang={lang} currentPath={location.pathname} isAdmin={isAdmin} />
      </div>

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom-10 duration-500 w-[90%] max-w-sm">
           <div className={`flex items-center gap-4 p-4 rounded-3xl shadow-2xl border-2 backdrop-blur-md ${toast.type === 'success' ? 'bg-[#1a3c34]/95 border-emerald-500/30 text-white' : 'bg-rose-600/95 border-rose-400/30 text-white'}`}>
              <div className="w-10 h-10 shrink-0 bg-white/10 rounded-xl flex items-center justify-center text-xl">
                 {toast.type === 'success' ? '🇸🇩' : '⚠️'}
              </div>
              <p className="font-black text-sm leading-tight">{toast.message}</p>
           </div>
        </div>
      )}

      <style>{`
        * {
          box-sizing: border-box;
          -webkit-tap-highlight-color: transparent;
        }
        *::-webkit-scrollbar { display: none; }

        html, body {
          height: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          background: #fdfcf7;
          touch-action: pan-x pan-y;
        }

        input, select, textarea {
          font-size: 16px !important;
        }

        .animate-in {
          animation-duration: 0.5s;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;
