import { useEffect } from 'react';
import { Form, Input, InputNumber, Modal } from 'antd';

// Edit modal for a customer's contact info and loyalty points -- no create here,
// customers only come into existence by registering themselves on the storefront.
export default function CustomerFormModal({ open, customer, submitting, onCancel, onSubmit }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open || !customer) return;
    form.resetFields();
    form.setFieldsValue({
      name: customer.name,
      phone: customer.phone ?? '',
      address: customer.address ?? '',
      pointBalance: customer.pointBalance,
    });
  }, [open, customer, form]);

  function handleOk() {
    form.validateFields().then((values) => {
      const payload = { ...values };
      Object.keys(payload).forEach((key) => {
        if (payload[key] === '') delete payload[key];
      });
      onSubmit(payload);
    });
  }

  return (
    <Modal
      title={customer ? `Edit ${customer.name}` : 'Edit customer'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={submitting}
      okText="Save"
      destroyOnClose
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Name is required' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Phone" name="phone">
          <Input />
        </Form.Item>
        <Form.Item label="Address" name="address">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item label="Loyalty points" name="pointBalance" rules={[{ type: 'number', min: 0 }]}>
          <InputNumber min={0} precision={0} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
