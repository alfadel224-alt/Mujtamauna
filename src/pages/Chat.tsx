import { useState, useEffect, useRef } from 'react';
import { Send, Video, MoreVertical, Smile, Paperclip, ChevronLeft, PhoneOff, Mic, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from '@/lib/utils';
import type { Message } from '@/types';

export default function Chat() {
  const { user } = useAuth();
  const { 
    getChats, 
    getMessages, 
    sendMessage, 
    markAsRead, 
    activeVideoCall,
    startVideoCall,
    endVideoCall,
  } = useChat();
  const { toast } = useToast();
  
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [isVideoCallModalOpen, setIsVideoCallModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chats = user ? getChats(user.id) : [];
  const selectedChat = chats.find(c => c.id === selectedChatId);
  const messages = selectedChatId ? getMessages(selectedChatId) : [];
  const otherUser = selectedChat?.participants.find(p => p.id !== user?.id);

  useEffect(() => {
    if (selectedChatId && user) {
      markAsRead(selectedChatId, user.id);
    }
  }, [selectedChatId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedChatId || !user) return;

    await sendMessage(selectedChatId, user.id, messageInput);
    setMessageInput('');
  };

  const handleVideoCall = () => {
    if (!selectedChatId || !user || !otherUser) return;
    
    startVideoCall(selectedChatId, user.id, otherUser.id);
    setIsVideoCallModalOpen(true);
    toast({
      title: 'جاري الاتصال...',
      description: `جاري الاتصال بـ ${otherUser.name}`,
    });
  };

  const handleEndCall = () => {
    if (activeVideoCall) {
      endVideoCall(activeVideoCall.id);
      setIsVideoCallModalOpen(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-sudan-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-sudan-dark/60">يرجى تسجيل الدخول أولاً</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sudan-cream py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sudan overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="flex h-full">
            {/* Chat List Sidebar */}
            <div className={`w-full md:w-80 border-l border-sudan-brown/10 ${selectedChatId ? 'hidden md:block' : ''}`}>
              <div className="p-4 border-b border-sudan-brown/10">
                <h2 className="font-amiri text-xl font-bold text-sudan-dark">المحادثات</h2>
              </div>
              
              <ScrollArea className="h-[calc(100%-65px)]">
                {chats.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-sudan-dark/60">لا توجد محادثات</p>
                    <p className="text-sm text-sudan-dark/40 mt-2">
                      ابدأ بالتصفح وإرسال الإعجابات
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-sudan-brown/5">
                    {chats.map((chat) => {
                      const other = chat.participants.find(p => p.id !== user.id);
                      if (!other) return null;
                      
                      return (
                        <button
                          key={chat.id}
                          onClick={() => setSelectedChatId(chat.id)}
                          className={`w-full p-4 flex items-center gap-3 hover:bg-sudan-cream transition-colors ${
                            selectedChatId === chat.id ? 'bg-sudan-cream' : ''
                          }`}
                        >
                          <div className="relative">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={other.profileImage} alt={other.name} />
                              <AvatarFallback className="bg-sudan-brown text-white">
                                {other.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {other.isOnline && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                            )}
                          </div>
                          
                          <div className="flex-1 text-right">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-sudan-dark">{other.name}</h4>
                              {chat.lastMessage && (
                                <span className="text-xs text-sudan-dark/50">
                                  {formatDistanceToNow(new Date(chat.lastMessage.createdAt))}
                                </span>
                              )}
                            </div>
                            
                            {chat.lastMessage && (
                              <p className={`text-sm truncate ${
                                chat.unreadCount > 0 ? 'text-sudan-dark font-medium' : 'text-sudan-dark/60'
                              }`}>
                                {chat.lastMessage.content}
                              </p>
                            )}
                          </div>
                          
                          {chat.unreadCount > 0 && (
                            <div className="w-5 h-5 bg-sudan-brown text-white text-xs rounded-full flex items-center justify-center">
                              {chat.unreadCount}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Chat Area */}
            {selectedChat && otherUser ? (
              <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b border-sudan-brown/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedChatId(null)}
                      className="md:hidden p-2 hover:bg-sudan-cream rounded-lg"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={otherUser.profileImage} alt={otherUser.name} />
                      <AvatarFallback className="bg-sudan-brown text-white">
                        {otherUser.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h4 className="font-semibold text-sudan-dark">{otherUser.name}</h4>
                      <p className="text-xs text-sudan-dark/60">
                        {otherUser.isOnline ? 'متصل الآن' : 
                          otherUser.lastSeen ? `آخر ظهور ${formatDistanceToNow(otherUser.lastSeen)}` : 'غير متصل'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-sudan-brown hover:bg-sudan-brown/10"
                      onClick={handleVideoCall}
                    >
                      <Video className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-sudan-brown hover:bg-sudan-brown/10"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message: Message, index: number) => {
                      const isMe = message.senderId === user.id;
                      const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isMe ? 'justify-start' : 'justify-end'}`}
                        >
                          <div className={`flex items-end gap-2 max-w-[70%] ${isMe ? 'flex-row' : 'flex-row-reverse'}`}>
                            {showAvatar && !isMe ? (
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={otherUser.profileImage} alt={otherUser.name} />
                                <AvatarFallback className="bg-sudan-brown text-white text-xs">
                                  {otherUser.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              <div className="w-8" />
                            )}
                            
                            <div
                              className={`px-4 py-2 rounded-2xl ${
                                isMe
                                  ? 'bg-sudan-brown text-white rounded-bl-none'
                                  : 'bg-sudan-cream text-sudan-dark rounded-br-none'
                              }`}
                            >
                              <p>{message.content}</p>
                              <p className={`text-xs mt-1 ${isMe ? 'text-white/70' : 'text-sudan-dark/50'}`}>
                                {new Date(message.createdAt).toLocaleTimeString('ar-SD', { hour: '2-digit', minute: '2-digit' })}
                                {isMe && message.isRead && (
                                  <span className="mr-1"> ✓✓</span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-sudan-brown/10">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-sudan-dark/50 hover:text-sudan-brown"
                    >
                      <Paperclip className="w-5 h-5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-sudan-dark/50 hover:text-sudan-brown"
                    >
                      <Image className="w-5 h-5" />
                    </Button>
                    
                    <Input
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="اكتب رسالتك..."
                      className="flex-1 border-sudan-brown/20 focus:border-sudan-gold"
                    />
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-sudan-dark/50 hover:text-sudan-brown"
                    >
                      <Smile className="w-5 h-5" />
                    </Button>
                    
                    <Button
                      type="submit"
                      className="btn-primary"
                      disabled={!messageInput.trim()}
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-sudan-brown/10 flex items-center justify-center">
                    <Send className="w-10 h-10 text-sudan-brown" />
                  </div>
                  <h3 className="font-amiri text-xl font-bold text-sudan-dark mb-2">
                    اختر محادثة للبدء
                  </h3>
                  <p className="text-sudan-dark/60 max-w-md">
                    اختر أحد الأعضاء من القائمة على اليسار لبدء المحادثة
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Call Modal */}
      {isVideoCallModalOpen && activeVideoCall && (
        <div className="fixed inset-0 z-50 bg-sudan-dark flex items-center justify-center">
          <div className="w-full max-w-4xl p-8">
            <div className="aspect-video bg-sudan-dark/80 rounded-2xl relative overflow-hidden">
              {/* Remote Video (Placeholder) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={otherUser?.profileImage} alt={otherUser?.name} />
                  <AvatarFallback className="bg-sudan-brown text-white text-4xl">
                    {otherUser?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              {/* Local Video (Picture in Picture) */}
              <div className="absolute bottom-4 right-4 w-48 h-36 bg-black/50 rounded-xl overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={user.profileImage} alt={user.name} />
                    <AvatarFallback className="bg-sudan-brown text-white">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              
              {/* Call Status */}
              <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-full">
                <p className="text-sm">
                  {activeVideoCall.status === 'ringing' ? 'جاري الاتصال...' : 
                   activeVideoCall.status === 'ongoing' ? '00:00' : 'انتهى الاتصال'}
                </p>
              </div>
              
              {/* Call Controls */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
                <button className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                  <Mic className="w-6 h-6 text-white" />
                </button>
                <button className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                  <Video className="w-6 h-6 text-white" />
                </button>
                <button 
                  onClick={handleEndCall}
                  className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <PhoneOff className="w-8 h-8 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
