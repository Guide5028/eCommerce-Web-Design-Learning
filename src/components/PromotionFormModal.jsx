import { useEffect, useState } from 'react';
import { DatePicker, Form, Input, InputNumber, Modal, Select, Switch } from 'antd';
import dayjs from 'dayjs';
import { categoryService } from '../services/categoryService.js';
import { productService } from '../services/productService.js';

const DISCOUNT_TYPE_OPTIONS = [
  { value: 'percentage', label: 'Percentage (%)' },
  { value: 'fixed', label: 'Fixed amount (฿)' },
];

const SCOPE_OPTIONS = [
  { value: 'all', label: 'All products' },
  { value: 'category', label: 'One category' },
  { value: 'product', label: 'One product' },
];

// Create/edit modal for a promotion, used by AdminPromotionsPage. Scope drives which of
// category/product picker shows -- same conditional-field pattern as StockAdjustModal's reason.
export default function PromotionFormModal({ open, promotion, submitting, onCancel, onSubmit }) {
  const [form] = Form.useForm();
  const isEdit = !!promotion;
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!open) return;
    categoryService.getCategories().then(setCategories).catch(() => {});
    productService.getProducts({ limit: 100 }).then((data) => setProducts(data.items)).catch(() => {});
  }, [open]);

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    if (promotion) {
      form.setFieldsValue({
        name: promotion.name,
        description: promotion.description ?? '',
        discountType: promotion.discountType,
        discountValue: Number(promotion.discountValue),
        scope: promotion.scope,
        categoryId: promotion.categoryId ?? undefined,
        productId: promotion.productId ?? undefined,
        dateRange: [dayjs(promotion.startDate), dayjs(promotion.endDate)],
        isActive: promotion.isActive,
      });
    } else {
      form.setFieldsValue({ discountType: 'percentage', scope: 'all', isActive: true });
    }
  }, [open, promotion, form]);

  function handleOk() {
    form.validateFields().then(({ dateRange, ...values }) => {
      onSubmit({
        ...values,
        // scope-irrelevant ids would otherwise linger from a previous edit/selection
        categoryId: values.scope === 'category' ? values.categoryId : undefined,
        productId: values.scope === 'product' ? values.productId : undefined,
        // the picker is day-granularity only -- push the end day to its last moment so
        // the promo covers that whole day instead of expiring at its first second
        startDate: dateRange[0].startOf('day').toISOString(),
        endDate: dateRange[1].endOf('day').toISOString(),
      });
    });
  }

  return (
    <Modal
      title={isEdit ? `Edit ${promotion.name}` : 'New promotion'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={submitting}
      okText={isEdit ? 'Save' : 'Create'}
      width={560}
      destroyOnClose
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Name is required' }]}>
          <Input placeholder="e.g. Weekend Sale" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={2} />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item label="Discount type" name="discountType" rules={[{ required: true }]}>
            <Select options={DISCOUNT_TYPE_OPTIONS} />
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(prev, cur) => prev.discountType !== cur.discountType}>
            {({ getFieldValue }) => {
              const isPercentage = getFieldValue('discountType') === 'percentage';
              return (
                <Form.Item
                  label={isPercentage ? 'Discount (%)' : 'Discount (฿)'}
                  name="discountValue"
                  rules={[
                    { required: true, message: 'Enter a discount value' },
                    { type: 'number', min: 0.01, message: 'Must be greater than 0' },
                    ...(isPercentage
                      ? [{ type: 'number', max: 100, message: 'Percentage discounts max out at 100' }]
                      : []),
                  ]}
                >
                  <InputNumber min={0} max={isPercentage ? 100 : undefined} style={{ width: '100%' }} />
                </Form.Item>
              );
            }}
          </Form.Item>
        </div>

        <Form.Item label="Applies to" name="scope" rules={[{ required: true }]}>
          <Select options={SCOPE_OPTIONS} />
        </Form.Item>

        <Form.Item noStyle shouldUpdate={(prev, cur) => prev.scope !== cur.scope}>
          {({ getFieldValue }) => {
            const scope = getFieldValue('scope');
            if (scope === 'category') {
              return (
                <Form.Item
                  label="Category"
                  name="categoryId"
                  rules={[{ required: true, message: 'Pick a category' }]}
                >
                  <Select
                    placeholder="Select a category"
                    options={categories.map((c) => ({ value: c.categoryId, label: c.name }))}
                  />
                </Form.Item>
              );
            }
            if (scope === 'product') {
              return (
                <Form.Item
                  label="Product"
                  name="productId"
                  rules={[{ required: true, message: 'Pick a product' }]}
                >
                  <Select
                    showSearch
                    placeholder="Select a product"
                    optionFilterProp="label"
                    options={products.map((p) => ({ value: p.productId, label: p.name }))}
                  />
                </Form.Item>
              );
            }
            return null;
          }}
        </Form.Item>

        <Form.Item
          label="Active period"
          name="dateRange"
          rules={[{ required: true, message: 'Pick a start and end date' }]}
        >
          <DatePicker.RangePicker style={{ width: '100%' }} format="MMM D, YYYY" />
        </Form.Item>

        <Form.Item label="Active" name="isActive" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
}
