import { apiClient } from './api-client';
import { API_ENDPOINTS } from '../constants/api-endpoints';

export const examsService = {
  getAll: () => apiClient.fetch(API_ENDPOINTS.exams.list),

  getPublished: () => apiClient.fetch(API_ENDPOINTS.exams.published),

  getByCourse: (courseId: string, includePast = false) => {
    const params = new URLSearchParams();
    if (includePast) {
      params.append('includePast', 'true');
    }
    const queryString = params.toString();
    return apiClient.fetch(
      `${API_ENDPOINTS.exams.byCourse(courseId)}${queryString ? `?${queryString}` : ''}`
    );
  },

  getPublishedByCourse: (courseId: string) =>
    apiClient.fetch(`${API_ENDPOINTS.exams.published}?course=${courseId}`),

  getExam: (id: string) => apiClient.fetch(API_ENDPOINTS.exams.detail(id)),

  getQuestions: (id: string) => apiClient.fetch(API_ENDPOINTS.exams.questions(id)),

  submit: (id: string, answers: any) =>
    apiClient.fetch(API_ENDPOINTS.exams.submit(id), {
      method: 'POST',
      body: { answers },
    }),

  submitQuestion: (examId: string, questionId: string, answer: any) =>
    apiClient.fetch(API_ENDPOINTS.exams.submitQuestion(examId)(questionId), {
      method: 'POST',
      body: { answer },
    }),

  submitMcq: (examId: string, questionId: string, selectedOption: string) =>
    apiClient.fetch(API_ENDPOINTS.exams.submitMcqQuestion(examId)(questionId), {
      method: 'POST',
      body: { selectedOption },
    }),

  submitWritten: (examId: string, questionId: string, answer: string) =>
    apiClient.fetch(API_ENDPOINTS.exams.submitWrittenQuestion(examId)(questionId), {
      method: 'POST',
      body: { answer },
    }),

  saveAnswer: (examId: string, questionId: string, answer: any) =>
    apiClient.fetch(API_ENDPOINTS.exams.saveAnswer(examId, questionId), {
      method: 'POST',
      body: { answer },
    }),

  saveProgress: (id: string, progress: any) =>
    apiClient.fetch(API_ENDPOINTS.exams.saveProgress(id), {
      method: 'POST',
      body: { progress },
    }),

  getResults: (id: string) => apiClient.fetch(API_ENDPOINTS.exams.results(id)),

  getLeaderboard: (id: string) => apiClient.fetch(API_ENDPOINTS.exams.leaderboard(id)),

  getSubmissions: (id: string) => apiClient.fetch(API_ENDPOINTS.exams.submissions(id)),

  getMySubmissions: (id: string) => apiClient.fetch(API_ENDPOINTS.exams.mySubmissions(id)),

  getParticipation: (id: string) => apiClient.fetch(API_ENDPOINTS.exams.participation(id)),

  getCompleted: () => apiClient.fetch(API_ENDPOINTS.exams.completed),
};
