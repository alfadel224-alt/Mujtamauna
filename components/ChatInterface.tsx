
import React, { useState, useRef, useEffect } from 'react';
import { AIChatMessage, Language, Member } from '../types';
import { geminiService } from '../services/geminiService';
import { UI_TEXT } from '../constants';

interface ChatInterfaceProps {
  lang: Language;
  members: Member[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ lang, members }) => {
  // Use AIChatMessage instead of ChatMessage for AI role-based chat
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const systemPrompt = `You are "Daleel Mujtama'una" (مجتمعنا دليل), a friendly Sudanese community guide.
    Your mission is to help people connect and feel at home.
    Context: We have ${members.length} members currently. Here is a list of interests in the community: ${members.map(m => m.interests.join(', ')).join(', ')}.
    Personality: Welcoming, using Sudanese cultural nuances (e.g., words like "حبابك"، "يا زول"، "يا زولة"، "البيت بيتك").
    Response Language: ${lang === 'ar' ? 'Sudanese Arabic/Modern Standard Arabic' : 'English'}.
    If asked about members, give suggestions based on the context provided.`;

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const response = await geminiService.getChatResponse(userMessage, systemPrompt);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: UI_TEXT[lang].error }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-[2.5rem] border-2 border-emerald-50 shadow-2xl overflow-hidden max-w-5xl mx-auto">
      <div className="p-8 bg-[#1a3c34] text-white flex items-center justify-between">
        <div className="flex items-center space-x-5 space-x-reverse">
          <div className="w-16 h-16 bg-[#daa520] rounded-[1.5rem] flex items-center justify-center shadow-lg transform -rotate-2">
            <svg className="w-8 h-8 text-[#1a3c34]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-black">{UI_TEXT[lang].assistant}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <p className="text-sm text-emerald-100/70 font-bold">حبابك في أي وقت</p>
            </div>
          </div>
        </div>
        <button onClick={() => setMessages([])} className="text-emerald-100/50 hover:text-white transition-colors">
          مسح الونسة
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#fdfcf0]/30"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-10 animate-in fade-in zoom-in duration-700">
            <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
               <span className="text-6xl">🇸🇩</span>
            </div>
            <h3 className="text-2xl font-black text-[#1a3c34] mb-4">أهلاً بيك في دليل مجتمعنا</h3>
            <p className="text-slate-500 max-w-md font-medium leading-relaxed">
              أنا هنا عشان أساعدك تتعرف على ناس جدد، أو أجاوب على استفساراتك عن مجتمعنا السوداني الجميل. اسألني عن أي حاجة!
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-400`}
          >
            <div className={`max-w-[80%] p-6 rounded-[2rem] shadow-sm ${
              msg.role === 'user' 
              ? 'bg-[#1a3c34] text-white rounded-tr-none' 
              : 'bg-white text-slate-800 border-2 border-emerald-50 rounded-tl-none'
            }`}>
              <p className="text-base md:text-lg leading-relaxed font-medium whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-6 rounded-[2rem] rounded-tl-none border-2 border-emerald-50 flex space-x-2 space-x-reverse">
              <div className="w-2.5 h-2.5 bg-[#daa520] rounded-full animate-bounce"></div>
              <div className="w-2.5 h-2.5 bg-[#daa520] rounded-full animate-bounce delay-100"></div>
              <div className="w-2.5 h-2.5 bg-[#daa520] rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-emerald-50">
        <div className="relative flex items-center bg-slate-50 rounded-[2rem] p-2 focus-within:ring-4 focus-within:ring-amber-100 transition-all border-2 border-transparent focus-within:border-amber-200">
          <input 
            type="text" 
            placeholder={UI_TEXT[lang].chatPlaceholder}
            className="flex-1 bg-transparent px-6 py-4 outline-none text-base font-bold"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className={`p-4 rounded-[1.5rem] transition-all shadow-lg transform active:scale-95 ${
              !input.trim() || loading 
              ? 'bg-slate-200 text-slate-400' 
              : 'bg-[#daa520] text-[#1a3c34] hover:bg-amber-500'
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;