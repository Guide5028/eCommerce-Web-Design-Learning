import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../data/ProductsContext.jsx';
import { useStore } from '../store/StoreContext.jsx';
import { formatRp } from '../utils/format.js';
import CartTable from '../components/cart/CartTable.jsx';
import FeaturesBar from '../components/layout/FeaturesBar.jsx';
import PageHero from '../components/layout/PageHero.jsx';
import styles from './CartPage.module.css';

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
      <PageHero title="Cart" />

      <section className={styles.cartSection}>
        {lines.length > 0 ? (
          <>
            <CartTable lines={lines} onQtyChange={setCartQty} onRemove={removeFromCart} />

            <aside className={styles.cartTotals}>
              <h2>Cart Totals</h2>
              <div className={styles.cartTotalsRow}>
                <span>Subtotal</span>
                <span className={styles.cartTotalsValue}>{formatRp(subtotal)}</span>
              </div>
              <div className={`${styles.cartTotalsRow} ${styles.cartTotalsRowTotal}`}>
                <span>Total</span>
                <span className={styles.cartTotalsValue}>{formatRp(subtotal)}</span>
              </div>
              <Link to="/checkout" className={styles.btnCheckout}>Check Out</Link>
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
