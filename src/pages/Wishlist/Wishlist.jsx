import { products } from '../../data/products.js';
import ProductGrid from '../../components/ProductGrid/ProductGrid.jsx';
import './Wishlist.css';

export default function Wishlist(props) {
  const list = products.filter((p) => props.wish.includes(p.id));

  return (
    <>
      <h1 className="pg-title">Wishlist</h1>

      {list.length ? (
        <ProductGrid list={list} {...props} />
      ) : (
        <p className="pg">Nothing saved yet.</p>
      )}
    </>
  );
}
