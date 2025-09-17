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
    return extractArrayFromResponse(response, 'courses');
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

