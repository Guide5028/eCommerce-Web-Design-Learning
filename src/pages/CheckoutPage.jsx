import { useEffect, useMemo, useState } from 'react';
import { Flex, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext.jsx';
import { useStore } from '../context/StoreContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { saleService } from '../services/saleService.js';
import { promotionService } from '../services/promotionService.js';
import { categoryService } from '../services/categoryService.js';
import { computeDiscountAmount, pickBestPromotion } from '../utils/promotions.js';
import { ONLINE_STORE_EMPLOYEE_ID } from '../config/constants.js';
import BillingForm from '../components/BillingForm.jsx';
import OrderSummary from '../components/OrderSummary.jsx';
import FeaturesBar from '../components/FeaturesBar.jsx';
import PageHero from '../components/PageHero.jsx';
import styles from '../styles/pages/CheckoutPage.module.css';

export default function CheckoutPage() {
  const { products } = useProducts();
  const { cart, clearCart } = useStore();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [categoryIdByName, setCategoryIdByName] = useState(new Map());

  // Preview only -- pos-api decides the real discount server-side at POST /sales.
  // Loaded once; a promo starting/ending mid-checkout is rare enough not to poll for.
  useEffect(() => {
    promotionService
      .getPromotions({ activeOnly: true })
      .then(setPromotions)
      .catch(() => {});
    categoryService
      .getCategories()
      .then((cats) => setCategoryIdByName(new Map(cats.map((c) => [c.name, c.categoryId]))))
      .catch(() => {});
  }, []);

  const lines = useMemo(() => {
    return cart
      .map((item) => {
        const product = products.find((p) => (p.productId ?? p.id) === item.id);
        if (!product) return null;

        const lineSubtotal = product.price * item.qty;
        const promotion = pickBestPromotion(promotions, product, categoryIdByName);
        const discount = promotion ? computeDiscountAmount(promotion, lineSubtotal) : 0;

        return { product, qty: item.qty, promotion, discount };
      })
      .filter(Boolean);
  }, [cart, products, promotions, categoryIdByName]);

  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.qty, 0);
  const totalDiscount = lines.reduce((sum, line) => sum + line.discount, 0);
  const total = subtotal - totalDiscount;

  async function handlePlaceOrder() {
    // pos-api's /sales requires an authenticated account (it attributes every sale
    // to one) -- there's no guest checkout yet, so send them to log in first
    if (!profile) {
      message.info('Please log in to place an order');
      navigate('/login');
      return;
    }

    // Customer accounts have no employeeId of their own -- pos-api's sale.employee_id is
    // required (it's a POS-style "who rang this up" field), so self-service checkout is
    // attributed to the placeholder "Online Store" employee instead. Real customer accounts
    // still get tied to the sale via customerId (for order history / future loyalty points).
    const isCustomer = profile.role === 'customer';
    if (isCustomer && !ONLINE_STORE_EMPLOYEE_ID) {
      message.error('Checkout is not configured yet -- contact an admin.');
      return;
    }

    setPlacingOrder(true);
    try {
      await saleService.createSale({
        items: lines.map((line) => ({ productId: line.product.productId, quantity: line.qty })),
        employeeId: isCustomer ? ONLINE_STORE_EMPLOYEE_ID : profile.employeeId,
        customerId: isCustomer ? profile.customerId : undefined,
        paymentMethod,
        amountPaid: total,
      });
      clearCart();
      message.success('Order placed!');
      navigate('/');
    } catch {
      // interceptor already toasted the real error (e.g. "Not enough stock for ...")
    } finally {
      setPlacingOrder(false);
    }
  }

  return (
    <main>
      <PageHero title="Checkout" />

      <Flex justify="center" gap={26} component="section" className={styles.checkoutSection}>
        <BillingForm />
        <OrderSummary
          lines={lines}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
          onPlaceOrder={handlePlaceOrder}
          placingOrder={placingOrder}
        />
      </Flex>

      <FeaturesBar />
    </main>
  );
}
