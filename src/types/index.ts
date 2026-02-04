// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: 'male' | 'female';
  city: string;
  bio: string;
  profileImage: string;
  coverImage?: string;
  interests: string[];
  education?: string;
  occupation?: string;
  religion?: string;
  isOnline: boolean;
  lastSeen?: Date;
  isVerified: boolean;
  createdAt: Date;
}

export interface UserProfile extends User {
  preferences: UserPreferences;
  photos: string[];
  matches: string[];
  likes: string[];
  likedBy: string[];
}

export interface UserPreferences {
  minAge: number;
  maxAge: number;
  cities: string[];
  education: string[];
  religion: string[];
  interests: string[];
}

// Match Types
export interface Match {
  id: string;
  userId1: string;
  userId2: string;
  compatibility: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  acceptedAt?: Date;
}

export interface MatchRequest {
  id: string;
  fromUser: User;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

// Message Types
export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'voice' | 'video';
  isRead: boolean;
  createdAt: Date;
}

export interface Chat {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isVideoCallActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Video Call Types
export interface VideoCall {
  id: string;
  chatId: string;
  callerId: string;
  receiverId: string;
  status: 'ringing' | 'ongoing' | 'ended' | 'rejected';
  startedAt?: Date;
  endedAt?: Date;
  duration?: number;
}

// AI Types
export interface AIRecommendation {
  user: User;
  compatibilityScore: number;
  reasons: string[];
}

export interface AIConversation {
  id: string;
  userId: string;
  messages: AIMessage[];
  context: string;
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: 'male' | 'female';
  city: string;
}

// UI Types
export interface Notification {
  id: string;
  type: 'match' | 'message' | 'like' | 'call';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  data?: any;
}

export interface FilterOptions {
  ageRange: [number, number];
  cities: string[];
  education: string[];
  religion: string[];
  interests: string[];
  isOnline?: boolean;
}

// Sudan Cities
export const SUDAN_CITIES = [
  'الخرطوم',
  'أم درمان',
  'بحري',
  'بورتسودان',
  'مدني',
  'كسلا',
  'الأبيض',
  'الفاشر',
  'نيالا',
  'القضارف',
  'سنار',
  'دمازين',
  'كوستي',
  'عطبرة',
  'شندي',
  'الدمازين',
  'الروصيرص',
  'الفولة',
  'الجنينة',
  'زالنجي',
] as const;

// Interests
export const INTERESTS = [
  'القراءة',
  'السفر',
  'الطبخ',
  'الرياضة',
  'الموسيقى',
  'الفن',
  'التصوير',
  'الكتابة',
  'التكنولوجيا',
  'الأعمال',
  'التعليم',
  'الصحة',
  'اليوغا',
  'الرحلات',
  'الحيوانات',
  'التطوع',
  'الدين',
  'العائلة',
  'الأفلام',
  'الألعاب',
] as const;

// Education Levels
export const EDUCATION_LEVELS = [
  'ثانوي',
  'دبلوم',
  'بكالوريوس',
  'ماجستير',
  'دكتوراه',
] as const;

// Religion Levels
export const RELIGION_LEVELS = [
  'محافظ جداً',
  'محافظ',
  'متوسط',
  'متساهل',
] as const;
