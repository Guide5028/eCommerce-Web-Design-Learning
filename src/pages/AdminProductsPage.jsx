import { useEffect, useState } from 'react';
import { Button, Flex, Popconfirm, Spin, Table, Tag, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { productService } from '../services/productService.js';
import { resolveImage } from '../utils/resolveImage.js';
import ProductFormModal from '../components/ProductFormModal.jsx';
import StockAdjustModal from '../components/StockAdjustModal.jsx';

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

  async function handleDelete(product) {
    try {
      await productService.deleteProduct(product.productId);
      setProducts((prev) => prev.filter((p) => p.productId !== product.productId));
      message.success(`Deleted ${product.name}`);
    } catch {
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
          <img
            src={resolveImage(row.imageUrl)}
            alt=""
            style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
          />
        ) : (
          <div style={{ width: 40, height: 40, borderRadius: 4, background: 'var(--color-border)' }} />
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
        <Flex gap={8}>
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
        </Flex>
      ),
    },
  ];

  return (
    <>
      <Flex justify="flex-end" style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Add product
        </Button>
      </Flex>

      {loading ? (
        <div style={{ padding: '80px 0', textAlign: 'center' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table columns={columns} dataSource={products} rowKey="productId" pagination={false} scroll={{ x: true }} />
      )}

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
    </>
  );
}
