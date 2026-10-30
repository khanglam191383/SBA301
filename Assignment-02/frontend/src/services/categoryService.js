import api from './api';

export const categoryService = {
  getAll: async (keyword = '', isActive = null) => {
    const params = {};
    if (keyword && keyword.trim()) params.keyword = keyword.trim();
    if (isActive !== null && isActive !== 'ALL') {
      params.isActive = isActive === 'ACTIVE' || isActive === true;
    }
    const response = await api.get('/staff/categories', { params });
    return response.data;
  },

  getActiveCategories: async () => {
    const response = await api.get('/public/categories');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/staff/categories/${id}`);
    return response.data;
  },

  create: async (categoryData) => {
    const response = await api.post('/staff/categories', categoryData);
    return response.data;
  },

  update: async (id, categoryData) => {
    const response = await api.put(`/staff/categories/${id}`, categoryData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/staff/categories/${id}`);
    return response.data;
  }
};
