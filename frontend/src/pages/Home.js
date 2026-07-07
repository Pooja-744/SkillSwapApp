// src/pages/Home.js — Landing page with hero, features, and stats
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: '🔍', title: 'Discover Skills', desc: 'Browse hundreds of skills shared by real people in your community.' },
  { icon: '🤝', title: 'Connect & Swap', desc: 'Reach out to skill owners and arrange a mutually beneficial exchange.' },
  { icon: '📈', title: 'Grow Together', desc: 'Learn something new while teaching what you know best.' },
  { icon: '🌍', title: 'Global Community', desc: 'Connect with learners and teachers from around the world.' },
];

const stats = [
  { value: '500+', label: 'Skills Listed' },
  { value: '1,200+', label: 'Members' },
  { value: '50+', label: 'Categories' },
  { value: '98%', label: 'Satisfaction' },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      {/* ─── Hero Section ─────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-badge">✨ The Skills Exchange Platform</div>
          <h1 className="hero-title">
            Trade Skills,<br />
            <span className="gradient-text">Grow Together</span>
          </h1>
          <p className="hero-subtitle">
            Join a community where knowledge flows freely. Share what you know,
            learn what you need — no money required.
          </p>
          <div className="hero-cta">
            {user ? (
              <>
                <Link to="/browse" className="btn btn-primary btn-lg">Explore Skills</Link>
                <Link to="/add-skill" className="btn btn-outline btn-lg">Share a Skill</Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
                <Link to="/browse" className="btn btn-outline btn-lg">Browse Skills</Link>
              </>
            )}
          </div>
        </div>

        {/* Floating cards decoration */}
        <div className="hero-decoration">
          {['💻 React Dev', '🎨 UI Design', '🎵 Guitar', '🍳 Cooking', '📷 Photography'].map((s, i) => (
            <div key={i} className="floating-tag" style={{ animationDelay: `${i * 0.3}s` }}>{s}</div>
          ))}
        </div>
      </section>

      {/* ─── Stats Bar ────────────────────────────────────────────────────────── */}
      <section className="stats-bar">
        {stats.map((s, i) => (
          <div key={i} className="stat-item">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ─── Features Section ─────────────────────────────────────────────────── */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">How SkillSwap Works</h2>
          <p className="section-subtitle">Simple, fair, and community-driven</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA Banner ───────────────────────────────────────────────────────── */}
      {!user && (
        <section className="cta-banner">
          <h2>Ready to Start Swapping?</h2>
          <p>Join thousands of people exchanging skills every day.</p>
          <Link to="/register" className="btn btn-white btn-lg">Create Free Account →</Link>
        </section>
      )}
    </div>
  );
};

export default Home;