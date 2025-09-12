// Environment configuration
export const isDevelopment = __DEV__;

// API Configuration
export const API_CONFIG = {
  development: {
    baseUrl: 'https://api.joykolyacademy.com',
    timeout: 10000,
  },
  production: {
    baseUrl: 'https://api.joykolyacademy.com',
    timeout: 15000,
  },
};

export const getApiConfig = () => {
  return isDevelopment ? API_CONFIG.development : API_CONFIG.production;
};

export const API_BASE_URL = getApiConfig().baseUrl;
export const API_TIMEOUT = getApiConfig().timeout;
