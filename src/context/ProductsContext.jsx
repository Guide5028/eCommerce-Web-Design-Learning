import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { productService } from '../services/productService';

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0); // เก็บจำนวนสินค้าทั้งหมดเพื่อทำระบบแบ่งหน้า
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchProducts = async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = { activeOnly: true, ...filters }; // only sellable products for the storefront

      const data = await productService.getProducts(queryParams);

      // .items and .total come from pos-api's paginated response shape
      setProducts(data?.items || []);
      setTotalProducts(data?.total || 0);
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลสินค้า');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Single fetch for the whole app; limit:100 so the full catalog loads, not just page 1.
    fetchProducts({ limit: 100 });
  }, []);

  const contextValue = useMemo(() => ({
    products,
    totalProducts,
    loading,
    error,
    refetch: fetchProducts
  }), [products, totalProducts, loading, error]);

  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within a ProductsProvider');
  return ctx;
}
