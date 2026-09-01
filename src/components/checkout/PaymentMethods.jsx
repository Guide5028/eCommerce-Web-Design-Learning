import { Radio } from 'antd';
import styles from './PaymentMethods.module.css';

// Ported from legacy/js/app.js:538-551 (checkout payment method)

const PAYMENT_OPTIONS = [
  {
    value: 'Direct Bank Transfer',
    desc:
      'Make your payment directly into our bank account. Please use your Order ID as the payment reference. ' +
      'Your order will not be shipped until the funds have cleared in our account.',
  },
  {
    value: 'Cash On Delivery',
    desc: 'Pay with cash upon delivery.',
  },
];

export default function PaymentMethods({ value, onChange }) {
  const active = PAYMENT_OPTIONS.find((option) => option.value === value) || PAYMENT_OPTIONS[0];

  return (
    <div className={styles.paymentMethods}>
      <div className={styles.paymentActive}>
        <span className={styles.paymentDot} />
        <span>{active.value}</span>
      </div>
      <p className={styles.paymentActiveDesc}>{active.desc}</p>

      <Radio.Group
        className={styles.paymentOptions}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {PAYMENT_OPTIONS.map((option) => (
          <Radio className={styles.paymentOption} value={option.value} key={option.value}>
            {option.value}
          </Radio>
        ))}
      </Radio.Group>
    </div>
  );
}
