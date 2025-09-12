import { apiClient } from './api-client';
import { API_ENDPOINTS } from '../constants/api-endpoints';

export const authService = {
  login: (email: string, password: string) =>
    apiClient.fetch(API_ENDPOINTS.auth.login, {
      method: 'POST',
      body: { email, password },
    }),

  register: (data: any) =>
    apiClient.fetch(API_ENDPOINTS.auth.register, {
      method: 'POST',
      body: data,
    }),

  logout: () =>
    apiClient.fetch(API_ENDPOINTS.auth.logout, {
      method: 'POST',
    }),

  getProfile: () => apiClient.fetch(API_ENDPOINTS.auth.profile),

  getMe: () => apiClient.fetch(API_ENDPOINTS.auth.me),

  completeOnboarding: (data: any) =>
    apiClient.fetch(API_ENDPOINTS.auth.completeOnboarding, {
      method: 'POST',
      body: data,
    }),

  forgotPassword: (email: string) =>
    apiClient.fetch(API_ENDPOINTS.auth.forgotPassword, {
      method: 'POST',
      body: { email },
    }),

  resetPassword: (token: string, password: string) =>
    apiClient.fetch(API_ENDPOINTS.auth.resetPassword, {
      method: 'POST',
      body: { token, password },
    }),
};
