import api from './api';

export const propertyService = {
  async getProperties(params = {}) {
    const response = await api.get('/properties', { params });
    return response.data;
  },

  async getProperty(id) {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  async createProperty(propertyData) {
    const response = await api.post('/properties', propertyData);
    return response.data;
  },

  async updateProperty(id, propertyData) {
    const response = await api.put(`/properties/${id}`, propertyData);
    return response.data;
  },

  async deleteProperty(id) {
    const response = await api.delete(`/properties/${id}`);
    return response.data;
  },

  async uploadPropertyImages(id, images) {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append(`images`, image);
    });
    
    const response = await api.post(`/properties/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getPropertyAnalytics(id) {
    const response = await api.get(`/properties/${id}/analytics`);
    return response.data;
  },

  async searchProperties(searchParams) {
    const response = await api.get('/properties/search', { params: searchParams });
    return response.data;
  },
}; 