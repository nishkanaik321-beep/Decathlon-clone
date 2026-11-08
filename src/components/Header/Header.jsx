import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { categories } from '../../data/products.js';
import './Header.css';

const topLinks = ['Men', 'Women', 'Kids', 'All Sports'];
const capitalize = (text) => text[0].toUpperCase() + text.slice(1);

export default function Header({ cartCount, wishCount }) {
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/search?q=' + encodeURIComponent(query));
  };

  return (
    <header>
      <div className="topbar">
        Free delivery on orders above ₹999 · Deliver to: <b>Goa 403507</b>
      </div>

      <div className="head">
        <button
          className="burger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          ☰
        </button>

        <Link to="/" className="logo">
          DECATHLON
        </Link>

        <form className="search" onSubmit={handleSearch}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a sport, product or brand"
          />
          <button>Search</button>
        </form>

        <nav className="icons">
          <Link to="/wishlist">
            ♡ <sup>{wishCount}</sup>
          </Link>
          <Link to="/cart">
            🛒 <sup>{cartCount}</sup>
          </Link>
        </nav>
      </div>

      <ul
        className={'mainnav' + (menuOpen ? ' open' : '')}
        onClick={() => setMenuOpen(false)}
      >
        {topLinks.map((label) => (
          <li key={label}>
            <Link to="/search?q=">{label}</Link>
          </li>
        ))}

        {categories.map((c) => (
          <li key={c}>
            <Link to={'/c/' + c}>{capitalize(c)}</Link>
          </li>
        ))}
      </ul>
    </header>
  );
}
