import { Radio } from 'antd';
import styles from '../styles/components/PaymentMethods.module.css';

// Matches pos-api's real payment_method enum exactly (cash | card | e-wallet) --
// the previous options here ("Direct Bank Transfer", "Cash On Delivery") were never
// valid values the backend would accept.
const PAYMENT_OPTIONS = [
  { value: 'cash', label: 'Cash', desc: 'Pay with cash. No card or app needed.' },
  { value: 'card', label: 'Card', desc: 'Pay by debit or credit card.' },
  { value: 'e-wallet', label: 'E-Wallet', desc: 'Pay with a mobile wallet app.' },
];

export default function PaymentMethods({ value, onChange }) {
  const active = PAYMENT_OPTIONS.find((option) => option.value === value) || PAYMENT_OPTIONS[0];

  return (
    <div className={styles.paymentMethods}>
      <div className={styles.paymentActive}>
        <span className={styles.paymentDot} />
        <span>{active.label}</span>
      </div>
      <p className={styles.paymentActiveDesc}>{active.desc}</p>

      <Radio.Group
        className={styles.paymentOptions}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {PAYMENT_OPTIONS.map((option) => (
          <Radio className={styles.paymentOption} value={option.value} key={option.value}>
            {option.label}
          </Radio>
        ))}
      </Radio.Group>
    </div>
  );
}
