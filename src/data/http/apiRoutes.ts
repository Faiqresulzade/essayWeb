/** Backend endpoint-lərinin tək mənbəyi. */
export const API_ROUTES = {
  auth: {
    register: '/api/auth/register',
    login: '/api/auth/login',
    refresh: '/api/auth/refresh',
    logout: '/api/auth/logout',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password',
    profile: '/api/auth/profile',
  },
  account: {
    profile: '/api/account/profile',
    password: '/api/account/password',
    root: '/api/account',
  },
  essay: {
    evaluate: '/api/essay/evaluate',
    evaluateGrade9: '/api/essay/evaluate/grade9-images',
    ocr: '/api/essay/ocr',
    history: '/api/essay/history',
    historyItem: (id: number) => `/api/essay/history/${id}`,
  },
  lessons: {
    root: '/api/lessons',
    byId: (id: number) => `/api/lessons/${id}`,
  },
  groups: {
    root: '/api/groups',
    byId: (id: number) => `/api/groups/${id}`,
    students: (id: number) => `/api/groups/${id}/students`,
  },
  students: {
    root: '/api/students',
    byId: (id: number) => `/api/students/${id}`,
  },
  analytics: {
    overview: '/api/analytics/overview',
    group: (groupId: number) => `/api/analytics/groups/${groupId}`,
    student: (studentId: number) => `/api/analytics/students/${studentId}`,
  },
  subscription: {
    plans: '/api/subscription/plans',
    current: '/api/subscription',
    usage: '/api/subscription/usage',
    cancel: '/api/subscription/cancel',
  },
} as const;
