import { api } from './api';

export const AuthService = {
  async register(userData) {
    return await api.post('/auth/register', userData);
  },

  async login(credentials) {
    return await api.post('/auth/login', credentials);
  },

  async logout() {
    return await api.post('/auth/logout', {});
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me', { retries: 0, timeout: 3000 });
      return response?.data?.user || null;
    } catch {
      return null;
    }
  }
};
