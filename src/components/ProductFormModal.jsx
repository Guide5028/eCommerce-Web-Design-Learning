import { useEffect, useState } from 'react';
import { AutoComplete, Button, Form, Input, InputNumber, Modal, Select, Switch, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { categoryService } from '../services/categoryService.js';
import { productService } from '../services/productService.js';

const BADGE_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'new', label: 'New' },
  { value: 'sale', label: 'Sale' },
];

// Create/edit modal for a product (name, price, category, badge, image, etc.), used by AdminProductsPage.
export default function ProductFormModal({ open, product, submitting, onCancel, onSubmit }) {
  const [form] = Form.useForm();
  const isEdit = !!product;
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!open) return;
    categoryService
      .getCategories()
      .then((cats) => setCategoryOptions(cats.map((c) => ({ value: c.name }))))
      .catch(() => {});
  }, [open]);

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    if (product) {
      form.setFieldsValue({
        name: product.name,
        barcode: product.barcode ?? '',
        category: product.category ?? '',
        price: Number(product.price),
        priceOld: product.priceOld ? Number(product.priceOld) : undefined,
        badge: (product.badge ?? '').toLowerCase(), // schema is lowercase-only, some old rows aren't
        description: product.description ?? '',
        sku: product.sku ?? '',
        weight: product.weight ?? '',
        dimensions: product.dimensions ?? '',
        material: product.material ?? '',
        isActive: product.isActive,
      });
    } else {
      form.setFieldsValue({ isActive: true, stockQuantity: 0 });
    }
  }, [open, product, form]);

  function handleOk() {
    form.validateFields().then((values) => {
      // strip empty-string fields so unique columns (barcode/sku) don't collide on ""
      const payload = { ...values };
      Object.keys(payload).forEach((key) => {
        if (payload[key] === '') delete payload[key];
      });
      onSubmit(payload);
    });
  }

  async function handleImageUpload({ file }) {
    setUploading(true);
    try {
      await productService.uploadProductImage(product.productId, file);
      message.success('Image uploaded');
    } catch (err) {
      // interceptor already toasted it
    } finally {
      setUploading(false);
    }
  }

  return (
    <Modal
      title={isEdit ? `Edit ${product.name}` : 'Add product'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={submitting}
      okText={isEdit ? 'Save' : 'Create'}
      width={640}
      destroyOnClose
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Name is required' }]}>
          <Input />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* backend requires price > 0 (z.number().positive()), not just >= 0 */}
          <Form.Item
            label="Price (฿)"
            name="price"
            rules={[
              { required: true, message: 'Price is required' },
              { type: 'number', min: 0.01, message: 'Price must be greater than 0' },
            ]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="Old price (for a sale badge)"
            name="priceOld"
            rules={[{ type: 'number', min: 0.01, message: 'Old price must be greater than 0' }]}
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item label="Category" name="category">
            <AutoComplete options={categoryOptions} placeholder="Type to search or create" filterOption />
          </Form.Item>
          <Form.Item label="Badge" name="badge">
            <Select options={BADGE_OPTIONS} />
          </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item label="Barcode" name="barcode">
            <Input />
          </Form.Item>
          <Form.Item label="SKU" name="sku">
            <Input />
          </Form.Item>
        </div>

        {!isEdit && (
          <Form.Item
            label="Initial stock"
            name="stockQuantity"
            tooltip="Recorded as a 'restock' stock history entry -- once created, stock only changes through Adjust stock."
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        )}

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={3} />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <Form.Item label="Weight" name="weight">
            <Input placeholder="e.g. 5 kg" />
          </Form.Item>
          <Form.Item label="Dimensions" name="dimensions">
            <Input placeholder="e.g. 45 x 50 x 80 cm" />
          </Form.Item>
          <Form.Item label="Material" name="material">
            <Input />
          </Form.Item>
        </div>

        <Form.Item label="Active (visible on the storefront)" name="isActive" valuePropName="checked">
          <Switch />
        </Form.Item>

        {isEdit && (
          <Form.Item label="Product image">
            <Upload
              accept="image/jpeg,image/png,image/webp"
              showUploadList={false}
              customRequest={handleImageUpload}
              disabled={uploading}
            >
              <Button icon={<UploadOutlined />} loading={uploading}>
                Upload new image
              </Button>
            </Upload>
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt=""
                style={{ display: 'block', marginTop: 12, width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }}
              />
            )}
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}
