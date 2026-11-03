import { Routes, Route, Link } from 'react-router-dom';
import StoreLayout from './layouts/StoreLayout';
import Catalog from './pages/Catalog';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

export default function App() {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route index element={<Catalog />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route
          path="*"
          element={
            <div className="container page-section">
              <h1>Page not found</h1>
              <Link className="button button-primary" to="/">
                Back to collection
              </Link>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}
