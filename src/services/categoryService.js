import { client } from '../config/axios';

// CRUD calls to pos-api's /categories endpoints (reads are authenticated-only, writes are admin-only).
export const categoryService = {
  getCategories: async (activeOnly) => {
    return await client.get('/categories', { params: activeOnly ? { activeOnly: true } : undefined });
  },

  createCategory: async (data) => {
    return await client.post('/categories', data);
  },

  updateCategory: async (id, data) => {
    return await client.put(`/categories/${id}`, data);
  },

  // fails if a product still references this category
  deleteCategory: async (id) => {
    return await client.delete(`/categories/${id}`);
  },
};
