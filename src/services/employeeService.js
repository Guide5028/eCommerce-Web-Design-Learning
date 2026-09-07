import { client } from '../config/axios.js';

// Admin-only calls to pos-api's /employees endpoints.

// -> [{ employeeId, name, email, role, isActive, profileComplete }]
export function getEmployees() {
  return client.get('/employees');
}

// data: { isActive?, role?: 'cashier' | 'admin' } -- backend refuses editing your own row
export function updateEmployee(employeeId, data) {
  return client.patch(`/employees/${employeeId}`, data);
}
