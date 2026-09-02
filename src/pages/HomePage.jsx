import { Link } from 'react-router-dom';
import { useProducts } from '../data/ProductsContext.jsx';
import Hero from '../components/home/Hero.jsx';
import BrowseRange from '../components/home/BrowseRange.jsx';
import RoomCarousel from '../components/home/RoomCarousel.jsx';
import ShareSetup from '../components/home/ShareSetup.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import styles from '../styles/pages/HomePage.module.css';

export default function HomePage() {
  const { products } = useProducts();

  return (
    <main>
      <Hero />
      <BrowseRange />

      <section className={styles.ourProducts}>
        <h2>Our Products</h2>
        <ProductGrid products={products} pageSize={8} gridClassName="products-grid" />
      </section>

      <section className={styles.roomInspiration}>
        <div className={styles.roomInspirationInner}>
          <div className={styles.roomInspirationContent}>
            <h2>50+ Beautiful rooms inspiration</h2>
            <p>Our designer already made a lot of beautiful prototipe of rooms that inspire you</p>
            <Link to="/shop" className="btn btn-primary">Explore More</Link>
          </div>

          <RoomCarousel />
        </div>
      </section>

      <ShareSetup />
    </main>
  );
}
