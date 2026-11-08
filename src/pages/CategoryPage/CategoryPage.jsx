import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { products } from '../../data/products.js';
import ProductGrid from '../../components/ProductGrid/ProductGrid.jsx';
import { inr, stat } from '../../hooks.js';
import './CategoryPage.css';

const price = (p) => p.price ?? 0;

const SORTS = {
  pop: () => 0,
  low: (a, b) => price(a) - price(b),
  high: (a, b) => price(b) - price(a),
  rate: (a, b) => stat(b.id).average - stat(a.id).average,
};

export default function CategoryPage(props) {
  const { cat } = useParams();
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('q') || '').toLowerCase();

  const [sort, setSort] = useState('pop');
  const [maxPrice, setMaxPrice] = useState(3000);
  const [brands, setBrands] = useState([]);
  const [minRating, setMinRating] = useState(0);

  const allBrands = [...new Set(products.map((p) => p.brand))];

  const list = useMemo(() => {
    return products
      .filter((p) => {
        const text = (p.name + p.brand + p.category).toLowerCase();

        return (
          (!cat || p.category === cat) &&
          (!query || text.includes(query)) &&
          price(p) <= maxPrice &&
          (!brands.length || brands.includes(p.brand)) &&
          stat(p.id).average >= minRating
        );
      })
      .sort(SORTS[sort]);
  }, [cat, query, sort, maxPrice, brands, minRating]);

  const toggleBrand = (brand) => {
    setBrands((current) =>
      current.includes(brand)
        ? current.filter((b) => b !== brand)
        : [...current, brand]
    );
  };

  const title = cat ? cat[0].toUpperCase() + cat.slice(1) : 'Search results';

  return (
    <div className="listing">
      <aside className="side">
        <h4>Price up to {inr(maxPrice)}</h4>
        <input
          type="range"
          min="200"
          max="3000"
          step="100"
          value={maxPrice}
          onChange={(e) => setMaxPrice(+e.target.value)}
        />

        <h4>Brand</h4>
        {allBrands.map((b) => (
          <label key={b}>
            <input
              type="checkbox"
              checked={brands.includes(b)}
              onChange={() => toggleBrand(b)}
            />{' '}
            {b}
          </label>
        ))}

        <h4>Rating</h4>
        {[0, 4, 4.5].map((n) => (
          <label key={n}>
            <input
              type="radio"
              name="rating"
              checked={minRating === n}
              onChange={() => setMinRating(n)}
            />{' '}
            {n ? n + '★ & up' : 'All'}
          </label>
        ))}
      </aside>

      <div>
        <div className="sortbar">
          <span>
            <b>{title}</b> ({list.length})
          </span>

          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="pop">Popularity</option>
            <option value="low">Price: low to high</option>
            <option value="high">Price: high to low</option>
            <option value="rate">Rating</option>
          </select>
        </div>

        {list.length ? (
          <ProductGrid list={list} flush {...props} />
        ) : (
          <p>No products match. Try clearing a filter.</p>
        )}
      </div>
    </div>
  );
}
