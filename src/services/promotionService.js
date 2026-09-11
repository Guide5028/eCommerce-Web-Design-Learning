import { client } from '../config/axios.js';

// Promotion CRUD (reads are authenticated-only, writes are admin-only).
export const promotionService = {
  // params: { activeOnly?: boolean } -- AdminPromotionsPage wants every promo (default),
  // checkout/cart pass activeOnly: true to preview only what's live right now.
  getPromotions: async (params) => {
    return await client.get('/promotions', { params });
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
