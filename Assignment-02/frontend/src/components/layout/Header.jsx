import { IconLogout, IconRefresh } from '../common/Icons';

export default function Header({ 
  currentUser, 
  activeTab, 
  onLogout, 
  onResetData,
  onRefreshData
}) {
  const isAdmin = currentUser?.role === 1 || currentUser?.accountRole === 1;

  const getTabLabel = (tab) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard';
      case 'categories': return 'Category Management';
      case 'news': return 'News Management';
      case 'my-history': return 'My News History';
      case 'users': return 'Account Management';
      case 'settings': return isAdmin ? 'System Settings' : 'My Profile';
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
        {onRefreshData && (
          <button 
            type="button" 
            className="btn btn-secondary btn-sm" 
            onClick={onRefreshData}
            title="Refresh current data from REST API"
          >
            <IconRefresh size={14} />
            <span>Refresh</span>
          </button>
        )}

        {onResetData && (
          <button 
            type="button" 
            className="btn btn-secondary btn-sm" 
            onClick={onResetData}
            title="Reset data back to factory defaults"
          >
            <span>Factory Reset</span>
          </button>
        )}

        <div className="header-user-badge">
          <span style={{ fontWeight: 600, color: 'var(--slate-800)' }}>
            {currentUser?.fullName || currentUser?.accountName || currentUser?.username || 'User'}
          </span>
          <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-staff'}`}>
            {isAdmin ? 'Admin' : 'Staff'}
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
