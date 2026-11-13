import React from 'react';

export default function Navbar({ currentView, setCurrentView, user, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
      <div className="container">
        <button
          className="navbar-brand btn btn-link text-white text-decoration-none fw-bold fs-4 d-flex align-items-center p-0"
          onClick={() => setCurrentView('rooms')}
        >
          <span className="me-2">🏨</span> FU Mini Hotel
        </button>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#hotelNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="hotelNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Public */}
            <li className="nav-item">
              <button
                className={`nav-link btn btn-link text-decoration-none ${currentView === 'rooms' ? 'active fw-bold' : ''}`}
                onClick={() => setCurrentView('rooms')}
              >
                <i className="bi bi-door-open me-1"></i> Browse Rooms
              </button>
            </li>

            {/* Customer Navigation */}
            {user && user.role === 'Customer' && (
              <>
                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link text-decoration-none ${currentView === 'customer-book' ? 'active fw-bold' : ''}`}
                    onClick={() => setCurrentView('customer-book')}
                  >
                    <i className="bi bi-calendar-plus me-1"></i> Book Rooms
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link text-decoration-none ${currentView === 'customer-bookings' ? 'active fw-bold' : ''}`}
                    onClick={() => setCurrentView('customer-bookings')}
                  >
                    <i className="bi bi-clock-history me-1"></i> Booking History
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link text-decoration-none ${currentView === 'customer-profile' ? 'active fw-bold' : ''}`}
                    onClick={() => setCurrentView('customer-profile')}
                  >
                    <i className="bi bi-person-circle me-1"></i> My Profile
                  </button>
                </li>
              </>
            )}

            {/* Staff Navigation */}
            {user && user.role === 'Staff' && (
              <>
                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link text-decoration-none ${currentView === 'staff-rooms' ? 'active fw-bold' : ''}`}
                    onClick={() => setCurrentView('staff-rooms')}
                  >
                    <i className="bi bi-grid-3x3-gap me-1"></i> Manage Rooms
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link text-decoration-none ${currentView === 'staff-customers' ? 'active fw-bold' : ''}`}
                    onClick={() => setCurrentView('staff-customers')}
                  >
                    <i className="bi bi-people me-1"></i> Manage Customers
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn btn-link text-decoration-none ${currentView === 'staff-bookings' ? 'active fw-bold' : ''}`}
                    onClick={() => setCurrentView('staff-bookings')}
                  >
                    <i className="bi bi-journal-bookmark me-1"></i> Manage Bookings
                  </button>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center">
            {user ? (
              <div className="d-flex align-items-center gap-2">
                <span className="text-light small">
                  {user.fullName || user.email}
                  <span className={`badge ms-2 ${user.role === 'Staff' ? 'bg-danger' : 'bg-primary'}`}>
                    {user.role}
                  </span>
                </span>
                <button
                  className="btn btn-outline-light btn-sm ms-2"
                  onClick={onLogout}
                >
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <button
                  className={`btn btn-outline-light btn-sm ${currentView === 'login' ? 'active' : ''}`}
                  onClick={() => setCurrentView('login')}
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i> Login
                </button>
                <button
                  className={`btn btn-primary btn-sm ${currentView === 'register' ? 'active' : ''}`}
                  onClick={() => setCurrentView('register')}
                >
                  <i className="bi bi-person-plus me-1"></i> Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

