import { apiClient } from './api-client';
import { API_ENDPOINTS } from '../constants/api-endpoints';

export interface StoreCourse {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  imageUrl?: string;
  instructor: string;
  duration: string; // Changed to string to match API
  level: string;
  price: number;
  originalPrice?: number;
  enrolled: boolean;
  progress?: number;
  rating?: number;
  totalStudents?: number;
  category?: string;
  isFeatured?: boolean;
  slug?: string;
  numberOfClasses?: number;
  batchName?: string;
}

// Mock courses for testing when API is not available
const getMockCourses = (): StoreCourse[] => {
  return [
    {
      id: '1',
      title: 'জয়কলি - Model Test',
      description: 'Comprehensive model test series for all types of admission tests and competitive exams.',
      imageUrl: 'https://joykoly.sgp1.digitaloceanspaces.com/joykoly/courses/395d9c86-2d50-48aa-ab0a-fb7d5724568e.webp',
      instructor: 'Joykoly Team',
      duration: '10 months',
      level: 'beginner',
      price: 0,
      originalPrice: 3000,
      enrolled: false,
      rating: 4.8,
      totalStudents: 300,
      category: 'HSC',
      slug: 'model-test-2025',
      numberOfClasses: 0,
      batchName: 'HSC 25',
      isFeatured: false,
    },
    {
      id: '2',
      title: 'জয়কলি - Nursing Aid',
      description: 'Complete preparation course for Nursing Institute admission tests and nursing career preparation.',
      imageUrl: 'https://joykoly.sgp1.digitaloceanspaces.com/joykoly/courses/b11241d6-4eb8-4dde-95d3-565c9276db1c.webp',
      instructor: 'Joykoly Team',
      duration: '10 months',
      level: 'Admission',
      price: 0,
      originalPrice: 5000,
      enrolled: false,
      rating: 4.7,
      totalStudents: 75,
      category: 'ADMISSION',
      slug: 'nursing-aid-2025',
      numberOfClasses: 35,
      isFeatured: false,
    },
    {
      id: '3',
      title: 'জয়কলি - Medi Aid',
      description: 'Complete preparation course for Medical College admission tests including all government and private medical colleges.',
      imageUrl: 'https://joykoly.sgp1.digitaloceanspaces.com/joykoly/courses/0b54f6f0-3fc5-4182-b8a9-4c297cb02710.webp',
      instructor: 'Joykoly Team',
      duration: '10 months',
      level: 'Admission',
      price: 0,
      originalPrice: 10000,
      enrolled: false,
      rating: 4.9,
      totalStudents: 250,
      category: 'ADMISSION',
      slug: 'medi-aid-2025',
      numberOfClasses: 70,
      isFeatured: false,
    },
    {
      id: '4',
      title: 'জয়কলি - Engineering Aid',
      description: 'Complete preparation course for Engineering University admission tests including BUET, CUET, RUET, and other engineering universities.',
      imageUrl: 'https://joykoly.sgp1.digitaloceanspaces.com/joykoly/courses/cfad84ae-3234-4dba-ae9e-b8816a5d888b.webp',
      instructor: 'Joykoly Team',
      duration: '10 months',
      level: 'Admission',
      price: 0,
      originalPrice: 8000,
      enrolled: false,
      rating: 4.6,
      totalStudents: 200,
      category: 'ADMISSION',
      slug: 'eng-aid-2025',
      numberOfClasses: 60,
      isFeatured: false,
    },
    {
      id: '5',
      title: 'জয়কলি - Varsity Aid',
      description: 'Comprehensive preparation for general university admission tests including DU, JU, RU, CU and other public universities.',
      imageUrl: 'https://joykoly.sgp1.digitaloceanspaces.com/joykoly/courses/2c76a515-2bab-4822-8fd9-bd499f394e7a.webp',
      instructor: 'Joykoly Team',
      duration: '10 months',
      level: 'Admission',
      price: 0,
      originalPrice: 7000,
      enrolled: false,
      rating: 4.5,
      totalStudents: 180,
      category: 'ADMISSION',
      slug: 'varsity-aid-2025',
      numberOfClasses: 55,
      isFeatured: false,
    },
    {
      id: '6',
      title: 'জয়কলি - GST Aid',
      description: 'Specialized preparation course for Government Service and Teaching (GST) admission tests.',
      imageUrl: 'https://joykoly.sgp1.digitaloceanspaces.com/joykoly/courses/25a5aa0a-2874-4ddc-8e9d-430a89d065c1.webp',
      instructor: 'Joykoly Team',
      duration: '10 months',
      level: 'Admission',
      price: 0,
      originalPrice: 6000,
      enrolled: false,
      rating: 4.4,
      totalStudents: 150,
      category: 'ADMISSION',
      slug: 'gst-aid-2025',
      numberOfClasses: 45,
      isFeatured: false,
    }
  ];
};

