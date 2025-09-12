import { apiClient } from './api-client';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { ProfileData, ProfileUpdateData, Purchase, UserPreferences } from '../types/profile';

export const userService = {
  // Basic profile operations
  getProfile: (): Promise<{ success: boolean; data?: ProfileData; error?: string }> =>
    apiClient.fetch(API_ENDPOINTS.user.profile),

  updateProfile: (data: ProfileUpdateData): Promise<{ success: boolean; data?: ProfileData; error?: string }> =>
    apiClient.fetch(API_ENDPOINTS.user.updateProfile, {
      method: 'PUT',
      body: data,
    }),

  // Avatar operations
  updateAvatar: (file: File): Promise<{ success: boolean; avatarUrl?: string; error?: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return apiClient.fetch(`${API_ENDPOINTS.user.updateProfile}/avatar`, {
      method: 'POST',
      body: formData,
    });
  },

  // Subject and goals management
  addFavoriteSubject: (subject: string): Promise<{ success: boolean; error?: string }> =>
    apiClient.fetch(`${API_ENDPOINTS.user.profile}/subjects`, {
      method: 'POST',
      body: { subject },
    }),

  removeFavoriteSubject: (subject: string): Promise<{ success: boolean; error?: string }> =>
    apiClient.fetch(`${API_ENDPOINTS.user.profile}/subjects`, {
      method: 'DELETE',
      body: { subject },
    }),

  addStudyGoal: (goal: string): Promise<{ success: boolean; error?: string }> =>
    apiClient.fetch(`${API_ENDPOINTS.user.profile}/goals`, {
      method: 'POST',
      body: { goal },
    }),

  removeStudyGoal: (goal: string): Promise<{ success: boolean; error?: string }> =>
    apiClient.fetch(`${API_ENDPOINTS.user.profile}/goals`, {
      method: 'DELETE',
      body: { goal },
    }),

  // Academic records and achievements
  addAcademicRecord: (record: any): Promise<{ success: boolean; error?: string }> =>
    apiClient.fetch(`${API_ENDPOINTS.user.profile}/academic`, {
      method: 'POST',
      body: record,
    }),

  removeAcademicRecord: (recordId: string): Promise<{ success: boolean; error?: string }> =>
    apiClient.fetch(`${API_ENDPOINTS.user.profile}/academic/${recordId}`, {
      method: 'DELETE',
    }),

  addAchievement: (achievement: any): Promise<{ success: boolean; error?: string }> =>
    apiClient.fetch(`${API_ENDPOINTS.user.profile}/achievements`, {
      method: 'POST',
      body: achievement,
    }),

  removeAchievement: (achievementId: string): Promise<{ success: boolean; error?: string }> =>
    apiClient.fetch(`${API_ENDPOINTS.user.profile}/achievements/${achievementId}`, {
      method: 'DELETE',
    }),

  // Social links
  addSocialLink: (link: any): Promise<{ success: boolean; error?: string }> =>
    apiClient.fetch(`${API_ENDPOINTS.user.profile}/social-links`, {
      method: 'POST',
      body: link,
    }),

  removeSocialLink: (linkId: string): Promise<{ success: boolean; error?: string }> =>
    apiClient.fetch(`${API_ENDPOINTS.user.profile}/social-links/${linkId}`, {
      method: 'DELETE',
    }),

  // Address management
  addAddress: (address: any): Promise<{ success: boolean; error?: string }> =>
    apiClient.fetch(`${API_ENDPOINTS.user.profile}/addresses`, {
      method: 'POST',
      body: address,
    }),

  updateAddress: (addressId: string, address: any): Promise<{ success: boolean; error?: string }> =>
    apiClient.fetch(`${API_ENDPOINTS.user.profile}/addresses/${addressId}`, {
      method: 'PUT',
      body: address,
    }),

  removeAddress: (addressId: string): Promise<{ success: boolean; error?: string }> =>
    apiClient.fetch(`${API_ENDPOINTS.user.profile}/addresses/${addressId}`, {
      method: 'DELETE',
    }),

  // Dashboard and other operations
  getDashboard: () => apiClient.fetch('/api/v1/user/dashboard'),

  getPurchases: (): Promise<{ success: boolean; data?: Purchase[]; error?: string }> =>
    apiClient.fetch(API_ENDPOINTS.user.purchases),

  getEnrollments: () => apiClient.fetch(API_ENDPOINTS.user.enrollments),

  getProgress: () => apiClient.fetch(API_ENDPOINTS.user.progress),

  getNotifications: () => apiClient.fetch(API_ENDPOINTS.user.notifications),

  getPreferences: (): Promise<{ success: boolean; data?: UserPreferences; error?: string }> =>
    apiClient.fetch(API_ENDPOINTS.user.preferences),

  updatePreferences: (data: UserPreferences): Promise<{ success: boolean; error?: string }> =>
    apiClient.fetch(API_ENDPOINTS.user.preferences, {
      method: 'PUT',
      body: data,
    }),
};
