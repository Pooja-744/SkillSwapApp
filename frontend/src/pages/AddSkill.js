// src/pages/AddSkill.js — Form to add a new skill
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Technology','Design','Music','Language','Cooking','Fitness','Art','Business','Photography','Writing','Other'];
const LEVELS = ['Beginner','Intermediate','Advanced','Expert'];

const AddSkill = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', description: '', category: '', level: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    else if (formData.description.length < 20) errs.description = 'Description must be at least 20 characters';
    if (!formData.category) errs.category = 'Please select a category';
    if (!formData.level) errs.level = 'Please select a level';
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
      await api.post('/skills', formData);
      toast.success('Skill added successfully! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add skill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page add-skill-page">
      <div className="form-page-container">
        <div className="form-page-header">
          <h1 className="page-title">Share a Skill</h1>
          <p className="page-subtitle">Let the community know what you can teach</p>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit} noValidate>
            <div className={`form-group ${errors.title ? 'has-error' : ''}`}>
              <label>Skill Title *</label>
              <input
                type="text"
                name="title"
                placeholder="e.g., Adobe Photoshop Fundamentals"
                value={formData.title}
                onChange={handleChange}
                className="form-input"
                maxLength={100}
              />
              {errors.title && <span className="error-msg">{errors.title}</span>}
              <span className="char-count">{formData.title.length}/100</span>
            </div>

            <div className={`form-group ${errors.description ? 'has-error' : ''}`}>
              <label>Description *</label>
              <textarea
                name="description"
                placeholder="Describe what you'll teach, your experience level, what learners will gain..."
                value={formData.description}
                onChange={handleChange}
                className="form-input"
                rows="5"
                maxLength={500}
              />
              {errors.description && <span className="error-msg">{errors.description}</span>}
              <span className="char-count">{formData.description.length}/500</span>
            </div>

            <div className="form-row">
              <div className={`form-group ${errors.category ? 'has-error' : ''}`}>
                <label>Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} className="form-input">
                  <option value="">Select category...</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.category && <span className="error-msg">{errors.category}</span>}
              </div>

              <div className={`form-group ${errors.level ? 'has-error' : ''}`}>
                <label>Your Level *</label>
                <select name="level" value={formData.level} onChange={handleChange} className="form-input">
                  <option value="">Select level...</option>
                  {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
                {errors.level && <span className="error-msg">{errors.level}</span>}
              </div>
            </div>

            {/* Level guide */}
            <div className="level-guide">
              <div className="level-guide-item">🌱 <strong>Beginner</strong> — Just started learning</div>
              <div className="level-guide-item">📚 <strong>Intermediate</strong> — Comfortable with basics</div>
              <div className="level-guide-item">🔥 <strong>Advanced</strong> — Deep expertise</div>
              <div className="level-guide-item">⭐ <strong>Expert</strong> — Professional level</div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="btn-spinner" /> : 'Publish Skill →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSkill;