import { Link } from 'react-router-dom';

import { products } from '../../data/products.js';
import { inr } from '../../hooks.js';
import './Cart.css';

export default function Cart({ cart, setCart }) {
  const rows = cart.map((item) => ({
    ...item,
    product: products.find((p) => p.id === item.id),
  }));

  const total = rows.reduce(
    (sum, row) => sum + (row.product.price ?? 0) * row.qty,
    0
  );

  // Change a quantity; items that reach 0 are removed.
  const changeQty = (index, delta) => {
    setCart((items) =>
      items
        .map((x, i) => (i === index ? { ...x, qty: x.qty + delta } : x))
        .filter((x) => x.qty > 0)
    );
  };

  return (
    <div className="pg cart">
      <h1>Cart</h1>

      {rows.length === 0 && (
        <p>
          Your cart is empty. <Link to="/">Start shopping</Link>
        </p>
      )}

      {rows.map((row, index) => (
        <div key={index} className="crow">
          <span>
            {row.product.emoji} {row.product.name} ({row.size})
          </span>

          <span>
            <button onClick={() => changeQty(index, -1)}>−</button> {row.qty}{' '}
            <button onClick={() => changeQty(index, 1)}>+</button>
          </span>

          <b>
            {inr(row.product.price == null ? null : row.product.price * row.qty)}
          </b>
        </div>
      ))}

      {rows.length > 0 && <h3>Total: {inr(total)}</h3>}
    </div>
  );
}
