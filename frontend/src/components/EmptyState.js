// src/components/EmptyState.js — Friendly empty state placeholder
import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({ icon = '📭', title, message, actionLabel, actionTo }) => (
  <div className="empty-state">
    <div className="empty-icon">{icon}</div>
    <h3 className="empty-title">{title}</h3>
    <p className="empty-message">{message}</p>
    {actionLabel && actionTo && (
      <Link to={actionTo} className="btn btn-primary">{actionLabel}</Link>
    )}
  </div>
);

export default EmptyState;