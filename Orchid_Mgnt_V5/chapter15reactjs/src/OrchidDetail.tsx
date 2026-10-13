import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrchid } from './services/orchidApi';
import type { Orchid } from './types';

type DetailState =
  | { id: string; status: 'loaded'; orchid: Orchid }
  | { id: string; status: 'error'; error: string };

export default function OrchidDetail() {
  const { id } = useParams<{ id: string }>();
  const [detailState, setDetailState] = useState<DetailState | null>(null);
  const [imgError, setImgError] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    setImgError(false);

    if (!id || !/^\d+$/.test(id)) {
      return () => {
        active = false;
      };
    }

    getOrchid(id)
      .then((response) => {
        if (active) setDetailState({ id, status: 'loaded', orchid: response.data });
      })
      .catch((requestError: unknown) => {
        if (active) {
          setDetailState({
            id,
            status: 'error',
            error:
              requestError instanceof Error
                ? `Không thể tải chi tiết hoa lan #${id}. ${requestError.message}`
                : `Không thể tải chi tiết hoa lan #${id}.`,
          });
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  const invalidId = !id || !/^\d+$/.test(id);
  const currentState = detailState?.id === id ? detailState : null;
  const orchid = currentState?.status === 'loaded' ? currentState.orchid : null;

  return (
    <section className="detail-page-wrapper">
      <div className="detail-navigation">
        <Link className="back-link" to="/">
          ← Quay lại bộ sưu tập
        </Link>
        {orchid && (
          <Link to={`/orchids/${orchid.orchidId}/edit`} className="btn btn-sm btn-warning">
            ✏️ Chỉnh sửa hoa lan này
          </Link>
        )}
      </div>

      {invalidId ? (
        <div className="alert alert-danger" role="alert">
          Mã hoa lan không hợp lệ. Vui lòng kiểm tra lại đường dẫn.
        </div>
      ) : !currentState ? (
        <div className="detail-loading">
          <div className="spinner"></div>
          <p>Đang tải chi tiết hoa lan...</p>
        </div>
      ) : currentState.status === 'error' ? (
        <div className="alert alert-danger" role="alert">
          {currentState.error}
        </div>
      ) : orchid ? (
        <article className="detail-card">
          <div className="detail-image-box">
            <span className="detail-image-fallback" aria-hidden="true">
              🌸
            </span>
            {orchid.orchidURL && !imgError && (
              <img
                src={orchid.orchidURL}
                alt={orchid.orchidName}
                className="detail-img-element"
                onError={() => setImgError(true)}
              />
            )}
          </div>
          <div className="detail-content">
            <div className="detail-eyebrow">CHI TIẾT HOA LAN · #{orchid.orchidId}</div>
            <h1 className="detail-name">{orchid.orchidName}</h1>
            <p className="detail-category-badge">
              {orchid.orchidCategory ? `Họ / Phân loại: ${orchid.orchidCategory}` : 'Chưa phân loại'}
            </p>

            <div className="detail-badges">
              <span className={`badge-pill ${orchid.natural ? 'badge-pill-natural' : 'badge-pill-muted'}`}>
                {orchid.natural ? '🌱 Tự nhiên (Wild / Natural)' : '🧪 Nhân giống (Hybrid / Cultivar)'}
              </span>
              <span className={`badge-pill ${orchid.attractive ? 'badge-pill-attractive' : 'badge-pill-muted'}`}>
                {orchid.attractive ? '⭐ Đặc sắc / Nổi bật' : '⚪ Thông thường'}
              </span>
            </div>

            <div className="detail-section">
              <h3 className="section-title">Mô tả đặc điểm</h3>
              <p className="detail-desc-text">
                {orchid.orchidDescription || 'Chưa có thông tin mô tả chi tiết cho giống hoa lan này.'}
              </p>
            </div>

            {orchid.orchidURL && (
              <div className="detail-source-link">
                <a
                  className="image-source-link"
                  href={orchid.orchidURL}
                  target="_blank"
                  rel="noreferrer"
                >
                  🔗 Mở hình ảnh gốc kích thước lớn ↗
                </a>
              </div>
            )}
          </div>
        </article>
      ) : null}
    </section>
  );
}
