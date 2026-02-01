
export type Language = 'en' | 'ar';
export type UserRole = 'admin' | 'moderator' | 'support_agent';
export type RequestStatus = 'pending' | 'accepted' | 'rejected';

export interface ConnectionRequest {
  id: string;
  fromId: string;
  toId: string;
  status: RequestStatus;
  timestamp: string;
}

export interface WallPost {
  id: string;
  authorId: string;
  authorName: string;
  authorImage: string;
  content: string;
  timestamp: string;
  likes: number;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  city: string;
  country: string;
  profession: string;
  interests: string[];
  gender: 'male' | 'female';
  birthDate: string;
  isVerified: boolean;
  profileImage: string;
  isImageVisible: boolean;
  joinedAt: string;
  matchScore?: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  audioUrl?: string;
  type: 'text' | 'image' | 'voice';
  timestamp: string;
}

export interface AIChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  lastActive: string;
}

export interface SupportConfig {
  phone: string;
  email: string;
  privacyPoints: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}
