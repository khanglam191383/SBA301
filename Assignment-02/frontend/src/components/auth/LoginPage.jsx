import { useState } from 'react';
import { IconAlertTriangle } from '../common/Icons';
import { authService } from '../../services/authService';
import { getApiErrorMessage } from '../../services/api';

export default function LoginPage({ onLogin, onBackToPublic }) {
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const resolveEmail = (input) => {
    const trimmed = input.trim();
    if (trimmed.includes('@')) {
      return trimmed;
    }
    // Convenience aliases for quick evaluation
    if (trimmed.toLowerCase() === 'admin') {
      return 'admin.funews@fpt.edu.vn';
    }
    if (trimmed.toLowerCase() === 'staff01' || trimmed.toLowerCase() === 'staff') {
      return 'staff01@funews.edu.vn';
    }
    return trimmed;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    const errors = {};

    if (!emailOrUser.trim()) {
      errors.email = 'Email or Username is required';
    }
    if (!password.trim()) {
      errors.password = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    setLoading(true);
    const targetEmail = resolveEmail(emailOrUser);

    try {
      const result = await authService.login(targetEmail, password.trim());
      setLoading(false);
      onLogin(result.user);
    } catch (err) {
      setLoading(false);
      const msg = getApiErrorMessage(err, 'Invalid credentials. Please verify your email and password.');
      setAuthError(msg);
    }
  };

  const handleFillDemo = (user, pass) => {
    setEmailOrUser(user);
    setPassword(pass);
    setFieldErrors({});
    setAuthError('');
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
            <label className="form-label" htmlFor="emailOrUser">
              <span>Email / Username</span>
              <span className="required">*</span>
            </label>
            <input
              id="emailOrUser"
              type="text"
              className={`form-input ${fieldErrors.email ? 'has-error' : ''}`}
              placeholder="Enter email (e.g. admin.funews@fpt.edu.vn or Admin)"
              value={emailOrUser}
              onChange={(e) => {
                setEmailOrUser(e.target.value);
                if (fieldErrors.email) {
                  setFieldErrors(prev => ({ ...prev, email: '' }));
                }
              }}
              autoComplete="username"
              autoFocus
            />
            {fieldErrors.email && <span className="form-error">{fieldErrors.email}</span>}
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

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ marginTop: '0.5rem', width: '100%', padding: '0.8rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Management'}
          </button>

          {onBackToPublic && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onBackToPublic}
              style={{ marginTop: '0.65rem', width: '100%', padding: '0.65rem' }}
            >
              ← Back to Public News
            </button>
          )}
        </form>

        <div className="auth-credentials-hint">
          <strong>Quick Demo Credentials:</strong>
          <div style={{ marginTop: '0.4rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              type="button" 
              className="btn btn-sm btn-secondary"
              onClick={() => handleFillDemo('admin.funews@fpt.edu.vn', 'Admin')}
              title="Click to fill Admin credentials"
            >
              Fill Admin (Role 1)
            </button>
            <button 
              type="button" 
              className="btn btn-sm btn-secondary"
              onClick={() => handleFillDemo('staff01@funews.edu.vn', 'Password123')}
              title="Click to fill Staff credentials"
            >
              Fill Staff (Role 2)
            </button>
          </div>
          <div style={{ marginTop: '0.4rem', color: 'var(--slate-500)', fontSize: '0.75rem' }}>
            Email login authenticated against Spring Boot 3 REST API via JWT.
          </div>
        </div>
      </div>
    </div>
  );
}
