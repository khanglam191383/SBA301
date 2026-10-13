import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createOrchid, getOrchid, updateOrchid } from '../services/orchidApi';
import type { OrchidDraft } from '../types';

interface EditOrchidProps {
  createMode?: boolean;
}

const emptyForm: OrchidDraft = {
  orchidName: '',
  natural: false,
  orchidDescription: '',
  orchidCategory: '',
  attractive: false,
  orchidURL: '',
};

export default function EditOrchid({ createMode = false }: EditOrchidProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<OrchidDraft>(emptyForm);
  const [loading, setLoading] = useState<boolean>(!createMode);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    if (!createMode && id) {
      setLoading(true);
      getOrchid(id)
        .then((res) => {
          setForm({
            orchidName: res.data.orchidName || '',
            natural: Boolean(res.data.natural),
            orchidDescription: res.data.orchidDescription || '',
            orchidCategory: res.data.orchidCategory || '',
            attractive: Boolean(res.data.attractive),
            orchidURL: res.data.orchidURL || '',
          });
          setError('');
        })
        .catch((e: unknown) => {
          if (e instanceof Error) {
            setError(`Không thể tải thông tin hoa lan #${id}: ${e.message}`);
          } else {
            setError('Lỗi khi tải thông tin hoa lan.');
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [createMode, id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (name === 'orchidURL') {
      setImageError(false);
    }
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.orchidName.trim()) {
      setError('Tên hoa lan không được để trống.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      if (createMode) {
        await createOrchid(form);
      } else if (id) {
        await updateOrchid(Number(id), form);
      }
      navigate('/');
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(`Thao tác không thành công: ${e.message}`);
      } else {
        setError('Có lỗi xảy ra khi lưu hoa lan.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="form-card loading-state">
        <div className="spinner"></div>
        <p>Đang tải thông tin hoa lan...</p>
      </div>
    );
  }

  return (
    <div className="form-page-container">
      <div className="form-header-nav">
        <Link to="/" className="back-link">
          ← Quay lại danh sách
        </Link>
      </div>

      <div className="form-card">
        <div className="form-card-header">
          <span className="form-header-badge">
            {createMode ? 'TẠO MỚI' : `CHỈNH SỬA #${id}`}
          </span>
          <h2 className="form-title">
            {createMode ? 'Thêm Hoa Lan Mới' : `Cập Nhật: ${form.orchidName || 'Hoa lan'}`}
          </h2>
          <p className="form-subtitle">
            {createMode
              ? 'Điền đầy đủ thông tin để lưu giống hoa lan vào cơ sở dữ liệu'
              : 'Thay đổi các trường bên dưới và nhấn Lưu thay đổi'}
          </p>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert" id="form-error-alert">
            <strong>⚠️ Lỗi:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="orchid-form" id="orchid-edit-form">
          <div className="form-group mb-3">
            <label className="form-label" htmlFor="input-orchidName">
              Tên Hoa Lan <span className="text-danger">*</span>
            </label>
            <input
              id="input-orchidName"
              className="form-control"
              name="orchidName"
              placeholder="Ví dụ: Taichung Beauty, Hồ Điệp Trắng..."
              value={form.orchidName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="input-orchidCategory">
                Phân Loại (Category)
              </label>
              <input
                id="input-orchidCategory"
                className="form-control"
                name="orchidCategory"
                placeholder="Ví dụ: Cattleya, Dendrobium, Vanda..."
                value={form.orchidCategory}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label" htmlFor="input-orchidURL">
                Đường Dẫn Hình Ảnh (Image URL)
              </label>
              <input
                id="input-orchidURL"
                className="form-control"
                name="orchidURL"
                placeholder="https://example.com/orchid.jpg"
                value={form.orchidURL}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Live image preview if URL provided */}
          {form.orchidURL && (
            <div className="preview-container mb-3">
              <span className="preview-label">Xem trước hình ảnh:</span>
              <div className="preview-frame">
                {imageError ? (
                  <span className="preview-err-text">❌ Không thể tải ảnh từ URL này</span>
                ) : (
                  <img
                    src={form.orchidURL}
                    alt="Xem trước"
                    className="preview-img"
                    onError={() => setImageError(true)}
                  />
                )}
              </div>
            </div>
          )}

          <div className="form-group mb-3">
            <label className="form-label" htmlFor="input-orchidDescription">
              Mô Tả Chi Tiết (Description)
            </label>
            <textarea
              id="input-orchidDescription"
              className="form-control"
              rows={4}
              name="orchidDescription"
              placeholder="Nhập mô tả về đặc điểm, xuất xứ, điều kiện chăm sóc của hoa lan..."
              value={form.orchidDescription}
              onChange={handleChange}
            />
          </div>

          <div className="checkbox-row mb-4">
            <div className="form-check form-switch-custom">
              <input
                className="form-check-input"
                type="checkbox"
                id="check-natural"
                name="natural"
                checked={form.natural}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="check-natural">
                <strong>🌱 Tự nhiên (Natural)</strong>
                <span className="check-subtext">Giống hoa mọc tự nhiên trong tự nhiên</span>
              </label>
            </div>

            <div className="form-check form-switch-custom">
              <input
                className="form-check-input"
                type="checkbox"
                id="check-attractive"
                name="attractive"
                checked={form.attractive}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="check-attractive">
                <strong>⭐ Nổi bật (Attractive)</strong>
                <span className="check-subtext">Giống hoa có hình dáng, màu sắc hoặc hương thơm đặc biệt</span>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-submit"
              disabled={submitting}
              id="btn-save-orchid"
            >
              {submitting ? '⏳ Đang lưu...' : '💾 Lưu hoa lan'}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-cancel"
              onClick={() => navigate('/')}
            >
              Hủy bỏ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
