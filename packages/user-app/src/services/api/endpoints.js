export const endpoints = {
  // Questions
  getQuestions: () => "/api/questions",

  // Users
  registerUser: () => "/api/applications/register",
  login: () => "/api/users/login",
  profile: () => "/api/users/profile",
  gameSessions: () => "/api/game/session/list",
  mapStats: () => "/api/game/stats/maps",
  leaderboard: () => "/api/game/leaderboard",
  streak: () => "/api/game/streak",

  // Training
  trainingModules: () => "/api/training/modules",
  setLessonProgress: (lessonId) => `/api/training/progress/lessons/${lessonId}`,

  // Activation
  checkActivation: (token) => `/api/activate/${token}`,
  activate: (token) => `/api/activate/${token}`,

  // Files
  uploadFile: () => "/api/files/upload",
  deleteFile: (fileId) => `/api/files/${fileId}`,
};
