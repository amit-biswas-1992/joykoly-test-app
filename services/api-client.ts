import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getToken } from '../utils/tokenStorage';

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
      baseURL: '',
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
