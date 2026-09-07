import { useEffect, useState } from 'react';
import { Button, Popconfirm, Spin, Table, Tag, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { productService } from '../services/productService.js';
import { resolveImage } from '../utils/resolveImage.js';
import PageHero from '../components/PageHero.jsx';
import ProductFormModal from '../components/ProductFormModal.jsx';
import StockAdjustModal from '../components/StockAdjustModal.jsx';
import styles from '../styles/pages/Admin.module.css';

// Admin page for listing, creating, editing, adjusting stock, and deleting products.
export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [stockProduct, setStockProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      // no activeOnly -- the admin view needs to see disabled products too
      const data = await productService.getProducts({ limit: 100 });
      setProducts(data.items);
    } catch (err) {
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
    } catch (err) {
      // interceptor already toasted it -- keep the modal open so they can fix it
    } finally {
      setSubmitting(false);
    }
  }

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
    } catch (err) {
      // e.g. "Stock cannot go below 0" -- interceptor already toasted it
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(product) {
    try {
      await productService.deleteProduct(product.productId);
      setProducts((prev) => prev.filter((p) => p.productId !== product.productId));
      message.success(`Deleted ${product.name}`);
    } catch (err) {
      // interceptor already toasted the real pos-api error message
    }
  }

  const columns = [
    {
      title: '',
      key: 'image',
      width: 64,
      render: (_, row) =>
        row.imageUrl ? (
          <img src={resolveImage(row.imageUrl)} alt="" className={styles.productThumb} />
        ) : (
          <div className={styles.productThumb} />
        ),
    },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (value) => value || <Tag>—</Tag>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (value) => `฿${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
    },
    { title: 'Stock', dataIndex: 'stockQuantity', key: 'stockQuantity' },
    {
      title: 'Status',
      key: 'isActive',
      render: (_, row) => (row.isActive ? <Tag color="success">Active</Tag> : <Tag>Disabled</Tag>),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <div className={styles.rowActions}>
          <Button size="small" onClick={() => openEdit(row)}>
            Edit
          </Button>
          <Button size="small" onClick={() => openStockAdjust(row)}>
            Adjust stock
          </Button>
          <Popconfirm
            title="Delete this product?"
            description="Fails if it has sale or stock history -- disable it instead in that case."
            onConfirm={() => handleDelete(row)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <main>
      <PageHero title="Products" />

      <section className={styles.adminSection}>
        <div className={styles.adminToolbar}>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Add product
          </Button>
        </div>

        {loading ? (
          <div className={styles.adminLoading}>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            className={styles.adminTable}
            columns={columns}
            dataSource={products}
            rowKey="productId"
            pagination={false}
            scroll={{ x: true }}
          />
        )}
      </section>

      <ProductFormModal
        open={productModalOpen}
        product={editingProduct}
        submitting={submitting}
        onCancel={() => setProductModalOpen(false)}
        onSubmit={handleProductSubmit}
      />

      <StockAdjustModal
        open={stockModalOpen}
        product={stockProduct}
        submitting={submitting}
        onCancel={() => setStockModalOpen(false)}
        onSubmit={handleStockSubmit}
      />
    </main>
  );
}
