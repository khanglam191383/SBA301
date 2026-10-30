import Header from './Header';
import Sidebar from './Sidebar';
import Dashboard from '../dashboard/Dashboard';
import CategoryManagement from '../categories/CategoryManagement';
import NewsManagement from '../news/NewsManagement';
import MyNewsHistory from '../news/MyNewsHistory';
import UserManagement from '../users/UserManagement';
import SettingsPage from '../settings/SettingsPage';

export default function AdminLayout({
  currentUser,
  activeTab,
  onSelectTab,
  onLogout,
  onResetData,
  onRefreshData,
  onViewPublic,
  onProfileUpdated,
  categories,
  news,
  users,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onAddNews,
  onUpdateNews,
  onDeleteNews,
  onAddUser,
  onUpdateUser,
  onDeleteUser
}) {
  const counts = {
    categories: categories.length,
    news: news.length,
    users: users.length
  };

  return (
    <div className="admin-layout">
      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        counts={counts}
        currentUser={currentUser}
        onViewPublic={onViewPublic}
      />

      {/* Main Panel */}
      <div className="admin-main-wrapper">
        <Header
          currentUser={currentUser}
          activeTab={activeTab}
          onLogout={onLogout}
          onResetData={onResetData}
          onRefreshData={onRefreshData}
        />

        <main className="admin-content">
          {activeTab === 'dashboard' && (
            <Dashboard
              categories={categories}
              news={news}
              users={users}
              onNavigateTab={onSelectTab}
            />
          )}

          {activeTab === 'categories' && (
            <CategoryManagement
              categories={categories}
              news={news}
              onAddCategory={onAddCategory}
              onUpdateCategory={onUpdateCategory}
              onDeleteCategory={onDeleteCategory}
            />
          )}

          {activeTab === 'news' && (
            <NewsManagement
              news={news}
              categories={categories}
              currentUser={currentUser}
              onAddNews={onAddNews}
              onUpdateNews={onUpdateNews}
              onDeleteNews={onDeleteNews}
            />
          )}

          {activeTab === 'my-history' && (
            <MyNewsHistory
              currentUser={currentUser}
            />
          )}

          {activeTab === 'users' && (
            <UserManagement
              users={users}
              currentUser={currentUser}
              onAddUser={onAddUser}
              onUpdateUser={onUpdateUser}
              onDeleteUser={onDeleteUser}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPage
              currentUser={currentUser}
              onProfileUpdated={onProfileUpdated}
              categories={categories}
              news={news}
              users={users}
            />
          )}
        </main>
      </div>
    </div>
  );
}
