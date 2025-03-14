import { defineStore } from 'pinia';
import { authApi } from '../services/api';

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
}

interface UserState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
  },

  actions: {
    async register(username: string, email: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authApi.register({ username, email, password });
        this.token = response.token;
        this.user = response.user;
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      } catch (error: any) {
        this.error = error.message || 'Registration failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async login(username: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authApi.login({ username, password });
        this.token = response.token;
        this.user = response.user;
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
      } catch (error: any) {
        this.error = error.message || 'Login failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },

    async getCurrentUser() {
      if (!this.token) return;
      
      this.loading = true;
      try {
        const response = await authApi.getCurrentUser();
        this.user = response.user;
        localStorage.setItem('user', JSON.stringify(response.user));
      } catch (error: any) {
        this.error = error.message;
        this.logout();
      } finally {
        this.loading = false;
      }
    },

    initializeFromStorage() {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          this.user = JSON.parse(userStr);
        } catch (e) {
          this.logout();
        }
      }
    },
  },
});
