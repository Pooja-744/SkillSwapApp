// src/components/Spinner.js — Loading indicator
import React from 'react';

const Spinner = ({ fullScreen, size = 'md' }) => {
  const sizes = { sm: '20px', md: '40px', lg: '60px' };

  const spinner = (
    <div
      style={{
        width: sizes[size],
        height: sizes[size],
        border: '3px solid var(--border)',
        borderTop: '3px solid var(--accent)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    />
  );

  if (fullScreen) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'var(--bg)',
      }}>
        {spinner}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      {spinner}
    </div>
  );
};

export default Spinner;