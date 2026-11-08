import ProductCard from '../ProductCard/ProductCard.jsx';
import './ProductGrid.css';

export default function ProductGrid({ list, wish, onWish, onAdd, flush }) {
  return (
    <div className={'grid' + (flush ? ' flush' : '')}>
      {list.map((p) => (
        <ProductCard
          key={p.id}
          p={p}
          wished={wish.includes(p.id)}
          onWish={onWish}
          onAdd={onAdd}
        />
      ))}
    </div>
  );
}
