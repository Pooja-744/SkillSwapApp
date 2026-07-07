// src/components/SkillCard.js — Reusable card for displaying a skill
import React from 'react';
import { useAuth } from '../context/AuthContext';

// Maps categories to emoji icons
const categoryIcons = {
  Technology: '💻', Design: '🎨', Music: '🎵', Language: '🗣️',
  Cooking: '🍳', Fitness: '💪', Art: '🖼️', Business: '💼',
  Photography: '📷', Writing: '✍️', Other: '🌟',
};

const levelColors = {
  Beginner: '#22c55e',
  Intermediate: '#f59e0b',
  Advanced: '#ef4444',
  Expert: '#8b5cf6',
};

const SkillCard = ({ skill, onDelete, onEdit }) => {
  const { user } = useAuth();
  const isOwner = user && skill.userId?._id === user._id;

  return (
    <div className="skill-card">
      {/* ─── Category Icon Header ─────────────────────────────────────────── */}
      <div className="card-icon-header">
        <span className="category-icon">{categoryIcons[skill.category] || '🌟'}</span>
        <span
          className="level-badge"
          style={{ background: levelColors[skill.level] + '20', color: levelColors[skill.level] }}
        >
          {skill.level}
        </span>
      </div>

      {/* ─── Skill Content ────────────────────────────────────────────────── */}
      <h3 className="card-title">{skill.title}</h3>
      <p className="card-description">{skill.description}</p>

      {/* ─── Category Tag ─────────────────────────────────────────────────── */}
      <span className="category-tag">{skill.category}</span>

      {/* ─── Card Footer: Owner Info ──────────────────────────────────────── */}
      <div className="card-footer">
        <div className="card-user">
          <div className="user-avatar-sm">
            {skill.userId?.name?.charAt(0).toUpperCase() || '?'}
          </div>
          <span className="user-name-sm">{skill.userId?.name || 'Unknown'}</span>
        </div>

        {/* ─── Owner Actions ────────────────────────────────────────────────── */}
        {isOwner && (
          <div className="card-actions">
            {onEdit && (
              <button className="btn-icon" onClick={() => onEdit(skill)} title="Edit">✏️</button>
            )}
            {onDelete && (
              <button className="btn-icon danger" onClick={() => onDelete(skill._id)} title="Delete">🗑️</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillCard;