const ACCESS_KEY = 'pos.accessToken';
const REFRESH_KEY = 'pos.refreshToken';
const AUDIENCE_KEY = 'pos.audience';

export const tokens = {
  get access() {
    return localStorage.getItem(ACCESS_KEY);
  },
  get refresh() {
    return localStorage.getItem(REFRESH_KEY);
  },
  // 'employee' | 'customer' -- which table the stored token belongs to, so a page
  // reload knows whether to restore the session via /auth/profile or /customers/profile.
  // Defaults to 'employee' so a session stored before this existed still restores fine.
  get audience() {
    return localStorage.getItem(AUDIENCE_KEY) || 'employee';
  },
  set(access, refresh, audience = 'employee') {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
    localStorage.setItem(AUDIENCE_KEY, audience);
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(AUDIENCE_KEY);
  },
};
