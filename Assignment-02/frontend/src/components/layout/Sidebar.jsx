import { 
  IconDashboard, 
  IconCategory, 
  IconNews, 
  IconUsers, 
  IconSettings 
} from '../common/Icons';

export default function Sidebar({ 
  activeTab, 
  onSelectTab, 
  counts = { categories: 0, news: 0, users: 0 },
  currentUser,
  onViewPublic
}) {
  const isAdmin = currentUser?.role === 1 || currentUser?.accountRole === 1;

  // Build menu items dynamically based on Role
  const allMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <IconDashboard size={18} />,
      roles: [1, 2] // Both
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: <IconCategory size={18} />,
      count: counts.categories,
      roles: [2] // Staff only
    },
    {
      id: 'news',
      label: 'News Articles',
      icon: <IconNews size={18} />,
      count: counts.news,
      roles: [2] // Staff only
    },
    {
      id: 'my-history',
      label: 'My News History',
      icon: <IconNews size={18} />,
      roles: [2] // Staff only
    },
    {
      id: 'users',
      label: 'User Accounts',
      icon: <IconUsers size={18} />,
      count: counts.users,
      roles: [1] // Admin only
    },
    {
      id: 'settings',
      label: isAdmin ? 'Settings' : 'My Profile & Settings',
      icon: <IconSettings size={18} />,
      roles: [1, 2] // Both
    }
  ];

  const userRole = currentUser?.role || currentUser?.accountRole || 2;
  const menuItems = allMenuItems.filter((item) => item.roles.includes(userRole));

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <img 
          src="/fu_news_logo.jpg" 
          alt="FUNewsManagementSystem AI Logo" 
          className="sidebar-logo" 
        />
        <div className="sidebar-brand-text">
          <h1>FUNews</h1>
          <span>{isAdmin ? 'Admin Portal' : 'Staff Portal'}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">
          {isAdmin ? 'Administrator Navigation' : 'Staff Editorial Navigation'}
        </div>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`nav-item-btn ${isActive ? 'active' : ''}`}
              onClick={() => onSelectTab(item.id)}
            >
              <div className="nav-item-content">
                <span className="nav-item-icon">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && item.count > 0 && (
                <span className="nav-badge">{item.count}</span>
              )}
            </button>
          );
        })}

        {onViewPublic && (
          <div style={{ marginTop: '1.5rem', padding: '0 0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onViewPublic}
              style={{ width: '100%', fontSize: '0.8rem', justifyContent: 'center' }}
            >
              🌐 View Public Portal
            </button>
          </div>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="user-mini-card">
          <div className="user-avatar">
            {(currentUser?.username || currentUser?.accountName || 'A').slice(0, 1).toUpperCase()}
          </div>
          <div className="user-details">
            <div className="user-name">
              {currentUser?.fullName || currentUser?.accountName || currentUser?.username || 'User'}
            </div>
            <div className="user-role-label">
              {isAdmin ? 'Administrator (Role 1)' : 'Staff Member (Role 2)'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
