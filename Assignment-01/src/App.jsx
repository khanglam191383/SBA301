import { useState, useEffect } from 'react';
import { storageService } from './services/storageService';
import LoginPage from './components/auth/LoginPage';
import AdminLayout from './components/layout/AdminLayout';
import ToastContainer from './components/common/Toast';
import ConfirmDialog from './components/common/ConfirmDialog';

function App() {
  // State initialization with localStorage hydration
  const [currentUser, setCurrentUser] = useState(() => storageService.getCurrentUser());
  const [categories, setCategories] = useState(() => storageService.getCategories());
  const [news, setNews] = useState(() => storageService.getNews());
  const [users, setUsers] = useState(() => storageService.getUsers());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toasts, setToasts] = useState([]);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Sync state to storage
  useEffect(() => {
    storageService.saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    storageService.saveNews(news);
  }, [news]);

  useEffect(() => {
    storageService.saveUsers(users);
  }, [users]);

  useEffect(() => {
    storageService.saveCurrentUser(currentUser);
  }, [currentUser]);

  // Toast notification helper
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth handlers
  const handleLogin = (user) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
    addToast(`Welcome back, ${user.fullName || user.username}!`, 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    storageService.clearCurrentUser();
    addToast('You have successfully signed out.', 'info');
  };

  // Reset all mock data to factory defaults
  const handleConfirmResetData = () => {
    const fresh = storageService.resetAll();
    setCategories(fresh.categories);
    setNews(fresh.news);
    setUsers(fresh.users);
    setIsResetConfirmOpen(false);
    addToast('Mock data has been restored to factory initial state.', 'success');
  };

  // Category CRUD Handlers (Immutable)
  const handleAddCategory = (newCat) => {
    setCategories((prev) => [newCat, ...prev]);
    addToast(`Category "${newCat.name}" created successfully!`, 'success');
  };

  const handleUpdateCategory = (updatedCat) => {
    setCategories((prev) => prev.map((c) => (c.id === updatedCat.id ? updatedCat : c)));
    addToast(`Category "${updatedCat.name}" updated successfully!`, 'success');
  };

  const handleDeleteCategory = (id) => {
    const target = categories.find((c) => c.id === id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    addToast(`Category "${target?.name || id}" removed.`, 'danger');
  };

  // News CRUD Handlers (Immutable)
  const handleAddNews = (newArticle) => {
    setNews((prev) => [newArticle, ...prev]);
    addToast(`Article "${newArticle.title}" published!`, 'success');
  };

  const handleUpdateNews = (updatedArticle) => {
    setNews((prev) => prev.map((n) => (n.id === updatedArticle.id ? updatedArticle : n)));
    addToast(`Article "${updatedArticle.title}" updated!`, 'success');
  };

  const handleDeleteNews = (id) => {
    const target = news.find((n) => n.id === id);
    setNews((prev) => prev.filter((n) => n.id !== id));
    addToast(`Article "${target?.title || id}" removed.`, 'danger');
  };

  // User CRUD Handlers (Immutable)
  const handleAddUser = (newUser) => {
    setUsers((prev) => [newUser, ...prev]);
    addToast(`Account "${newUser.username}" created!`, 'success');
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    // If updating currently logged in user, refresh currentUser state
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
    addToast(`Account "${updatedUser.username}" updated!`, 'success');
  };

  const handleDeleteUser = (id) => {
    const target = users.find((u) => u.id === id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    addToast(`Account "${target?.username || id}" deleted.`, 'danger');
  };

  return (
    <>
      {currentUser ? (
        <AdminLayout
          currentUser={currentUser}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onLogout={handleLogout}
          onResetData={() => setIsResetConfirmOpen(true)}
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
      ) : (
        <LoginPage onLogin={handleLogin} users={users} />
      )}

      {/* Global Toast Notifications */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

      {/* Reset Data Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleConfirmResetData}
        title="Reset All Mock Data?"
        message="Are you sure you want to reset all Categories, News articles, and User accounts back to their initial state? Any custom additions will be lost."
        confirmText="Confirm Reset"
      />
    </>
  );
}

export default App;
