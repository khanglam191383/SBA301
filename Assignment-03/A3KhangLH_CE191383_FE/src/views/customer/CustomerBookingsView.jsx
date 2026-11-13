import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/api';

export default function CustomerBookingsView({ onGoToBook }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detailModalBooking, setDetailModalBooking] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingService.getMyBookings();
      setBookings(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load booking history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatPrice = (price) => {
    if (!price && price !== 0) return '0 ₫';
    return Number(price).toLocaleString('vi-VN') + ' ₫';
  };

  const getStatusBadge = (status) => {
    if (status === 1) return <span className="badge bg-success">Confirmed</span>;
    if (status === 2) return <span className="badge bg-primary">Completed</span>;
    if (status === 0) return <span className="badge bg-secondary">Cancelled</span>;
    return <span className="badge bg-warning text-dark">Pending</span>;
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="page-title text-primary mb-1">
            <i className="bi bi-clock-history me-2"></i> My Booking History
          </h3>
          <p className="text-muted small mb-0">Review all your past and active hotel reservations</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={onGoToBook}>
          <i className="bi bi-plus-circle me-1"></i> New Booking
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Loading reservations...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-5 custom-card">
          <i className="bi bi-journal-x fs-1 text-muted"></i>
          <h5 className="mt-3 text-secondary">No booking reservations found</h5>
          <p className="text-muted small">You haven't made any hotel reservations yet.</p>
          <button className="btn btn-outline-primary btn-sm mt-2" onClick={onGoToBook}>
            Book a Room Now
          </button>
        </div>
      ) : (
        <div className="card custom-card">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Booking Date</th>
                  <th>Total Rooms</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.bookingReservationID}>
                    <td className="fw-bold text-primary">#{b.bookingReservationID}</td>
                    <td>{b.bookingDate || 'N/A'}</td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {b.bookingDetails?.length || 0} room(s)
                      </span>
                    </td>
                    <td className="fw-bold text-danger">{formatPrice(b.totalPrice)}</td>
                    <td>{getStatusBadge(b.bookingStatus)}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => setDetailModalBooking(b)}
                      >
                        <i className="bi bi-info-circle me-1"></i> View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {detailModalBooking && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content custom-card">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  Reservation #{detailModalBooking.bookingReservationID} Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDetailModalBooking(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3 mb-3">
                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded text-center">
                      <div className="small text-muted">Booking Date</div>
                      <div className="fw-bold">{detailModalBooking.bookingDate}</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded text-center">
                      <div className="small text-muted">Status</div>
                      <div>{getStatusBadge(detailModalBooking.bookingStatus)}</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="p-3 bg-light rounded text-center">
                      <div className="small text-muted">Total Amount</div>
                      <div className="fw-bold text-danger fs-5">
                        {formatPrice(detailModalBooking.totalPrice)}
                      </div>
                    </div>
                  </div>
                </div>

                <h6 className="fw-bold text-secondary mb-2">Booked Rooms Details:</h6>
                <div className="table-responsive">
                  <table className="table table-bordered table-sm align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Room</th>
                        <th>Type</th>
                        <th>Check-in</th>
                        <th>Check-out</th>
                        <th className="text-end">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailModalBooking.bookingDetails?.map((detail, idx) => (
                        <tr key={idx}>
                          <td className="fw-bold text-primary">
                            Room {detail.roomInformation?.roomNumber}
                          </td>
                          <td>{detail.roomInformation?.roomType?.roomTypeName || 'N/A'}</td>
                          <td>{detail.startDate}</td>
                          <td>{detail.endDate}</td>
                          <td className="text-end fw-semibold text-danger">
                            {formatPrice(detail.actualPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDetailModalBooking(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

