import React, { useState, useEffect } from 'react';
import { customerService } from '../../services/api';

export default function CustomerProfileView({ user }) {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    customerFullName: '',
    telephone: '',
    customerBirthday: '',
    password: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await customerService.getMyProfile();
      setProfile(res.data);
      setFormData({
        customerFullName: res.data.customerFullName || '',
        telephone: res.data.telephone || '',
        customerBirthday: res.data.customerBirthday || '',
        password: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        customerFullName: formData.customerFullName,
        telephone: formData.telephone,
        customerBirthday: formData.customerBirthday || null,
        password: formData.password || null,
      };

      const res = await customerService.updateMyProfile(payload);
      setProfile(res.data);
      setSuccess('Profile updated successfully!');
      setFormData((prev) => ({ ...prev, password: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card custom-card p-4">
            <h4 className="fw-bold mb-3 text-primary d-flex align-items-center">
              <i className="bi bi-person-badge me-2"></i> My Profile
            </h4>
            <p className="text-muted small">Update your personal contact details and password</p>

            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            {success && <div className="alert alert-success py-2 small">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted">Email Address (Immutable)</label>
                <input
                  type="email"
                  className="form-control bg-light"
                  value={profile?.emailAddress || ''}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  name="customerFullName"
                  value={formData.customerFullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Telephone</label>
                <input
                  type="tel"
                  className="form-control"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  name="customerBirthday"
                  value={formData.customerBirthday}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">New Password (leave blank to keep current)</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Enter new password if changing"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold"
                disabled={saving}
              >
                {saving ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

