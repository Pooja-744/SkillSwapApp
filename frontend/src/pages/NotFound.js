// src/pages/NotFound.js — 404 page
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="not-found-page">
    <div className="not-found-content">
      <div className="not-found-emoji">🔍</div>
      <h1 className="not-found-code">404</h1>
      <h2 className="not-found-title">Page Not Found</h2>
      <p className="not-found-msg">
        Looks like this skill hasn't been listed yet — or this page doesn't exist.
      </p>
      <Link to="/" className="btn btn-primary btn-lg">← Back to Home</Link>
    </div>
  </div>
);

export default NotFound;