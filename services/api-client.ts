import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getToken } from '../utils/tokenStorage';
import { API_BASE_URL } from '../constants/api-endpoints';

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiOptions {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
}

class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        try {
          const token = await getToken('accessToken');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Token added to request:', token.substring(0, 20) + '...');
          } else {
            console.warn('No token found in storage for request:', config.url);
          }
        } catch (error) {
          console.error('Failed to get token from storage:', error);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          console.log('Unauthorized - token may be expired');
        } else if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
          console.error('Network Error - Check your internet connection and API server status');
          console.error('Request URL:', error.config?.url);
          console.error('Base URL:', error.config?.baseURL);
        } else {
          console.error('API Error:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            url: error.config?.url,
            method: error.config?.method,
          });
        }
        return Promise.reject(error);
      }
    );
  }

  private async handleResponse<T>(response: AxiosResponse<T>): Promise<T> {
    return response.data;
  }

  async fetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options;

    const config: AxiosRequestConfig = {
      method,
      url: path,
      headers: {
        ...headers,
      },
      ...(body ? { data: body } : {}),
    };

    try {
      const response = await this.axiosInstance.request<T>(config);
      return this.handleResponse<T>(response);
    } catch (error) {
      console.error(`API Error for ${path}:`, error);
      throw error;
    }
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Export error handling utility
export const handleApiError = (error: unknown): void => {
  console.error('API Error:', error);
};
