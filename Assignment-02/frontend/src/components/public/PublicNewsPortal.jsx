import { useState, useEffect, useMemo } from 'react';
import { newsService } from '../../services/newsService';
import { categoryService } from '../../services/categoryService';
import { IconSearch, IconNews } from '../common/Icons';
import Modal from '../common/Modal';

export default function PublicNewsPortal({ onGoToLogin }) {
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeArticle, setActiveArticle] = useState(null);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      newsService.getPublicNews(),
      categoryService.getActiveCategories()
    ])
      .then(([newsData, catsData]) => {
        if (isMounted) {
          setNews(newsData || []);
          setCategories(catsData || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load public news:', err);
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, []);

  // Filter news articles
  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      const term = searchTerm.trim().toLowerCase();
      const matchSearch =
        !term ||
        (item.title && item.title.toLowerCase().includes(term)) ||
        (item.headline && item.headline.toLowerCase().includes(term)) ||
        (item.content && item.content.toLowerCase().includes(term)) ||
        (item.tagsString && item.tagsString.toLowerCase().includes(term));

      const matchCategory =
        selectedCategory === 'ALL' ||
        Number(item.categoryId || item.categoryID) === Number(selectedCategory);

      return matchSearch && matchCategory;
    });
  }, [news, searchTerm, selectedCategory]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--slate-50)', display: 'flex', flexDirection: 'column' }}>
      {/* Public Header */}
      <header
        style={{
          background: '#ffffff',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img
            src="/fu_news_logo.jpg"
            alt="FUNews Portal Logo"
            style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover' }}
          />
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-600)', margin: 0 }}>
              FUNews Portal
            </h1>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 500 }}>
              FPT University News & Campus Publications
            </span>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={onGoToLogin}
          style={{ padding: '0.55rem 1.25rem', fontSize: '0.875rem' }}
        >
          Staff & Admin Sign In →
        </button>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '2rem 1.5rem', flex: 1 }}>
        {/* Hero Section */}
        <div
          style={{
            background: 'linear-gradient(135deg, var(--primary-700), var(--primary-900))',
            color: '#ffffff',
            padding: '2.5rem 2rem',
            borderRadius: 'var(--radius-xl)',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.15)', padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem' }}>
            Open Public News Access
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Campus Bulletins, Tech Updates & Highlights
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', maxWidth: '700px', fontSize: '1rem', lineHeight: 1.6 }}>
            Browse active announcements, technical research papers, and varsity news published by FPT University editorial staff.
          </p>
        </div>

        {/* Toolbar: Realtime Search & Category Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          <div className="search-input-wrap" style={{ maxWidth: '600px' }}>
            <span className="search-icon">
              <IconSearch size={16} />
            </span>
            <input
              type="text"
              className="search-input"
              placeholder="Search news by title, content, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              className={`btn btn-sm ${selectedCategory === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedCategory('ALL')}
            >
              All Categories ({news.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id || cat.categoryID}
                type="button"
                className={`btn btn-sm ${selectedCategory === (cat.id || cat.categoryID) ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedCategory(cat.id || cat.categoryID)}
              >
                {cat.name || cat.categoryName}
              </button>
            ))}
          </div>
        </div>

        {/* News Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--slate-500)' }}>
            Loading active news articles...
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="empty-state" style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '3rem 2rem' }}>
            <div className="empty-state-icon">
              <IconNews size={32} />
            </div>
            <h3 className="empty-state-title">No Active News Found</h3>
            <p className="empty-state-desc">
              {searchTerm || selectedCategory !== 'ALL'
                ? 'Try adjusting your search keywords or selecting another category filter.'
                : 'There are currently no active news articles published in the system.'}
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {filteredNews.map((item) => (
              <div
                key={item.id || item.newsArticleID}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveArticle(item)}
              >
                <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span className="badge badge-active">
                      {item.categoryName || 'General News'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                      {item.createdAt || item.createdDate?.slice(0, 10)}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: 'var(--slate-900)',
                      marginBottom: '0.5rem',
                      lineHeight: 1.4
                    }}
                  >
                    {item.title || item.newsTitle}
                  </h3>

                  {item.headline && (
                    <p
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--slate-600)',
                        marginBottom: '1rem',
                        lineHeight: 1.5,
                        flex: 1
                      }}
                    >
                      {item.headline}
                    </p>
                  )}

                  {item.tagsString && (
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: 'auto', paddingTop: '0.75rem' }}>
                      {item.tagsString.split(',').map((tag, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.7rem',
                            background: 'var(--slate-100)',
                            color: 'var(--slate-700)',
                            padding: '0.2rem 0.5rem',
                            borderRadius: 'var(--radius-sm)'
                          }}
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div
                  className="card-footer"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid var(--border-subtle)',
                    padding: '0.85rem 1.25rem'
                  }}
                >
                  <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                    By {item.createdBy || item.createdByName || 'Editorial Staff'}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-600)' }}>
                    Read Full Story →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          background: '#ffffff',
          borderTop: '1px solid var(--border-subtle)',
          padding: '1.5rem 2rem',
          textAlign: 'center',
          color: 'var(--slate-500)',
          fontSize: '0.85rem'
        }}
      >
        FUNewsManagementSystem · Assignment 02 · Built with Spring Boot 3 & ReactJS
      </footer>

      {/* Article Detail Modal */}
      {activeArticle && (
        <Modal
          isOpen={Boolean(activeArticle)}
          onClose={() => setActiveArticle(null)}
          title={activeArticle.title || activeArticle.newsTitle}
          maxWidth="750px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="badge badge-active">{activeArticle.categoryName}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                Published on {activeArticle.createdAt || activeArticle.createdDate?.slice(0, 10)}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                · Author: <strong>{activeArticle.createdBy || activeArticle.createdByName || 'Staff'}</strong>
              </span>
              {activeArticle.newsSource && (
                <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
                  · Source: <em>{activeArticle.newsSource}</em>
                </span>
              )}
            </div>

            {activeArticle.headline && (
              <div
                style={{
                  background: 'var(--slate-50)',
                  borderLeft: '4px solid var(--primary-600)',
                  padding: '0.85rem 1rem',
                  fontSize: '0.95rem',
                  fontStyle: 'italic',
                  color: 'var(--slate-700)'
                }}
              >
                {activeArticle.headline}
              </div>
            )}

            <div
              style={{
                fontSize: '0.95rem',
                lineHeight: 1.7,
                color: 'var(--slate-800)',
                whiteSpace: 'pre-line'
              }}
            >
              {activeArticle.content || activeArticle.newsContent}
            </div>

            {activeArticle.tagsString && (
              <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: 600 }}>TAGS:</span>
                {activeArticle.tagsString.split(',').map((tag, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.75rem',
                      background: 'var(--primary-50)',
                      color: 'var(--primary-700)',
                      padding: '0.25rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 500
                    }}
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
