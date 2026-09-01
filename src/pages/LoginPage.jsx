import AuthTabs from '../components/auth/AuthTabs.jsx';
import FeaturesBar from '../components/layout/FeaturesBar.jsx';
import PageHero from '../components/layout/PageHero.jsx';

export default function LoginPage() {
  return (
    <main>
      <PageHero title="Login" />

      <AuthTabs />

      <FeaturesBar />
    </main>
  );
}
