import { client } from '../config/axios';

// Storefront-facing product reads (admin CRUD lives on the admin branch).
export const productService = {
  getProducts: async (params) => {
    return await client.get('/products', { params });
  },

  getProductById: async (id) => {
    return await client.get(`/products/${id}`);
  },
};
