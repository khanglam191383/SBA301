import api from './api';

export const tagService = {
  getAllTags: async () => {
    const response = await api.get('/staff/tags');
    return response.data;
  }
};
