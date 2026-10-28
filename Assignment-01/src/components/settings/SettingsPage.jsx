import { useState } from 'react';
import { IconRefresh, IconCheck } from '../common/Icons';

export default function SettingsPage({ 
  currentUser, 
  onResetAllData, 
  categories = [], 
  news = [], 
  users = [] 
}) {
  const [profileName, setProfileName] = useState(currentUser?.fullName || 'Lam Hoang Khang (Administrator)');
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || 'admin.funews@fpt.edu.vn');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportJSON = () => {
    const backupData = {
      system: 'FUNewsManagementSystem',
      student: 'Lam Hoang Khang - SE1910',
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
          <h1 className="page-title">System Settings & Profile</h1>
          <p className="page-subtitle">
            Configure system parameters, administrative preferences, and mock storage state.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Administrator Profile Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Administrator Profile</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSaveProfile} style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {savedSuccess && (
                <div style={{ background: 'var(--success-50)', color: 'var(--success-700)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <IconCheck size={18} />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="prof-user">
                  <span>Username</span>
                </label>
                <input
                  id="prof-user"
                  type="text"
                  className="form-input"
                  value={currentUser?.username || 'Admin'}
                  disabled
                  style={{ background: 'var(--slate-100)', cursor: 'not-allowed' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prof-name">
                  <span>Display Name</span>
                </label>
                <input
                  id="prof-name"
                  type="text"
                  className="form-input"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="prof-email">
                  <span>Contact Email</span>
                </label>
                <input
                  id="prof-email"
                  type="email"
                  className="form-input"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                />
              </div>

              <div>
                <button type="submit" className="btn btn-primary">
                  Save Profile Settings
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* System & Data Management Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Mock Storage & System Diagnostics</h2>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>APPLICATION</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '0.2rem' }}>
                  FUNewsManagementSystem
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Project: LamHoangKhang_SE1910</div>
              </div>

              <div style={{ padding: '1rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>FRAMEWORK & RUNTIME</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '0.2rem' }}>
                  React 19 + Vite 8
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Single Page Application Architecture</div>
              </div>

              <div style={{ padding: '1rem', background: 'var(--slate-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>PERSISTED RECORDS</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-900)', marginTop: '0.2rem' }}>
                  {categories.length + news.length + users.length} Total Records
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
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={onResetAllData}
              >
                <IconRefresh size={16} />
                <span>Reset All to Default Initial Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
