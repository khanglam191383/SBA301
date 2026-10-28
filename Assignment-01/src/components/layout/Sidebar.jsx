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
  currentUser 
}) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <IconDashboard size={18} />
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: <IconCategory size={18} />,
      count: counts.categories
    },
    {
      id: 'news',
      label: 'News Articles',
      icon: <IconNews size={18} />,
      count: counts.news
    },
    {
      id: 'users',
      label: 'User Accounts',
      icon: <IconUsers size={18} />,
      count: counts.users
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <IconSettings size={18} />
    }
  ];

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
          <span>Management</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Navigation Menu</div>
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
              {item.count !== undefined && (
                <span className="nav-badge">{item.count}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-mini-card">
          <div className="user-avatar">
            {(currentUser?.username || 'A').slice(0, 1).toUpperCase()}
          </div>
          <div className="user-details">
            <div className="user-name">
              {currentUser?.fullName || currentUser?.username || 'Administrator'}
            </div>
            <div className="user-role-label">
              {currentUser?.role === 1 ? 'Administrator' : 'Staff Member'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
