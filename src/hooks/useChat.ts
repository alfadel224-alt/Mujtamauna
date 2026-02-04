import { create } from 'zustand';
import type { Chat, Message, VideoCall, User } from '@/types';

interface ChatState {
  chats: Chat[];
  messages: Record<string, Message[]>;
  activeVideoCall: VideoCall | null;
  isLoading: boolean;
  
  // Actions
  getChats: (userId: string) => Chat[];
  getMessages: (chatId: string) => Message[];
  sendMessage: (chatId: string, senderId: string, content: string) => Promise<void>;
  markAsRead: (chatId: string, userId: string) => void;
  startVideoCall: (chatId: string, callerId: string, receiverId: string) => VideoCall;
  endVideoCall: (callId: string) => void;
  acceptVideoCall: (callId: string) => void;
  rejectVideoCall: (callId: string) => void;
}

// Mock users
const mockUser1: User = {
  id: '1',
  name: 'أحمد محمد',
  email: 'ahmed@example.com',
  age: 28,
  gender: 'male',
  city: 'الخرطوم',
  bio: 'مهندس برمجيات',
  profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  interests: ['القراءة', 'السفر'],
  isOnline: true,
  isVerified: true,
  createdAt: new Date(),
};

const mockUser2: User = {
  id: '2',
  name: 'فاطمة علي',
  email: 'fatima@example.com',
  age: 24,
  gender: 'female',
  city: 'أم درمان',
  bio: 'طبيبة أسنان',
  profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  interests: ['الطبخ', 'الفن'],
  isOnline: false,
  lastSeen: new Date(Date.now() - 1000 * 60 * 30),
  isVerified: true,
  createdAt: new Date(),
};

const mockUser4: User = {
  id: '4',
  name: 'مريم عثمان',
  email: 'mariam@example.com',
  age: 26,
  gender: 'female',
  city: 'مدني',
  bio: 'معلمة',
  profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
  interests: ['التعليم', 'الأطفال'],
  isOnline: false,
  lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2),
  isVerified: true,
  createdAt: new Date(),
};

// Mock data
const MOCK_CHATS: Chat[] = [
  {
    id: '1',
    participants: [mockUser1, mockUser2],
    lastMessage: {
      id: '1',
      chatId: '1',
      senderId: '2',
      content: 'الحمد لله، كيف حالك أنت؟',
      type: 'text',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 5),
    },
    unreadCount: 0,
    isVideoCallActive: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    participants: [mockUser1, mockUser4],
    lastMessage: {
      id: '2',
      chatId: '2',
      senderId: '4',
      content: 'مرحباً! كيف حالك؟',
      type: 'text',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
    },
    unreadCount: 1,
    isVideoCallActive: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const MOCK_MESSAGES: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      chatId: '1',
      senderId: '1',
      content: 'السلام عليكم فاطمة، كيف حالك؟',
      type: 'text',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 15),
    },
    {
      id: '2',
      chatId: '1',
      senderId: '2',
      content: 'وعليكم السلام أحمد! بخير الحمد لله',
      type: 'text',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 10),
    },
    {
      id: '3',
      chatId: '1',
      senderId: '1',
      content: 'سعيد بسماع ذلك! هل يمكننا التحدث أكثر عن اهتماماتنا؟',
      type: 'text',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 8),
    },
    {
      id: '4',
      chatId: '1',
      senderId: '2',
      content: 'بالتأكيد! أنا أحب الطبخ كثيراً، وأحب تجربة وصفات جديدة',
      type: 'text',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 6),
    },
    {
      id: '5',
      chatId: '1',
      senderId: '1',
      content: 'رائع! أنا أيضاً أحب الطعام الجيد، ربما يمكنك أن تعلميني بعض الوصفات السودانية التقليدية 😊',
      type: 'text',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: '6',
      chatId: '1',
      senderId: '2',
      content: 'بالطبع! سأعلمك وصفة الكسرة والتقلية',
      type: 'text',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 5),
    },
  ],
  '2': [
    {
      id: '1',
      chatId: '2',
      senderId: '4',
      content: 'مرحباً أحمد! سعيدة بالتعرف عليك',
      type: 'text',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60),
    },
    {
      id: '2',
      chatId: '2',
      senderId: '1',
      content: 'أهلاً وسهلاً مريم! أنا أيضاً سعيد بالتعرف عليك',
      type: 'text',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 50),
    },
    {
      id: '3',
      chatId: '2',
      senderId: '4',
      content: 'أنا معلمة في مدرسة ابتدائية، وأحب عملي كثيراً',
      type: 'text',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 45),
    },
    {
      id: '4',
      chatId: '2',
      senderId: '1',
      content: 'عمل نبيل! التعليم من أهم المهن',
      type: 'text',
      isRead: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 40),
    },
    {
      id: '5',
      chatId: '2',
      senderId: '4',
      content: 'مرحباً! كيف حالك؟',
      type: 'text',
      isRead: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
    },
  ],
};

export const useChat = create<ChatState>((set, get) => ({
  chats: MOCK_CHATS,
  messages: MOCK_MESSAGES,
  activeVideoCall: null,
  isLoading: false,

  getChats: (userId: string) => {
    const { chats } = get();
    return chats.filter((chat: Chat) => 
      chat.participants.some((p: User) => p.id === userId)
    ).sort((a: Chat, b: Chat) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  },

  getMessages: (chatId: string) => {
    const { messages } = get();
    return messages[chatId] || [];
  },

  sendMessage: async (chatId: string, senderId: string, content: string) => {
    set({ isLoading: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newMessage: Message = {
      id: Date.now().toString(),
      chatId,
      senderId,
      content,
      type: 'text',
      isRead: false,
      createdAt: new Date(),
    };

    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: [...(state.messages[chatId] || []), newMessage],
      },
      chats: state.chats.map((chat: Chat) => 
        chat.id === chatId 
          ? { 
              ...chat, 
              lastMessage: newMessage,
              updatedAt: new Date(),
            }
          : chat
      ),
      isLoading: false,
    }));
  },

  markAsRead: (chatId: string, userId: string) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: (state.messages[chatId] || []).map((msg: Message) =>
          msg.senderId !== userId ? { ...msg, isRead: true } : msg
        ),
      },
      chats: state.chats.map((chat: Chat) =>
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      ),
    }));
  },

  startVideoCall: (chatId: string, callerId: string, receiverId: string) => {
    const newCall: VideoCall = {
      id: Date.now().toString(),
      chatId,
      callerId,
      receiverId,
      status: 'ringing',
      startedAt: new Date(),
    };

    set({ activeVideoCall: newCall });
    
    return newCall;
  },

  endVideoCall: (callId: string) => {
    set((state) => ({
      activeVideoCall: state.activeVideoCall?.id === callId 
        ? { ...state.activeVideoCall, status: 'ended', endedAt: new Date() }
        : state.activeVideoCall,
    }));
    
    // Clear active call after a delay
    setTimeout(() => {
      set({ activeVideoCall: null });
    }, 2000);
  },

  acceptVideoCall: (callId: string) => {
    set((state) => ({
      activeVideoCall: state.activeVideoCall?.id === callId 
        ? { ...state.activeVideoCall, status: 'ongoing' }
        : state.activeVideoCall,
    }));
  },

  rejectVideoCall: (callId: string) => {
    set((state) => ({
      activeVideoCall: state.activeVideoCall?.id === callId 
        ? { ...state.activeVideoCall, status: 'rejected', endedAt: new Date() }
        : state.activeVideoCall,
    }));
    
    setTimeout(() => {
      set({ activeVideoCall: null });
    }, 2000);
  },
}));

export default useChat;
