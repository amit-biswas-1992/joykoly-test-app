export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  username: string;
  isPublic: boolean;
}

export interface AcademicRecord {
  id: string;
  exam: string;
  year: string;
  board: string;
  group: string;
  gpa: string;
  institution: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: Date;
  category: 'academic' | 'professional' | 'personal';
}

export interface Address {
  id: string;
  label: string;
  division: string;
  district: string;
  upazila: string;
  address: string;
  postalCode: string;
  isPrimary: boolean;
}

export interface ProfileStats {
  coursesCompleted: number;
  examsTaken: number;
  studyHours: number;
  achievements: number;
}

export interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  headline?: string;
  location?: string;
  currentClass?: string;
  institution?: string;
  targetExam?: string;
  batch?: string;
  group?: string;
  favoriteSubjects: string[];
  studyGoals: string[];
  socialLinks: SocialLink[];
  academicHistory: AcademicRecord[];
  achievements: Achievement[];
  addresses: Address[];
  stats: ProfileStats;
  preferences?: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface Purchase {
  id: string;
  itemId: string;
  itemType: 'course' | 'ebook' | 'exam';
  purchaseDate: Date;
  amount: number;
  itemDetails?: {
    title: string;
    description?: string;
    thumbnail?: string;
  };
}

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  headline?: string;
  location?: string;
  currentClass?: string;
  institution?: string;
  targetExam?: string;
  batch?: string;
  group?: string;
  addresses?: Address[];
  preferences?: Partial<UserPreferences>;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'system';
  profileVisibility: 'public' | 'private' | 'connections';
  showEmail: boolean;
  showPhone: boolean;
  showLocation: boolean;
  notificationSettings: {
    email: boolean;
    push: boolean;
    sms: boolean;
    courseUpdates: boolean;
    examReminders: boolean;
    socialInteractions: boolean;
  };
  learningPreferences: {
    preferredLearningStyle: string;
    studyTimePreference: string;
    difficultyLevel: string;
  };
}
