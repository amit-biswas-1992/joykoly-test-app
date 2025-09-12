import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getToken } from '../utils/tokenStorage';
import { API_BASE_URL, API_TIMEOUT } from '../constants/config';

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
      timeout: API_TIMEOUT,
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
          //const token = await getToken('accessToken');
          const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFtaXQuYmlzd2FzMTk5MjAyQGdtYWlsLmNvbSIsImlkIjoiNjY2Njk2N2QtMGQ1NC00Y2VkLWJhZDQtNjYyYThlMTEzNDkyIiwidXNlcm5hbWUiOiJhbWl0LmJpc3dhczE5OTIwMkBnbWFpbC5jb20iLCJyb2xlcyI6WyJTVFVERU5UIiwiQURNSU4iXSwicGVybWlzc2lvbnMiOlsiY291cnNlczp2aWV3IiwiY291cnNlczpjcmVhdGUiLCJjb3Vyc2VzOmVkaXQiLCJjb3Vyc2VzOmRlbGV0ZSIsImV4YW1zOnZpZXciLCJleGFtczpjcmVhdGUiLCJleGFtczplZGl0IiwiZXhhbXM6ZGVsZXRlIiwiZXhhbXM6ZXZhbHVhdGUiLCJxdWVzdGlvbnM6dmlldyIsInF1ZXN0aW9uczpjcmVhdGUiLCJxdWVzdGlvbnM6ZWRpdCIsInF1ZXN0aW9uczpkZWxldGUiLCJjbGFzc2VzOnZpZXciLCJjbGFzc2VzOmNyZWF0ZSIsImNsYXNzZXM6ZWRpdCIsImNsYXNzZXM6ZGVsZXRlIiwiYWNhZGVtaWM6dmlldyIsImFjYWRlbWljOmVkaXQiLCJhZG1pc3Npb246dmlldyIsImFkbWlzc2lvbjplZGl0IiwiYmxvZzp2aWV3IiwiYmxvZzpjcmVhdGUiLCJibG9nOmVkaXQiLCJibG9nOmRlbGV0ZSIsImVib29rczp2aWV3IiwiZWJvb2tzOmNyZWF0ZSIsImVib29rczplZGl0IiwiZWJvb2tzOmRlbGV0ZSIsInBheW1lbnRzOnZpZXciLCJwYXltZW50czplZGl0IiwicGF5bWVudHM6ZGVsZXRlIiwic3ViamVjdHM6dmlldyIsInN1YmplY3RzOmNyZWF0ZSIsInN1YmplY3RzOmVkaXQiLCJzdWJqZWN0czpkZWxldGUiLCJjaGFwdGVyczp2aWV3IiwiY2hhcHRlcnM6Y3JlYXRlIiwiY2hhcHRlcnM6ZWRpdCIsImNoYXB0ZXJzOmRlbGV0ZSIsInVzZXJzOnZpZXciLCJ1c2VyczpjcmVhdGUiLCJ1c2VyczplZGl0IiwidXNlcnM6ZGVsZXRlIiwicm9sZXM6dmlldyIsInJvbGVzOmNyZWF0ZSIsInJvbGVzOmVkaXQiLCJyb2xlczpkZWxldGUiLCJzeXN0ZW06c2V0dGluZ3MiLCJhbmFseXRpY3M6dmlldyJdLCJpYXQiOjE3NTU2Nzk5MjEsImV4cCI6MTc2MzQ1NTkyMX0.3-bod7NJ6Jx4_AqnGrqC_XDFaipkVzVKu4yVWx-BwR0';
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
          console.error('Full URL:', `${error.config?.baseURL}${error.config?.url}`);
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
