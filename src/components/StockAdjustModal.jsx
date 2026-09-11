import { useEffect } from 'react';
import { Form, InputNumber, Modal, Select, Typography } from 'antd';

const REASON_OPTIONS = [
  { value: 'restock', label: 'Restock (add stock)' },
  { value: 'damage', label: 'Damage (remove stock)' },
  { value: 'correction', label: 'Correction (either direction)' },
];

// Modal for adjusting a product's stock (restock/damage/correction), used by AdminProductsPage.
export default function StockAdjustModal({ open, product, submitting, onCancel, onSubmit }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    form.setFieldsValue({ reason: 'restock' });
  }, [open, form]);

  function handleOk() {
    form.validateFields().then((values) => {
      onSubmit({
        changeAmount: values.reason === 'damage' ? -Math.abs(values.changeAmount) : values.changeAmount,
        reason: values.reason,
        // antd's InputNumber leaves an untouched/cleared field as null, not undefined -- the
        // backend's zod schema only accepts a number or a missing key (optional()), so a bare
        // `null` here fails validation with "expected number, received null". Coalesce it away.
        costPrice: values.reason === 'restock' && values.costPrice != null ? values.costPrice : undefined,
      });
    });
  }

  return (
    <Modal
      title={product ? `Adjust stock — ${product.name}` : 'Adjust stock'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={submitting}
      okText="Apply"
      destroyOnClose
    >
      {product && (
        <Typography.Paragraph type="secondary">
          Current stock: <strong>{product.stockQuantity}</strong>
        </Typography.Paragraph>
      )}
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item label="Reason" name="reason" rules={[{ required: true }]}>
          <Select options={REASON_OPTIONS} />
        </Form.Item>
        <Form.Item noStyle shouldUpdate={(prev, cur) => prev.reason !== cur.reason}>
          {({ getFieldValue }) => {
            const reason = getFieldValue('reason');
            const isDamage = reason === 'damage';
            return (
              <Form.Item
                label={isDamage ? 'Quantity to remove' : 'Quantity change (negative to remove)'}
                name="changeAmount"
                rules={[
                  { required: true, message: 'Enter a quantity' },
                  { validator: (_, v) => (v === 0 ? Promise.reject('changeAmount cannot be 0') : Promise.resolve()) },
                  {
                    validator: (_, v) =>
                      v == null || Number.isInteger(v) ? Promise.resolve() : Promise.reject('Must be a whole number'),
                  },
                ]}
              >
                {/* precision={0} rounds to a whole number as you type -- backend requires changeAmount to be an int */}
                <InputNumber style={{ width: '100%' }} min={isDamage ? 1 : undefined} precision={0} />
              </Form.Item>
            );
          }}
        </Form.Item>
        <Form.Item noStyle shouldUpdate={(prev, cur) => prev.reason !== cur.reason}>
          {({ getFieldValue }) =>
            getFieldValue('reason') === 'restock' && (
              <Form.Item label="Cost price (optional)" name="costPrice">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            )
          }
        </Form.Item>
      </Form>
    </Modal>
  );
}
