import React, { useState, useEffect } from 'react';
import { roomService, roomTypeService } from '../services/api';

export default function RoomsPublicView({ user, onSelectRoomToBook, onGoToLogin }) {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detailModalRoom, setDetailModalRoom] = useState(null);

  const fetchRoomTypes = async () => {
    try {
      const res = await roomTypeService.getRoomTypes();
      setRoomTypes(res.data);
    } catch (err) {
      console.error('Error fetching room types:', err);
    }
  };

  const fetchRooms = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (selectedType) params.roomTypeId = selectedType;
      if (keyword.trim()) params.keyword = keyword.trim();

      const res = await roomService.getActiveRooms(params);
      setRooms(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [selectedType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRooms();
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'N/A';
    return Number(price).toLocaleString('vi-VN') + ' ₫';
  };

  return (
    <div className="container py-4">
      {/* Hero Banner */}
      <div className="p-4 p-md-5 mb-4 rounded-4 bg-primary text-white shadow-sm position-relative overflow-hidden">
        <div className="col-md-8">
          <h1 className="display-6 fw-bold">Welcome to FU Mini Hotel</h1>
          <p className="lead my-3">
            Explore our comfortable rooms with modern amenities. Book online instantly and enjoy your luxury stay!
          </p>
          <span className="badge bg-light text-primary fs-6 px-3 py-2 rounded-pill shadow-sm">
            <i className="bi bi-shield-check me-1"></i> Public Room Catalog (No Authentication Required)
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="custom-card p-3 mb-4">
        <form onSubmit={handleSearchSubmit} className="row g-3 align-items-center">
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by room number, description..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">-- All Room Types --</option>
              {roomTypes.map((t) => (
                <option key={t.roomTypeID} value={t.roomTypeID}>
                  {t.roomTypeName}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3 d-flex gap-2">
            <button type="submit" className="btn btn-primary flex-fill">
              <i className="bi bi-filter me-1"></i> Filter
            </button>
            {(keyword || selectedType) && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  setKeyword('');
                  setSelectedType('');
                }}
              >
                Reset
              </button>
            )}
          </div>
        </form>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Rooms Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Loading available rooms...</p>
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-5 custom-card">
          <i className="bi bi-door-closed fs-1 text-muted"></i>
          <h5 className="mt-3 text-secondary">No active rooms found</h5>
          <p className="text-muted small">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {rooms.map((room) => (
            <div className="col" key={room.roomID}>
              <div className="card custom-card room-card h-100">
                <div className="room-card-img-placeholder">
                  <i className="bi bi-building"></i>
                  <span className="card-header-badge badge bg-success">
                    Active
                  </span>
                </div>
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title fw-bold text-primary mb-0">
                      Room {room.roomNumber}
                    </h5>
                    <span className="badge bg-light text-dark border">
                      {room.roomType?.roomTypeName || 'Standard'}
                    </span>
                  </div>

                  <p className="card-text text-muted small flex-grow-1">
                    {room.roomDetailDescription || 'Full comfort, modern furniture, high-speed WiFi.'}
                  </p>

                  <div className="d-flex justify-content-between align-items-center text-muted small mb-3 pt-2 border-top">
                    <span>
                      <i className="bi bi-people-fill me-1 text-primary"></i> Max: <strong>{room.roomMaxCapacity || 2} guests</strong>
                    </span>
                    <span className="text-danger fw-bold fs-5">
                      {formatPrice(room.roomPricePerDay)}
                      <small className="fs-6 text-muted fw-normal"> / day</small>
                    </span>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-secondary btn-sm flex-fill"
                      onClick={() => setDetailModalRoom(room)}
                    >
                      <i className="bi bi-eye me-1"></i> Details
                    </button>

                    {user && user.role === 'Customer' ? (
                      <button
                        className="btn btn-primary btn-sm flex-fill"
                        onClick={() => onSelectRoomToBook(room)}
                      >
                        <i className="bi bi-calendar-check me-1"></i> Book Now
                      </button>
                    ) : user && user.role === 'Staff' ? (
                      <button
                        className="btn btn-secondary btn-sm flex-fill"
                        disabled
                      >
                        Staff View
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm flex-fill"
                        onClick={onGoToLogin}
                      >
                        <i className="bi bi-box-arrow-in-right me-1"></i> Login to Book
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Room Details Modal */}
      {detailModalRoom && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content custom-card">
              <div className="modal-header">
                <h5 className="modal-title fw-bold text-primary">
                  Room {detailModalRoom.roomNumber} - {detailModalRoom.roomType?.roomTypeName}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDetailModalRoom(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3 text-center p-4 bg-light rounded-3">
                  <i className="bi bi-building-fill display-4 text-primary"></i>
                  <h4 className="mt-2 text-danger fw-bold">
                    {formatPrice(detailModalRoom.roomPricePerDay)} / day
                  </h4>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between">
                    <span className="text-muted">Room Type:</span>
                    <span className="fw-semibold">{detailModalRoom.roomType?.roomTypeName}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span className="text-muted">Type Note:</span>
                    <span>{detailModalRoom.roomType?.typeNote || 'N/A'}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between">
                    <span className="text-muted">Max Capacity:</span>
                    <span className="fw-semibold">{detailModalRoom.roomMaxCapacity} guests</span>
                  </li>
                  <li className="list-group-item">
                    <div className="text-muted mb-1">Description:</div>
                    <p className="mb-0 small">{detailModalRoom.roomDetailDescription || 'Standard hotel room'}</p>
                  </li>
                </ul>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDetailModalRoom(null)}
                >
                  Close
                </button>
                {user && user.role === 'Customer' && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      const r = detailModalRoom;
                      setDetailModalRoom(null);
                      onSelectRoomToBook(r);
                    }}
                  >
                    Proceed to Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

