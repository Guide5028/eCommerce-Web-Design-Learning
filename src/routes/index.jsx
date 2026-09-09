import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import RequireAdmin from '../components/RequireAdmin.jsx';
import HomePage from '../pages/HomePage.jsx';
import ShopPage from '../pages/ShopPage.jsx';
import ProductDetailPage from '../pages/ProductDetailPage.jsx';
import CartPage from '../pages/CartPage.jsx';
import CheckoutPage from '../pages/CheckoutPage.jsx';
import FavoritePage from '../pages/FavoritePage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import OAuthCallbackPage from '../pages/OAuthCallbackPage.jsx';
import AboutPage from '../pages/AboutPage.jsx';
import ContactPage from '../pages/ContactPage.jsx';
import AdminDashboardPage from '../pages/AdminDashboardPage.jsx';
import AdminEmployeesPage from '../pages/AdminEmployeesPage.jsx';
import AdminCategoriesPage from '../pages/AdminCategoriesPage.jsx';
import AdminProductsPage from '../pages/AdminProductsPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/favorite" element={<FavoritePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/oauth-callback" element={<OAuthCallbackPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="employees" element={<AdminEmployeesPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="products" element={<AdminProductsPage />} />
      </Route>
    </Routes>
  );
}

