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
//   auth: {
//     register: (data: any) => fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
//     login: (data: any) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
//     logout: () => {
//       if (typeof window !== 'undefined') {
//         localStorage.removeItem('gels_token');
//         localStorage.removeItem('gels_role');
//         localStorage.removeItem('gels_user_id');
//       }
//     }
//   },
//     auth: {
//     login: async (data: any) => { /* your existing fetch */ },
    
//     // NEW: Function to check session validity
//     verifySession: async () => {
//       // Must include credentials to send the HttpOnly cookie
//       const res = await fetch('/api/auth/me', { method: 'GET', credentials: 'include' });
//       if (!res.ok) throw new Error('Unauthorized');
//       return res.json();
//     },
    
//     // NEW: Function to tell the server to delete the cookie
//     logout: async () => {
//       await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
//     }
//   },

    // 1. AUTHENTICATION
  auth: {
    register: (data: any) => fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    
    // 🔥 FIX 1: The actual login call is restored!
    login: (data: any) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    
    // 🔥 FIX 2: Safely checks for a session without triggering a 404 on the frontend
    verifySession: async () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('gels_token');
        if (!token) throw new Error('Unauthorized');
        return { valid: true };
      }
      throw new Error('Unauthorized');
    },
    
    // 🔥 FIX 3: Safely wipes the local storage session
    logout: async () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('gels_token');
        localStorage.removeItem('gels_role');
        localStorage.removeItem('gels_user_id');
      }
    }
  },

  // 2. LEARNING & ONBOARDING
  learning: {
    // Replace getAllPaths and add these under the `learning:` object
    getAllPaths: (instructorId: string) => fetchAPI(`/learning/learning-paths?instructor_id=${instructorId}`, { method: 'GET' }),
    createCourse: (data: any) => fetchAPI('/learning/course', { method: 'POST', body: JSON.stringify(data) }),
    createSection: (data: any) => fetchAPI('/learning/section', { method: 'POST', body: JSON.stringify(data) }),
    createUnit: (data: any) => fetchAPI('/learning/unit', { method: 'POST', body: JSON.stringify(data) }),
    getLesson: (moduleName: string, lessonId: string) => fetchAPI(`/learning/${moduleName}/${lessonId}?t=${new Date().getTime()}`, { method: 'GET' }),
    getOnboardingConfig: () => fetchAPI('/learning/onboarding-config', { method: 'GET' }),
    getQuestion: () => fetchAPI(`/learning/question?t=${new Date().getTime()}`, { method: 'GET' }),    
    completeOnboarding: (data: any) => fetchAPI('/learning/onboarding', { method: 'POST', body: JSON.stringify(data) }),
    getModules: () => fetchAPI('/learning/modules', { method: 'GET' }),
    // getAllPaths: () => fetchAPI('/learning/learning-paths', { method: 'GET' }),
    getFullPath: (courseId: string) => fetchAPI(`/learning/learning-path/${courseId}`, { method: 'GET' }),
    submitAssessment: (data: { 
        user_id: string, 
        score: number, 
        remaining_gems: number, 
        time_spent_seconds: number, 
        attempts: number 
    }) => fetchAPI('/learning/submit-assessment', { 
        method: 'POST', 
        body: JSON.stringify(data) 
    }),
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
    searchUsers: (query: string, userId: string) => fetchAPI(`/gamification/search-users?query=${query}&user_id=${userId}`, { method: 'GET' }),
    followUser: (followerId: string, followingId: string) => fetchAPI(`/gamification/follow?follower_id=${followerId}&following_id=${followingId}`, { method: 'POST' }),
    unfollowUser: (followerId: string, followingId: string) => fetchAPI(`/gamification/follow?follower_id=${followerId}&following_id=${followingId}`, { method: 'DELETE' }),
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