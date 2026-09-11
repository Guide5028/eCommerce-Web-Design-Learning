import { useEffect, useState } from 'react';
import { Button, List, Tag, message } from 'antd';
import { productService } from '../services/productService.js';
import { resolveImage } from '../utils/resolveImage.js';
import StockAdjustModal from '../components/StockAdjustModal.jsx';
import AdminItemCard from '../components/AdminItemCard.jsx';

// Below this, a product's stock gets flagged so admins can restock before it hits 0.
const LOW_STOCK_THRESHOLD = 5;

// Admin page for viewing and adjusting product stock levels -- separate from
// AdminProductsPage, which owns the catalog details (name/category/price/barcode/SKU).
export default function AdminStockPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [stockProduct, setStockProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      // no activeOnly -- disabled products can still hold stock that needs tracking
      const data = await productService.getProducts({ limit: 100, sortBy: 'stockQuantity', order: 'asc' });
      setProducts(data.items);
    } catch {
      // interceptor already toasted it
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

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
      <List
        loading={loading}
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4 }}
        dataSource={products}
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
