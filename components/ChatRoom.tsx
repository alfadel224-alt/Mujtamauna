
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Member, Language, ChatMessage } from '../types';
import { geminiService } from '../services/geminiService';

interface Props {
  currentUser: Member;
  lang: Language;
}

const ChatRoom: React.FC<Props> = ({ currentUser, lang }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showVideoCall, setShowVideoCall] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          sendVoiceMessage(base64Audio);
        };
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      alert("يرجى السماح بالوصول للميكروفون لتسجيل الصوت");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const sendVoiceMessage = (audioUrl: string) => {
    const newMsg: ChatMessage = {
      id: Math.random().toString(),
      senderId: currentUser.id,
      receiverId: 'other',
      audioUrl: audioUrl,
      type: 'voice',
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const cleanedText = await geminiService.filterProfanity(inputText);
    const newMsg: ChatMessage = {
      id: Math.random().toString(),
      senderId: currentUser.id,
      receiverId: 'other',
      text: cleanedText,
      type: 'text',
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-[2.5rem] md:rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(26,60,52,0.15)] overflow-hidden border-2 border-emerald-50 max-w-4xl mx-auto relative">
      
      {showVideoCall && (
        <div className="absolute inset-0 z-50 bg-[#1a3c34]/95 backdrop-blur-2xl animate-in fade-in zoom-in duration-500 flex flex-col items-center justify-center p-8 text-white">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #daa520 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          <div className="relative mb-12">
            <div className="w-40 h-40 md:w-56 md:h-56 rounded-full border-[6px] border-[#daa520]/30 p-3">
              <div className="w-full h-full bg-gradient-to-br from-[#daa520] to-[#ffdf8c] rounded-full flex items-center justify-center text-6xl md:text-8xl font-black text-[#1a3c34]">ع</div>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-20 tracking-tight">عثمان عادل</h2>
          <div className="flex gap-8 relative z-10">
             <button onClick={() => setShowVideoCall(false)} className="w-20 h-20 bg-rose-500 rounded-full flex items-center justify-center shadow-xl active:scale-95"><svg className="w-10 h-10 rotate-[135deg]" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg></button>
          </div>
        </div>
      )}

      <div className="bg-[#1a3c34] p-6 md:p-8 flex items-center justify-between text-white shadow-2xl z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-3 bg-white/10 rounded-2xl hover:bg-[#daa520] transition-all"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg></button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#daa520] rounded-2xl flex items-center justify-center text-xl font-black text-[#1a3c34]">ع</div>
            <div>
              <h3 className="text-lg font-black leading-none">عثمان عادل</h3>
              <p className="text-[10px] text-emerald-300 font-bold mt-2 uppercase tracking-widest">نشط الآن</p>
            </div>
          </div>
        </div>
        <button onClick={() => setShowVideoCall(true)} className="p-3.5 bg-white/5 rounded-2xl"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg></button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-12 space-y-10 bg-[#fdfcf0]/40">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
            <div className={`relative max-w-[85%] p-5 rounded-[2rem] shadow-sm ${msg.senderId === currentUser.id ? 'bg-[#1a3c34] text-white rounded-tr-none' : 'bg-white text-slate-800 border-2 border-emerald-50 rounded-tl-none'}`}>
              {msg.type === 'voice' ? (
                <div className="flex items-center gap-3 min-w-[200px]">
                   <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/></svg>
                   </div>
                   <div className="flex-1 h-1 bg-white/10 rounded-full relative">
                      <div className="absolute inset-0 bg-white/30 rounded-full w-[40%]"></div>
                   </div>
                   <audio className="hidden" src={msg.audioUrl} controls />
                </div>
              ) : (
                <p className="text-base font-medium leading-[1.6]">{msg.text}</p>
              )}
              <div className={`text-[9px] mt-4 font-black ${msg.senderId === currentUser.id ? 'text-emerald-300/60' : 'text-slate-300'}`}>{msg.timestamp}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 md:p-10 bg-white border-t border-emerald-50">
        <div className="flex items-center gap-3 bg-slate-50/80 p-2.5 rounded-[2.5rem] border-2 border-transparent focus-within:border-[#daa520] transition-all">
          {!isRecording ? (
            <input 
              type="text" 
              placeholder="اكتب رسالتك هنا..."
              className="flex-1 bg-transparent px-4 py-3 outline-none font-bold"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
            />
          ) : (
            <div className="flex-1 px-4 py-3 flex items-center gap-3 text-rose-500 font-black animate-pulse">
               <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
               جاري تسجيل الصوت: {recordingTime} ثانية
            </div>
          )}
          
          <div className="flex items-center gap-1">
             <button 
               onMouseDown={startRecording}
               onMouseUp={stopRecording}
               onTouchStart={startRecording}
               onTouchEnd={stopRecording}
               className={`p-3 rounded-full transition-all ${isRecording ? 'bg-rose-500 text-white shadow-xl scale-125' : 'text-slate-300 hover:text-[#1a3c34]'}`}
             >
               <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
             </button>
             <button 
               onClick={handleSend}
               disabled={!inputText.trim()}
               className={`p-4 rounded-2xl shadow-lg ${!inputText.trim() ? 'bg-slate-200 text-slate-400' : 'bg-[#daa520] text-[#1a3c34] hover:bg-amber-500'}`}
             >
               <svg className="w-6 h-6 transform rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
             </button>
          </div>
        </div>
        {isRecording && <p className="text-center text-[10px] text-slate-400 mt-2 font-black">أفلت الزر للإرسال</p>}
      </div>
    </div>
  );
};

export default ChatRoom;
