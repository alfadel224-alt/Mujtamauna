
import { Member } from './types';

export const INITIAL_MEMBERS: Member[] = [
  {
    id: '1',
    name: 'أحمد الطيب',
    email: 'ahmed@example.com',
    phone: '0912345678',
    bio: 'مهتم بالبرمجة والعمل الطوعي، أحب القراءة والمشي على النيل.',
    city: 'الخرطوم',
    country: 'السودان',
    profession: 'مهندس برمجيات',
    interests: ['تكنولوجيا'],
    gender: 'male',
    // Added birthDate to fix type errors in constants.ts
    birthDate: '1990-05-20',
    isVerified: true,
    profileImage: 'https://i.pravatar.cc/150?u=1',
    isImageVisible: true,
    joinedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'سارة محمد',
    email: 'sara@example.com',
    phone: '0911223344',
    bio: 'مصممة جرافيك مهتمة بالفن السوداني المعاصر والقهوة.',
    city: 'أم درمان',
    country: 'السودان',
    profession: 'مصممة جرافيك',
    interests: ['فنون'],
    gender: 'female',
    // Added birthDate to fix type errors in constants.ts
    birthDate: '1995-08-12',
    isVerified: true,
    profileImage: 'https://i.pravatar.cc/150?u=2',
    isImageVisible: true,
    joinedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'محمد عثمان',
    email: 'mohammed@example.com',
    phone: '0988776655',
    bio: 'مغترب في السعودية، أحن لجلسات الجبنة والونسة السمحة.',
    city: 'الغربة',
    country: 'السعودية',
    profession: 'محاسب',
    interests: ['ونسة'],
    gender: 'male',
    // Added birthDate to fix type errors in constants.ts
    birthDate: '1988-11-30',
    isVerified: true,
    profileImage: 'https://i.pravatar.cc/150?u=3',
    isImageVisible: true,
    joinedAt: new Date().toISOString()
  }
];

export const UI_TEXT = {
  en: {
    title: 'Mujtama\'una',
    dashboard: 'Community Pulse',
    members: 'Discover Members',
    assistant: 'Community Guide',
    newMember: 'Join Us',
    city: 'City',
    interest: 'Interest',
    chatPlaceholder: 'Ask the guide about the community...',
    statsTitle: 'Community Stats',
    emptyMembers: 'No members found yet. Be the first!',
    error: 'Something went wrong. Please try again.',
    // Added missing task board strings
    todo: 'To Do',
    inProgress: 'In Progress',
    done: 'Done',
    tasks: 'Community Tasks',
    newTask: 'New Task'
  },
  ar: {
    title: 'مجتمعنا',
    dashboard: 'نبض المجتمع',
    members: 'اكتشاف الأعضاء',
    assistant: 'دليل مجتمعنا',
    newMember: 'انضم إلينا',
    city: 'المدينة',
    interest: 'الاهتمام',
    chatPlaceholder: 'اسأل الدليل عن أي شيء في المجتمع...',
    statsTitle: 'إحصائيات مجتمعنا',
    emptyMembers: 'لم يتم العثور على أعضاء حالياً. كن أول المنضمين!',
    error: 'حدث خطأ ما. يرجى المحاولة لاحقاً.',
    // Added missing task board strings
    todo: 'للقيام به',
    inProgress: 'قيد التنفيذ',
    done: 'تم الإنجاز',
    tasks: 'مهام المجتمع',
    newTask: 'مهمة جديدة'
  }
};
