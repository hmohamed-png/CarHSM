import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  authRegister,
  authSendOtp,
  authVerifyOtp,
  authLogin,
  authLogout,
  authRefresh,
  authMe,
  setAccessToken,
  clearAccessToken
} from '../utils/apiClient.js';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const refreshProfile = useCallback(async () => {
    try {
      const data = await authMe();
      if (data?.user) {
        setUser(data.user);
        return data.user;
      }
      setUser(null);
      clearAccessToken();
      return null;
    } catch (error) {
      setUser(null);
      clearAccessToken();
      throw error;
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const profile = await refreshProfile().catch(() => null);
        if (profile) {
          try {
            const refreshed = await authRefresh();
            if (refreshed?.accessToken) {
              setAccessToken(refreshed.accessToken);
            }
          } catch (error) {
            // ignore refresh failures at startup
          }
        }
      } finally {
        if (mounted) {
          setInitializing(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [refreshProfile]);

  const register = useCallback(async ({ name, phone, email, password }) => {
    const payload = {
      name: name?.trim() || '',
      phone,
      email: email?.trim() || undefined,
      password: password || undefined
    };
    return authRegister(payload);
  }, []);

  const sendOtp = useCallback(async ({ phone }) => {
    return authSendOtp({ phone });
  }, []);

  const verifyOtp = useCallback(async ({ phone, code }) => {
    const result = await authVerifyOtp({ phone, code });
    if (result?.accessToken) {
      setAccessToken(result.accessToken);
    }
    if (result?.user) {
      setUser(result.user);
    }
    return result;
  }, []);

  const loginWithPassword = useCallback(async ({ phone, password }) => {
    const result = await authLogin({ phone, password });
    if (result?.accessToken) {
      setAccessToken(result.accessToken);
    }
    if (result?.user) {
      setUser(result.user);
    }
    return result;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authLogout();
    } catch (error) {
      // ignore logout errors, we'll clear client-side state regardless
    } finally {
      clearAccessToken();
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading: initializing,
      isAuthenticated: Boolean(user),
      register,
      sendOtp,
      verifyOtp,
      loginWithPassword,
      logout,
      refreshProfile
    }),
    [user, initializing, register, sendOtp, verifyOtp, loginWithPassword, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
