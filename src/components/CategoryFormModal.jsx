import { useEffect } from 'react';
import { Form, Input, Modal, Switch } from 'antd';

// Create/edit modal for a category, used by AdminCategoriesPage.
export default function CategoryFormModal({ open, category, submitting, onCancel, onSubmit }) {
  const [form] = Form.useForm();
  const isEdit = !!category;

  useEffect(() => {
    if (!open) return;
    form.resetFields();
    if (category) {
      form.setFieldsValue({
        name: category.name,
        description: category.description ?? '',
        isActive: category.isActive,
      });
    } else {
      form.setFieldsValue({ isActive: true });
    }
  }, [open, category, form]);

  function handleOk() {
    form.validateFields().then(onSubmit);
  }

  return (
    <Modal
      title={isEdit ? `Edit ${category.name}` : 'Add category'}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={submitting}
      okText={isEdit ? 'Save' : 'Create'}
      destroyOnClose
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Category name is required' }]}>
          <Input placeholder="e.g. Living Room" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item label="Active" name="isActive" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
}
