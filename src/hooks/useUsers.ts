import { create } from 'zustand';
import type { User, Match, MatchRequest, FilterOptions, AIRecommendation } from '@/types';

interface UsersState {
  users: User[];
  matches: Match[];
  matchRequests: MatchRequest[];
  recommendations: AIRecommendation[];
  filters: FilterOptions;
  isLoading: boolean;
  
  // Actions
  setFilters: (filters: Partial<FilterOptions>) => void;
  getFilteredUsers: (currentUserId: string) => User[];
  sendMatchRequest: (fromUserId: string, toUserId: string) => Promise<boolean>;
  acceptMatchRequest: (requestId: string) => Promise<boolean>;
  rejectMatchRequest: (requestId: string) => Promise<boolean>;
  getMatches: (userId: string) => User[];
  getRecommendations: (userId: string) => AIRecommendation[];
  calculateCompatibility: (user1: User, user2: User) => number;
}

// Mock data
const MOCK_USERS: User[] = [
  {
    id: '2',
    name: 'فاطمة علي',
    email: 'fatima@example.com',
    age: 24,
    gender: 'female',
    city: 'أم درمان',
    bio: 'طبيبة أسنان، أحب الطبخ والفن. أبحث عن شخص طموح ومتدين.',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
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
    interests: ['الطب', 'الموسيقى', 'الدراسة', 'اليوغا'],
    education: 'بكالوريوس',
    occupation: 'طالبة',
    religion: 'محافظة',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 15),
    isVerified: true,
    createdAt: new Date(),
  },
  {
    id: '7',
    name: 'عائشة محمود',
    email: 'aisha@example.com',
    age: 27,
    gender: 'female',
    city: 'بحري',
    bio: 'مصممة أزياء، أحب الفن والإبداع. أبحث عن شخص يقدر الفن والجمال.',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    interests: ['الفن', 'التصميم', 'الأزياء', 'السفر'],
    education: 'بكالوريوس',
    occupation: 'مصممة أزياء',
    religion: 'محافظة',
    isOnline: true,
    isVerified: true,
    createdAt: new Date(),
  },
  {
    id: '8',
    name: 'محمد عبدالله',
    email: 'mohamed@example.com',
    age: 29,
    gender: 'male',
    city: 'الأبيض',
    bio: 'مهندس مدني، أحب العمل والبناء. أبحث عن شريكة حياة تقدر الاستقرار.',
    profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
    interests: ['البناء', 'العمل', 'العائلة', 'الرياضة'],
    education: 'بكالوريوس',
    occupation: 'مهندس مدني',
    religion: 'محافظ',
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 45),
    isVerified: true,
    createdAt: new Date(),
  },
];

