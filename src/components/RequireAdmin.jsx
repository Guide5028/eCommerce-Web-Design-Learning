import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../context/AuthContext.jsx';

// Route guard: redirects to /login if logged out, shows "Access denied" if not an admin.
export default function RequireAdmin({ children }) {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: '120px 0', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!profile) return <Navigate to="/login" replace />;

  if (profile.role !== 'admin') {
    return (
      <main>
        <section className="favorite-section">
          <h2>Access denied</h2>
          <p className="favorite-empty">This page is for admins only.</p>
        </section>
      </main>
    );
  }

  return children;
}
