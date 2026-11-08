import { Routes, Route } from 'react-router-dom';

import { useStored } from './hooks.js';
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import Home from './pages/Home/Home.jsx';
import CategoryPage from './pages/CategoryPage/CategoryPage.jsx';
import ProductDetails from './pages/ProductDetails/ProductDetails.jsx';
import Cart from './pages/Cart/Cart.jsx';
import Wishlist from './pages/Wishlist/Wishlist.jsx';

export default function App() {
  const [cart, setCart] = useStored('cart', []);
  const [wish, setWish] = useStored('wish', []);

  const addToCart = (id, size) => {
    setCart((items) => {
      const exists = items.some((x) => x.id === id && x.size === size);

      if (exists) {
        return items.map((x) =>
          x.id === id && x.size === size ? { ...x, qty: x.qty + 1 } : x
        );
      }
      return [...items, { id, size, qty: 1 }];
    });
  };

  const toggleWish = (id) => {
    setWish((list) =>
      list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
    );
  };

  const cartCount = cart.reduce((total, x) => total + x.qty, 0);
  const shared = { wish, onWish: toggleWish, onAdd: addToCart };

  return (
    <>
      <Header cartCount={cartCount} wishCount={wish.length} />

      <main>
        <Routes>
          <Route path="/" element={<Home {...shared} />} />
          <Route path="/c/:cat" element={<CategoryPage {...shared} />} />
          <Route path="/search" element={<CategoryPage {...shared} />} />
          <Route path="/product/:id" element={<ProductDetails {...shared} />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
          <Route path="/wishlist" element={<Wishlist {...shared} />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}
