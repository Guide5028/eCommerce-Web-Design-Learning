import { useEffect, useState } from 'react';
import { Button, Card, Flex, List, Popconfirm, Switch, Typography, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { categoryService } from '../services/categoryService.js';
import CategoryFormModal from '../components/CategoryFormModal.jsx';

// Admin page for listing, creating, editing, and deleting product categories.
export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
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
    setEditingCategory(null);
    setModalOpen(true);
  }

  function openEdit(category) {
    setEditingCategory(category);
    setModalOpen(true);
  }

  async function handleSubmit(values) {
    setSubmitting(true);
    try {
      if (editingCategory) {
        const updated = await categoryService.updateCategory(editingCategory.categoryId, values);
        setCategories((prev) => prev.map((c) => (c.categoryId === updated.categoryId ? updated : c)));
        message.success(`Updated ${updated.name}`);
      } else {
        const created = await categoryService.createCategory(values);
        setCategories((prev) => [...prev, created]);
        message.success(`Created ${created.name}`);
      }
      setModalOpen(false);
    } catch {
      // interceptor already toasted it, keep the modal open so they can fix it
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleActive(category, isActive) {
    setSavingId(category.categoryId);
    try {
      const updated = await categoryService.updateCategory(category.categoryId, { isActive });
      setCategories((prev) => prev.map((c) => (c.categoryId === updated.categoryId ? updated : c)));
    } catch {
      // interceptor already toasted it
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(category) {
    try {
      await categoryService.deleteCategory(category.categoryId);
      setCategories((prev) => prev.filter((c) => c.categoryId !== category.categoryId));
      message.success(`Deleted ${category.name}`);
    } catch {
      // interceptor already toasted the real pos-api error message
      // (e.g. "Cannot delete category — it's still used by existing products...")
    }
  }

  return (
    <>
      <Flex justify="flex-end" style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Add category
        </Button>
      </Flex>

      <List
        loading={loading}
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
        dataSource={categories}
        rowKey="categoryId"
        pagination={{ pageSize: 20, showSizeChanger: false }}
        renderItem={(category) => (
          <List.Item>
            <Card
              hoverable
              actions={[
                <EditOutlined key="edit" onClick={() => openEdit(category)} />,
                <Popconfirm
                  key="delete"
                  title="Delete this category?"
                  description="Products still using it must be reassigned or disabled first."
                  onConfirm={() => handleDelete(category)}
                  okText="Delete"
                  okButtonProps={{ danger: true }}
                >
                  <DeleteOutlined />
                </Popconfirm>,
              ]}
            >
              <Flex justify="space-between" align="flex-start" gap={8}>
                <Typography.Text strong ellipsis style={{ fontSize: 16 }}>
                  {category.name}
                </Typography.Text>
                <Switch
                  checked={category.isActive}
                  loading={savingId === category.categoryId}
                  onChange={(checked) => handleToggleActive(category, checked)}
                />
              </Flex>

              <Typography.Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0, minHeight: 44 }}>
                {category.description || 'No description'}
              </Typography.Paragraph>
            </Card>
          </List.Item>
        )}
      />

      <CategoryFormModal
        open={modalOpen}
        category={editingCategory}
        submitting={submitting}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
