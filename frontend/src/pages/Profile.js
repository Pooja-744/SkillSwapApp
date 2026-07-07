// src/pages/Profile.js — View and edit user profile
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    profileImage: user?.profileImage || '',
    password: '',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { name: formData.name, bio: formData.bio, profileImage: formData.profileImage };
      if (formData.password) payload.password = formData.password;

      const { data } = await api.put('/users/profile', payload);
      updateUser(data.data);
      toast.success('Profile updated!');
      setEditing(false);
      setFormData({ ...formData, password: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase() || '?';

  return (
    <div className="page profile-page">
      <h1 className="page-title">Profile</h1>
      <p className="page-subtitle">Manage your personal information</p>

      <div className="profile-container">
        {/* ─── Avatar Section ─────────────────────────────────────────────────── */}
        <div className="profile-avatar-section">
          {user?.profileImage ? (
            <img src={user.profileImage} alt="Profile" className="avatar-lg" />
          ) : (
            <div className="avatar-lg avatar-placeholder">{initials}</div>
          )}
          <h2 className="profile-name">{user?.name}</h2>
          <p className="profile-email">{user?.email}</p>
          {user?.bio && <p className="profile-bio">{user.bio}</p>}
          <div className="profile-badge">
            <span>Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        {/* ─── Edit Form ──────────────────────────────────────────────────────── */}
        <div className="profile-form-section">
          <div className="profile-form-header">
            <h3>Account Information</h3>
            {!editing && (
              <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>

          {!editing ? (
            // ─── View Mode ──────────────────────────────────────────────────────
            <div className="profile-info-list">
              <div className="info-row">
                <span className="info-label">Name</span>
                <span className="info-value">{user?.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email</span>
                <span className="info-value">{user?.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Bio</span>
                <span className="info-value">{user?.bio || 'No bio yet'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Profile Image URL</span>
                <span className="info-value">{user?.profileImage || 'Not set'}</span>
              </div>
            </div>
          ) : (
            // ─── Edit Mode ──────────────────────────────────────────────────────
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea name="bio" className="form-input" rows="3" value={formData.bio} onChange={handleChange} maxLength={300} />
                <span className="char-count">{formData.bio.length}/300</span>
              </div>
              <div className="form-group">
                <label>Profile Image URL <span className="optional">(optional)</span></label>
                <input type="url" name="profileImage" className="form-input" placeholder="https://..." value={formData.profileImage} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>New Password <span className="optional">(leave blank to keep current)</span></label>
                <input type="password" name="password" className="form-input" placeholder="Min 6 characters" value={formData.password} onChange={handleChange} />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={() => { setEditing(false); setFormData({ name: user.name, bio: user.bio || '', profileImage: user.profileImage || '', password: '' }); }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;