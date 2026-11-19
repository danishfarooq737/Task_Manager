import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login'); // 'login' | 'register'

  useEffect(() => {
    let mounted = true;
    const checkAuth = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        if (mounted && currentUser) {
          setUser(currentUser);
        }
      } catch {
        // Guest mode default
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkAuth();
    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email, password) => {
    const res = await AuthService.login({ email, password });
    if (res?.data?.user) {
      setUser(res.data.user);
      setIsAuthModalOpen(false);
    }
    return res;
  };

  const register = async (name, email, password) => {
    const res = await AuthService.register({ name, email, password });
    if (res?.data?.user) {
      setUser(res.data.user);
      setIsAuthModalOpen(false);
    }
    return res;
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } catch {
      // Ignore
    } finally {
      setUser(null);
    }
  };

  const openAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
