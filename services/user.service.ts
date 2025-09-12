import { apiClient } from './api-client';
import { API_ENDPOINTS } from '../constants/api-endpoints';

export const userService = {
  getProfile: () => apiClient.fetch(API_ENDPOINTS.user.profile),

  updateProfile: (data: any) =>
    apiClient.fetch(API_ENDPOINTS.user.updateProfile, {
      method: 'PUT',
      body: data,
    }),

  getDashboard: () => apiClient.fetch(API_ENDPOINTS.user.dashboard),

  getPurchases: () => apiClient.fetch(API_ENDPOINTS.user.purchases),

  getEnrollments: () => apiClient.fetch(API_ENDPOINTS.user.enrollments),

  getProgress: () => apiClient.fetch(API_ENDPOINTS.user.progress),

  getNotifications: () => apiClient.fetch(API_ENDPOINTS.user.notifications),

  getPreferences: () => apiClient.fetch(API_ENDPOINTS.user.preferences),

  updatePreferences: (data: any) =>
    apiClient.fetch(API_ENDPOINTS.user.preferences, {
      method: 'PUT',
      body: data,
    }),
};
