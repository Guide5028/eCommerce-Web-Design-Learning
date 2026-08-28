import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../data/ProductsContext.jsx';
import { useStore } from '../store/StoreContext.jsx';
import { formatRp } from '../utils/format.js';
import CartTable from '../components/cart/CartTable.jsx';
import FeaturesBar from '../components/layout/FeaturesBar.jsx';

// Ported from legacy/js/app.js:953-1038 (cart page)

export default function CartPage() {
  const { products } = useProducts();
  const { cart, setCartQty, removeFromCart } = useStore();

  const lines = useMemo(() => {
    return cart
      .map((item) => {
        const product = products.find((p) => p.id === item.id);
        return product ? { product, qty: item.qty } : null;
      })
      .filter(Boolean);
  }, [cart, products]);

  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.qty, 0);

  return (
    <main>
      <section className="page-hero">
        <div className="page-hero-content">
          <img src="/images/logo-furniro.svg" alt="" className="page-hero-icon" />
          <h1>Cart</h1>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">&rsaquo;</span>
            <span aria-current="page">Cart</span>
          </nav>
        </div>
      </section>

      <section className="cart-section">
        {lines.length > 0 ? (
          <>
            <CartTable lines={lines} onQtyChange={setCartQty} onRemove={removeFromCart} />

            <aside className="cart-totals">
              <h2>Cart Totals</h2>
              <div className="cart-totals-row">
                <span>Subtotal</span>
                <span className="cart-totals-value">{formatRp(subtotal)}</span>
              </div>
              <div className="cart-totals-row cart-totals-row--total">
                <span>Total</span>
                <span className="cart-totals-value">{formatRp(subtotal)}</span>
              </div>
              <Link to="/checkout" className="btn-checkout">Check Out</Link>
            </aside>
          </>
        ) : (
          <p className="favorite-empty">
            Your cart is empty. Add something you like from the <Link to="/shop">shop</Link>.
          </p>
        )}
      </section>

      <FeaturesBar />
    </main>
  );
}
