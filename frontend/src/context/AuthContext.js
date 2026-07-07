// src/context/AuthContext.js — Global authentication state
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while checking localStorage

  // ─── On mount: restore user from localStorage ───────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('skillswap_token');
    const savedUser = localStorage.getItem('skillswap_user');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  // ─── Register ───────────────────────────────────────────────────────────────
  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    localStorage.setItem('skillswap_token', data.data.token);
    localStorage.setItem('skillswap_user', JSON.stringify(data.data));
    setUser(data.data);
    return data;
  };

  // ─── Login ──────────────────────────────────────────────────────────────────
  const login = async (formData) => {
    const { data } = await api.post('/auth/login', formData);
    localStorage.setItem('skillswap_token', data.data.token);
    localStorage.setItem('skillswap_user', JSON.stringify(data.data));
    setUser(data.data);
    return data;
  };

  // ─── Logout ─────────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('skillswap_token');
    localStorage.removeItem('skillswap_user');
    setUser(null);
  };

  // ─── Update user in state + localStorage ────────────────────────────────────
  const updateUser = (updatedUser) => {
    const merged = { ...user, ...updatedUser };
    localStorage.setItem('skillswap_user', JSON.stringify(merged));
    setUser(merged);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy consumption
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};