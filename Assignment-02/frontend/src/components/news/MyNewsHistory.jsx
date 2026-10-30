import { useState, useEffect, useMemo } from 'react';
import { newsService } from '../../services/newsService';
import { getApiErrorMessage } from '../../services/api';
import { IconSearch, IconNews, IconRefresh } from '../common/Icons';
import Modal from '../common/Modal';

export default function MyNewsHistory({ currentUser }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewArticle, setViewArticle] = useState(null);

  useEffect(() => {
    let isMounted = true;
    newsService.getMyHistory()
      .then((data) => {
        if (isMounted) {
          setHistory(data || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(getApiErrorMessage(err, 'Failed to fetch news history'));
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await newsService.getMyHistory();
      setHistory(data || []);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to fetch news history'));
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const term = searchTerm.trim().toLowerCase();
      if (!term) return true;
      return (
        (item.title && item.title.toLowerCase().includes(term)) ||
        (item.headline && item.headline.toLowerCase().includes(term)) ||
        (item.categoryName && item.categoryName.toLowerCase().includes(term)) ||
        (item.tagsString && item.tagsString.toLowerCase().includes(term))
      );
    });
  }, [history, searchTerm]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My News History</h1>
          <p className="page-subtitle">
            Review all articles published or authored by {currentUser?.fullName || currentUser?.username || 'you'}.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleRefresh}
          disabled={loading}
        >
          <IconRefresh size={16} />
          <span>Refresh History</span>
        </button>
      </div>

      {error && (
        <div className="auth-alert-error" style={{ marginBottom: '1.25rem' }}>
          <span>{error}</span>
        </div>
      )}

      <div className="toolbar-container">
        <div className="toolbar-filters">
          <div className="search-input-wrap">
            <span className="search-icon">
              <IconSearch size={16} />
            </span>
            <input
              type="text"
              className="search-input"
              placeholder="Search your published history by title, category, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="table-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--slate-500)' }}>
            Loading your authored news history...
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <IconNews size={32} />
            </div>
            <h3 className="empty-state-title">No News Articles Found</h3>
            <p className="empty-state-desc">
              {searchTerm
                ? 'No authored articles match your search filter.'
                : 'You have not authored any news articles yet.'}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title & Headline</th>
                  <th>Category</th>
                  <th>Tags</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item) => (
                  <tr key={item.id || item.newsArticleID}>
                    <td>#{item.id || item.newsArticleID}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>
                        {item.title || item.newsTitle}
                      </div>
                      {item.headline && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '0.2rem' }}>
                          {item.headline.length > 80 ? `${item.headline.slice(0, 80)}...` : item.headline}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-primary">
                        {item.categoryName || 'General'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                        {item.tagsString ? (
                          item.tagsString.split(',').map((t, i) => (
                            <span key={i} className="badge badge-tag">
                              {t.trim()}
                            </span>
                          ))
                        ) : (
                          <span style={{ color: 'var(--slate-400)', fontSize: '0.8rem' }}>None</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${item.status === 1 ? 'badge-active' : 'badge-inactive'}`}>
                        {item.status === 1 ? 'Active (Published)' : 'Inactive (Draft)'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                      {item.createdAt || item.createdDate?.slice(0, 10)}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setViewArticle(item)}
                      >
                        View Article
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {viewArticle && (
        <Modal
          isOpen={Boolean(viewArticle)}
          onClose={() => setViewArticle(null)}
          title={viewArticle.title || viewArticle.newsTitle}
          maxWidth="700px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="badge badge-primary">{viewArticle.categoryName}</span>
              <span className={`badge ${viewArticle.status === 1 ? 'badge-active' : 'badge-inactive'}`}>
                {viewArticle.status === 1 ? 'Active' : 'Draft'}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                Created: {viewArticle.createdAt || viewArticle.createdDate?.slice(0, 10)}
              </span>
            </div>

            {viewArticle.headline && (
              <div style={{ fontStyle: 'italic', color: 'var(--slate-600)', background: 'var(--slate-50)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                {viewArticle.headline}
              </div>
            )}

            <div style={{ whiteSpace: 'pre-line', lineHeight: 1.6, color: 'var(--slate-800)' }}>
              {viewArticle.content || viewArticle.newsContent}
            </div>

            {viewArticle.tagsString && (
              <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                <strong>Tags:</strong> {viewArticle.tagsString}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
