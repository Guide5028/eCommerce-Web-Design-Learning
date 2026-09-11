import { Link } from 'react-router-dom';
import { Button, ConfigProvider, Tag } from 'antd';
import { formatRp } from '../utils/format.js';
import { COLOR_TEXT } from '../theme.js';
import PaymentMethods from './PaymentMethods.jsx';
import styles from '../styles/components/OrderSummary.module.css';

function promoLabel(promotion) {
  return promotion.discountType === 'percentage'
    ? `-${Number(promotion.discountValue)}%`
    : `-${formatRp(promotion.discountValue)}`;
}

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

export default function OrderSummary({ lines, paymentMethod, onPaymentMethodChange, onPlaceOrder, placingOrder }) {
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.qty, 0);
  const totalDiscount = lines.reduce((sum, line) => sum + (line.discount || 0), 0);
  const total = subtotal - totalDiscount;
  const hasItems = lines.length > 0;

  return (
    <aside className={styles.orderSummary}>
      <div className={styles.orderSummaryHeader}>
        <span>Product</span>
        <span>Subtotal</span>
      </div>

      {hasItems ? (
        <div>
          {lines.map((line) => {
            const lineSubtotal = line.product.price * line.qty;
            const hasDiscount = line.discount > 0;
            return (
              <div className={styles.orderSummaryRow} key={line.product.productId ?? line.product.id}>
                <span className={styles.orderSummaryItem}>
                  {line.product.name} <span className={styles.orderSummaryQty}>x {line.qty}</span>
                  {line.promotion && (
                    <Tag color="gold" style={{ marginLeft: 8 }}>
                      {promoLabel(line.promotion)}
                    </Tag>
                  )}
                </span>
                {hasDiscount ? (
                  <span>
                    <span className={styles.orderSummaryStrike}>{formatRp(lineSubtotal)}</span>{' '}
                    {formatRp(lineSubtotal - line.discount)}
                  </span>
                ) : (
                  <span>{formatRp(lineSubtotal)}</span>
                )}
              </div>
            );
          })}
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

      {totalDiscount > 0 && (
        <div className={styles.orderSummaryRow}>
          <span>Discount</span>
          <span className={styles.orderSummaryDiscount}>-{formatRp(totalDiscount)}</span>
        </div>
      )}

      <div className={`${styles.orderSummaryRow} ${styles.orderSummaryRowTotal}`}>
        <span>Total</span>
        <span>{formatRp(total)}</span>
      </div>

      <PaymentMethods value={paymentMethod} onChange={onPaymentMethodChange} />

      <p className={styles.paymentDisclaimer}>
        Your personal data will be used to support your experience throughout this website, to manage access to
        your account, and for other purposes described in our{' '}
        <a href="#top" onClick={(e) => e.preventDefault()}>privacy policy.</a>
      </p>

      <ConfigProvider theme={placeOrderButtonTheme}>
        <Button
          ghost
          block
          className={styles.btnPlaceOrder}
          disabled={!hasItems}
          loading={placingOrder}
          onClick={onPlaceOrder}
        >
          Place order
        </Button>
      </ConfigProvider>
    </aside>
  );
}
