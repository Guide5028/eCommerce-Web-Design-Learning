import { Link } from 'react-router-dom';
import { Button, ConfigProvider } from 'antd';
import { formatRp } from '../utils/format.js';
import { COLOR_TEXT } from '../theme.js';
import PaymentMethods from './PaymentMethods.jsx';
import styles from '../styles/components/OrderSummary.module.css';

// Checkout's order summary panel: line items, totals, payment method, and place-order button.
const placeOrderButtonTheme = {
  components: {
    Button: {
      defaultGhostColor: COLOR_TEXT,
      defaultGhostBorderColor: COLOR_TEXT,
      borderRadius: 10,
      controlHeight: 58,
      contentFontSize: 16,
      paddingInline: 16,
    },
  },
};

export default function OrderSummary({ lines, paymentMethod, onPaymentMethodChange }) {
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.qty, 0);
  const hasItems = lines.length > 0;

  return (
    <aside className={styles.orderSummary}>
      <div className={styles.orderSummaryHeader}>
        <span>Product</span>
        <span>Subtotal</span>
      </div>

      {hasItems ? (
        <div>
          {lines.map((line) => (
            <div className={styles.orderSummaryRow} key={line.product.productId ?? line.product.id}>
              <span className={styles.orderSummaryItem}>
                {line.product.name} <span className={styles.orderSummaryQty}>x {line.qty}</span>
              </span>
              <span>{formatRp(line.product.price * line.qty)}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="favorite-empty">
          Your cart is empty. Add something from the <Link to="/shop">shop</Link> before checking out.
        </p>
      )}

      <div className={styles.orderSummaryRow}>
        <span>Subtotal</span>
        <span>{formatRp(subtotal)}</span>
      </div>

      <div className={`${styles.orderSummaryRow} ${styles.orderSummaryRowTotal}`}>
        <span>Total</span>
        <span>{formatRp(subtotal)}</span>
      </div>

      <PaymentMethods value={paymentMethod} onChange={onPaymentMethodChange} />

      <p className={styles.paymentDisclaimer}>
        Your personal data will be used to support your experience throughout this website, to manage access to
        your account, and for other purposes described in our{' '}
        <a href="#top" onClick={(e) => e.preventDefault()}>privacy policy.</a>
      </p>

      <ConfigProvider theme={placeOrderButtonTheme}>
        <Button ghost block className={styles.btnPlaceOrder} disabled={!hasItems}>
          Place order
        </Button>
      </ConfigProvider>
    </aside>
  );
}
