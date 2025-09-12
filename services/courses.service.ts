import { apiClient } from './api-client';
import { API_ENDPOINTS } from '../constants/api-endpoints';

export const coursesService = {
  getAll: () => apiClient.fetch(API_ENDPOINTS.courses.list),

  getFeatured: () => apiClient.fetch(API_ENDPOINTS.courses.featured),

  getEnrolled: () => apiClient.fetch(API_ENDPOINTS.courses.enrolled),

  getCourse: (id: string) => apiClient.fetch(API_ENDPOINTS.courses.detail(id)),

  getCourseBySlug: (slug: string) => apiClient.fetch(`${API_ENDPOINTS.courses.list}/slug/${slug}`),

  purchase: (id: string, paymentData: any) =>
    apiClient.fetch(API_ENDPOINTS.courses.purchase(id), {
      method: 'POST',
      body: paymentData,
    }),

  getProgress: (id: string) => apiClient.fetch(API_ENDPOINTS.courses.progress(id)),

  updateProgress: (id: string, progress: number) =>
    apiClient.fetch(API_ENDPOINTS.courses.progress(id), {
      method: 'PATCH',
      body: { progress },
    }),

  getBatches: () => apiClient.fetch(API_ENDPOINTS.courses.batches),
};
