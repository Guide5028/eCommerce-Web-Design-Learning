import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { formatRp } from '../../utils/format.js';
import PaymentMethods from './PaymentMethods.jsx';

// Ported from legacy/js/app.js:1068-1123 (order summary render)

export default function OrderSummary({ lines, paymentMethod, onPaymentMethodChange }) {
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.qty, 0);
  const hasItems = lines.length > 0;

  return (
    <aside className="order-summary">
      <div className="order-summary-header">
        <span>Product</span>
        <span>Subtotal</span>
      </div>

      {hasItems ? (
        <div id="order-summary-items">
          {lines.map((line) => (
            <div className="order-summary-row" key={line.product.id}>
              <span className="order-summary-item">
                {line.product.name} <span className="order-summary-qty">x {line.qty}</span>
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

      <div className="order-summary-row">
        <span>Subtotal</span>
        <span>{formatRp(subtotal)}</span>
      </div>

      <div className="order-summary-row order-summary-row--total">
        <span>Total</span>
        <span>{formatRp(subtotal)}</span>
      </div>

      <PaymentMethods value={paymentMethod} onChange={onPaymentMethodChange} />

      <p className="payment-disclaimer">
        Your personal data will be used to support your experience throughout this website, to manage access to
        your account, and for other purposes described in our{' '}
        <a href="#top" onClick={(e) => e.preventDefault()}>privacy policy.</a>
      </p>

      <Button className="btn-place-order" disabled={!hasItems}>
        Place order
      </Button>
    </aside>
  );
}
