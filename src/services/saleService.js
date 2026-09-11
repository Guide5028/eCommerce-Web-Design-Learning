import { client } from '../config/axios.js';

export const saleService = {
  // items: [{ productId, quantity }] -- price is never sent, the backend prices
  // each line itself from the product table (and applies any promotion server-side)
  createSale: async ({ items, employeeId, paymentMethod, amountPaid, customerId }) => {
    return await client.post('/sales', { items, employeeId, paymentMethod, amountPaid, customerId });
  },

  // Admin-only: read sale history for the dashboard.
  getSales: async () => {
    return await client.get('/sales');
  },

  // Admin-only: one sale with its line items -- there's no bulk "all sale items"
  // endpoint yet, so the dashboard's top-sellers stat fetches these per sale.
  getSaleById: async (id) => {
    return await client.get(`/sales/${id}`);
  },
};
