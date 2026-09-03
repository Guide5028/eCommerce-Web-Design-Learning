import { createContext, useContext, useEffect, useState } from 'react';

// Ported from legacy/js/app.js:148-242 (FurniroProducts.fetchProducts), minus DOM rendering.

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/data/products.json')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load products.json');
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setProducts(data.products);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ProductsContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within a ProductsProvider');
  return ctx;
}
