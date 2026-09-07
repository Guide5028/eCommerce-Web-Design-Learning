import AuthTabs from '../components/AuthTabs.jsx';
import FeaturesBar from '../components/FeaturesBar.jsx';
import PageHero from '../components/PageHero.jsx';

export default function LoginPage() {
  return (
    <main>
      <PageHero title="Login" />

      <AuthTabs />

      <FeaturesBar />
    </main>
  );
}
