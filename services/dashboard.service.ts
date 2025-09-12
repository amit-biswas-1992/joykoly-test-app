import { apiClient } from './api-client';

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
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
    const [enrolledCourses, liveExams, upcomingExams, completedExams, practiceExams] =
      await Promise.all([
        getEnrolledCourses(),
        getLiveExams(),
        getUpcomingExams(),
        getCompletedExams(),
        getPracticeExams(),
      ]);

    return {
      enrolledCourses,
      liveExams,
      upcomingExams,
      completedExams,
      practiceExams,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

export const getEnrolledCourses = async (): Promise<Course[]> => {
  try {
    const response = await apiClient.courses.getEnrolled();
    return response || [];
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    return [];
  }
};

export const getLiveExams = async (courseId?: string): Promise<Exam[]> => {
  try {
    const response = await apiClient.exams.getPublished();
    const now = new Date();

    return (response || [])
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
    const response = await apiClient.exams.getPublished();
    const now = new Date();

    return (response || [])
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
    const response = await apiClient.exams.getCompleted();
    const now = new Date();

    return (response || [])
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

export const getPracticeExams = async (): Promise<Exam[]> => {
  try {
    const response = await apiClient.exams.getPractice();

    return (response || []).map((exam: any) => ({
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
      type: 'practice' as const,
      status: 'upcoming' as const,
      isEnrolled: exam.isEnrolled || false,
      score: exam.score,
      passed: exam.passed,
    }));
  } catch (error) {
    console.error('Error fetching practice exams:', error);
    return [];
  }
};
