// src/pages/BrowseSkills.js — Searchable, filterable skills directory
import React, { useEffect, useState, useCallback } from 'react';
import api from '../utils/api';
import SkillCard from '../components/SkillCard';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Technology', 'Design', 'Music', 'Language', 'Cooking', 'Fitness', 'Art', 'Business', 'Photography', 'Writing', 'Other'];
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];

const BrowseSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // ─── Debounce search input (avoid API call on every keystroke) ─────────────
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [debouncedSearch, category, level]);

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit: 12,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(category !== 'All' && { category }),
        ...(level !== 'All' && { level }),
      });
      const { data } = await api.get(`/skills?${params}`);
      setSkills(data.data);
      setPagination(data.pagination);
    } catch {
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, category, level]);

  useEffect(() => { fetchSkills(); }, [fetchSkills]);

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setLevel('All');
  };

  const hasActiveFilters = search || category !== 'All' || level !== 'All';

  return (
    <div className="page browse-page">
      {/* ─── Page Header ──────────────────────────────────────────────────────── */}
      <div className="browse-header">
        <h1 className="page-title">Browse Skills</h1>
        <p className="page-subtitle">
          Discover {pagination.total || 0} skills from our community
        </p>
      </div>

      {/* ─── Search & Filters ─────────────────────────────────────────────────── */}
      <div className="browse-controls">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search skills by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="filter-select">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Level</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="filter-select">
              {LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
          {hasActiveFilters && (
            <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
              Clear Filters ✕
            </button>
          )}
        </div>

        {/* Category pills for quick filtering */}
        <div className="category-pills">
          {CATEGORIES.slice(1).map((c) => (
            <button
              key={c}
              className={`pill ${category === c ? 'active' : ''}`}
              onClick={() => setCategory(category === c ? 'All' : c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Results ──────────────────────────────────────────────────────────── */}
      {loading ? (
        <Spinner />
      ) : skills.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No skills found"
          message={hasActiveFilters ? 'Try adjusting your search or filters' : 'Be the first to add a skill!'}
          actionLabel={hasActiveFilters ? undefined : 'Add a Skill'}
          actionTo={hasActiveFilters ? undefined : '/add-skill'}
        />
      ) : (
        <>
          <div className="results-info">
            Showing {skills.length} of {pagination.total} skills
          </div>
          <div className="skills-grid">
            {skills.map((skill) => (
              <SkillCard key={skill._id} skill={skill} />
            ))}
          </div>

          {/* ─── Pagination ─────────────────────────────────────────────────── */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-outline btn-sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                ← Previous
              </button>
              <div className="page-numbers">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className={`page-btn ${p === page ? 'active' : ''}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                className="btn btn-outline btn-sm"
                disabled={page === pagination.pages}
                onClick={() => setPage(page + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BrowseSkills;