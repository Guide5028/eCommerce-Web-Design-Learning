import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <span className="hero-tag">New Arrival</span>
        <h1>Discover Our New Collection</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.</p>
        <Link to="/shop" className="btn btn-buy">BUY NOW</Link>
      </div>
    </section>
  );
}
