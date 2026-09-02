import { Link } from 'react-router-dom';
import { Button, ConfigProvider } from 'antd';
import { formatRp } from '../../utils/format.js';
import { COLOR_TEXT } from '../../theme.js';
import PaymentMethods from './PaymentMethods.jsx';
import styles from '../../styles/components/checkout/OrderSummary.module.css';

// Ported from legacy/js/app.js:1068-1123 (order summary render)

// `ghost` + the ghost color tokens give the transparent-bg / dark-outline look for
// free; `block` (on the Button itself, below) gives width:100% via AntD's own CSS
// instead of us fighting its default width with an !important override. Height and
// horizontal padding are real tokens too (controlHeight/paddingInline) -- AntD's
// Button always renders a literal `height: controlHeight` and hardcodes vertical
// padding to 0 regardless (button/style/index.js), so controlHeight is the actual
// lever, approximating what the original 16px vertical padding produced at 16px
// font: ~25.6px content line height + 2*16px padding =~ 58. The hover-fills-solid
// flourish stays CSS -- ghost's own hover doesn't do that by default.
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
            <div className={styles.orderSummaryRow} key={line.product.id}>
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
