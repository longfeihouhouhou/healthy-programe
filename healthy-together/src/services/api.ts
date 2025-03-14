import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：添加 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：处理错误
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export const authApi = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  
  login: (data: { username: string; password: string }) =>
    api.post('/auth/login', data),
  
  getCurrentUser: () => api.get('/auth/me'),
};

export const userApi = {
  updateProfile: (data: any) => api.put('/users/profile', data),
  getProfile: () => api.get('/users/profile'),
};

export const healthApi = {
  addExercise: (data: { type: string; duration: number; date: string }) =>
    api.post('/health/exercise', data),
  
  addDiet: (data: { type: string; calories: number; date: string }) =>
    api.post('/health/diet', data),
  
  getGoals: () => api.get('/health/goals'),
  
  setGoals: (data: { exerciseMinutes: number; exerciseDays: number; calories: number }) =>
    api.post('/health/goals', data),
  
  getStats: () => api.get('/stats'),

  getRecords: (type?: string) => api.get('/health/records', { params: { type } })
};

export const socialApi = {
  createPost: (data: { content: string; images?: string[] }) =>
    api.post('/social/posts', data),
  
  getPosts: () => api.get('/social/feed'),
  
  likePost: (postId: string) =>
    api.post(`/social/posts/${postId}/like`),
  
  commentPost: (postId: string, data: { content: string }) =>
    api.post(`/social/posts/${postId}/comments`, data),
};
