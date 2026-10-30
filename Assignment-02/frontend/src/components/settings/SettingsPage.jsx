import { useState, useEffect } from 'react';
import { profileService } from '../../services/profileService';
import { getApiErrorMessage } from '../../services/api';
import { IconCheck, IconAlertTriangle } from '../common/Icons';

export default function SettingsPage({ 
  currentUser, 
  onProfileUpdated,
  categories = [], 
  news = [], 
  users = [] 
}) {
  const isAdmin = currentUser?.role === 1 || currentUser?.accountRole === 1;
  const [profileName, setProfileName] = useState(currentUser?.fullName || currentUser?.accountName || '');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || currentUser?.accountEmail || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch live profile from backend
    profileService.getProfile()
      .then((data) => {
        if (data) {
          setProfileName(data.accountName || '');
          setProfileEmail(data.accountEmail || '');
        }
      })
      .catch(() => {
        // Fallback to currentUser
      });
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSavedSuccess(false);

    if (!profileName.trim()) {
      setErrorMessage('Display Name cannot be blank.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your new password.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        accountName: profileName.trim()
      };
      if (newPassword.trim()) {
        payload.password = newPassword.trim();
      }

      const updated = await profileService.updateProfile(payload);
      setSavedSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
      if (onProfileUpdated) {
        onProfileUpdated(updated);
      }
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      setErrorMessage(getApiErrorMessage(err, 'Failed to update profile settings.'));
    } finally {
      setLoading(false);
    }
  };

  const handleExportJSON = () => {
    const backupData = {
      system: 'FUNewsManagementSystem',
      exportedAt: new Date().toISOString(),
      categories,
      news,
      users
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `funews_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{isAdmin ? 'System Settings & Profile' : 'My Account Profile'}</h1>
          <p className="page-subtitle">
            {isAdmin 
              ? 'Configure administrator profile, system diagnostics, and security credentials.'
              : 'Manage your staff profile credentials, display name, and password.'}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Profile Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Personal Profile Information</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSaveProfile} style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {savedSuccess && (
                <div style={{ background: 'var(--success-50)', color: 'var(--success-700)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <IconCheck size={18} />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              {errorMessage && (
                <div className="auth-alert-error">
                  <IconAlertTriangle size={18} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="prof-email">
                  <span>Registered Account Email</span>
                </label>
                <input
                  id="prof-email"
                  type="email"
                  className="form-input"
                  value={profileEmail}
                  disabled
                  style={{ background: 'var(--slate-100)', cursor: 'not-allowed' }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '0.25rem' }}>
                  Account email serves as your primary login identifier and is managed by administrators.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prof-name">
                  <span>Display Name / Full Name</span>
                  <span className="required">*</span>
                </label>
                <input
                  id="prof-name"
                  type="text"
                  className="form-input"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prof-newpass">
                  <span>Change Password</span>
                </label>
                <input
                  id="prof-newpass"
                  type="password"
                  className="form-input"
                  placeholder="Leave blank to keep current password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              {newPassword && (
                <div className="form-group">
                  <label className="form-label" htmlFor="prof-confirmpass">
                    <span>Confirm New Password</span>
                    <span className="required">*</span>
                  </label>
                  <input
                    id="prof-confirmpass"
                    type="password"
                    className="form-input"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
              )}

              <div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* System & Data Management Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">System & API Status</h2>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>APPLICATION</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '0.2rem' }}>
                  FUNewsManagementSystem
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>RESTful Web Service (Spring Boot 3)</div>
              </div>

              <div style={{ padding: '1rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>API AUTHENTICATION</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '0.2rem' }}>
                  Stateless JWT Bearer
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Role: {isAdmin ? 'Administrator (Role 1)' : 'Staff Member (Role 2)'}</div>
              </div>

              <div style={{ padding: '1rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>LIVE COUNTS</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '0.2rem' }}>
                  {categories.length + news.length + users.length} Active Records
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                  {categories.length} Categories · {news.length} News · {users.length} Users
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleExportJSON}
              >
                <span>Export Data as JSON Backup</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
