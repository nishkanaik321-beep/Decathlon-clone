import { Link } from 'react-router-dom';

import Stars from '../Stars/Stars.jsx';
import { inr, off, stat, fmtCount } from '../../hooks.js';
import './ProductCard.css';
import P001 from '../../images/P001.png';
import P002 from '../../images/P002.png';
import P003 from '../../images/P003.png';
import P004 from '../../images/P004.png';
import P005 from '../../images/P005.png';
import P006 from '../../images/P006.png';
import P007 from '../../images/P007.png';

const productImages = { P001, P002, P003, P004, P005, P006, P007 };

export default function ProductCard({ p, wished, onWish, onAdd }) {
  const stats = stat(p.id);

  return (
    <div className="card">
      <button
        className={'heart' + (wished ? ' on' : '')}
        onClick={() => onWish(p.id)}
        aria-label="Wishlist"
      >
        {wished ? '♥' : '♡'}
      </button>

      <Link to={'/product/' + p.id}>
        <img src={productImages[p.id]} alt={p.name} />
        <span className="brand">{p.brand}</span>
        <h3>{p.name}</h3>
      </Link>

      <div className="rating-line">
        <Stars value={stats.average} />
        <b>{stats.average.toFixed(1)}</b> | {fmtCount(stats.count)}
      </div>

      {p.price != null && (
        <div className="price-row">
          <b>{inr(p.price)}</b>
          <s>{inr(p.mrp)}</s>
          <span className="off">{off(p)}% off</span>
        </div>
      )}

      <button className="btn" onClick={() => onAdd(p.id, p.sizes[0])}>
        Add to cart
      </button>
    </div>
  );
}
