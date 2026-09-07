import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext.jsx';
import { useStore } from '../context/StoreContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import FeaturesBar from '../components/FeaturesBar.jsx';
import PageHero from '../components/PageHero.jsx';

// Wishlist page: the products the user has liked.

export default function FavoritePage() {
  const { products } = useProducts();
  const { favorites } = useStore();

  const favoriteProducts = useMemo(
    () => products.filter((p) => favorites.indexOf(p.productId ?? p.id) !== -1),
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
              <ProductCard product={product} key={product.productId ?? product.id} />
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
