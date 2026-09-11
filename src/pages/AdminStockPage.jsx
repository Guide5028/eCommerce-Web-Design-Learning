import { useEffect, useMemo, useState } from 'react';
import { Button, List, Switch, Tag, Typography, message } from 'antd';
import { productService } from '../services/productService.js';
import { categoryService } from '../services/categoryService.js';
import { resolveImage } from '../utils/resolveImage.js';
import StockAdjustModal from '../components/StockAdjustModal.jsx';
import AdminItemCard from '../components/AdminItemCard.jsx';
import AdminFilterBar from '../components/AdminFilterBar.jsx';

// Below this, a product's stock gets flagged so admins can restock before it hits 0.
const LOW_STOCK_THRESHOLD = 5;

// Admin page for viewing and adjusting product stock levels -- separate from
// AdminProductsPage, which owns the catalog details (name/category/price/barcode/SKU).
export default function AdminStockPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  // defaults match the page's old hardcoded behavior (lowest stock first) -- now adjustable
  const [filters, setFilters] = useState({ sortBy: 'stockQuantity', order: 'asc' });
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [stockProduct, setStockProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      // no activeOnly -- disabled products can still hold stock that needs tracking
      const data = await productService.getProducts({ ...filters, limit: 100 });
      setProducts(data.items);
    } catch {
      // interceptor already toasted it
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    categoryService.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // client-side on top of the server-sorted page -- pos-api has no "stock <= N" query param
  const visibleProducts = useMemo(
    () => (lowStockOnly ? products.filter((p) => Number(p.stockQuantity) <= LOW_STOCK_THRESHOLD) : products),
    [products, lowStockOnly],
  );

  function openStockAdjust(product) {
    setStockProduct(product);
    setStockModalOpen(true);
  }

  async function handleStockSubmit(values) {
    setSubmitting(true);
    try {
      const updated = await productService.updateStock(stockProduct.productId, values);
      setProducts((prev) =>
        prev.map((p) => (p.productId === updated.productId ? { ...p, stockQuantity: updated.stockQuantity } : p)),
      );
      message.success(`Stock updated for ${stockProduct.name}`);
      setStockModalOpen(false);
    } catch {
      // e.g. "Stock cannot go below 0" -- interceptor already toasted it
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <AdminFilterBar
          categories={categories}
          filters={filters}
          onChange={setFilters}
          extra={
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <Switch checked={lowStockOnly} onChange={setLowStockOnly} size="small" />
              <Typography.Text>Low stock only (≤{LOW_STOCK_THRESHOLD})</Typography.Text>
            </label>
          }
        />
      </div>

      <List
        loading={loading}
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4 }}
        dataSource={visibleProducts}
        rowKey="productId"
        renderItem={(product) => {
          const quantity = Number(product.stockQuantity);
          const isOutOfStock = quantity === 0;
          const isLowStock = quantity > 0 && quantity <= LOW_STOCK_THRESHOLD;
          const highlightColor = isOutOfStock ? '#ff4d4f' : isLowStock ? '#faad14' : 'var(--color-primary)';

          return (
            <List.Item>
              <AdminItemCard
                image={product.imageUrl ? resolveImage(product.imageUrl) : null}
                title={product.name}
                tags={[
                  <Tag key="category">{product.category || '—'}</Tag>,
                  isOutOfStock && (
                    <Tag color="error" key="stock-status">
                      Out of stock
                    </Tag>
                  ),
                  isLowStock && (
                    <Tag color="warning" key="stock-status">
                      Low stock
                    </Tag>
                  ),
                ].filter(Boolean)}
                highlight={`${quantity} units`}
                highlightColor={highlightColor}
                fields={[{ label: 'Status', value: product.isActive ? 'Active' : 'Disabled' }]}
                actions={[
                  <Button key="adjust" type="text" onClick={() => openStockAdjust(product)}>
                    Adjust stock
                  </Button>,
                ]}
              />
            </List.Item>
          );
        }}
      />

      <StockAdjustModal
        open={stockModalOpen}
        product={stockProduct}
        submitting={submitting}
        onCancel={() => setStockModalOpen(false)}
        onSubmit={handleStockSubmit}
      />
    </>
  );
}
