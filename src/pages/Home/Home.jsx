import { Link } from 'react-router-dom';

import { products, categories } from '../../data/products.js';
import ProductGrid from '../../components/ProductGrid/ProductGrid.jsx';
import { stat } from '../../hooks.js';
import './Home.css';

const capitalize = (text) => text[0].toUpperCase() + text.slice(1);

export default function Home(props) {
  const bestRated = [...products]
    .sort((a, b) => stat(b.id).average - stat(a.id).average)
    .slice(0, 4);

  return (
    <>
      <section className="hero">
        <div>
          <h1>Sport for all, at the best price</h1>
          <p>Running, hiking, football, swimming and more.</p>
          <Link className="btn" to="/c/running">
            Shop now
          </Link>
        </div>
      </section>

      <section className="cats">
        {categories.map((c) => (
          <Link key={c} to={'/c/' + c}>
            {capitalize(c)}
          </Link>
        ))}
      </section>

      <h2 className="pg-title">Popular right now</h2>
      <ProductGrid list={products} {...props} />

      <section className="promo">Easy returns · Free delivery above ₹999</section>

      <h2 className="pg-title">Best rated</h2>
      <ProductGrid list={bestRated} {...props} />
    </>
  );
}
