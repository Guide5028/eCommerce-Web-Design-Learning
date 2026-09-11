import { useEffect, useState } from 'react';
import { Alert, Form, Input, InputNumber, Modal, Select } from 'antd';
import { saleService } from '../services/saleService.js';

// Refunds are always against one line item of an existing sale, so this modal is a
// two-step lookup: find the sale by id, then pick which line + how much to refund.
// `products` (from AdminRefundsPage) resolves productId -> a friendly name -- the raw
// /sales/:id response only has ids, no joined product names.
export default function CreateRefundModal({ open, products, submitting, onCancel, onSubmit }) {
  const [form] = Form.useForm();
  const [saleIdInput, setSaleIdInput] = useState('');
  const [loadingSale, setLoadingSale] = useState(false);
  const [sale, setSale] = useState(null);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    setSaleIdInput('');
    setSale(null);
    setLoadError('');
  }, [open, form]);

  async function handleLoadSale(value) {
    const id = Number(value);
    if (!id) return;
    setLoadingSale(true);
    setLoadError('');
    setSale(null);
    try {
      const found = await saleService.getSaleById(id);
      setSale(found);
    } catch (err) {
      setLoadError(err.message || 'Sale not found');
    } finally {
      setLoadingSale(false);
    }
  }

  function handleOk() {
    form.validateFields().then((values) => onSubmit(values));
  }

  function productName(productId) {
    return products.find((p) => p.productId === productId)?.name ?? `Product #${productId}`;
  }

  return (
    <Modal
      title="New refund"
      open={open}
      onOk={sale ? handleOk : undefined}
      onCancel={onCancel}
      confirmLoading={submitting}
      okText="Refund"
      okButtonProps={{ disabled: !sale }}
      destroyOnClose
    >
      <Form.Item label="Sale ID" style={{ marginBottom: sale || loadError ? 16 : 0 }}>
        <Input.Search
          placeholder="e.g. 10"
          value={saleIdInput}
          onChange={(e) => setSaleIdInput(e.target.value)}
          onSearch={handleLoadSale}
          loading={loadingSale}
          enterButton="Load"
        />
      </Form.Item>

      {loadError && <Alert type="error" message={loadError} showIcon style={{ marginBottom: 16 }} />}

      {sale && (
        <Form form={form} layout="vertical" requiredMark={false}>
          <Form.Item label="Line item" name="saleItemId" rules={[{ required: true, message: 'Pick a line item' }]}>
            <Select
              placeholder="Select a product from this sale"
              options={sale.items.map((item) => ({
                value: item.saleItemId,
                label: `${productName(item.productId)} — qty ${item.quantity} @ ฿${Number(item.unitPrice).toLocaleString()}`,
              }))}
            />
          </Form.Item>
          <Form.Item
            label="Quantity to refund"
            name="quantity"
            rules={[
              { required: true, message: 'Enter a quantity' },
              { type: 'number', min: 1, message: 'Must be at least 1' },
            ]}
          >
            <InputNumber min={1} precision={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Reason" name="reason" rules={[{ required: true, message: 'Reason is required' }]}>
            <Input.TextArea rows={2} placeholder="e.g. Damaged on arrival" />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}
