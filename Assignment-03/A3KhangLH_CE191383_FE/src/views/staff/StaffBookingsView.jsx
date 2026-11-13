import React, { useState, useEffect } from 'react';
import { bookingService } from '../../services/api';

export default function StaffBookingsView() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('');
  const [keyword, setKeyword] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // Detail Modal
  const [detailModalBooking, setDetailModalBooking] = useState(null);

  // Status Change Modal
  const [statusModalBooking, setStatusModalBooking] = useState(null);
  const [newStatus, setNewStatus] = useState(1);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingService.getAllBookings();
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to load all bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async () => {
    if (!statusModalBooking) return;
    setUpdatingStatus(true);
    try {
      await bookingService.updateBookingStatus(statusModalBooking.bookingReservationID, newStatus);
      setFeedbackMessage({
        text: `Status for Reservation #${statusModalBooking.bookingReservationID} updated successfully!`,
        type: 'success',
      });
      setStatusModalBooking(null);
      fetchBookings();
    } catch (err) {
      setFeedbackMessage({
        text: err.response?.data?.message || 'Failed to update booking status',
        type: 'danger',
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString('vi-VN') + ' ₫';
  };

  const getStatusBadge = (status) => {
    if (status === 1) return <span className="badge bg-success">Confirmed</span>;
    if (status === 2) return <span className="badge bg-primary">Completed</span>;
    if (status === 0) return <span className="badge bg-secondary">Cancelled</span>;
    return <span className="badge bg-warning text-dark">Pending</span>;
  };

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus =
      selectedStatusFilter === '' || b.bookingStatus === Number(selectedStatusFilter);

    const kw = keyword.toLowerCase().trim();
    const matchesKeyword =
      !kw ||
      String(b.bookingReservationID).includes(kw) ||
      b.customer?.customerFullName?.toLowerCase().includes(kw) ||
      b.customer?.emailAddress?.toLowerCase().includes(kw);

    return matchesStatus && matchesKeyword;
  });

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="page-title text-primary mb-1">
            <i className="bi bi-journal-check me-2"></i> Manage Booking Reservations
          </h3>
          <p className="text-muted small mb-0">Review all customer booking orders and manage their progress</p>
        </div>
      </div>

      {feedbackMessage && (
        <div className={`alert alert-${feedbackMessage.type} alert-dismissible fade show`} role="alert">
          {feedbackMessage.text}
          <button type="button" className="btn-close" onClick={() => setFeedbackMessage(null)}></button>
        </div>
      )}

      {/* Filter */}
      <div className="custom-card p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by ID, customer name, or email..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
            >
              <option value="">-- All Statuses --</option>
              <option value="1">Confirmed</option>
              <option value="2">Completed</option>
              <option value="0">Cancelled</option>
            </select>
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-outline-secondary w-100"
              onClick={() => {
                setKeyword('');
                setSelectedStatusFilter('');
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Loading reservations...</p>
        </div>
      ) : (
        <div className="card custom-card">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Contact Email</th>
                  <th>Booking Date</th>
                  <th>Rooms</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-muted">
                      No booking reservations match the criteria.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.bookingReservationID}>
                      <td className="fw-bold text-primary">#{b.bookingReservationID}</td>
                      <td>
                        <span className="fw-semibold">{b.customer?.customerFullName}</span>
                        <div className="text-muted small">ID: #{b.customer?.customerID}</div>
                      </td>
                      <td>{b.customer?.emailAddress}</td>
                      <td>{b.bookingDate}</td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {b.bookingDetails?.length || 0} room(s)
                        </span>
                      </td>
                      <td className="fw-bold text-danger">{formatPrice(b.totalPrice)}</td>
                      <td>{getStatusBadge(b.bookingStatus)}</td>
                      <td className="text-end">
                        <button
                          className="btn btn-outline-info btn-sm me-2"
                          onClick={() => setDetailModalBooking(b)}
                        >
                          <i className="bi bi-info-circle me-1"></i> Details
                        </button>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => {
                            setStatusModalBooking(b);
                            setNewStatus(b.bookingStatus !== undefined ? b.bookingStatus : 1);
                          }}
                        >
                          <i className="bi bi-arrow-repeat me-1"></i> Status
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

      {/* Details Modal */}
      {detailModalBooking && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content custom-card">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  Reservation #{detailModalBooking.bookingReservationID} &bull; Details
                </h5>
                <button type="button" className="btn-close" onClick={() => setDetailModalBooking(null)}></button>
              </div>
              <div className="modal-body">
                <div className="card bg-light p-3 mb-3 border-0">
                  <div className="row g-2 small">
                    <div className="col-md-6">
                      <strong>Customer:</strong> {detailModalBooking.customer?.customerFullName}
                    </div>
                    <div className="col-md-6">
                      <strong>Email:</strong> {detailModalBooking.customer?.emailAddress}
                    </div>
                    <div className="col-md-6">
                      <strong>Telephone:</strong> {detailModalBooking.customer?.telephone || 'N/A'}
                    </div>
                    <div className="col-md-6">
                      <strong>Booking Date:</strong> {detailModalBooking.bookingDate}
                    </div>
                  </div>
                </div>

                <h6 className="fw-bold text-secondary mb-2">Booked Rooms (Booking Details):</h6>
                <div className="table-responsive">
                  <table className="table table-bordered table-sm align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Room</th>
                        <th>Type</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th className="text-end">Actual Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailModalBooking.bookingDetails?.map((d, i) => (
                        <tr key={i}>
                          <td className="fw-bold text-primary">Room {d.roomInformation?.roomNumber}</td>
                          <td>{d.roomInformation?.roomType?.roomTypeName || 'N/A'}</td>
                          <td>{d.startDate}</td>
                          <td>{d.endDate}</td>
                          <td className="text-end fw-semibold text-danger">
                            {formatPrice(d.actualPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="table-light">
                        <td colSpan="4" className="fw-bold text-end">Total Reservation Price:</td>
                        <td className="fw-bold text-end text-danger fs-6">
                          {formatPrice(detailModalBooking.totalPrice)}
                        </td>
                      </tr>
                    </tfoot>
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

      {/* Change Status Modal */}
      {statusModalBooking && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content custom-card">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  Update Status for Booking #{statusModalBooking.bookingReservationID}
                </h5>
                <button type="button" className="btn-close" onClick={() => setStatusModalBooking(null)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Select New Status</label>
                  <select
                    className="form-select"
                    value={newStatus}
                    onChange={(e) => setNewStatus(Number(e.target.value))}
                  >
                    <option value="1">1 - Confirmed (Đã xác nhận)</option>
                    <option value="2">2 - Completed (Đã hoàn thành / Trả phòng)</option>
                    <option value="0">0 - Cancelled (Hủy đặt phòng)</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setStatusModalBooking(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={updatingStatus}
                  onClick={handleUpdateStatus}
                >
                  {updatingStatus ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

