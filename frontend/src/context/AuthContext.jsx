import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Initializing...');
    const storedUser = authService.getCurrentUser();
    console.log('AuthProvider: Stored user:', storedUser);
    setUser(storedUser);
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    console.log('AuthProvider: Login called');
    try {
      const data = await authService.login(credentials);
      console.log('AuthProvider: Login successful', data.user);
      setUser(data.user);
      return data;
    } catch (error) {
      console.error('AuthProvider: Login error', error);
      throw error;
    }
  };

  const register = async (userData) => {
    console.log('AuthProvider: Register called');
    try {
      const data = await authService.register(userData);
      console.log('AuthProvider: Register successful', data.user);
      setUser(data.user);
      return data;
    } catch (error) {
      console.error('AuthProvider: Register error', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('AuthProvider: Logout called');
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  console.log('AuthProvider: Current value:', value);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;