import React, { useState, useEffect } from 'react';
import { roomService, roomTypeService } from '../../services/api';

export default function StaffRoomsView() {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  // Modal State for Add / Edit
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomDetailDescription: '',
    roomMaxCapacity: 2,
    roomTypeID: '',
    roomStatus: 1,
    roomPricePerDay: 500000,
  });
  const [modalError, setModalError] = useState('');

  // Delete Confirm Modal
  const [deletingRoom, setDeletingRoom] = useState(null);

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
    try {
      const params = {};
      if (keyword.trim()) params.keyword = keyword.trim();
      if (selectedType) params.roomTypeId = selectedType;
      if (selectedStatus !== '') params.status = selectedStatus;

      const res = await roomService.getStaffRooms(params);
      setRooms(res.data);
    } catch (err) {
      console.error('Failed to load rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [selectedType, selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRooms();
  };

  const handleOpenAdd = () => {
    setEditingRoom(null);
    setFormData({
      roomNumber: '',
      roomDetailDescription: '',
      roomMaxCapacity: 2,
      roomTypeID: roomTypes.length > 0 ? roomTypes[0].roomTypeID : '',
      roomStatus: 1,
      roomPricePerDay: 500000,
    });
    setModalError('');
    setShowModal(true);
  };

  const handleOpenEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      roomDetailDescription: room.roomDetailDescription || '',
      roomMaxCapacity: room.roomMaxCapacity || 2,
      roomTypeID: room.roomType?.roomTypeID || (roomTypes[0] ? roomTypes[0].roomTypeID : ''),
      roomStatus: room.roomStatus !== undefined ? room.roomStatus : 1,
      roomPricePerDay: room.roomPricePerDay || 0,
    });
    setModalError('');
    setShowModal(true);
  };

  const handleSaveRoom = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!formData.roomNumber.trim()) {
      setModalError('Room number is required');
      return;
    }
    if (!formData.roomTypeID) {
      setModalError('Room type is required');
      return;
    }

    try {
      if (editingRoom) {
        await roomService.updateRoom(editingRoom.roomID, formData);
        setFeedbackMessage({ text: `Room ${formData.roomNumber} updated successfully!`, type: 'success' });
      } else {
        await roomService.createRoom(formData);
        setFeedbackMessage({ text: `Room ${formData.roomNumber} created successfully!`, type: 'success' });
      }
      setShowModal(false);
      fetchRooms();
    } catch (err) {
      setModalError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingRoom) return;
    try {
      const res = await roomService.deleteRoom(deletingRoom.roomID);
      setFeedbackMessage({
        text: res.data?.message || 'Delete operation completed.',
        type: 'info',
      });
      setDeletingRoom(null);
      fetchRooms();
    } catch (err) {
      setFeedbackMessage({
        text: err.response?.data?.message || 'Failed to delete room',
        type: 'danger',
      });
      setDeletingRoom(null);
    }
  };

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString('vi-VN') + ' ₫';
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="page-title text-primary mb-1">
            <i className="bi bi-door-open-fill me-2"></i> Manage Room Information
          </h3>
          <p className="text-muted small mb-0">Create, edit, search, and manage room statuses</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAdd}>
          <i className="bi bi-plus-lg me-1"></i> Add New Room
        </button>
      </div>

      {feedbackMessage && (
        <div className={`alert alert-${feedbackMessage.type} alert-dismissible fade show`} role="alert">
          {feedbackMessage.text}
          <button type="button" className="btn-close" onClick={() => setFeedbackMessage(null)}></button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="custom-card p-3 mb-4">
        <form onSubmit={handleSearchSubmit} className="row g-3 align-items-center">
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text bg-white"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control"
                placeholder="Search room number or description..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
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
          <div className="col-md-3">
            <select
              className="form-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">-- All Statuses --</option>
              <option value="1">Active (Hoạt động)</option>
              <option value="2">Inactive / Soft Deleted (Ngưng hoạt động)</option>
            </select>
          </div>
          <div className="col-md-2 d-flex gap-2">
            <button type="submit" className="btn btn-primary flex-fill">Filter</button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => {
                setKeyword('');
                setSelectedType('');
                setSelectedStatus('');
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
          <p className="mt-2 text-muted">Loading room list...</p>
        </div>
      ) : (
        <div className="card custom-card">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>Room ID</th>
                  <th>Room Number</th>
                  <th>Room Type</th>
                  <th>Max Capacity</th>
                  <th>Price / Day</th>
                  <th>Status</th>
                  <th>Description</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-muted">
                      No rooms found matching filters.
                    </td>
                  </tr>
                ) : (
                  rooms.map((room) => (
                    <tr key={room.roomID}>
                      <td className="fw-semibold">#{room.roomID}</td>
                      <td className="fw-bold text-primary">Room {room.roomNumber}</td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {room.roomType?.roomTypeName || 'N/A'}
                        </span>
                      </td>
                      <td>{room.roomMaxCapacity} guests</td>
                      <td className="fw-bold text-danger">{formatPrice(room.roomPricePerDay)}</td>
                      <td>
                        {room.roomStatus === 1 ? (
                          <span className="badge bg-success">Active</span>
                        ) : (
                          <span className="badge bg-danger">Inactive (Soft Deleted)</span>
                        )}
                      </td>
                      <td className="small text-muted" style={{ maxWidth: '200px' }}>
                        {room.roomDetailDescription || 'N/A'}
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-outline-primary btn-sm me-2"
                          onClick={() => handleOpenEdit(room)}
                        >
                          <i className="bi bi-pencil me-1"></i> Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => setDeletingRoom(room)}
                        >
                          <i className="bi bi-trash me-1"></i> Delete
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

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content custom-card">
              <div className="modal-header">
                <h5 className="modal-title fw-bold text-primary">
                  {editingRoom ? `Edit Room ${editingRoom.roomNumber}` : 'Add New Room'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSaveRoom}>
                <div className="modal-body">
                  {modalError && <div className="alert alert-danger py-2 small">{modalError}</div>}

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Room Number *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.roomNumber}
                      onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                      placeholder="e.g. 101, 201"
                      required
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Room Type *</label>
                      <select
                        className="form-select"
                        value={formData.roomTypeID}
                        onChange={(e) => setFormData({ ...formData, roomTypeID: Number(e.target.value) })}
                        required
                      >
                        {roomTypes.map((t) => (
                          <option key={t.roomTypeID} value={t.roomTypeID}>
                            {t.roomTypeName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Max Capacity</label>
                      <input
                        type="number"
                        className="form-control"
                        min="1"
                        value={formData.roomMaxCapacity}
                        onChange={(e) => setFormData({ ...formData, roomMaxCapacity: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Price Per Day (VND) *</label>
                      <input
                        type="number"
                        className="form-control"
                        min="0"
                        step="10000"
                        value={formData.roomPricePerDay}
                        onChange={(e) => setFormData({ ...formData, roomPricePerDay: Number(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Status</label>
                      <select
                        className="form-select"
                        value={formData.roomStatus}
                        onChange={(e) => setFormData({ ...formData, roomStatus: Number(e.target.value) })}
                      >
                        <option value="1">Active</option>
                        <option value="2">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.roomDetailDescription}
                      onChange={(e) => setFormData({ ...formData, roomDetailDescription: e.target.value })}
                      placeholder="Details about views, furniture, amenities..."
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingRoom ? 'Update Room' : 'Create Room'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (Explains Rule) */}
      {deletingRoom && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content custom-card">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-exclamation-triangle me-2"></i> Confirm Room Deletion
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setDeletingRoom(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete <strong>Room {deletingRoom.roomNumber}</strong>?
                </p>
                <div className="alert alert-warning small">
                  <strong><i className="bi bi-info-circle me-1"></i> Business Rule Requirement:</strong>
                  <ul className="mb-0 mt-1 ps-3">
                    <li>If this room has <strong>no booking history</strong>, it will be <strong>permanently deleted</strong>.</li>
                    <li>If this room is <strong>already in a booking detail</strong>, its status will automatically be set to <strong>Inactive</strong> (soft delete) to preserve historical data.</li>
                  </ul>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setDeletingRoom(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleConfirmDelete}
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

