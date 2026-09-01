import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../data/ProductsContext.jsx';
import { useStore } from '../store/StoreContext.jsx';
import ProductCard from '../components/product/ProductCard.jsx';
import FeaturesBar from '../components/layout/FeaturesBar.jsx';
import PageHero from '../components/layout/PageHero.jsx';

// Ported from legacy/js/app.js:1040-1066 (favorite page)

export default function FavoritePage() {
  const { products } = useProducts();
  const { favorites } = useStore();

  const favoriteProducts = useMemo(
    () => products.filter((p) => favorites.indexOf(p.id) !== -1),
    [products, favorites]
  );

  return (
    <main>
      <PageHero title="Favorite" />

      <section className="favorite-section">
        <h2>My Wishlist</h2>
        <p className="favorite-subtitle">
          {favoriteProducts.length} {favoriteProducts.length === 1 ? 'item saved' : 'items saved'}
        </p>

        {favoriteProducts.length > 0 ? (
          <div className="products-grid favorite-grid">
            {favoriteProducts.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        ) : (
          <p className="favorite-empty">
            Your wishlist is empty. Tap the heart icon on any product to save it here.
          </p>
        )}
      </section>

      <FeaturesBar />
    </main>
  );
}
