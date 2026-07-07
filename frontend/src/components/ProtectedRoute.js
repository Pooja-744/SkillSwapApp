// src/components/ProtectedRoute.js — Redirect unauthenticated users
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show spinner while auth state is being loaded from localStorage
  if (loading) return <Spinner fullScreen />;

  // Redirect to login if not authenticated, preserve intended destination
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
};

export default ProtectedRoute;