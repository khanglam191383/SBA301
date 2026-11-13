import React, { useState, useEffect } from 'react';
import { customerService } from '../../services/api';

export default function StaffCustomersView() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    customerFullName: '',
    telephone: '',
    emailAddress: '',
    customerBirthday: '',
    customerStatus: 1,
    password: '',
  });
  const [modalError, setModalError] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await customerService.getCustomers({ keyword: keyword.trim() || undefined });
      setCustomers(res.data);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData({
      customerFullName: '',
      telephone: '',
      emailAddress: '',
      customerBirthday: '',
      customerStatus: 1,
      password: '',
    });
    setModalError('');
    setShowModal(true);
  };

  const handleOpenEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      customerFullName: customer.customerFullName || '',
      telephone: customer.telephone || '',
      emailAddress: customer.emailAddress || '',
      customerBirthday: customer.customerBirthday || '',
      customerStatus: customer.customerStatus !== undefined ? customer.customerStatus : 1,
      password: '',
    });
    setModalError('');
    setShowModal(true);
  };

  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!formData.customerFullName.trim()) {
      setModalError('Customer full name is required');
      return;
    }
    if (!formData.emailAddress.trim()) {
      setModalError('Email address is required');
      return;
    }

    try {
      if (editingCustomer) {
        await customerService.updateCustomer(editingCustomer.customerID, formData);
        setFeedbackMessage({ text: `Customer updated successfully!`, type: 'success' });
      } else {
        await customerService.createCustomer(formData);
        setFeedbackMessage({ text: `Customer created successfully!`, type: 'success' });
      }
      setShowModal(false);
      fetchCustomers();
    } catch (err) {
      setModalError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDeleteCustomer = async (customer) => {
    if (!window.confirm(`Are you sure you want to deactivate customer ${customer.customerFullName}?`)) {
      return;
    }
    try {
      await customerService.deleteCustomer(customer.customerID);
      setFeedbackMessage({ text: `Customer ${customer.customerFullName} deactivated.`, type: 'info' });
      fetchCustomers();
    } catch (err) {
      setFeedbackMessage({ text: err.response?.data?.message || 'Failed to deactivate', type: 'danger' });
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="page-title text-primary mb-1">
            <i className="bi bi-people-fill me-2"></i> Manage Customers
          </h3>
          <p className="text-muted small mb-0">View, search, create, and edit customer accounts</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <i className="bi bi-person-plus-fill me-1"></i> Add New Customer
        </button>
      </div>

      {feedbackMessage && (
        <div className={`alert alert-${feedbackMessage.type} alert-dismissible fade show`} role="alert">
          {feedbackMessage.text}
          <button type="button" className="btn-close" onClick={() => setFeedbackMessage(null)}></button>
        </div>
      )}

      {/* Search */}
      <div className="custom-card p-3 mb-4">
        <form onSubmit={handleSearchSubmit} className="row g-2 align-items-center">
          <div className="col-md-9">
            <div className="input-group">
              <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by customer name, email, or telephone..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3 d-flex gap-2">
            <button type="submit" className="btn btn-primary flex-fill">Search</button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                setKeyword('');
                fetchCustomers();
              }}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Loading customer records...</p>
        </div>
      ) : (
        <div className="card custom-card">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Telephone</th>
                  <th>Birthday</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c.customerID}>
                      <td className="fw-semibold">#{c.customerID}</td>
                      <td className="fw-bold">{c.customerFullName}</td>
                      <td>{c.emailAddress}</td>
                      <td>{c.telephone || 'N/A'}</td>
                      <td>{c.customerBirthday || 'N/A'}</td>
                      <td>
                        {c.customerStatus === 1 ? (
                          <span className="badge bg-success">Active</span>
                        ) : (
                          <span className="badge bg-secondary">Inactive</span>
                        )}
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => handleOpenEdit(c)}
                        >
                          <i className="bi bi-pencil me-1"></i> Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDeleteCustomer(c)}
                        >
                          <i className="bi bi-person-x me-1"></i> Deactivate
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Customer Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content custom-card">
              <div className="modal-header">
                <h5 className="modal-title fw-bold text-primary">
                  {editingCustomer ? `Edit Customer #${editingCustomer.customerID}` : 'Add New Customer'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSaveCustomer}>
                <div className="modal-body">
                  {modalError && <div className="alert alert-danger py-2 small">{modalError}</div>}

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.customerFullName}
                      onChange={(e) => setFormData({ ...formData, customerFullName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.emailAddress}
                      onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Telephone</label>
                      <input
                        type="tel"
                        className="form-control"
                        value={formData.telephone}
                        onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Birthday</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.customerBirthday}
                        onChange={(e) => setFormData({ ...formData, customerBirthday: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Status</label>
                      <select
                        className="form-select"
                        value={formData.customerStatus}
                        onChange={(e) => setFormData({ ...formData, customerStatus: Number(e.target.value) })}
                      >
                        <option value="1">Active</option>
                        <option value="2">Inactive</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">
                        {editingCustomer ? 'New Password (Optional)' : 'Password'}
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder={editingCustomer ? 'Leave blank to keep' : 'Default: 123456'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingCustomer ? 'Save Changes' : 'Create Customer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

