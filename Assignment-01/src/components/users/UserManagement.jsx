import { useState, useMemo } from 'react';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';
import { 
  IconSearch, 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconUsers, 
  IconX 
} from '../common/Icons';

export default function UserManagement({ 
  users = [], 
  currentUser,
  onAddUser, 
  onUpdateUser, 
  onDeleteUser 
}) {
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [formData, setFormData] = useState({
    id: null,
    username: '',
    password: '',
    fullName: '',
    email: '',
    role: 2, // 2: Staff by default
    status: 1
  });
  const [formErrors, setFormErrors] = useState({});

  // Confirm Delete State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const term = searchTerm.trim().toLowerCase();
      const matchSearch = 
        u.username.toLowerCase().includes(term) ||
        (u.fullName && u.fullName.toLowerCase().includes(term)) ||
        (u.email && u.email.toLowerCase().includes(term));

      const matchRole = 
        roleFilter === 'ALL' ? true : 
        Number(u.role) === Number(roleFilter);

      const matchStatus = 
        statusFilter === 'ALL' ? true : 
        statusFilter === 'ACTIVE' ? u.status === 1 : 
        u.status === 0;

      return matchSearch && matchRole && matchStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setModalMode('create');
    setFormData({
      id: null,
      username: '',
      password: '',
      fullName: '',
      email: '',
      role: 2,
      status: 1
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (user) => {
    setModalMode('update');
    setFormData({
      id: user.id,
      username: user.username,
      password: user.password,
      fullName: user.fullName || '',
      email: user.email || '',
      role: user.role,
      status: user.status
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'role' || name === 'status' ? Number(value) : value
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validate and Submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else {
      // Check duplicate username (except current user in update mode)
      const isDuplicate = users.some(
        u => u.username.toLowerCase() === formData.username.trim().toLowerCase() && 
             (modalMode === 'create' || u.id !== formData.id)
      );
      if (isDuplicate) {
        errors.username = 'This username is already taken';
      }
    }

    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    }

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full Name is required';
    }

    if (formData.email && !formData.email.includes('@')) {
      errors.email = 'Please enter a valid email address';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (modalMode === 'create') {
      const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        username: formData.username.trim(),
        password: formData.password.trim(),
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        role: formData.role,
        status: formData.status
      };
      onAddUser(newUser);
    } else {
      const updatedUser = {
        ...formData,
        username: formData.username.trim(),
        password: formData.password.trim(),
        fullName: formData.fullName.trim(),
        email: formData.email.trim()
      };
      onUpdateUser(updatedUser);
    }

    setIsModalOpen(false);
  };

  // Open Delete
  const handleOpenDelete = (user) => {
    setUserToDelete(user);
    setIsConfirmOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (userToDelete) {
      if (currentUser && userToDelete.id === currentUser.id) {
        alert("Action Denied: You cannot delete your currently logged-in account!");
        setIsConfirmOpen(false);
        setUserToDelete(null);
        return;
      }
      onDeleteUser(userToDelete.id);
      setIsConfirmOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">User & Account Management</h1>
          <p className="page-subtitle">
            Manage system administrators and editorial staff credentials, access roles, and permissions.
          </p>
        </div>
        <button 
          type="button" 
          className="btn btn-primary" 
          onClick={handleOpenCreate}
        >
          <IconPlus size={18} />
          <span>Add New Account</span>
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
              placeholder="Search user by username, full name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            aria-label="Filter users by role"
          >
            <option value="ALL">All Roles</option>
            <option value="1">Admin (Role 1)</option>
            <option value="2">Staff (Role 2)</option>
          </select>

          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter users by status"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active (Status 1)</option>
            <option value="INACTIVE">Inactive (Status 0)</option>
          </select>

          {(searchTerm || roleFilter !== 'ALL' || statusFilter !== 'ALL') && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('ALL');
                setStatusFilter('ALL');
              }}
            >
              <IconX size={14} />
              <span>Reset Filter</span>
            </button>
          )}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: 500 }}>
          Showing {filteredUsers.length} of {users.length} accounts
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        {users.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <IconUsers size={28} />
            </div>
            <h3 className="empty-state-title">No user accounts found</h3>
            <p className="empty-state-text">
              There are no accounts in the database. Click below to add an account.
            </p>
            <button type="button" className="btn btn-primary" onClick={handleOpenCreate}>
              <IconPlus size={16} />
              <span>Create Account</span>
            </button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <IconSearch size={28} />
            </div>
            <h3 className="empty-state-title">No matching accounts found</h3>
            <p className="empty-state-text">
              No user matches the search "{searchTerm}". Try refining your search query or reset filters.
            </p>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('ALL');
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
                  <th>Username</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th style={{ width: '130px' }}>Role</th>
                  <th style={{ width: '120px' }}>Status</th>
                  <th style={{ width: '110px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const isCurrent = currentUser?.id === user.id;
                  return (
                    <tr key={user.id}>
                      <td style={{ fontWeight: 600, color: 'var(--slate-500)' }}>
                        #{user.id}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 600, color: 'var(--slate-900)' }}>
                            {user.username}
                          </span>
                          {isCurrent && (
                            <span style={{ fontSize: '0.7rem', background: 'var(--primary-100)', color: 'var(--primary-700)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>
                              You
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span style={{ color: 'var(--slate-800)', fontWeight: 500 }}>
                          {user.fullName || '—'}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: 'var(--slate-600)', fontSize: '0.85rem' }}>
                          {user.email || '—'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${user.role === 1 ? 'badge-admin' : 'badge-staff'}`}>
                          {user.role === 1 ? 'Admin (1)' : 'Staff (2)'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${user.status === 1 ? 'badge-active' : 'badge-inactive'}`}>
                          <span className="badge-dot" />
                          {user.status === 1 ? 'Active (1)' : 'Inactive (0)'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons" style={{ justifyContent: 'center' }}>
                          <button
                            type="button"
                            className="btn-icon btn-icon-edit"
                            title="Edit User Account"
                            onClick={() => handleOpenEdit(user)}
                          >
                            <IconEdit size={15} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon btn-icon-delete"
                            title={isCurrent ? "Cannot delete currently logged-in account" : "Delete User Account"}
                            onClick={() => handleOpenDelete(user)}
                            disabled={isCurrent}
                            style={{ opacity: isCurrent ? 0.4 : 1, cursor: isCurrent ? 'not-allowed' : 'pointer' }}
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

      {/* Create / Edit User Modal Dialog */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Create New User Account' : `Edit Account #${formData.id}`}
        maxWidth="560px"
      >
        <form onSubmit={handleFormSubmit}>
          <div className="modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="user-username">
                  <span>Username</span>
                  <span className="required">*</span>
                </label>
                <input
                  id="user-username"
                  name="username"
                  type="text"
                  className={`form-input ${formErrors.username ? 'has-error' : ''}`}
                  placeholder="e.g. jdoe"
                  value={formData.username}
                  onChange={handleInputChange}
                  autoFocus
                />
                {formErrors.username && <span className="form-error">{formErrors.username}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="user-password">
                  <span>Password</span>
                  <span className="required">*</span>
                </label>
                <input
                  id="user-password"
                  name="password"
                  type="text"
                  className={`form-input ${formErrors.password ? 'has-error' : ''}`}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                {formErrors.password && <span className="form-error">{formErrors.password}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="user-fullname">
                <span>Full Name</span>
                <span className="required">*</span>
              </label>
              <input
                id="user-fullname"
                name="fullName"
                type="text"
                className={`form-input ${formErrors.fullName ? 'has-error' : ''}`}
                placeholder="e.g. John Doe"
                value={formData.fullName}
                onChange={handleInputChange}
              />
              {formErrors.fullName && <span className="form-error">{formErrors.fullName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="user-email">
                <span>Email Address</span>
              </label>
              <input
                id="user-email"
                name="email"
                type="email"
                className={`form-input ${formErrors.email ? 'has-error' : ''}`}
                placeholder="e.g. john.doe@fpt.edu.vn"
                value={formData.email}
                onChange={handleInputChange}
              />
              {formErrors.email && <span className="form-error">{formErrors.email}</span>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="user-role">
                  <span>System Role</span>
                  <span className="required">*</span>
                </label>
                <select
                  id="user-role"
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value={1}>Admin (Role 1)</option>
                  <option value={2}>Staff (Role 2)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="user-status">
                  <span>Account Status</span>
                  <span className="required">*</span>
                </label>
                <select
                  id="user-status"
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value={1}>Active (1) - Enabled</option>
                  <option value={0}>Inactive (0) - Locked</option>
                </select>
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
              {modalMode === 'create' ? 'Create Account' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete User Account"
        message={
          userToDelete ? (
            <span>
              Are you sure you want to permanently delete account <strong>"{userToDelete.username}" ({userToDelete.fullName})</strong>?
            </span>
          ) : ""
        }
      />
    </div>
  );
}
