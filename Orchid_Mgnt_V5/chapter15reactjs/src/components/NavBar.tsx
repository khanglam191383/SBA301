import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function NavBar() {
  const location = useLocation();

  return (
    <header className="app-navbar">
      <div className="navbar-container">
        <Link to="/" className="brand-logo">
          <span className="brand-icon">🌸</span>
          <div className="brand-text">
            <span className="brand-title">ORCHID STUDIO</span>
            <span className="brand-subtitle">SBA301 Lab 05 Management</span>
          </div>
        </Link>
        <nav className="nav-links">
          <Link
            to="/"
            className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
            id="nav-list-link"
          >
            <span className="nav-icon">📋</span>
            <span>Danh sách</span>
          </Link>
          <Link
            to="/orchids/new"
            className={`nav-item nav-btn-create ${location.pathname === '/orchids/new' ? 'active' : ''}`}
            id="nav-create-link"
          >
            <span className="nav-icon">✨</span>
            <span>Thêm hoa lan mới</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
