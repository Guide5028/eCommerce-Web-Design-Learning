import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Flex } from 'antd';
import { useProducts } from '../context/ProductsContext.jsx';
import { useStore } from '../context/StoreContext.jsx';
import { formatRp } from '../utils/format.js';
import CartTable from '../components/CartTable.jsx';
import FeaturesBar from '../components/FeaturesBar.jsx';
import PageHero from '../components/PageHero.jsx';
import styles from '../styles/pages/CartPage.module.css';

// Cart page: line items, quantity editing, and subtotal.

export default function CartPage() {
  const { products } = useProducts();
  const { cart, setCartQty, removeFromCart } = useStore();

  const lines = useMemo(() => {
    return cart
      .map((item) => {
        const product = products.find((p) => (p.productId ?? p.id) === item.id);
        return product ? { product, qty: item.qty } : null;
      })
      .filter(Boolean);
  }, [cart, products]);

  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.qty, 0);

  return (
    <main>
      <PageHero title="Cart" />

      <Flex align="flex-start" component="section" className={styles.cartSection}>
        {lines.length > 0 ? (
          <>
            <CartTable lines={lines} onQtyChange={setCartQty} onRemove={removeFromCart} />

            <aside className={styles.cartTotals}>
              <h2>Cart Totals</h2>
              <Flex align="center" justify="space-between" className={styles.cartTotalsRow}>
                <span>Subtotal</span>
                <span className={styles.cartTotalsValue}>{formatRp(subtotal)}</span>
              </Flex>
              <Flex align="center" justify="space-between" className={`${styles.cartTotalsRow} ${styles.cartTotalsRowTotal}`}>
                <span>Total</span>
                <span className={styles.cartTotalsValue}>{formatRp(subtotal)}</span>
              </Flex>
              <Link to="/checkout" className={styles.btnCheckout}>Check Out</Link>
            </aside>
          </>
        ) : (
          <p className="favorite-empty">
            Your cart is empty. Add something you like from the <Link to="/shop">shop</Link>.
          </p>
        )}
      </Flex>

      <FeaturesBar />
    </main>
  );
}
