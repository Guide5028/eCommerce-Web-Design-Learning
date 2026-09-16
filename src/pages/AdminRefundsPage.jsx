import { useEffect, useState } from 'react';
import { Button, Flex, Table, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { refundService } from '../services/refundService.js';
import { productService } from '../services/productService.js';
import { useAuth } from '../context/AuthContext.jsx';
import CreateRefundModal from '../components/CreateRefundModal.jsx';

const COLUMNS = [
  {
    title: 'Refunded',
    dataIndex: 'refundedAt',
    render: (v) => new Date(v).toLocaleString(),
    sorter: (a, b) => new Date(a.refundedAt) - new Date(b.refundedAt),
    defaultSortOrder: 'descend',
  },
  { title: 'Sale #', dataIndex: 'saleId' },
  { title: 'Product', dataIndex: 'productName', render: (v) => v ?? '—' },
  { title: 'Qty', dataIndex: 'quantity' },
  { title: 'Reason', dataIndex: 'reason' },
  { title: 'By', dataIndex: 'employeeName', render: (v) => v ?? '—' },
];

// Admin page: read-only refund log (refunds are immutable once created, unlike
// products/categories) plus a "New refund" flow that looks up a sale by id.
export default function AdminRefundsPage() {
  const { profile } = useAuth();
  const [refunds, setRefunds] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [refundRows, productData] = await Promise.all([
        refundService.getRefunds(),
        productService.getProducts({ limit: 100 }),
      ]);
      setRefunds(refundRows);
      setProducts(productData.items);
    } catch {
      // interceptor already toasted it
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(values) {
    setSubmitting(true);
    try {
      await refundService.createRefund({ ...values, employeeId: profile.employeeId });
      message.success('Refund recorded');
      setModalOpen(false);
      await load(); // simplest way to pick up the joined product/employee names
    } catch {
      // e.g. "Cannot refund N -- only M left on this line item" -- interceptor already toasted it
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Flex justify="flex-end" style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
          New refund
        </Button>
      </Flex>

      <Table
        loading={loading}
        dataSource={refunds}
        columns={COLUMNS}
        rowKey="refundId"
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50, 100],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}
        locale={{ emptyText: 'No refunds yet.' }}
      />

      <CreateRefundModal
        open={modalOpen}
        products={products}
        submitting={submitting}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
