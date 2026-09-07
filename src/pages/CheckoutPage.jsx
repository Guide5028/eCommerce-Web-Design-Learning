import { useMemo, useState } from 'react';
import { Flex } from 'antd';
import { useProducts } from '../context/ProductsContext.jsx';
import { useStore } from '../context/StoreContext.jsx';
import BillingForm from '../components/BillingForm.jsx';
import OrderSummary from '../components/OrderSummary.jsx';
import FeaturesBar from '../components/FeaturesBar.jsx';
import PageHero from '../components/PageHero.jsx';
import styles from '../styles/pages/CheckoutPage.module.css';

export default function CheckoutPage() {
  const { products } = useProducts();
  const { cart } = useStore();
  const [paymentMethod, setPaymentMethod] = useState('Direct Bank Transfer');

  const lines = useMemo(() => {
    return cart
      .map((item) => {
        const product = products.find((p) => (p.productId ?? p.id) === item.id);
        return product ? { product, qty: item.qty } : null;
      })
      .filter(Boolean);
  }, [cart, products]);

  return (
    <main>
      <PageHero title="Checkout" />

      <Flex justify="center" gap={26} component="section" className={styles.checkoutSection}>
        <BillingForm />
        <OrderSummary lines={lines} paymentMethod={paymentMethod} onPaymentMethodChange={setPaymentMethod} />
      </Flex>

      <FeaturesBar />
    </main>
  );
}
