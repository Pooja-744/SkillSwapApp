// src/pages/Login.js — Login with JWT and redirect support
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to original intended page after login
  const from = location.state?.from?.pathname || '/dashboard';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) errs.email = 'Email is required';
    if (!formData.password) errs.password = 'Password is required';
    return errs;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);

    setLoading(true);
    try {
      await login(formData);
      toast.success('Welcome back! 👋');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">⚡</span>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your SkillSwap account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="jane@example.com"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
            />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>

          <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
            <label>Password</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Your password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <span className="error-msg">{errors.password}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? <span className="btn-spinner" /> : 'Sign In →'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register" className="auth-link">Sign up free</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;