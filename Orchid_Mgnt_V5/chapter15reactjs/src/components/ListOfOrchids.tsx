import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrchids, deleteOrchid } from '../services/orchidApi';
import type { Orchid } from '../types';

function OrchidThumbnail({ url, name }: { url?: string | null; name: string }) {
  const [hasError, setHasError] = useState(false);

  if (!url || hasError) {
    return <span className="thumb-placeholder">🌸</span>;
  }

  return (
    <img
      src={url}
      alt={name}
      className="thumb-img"
      onError={() => setHasError(true)}
      loading="lazy"
    />
  );
}

export default function ListOfOrchids() {
  const [orchids, setOrchids] = useState<Orchid[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await getOrchids();
      setOrchids(response.data);
      setError('');
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(`Lỗi kết nối Backend: ${e.message}. Hãy kiểm tra xem Spring Boot API đã chạy tại http://localhost:8080/orchids chưa.`);
      } else {
        setError('Không thể tải danh sách hoa lan từ server.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa hoa lan "${name}" (ID: ${id}) không?`)) {
      return;
    }
    try {
      setDeletingId(id);
      await deleteOrchid(id);
      await loadData();
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(`Lỗi khi xóa hoa lan: ${e.message}`);
      } else {
        setError('Không thể xóa hoa lan này.');
      }
    } finally {
      setDeletingId(null);
    }
  };

  const categories = Array.from(
    new Set(orchids.map((o) => o.orchidCategory).filter((c): c is string => Boolean(c)))
  );

  const filteredOrchids = orchids.filter((o) => {
    const matchesSearch =
      o.orchidName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.orchidCategory && o.orchidCategory.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = filterCategory === 'all' || o.orchidCategory === filterCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="orchid-list-container">
      <div className="list-header-banner">
        <div>
          <h1 className="list-title">Bộ Sưu Tập Hoa Lan</h1>
          <p className="list-description">
            Quản lý cơ sở dữ liệu các giống hoa lan tự nhiên và nhân giống (Lab 05 - SBA301)
          </p>
        </div>
        <Link to="/orchids/new" className="btn btn-primary btn-add-orchid" id="btn-create-orchid">
          <span className="btn-icon">➕</span>
          <span>Thêm hoa lan mới</span>
        </Link>
      </div>

      {/* Control bar: search, category filter, refresh */}
      <div className="controls-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Tìm theo tên hoặc loại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            id="orchid-search-input"
          />
          {searchTerm && (
            <button className="clear-btn" onClick={() => setSearchTerm('')} type="button">
              ✕
            </button>
          )}
        </div>

        <div className="filter-group">
          <label htmlFor="filter-cat" className="filter-label">Phân loại:</label>
          <select
            id="filter-cat"
            className="filter-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">Tất cả ({orchids.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button
            onClick={loadData}
            className="btn btn-secondary btn-refresh"
            title="Tải lại dữ liệu"
            id="btn-refresh-list"
          >
            🔄 Làm mới
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert" id="list-error-alert">
          <div className="alert-content">
            <strong>⚠️ Lỗi:</strong> {error}
          </div>
          <button className="btn btn-sm btn-outline-danger" onClick={loadData}>
            Thử lại
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu hoa lan từ Spring Boot API...</p>
        </div>
      ) : filteredOrchids.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🌿</span>
          <h3>Không tìm thấy hoa lan nào</h3>
          <p>
            {orchids.length === 0
              ? 'Chưa có dữ liệu trong database OrchidManagementDB.'
              : 'Không có hoa lan nào khớp với bộ lọc tìm kiếm.'}
          </p>
          <Link to="/orchids/new" className="btn btn-primary mt-2">
            Thêm hoa lan đầu tiên
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-custom table-striped">
            <thead>
              <tr>
                <th style={{ width: '70px' }}>ID</th>
                <th style={{ width: '90px' }}>Ảnh</th>
                <th>Tên Hoa Lan</th>
                <th>Phân Loại</th>
                <th style={{ width: '130px' }}>Nguồn gốc</th>
                <th style={{ width: '120px' }}>Đặc tính</th>
                <th style={{ width: '220px', textAlign: 'center' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrchids.map((orchid) => (
                <tr key={orchid.orchidId} className="orchid-row">
                  <td className="cell-id">
                    <span className="badge-id">#{orchid.orchidId}</span>
                  </td>
                  <td className="cell-thumb">
                    <Link
                      to={`/orchids/${orchid.orchidId}`}
                      className="thumb-wrapper"
                      title="Xem chi tiết"
                    >
                      <OrchidThumbnail url={orchid.orchidURL} name={orchid.orchidName} />
                    </Link>
                  </td>
                  <td className="cell-name">
                    <Link
                      to={`/orchids/${orchid.orchidId}`}
                      className="orchid-link-name"
                      title="Nhấn để xem chi tiết"
                    >
                      {orchid.orchidName}
                    </Link>
                    {orchid.orchidDescription && (
                      <p className="orchid-desc-snippet">{orchid.orchidDescription}</p>
                    )}
                  </td>
                  <td className="cell-category">
                    <span className="category-pill">
                      {orchid.orchidCategory || 'Chưa phân loại'}
                    </span>
                  </td>
                  <td className="cell-natural">
                    <span
                      className={`badge-status ${orchid.natural ? 'badge-natural' : 'badge-hybrid'}`}
                    >
                      {orchid.natural ? '🌱 Tự nhiên' : '🧪 Nhân giống'}
                    </span>
                  </td>
                  <td className="cell-attractive">
                    <span
                      className={`badge-status ${orchid.attractive ? 'badge-attractive' : 'badge-normal'}`}
                    >
                      {orchid.attractive ? '⭐ Nổi bật' : '⚪ Bình thường'}
                    </span>
                  </td>
                  <td className="cell-actions">
                    <div className="action-buttons">
                      <Link
                        to={`/orchids/${orchid.orchidId}`}
                        className="btn btn-sm btn-info btn-action"
                        title="Xem chi tiết"
                      >
                        👁️ Chi tiết
                      </Link>
                      <Link
                        to={`/orchids/${orchid.orchidId}/edit`}
                        className="btn btn-sm btn-warning btn-action"
                        title="Chỉnh sửa"
                        id={`btn-edit-${orchid.orchidId}`}
                      >
                        ✏️ Sửa
                      </Link>
                      <button
                        className="btn btn-sm btn-danger btn-action"
                        onClick={() => handleDelete(orchid.orchidId, orchid.orchidName)}
                        disabled={deletingId === orchid.orchidId}
                        title="Xóa"
                        id={`btn-delete-${orchid.orchidId}`}
                      >
                        {deletingId === orchid.orchidId ? '⏳' : '🗑️ Xóa'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
