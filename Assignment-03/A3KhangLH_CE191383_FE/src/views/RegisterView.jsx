import React, { useState } from 'react';
import { authService } from '../services/api';

export default function RegisterView({ onRegisterSuccess, onGoToLogin }) {
  const [formData, setFormData] = useState({
    fullName: '',
    telephone: '',
    emailAddress: '',
    customerBirthday: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fullName: formData.fullName,
        telephone: formData.telephone,
        emailAddress: formData.emailAddress,
        customerBirthday: formData.customerBirthday || null,
        password: formData.password,
      };

      const res = await authService.register(payload);
      setSuccess('Registration successful! You can now sign in.');
      setTimeout(() => {
        onRegisterSuccess();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <div className="card custom-card p-4 p-md-5">
            <div className="text-center mb-4">
              <span className="fs-1">📝</span>
              <h3 className="fw-bold mt-2">Customer Registration</h3>
              <p className="text-muted small">Create an account to book hotel rooms</p>
            </div>

            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            {success && <div className="alert alert-success py-2 small">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  name="fullName"
                  placeholder="e.g. Nguyễn Văn An"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-semibold">Email Address *</label>
                  <input
                    type="email"
                    className="form-control"
                    name="emailAddress"
                    placeholder="name@example.com"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-semibold">Telephone</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="telephone"
                    placeholder="e.g. 0901234567"
                    value={formData.telephone}
                    onChange={handleChange}
                  />
                </div>
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

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label small fw-semibold">Password *</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-4">
                  <label className="form-label small fw-semibold">Confirm Password *</label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold mb-3"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Register'}
              </button>
            </form>

            <div className="border-top pt-3 text-center">
              <span className="text-muted small">Already have an account? </span>
              <button
                type="button"
                className="btn btn-link btn-sm p-0 text-decoration-none fw-semibold"
                onClick={onGoToLogin}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

