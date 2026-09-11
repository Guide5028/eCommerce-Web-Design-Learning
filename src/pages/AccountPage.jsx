import { useEffect, useState } from 'react';
import { Empty, Spin, Tag } from 'antd';
import { useAuth } from '../context/AuthContext.jsx';
import { saleService } from '../services/saleService.js';
import { formatRp } from '../utils/format.js';
import FeaturesBar from '../components/FeaturesBar.jsx';
import PageHero from '../components/PageHero.jsx';
import styles from '../styles/pages/AccountPage.module.css';

const PAYMENT_LABELS = { cash: 'Cash', card: 'Card', 'e-wallet': 'E-Wallet' };

// Customer-only (see RequireCustomer.jsx). Profile info + order history, backed by
// GET /customers/profile (already loaded into AuthContext) and GET /sales/mine.
export default function AccountPage() {
  const { profile } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    saleService
      .getMySales()
      .then(setOrders)
      .catch(() => {
        // interceptor already toasted it
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <PageHero title="My Account" />

      <section className={styles.accountSection}>
        <div className={styles.profileCard}>
          <h2>{profile?.name}</h2>
          <dl className={styles.profileDetails}>
            <div>
              <dt>Email</dt>
              <dd>{profile?.email}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{profile?.phone || '—'}</dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>{profile?.address || '—'}</dd>
            </div>
            <div>
              <dt>Loyalty points</dt>
              <dd>{profile?.pointBalance ?? 0} pts</dd>
            </div>
          </dl>
        </div>

        <div className={styles.ordersCard}>
          <h2>Order History</h2>

          {loading ? (
            <Spin />
          ) : orders.length === 0 ? (
            <Empty description="No orders yet -- your purchases will show up here." />
          ) : (
            orders.map((order) => (
              <article key={order.saleId} className={styles.order}>
                <div className={styles.orderHeader}>
                  <div>
                    <span className={styles.orderId}>Order #{order.saleId}</span>
                    <span className={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <Tag>{PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}</Tag>
                </div>

                <ul className={styles.orderItems}>
                  {order.items.map((item) => (
                    <li key={`${order.saleId}-${item.productId}`} className={styles.orderItem}>
                      {item.imageUrl && <img src={item.imageUrl} alt={item.productName} />}
                      <span className={styles.orderItemName}>
                        {item.productName} × {item.quantity}
                      </span>
                      <span className={styles.orderItemPrice}>
                        {formatRp(item.unitPrice * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className={styles.orderTotal}>
                  <span>Total</span>
                  <span>{formatRp(order.totalAmount)}</span>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <FeaturesBar />
    </main>
  );
}
