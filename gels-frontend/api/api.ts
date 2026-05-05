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
    // 👇 THIS IS THE LINE THAT WAS MISSING 👇
    getOnboardingConfig: () => fetchAPI('/learning/onboarding-config', { method: 'GET' }),
    
    completeOnboarding: (data: any) => fetchAPI('/learning/onboarding', { method: 'POST', body: JSON.stringify(data) }),
    getModules: () => fetchAPI('/learning/modules', { method: 'GET' }),
    submitAssessment: (userId: string, data: any) => fetchAPI(`/learning/submit-assessment?user_id=${userId}`, { method: 'POST', body: JSON.stringify(data) }),
    getNextModule: (userId: string) => fetchAPI(`/learning/next-module?user_id=${userId}`, { method: 'GET' })
  },

  // 3. GAMIFICATION (AFFECTIVE ENGINE)
  gamification: {
    getProfile: (userId: string) => fetchAPI(`/gamification/profile?user_id=${userId}`, { method: 'GET' }),
    getLeaderboard: (scope = 'global', playerType?: string) => {
      const url = playerType ? `/gamification/leaderboard?scope=${scope}&player_type=${playerType}` : `/gamification/leaderboard?scope=${scope}`;
      return fetchAPI(url, { method: 'GET' });
    },
    getQuests: () => fetchAPI('/gamification/quests', { method: 'GET' }),
    getNotifications: () => fetchAPI('/gamification/notifications', { method: 'GET' })
  },

  // 4. INSTRUCTOR (GLASS-BOX PORTAL)
  instructor: {
    getCohortAnalytics: () => fetchAPI('/instructor/cohort-analytics', { method: 'GET' }),
    getDecisionLog: () => fetchAPI('/instructor/decision-log', { method: 'GET' }),
    createModule: (data: any) => fetchAPI('/instructor/modules', { method: 'POST', body: JSON.stringify(data) }),
    overridePath: (data: any) => fetchAPI('/instructor/override-path', { method: 'POST', body: JSON.stringify(data) })
  },

  // 5. SYSTEM ADMIN
  admin: {
    getHealth: () => fetchAPI('/admin/health', { method: 'GET' }),
    getUsers: () => fetchAPI('/admin/users', { method: 'GET' }),
    updateRole: (userId: string, newRole: string) => fetchAPI(`/admin/users/${userId}/role`, { method: 'PUT', body: JSON.stringify({ new_role: newRole }) })
  }
};