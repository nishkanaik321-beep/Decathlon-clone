import { useState, useMemo } from 'react';

import Stars from '../Stars/Stars.jsx';
import { fmtCount } from '../../hooks.js';
import './ReviewSection.css';

const RATING_LABEL = {
  5: 'Excellent',
  4: 'Good',
  3: 'Average',
  2: 'Bad',
  1: 'Very bad',
};

const SORTS = {
  relevant: null, // keep the order the reviews came in
  newest: (a, b) => new Date(b.date) - new Date(a.date),
  high: (a, b) => b.rating - a.rating,
  low: (a, b) => a.rating - b.rating,
};

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';

export default function ReviewSection({ reviews, stats }) {
  const [star, setStar] = useState(0);
  const [sort, setSort] = useState('relevant');
  const [limit, setLimit] = useState(10);

  const shown = useMemo(() => {
    const filtered = reviews.filter((r) => !star || r.rating === star);
    const compare = SORTS[sort];
    return compare ? [...filtered].sort(compare) : filtered;
  }, [reviews, star, sort]);

  const toggleStar = (n) => {
    setStar(star === n ? 0 : n);
    setLimit(10);
  };

  return (
    <section className="reviews" id="reviews">
      <h2>Customer reviews</h2>

      <div className="rv-layout">
        {/* Left: summary */}
        <aside className="rv-summary">
          <div className="rv-avg">
            <b>{stats.average.toFixed(1)}</b>
            <span>/5</span>
          </div>
          <Stars value={stats.average} size="22px" />
          <p className="rv-count">{fmtCount(stats.count)} reviews</p>
          <p className="rv-rec">
            {stats.recommendedPct}% of customers recommend this product
          </p>

          <div className="rv-dist">
            {[5, 4, 3, 2, 1].map((n) => (
              <button
                key={n}
                className={'rv-bar' + (star === n ? ' on' : '')}
                onClick={() => toggleStar(n)}
              >
                <span>{n} ★</span>
                <i>
                  <em
                    style={{
                      width: (stats.distribution[n] / stats.count) * 100 + '%',
                    }}
                  />
                </i>
                <span>{fmtCount(stats.distribution[n])}</span>
              </button>
            ))}
          </div>

          {stats.attributes.length > 0 && (
            <div className="rv-attrs">
              <h4>Rated by customers</h4>
              {stats.attributes.map((a) => (
                <div key={a.label} className="rv-attr">
                  <span>{a.label}</span>
                  <i>
                    <em style={{ width: (a.value / 5) * 100 + '%' }} />
                  </i>
                  <b>{a.value.toFixed(1)}</b>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Right: review list */}
        <div className="rv-list">
          <div className="rv-tools">
            <span>
              {shown.length} reviews{star ? ` with ${star} stars` : ''}
            </span>

            <label>
              Sort by{' '}
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="relevant">Most Relevant</option>
                <option value="newest">Newest First</option>
                <option value="high">Highest Rating</option>
                <option value="low">Lowest Rating</option>
              </select>
            </label>

            {star > 0 && (
              <button className="chip" onClick={() => setStar(0)}>
                {star} ★ ✕
              </button>
            )}
          </div>

          {shown.length === 0 && <p>No reviews with this rating.</p>}

          {shown.slice(0, limit).map((r) => (
            <article key={r.review_id} className="rv-card">
              <div className="rv-head">
                <Stars value={r.rating} />
                <small>{formatDate(r.date)}</small>
              </div>

              <h4>{r.review_title}</h4>
              <p>{String(r.review_text)}</p>
            </article>
          ))}

          {shown.length > limit && (
            <button className="btn ghost" onClick={() => setLimit(limit + 10)}>
              Show more reviews
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
