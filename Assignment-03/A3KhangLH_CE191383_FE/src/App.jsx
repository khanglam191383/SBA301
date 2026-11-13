import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RoomsPublicView from './views/RoomsPublicView';
import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import CustomerProfileView from './views/customer/CustomerProfileView';
import CustomerBookRoomView from './views/customer/CustomerBookRoomView';
import CustomerBookingsView from './views/customer/CustomerBookingsView';
import StaffRoomsView from './views/staff/StaffRoomsView';
import StaffCustomersView from './views/staff/StaffCustomersView';
import StaffBookingsView from './views/staff/StaffBookingsView';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('rooms');
  const [preSelectedRoom, setPreSelectedRoom] = useState(null);

  // Restore user session from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLoginSuccess = (authData) => {
    setUser({
      email: authData.email,
      fullName: authData.fullName,
      role: authData.role,
      customerId: authData.customerId,
    });

    if (authData.role === 'Staff') {
      setCurrentView('staff-rooms');
    } else {
      if (preSelectedRoom) {
        setCurrentView('customer-book');
      } else {
        setCurrentView('rooms');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('rooms');
    setPreSelectedRoom(null);
  };

  const handleSelectRoomToBook = (room) => {
    setPreSelectedRoom(room);
    if (!user) {
      setCurrentView('login');
    } else if (user.role === 'Customer') {
      setCurrentView('customer-book');
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        user={user}
        onLogout={handleLogout}
      />

      <main className="main-content flex-grow-1">
        {currentView === 'rooms' && (
          <RoomsPublicView
            user={user}
            onSelectRoomToBook={handleSelectRoomToBook}
            onGoToLogin={() => setCurrentView('login')}
          />
        )}

        {currentView === 'login' && (
          <LoginView
            onLoginSuccess={handleLoginSuccess}
            onGoToRegister={() => setCurrentView('register')}
          />
        )}

        {currentView === 'register' && (
          <RegisterView
            onRegisterSuccess={() => setCurrentView('login')}
            onGoToLogin={() => setCurrentView('login')}
          />
        )}

        {/* Customer Views */}
        {currentView === 'customer-profile' && user?.role === 'Customer' && (
          <CustomerProfileView user={user} />
        )}

        {currentView === 'customer-book' && user?.role === 'Customer' && (
          <CustomerBookRoomView
            preSelectedRoom={preSelectedRoom}
            onBookingCreated={() => setCurrentView('customer-bookings')}
          />
        )}

        {currentView === 'customer-bookings' && user?.role === 'Customer' && (
          <CustomerBookingsView
            onGoToBook={() => {
              setPreSelectedRoom(null);
              setCurrentView('customer-book');
            }}
          />
        )}

        {/* Staff Views */}
        {currentView === 'staff-rooms' && user?.role === 'Staff' && (
          <StaffRoomsView />
        )}

        {currentView === 'staff-customers' && user?.role === 'Staff' && (
          <StaffCustomersView />
        )}

        {currentView === 'staff-bookings' && user?.role === 'Staff' && (
          <StaffBookingsView />
        )}
      </main>

      <Footer />
    </div>
  );
}

