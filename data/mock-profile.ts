import { ProfileData } from '~/types/profile';

export const mockProfileData: ProfileData = {
  id: '1',
  firstName: 'আহমেদ',
  lastName: 'রহমান',
  email: 'ahmed@example.com',
  phone: '+8801234567890',
  avatar: '',
  bio: 'আমি একজন HSC বিজ্ঞান বিভাগের শিক্ষার্থী। গণিত এবং পদার্থবিজ্ঞানে আমার বিশেষ আগ্রহ।',
  headline: 'HSC Science Student',
  location: 'ঢাকা, বাংলাদেশ',
  currentClass: 'HSC 1st Year',
  institution: 'রাজউক উত্তরা মডেল কলেজ',
  targetExam: 'HSC পরীক্ষা',
  batch: 'HSC27',
  group: 'science',
  favoriteSubjects: [
    'গণিত',
    'পদার্থবিজ্ঞান',
    'রসায়ন',
    'ইংরেজি'
  ],
  studyGoals: [
    'HSC এ ভালো রেজাল্ট করা',
    'বিশ্ববিদ্যালয়ে ভর্তি হওয়া',
    'গণিতের উপর দক্ষতা অর্জন করা'
  ],
  socialLinks: [
    {
      id: '1',
      platform: 'facebook',
      url: 'https://facebook.com/ahmed',
      username: 'ahmed_rahman',
      isPublic: true
    }
  ],
  academicHistory: [
    {
      id: '1',
      exam: 'SSC',
      year: '2023',
      board: 'ঢাকা শিক্ষা বোর্ড',
      group: 'বিজ্ঞান',
      gpa: '5.00',
      institution: 'রাজউক উত্তরা মডেল কলেজ'
    }
  ],
  achievements: [
    {
      id: '1',
      title: 'সেরা শিক্ষার্থী পুরস্কার',
      description: 'স্কুলে সর্বোচ্চ জিপিএ অর্জন',
      date: new Date('2023-12-01'),
      category: 'academic'
    },
    {
      id: '2',
      title: 'গণিত অলিম্পিয়াডে অংশগ্রহণ',
      description: 'জাতীয় গণিত অলিম্পিয়াডে অংশগ্রহণ',
      date: new Date('2023-11-15'),
      category: 'academic'
    }
  ],
  addresses: [
    {
      id: '1',
      label: 'home',
      division: 'dhaka',
      district: 'ঢাকা',
      upazila: 'উত্তরা',
      address: 'হাউস নম্বর ১২৩, রোড নম্বর ৮, সেক্টর ৭',
      postalCode: '1230',
      isPrimary: true
    }
  ],
  stats: {
    coursesCompleted: 5,
    examsTaken: 12,
    studyHours: 150,
    achievements: 2
  },
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2024-01-01')
};

export const mockPurchases = [
  {
    id: '1',
    itemId: 'course-1',
    itemType: 'course' as const,
    purchaseDate: new Date('2024-01-15'),
    amount: 500,
    itemDetails: {
      title: 'HSC গণিত কোর্স',
      description: 'HSC গণিতের সম্পূর্ণ কোর্স',
      thumbnail: ''
    }
  },
  {
    id: '2',
    itemId: 'ebook-1',
    itemType: 'ebook' as const,
    purchaseDate: new Date('2024-01-10'),
    amount: 200,
    itemDetails: {
      title: 'পদার্থবিজ্ঞানের মৌলিক বিষয়সমূহ',
      description: 'পদার্থবিজ্ঞানের বেসিক কনসেপ্ট',
      thumbnail: ''
    }
  }
];
