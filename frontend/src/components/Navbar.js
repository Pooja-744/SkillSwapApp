// src/components/Navbar.js — Top navigation with auth state & theme toggle
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [scrolled, setScrolled] = useState(false);

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  // Navbar shadow on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [location]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* ─── Brand ─────────────────────────────────────────────────────────── */}
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">⚡</span>
          <span className="brand-text">SkillSwap</span>
        </Link>

        {/* ─── Desktop Nav Links ─────────────────────────────────────────────── */}
        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          <Link to="/browse" className={`nav-link ${isActive('/browse') ? 'active' : ''}`}>Browse Skills</Link>
          {user && (
            <>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>Dashboard</Link>
              <Link to="/add-skill" className={`nav-link ${isActive('/add-skill') ? 'active' : ''}`}>Add Skill</Link>
              <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>Profile</Link>
            </>
          )}
        </div>

        {/* ─── Right Side Controls ───────────────────────────────────────────── */}
        <div className="navbar-right">
          {/* Theme toggle */}
          <button
            className="theme-toggle"
            onClick={() => setDark(!dark)}
            title="Toggle theme"
            aria-label="Toggle dark mode"
          >
            {dark ? '☀️' : '🌙'}
          </button>

          {user ? (
            <div className="navbar-user">
              <span className="user-greeting">Hi, {user.name.split(' ')[0]}</span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={menuOpen ? 'bar open' : 'bar'} />
            <span className={menuOpen ? 'bar open' : 'bar'} />
            <span className={menuOpen ? 'bar open' : 'bar'} />
          </button>
        </div>
      </div>

      {/* ─── Mobile Menu ─────────────────────────────────────────────────────── */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-link">Home</Link>
          <Link to="/browse" className="mobile-link">Browse Skills</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="mobile-link">Dashboard</Link>
              <Link to="/add-skill" className="mobile-link">Add Skill</Link>
              <Link to="/profile" className="mobile-link">Profile</Link>
              <button className="mobile-link logout-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-link">Login</Link>
              <Link to="/register" className="mobile-link">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;