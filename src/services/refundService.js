import { client } from '../config/axios.js';

// Refunds: admin-only list (with product/employee names already joined in by pos-api),
// create is open to any authenticated staff (a cashier can process one at the register too).
export const refundService = {
  getRefunds: async () => {
    return await client.get('/refunds');
  },

  // data: { saleItemId, quantity, reason, employeeId }
  createRefund: async (data) => {
    return await client.post('/refunds', data);
  },
};
