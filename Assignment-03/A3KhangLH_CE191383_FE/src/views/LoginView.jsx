import React, { useState } from 'react';
import { authService } from '../services/api';

export default function LoginView({ onLoginSuccess, onGoToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await authService.login(email, password);
      const data = res.data;
      // Save in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        email: data.email,
        fullName: data.fullName,
        role: data.role,
        customerId: data.customerId,
      }));
      onLoginSuccess(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const autofillStaff = () => {
    setEmail('staff@fpt.edu.vn');
    setPassword('staff123');
    setError('');
  };

  const autofillCustomer = () => {
    setEmail('customer@hotel.com');
    setPassword('123456');
    setError('');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card custom-card p-4 p-md-5">
            <div className="text-center mb-4">
              <span className="fs-1">🏨</span>
              <h3 className="fw-bold mt-2">Sign In</h3>
              <p className="text-muted small">Access your FU Mini Hotel account</p>
            </div>

            {error && <div className="alert alert-danger py-2 small">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold">Password</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-lock"></i></span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold mb-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span> Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="border-top pt-3 text-center">
              <span className="text-muted small">Don't have an account? </span>
              <button
                type="button"
                className="btn btn-link btn-sm p-0 text-decoration-none fw-semibold"
                onClick={onGoToRegister}
              >
                Register as Customer
              </button>
            </div>

            {/* Quick Test Accounts Helper */}
            <div className="mt-4 p-3 bg-light rounded-3 small">
              <div className="fw-bold text-secondary mb-2">
                <i className="bi bi-lightning-charge-fill text-warning me-1"></i> Quick Autofill Test Credentials:
              </div>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm flex-fill"
                  onClick={autofillStaff}
                >
                  Staff (from properties)
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm flex-fill"
                  onClick={autofillCustomer}
                >
                  Customer (from DB)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

