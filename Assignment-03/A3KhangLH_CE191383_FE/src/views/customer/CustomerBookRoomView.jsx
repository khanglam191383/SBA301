import React, { useState, useEffect } from 'react';
import { roomService, bookingService } from '../../services/api';

export default function CustomerBookRoomView({ preSelectedRoom, onBookingCreated }) {
  const [rooms, setRooms] = useState([]);
  const [selectedRoomIds, setSelectedRoomIds] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Default dates: tomorrow and day after tomorrow
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);

    const formatDate = (d) => d.toISOString().split('T')[0];
    setStartDate(formatDate(tomorrow));
    setEndDate(formatDate(dayAfter));
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await roomService.getActiveRooms();
      setRooms(res.data);
      if (preSelectedRoom && preSelectedRoom.roomID) {
        setSelectedRoomIds([preSelectedRoom.roomID]);
      }
    } catch (err) {
      setError('Failed to load available rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleToggleRoom = (roomId) => {
    if (selectedRoomIds.includes(roomId)) {
      setSelectedRoomIds(selectedRoomIds.filter((id) => id !== roomId));
    } else {
      setSelectedRoomIds([...selectedRoomIds, roomId]);
    }
  };

  // Calculate days
  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const days = calculateDays();

  // Selected rooms objects
  const selectedRooms = rooms.filter((r) => selectedRoomIds.includes(r.roomID));

  // Calculate total price
  const totalPrice = selectedRooms.reduce((sum, r) => {
    const pricePerDay = Number(r.roomPricePerDay) || 0;
    return sum + pricePerDay * days;
  }, 0);

  const formatPrice = (price) => {
    return Number(price).toLocaleString('vi-VN') + ' ₫';
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (selectedRoomIds.length === 0) {
      setError('Please select at least one room to book');
      return;
    }

    if (!startDate || !endDate) {
      setError('Please select check-in and check-out dates');
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      setError('Check-out date must be after check-in date');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const items = selectedRoomIds.map((id) => ({
        roomID: id,
        startDate: startDate,
        endDate: endDate,
      }));

      const res = await bookingService.createBooking({ items });
      setSuccess(`Booking created successfully! Reservation ID: #${res.data.bookingReservationID}`);
      setTimeout(() => {
        onBookingCreated();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete booking');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h3 className="page-title text-primary">
          <i className="bi bi-calendar2-check me-2"></i> Book Hotel Rooms
        </h3>
        <p className="text-muted">
          Select your travel dates and pick one or multiple rooms to create a combined reservation.
        </p>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}
      {success && <div className="alert alert-success py-2">{success}</div>}

      <div className="row g-4">
        {/* Left column: Date selection & Room choices */}
        <div className="col-lg-8">
          {/* Step 1: Dates */}
          <div className="card custom-card p-4 mb-4">
            <h5 className="fw-bold mb-3 text-secondary">
              <span className="badge bg-primary me-2">1</span> Select Dates
            </h5>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Check-in Date (Start Date)</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Check-out Date (End Date)</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>
            <div className="mt-2 text-muted small">
              <i className="bi bi-info-circle me-1"></i> Length of stay: <strong>{days} night(s)</strong>
            </div>
          </div>

          {/* Step 2: Rooms */}
          <div className="card custom-card p-4">
            <h5 className="fw-bold mb-3 text-secondary">
              <span className="badge bg-primary me-2">2</span> Select Rooms (One or Many)
            </h5>

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted">Loading rooms...</p>
              </div>
            ) : rooms.length === 0 ? (
              <p className="text-muted text-center py-4">No active rooms available.</p>
            ) : (
              <div className="row row-cols-1 row-cols-md-2 g-3">
                {rooms.map((room) => {
                  const isChecked = selectedRoomIds.includes(room.roomID);
                  return (
                    <div className="col" key={room.roomID}>
                      <div
                        className={`card h-100 p-3 cursor-pointer border ${isChecked ? 'border-primary bg-primary-subtle shadow-sm' : 'border-light-subtle'}`}
                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                        onClick={() => handleToggleRoom(room.roomID)}
                      >
                        <div className="form-check d-flex align-items-start">
                          <input
                            className="form-check-input me-3 mt-1"
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleRoom(room.roomID)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between">
                              <h6 className="fw-bold mb-1 text-primary">Room {room.roomNumber}</h6>
                              <span className="badge bg-light text-dark border small">
                                {room.roomType?.roomTypeName}
                              </span>
                            </div>
                            <div className="small text-muted mb-2">
                              {room.roomDetailDescription}
                            </div>
                            <div className="d-flex justify-content-between align-items-center small">
                              <span className="text-secondary">
                                <i className="bi bi-people me-1"></i> Max {room.roomMaxCapacity}
                              </span>
                              <span className="fw-bold text-danger">
                                {formatPrice(room.roomPricePerDay)} / day
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Summary & Confirmation */}
        <div className="col-lg-4">
          <div className="card custom-card p-4 sticky-top" style={{ top: '80px' }}>
            <h5 className="fw-bold mb-3 border-bottom pb-2">Booking Summary</h5>

            <div className="mb-3 small">
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted">Check-in:</span>
                <span className="fw-semibold">{startDate || 'N/A'}</span>
              </div>
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted">Check-out:</span>
                <span className="fw-semibold">{endDate || 'N/A'}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Duration:</span>
                <span className="fw-semibold">{days} night(s)</span>
              </div>
            </div>

            <div className="border-top pt-2 mb-3">
              <h6 className="fw-semibold small text-secondary mb-2">
                Selected Rooms ({selectedRooms.length}):
              </h6>
              {selectedRooms.length === 0 ? (
                <p className="text-muted small fst-italic">No room selected yet</p>
              ) : (
                <ul className="list-group list-group-flush small">
                  {selectedRooms.map((r) => {
                    const price = Number(r.roomPricePerDay) * days;
                    return (
                      <li key={r.roomID} className="list-group-item px-0 d-flex justify-content-between">
                        <span>Room {r.roomNumber} ({r.roomType?.roomTypeName})</span>
                        <span className="fw-semibold">{formatPrice(price)}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="border-top pt-3 mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">Total Price:</span>
                <span className="fw-bold fs-4 text-danger">{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary w-100 py-2 fw-semibold"
              disabled={submitting || selectedRooms.length === 0}
              onClick={handleSubmitBooking}
            >
              {submitting ? 'Confirming...' : 'Confirm Online Reservation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

