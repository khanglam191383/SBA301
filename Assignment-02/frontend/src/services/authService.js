import api from './api';

const TOKEN_KEY = 'funews_token';
const USER_KEY = 'funews_current_user';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const data = response.data;

    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
      const user = {
        id: data.accountID,
        accountID: data.accountID,
        username: data.accountName,
        fullName: data.accountName,
        email: data.accountEmail,
        accountEmail: data.accountEmail,
        role: data.accountRole,
        accountRole: data.accountRole
      };
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return { token: data.token, user };
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser: () => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  fetchProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};
