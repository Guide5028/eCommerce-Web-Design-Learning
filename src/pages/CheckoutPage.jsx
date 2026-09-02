import { useMemo, useState } from 'react';
import { useProducts } from '../data/ProductsContext.jsx';
import { useStore } from '../store/StoreContext.jsx';
import BillingForm from '../components/checkout/BillingForm.jsx';
import OrderSummary from '../components/checkout/OrderSummary.jsx';
import FeaturesBar from '../components/layout/FeaturesBar.jsx';
import PageHero from '../components/layout/PageHero.jsx';
import styles from '../styles/pages/CheckoutPage.module.css';

export default function CheckoutPage() {
  const { products } = useProducts();
  const { cart } = useStore();
  const [paymentMethod, setPaymentMethod] = useState('Direct Bank Transfer');

  const lines = useMemo(() => {
    return cart
      .map((item) => {
        const product = products.find((p) => p.id === item.id);
        return product ? { product, qty: item.qty } : null;
      })
      .filter(Boolean);
  }, [cart, products]);

  return (
    <main>
      <PageHero title="Checkout" />

      <section className={styles.checkoutSection}>
        <BillingForm />
        <OrderSummary lines={lines} paymentMethod={paymentMethod} onPaymentMethodChange={setPaymentMethod} />
      </section>

      <FeaturesBar />
    </main>
  );
}
