export const API_BASE_URL = 'https://api.joykoly.com';
export const API_VERSION = 'v1';

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/${API_VERSION}/auth/login`,
    register: `${API_BASE_URL}/${API_VERSION}/auth/register`,
    logout: `${API_BASE_URL}/${API_VERSION}/auth/logout`,
    refresh: `${API_BASE_URL}/${API_VERSION}/auth/refresh`,
    profile: `${API_BASE_URL}/${API_VERSION}/auth/profile`,
    me: `${API_BASE_URL}/${API_VERSION}/auth/me`,
    completeOnboarding: `${API_BASE_URL}/${API_VERSION}/auth/complete-onboarding`,
    forgotPassword: `${API_BASE_URL}/${API_VERSION}/auth/forgot-password`,
    resetPassword: `${API_BASE_URL}/${API_VERSION}/auth/reset-password`,
  },
  courses: {
    list: `${API_BASE_URL}/${API_VERSION}/courses`,
    detail: (id: string) => `${API_BASE_URL}/${API_VERSION}/courses/${id}`,
    featured: `${API_BASE_URL}/${API_VERSION}/courses/featured`,
    batches: `${API_BASE_URL}/${API_VERSION}/courses/batches`,
    purchase: (id: string) => `${API_BASE_URL}/${API_VERSION}/courses/${id}/purchase`,
    enrolled: `${API_BASE_URL}/${API_VERSION}/user/enrollments`,
    progress: (id: string) => `${API_BASE_URL}/${API_VERSION}/courses/${id}/progress`,
  },
  classes: {
    list: `${API_BASE_URL}/${API_VERSION}/classes`,
    detail: (id: string) => `${API_BASE_URL}/${API_VERSION}/classes/${id}`,
    live: (id: string) => `${API_BASE_URL}/${API_VERSION}/classes/${id}/live`,
    join: (id: string) => `${API_BASE_URL}/${API_VERSION}/classes/${id}/join`,
    recordings: (id: string) => `${API_BASE_URL}/${API_VERSION}/classes/${id}/recordings`,
    notes: (id: string) => `${API_BASE_URL}/${API_VERSION}/classes/${id}/notes`,
    comments: (id: string) => `${API_BASE_URL}/${API_VERSION}/classes/${id}/comments`,
    attendance: (id: string) => `${API_BASE_URL}/${API_VERSION}/classes/${id}/attendance`,
    materials: (id: string) => `${API_BASE_URL}/${API_VERSION}/classes/${id}/materials`,
    free: `${API_BASE_URL}/${API_VERSION}/classes/free`,
    archived: `${API_BASE_URL}/${API_VERSION}/classes/archived`,
    archivedByCourse: (courseId: string) =>
      `${API_BASE_URL}/${API_VERSION}/classes/course/${courseId}/archived`,
  },
  exams: {
    list: `${API_BASE_URL}/${API_VERSION}/exams/published`,
    published: `${API_BASE_URL}/${API_VERSION}/exams/published`,
    completed: `${API_BASE_URL}/${API_VERSION}/exams/completed`,
    detail: (id: string) => `${API_BASE_URL}/${API_VERSION}/exams/${id}`,
    byCourse: (courseId: string) => `${API_BASE_URL}/${API_VERSION}/exams/course/${courseId}`,
    questions: (id: string) => `${API_BASE_URL}/${API_VERSION}/exams/${id}/questions`,
    submit: (id: string) => `${API_BASE_URL}/${API_VERSION}/exams/${id}/submit-cq`,
    submitCq: (id: string) => `${API_BASE_URL}/${API_VERSION}/exams/${id}/submit-cq`,
    submitMcq: (id: string) => `${API_BASE_URL}/${API_VERSION}/exams/${id}/submit-mcq`,
    submitQuestion: (examId: string) => (questionId: string) =>
      `${API_BASE_URL}/${API_VERSION}/exams/${examId}/questions/${questionId}/submit`,
    submitMcqQuestion: (examId: string) => (questionId: string) =>
      `${API_BASE_URL}/${API_VERSION}/exams/${examId}/questions/${questionId}/submit-mcq`,
    submitWrittenQuestion: (examId: string) => (questionId: string) =>
      `${API_BASE_URL}/${API_VERSION}/exams/${examId}/questions/${questionId}/submit-written`,
    saveAnswer: (examId: string, questionId: string) =>
      `${API_BASE_URL}/${API_VERSION}/exams/${examId}/questions/${questionId}/save-answer`,
    saveProgress: (id: string) => `${API_BASE_URL}/${API_VERSION}/exams/${id}/progress`,
    results: (id: string) => `${API_BASE_URL}/${API_VERSION}/exams/${id}/results`,
    leaderboard: (id: string) => `${API_BASE_URL}/${API_VERSION}/exams/${id}/leaderboard`,
    submissions: (id: string) => `${API_BASE_URL}/${API_VERSION}/exams/${id}/submissions`,
    mySubmissions: (id: string) => `${API_BASE_URL}/${API_VERSION}/exams/${id}/my-submissions`,
    practice: `${API_BASE_URL}/${API_VERSION}/exams/practice`,
    participation: (id: string) => `${API_BASE_URL}/${API_VERSION}/exams/${id}/participation`,
    autoSubmit: (id: string) => `${API_BASE_URL}/${API_VERSION}/exams/${id}/auto-submit`,
  },
  user: {
    profile: `${API_BASE_URL}/${API_VERSION}/user/profile`,
    updateProfile: `${API_BASE_URL}/${API_VERSION}/user/profile`,
    dashboard: `${API_BASE_URL}/${API_VERSION}/user/dashboard`,
    purchases: `${API_BASE_URL}/${API_VERSION}/user/purchases`,
    enrollments: `${API_BASE_URL}/${API_VERSION}/user/enrollments`,
    progress: `${API_BASE_URL}/${API_VERSION}/user/progress`,
    notifications: `${API_BASE_URL}/${API_VERSION}/user/notifications`,
    preferences: `${API_BASE_URL}/${API_VERSION}/user/preferences`,
  },
} as const;

export type ApiEndpoints = typeof API_ENDPOINTS;