// Helper function to map API course data to StoreCourse interface
const mapApiCourseToStoreCourse = (apiCourse: any): StoreCourse => {
  return {
    id: apiCourse.id,
    title: apiCourse.title,
    description: apiCourse.description,
    imageUrl: apiCourse.imageUrl,
    instructor: apiCourse.instructors?.[0]?.name || 'Unknown Instructor',
    duration: apiCourse.duration || 'N/A',
    level: apiCourse.level || 'beginner',
    price: parseFloat(apiCourse.discountPrice || apiCourse.price || '0'),
    originalPrice: parseFloat(apiCourse.basePrice || '0'),
    enrolled: false, // This would need to be determined by checking user enrollments
    rating: parseFloat(apiCourse.rating || '0'),
    totalStudents: apiCourse.totalEnrollments || 0,
    category: apiCourse.category,
    slug: apiCourse.slug,
    numberOfClasses: apiCourse.numberOfClasses || 0,
    batchName: apiCourse.batchName,
    isFeatured: false, // This could be determined by some logic or API field
  };
};

export const storeService = {
  getFeaturedCourses: async (): Promise<StoreCourse[]> => {
    try {
      // For now, get all courses and mark first 3 as featured
      const response = await apiClient.fetch(API_ENDPOINTS.courses.list);
      const courses = Array.isArray(response) ? response : (response as any)?.data || [];
      
      if (courses.length === 0) {
        return getMockCourses().slice(0, 3).map(course => ({ ...course, isFeatured: true }));
      }
      
      return courses.slice(0, 3).map((course: any) => ({
        ...mapApiCourseToStoreCourse(course),
        isFeatured: true
      }));
    } catch (error) {
      console.error('Error fetching featured courses:', error);
      return getMockCourses().slice(0, 3).map(course => ({ ...course, isFeatured: true }));
    }
  },

  getAllCourses: async (): Promise<StoreCourse[]> => {
    try {
      const response = await apiClient.fetch(API_ENDPOINTS.courses.list);
      const courses = Array.isArray(response) ? response : (response as any)?.data || [];
      
      if (courses.length === 0) {
        return getMockCourses();
      }
      
      return courses.map(mapApiCourseToStoreCourse);
    } catch (error) {
      console.error('Error fetching all courses:', error);
      return getMockCourses();
    }
  },

  getCourseById: async (id: string): Promise<StoreCourse | null> => {
    try {
      const response = await apiClient.fetch(API_ENDPOINTS.courses.detail(id));
      const course = (response as any)?.data || response;
      return course ? mapApiCourseToStoreCourse(course) : null;
    } catch (error) {
      console.error('Error fetching course by ID:', error);
      return null;
    }
  },

  getCourseBySlug: async (slug: string): Promise<StoreCourse | null> => {
    try {
      const response = await apiClient.fetch(`${API_ENDPOINTS.courses.list}/slug/${slug}`);
      const course = (response as any)?.data || response;
      return course ? mapApiCourseToStoreCourse(course) : null;
    } catch (error) {
      console.error('Error fetching course by slug:', error);
      return null;
    }
  },

  purchaseCourse: async (id: string, paymentData?: any) => {
    try {
      const response = await apiClient.fetch(API_ENDPOINTS.courses.purchase(id), {
        method: 'POST',
        body: paymentData || {},
      });
      return response;
    } catch (error: any) {
      console.error('Error purchasing course:', error);
      
      // Handle specific error cases
      if (error?.status === 409 || error?.data?.statusCode === 409) {
        // User is already enrolled - this is not really an error, just a conflict
        const conflictError = new Error('User is already enrolled in this course');
        (conflictError as any).data = {
          statusCode: 409,
          message: 'User is already enrolled in this course',
          error: 'Conflict'
        };
        throw conflictError;
      }
      
      throw error;
    }
  },
};
