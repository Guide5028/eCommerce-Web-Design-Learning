import { client } from '../config/axios.js';

// Two audiences share this file: the storefront's own register/login/profile calls
// (used by AuthTabs + AuthContext), and the admin-facing list/edit calls below.
export const customerService = {
  // -> { customerId, name, email, phone, address, pointBalance, role: 'customer' } -- no tokens, log in separately
  register: async (email, password, name) => {
    return await client.post('/customers/register', { email, password, name });
  },

  // -> { accessToken, refreshToken, profile }
  login: async (email, password) => {
    return await client.post('/customers/login', { email, password });
  },

  getProfile: async () => {
    return await client.get('/customers/profile');
  },

  // admin-only
  getCustomers: async () => {
    return await client.get('/customers');
  },

  // admin-only. data: { name?, phone?, address?, pointBalance? } -- not the account credentials
  updateCustomer: async (id, data) => {
    return await client.patch(`/customers/${id}`, data);
  },
};
