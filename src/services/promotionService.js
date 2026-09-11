import { client } from '../config/axios.js';

// Promotion CRUD (reads are authenticated-only, writes are admin-only).
export const promotionService = {
  getPromotions: async () => {
    return await client.get('/promotions');
  },

  createPromotion: async (data) => {
    return await client.post('/promotions', data);
  },

  updatePromotion: async (id, data) => {
    return await client.put(`/promotions/${id}`, data);
  },

  deletePromotion: async (id) => {
    return await client.delete(`/promotions/${id}`);
  },
};
