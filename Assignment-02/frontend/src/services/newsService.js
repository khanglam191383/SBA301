import api from './api';

export const newsService = {
  getStaffNews: async (keyword = '', categoryId = '', status = '') => {
    const params = {};
    if (keyword && keyword.trim()) params.keyword = keyword.trim();
    if (categoryId && categoryId !== 'ALL') params.categoryId = categoryId;
    if (status && status !== 'ALL') {
      params.status = status === 'ACTIVE' ? '1' : '0';
    }
    const response = await api.get('/staff/news', { params });
    return response.data;
  },

  getPublicNews: async (keyword = '', categoryId = '') => {
    const params = {};
    if (keyword && keyword.trim()) params.keyword = keyword.trim();
    if (categoryId && categoryId !== 'ALL') params.categoryId = categoryId;
    const response = await api.get('/public/news', { params });
    return response.data;
  },

  getPublicNewsDetail: async (id) => {
    const response = await api.get(`/public/news/${id}`);
    return response.data;
  },

  getMyHistory: async () => {
    const response = await api.get('/staff/news/my-history');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/staff/news/${id}`);
    return response.data;
  },

  create: async (newsData) => {
    const response = await api.post('/staff/news', newsData);
    return response.data;
  },

  update: async (id, newsData) => {
    const response = await api.put(`/staff/news/${id}`, newsData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/staff/news/${id}`);
    return response.data;
  }
};
