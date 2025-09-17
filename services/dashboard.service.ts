import { coursesService } from './courses.service';
import { examsService } from './exams.service';

// Utility function to extract array data from API responses
const extractArrayFromResponse = (response: any, arrayKey?: string): any[] => {
  if (Array.isArray(response)) {
    return response;
  }
  
  if (response && typeof response === 'object') {
    // Try common array keys
    const possibleKeys = arrayKey ? [arrayKey] : ['data', 'exams', 'courses', 'results', 'items'];
    
    for (const key of possibleKeys) {
      if (Array.isArray(response[key])) {
        return response[key];
      }
      
      // Check for nested data structure: response.data.data
      if (response[key] && typeof response[key] === 'object' && Array.isArray(response[key][key])) {
        return response[key][key];
      }
      
      // Check for other nested patterns
      if (response[key] && typeof response[key] === 'object') {
        const nestedKeys = ['data', 'items', 'results', 'exams', 'courses'];
        for (const nestedKey of nestedKeys) {
          if (Array.isArray(response[key][nestedKey])) {
            return response[key][nestedKey];
          }
        }
      }
    }
    
    // Special handling for the specific API response structure we're seeing
    // response.data.data pattern
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      console.log('Found data in response.data.data structure');
      return response.data.data;
    }
    
    // response.data pattern with nested data
    if (response.data && typeof response.data === 'object') {
      const nestedKeys = ['data', 'items', 'results', 'exams', 'courses'];
      for (const nestedKey of nestedKeys) {
        if (Array.isArray(response.data[nestedKey])) {
          console.log(`Found data in response.data.${nestedKey} structure`);
          return response.data[nestedKey];
        }
      }
    }
  }
  
  console.warn('Could not extract array from response:', response);
  return [];
};

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  imageUrl?: string;
  instructor: string;
  duration: number;
  level: string;
  price: number;
  enrolled: boolean;
  progress?: number;
  rating?: number;
  totalStudents?: number;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseTitle: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalQuestions: number;
  totalMarks: number;
  type: 'live' | 'practice' | 'mock';
  status: 'upcoming' | 'live' | 'completed';
  isEnrolled: boolean;
  score?: number;
  passed?: boolean;
}

export interface DashboardData {
  enrolledCourses: Course[];
  liveExams: Exam[];
  upcomingExams: Exam[];
  completedExams: Exam[];
  practiceExams: Exam[];
}

