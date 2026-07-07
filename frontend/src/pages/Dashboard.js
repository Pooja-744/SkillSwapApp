// src/pages/Dashboard.js — User dashboard with analytics and skill management
import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import SkillCard from '../components/SkillCard';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editSkill, setEditSkill] = useState(null); // skill being edited
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const CATEGORIES = ['Technology','Design','Music','Language','Cooking','Fitness','Art','Business','Photography','Writing','Other'];
  const LEVELS = ['Beginner','Intermediate','Advanced','Expert'];

  const fetchMySkills = useCallback(async () => {
    try {
      const { data } = await api.get('/skills/user/mine');
      setSkills(data.data);
    } catch {
      toast.error('Failed to load your skills');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMySkills(); }, [fetchMySkills]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      await api.delete(`/skills/${id}`);
      setSkills(skills.filter((s) => s._id !== id));
      toast.success('Skill deleted');
    } catch {
      toast.error('Failed to delete skill');
    }
  };

  const handleEditOpen = (skill) => {
    setEditSkill(skill);
    setEditForm({ title: skill.title, description: skill.description, category: skill.category, level: skill.level });
  };

  const handleEditSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.put(`/skills/${editSkill._id}`, editForm);
      setSkills(skills.map((s) => (s._id === editSkill._id ? data.data : s)));
      setEditSkill(null);
      toast.success('Skill updated!');
    } catch {
      toast.error('Failed to update skill');
    } finally {
      setSaving(false);
    }
  };

  // ─── Analytics stats ────────────────────────────────────────────────────────
  const categoryCount = [...new Set(skills.map((s) => s.category))].length;
  const levelBreakdown = LEVELS.map((l) => ({ label: l, count: skills.filter((s) => s.level === l).length }));

  return (
    <div className="page dashboard-page">
      {/* ─── Welcome Header ───────────────────────────────────────────────────── */}
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back, <strong>{user?.name}</strong> 👋</p>
        </div>
        <Link to="/add-skill" className="btn btn-primary">+ Add New Skill</Link>
      </div>

      {/* ─── Analytics Cards ──────────────────────────────────────────────────── */}
      <div className="analytics-grid">
        <div className="analytics-card blue">
          <div className="analytics-icon">🎯</div>
          <div className="analytics-value">{skills.length}</div>
          <div className="analytics-label">Total Skills</div>
        </div>
        <div className="analytics-card green">
          <div className="analytics-icon">📁</div>
          <div className="analytics-value">{categoryCount}</div>
          <div className="analytics-label">Categories</div>
        </div>
        <div className="analytics-card purple">
          <div className="analytics-icon">⭐</div>
          <div className="analytics-value">
            {skills.filter((s) => s.level === 'Expert').length}
          </div>
          <div className="analytics-label">Expert Skills</div>
        </div>
        <div className="analytics-card orange">
          <div className="analytics-icon">📅</div>
          <div className="analytics-value">
            {skills.length > 0
              ? new Date(Math.max(...skills.map((s) => new Date(s.createdAt)))).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : '—'}
          </div>
          <div className="analytics-label">Last Added</div>
        </div>
      </div>

      {/* ─── Level Breakdown ──────────────────────────────────────────────────── */}
      {skills.length > 0 && (
        <div className="level-breakdown">
          <h3 className="section-title-sm">Skill Levels</h3>
          <div className="level-bars">
            {levelBreakdown.map((l) => (
              <div key={l.label} className="level-bar-item">
                <span className="level-bar-label">{l.label}</span>
                <div className="level-bar-track">
                  <div
                    className="level-bar-fill"
                    style={{ width: skills.length ? `${(l.count / skills.length) * 100}%` : '0%' }}
                  />
                </div>
                <span className="level-bar-count">{l.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── My Skills ────────────────────────────────────────────────────────── */}
      <div className="section-header-row">
        <h2 className="section-title">My Skills</h2>
        <span className="badge">{skills.length}</span>
      </div>

      {loading ? (
        <Spinner />
      ) : skills.length === 0 ? (
        <EmptyState
          icon="🚀"
          title="No skills yet"
          message="Share your first skill with the community!"
          actionLabel="Add a Skill"
          actionTo="/add-skill"
        />
      ) : (
        <div className="skills-grid">
          {skills.map((skill) => (
            <SkillCard
              key={skill._id}
              skill={{ ...skill, userId: { _id: user._id, name: user.name } }}
              onDelete={handleDelete}
              onEdit={handleEditOpen}
            />
          ))}
        </div>
      )}

      {/* ─── Edit Modal ───────────────────────────────────────────────────────── */}
      {editSkill && (
        <div className="modal-overlay" onClick={() => setEditSkill(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Skill</h2>
              <button className="modal-close" onClick={() => setEditSkill(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Title</label>
                <input className="form-input" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-input" rows="3" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select className="form-input" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Level</label>
                  <select className="form-input" value={editForm.level} onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}>
                    {LEVELS.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setEditSkill(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleEditSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;