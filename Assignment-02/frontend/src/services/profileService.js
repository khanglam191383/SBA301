import api from './api';

export const profileService = {
  getProfile: async () => {
    const response = await api.get('/staff/profile');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/staff/profile', data);
    return response.data;
  }
};
