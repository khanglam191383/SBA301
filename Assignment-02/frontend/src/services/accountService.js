import api from './api';

export const accountService = {
  getAll: async (keyword = '', role = '') => {
    const params = {};
    if (keyword && keyword.trim()) params.keyword = keyword.trim();
    if (role && role !== 'ALL') params.role = role;
    const response = await api.get('/admin/accounts', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/admin/accounts/${id}`);
    return response.data;
  },

  create: async (accountData) => {
    const response = await api.post('/admin/accounts', accountData);
    return response.data;
  },

  update: async (id, accountData) => {
    const response = await api.put(`/admin/accounts/${id}`, accountData);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/admin/accounts/${id}`);
    return response.data;
  }
};
