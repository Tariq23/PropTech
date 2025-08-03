import api from './api';

export const investorService = {
  async getInvestors(params = {}) {
    const response = await api.get('/admin/investors', { params });
    return response.data;
  },

  async getInvestor(id) {
    const response = await api.get(`/admin/investors/${id}`);
    return response.data;
  },

  async updateInvestor(id, investorData) {
    const response = await api.put(`/admin/investors/${id}`, investorData);
    return response.data;
  },

  async verifyInvestor(id) {
    const response = await api.post(`/admin/investors/${id}/verify`);
    return response.data;
  },

  async rejectInvestor(id, reason) {
    const response = await api.post(`/admin/investors/${id}/reject`, { reason });
    return response.data;
  },

  async getInvestorDocuments(id) {
    const response = await api.get(`/admin/investors/${id}/documents`);
    return response.data;
  },

  async getInvestorAnalytics(id) {
    const response = await api.get(`/admin/investors/${id}/analytics`);
    return response.data;
  },
}; 