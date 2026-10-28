import { IconLogout, IconRefresh } from '../common/Icons';

export default function Header({ 
  currentUser, 
  activeTab, 
  onLogout, 
  onResetData 
}) {
  const getTabLabel = (tab) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard';
      case 'categories': return 'Category Management';
      case 'news': return 'News Management';
      case 'users': return 'User Management';
      case 'settings': return 'System Settings';
      default: return 'Overview';
    }
  };

  return (
    <header className="admin-header">
      <div className="header-breadcrumbs">
        <span>FUNewsManagementSystem</span>
        <span>/</span>
        <span className="active">{getTabLabel(activeTab)}</span>
      </div>

      <div className="header-actions">
        <button 
          type="button" 
          className="btn btn-secondary btn-sm" 
          onClick={onResetData}
          title="Reset all mock data back to factory defaults"
        >
          <IconRefresh size={14} />
          <span>Reset Data</span>
        </button>

        <div className="header-user-badge">
          <span style={{ fontWeight: 600, color: 'var(--slate-800)' }}>
            {currentUser?.fullName || currentUser?.username || 'Administrator'}
          </span>
          <span className={`badge ${currentUser?.role === 1 ? 'badge-admin' : 'badge-staff'}`}>
            {currentUser?.role === 1 ? 'Admin' : 'Staff'}
          </span>
        </div>

        <button 
          type="button" 
          className="btn btn-secondary btn-sm" 
          onClick={onLogout}
          title="Sign out of administration portal"
        >
          <IconLogout size={14} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
