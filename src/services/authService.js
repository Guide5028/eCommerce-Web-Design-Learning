import { client } from '../config/axios.js';

export function login(email, password) {
  return client.post('/auth/login', { email, password });
}

// -> { employeeId, name, email, role, profileComplete }
export function getProfile() {
  return client.get('/auth/profile');
}

// -> { employeeId, name, email, role, profileComplete } -- no tokens, log in separately
export function register(email, password, name) {
  return client.post('/auth/register', { email, password, name });
}
