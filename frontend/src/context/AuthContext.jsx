import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const getInitialToken = () => {
    const t = localStorage.getItem('token');
    return t && t !== 'null' && t !== 'undefined' ? t : null;
  };

  const getInitialUser = () => {
    try {
      const u = localStorage.getItem('user');
      return u && u !== 'null' && u !== 'undefined' ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  };

  const [user, setUser] = useState(getInitialUser());
  const [token, setToken] = useState(getInitialToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If token exists but user is missing, or vice versa, clear session
    if ((token && !user) || (!token && user)) {
      logout();
    }
    setLoading(false);
  }, [token, user]);

  const login = (userData, userToken) => {
    setToken(userToken);
    setUser(userData);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Failed to register:', error);
      throw error;
    }
  };

  const updateUser = async (data) => {
    try {
      const response = await api.put('/users/profile', data);
      const updatedUser = response.data;
      
      const currentUser = JSON.parse(localStorage.getItem('user')) || {};
      const newUserData = { ...currentUser, ...updatedUser };
      
      setUser(newUserData);
      localStorage.setItem('user', JSON.stringify(newUserData));
      return updatedUser;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  const isAuth = !!(user && token && token !== 'null' && token !== 'undefined');

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        register,
        updateUser,
        isAuthenticated: isAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
