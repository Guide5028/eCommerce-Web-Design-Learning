import { Radio } from 'antd';

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
    <div className="payment-methods">
      <div className="payment-active">
        <span className="payment-dot" />
        <span>{active.value}</span>
      </div>
      <p className="payment-active-desc">{active.desc}</p>

      <Radio.Group
        className="payment-options"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {PAYMENT_OPTIONS.map((option) => (
          <Radio className="payment-option" value={option.value} key={option.value}>
            {option.value}
          </Radio>
        ))}
      </Radio.Group>
    </div>
  );
}
