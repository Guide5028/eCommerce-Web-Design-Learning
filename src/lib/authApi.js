// Talks to the real pos-api backend (Internship 1/POS Challenge/pos-api) --
// POST /api/auth/login. This is the "production-shape" connection: an absolute URL
// (VITE_API_URL, from .env) + real CORS on the backend, no dev proxy involved.
//
// pos-api's response envelope (utils/response.ts) is always
// { success: true, data } or { success: false, message } -- ApiError below unwraps
// that so callers can just `await login(...)` and catch a plain Error with a real
// message to show the user.

const API_BASE = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// email/password -> { accessToken, refreshToken, profile: { employeeId, name, email, role, profileComplete } }
export async function login(email, password) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const body = await res.json();
  if (!res.ok || !body.success) {
    throw new ApiError(res.status, body.message || 'Login failed');
  }
  return body.data;
}
