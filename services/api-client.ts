import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_ENDPOINTS } from '../constants/api-endpoints';

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
  private authToken: string;

  constructor() {
    this.authToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFtaXQuYmlzd2FzMTk5MjAyQGdtYWlsLmNvbSIsImlkIjoiNjY2Njk2N2QtMGQ1NC00Y2VkLWJhZDQtNjYyYThlMTEzNDkyIiwidXNlcm5hbWUiOiJhbWl0LmJpc3dhczE5OTIwMkBnbWFpbC5jb20iLCJyb2xlcyI6WyJTVFVERU5UIiwiQURNSU4iXSwicGVybWlzc2lvbnMiOlsiY291cnNlczp2aWV3IiwiY291cnNlczpjcmVhdGUiLCJjb3Vyc2VzOmVkaXQiLCJjb3Vyc2VzOmRlbGV0ZSIsImV4YW1zOnZpZXciLCJleGFtczpjcmVhdGUiLCJleGFtczplZGl0IiwiZXhhbXM6ZGVsZXRlIiwiZXhhbXM6ZXZhbHVhdGUiLCJxdWVzdGlvbnM6dmlldyIsInF1ZXN0aW9uczpjcmVhdGUiLCJxdWVzdGlvbnM6ZWRpdCIsInF1ZXN0aW9uczpkZWxldGUiLCJjbGFzc2VzOnZpZXciLCJjbGFzc2VzOmNyZWF0ZSIsImNsYXNzZXM6ZWRpdCIsImNsYXNzZXM6ZGVsZXRlIiwiYWNhZGVtaWM6dmlldyIsImFjYWRlbWljOmVkaXQiLCJhZG1pc3Npb246dmlldyIsImFkbWlzc2lvbjplZGl0IiwiYmxvZzp2aWV3IiwiYmxvZzpjcmVhdGUiLCJibG9nOmVkaXQiLCJibG9nOmRlbGV0ZSIsImVib29rczp2aWV3IiwiZWJvb2tzOmNyZWF0ZSIsImVib29rczplZGl0IiwiZWJvb2tzOmRlbGV0ZSIsInBheW1lbnRzOnZpZXciLCJwYXltZW50czplZGl0IiwicGF5bWVudHM6ZGVsZXRlIiwic3ViamVjdHM6dmlldyIsInN1YmplY3RzOmNyZWF0ZSIsInN1YmplY3RzOmVkaXQiLCJzdWJqZWN0czpkZWxldGUiLCJjaGFwdGVyczp2aWV3IiwiY2hhcHRlcnM6Y3JlYXRlIiwiY2hhcHRlcnM6ZWRpdCIsImNoYXB0ZXJzOmRlbGV0ZSIsInVzZXJzOnZpZXciLCJ1c2VyczpjcmVhdGUiLCJ1c2VyczplZGl0IiwidXNlcnM6ZGVsZXRlIiwicm9sZXM6dmlldyIsInJvbGVzOmNyZWF0ZSIsInJvbGVzOmVkaXQiLCJyb2xlczpkZWxldGUiLCJzeXN0ZW06c2V0dGluZ3MiLCJhbmFseXRpY3M6dmlldyJdLCJpYXQiOjE3NTU2Nzk5MjEsImV4cCI6MTc2MzQ1NTkyMX0.3-bod7NJ6Jx4_AqnGrqC_XDFaipkVzVKu4yVWx-BwR0';

    this.axiosInstance = axios.create({
      baseURL: '',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.authToken}`,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
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

  // Auth methods
  auth = {
    login: (email: string, password: string) =>
      this.fetch(API_ENDPOINTS.auth.login, {
        method: 'POST',
        body: { email, password },
      }),

    register: (data: any) =>
      this.fetch(API_ENDPOINTS.auth.register, {
        method: 'POST',
        body: data,
      }),

    logout: () =>
      this.fetch(API_ENDPOINTS.auth.logout, {
        method: 'POST',
      }),

    getProfile: () => this.fetch(API_ENDPOINTS.auth.profile),

    getMe: () => this.fetch(API_ENDPOINTS.auth.me),

    completeOnboarding: (data: any) =>
      this.fetch(API_ENDPOINTS.auth.completeOnboarding, {
        method: 'POST',
        body: data,
      }),

    forgotPassword: (email: string) =>
      this.fetch(API_ENDPOINTS.auth.forgotPassword, {
        method: 'POST',
        body: { email },
      }),

    resetPassword: (token: string, password: string) =>
      this.fetch(API_ENDPOINTS.auth.resetPassword, {
        method: 'POST',
        body: { token, password },
      }),
  };

  // Course methods
  courses = {
    getAll: () => this.fetch(API_ENDPOINTS.courses.list),

    getFeatured: () => this.fetch(API_ENDPOINTS.courses.featured),

    getEnrolled: () => this.fetch(API_ENDPOINTS.courses.enrolled),

    getCourse: (id: string) => this.fetch(API_ENDPOINTS.courses.detail(id)),

    getCourseBySlug: (slug: string) => this.fetch(`${API_ENDPOINTS.courses.list}/slug/${slug}`),

    purchase: (id: string, paymentData: any) =>
      this.fetch(API_ENDPOINTS.courses.purchase(id), {
        method: 'POST',
        body: paymentData,
      }),

    getProgress: (id: string) => this.fetch(API_ENDPOINTS.courses.progress(id)),

    updateProgress: (id: string, progress: number) =>
      this.fetch(API_ENDPOINTS.courses.progress(id), {
        method: 'PATCH',
        body: { progress },
      }),

    getBatches: () => this.fetch(API_ENDPOINTS.courses.batches),
  };

  // Class methods
  classes = {
    getAll: () => this.fetch(API_ENDPOINTS.classes.list),

    getByCourse: (courseId: string, includePast = false) => {
      const params = new URLSearchParams();
      if (courseId && courseId !== 'all') {
        params.append('course', courseId);
      }
      if (!includePast) {
        params.append('includePast', 'false');
      }

      const url = `${API_ENDPOINTS.classes.list}${params.toString() ? `?${params.toString()}` : ''}`;
      return this.fetch(url);
    },

    getClass: (id: string) => this.fetch(API_ENDPOINTS.classes.detail(id)),

    join: (id: string) =>
      this.fetch(API_ENDPOINTS.classes.join(id), {
        method: 'POST',
      }),

    getRecordings: (id: string) => this.fetch(API_ENDPOINTS.classes.recordings(id)),

    getNotes: (id: string) => this.fetch(API_ENDPOINTS.classes.notes(id)),

    getComments: (id: string) => this.fetch(API_ENDPOINTS.classes.comments(id)),

    addComment: (id: string, comment: string) =>
      this.fetch(API_ENDPOINTS.classes.comments(id), {
        method: 'POST',
        body: { comment },
      }),

    markAttendance: (id: string, status: string) =>
      this.fetch(API_ENDPOINTS.classes.attendance(id), {
        method: 'POST',
        body: { status },
      }),

    getMaterials: (id: string) => this.fetch(API_ENDPOINTS.classes.materials(id)),
  };

  // Exam methods
  exams = {
    getAll: () => this.fetch(API_ENDPOINTS.exams.list),

    getPublished: () => this.fetch(API_ENDPOINTS.exams.published),

    getByCourse: (courseId: string, includePast = false) => {
      const params = new URLSearchParams();
      if (includePast) {
        params.append('includePast', 'true');
      }
      const queryString = params.toString();
      return this.fetch(
        `${API_ENDPOINTS.exams.byCourse(courseId)}${queryString ? `?${queryString}` : ''}`
      );
    },

    getPublishedByCourse: (courseId: string) =>
      this.fetch(`${API_ENDPOINTS.exams.published}?course=${courseId}`),

    getExam: (id: string) => this.fetch(API_ENDPOINTS.exams.detail(id)),

    getQuestions: (id: string) => this.fetch(API_ENDPOINTS.exams.questions(id)),

    submit: (id: string, answers: any) =>
      this.fetch(API_ENDPOINTS.exams.submit(id), {
        method: 'POST',
        body: { answers },
      }),

    submitQuestion: (examId: string, questionId: string, answer: any) =>
      this.fetch(API_ENDPOINTS.exams.submitQuestion(examId)(questionId), {
        method: 'POST',
        body: { answer },
      }),

    submitMcq: (examId: string, questionId: string, selectedOption: string) =>
      this.fetch(API_ENDPOINTS.exams.submitMcqQuestion(examId)(questionId), {
        method: 'POST',
        body: { selectedOption },
      }),

    submitWritten: (examId: string, questionId: string, answer: string) =>
      this.fetch(API_ENDPOINTS.exams.submitWrittenQuestion(examId)(questionId), {
        method: 'POST',
        body: { answer },
      }),

    saveAnswer: (examId: string, questionId: string, answer: any) =>
      this.fetch(API_ENDPOINTS.exams.saveAnswer(examId, questionId), {
        method: 'POST',
        body: { answer },
      }),

    saveProgress: (id: string, progress: any) =>
      this.fetch(API_ENDPOINTS.exams.saveProgress(id), {
        method: 'POST',
        body: { progress },
      }),

    getResults: (id: string) => this.fetch(API_ENDPOINTS.exams.results(id)),

    getLeaderboard: (id: string) => this.fetch(API_ENDPOINTS.exams.leaderboard(id)),

    getSubmissions: (id: string) => this.fetch(API_ENDPOINTS.exams.submissions(id)),

    getMySubmissions: (id: string) => this.fetch(API_ENDPOINTS.exams.mySubmissions(id)),

    getPractice: () => this.fetch(API_ENDPOINTS.exams.practice),

    getCompleted: () => this.fetch(API_ENDPOINTS.exams.completed),
  };

  // User methods
  user = {
    getProfile: () => this.fetch(API_ENDPOINTS.user.profile),

    updateProfile: (data: any) =>
      this.fetch(API_ENDPOINTS.user.updateProfile, {
        method: 'PUT',
        body: data,
      }),

    getDashboard: () => this.fetch(API_ENDPOINTS.user.dashboard),

    getPurchases: () => this.fetch(API_ENDPOINTS.user.purchases),

    getEnrollments: () => this.fetch(API_ENDPOINTS.user.enrollments),

    getProgress: () => this.fetch(API_ENDPOINTS.user.progress),

    getNotifications: () => this.fetch(API_ENDPOINTS.user.notifications),

    getPreferences: () => this.fetch(API_ENDPOINTS.user.preferences),

    updatePreferences: (data: any) =>
      this.fetch(API_ENDPOINTS.user.preferences, {
        method: 'PUT',
        body: data,
      }),
  };
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Export error handling utility
export const handleApiError = (error: unknown): void => {
  console.error('API Error:', error);
};
