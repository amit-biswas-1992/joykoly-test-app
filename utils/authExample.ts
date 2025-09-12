import { saveToken, getToken, deleteToken } from './tokenStorage';
import { authService } from '../services/auth.service';

// Example usage for future login implementation
export const authExample = {
  // Login and store token securely
  login: async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      
      // Store the token securely
      if (response.token) {
        await saveToken('accessToken', response.token);
        console.log('Token stored securely');
      }
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  // Get current token
  getCurrentToken: async () => {
    try {
      return await getToken('accessToken');
    } catch (error) {
      console.error('Failed to get token:', error);
      return null;
    }
  },

  // Logout and remove token
  logout: async () => {
    try {
      // Call logout API
      await authService.logout();
      
      // Remove token from secure storage
      await deleteToken('accessToken');
      console.log('Token removed and user logged out');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still remove token even if API call fails
      await deleteToken('accessToken');
    }
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    try {
      const token = await getToken('accessToken');
      return !!token;
    } catch (error) {
      console.error('Failed to check authentication:', error);
      return false;
    }
  },
};
