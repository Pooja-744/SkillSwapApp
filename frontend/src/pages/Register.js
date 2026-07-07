// src/pages/Register.js — User registration with form validation
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', password: '', bio: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    else if (formData.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) errs.email = 'Enter a valid email';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // clear field error on type
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);

    setLoading(true);
    try {
      await register(formData);
      toast.success('Welcome to SkillSwap! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">⚡</span>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join SkillSwap and start trading skills today</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Jane Doe"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
            />
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>

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
                placeholder="At least 6 characters"
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

          <div className="form-group">
            <label>Bio <span className="optional">(optional)</span></label>
            <textarea
              name="bio"
              placeholder="Tell others what you're about..."
              value={formData.bio}
              onChange={handleChange}
              className="form-input"
              rows="3"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? <span className="btn-spinner" /> : 'Create Account →'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;