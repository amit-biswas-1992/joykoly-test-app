import { apiClient } from './api-client';
import { API_ENDPOINTS } from '../constants/api-endpoints';

export const classesService = {
  getAll: () => apiClient.fetch(API_ENDPOINTS.classes.list),

  getByCourse: (courseId: string, includePast = false) => {
    const params = new URLSearchParams();
    if (courseId && courseId !== 'all') {
      params.append('course', courseId);
    }
    if (!includePast) {
      params.append('includePast', 'false');
    }

    const url = `${API_ENDPOINTS.classes.list}${params.toString() ? `?${params.toString()}` : ''}`;
    return apiClient.fetch(url);
  },

  getClass: (id: string) => apiClient.fetch(API_ENDPOINTS.classes.detail(id)),

  join: (id: string) =>
    apiClient.fetch(API_ENDPOINTS.classes.join(id), {
      method: 'POST',
    }),

  getRecordings: (id: string) => apiClient.fetch(API_ENDPOINTS.classes.recordings(id)),

  getNotes: (id: string) => apiClient.fetch(API_ENDPOINTS.classes.notes(id)),

  getComments: (id: string) => apiClient.fetch(API_ENDPOINTS.classes.comments(id)),

  addComment: (id: string, comment: string) =>
    apiClient.fetch(API_ENDPOINTS.classes.comments(id), {
      method: 'POST',
      body: { comment },
    }),

  markAttendance: (id: string, status: string) =>
    apiClient.fetch(API_ENDPOINTS.classes.attendance(id), {
      method: 'POST',
      body: { status },
    }),

  getMaterials: (id: string) => apiClient.fetch(API_ENDPOINTS.classes.materials(id)),
};
