import { 
  IconNews, 
  IconCategory, 
  IconUsers, 
  IconPlus 
} from '../common/Icons';

export default function Dashboard({ 
  categories = [], 
  news = [], 
  users = [], 
  onNavigateTab 
}) {
  const publishedNews = news.filter(n => n.status === 1).length;
  const draftNews = news.filter(n => n.status === 0).length;
  const activeCategories = categories.filter(c => c.status === 1).length;
  const adminUsers = users.filter(u => u.role === 1).length;
  const staffUsers = users.filter(u => u.role === 2).length;

  const categoryMap = {};
  categories.forEach(c => { categoryMap[c.id] = c.name; });

  const recentNews = [...news].reverse().slice(0, 5);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive Dashboard</h1>
          <p className="page-subtitle">
            Real-time analytics and publication metrics for FUNewsManagementSystem.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => onNavigateTab('categories')}
          >
            Manage Categories
          </button>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={() => onNavigateTab('news')}
          >
            <IconPlus size={16} />
            <span>Publish Article</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <div className="stat-label">Total Articles</div>
            <div className="stat-value">{news.length}</div>
            <div className="stat-sub">{publishedNews} published · {draftNews} draft</div>
          </div>
          <div className="stat-icon-wrap icon-blue">
            <IconNews size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Categories</div>
            <div className="stat-value">{categories.length}</div>
            <div className="stat-sub">{activeCategories} active · {categories.length - activeCategories} inactive</div>
          </div>
          <div className="stat-icon-wrap icon-emerald">
            <IconCategory size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">System Users</div>
            <div className="stat-value">{users.length}</div>
            <div className="stat-sub">{adminUsers} Admin · {staffUsers} Staff</div>
          </div>
          <div className="stat-icon-wrap icon-purple">
            <IconUsers size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Publish Rate</div>
            <div className="stat-value">
              {news.length > 0 ? Math.round((publishedNews / news.length) * 100) : 0}%
            </div>
            <div className="stat-sub">Active content ratio</div>
          </div>
          <div className="stat-icon-wrap icon-amber">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent News + Category Breakdown */}
      <div className="dashboard-columns">
        {/* Left: Recent News */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent News Articles</h2>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm" 
              onClick={() => onNavigateTab('news')}
            >
              View All News ({news.length})
            </button>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentNews.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate-500)' }}>
                      No news articles published yet.
                    </td>
                  </tr>
                ) : (
                  recentNews.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{item.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--slate-400)' }}>{item.createdAt}</div>
                      </td>
                      <td>
                        <span className="badge badge-category">
                          {categoryMap[item.categoryId] || 'Category'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{item.createdBy}</td>
                      <td>
                        <span className={`badge ${item.status === 1 ? 'badge-active' : 'badge-inactive'}`}>
                          <span className="badge-dot" />
                          {item.status === 1 ? 'Published' : 'Draft'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Category Distribution */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Category Distribution</h2>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm" 
              onClick={() => onNavigateTab('categories')}
            >
              Manage
            </button>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {categories.map(cat => {
                const count = news.filter(n => n.categoryId === cat.id).length;
                const percentage = news.length > 0 ? Math.round((count / news.length) * 100) : 0;
                return (
                  <div key={cat.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--slate-800)' }}>{cat.name}</span>
                      <span style={{ color: 'var(--slate-500)', fontSize: '0.8rem' }}>
                        {count} articles ({percentage}%)
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--slate-100)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${percentage}%`, 
                          height: '100%', 
                          background: cat.status === 1 ? 'var(--primary-600)' : 'var(--slate-400)',
                          borderRadius: '4px' 
                        }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
