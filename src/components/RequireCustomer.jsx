import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../context/AuthContext.jsx';

// Route guard for /account: redirects to /login if logged out, shows "Staff account"
// if logged in as an employee/admin instead (they don't have an order history here --
// see /admin for their tools). Mirrors RequireAdmin.jsx's shape.
export default function RequireCustomer({ children }) {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: '120px 0', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!profile) return <Navigate to="/login" replace />;

  if (profile.role !== 'customer') {
    return (
      <main>
        <section className="favorite-section">
          <h2>Staff account</h2>
          <p className="favorite-empty">This page is for shopper accounts only.</p>
        </section>
      </main>
    );
  }

  return children;
}
