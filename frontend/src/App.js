// src/App.js — Root component with routing and providers
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddSkill from './pages/AddSkill';
import BrowseSkills from './pages/BrowseSkills';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

import './App.css';

function App() {
  
  return (
    <AuthProvider>
      <Router>
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: 'var(--card-bg)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '14px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            },
          }}
        />

        <Navbar />

        <main className="main-content">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/browse" element={<BrowseSkills />} />

            {/* Protected routes (require auth) */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/add-skill" element={<ProtectedRoute><AddSkill /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

            {/* Catch-all 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;