import { useState, useMemo } from 'react';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';
import { 
  IconSearch, 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconCategory, 
  IconX 
} from '../common/Icons';

export default function CategoryManagement({ 
  categories = [], 
  news = [],
  onAddCategory, 
  onUpdateCategory, 
  onDeleteCategory 
}) {
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'update'
  const [formData, setFormData] = useState({ id: null, name: '', description: '', status: 1 });
  const [formErrors, setFormErrors] = useState({});

  // Confirm Delete State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Filtered categories (without mutating source categories)
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchSearch = cat.name.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
        (cat.description && cat.description.toLowerCase().includes(searchTerm.trim().toLowerCase()));
      
      const matchStatus = 
        statusFilter === 'ALL' ? true : 
        statusFilter === 'ACTIVE' ? cat.status === 1 : 
        cat.status === 0;

      return matchSearch && matchStatus;
    });
  }, [categories, searchTerm, statusFilter]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setModalMode('create');
    setFormData({ id: null, name: '', description: '', status: 1 });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (category) => {
    setModalMode('update');
    setFormData({
      id: category.id,
      name: category.name,
      description: category.description || '',
      status: category.status
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Handle Form Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'status' ? Number(value) : value
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Submit Modal Form (Create or Update)
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Category name is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (modalMode === 'create') {
      const newCategory = {
        id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1,
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: formData.status
      };
      onAddCategory(newCategory);
    } else {
      const updatedCategory = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim()
      };
      onUpdateCategory(updatedCategory);
    }

    setIsModalOpen(false);
  };

  // Open Delete Confirmation
  const handleOpenDelete = (category) => {
    setCategoryToDelete(category);
    setIsConfirmOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      onDeleteCategory(categoryToDelete.id);
      setIsConfirmOpen(false);
      setCategoryToDelete(null);
    }
  };

  // Check if category is referenced by any news
  const linkedNewsCount = categoryToDelete 
    ? news.filter(n => n.categoryId === categoryToDelete.id).length 
    : 0;

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Category Management</h1>
          <p className="page-subtitle">
            Organize news articles into hierarchical categories and manage their operational status.
          </p>
        </div>
        <button 
          type="button" 
          className="btn btn-primary" 
          onClick={handleOpenCreate}
        >
          <IconPlus size={18} />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Toolbar: Search & Filter */}
      <div className="toolbar-container">
        <div className="toolbar-filters">
          <div className="search-input-wrap">
            <span className="search-icon">
              <IconSearch size={16} />
            </span>
            <input
              type="text"
              className="search-input"
              placeholder="Search category by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter categories by status"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active (Status 1)</option>
            <option value="INACTIVE">Inactive (Status 0)</option>
          </select>

          {(searchTerm || statusFilter !== 'ALL') && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
              }}
            >
              <IconX size={14} />
              <span>Reset Filter</span>
            </button>
          )}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: 500 }}>
          Showing {filteredCategories.length} of {categories.length} categories
        </div>
      </div>

      {/* Categories Table */}
      <div className="card">
        {categories.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <IconCategory size={28} />
            </div>
            <h3 className="empty-state-title">No categories available</h3>
            <p className="empty-state-text">
              There are currently no categories recorded. Click the button below to create your first category.
            </p>
            <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
              <IconPlus size={16} />
              <span>Create Category</span>
            </button>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <IconSearch size={28} />
            </div>
            <h3 className="empty-state-title">No matching categories found</h3>
            <p className="empty-state-text">
              No categories matched your search term "{searchTerm}". Try adjusting your keywords or clearing the filter.
            </p>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>ID</th>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th style={{ width: '130px' }}>Articles</th>
                  <th style={{ width: '120px' }}>Status</th>
                  <th style={{ width: '110px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((cat) => {
                  const articleCount = news.filter(n => n.categoryId === cat.id).length;
                  return (
                    <tr key={cat.id}>
                      <td style={{ fontWeight: 600, color: 'var(--slate-500)' }}>
                        #{cat.id}
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--slate-900)' }}>
                          {cat.name}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: 'var(--slate-600)', fontSize: '0.85rem' }}>
                          {cat.description || <em style={{ color: 'var(--slate-400)' }}>No description</em>}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-category">
                          {articleCount} {articleCount === 1 ? 'article' : 'articles'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${cat.status === 1 ? 'badge-active' : 'badge-inactive'}`}>
                          <span className="badge-dot" />
                          {cat.status === 1 ? 'Active (1)' : 'Inactive (0)'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons" style={{ justifyContent: 'center' }}>
                          <button
                            type="button"
                            className="btn-icon btn-icon-edit"
                            title="Edit Category"
                            onClick={() => handleOpenEdit(cat)}
                          >
                            <IconEdit size={15} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon btn-icon-delete"
                            title="Delete Category"
                            onClick={() => handleOpenDelete(cat)}
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

      {/* Create / Update Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Create New Category' : `Edit Category #${formData.id}`}
      >
        <form onSubmit={handleFormSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="cat-name">
                <span>Category Name</span>
                <span className="required">*</span>
              </label>
              <input
                id="cat-name"
                name="name"
                type="text"
                className={`form-input ${formErrors.name ? 'has-error' : ''}`}
                placeholder="e.g. Campus Technology & AI"
                value={formData.name}
                onChange={handleInputChange}
                autoFocus
              />
              {formErrors.name && <span className="form-error">{formErrors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cat-desc">
                <span>Description</span>
              </label>
              <textarea
                id="cat-desc"
                name="description"
                rows="3"
                className="form-textarea"
                placeholder="Briefly describe the coverage of this category..."
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="cat-status">
                <span>Operational Status</span>
                <span className="required">*</span>
              </label>
              <select
                id="cat-status"
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value={1}>Active (1) - Enabled for publishing news</option>
                <option value={0}>Inactive (0) - Temporarily hidden</option>
              </select>
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
              {modalMode === 'create' ? 'Create Category' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setCategoryToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        message={
          categoryToDelete ? (
            <span>
              Are you sure you want to delete category <strong>"{categoryToDelete.name}"</strong>?
              {linkedNewsCount > 0 && (
                <div style={{ marginTop: '0.65rem', color: 'var(--danger-600)', fontSize: '0.8rem', fontWeight: 600 }}>
                  ⚠️ Warning: {linkedNewsCount} existing news {linkedNewsCount === 1 ? 'article is' : 'articles are'} linked to this category!
                </div>
              )}
            </span>
          ) : ""
        }
      />
    </div>
  );
}
