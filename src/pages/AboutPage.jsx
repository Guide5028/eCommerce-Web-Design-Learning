import { Link } from 'react-router-dom';
import FeaturesBar from '../components/layout/FeaturesBar.jsx';

const STATS = [
  { value: '10+', label: 'Years of Experience' },
  { value: '1000+', label: 'Happy Customers' },
  { value: '50+', label: 'Skilled Craftsmen' },
  { value: '15+', label: 'Countries Served' },
];

export default function AboutPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="page-hero-content">
          <img src="/images/logo-furniro.svg" alt="" className="page-hero-icon" />
          <h1>About</h1>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">&rsaquo;</span>
            <span aria-current="page">About</span>
          </nav>
        </div>
      </section>

      <section className="about-story">
        <div className="about-story-image">
          <img src="/images/room-living.jpg" alt="Living room styled with a wooden dresser, lamp and hanging vase" />
        </div>
        <div className="about-story-content">
          <h2>Our Story</h2>
          <p>
            Furniro started with a simple idea: furniture should feel as good as it looks. What began as a small
            workshop has grown into a home for pieces that are built to last, shaped by real craftsmen who care
            about every joint, seam and finish.
          </p>
          <p>
            We work directly with makers who share our love for honest materials and timeless design, so every
            chair, sofa and table that reaches your home carries a little of that care with it &mdash; comfortable,
            durable, and made for everyday living.
          </p>
          <Link to="/shop" className="btn btn-primary">Shop Our Collection</Link>
        </div>
      </section>

      <section className="about-stats">
        {STATS.map((stat) => (
          <div className="about-stat-item" key={stat.label}>
            <h3>{stat.value}</h3>
            <p>{stat.label}</p>
          </div>
        ))}
      </section>

      <FeaturesBar />
    </main>
  );
}
