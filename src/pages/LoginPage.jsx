import { Link } from 'react-router-dom';
import AuthTabs from '../components/auth/AuthTabs.jsx';
import FeaturesBar from '../components/layout/FeaturesBar.jsx';

export default function LoginPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="page-hero-content">
          <img src="/images/logo-furniro.svg" alt="" className="page-hero-icon" />
          <h1>Login</h1>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">&rsaquo;</span>
            <span aria-current="page">Login</span>
          </nav>
        </div>
      </section>

      <AuthTabs />

      <FeaturesBar />
    </main>
  );
}
