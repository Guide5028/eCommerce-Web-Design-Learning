// Ported from pos-web/src/lib/tokens.ts -- same pattern, plain JS to match this
// project's style (no TypeScript). Access token is a short-lived JWT sent as
// `Authorization: Bearer <token>` on every authenticated request; refresh token is
// long-lived and only ever sent to POST /api/auth/refresh to mint a new access token.

const ACCESS_KEY = 'pos.accessToken';
const REFRESH_KEY = 'pos.refreshToken';

export const tokens = {
  get access() {
    return localStorage.getItem(ACCESS_KEY);
  },
  get refresh() {
    return localStorage.getItem(REFRESH_KEY);
  },
  set(access, refresh) {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};
