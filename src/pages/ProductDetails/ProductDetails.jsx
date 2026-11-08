import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import { products } from '../../data/products.js';
import { reviews } from '../../data/reviews.js';
import ReviewSection from '../../components/ReviewSection/ReviewSection.jsx';
import Stars from '../../components/Stars/Stars.jsx';
import { inr, off, stat, fmtCount } from '../../hooks.js';
import './ProductDetails.css';
import P001 from '../../images/P001.png';
import P002 from '../../images/P002.png';
import P003 from '../../images/P003.png';
import P004 from '../../images/P004.png';
import P005 from '../../images/P005.png';
import P006 from '../../images/P006.png';
import P007 from '../../images/P007.png';

const productImages = { P001, P002, P003, P004, P005, P006, P007 };

export default function ProductDetails({ wish, onWish, onAdd }) {
  const { id } = useParams();
  const [size, setSize] = useState(null);
  const [image, setImage] = useState(0);

  const product = products.find((p) => p.id === id);
  if (!product) return <p className="pg">Product not found.</p>;

  const stats = stat(id);
  const productReviews = reviews.filter((r) => r.product_id === id);
  const categoryName =
    product.category[0].toUpperCase() + product.category.slice(1);

  return (
    <>
      <div className="crumbs">
        <Link to="/">Home</Link> /{' '}
        <Link to={'/c/' + product.category}>{categoryName}</Link>
      </div>

      <div className="pd">
        {/* Gallery */}
        <div className="pd-gallery">
          <div className="pd-main" style={{ background: product.tint }}>
            <img src={productImages[product.id]} alt={product.name} />
          </div>

          <div className="pd-thumbs">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                className={image === i ? 'on' : ''}
                style={{ background: product.tint }}
                onClick={() => setImage(i)}
              >
                <img src={productImages[product.id]} alt="" />
              </button>
            ))}
          </div>
        </div>

        {/* Product info */}
        <div className="pd-info">
          <span className="brand">{product.brand}</span>
          <h1>{product.name}</h1>

          <a href="#reviews" className="rating-line pd-rating">
            <Stars value={stats.average} size="18px" />
            <b>{stats.average.toFixed(1)}</b> | {fmtCount(stats.count)} reviews
          </a>

          {product.price != null ? (
            <div className="price-row pd-price">
              <b>{inr(product.price)}</b>
              <span className="mrp">
                MRP <s>{inr(product.mrp)}</s>
              </span>
              <span className="off">{off(product)}% off</span>
            </div>
          ) : (
            <p className="pd-noprice">Check decathlon.in for the latest price.</p>
          )}
          <small className="tax">Inclusive of all taxes</small>

          <p className="pd-desc">{product.description}</p>

          <h4>Size</h4>
          <div className="pd-sizes">
            {product.sizes.map((s) => (
              <button
                key={s}
                className={'chip' + (size === s ? ' on' : '')}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="pd-actions">
            <button
              className="btn"
              onClick={() => onAdd(product.id, size || product.sizes[0])}
            >
              Add to cart
            </button>
            <button className="btn ghost" onClick={() => onWish(product.id)}>
              {wish.includes(product.id) ? '♥ Wishlisted' : '♡ Wishlist'}
            </button>
          </div>

          <p className="ok">In stock · Delivery in 3–5 days · Easy returns</p>

          <h4>Specifications</h4>
          <table className="pd-specs">
            <tbody>
              {Object.entries(product.specs).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ReviewSection reviews={productReviews} stats={stats} />
    </>
  );
}
