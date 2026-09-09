import { client } from '../config/axios.js';

// Admin-only: list employees and approve/adjust access. No create/delete —
// accounts are created via /auth/register or OAuth sign-up, not by an admin.
export const employeeService = {
  getAllEmployees: async () => {
    return await client.get('/employees');
  },

  // data: { isActive?, role? } -- backend rejects editing your own employeeId with a 400
  updateEmployee: async (id, data) => {
    return await client.patch(`/employees/${id}`, data);
  },
};
