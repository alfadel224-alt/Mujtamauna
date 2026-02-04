import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginCredentials, RegisterData } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

// Mock users for demo
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    age: 28,
    gender: 'male',
    city: 'الخرطوم',
    bio: 'مهندس برمجيات، أبحث عن شريكة حياة متدينة ومتعلمة. أحب القراءة والسفر.',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop',
    interests: ['القراءة', 'السفر', 'التكنولوجيا', 'الرياضة'],
    education: 'بكالوريوس',
    occupation: 'مهندس برمجيات',
    religion: 'محافظ',
    isOnline: true,
    isVerified: true,
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'فاطمة علي',
    email: 'fatima@example.com',
    age: 24,
    gender: 'female',
    city: 'أم درمان',
    bio: 'طبيبة أسنان، أحب الطبخ والفن. أبحث عن شخص طموح ومتدين.',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=400&fit=crop',
    interests: ['الطبخ', 'الفن', 'الصحة', 'العائلة'],
    education: 'بكالوريوس',
    occupation: 'طبيبة أسنان',
    religion: 'محافظة',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 30),
    isVerified: true,
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'عمر خالد',
    email: 'omar@example.com',
    age: 30,
    gender: 'male',
    city: 'بورتسودان',
    bio: 'تاجر، أحب البحر والصيد. أبحث عن شريكة حياة تقدر العائلة والتقاليد.',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=400&fit=crop',
    interests: ['الصيد', 'البحر', 'العائلة', 'السفر'],
    education: 'دبلوم',
    occupation: 'تاجر',
    religion: 'محافظ',
    isOnline: true,
    isVerified: true,
    createdAt: new Date(),
  },
  {
    id: '4',
    name: 'مريم عثمان',
    email: 'mariam@example.com',
    age: 26,
    gender: 'female',
    city: 'مدني',
    bio: 'معلمة، أحب التعليم والأطفال. أبحث عن شخص متفهم وطيب القلب.',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=400&fit=crop',
    interests: ['التعليم', 'الأطفال', 'القراءة', 'التطوع'],
    education: 'بكالوريوس',
    occupation: 'معلمة',
    religion: 'محافظة',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isVerified: true,
    createdAt: new Date(),
  },
  {
    id: '5',
    name: 'خالد إبراهيم',
    email: 'khaled@example.com',
    age: 32,
    gender: 'male',
    city: 'كسلا',
    bio: 'محامي، أحب الرياضة والقراءة. أبحث عن شريكة حياة متعلمة ومحترمة.',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1200&h=400&fit=crop',
    interests: ['الرياضة', 'القراءة', 'الأعمال', 'العائلة'],
    education: 'ماجستير',
    occupation: 'محامي',
    religion: 'محافظ',
    isOnline: true,
    isVerified: true,
    createdAt: new Date(),
  },
  {
    id: '6',
    name: 'نورا صالح',
    email: 'nora@example.com',
    age: 23,
    gender: 'female',
    city: 'الخرطوم',
    bio: 'طالبة طب، أحب الدراسة والموسيقى. أبحث عن شخص طموح وداعم.',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&h=400&fit=crop',
    interests: ['الطب', 'الموسيقى', 'الدراسة', 'اليوغا'],
    education: 'بكالوريوس',
    occupation: 'طالبة',
    religion: 'محافظة',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 15),
    isVerified: true,
    createdAt: new Date(),
  },
];

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = MOCK_USERS.find(u => u.email === credentials.email);
        
        if (user) {
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        }
        
        set({ isLoading: false });
        return false;
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newUser: User = {
          id: Date.now().toString(),
          ...data,
          bio: '',
          profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=8B5A2B&color=fff`,
          interests: [],
          isOnline: true,
          isVerified: false,
          createdAt: new Date(),
        };
        
        set({ user: newUser, isAuthenticated: true, isLoading: false });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...userData } });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuth;
