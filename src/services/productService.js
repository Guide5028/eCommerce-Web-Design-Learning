import { client } from '../config/axios';

// Product CRUD, stock adjustment, and image upload calls to pos-api (writes are admin-only).
export const productService = {
  getProducts: async (params) => {
    return await client.get('/products', { params });
  },

  getProductById: async (id) => {
    return await client.get(`/products/${id}`);
  },

  createProduct: async (data) => {
    return await client.post('/products', data);
  },

  updateProduct: async (id, data) => {
    return await client.put(`/products/${id}`, data);
  },

  // fails if the product has sale/refund/stock history -- deactivate it instead
  deleteProduct: async (id) => {
    return await client.delete(`/products/${id}`);
  },

  // changeAmount is a signed delta, not the new total
  updateStock: async (id, { changeAmount, reason, costPrice }) => {
    return await client.patch(`/products/${id}/stock`, { changeAmount, reason, costPrice });
  },

  // multipart upload, JPEG/PNG/WebP up to 5MB
  uploadProductImage: async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return await client.post(`/products/${id}/image`, formData);
  },
};