export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    const [enrolledCourses, liveExams, upcomingExams, completedExams] =
      await Promise.all([
        getEnrolledCourses(),
        getLiveExams(),
        getUpcomingExams(),
        getCompletedExams(),
      ]);

    return {
      enrolledCourses,
      liveExams,
      upcomingExams,
      completedExams,
      practiceExams: [], // Practice exams endpoint not available in backend
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

export const getEnrolledCourses = async (): Promise<Course[]> => {
  try {
    const response = await coursesService.getEnrolled();
    const courses = extractArrayFromResponse(response, 'courses');
    
    // If no courses returned, add some mock data for demonstration
    if (courses.length === 0) {
      return [
        {
          id: '1',
          title: 'Advanced Data Science',
          description: 'Learn advanced data science techniques',
          instructor: 'Dr. Evelyn Reed',
          duration: 40,
          level: 'Advanced',
          price: 99,
          enrolled: true,
          progress: 30,
          rating: 4.8,
          totalStudents: 1250,
          imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXOJD5U_1nTHGh5AhwPWSyGwHFngmiYd-KJWhq1lqPRPDJXsqZO_9Blpg_QHMYMqoRQOc5Hr0LnoVsfPQgLVSUiFaJRIcRq1Km2WNs8X4Hb-y1XjxBK7OsfakRRvpakiHBk6GGEwSgamYMRZGP2RefWoqfaEkgl2ZLoXGMRz54Uum0leKQBSaO9aGOrNOAUW8F8iEPQLqotohHCc5rEB1IjSAGwKgwtcTUw8ILDCxvENDGwHHCARNkLPtjlZTnScY2JFg31WpfgIn_'
        },
        {
          id: '2',
          title: 'Machine Learning Fundamentals',
          description: 'Introduction to machine learning concepts',
          instructor: 'Prof. Samuel Harper',
          duration: 25,
          level: 'Beginner',
          price: 79,
          enrolled: true,
          progress: 20,
          rating: 4.6,
          totalStudents: 890,
          imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCr3TzhJpxdvojvSGgly9sbToKy6gdoxmOPo4trgioIkGEZ2qE0J_3KIFDyGxJwiq11xY1iMV9f650z7xVS5Fu3j-ScS_Ks5iKLLa4JyEEZF8IvGj5VqVnldtXKp0kcAsixzcmEEwMy7m-z1ncEM19JzIGrI9MmksZD45pN_OjzatxGxh0YYnT9bkSjzuDhh6EqmVsn3wjHyi25UwV3wPodny9EosxCOCc1KkQv4eEo9PL8F8JrfJQVSDbneHgUJ3Z_aMqELwk3bZaV'
        },
        {
          id: '3',
          title: 'Introduction to Python',
          description: 'Learn Python programming from scratch',
          instructor: 'Dr. Olivia Bennett',
          duration: 30,
          level: 'Beginner',
          price: 59,
          enrolled: true,
          progress: 100,
          rating: 4.9,
          totalStudents: 2100,
          imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiCrJUclbUDeGaEx5gzUcM7U3YLHxfet4JUg8HB_RKa_pbcrny3XZVGo1OGycXwqmAjMk17CGaiFMZ5_FJKxEdTQEWSqDc8jsR9cpgPAUrZ4KGLYtJXGkc7j_KfqHAQgjaAHfnmoqpmQkvbhzDwOtdRlH8_7XMevBpgMXAN9FU-vnI4Sj9ylhSWpWxT_qBrtW69sldkYBywogGpXxRt19L6c7N-_gxJFxMa_MAiKoK1phFmrVthUnCfSmplqfqkIlj22LVA-OZrJZB'
        }
      ];
    }
    
    return courses;
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    return [];
  }
};

export const getLiveExams = async (courseId?: string): Promise<Exam[]> => {
  try {
    const response = await examsService.getPublished();
    console.log('Raw response from getPublished:', JSON.stringify(response, null, 2));
    const now = new Date();

    const exams = extractArrayFromResponse(response, 'exams');
    console.log('Extracted exams from getPublished:', exams);

    return exams
      .filter((exam: any) => {
        const startTime = new Date(exam.startTime);
        const endTime = new Date(exam.endTime);
        const isLive = startTime <= now && now <= endTime;
        const matchesCourse = !courseId || exam.courseId === courseId;
        return isLive && matchesCourse;
      })
      .map((exam: any) => ({
        id: exam.id,
        title: exam.title,
        description: exam.description,
        courseId: exam.courseId,
        courseTitle: exam.course?.title || 'Unknown Course',
        startTime: exam.startTime,
        endTime: exam.endTime,
        duration: exam.duration,
        totalQuestions: exam.totalQuestions || 0,
        totalMarks: exam.totalMarks || 0,
        type: exam.type || 'live',
        status: 'live' as const,
        isEnrolled: exam.isEnrolled || false,
        score: exam.score,
        passed: exam.passed,
      }));
  } catch (error) {
    console.error('Error fetching live exams:', error);
    return [];
  }
};

export const getUpcomingExams = async (limit = 5, courseId?: string): Promise<Exam[]> => {
  try {
    const response = await examsService.getPublished();
    const now = new Date();

    const exams = extractArrayFromResponse(response, 'exams');

    return exams
      .filter((exam: any) => {
        const startTime = new Date(exam.startTime);
        const isUpcoming = startTime > now;
        const matchesCourse = !courseId || exam.courseId === courseId;
        return isUpcoming && matchesCourse;
      })
      .sort((a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, limit)
      .map((exam: any) => ({
        id: exam.id,
        title: exam.title,
        description: exam.description,
        courseId: exam.courseId,
        courseTitle: exam.course?.title || 'Unknown Course',
        startTime: exam.startTime,
        endTime: exam.endTime,
        duration: exam.duration,
        totalQuestions: exam.totalQuestions || 0,
        totalMarks: exam.totalMarks || 0,
        type: exam.type || 'live',
        status: 'upcoming' as const,
        isEnrolled: exam.isEnrolled || false,
        score: exam.score,
        passed: exam.passed,
      }));
  } catch (error) {
    console.error('Error fetching upcoming exams:', error);
    return [];
  }
};

export const getCompletedExams = async (courseId?: string): Promise<Exam[]> => {
  try {
    const response = await examsService.getCompleted();
    console.log('Raw response from getCompleted:', JSON.stringify(response, null, 2));
    const now = new Date();

    const exams = extractArrayFromResponse(response, 'exams');
    console.log('Extracted exams from getCompleted:', exams);

    return exams
      .filter((exam: any) => {
        const endTime = new Date(exam.endTime);
        const isCompleted = endTime < now;
        const matchesCourse = !courseId || exam.courseId === courseId;
        return isCompleted && matchesCourse;
      })
      .sort((a: any, b: any) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime())
      .map((exam: any) => ({
        id: exam.id,
        title: exam.title,
        description: exam.description,
        courseId: exam.courseId,
        courseTitle: exam.course?.title || 'Unknown Course',
        startTime: exam.startTime,
        endTime: exam.endTime,
        duration: exam.duration,
        totalQuestions: exam.totalQuestions || 0,
        totalMarks: exam.totalMarks || 0,
        type: exam.type || 'live',
        status: 'completed' as const,
        isEnrolled: exam.isEnrolled || false,
        score: exam.score,
        passed: exam.passed,
      }));
  } catch (error) {
    console.error('Error fetching completed exams:', error);
    return [];
  }
};

