import { useEffect, useState } from 'react';
import { Button, Flex, List, Popconfirm, Tag, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { productService } from '../services/productService.js';
import { resolveImage } from '../utils/resolveImage.js';
import ProductFormModal from '../components/ProductFormModal.jsx';
import AdminItemCard from '../components/AdminItemCard.jsx';

// Admin page for listing, creating, editing, and deleting product catalog details.
// Stock levels live on their own page (AdminStockPage) -- see /admin/stock.
export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      // no activeOnly -- the admin view needs to see disabled products too
      const data = await productService.getProducts({ limit: 100 });
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

  function openCreate() {
    setEditingProduct(null);
    setProductModalOpen(true);
  }

  function openEdit(product) {
    setEditingProduct(product);
    setProductModalOpen(true);
  }

  async function handleProductSubmit(values) {
    setSubmitting(true);
    try {
      if (editingProduct) {
        const updated = await productService.updateProduct(editingProduct.productId, values);
        setProducts((prev) =>
          prev.map((p) => (p.productId === updated.productId ? { ...p, ...updated } : p)),
        );
        message.success(`Updated ${updated.name}`);
      } else {
        await productService.createProduct(values);
        message.success(`Created ${values.name}`);
        await load(); // simplest way to pick up the new row with its computed stockQuantity
      }
      setProductModalOpen(false);
    } catch {
      // interceptor already toasted it -- keep the modal open so they can fix it
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(product) {
    try {
      await productService.deleteProduct(product.productId);
      setProducts((prev) => prev.filter((p) => p.productId !== product.productId));
      message.success(`Deleted ${product.name}`);
    } catch {
      // interceptor already toasted the real pos-api error message
    }
  }

  return (
    <>
      <Flex justify="flex-end" style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Add product
        </Button>
      </Flex>

      <List
        loading={loading}
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4 }}
        dataSource={products}
        rowKey="productId"
        renderItem={(product) => (
          <List.Item>
            <AdminItemCard
              image={product.imageUrl ? resolveImage(product.imageUrl) : null}
              title={product.name}
              tags={[
                <Tag key="category">{product.category || '—'}</Tag>,
                product.isActive ? (
                  <Tag color="success" key="status">
                    Active
                  </Tag>
                ) : (
                  <Tag key="status">Disabled</Tag>
                ),
              ]}
              highlight={`฿${Number(product.price).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              fields={[
                { label: 'Barcode', value: product.barcode || '—' },
                { label: 'SKU', value: product.sku || '—' },
              ]}
              actions={[
                <EditOutlined key="edit" onClick={() => openEdit(product)} />,
                <Popconfirm
                  key="delete"
                  title="Delete this product?"
                  description="Fails if it has sale or stock history -- disable it instead in that case."
                  onConfirm={() => handleDelete(product)}
                  okText="Delete"
                  okButtonProps={{ danger: true }}
                >
                  <DeleteOutlined />
                </Popconfirm>,
              ]}
            />
          </List.Item>
        )}
      />

      <ProductFormModal
        open={productModalOpen}
        product={editingProduct}
        submitting={submitting}
        onCancel={() => setProductModalOpen(false)}
        onSubmit={handleProductSubmit}
      />
    </>
  );
}
