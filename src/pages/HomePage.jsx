import { Link } from 'react-router-dom';
import { Flex } from 'antd';
import { useProducts } from '../context/ProductsContext.jsx';
import Hero from '../components/Hero.jsx';
import BrowseRange from '../components/BrowseRange.jsx';
import RoomCarousel from '../components/RoomCarousel.jsx';
import ShareSetup from '../components/ShareSetup.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import styles from '../styles/pages/HomePage.module.css';

export default function HomePage() {
  const { products } = useProducts();

  return (
    <main>
      <Hero />
      <BrowseRange />

      <Flex vertical align="center" component="section" className={styles.ourProducts}>
        <h2>Our Products</h2>
        <ProductGrid products={products} pageSize={8} gridClassName="products-grid" />
      </Flex>

      <section className={styles.roomInspiration}>
        <Flex gap={40} className={styles.roomInspirationInner}>
          <div className={styles.roomInspirationContent}>
            <h2>50+ Beautiful rooms inspiration</h2>
            <p>Our designer already made a lot of beautiful prototipe of rooms that inspire you</p>
            <Link to="/shop" className="btn btn-primary">Explore More</Link>
          </div>

          <RoomCarousel />
        </Flex>
      </section>

      <ShareSetup />
    </main>
  );
}
