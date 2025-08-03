import api from './api';

export const dealService = {
  async getDeals(params = {}) {
    const response = await api.get('/admin/deals', { params });
    return response.data;
  },

  async getDeal(id) {
    const response = await api.get(`/admin/deals/${id}`);
    return response.data;
  },

  async createDeal(dealData) {
    const response = await api.post('/admin/deals', dealData);
    return response.data;
  },

  async updateDeal(id, dealData) {
    const response = await api.put(`/admin/deals/${id}`, dealData);
    return response.data;
  },

  async deleteDeal(id) {
    const response = await api.delete(`/admin/deals/${id}`);
    return response.data;
  },

  async publishDeal(id) {
    const response = await api.post(`/admin/deals/${id}/publish`);
    return response.data;
  },

  async unpublishDeal(id) {
    const response = await api.post(`/admin/deals/${id}/unpublish`);
    return response.data;
  },

  async getDealAnalytics(id) {
    const response = await api.get(`/admin/deals/${id}/analytics`);
    return response.data;
  },

  async getDealInterests(id) {
    const response = await api.get(`/admin/deals/${id}/interests`);
    return response.data;
  },
}; 