import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { login as apiLogin, getProfile } from '../services/authService.js';
import { tokens } from '../services/tokens.js';

// Shared auth session state (profile, login, logout), read by SiteHeader and written by AuthTabs.

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, restore the session from a token already in localStorage, if any.
  useEffect(() => {
    if (!tokens.access) {
      setLoading(false);
      return;
    }
    getProfile()
      .then(setProfile)
      .catch(() => tokens.clear())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const { accessToken, refreshToken, profile: loggedInProfile } = await apiLogin(email, password);
    tokens.set(accessToken, refreshToken);
    setProfile(loggedInProfile);
    return loggedInProfile;
  }, []);

  // For the OAuth callback: store tokens issued by the backend redirect, then fetch the profile.
  const loginWithTokens = useCallback(async (accessToken, refreshToken) => {
    tokens.set(accessToken, refreshToken);
    const fetchedProfile = await getProfile();
    setProfile(fetchedProfile);
    return fetchedProfile;
  }, []);

  const logout = useCallback(() => {
    tokens.clear();
    setProfile(null);
  }, []);

  return (
    <AuthContext.Provider value={{ profile, loading, login, loginWithTokens, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
