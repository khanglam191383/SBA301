import { useState } from 'react';
import { IconAlertTriangle } from '../common/Icons';

export default function LoginPage({ onLogin, users = [] }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [authError, setAuthError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    const errors = {};

    if (!username.trim()) {
      errors.username = 'Username is required';
    }
    if (!password.trim()) {
      errors.password = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    // Check credentials against mock users list or default Admin/Admin
    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    // Check default requirement: Admin / Admin
    if (trimmedUser.toLowerCase() === 'admin' && trimmedPass === 'Admin') {
      const adminUser = users.find(u => u.username.toLowerCase() === 'admin') || {
        id: 1,
        username: 'Admin',
        fullName: 'Lam Hoang Khang (Administrator)',
        email: 'admin.funews@fpt.edu.vn',
        role: 1,
        status: 1
      };
      onLogin(adminUser);
      return;
    }

    // Check other mock users (e.g. staff accounts)
    const matchedUser = users.find(
      u => u.username.toLowerCase() === trimmedUser.toLowerCase() && u.password === trimmedPass
    );

    if (matchedUser) {
      if (matchedUser.status === 0) {
        setAuthError('This account is currently inactive. Please contact administrator.');
        return;
      }
      onLogin(matchedUser);
    } else {
      setAuthError('Invalid credentials. Please verify your username and password.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo-wrap">
            <img 
              src="/fu_news_logo.jpg" 
              alt="FUNewsManagementSystem Logo" 
              className="auth-logo-img" 
            />
          </div>
          <h1 className="auth-title">FUNews Portal</h1>
          <p className="auth-subtitle">Single Page Application Management System</p>
        </div>

        {authError && (
          <div className="auth-alert-error" role="alert" style={{ marginBottom: '1.25rem' }}>
            <IconAlertTriangle size={18} />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              <span>Username</span>
              <span className="required">*</span>
            </label>
            <input
              id="username"
              type="text"
              className={`form-input ${fieldErrors.username ? 'has-error' : ''}`}
              placeholder="Enter username (e.g. Admin)"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (fieldErrors.username) {
                  setFieldErrors(prev => ({ ...prev, username: '' }));
                }
              }}
              autoComplete="username"
              autoFocus
            />
            {fieldErrors.username && <span className="form-error">{fieldErrors.username}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              <span>Password</span>
              <span className="required">*</span>
            </label>
            <input
              id="password"
              type="password"
              className={`form-input ${fieldErrors.password ? 'has-error' : ''}`}
              placeholder="Enter password (e.g. Admin)"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) {
                  setFieldErrors(prev => ({ ...prev, password: '' }));
                }
              }}
              autoComplete="current-password"
            />
            {fieldErrors.password && <span className="form-error">{fieldErrors.password}</span>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%', padding: '0.8rem' }}>
            Sign In to Dashboard
          </button>
        </form>

        <div className="auth-credentials-hint">
          <strong>Default Evaluation Credentials:</strong>
          <div style={{ marginTop: '0.35rem' }}>
            Username: <code>Admin</code> | Password: <code>Admin</code>
          </div>
          <div style={{ marginTop: '0.2rem', color: 'var(--slate-500)', fontSize: '0.75rem' }}>
            Staff demo: <code>staff01</code> / <code>Password123</code>
          </div>
        </div>
      </div>
    </div>
  );
}
