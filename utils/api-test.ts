import { apiClient } from '../services/api-client';
import { API_ENDPOINTS } from '../constants/api-endpoints';

export const testApiConnectivity = async () => {
  console.log('Testing API connectivity...');
  
  try {
    // Test basic connectivity
    const response = await apiClient.fetch(API_ENDPOINTS.exams.published);
    console.log('✅ API connectivity test passed');
    console.log('Response:', response);
    return { success: true, data: response };
  } catch (error: any) {
    console.log('❌ API connectivity test failed');
    console.log('Error:', error.message);
    
    if (error.response?.status === 401) {
      console.log('✅ API is reachable but requires authentication (expected)');
      return { success: true, requiresAuth: true };
    }
    
    return { success: false, error: error.message };
  }
};

export const testAuthEndpoint = async () => {
  console.log('Testing auth endpoint...');
  
  try {
    const response = await apiClient.fetch(API_ENDPOINTS.auth.me);
    console.log('✅ Auth endpoint test passed');
    return { success: true, data: response };
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.log('✅ Auth endpoint is reachable but requires authentication (expected)');
      return { success: true, requiresAuth: true };
    }
    
    console.log('❌ Auth endpoint test failed:', error.message);
    return { success: false, error: error.message };
  }
};
