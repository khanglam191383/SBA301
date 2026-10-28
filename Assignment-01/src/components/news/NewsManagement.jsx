import { useState, useMemo } from 'react';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';
import { 
  IconSearch, 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconNews, 
  IconX 
} from '../common/Icons';

export default function NewsManagement({ 
  news = [], 
  categories = [], 
  currentUser,
  onAddNews, 
  onUpdateNews, 
  onDeleteNews 
}) {
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    content: '',
    categoryId: '',
    createdBy: '',
    status: 1,
    tags: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Confirm Delete State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);

  // Category Map helper
  const categoryMap = useMemo(() => {
    const map = {};
    categories.forEach(c => {
      map[c.id] = c.name;
    });
    return map;
  }, [categories]);

  // Filtered News without mutating source news
  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      const term = searchTerm.trim().toLowerCase();
      const matchSearch = 
        item.title.toLowerCase().includes(term) ||
        (item.content && item.content.toLowerCase().includes(term)) ||
        (item.tags && item.tags.toLowerCase().includes(term)) ||
        (item.createdBy && item.createdBy.toLowerCase().includes(term));

      const matchCategory = 
        categoryFilter === 'ALL' ? true : 
        Number(item.categoryId) === Number(categoryFilter);

      const matchStatus = 
        statusFilter === 'ALL' ? true : 
        statusFilter === 'ACTIVE' ? item.status === 1 : 
        item.status === 0;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [news, searchTerm, categoryFilter, statusFilter]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setModalMode('create');
    const firstCatId = categories.length > 0 ? categories[0].id : '';
    setFormData({
      id: null,
      title: '',
      content: '',
      categoryId: firstCatId,
      createdBy: currentUser?.username || 'Admin',
      status: 1,
      tags: ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (article) => {
    setModalMode('update');
    setFormData({
      id: article.id,
      title: article.title,
      content: article.content,
      categoryId: article.categoryId,
      createdBy: article.createdBy || (currentUser?.username || 'Admin'),
      createdAt: article.createdAt,
      status: article.status,
      tags: article.tags || ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Form Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'categoryId' || name === 'status' ? Number(value) : value
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Submit Modal Form
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'Article title is required';
    }
    if (!formData.content.trim()) {
      errors.content = 'Article content is required';
    }
    if (!formData.categoryId) {
      errors.categoryId = 'Please select a valid category';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const todayDate = new Date().toISOString().split('T')[0];

    if (modalMode === 'create') {
      const newArticle = {
        id: news.length > 0 ? Math.max(...news.map(n => n.id)) + 1 : 1,
        title: formData.title.trim(),
        content: formData.content.trim(),
        categoryId: Number(formData.categoryId),
        createdBy: formData.createdBy || currentUser?.username || 'Admin',
        createdAt: todayDate,
        status: formData.status,
        tags: formData.tags.trim()
      };
      onAddNews(newArticle);
    } else {
      const updatedArticle = {
        ...formData,
        title: formData.title.trim(),
        content: formData.content.trim(),
        categoryId: Number(formData.categoryId),
        tags: formData.tags.trim()
      };
      onUpdateNews(updatedArticle);
    }

    setIsModalOpen(false);
  };

  // Open Delete Confirm
  const handleOpenDelete = (article) => {
    setNewsToDelete(article);
    setIsConfirmOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (newsToDelete) {
      onDeleteNews(newsToDelete.id);
      setIsConfirmOpen(false);
      setNewsToDelete(null);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">News Article Management</h1>
          <p className="page-subtitle">
            Publish, edit, and categorize campus news, press announcements, and student articles.
          </p>
        </div>
        <button 
          type="button" 
          className="btn btn-primary" 
          onClick={handleOpenCreate}
          disabled={categories.length === 0}
          title={categories.length === 0 ? "Create a category first" : "Create new article"}
        >
          <IconPlus size={18} />
          <span>Publish New Article</span>
        </button>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="toolbar-container">
        <div className="toolbar-filters">
          <div className="search-input-wrap">
            <span className="search-icon">
              <IconSearch size={16} />
            </span>
            <input
              type="text"
              className="search-input"
              placeholder="Search news by title, content, author, tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter news by category"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter news by status"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Published (Status 1)</option>
            <option value="INACTIVE">Draft (Status 0)</option>
          </select>

          {(searchTerm || categoryFilter !== 'ALL' || statusFilter !== 'ALL') && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('ALL');
                setStatusFilter('ALL');
              }}
            >
              <IconX size={14} />
              <span>Reset Filter</span>
            </button>
          )}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: 500 }}>
          Showing {filteredNews.length} of {news.length} articles
        </div>
      </div>

      {/* News Table */}
      <div className="card">
        {news.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <IconNews size={28} />
            </div>
            <h3 className="empty-state-title">No news articles found</h3>
            <p className="empty-state-text">
              No news articles have been created yet. Click the button below to publish the first story.
            </p>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleOpenCreate}
              disabled={categories.length === 0}
            >
              <IconPlus size={16} />
              <span>Publish Article</span>
            </button>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <IconSearch size={28} />
            </div>
            <h3 className="empty-state-title">No matching articles found</h3>
            <p className="empty-state-text">
              No articles matched your search query. Try different keywords or clear your active filters.
            </p>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('ALL');
                setStatusFilter('ALL');
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '70px' }}>ID</th>
                  <th>Article Title</th>
                  <th style={{ width: '180px' }}>Category</th>
                  <th style={{ width: '130px' }}>Author</th>
                  <th style={{ width: '120px' }}>Date</th>
                  <th style={{ width: '120px' }}>Status</th>
                  <th style={{ width: '110px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNews.map((article) => {
                  const categoryName = categoryMap[article.categoryId] || `Category #${article.categoryId}`;
                  return (
                    <tr key={article.id}>
                      <td style={{ fontWeight: 600, color: 'var(--slate-500)' }}>
                        #{article.id}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--slate-900)', marginBottom: '0.2rem' }}>
                          {article.title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {article.tags && article.tags.split(',').map((tag, idx) => (
                            <span key={idx} style={{ background: 'var(--slate-100)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                              #{tag.trim()}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-category">
                          {categoryName}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem', color: 'var(--slate-700)', fontWeight: 500 }}>
                          {article.createdBy || 'Admin'}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
                          {article.createdAt || 'Recent'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${article.status === 1 ? 'badge-active' : 'badge-inactive'}`}>
                          <span className="badge-dot" />
                          {article.status === 1 ? 'Published (1)' : 'Draft (0)'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons" style={{ justifyContent: 'center' }}>
                          <button
                            type="button"
                            className="btn-icon btn-icon-edit"
                            title="Edit News Article"
                            onClick={() => handleOpenEdit(article)}
                          >
                            <IconEdit size={15} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon btn-icon-delete"
                            title="Delete News Article"
                            onClick={() => handleOpenDelete(article)}
                          >
                            <IconTrash size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit News Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Publish New News Article' : `Edit News Article #${formData.id}`}
        maxWidth="640px"
      >
        <form onSubmit={handleFormSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="news-title">
                <span>Article Title</span>
                <span className="required">*</span>
              </label>
              <input
                id="news-title"
                name="title"
                type="text"
                className={`form-input ${formErrors.title ? 'has-error' : ''}`}
                placeholder="Enter headline (e.g. FPT University AI Hackathon Winner Announced)"
                value={formData.title}
                onChange={handleInputChange}
                autoFocus
              />
              {formErrors.title && <span className="form-error">{formErrors.title}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="news-category">
                  <span>Category</span>
                  <span className="required">*</span>
                </label>
                <select
                  id="news-category"
                  name="categoryId"
                  className={`form-select ${formErrors.categoryId ? 'has-error' : ''}`}
                  value={formData.categoryId}
                  onChange={handleInputChange}
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.status === 0 ? '(Inactive)' : ''}
                    </option>
                  ))}
                </select>
                {formErrors.categoryId && <span className="form-error">{formErrors.categoryId}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="news-status">
                  <span>Publishing Status</span>
                  <span className="required">*</span>
                </label>
                <select
                  id="news-status"
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value={1}>Published (Status 1)</option>
                  <option value={0}>Draft / Inactive (Status 0)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="news-content">
                <span>Article Content</span>
                <span className="required">*</span>
              </label>
              <textarea
                id="news-content"
                name="content"
                rows="5"
                className={`form-textarea ${formErrors.content ? 'has-error' : ''}`}
                placeholder="Write full article description and details..."
                value={formData.content}
                onChange={handleInputChange}
              />
              {formErrors.content && <span className="form-error">{formErrors.content}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="news-tags">
                  <span>Tags (comma separated)</span>
                </label>
                <input
                  id="news-tags"
                  name="tags"
                  type="text"
                  className="form-input"
                  placeholder="e.g. AI, Campus, Tech"
                  value={formData.tags}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="news-createdby">
                  <span>Author / Created By</span>
                </label>
                <input
                  id="news-createdby"
                  name="createdBy"
                  type="text"
                  className="form-input"
                  value={formData.createdBy}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {modalMode === 'create' ? 'Publish Article' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setNewsToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete News Article"
        message={
          newsToDelete ? (
            <span>
              Are you sure you want to permanently delete news article <strong>"{newsToDelete.title}"</strong>?
            </span>
          ) : ""
        }
      />
    </div>
  );
}
