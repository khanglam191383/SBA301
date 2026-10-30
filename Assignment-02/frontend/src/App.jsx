import { useState, useEffect, useCallback } from 'react';
import { authService } from './services/authService';
import { accountService } from './services/accountService';
import { categoryService } from './services/categoryService';
import { newsService } from './services/newsService';
import { getApiErrorMessage } from './services/api';

import LoginPage from './components/auth/LoginPage';
import PublicNewsPortal from './components/public/PublicNewsPortal';
import AdminLayout from './components/layout/AdminLayout';
import ToastContainer from './components/common/Toast';
import ConfirmDialog from './components/common/ConfirmDialog';

function App() {
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const [viewMode, setViewMode] = useState(() => (authService.getCurrentUser() ? 'portal' : 'public'));
  const [categories, setCategories] = useState([]);
  const [news, setNews] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toasts, setToasts] = useState([]);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Toast notification helper
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load live data from Spring Boot REST API
  const refreshAllData = useCallback(async () => {
    if (!currentUser) return;
    const isAdmin = currentUser.role === 1 || currentUser.accountRole === 1;

    try {
      if (isAdmin) {
        // Admin loads accounts, and also categories & news for dashboard metrics
        const [usersData, catsData, newsData] = await Promise.all([
          accountService.getAll(),
          categoryService.getAll(),
          newsService.getStaffNews()
        ]);
        setUsers(usersData || []);
        setCategories(catsData || []);
        setNews(newsData || []);
      } else {
        // Staff loads categories and news
        const [catsData, newsData] = await Promise.all([
          categoryService.getAll(),
          newsService.getStaffNews()
        ]);
        setCategories(catsData || []);
        setNews(newsData || []);
      }
    } catch (err) {
      console.error('Error refreshing data from REST API:', err);
    }
  }, [currentUser]);

  // Initial load when currentUser is set
  useEffect(() => {
    let isMounted = true;
    if (currentUser) {
      const isAdmin = currentUser.role === 1 || currentUser.accountRole === 1;
      const promises = [
        categoryService.getAll(),
        newsService.getStaffNews()
      ];
      if (isAdmin) {
        promises.push(accountService.getAll());
      }

      Promise.all(promises)
        .then(([cats, newsList, usersList]) => {
          if (isMounted) {
            setCategories(cats || []);
            setNews(newsList || []);
            if (usersList) setUsers(usersList);
          }
        })
        .catch((err) => {
          console.error('Initial data load error:', err);
        });
    }
    return () => { isMounted = false; };
  }, [currentUser]);

  // Listen for 401 unauthorized session expiry
  useEffect(() => {
    const handleUnauthorized = () => {
      setCurrentUser(null);
      setViewMode('login');
      addToast('Your session has expired. Please sign in again.', 'danger');
    };

    window.addEventListener('funews:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('funews:unauthorized', handleUnauthorized);
    };
  }, [addToast]);

  // Auth handlers
  const handleLogin = (user) => {
    setCurrentUser(user);
    setViewMode('portal');
    const isAdmin = user.role === 1 || user.accountRole === 1;
    setActiveTab(isAdmin ? 'users' : 'news');
    addToast(`Welcome back, ${user.fullName || user.username || 'User'}!`, 'success');
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setViewMode('public');
    addToast('You have successfully signed out.', 'info');
  };

  const handleProfileUpdated = (updatedUser) => {
    const merged = { ...currentUser, ...updatedUser };
    setCurrentUser(merged);
    localStorage.setItem('funews_current_user', JSON.stringify(merged));
    addToast('Your profile credentials have been updated.', 'success');
  };

  // Category CRUD Handlers via REST API
  const handleAddCategory = async (newCat) => {
    try {
      const payload = {
        categoryName: newCat.name,
        categoryDescription: newCat.description,
        isActive: newCat.status === 1,
        parentCategoryID: newCat.parentCategoryID || null
      };
      const created = await categoryService.create(payload);
      addToast(`Category "${created.categoryName || created.name}" created successfully!`, 'success');
      await refreshAllData();
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Failed to create category');
      addToast(msg, 'danger');
    }
  };

  const handleUpdateCategory = async (updatedCat) => {
    try {
      const payload = {
        categoryName: updatedCat.name,
        categoryDescription: updatedCat.description,
        isActive: updatedCat.status === 1,
        parentCategoryID: updatedCat.parentCategoryID || null
      };
      const updated = await categoryService.update(updatedCat.id, payload);
      addToast(`Category "${updated.categoryName || updated.name}" updated successfully!`, 'success');
      await refreshAllData();
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Failed to update category');
      addToast(msg, 'danger');
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await categoryService.delete(id);
      addToast(`Category #${id} removed successfully.`, 'danger');
      await refreshAllData();
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Cannot delete category');
      addToast(msg, 'danger');
    }
  };

  // News CRUD Handlers via REST API
  const handleAddNews = async (newArticle) => {
    try {
      const payload = {
        newsTitle: newArticle.title,
        headline: newArticle.headline || '',
        newsContent: newArticle.content,
        newsSource: newArticle.newsSource || 'Editorial Desk',
        categoryID: Number(newArticle.categoryId),
        newsStatus: String(newArticle.status),
        tags: newArticle.tags || ''
      };
      const created = await newsService.create(payload);
      addToast(`Article "${created.newsTitle || created.title}" published!`, 'success');
      await refreshAllData();
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Failed to publish news article');
      addToast(msg, 'danger');
    }
  };

  const handleUpdateNews = async (updatedArticle) => {
    try {
      const payload = {
        newsTitle: updatedArticle.title,
        headline: updatedArticle.headline || '',
        newsContent: updatedArticle.content,
        newsSource: updatedArticle.newsSource || 'Editorial Desk',
        categoryID: Number(updatedArticle.categoryId),
        newsStatus: String(updatedArticle.status),
        tags: updatedArticle.tags || ''
      };
      const updated = await newsService.update(updatedArticle.id, payload);
      addToast(`Article "${updated.newsTitle || updated.title}" updated!`, 'success');
      await refreshAllData();
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Failed to update news article');
      addToast(msg, 'danger');
    }
  };

  const handleDeleteNews = async (id) => {
    try {
      await newsService.delete(id);
      addToast(`Article #${id} removed.`, 'danger');
      await refreshAllData();
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Failed to remove news article');
      addToast(msg, 'danger');
    }
  };

  // User / Account CRUD Handlers via REST API (Admin)
  const handleAddUser = async (newUser) => {
    try {
      const payload = {
        accountName: newUser.fullName || newUser.username,
        accountEmail: newUser.email,
        accountRole: Number(newUser.role),
        accountPassword: newUser.password
      };
      const created = await accountService.create(payload);
      addToast(`Account "${created.accountName || created.username}" created successfully!`, 'success');
      await refreshAllData();
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Failed to create account');
      addToast(msg, 'danger');
    }
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
      const payload = {
        accountName: updatedUser.fullName || updatedUser.username,
        accountEmail: updatedUser.email,
        accountRole: Number(updatedUser.role)
      };
      if (updatedUser.password && updatedUser.password.trim()) {
        payload.accountPassword = updatedUser.password.trim();
      }
      const updated = await accountService.update(updatedUser.id, payload);
      addToast(`Account "${updated.accountName || updated.username}" updated!`, 'success');
      await refreshAllData();
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Failed to update account');
      addToast(msg, 'danger');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await accountService.delete(id);
      addToast(`Account #${id} deleted successfully.`, 'danger');
      await refreshAllData();
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Cannot delete account');
      addToast(msg, 'danger');
    }
  };

  return (
    <>
      {/* 1. Public Visitor Portal */}
      {!currentUser && viewMode === 'public' && (
        <PublicNewsPortal onGoToLogin={() => setViewMode('login')} />
      )}

      {/* 2. Login Page */}
      {!currentUser && viewMode === 'login' && (
        <LoginPage
          onLogin={handleLogin}
          onBackToPublic={() => setViewMode('public')}
        />
      )}

      {/* 3. Authenticated Admin / Staff Portal */}
      {currentUser && (
        <>
          {viewMode === 'public' ? (
            <div>
              <div style={{ background: 'var(--primary-900)', color: '#ffffff', padding: '0.6rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem' }}>
                  👀 You are previewing the <strong>Public Visitor Portal</strong>.
                </span>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setViewMode('portal')}
                >
                  Return to Management Portal →
                </button>
              </div>
              <PublicNewsPortal onGoToLogin={() => setViewMode('portal')} />
            </div>
          ) : (
            <AdminLayout
              currentUser={currentUser}
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              onLogout={handleLogout}
              onResetData={() => setIsResetConfirmOpen(true)}
              onRefreshData={refreshAllData}
              onViewPublic={() => setViewMode('public')}
              onProfileUpdated={handleProfileUpdated}
              categories={categories}
              news={news}
              users={users}
              onAddCategory={handleAddCategory}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
              onAddNews={handleAddNews}
              onUpdateNews={handleUpdateNews}
              onDeleteNews={handleDeleteNews}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
            />
          )}
        </>
      )}

      {/* Global Toast Notifications */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={() => {
          setIsResetConfirmOpen(false);
          refreshAllData();
          addToast('Data re-synchronized with Spring REST API.', 'info');
        }}
        title="Refresh and Re-sync Data?"
        message="This will re-fetch the latest state of Categories, News articles, and Accounts from the backend."
        confirmText="Confirm Re-sync"
      />
    </>
  );
}

export default App;
