import StaffAuthTabs from '../components/StaffAuthTabs.jsx';
import FeaturesBar from '../components/FeaturesBar.jsx';
import PageHero from '../components/PageHero.jsx';

// Not linked from the main nav -- share this URL directly with new hires.
// Public shoppers use /login (customer accounts) instead.
export default function StaffLoginPage() {
  return (
    <main>
      <PageHero title="Staff Login" />

      <StaffAuthTabs />

      <FeaturesBar />
    </main>
  );
}