export const useUsers = create<UsersState>((set, get) => ({
  users: MOCK_USERS,
  matches: [],
  matchRequests: [],
  recommendations: [],
  isLoading: false,
  filters: {
    ageRange: [18, 80],
    cities: [],
    education: [],
    religion: [],
    interests: [],
  },

  setFilters: (filters: Partial<FilterOptions>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  getFilteredUsers: (currentUserId: string) => {
    const { users, filters, matches, matchRequests } = get();
    
    // Get IDs of users already matched or have pending requests
    const excludedIds = new Set<string>([
      currentUserId,
      ...matches.flatMap(m => [m.userId1, m.userId2]),
      ...matchRequests.map(r => r.fromUser.id),
    ]);

    return users.filter((user: User) => {
      if (excludedIds.has(user.id)) return false;

      const { ageRange, cities, education, religion, interests, isOnline } = filters;

      if (user.age < ageRange[0] || user.age > ageRange[1]) return false;
      if (cities.length > 0 && !cities.includes(user.city)) return false;
      if (education.length > 0 && !education.includes(user.education || '')) return false;
      if (religion.length > 0 && !religion.includes(user.religion || '')) return false;
      if (interests.length > 0 && !interests.some(i => user.interests.includes(i))) return false;
      if (isOnline !== undefined && user.isOnline !== isOnline) return false;

      return true;
    });
  },

  sendMatchRequest: async (fromUserId: string, toUserId: string) => {
    set({ isLoading: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const { users, matchRequests } = get();
    const toUser = users.find(u => u.id === toUserId);
    
    if (!toUser) {
      set({ isLoading: false });
      return false;
    }

    // Check if request already exists
    const existingRequest = matchRequests.find(
      r => r.fromUser.id === fromUserId && r.toUserId === toUserId
    );
    
    if (existingRequest) {
      set({ isLoading: false });
      return false;
    }

    const fromUser = users.find(u => u.id === fromUserId);
    if (!fromUser) {
      set({ isLoading: false });
      return false;
    }

    const newRequest: MatchRequest = {
      id: Date.now().toString(),
      fromUser: fromUser,
      toUserId,
      status: 'pending',
      createdAt: new Date(),
    };

    set((state) => ({
      matchRequests: [...state.matchRequests, newRequest],
      isLoading: false,
    }));

    return true;
  },

  acceptMatchRequest: async (requestId: string) => {
    set({ isLoading: true });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const { matchRequests } = get();
    const request = matchRequests.find(r => r.id === requestId);
    
    if (!request) {
      set({ isLoading: false });
      return false;
    }

    const newMatch: Match = {
      id: Date.now().toString(),
      userId1: request.fromUser.id,
      userId2: request.toUserId,
      compatibility: 85,
      status: 'accepted',
      createdAt: new Date(),
      acceptedAt: new Date(),
    };

    set((state) => ({
      matches: [...state.matches, newMatch],
      matchRequests: state.matchRequests.filter(r => r.id !== requestId),
      isLoading: false,
    }));

    return true;
  },

  rejectMatchRequest: async (requestId: string) => {
    set({ isLoading: true });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set((state) => ({
      matchRequests: state.matchRequests.filter(r => r.id !== requestId),
      isLoading: false,
    }));

    return true;
  },

  getMatches: (userId: string) => {
    const { users, matches } = get();
    
    const userMatches = matches.filter(
      m => m.userId1 === userId || m.userId2 === userId
    );

    return userMatches.map((match: Match) => {
      const otherUserId = match.userId1 === userId ? match.userId2 : match.userId1;
      return users.find(u => u.id === otherUserId)!;
    }).filter(Boolean);
  },

  calculateCompatibility: (user1: User, user2: User) => {
    let score = 0;
    let factors = 0;

    // Age compatibility (within 5 years)
    const ageDiff = Math.abs(user1.age - user2.age);
    if (ageDiff <= 5) {
      score += (5 - ageDiff) * 10;
    }
    factors += 50;

    // City compatibility
    if (user1.city === user2.city) {
      score += 20;
    }
    factors += 20;

    // Interests compatibility
    const commonInterests = user1.interests.filter(i => user2.interests.includes(i));
    score += (commonInterests.length / Math.max(user1.interests.length, user2.interests.length)) * 20;
    factors += 20;

    // Education compatibility
    if (user1.education === user2.education) {
      score += 10;
    }
    factors += 10;

    return Math.round((score / factors) * 100);
  },

  getRecommendations: (userId: string) => {
    const { users, calculateCompatibility } = get();
    const currentUser = users.find(u => u.id === userId);
    
    if (!currentUser) return [];

    const potentialMatches = users.filter(u => 
      u.id !== userId && 
      u.gender !== currentUser.gender
    );

    const recommendations = potentialMatches.map((user: User) => ({
      user,
      compatibilityScore: calculateCompatibility(currentUser, user),
      reasons: [
        `عمر متقارب (${Math.abs(currentUser.age - user.age)} سنة فرق)`,
        user.city === currentUser.city ? 'من نفس المدينة' : 'مدن مختلفة',
        `${user.interests.filter(i => currentUser.interests.includes(i)).length} اهتمامات مشتركة`,
      ],
    }));

    return recommendations.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  },
}));

export default useUsers;
