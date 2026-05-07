// gels-frontend/api/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Helper to get the JWT token from local storage
const getAuthHeaders = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('gels_token');
    if (token) {
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
    }
  }
  return { 'Content-Type': 'application/json' };
};

// Generic Fetch Wrapper for error handling
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
    // 👇 CRITICAL: Prevents Next.js from permanently caching 404 errors!
    cache: 'no-store' 
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API Error: ${response.status}`);
  }

  return response.json();
}

// --- API Service Object ---
export const api = {
  
  // 1. AUTHENTICATION
  auth: {
    register: (data: any) => fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: any) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('gels_token');
        localStorage.removeItem('gels_role');
        localStorage.removeItem('gels_user_id');
      }
    }
  },

  // 2. LEARNING & ONBOARDING
  learning: {
    getLesson: (moduleName: string, lessonId: string) => fetchAPI(`/learning/${moduleName}/${lessonId}?t=${new Date().getTime()}`, { method: 'GET' }),
    getOnboardingConfig: () => fetchAPI('/learning/onboarding-config', { method: 'GET' }),
    getQuestion: () => fetchAPI(`/learning/question?t=${new Date().getTime()}`, { method: 'GET' }),    
    completeOnboarding: (data: any) => fetchAPI('/learning/onboarding', { method: 'POST', body: JSON.stringify(data) }),
    getModules: () => fetchAPI('/learning/modules', { method: 'GET' }),
    submitAssessment: (userId: string, data: any) => fetchAPI(`/learning/submit-assessment?user_id=${userId}`, { method: 'POST', body: JSON.stringify(data) }),
    getNextModule: (userId: string) => fetchAPI(`/learning/next-module?user_id=${userId}`, { method: 'GET' })
  },

  // 3. GAMIFICATION (AFFECTIVE ENGINE)
  gamification: {
    getProfile: (userId: string) => fetchAPI(`/gamification/profile?user_id=${userId}`, { method: 'GET' }),
    getAchievements: (userId: string) => fetchAPI(`/gamification/achievements?user_id=${userId}`, { method: 'GET' }),
    getLeaderboard: (scope = 'global', playerType?: string) => {
      const url = playerType ? `/gamification/leaderboard?scope=${scope}&player_type=${playerType}` : `/gamification/leaderboard?scope=${scope}`;
      return fetchAPI(url, { method: 'GET' });
    },
    getSocialData: (userId: string) => fetchAPI(`/gamification/social?user_id=${userId}`, { method: 'GET' }),
    getQuests: () => fetchAPI('/gamification/quests', { method: 'GET' }),
    getNotifications: (userId: string) => fetchAPI(`/gamification/notifications?user_id=${userId}`, { method: 'GET' }),
  },

  // 4. INSTRUCTOR (GLASS-BOX PORTAL)
  instructor: {
    // 👇 Fixed function names and added addQuest to match your Instructor Dashboard UI
    getAnalytics: () => fetchAPI('/instructor/cohort-analytics', { method: 'GET' }),
    getLogs: () => fetchAPI('/instructor/decision-log', { method: 'GET' }),
    addModule: (data: any) => fetchAPI('/instructor/modules', { method: 'POST', body: JSON.stringify(data) }),
    addQuest: (data: any) => fetchAPI('/instructor/quests', { method: 'POST', body: JSON.stringify(data) }),
    getRoster: () => fetchAPI('/instructor/roster', { method: 'GET' }),
    overridePath: (data: any) => fetchAPI('/instructor/override-path', { method: 'POST', body: JSON.stringify(data) }),
    updateSettings: () => fetchAPI('/instructor/settings', { method: 'PUT' }),
  },

  // 5. SYSTEM ADMIN
  admin: {
    getHealth: () => fetchAPI('/admin/health', { method: 'GET' }),
    getUsers: () => fetchAPI('/admin/users', { method: 'GET' }),
    updateRole: (userId: string, newRole: string) => fetchAPI(`/admin/users/${userId}/role`, { method: 'PUT', body: JSON.stringify({ new_role: newRole }) })
  }
};