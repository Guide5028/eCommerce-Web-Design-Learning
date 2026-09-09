import { useEffect, useState } from 'react';
import { Button, Flex, Popconfirm, Spin, Switch, Table, Tag, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
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

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (value) => value || <Tag>—</Tag>,
    },
    {
      title: 'Active',
      key: 'isActive',
      render: (_, row) => (
        <Switch
          checked={row.isActive}
          loading={savingId === row.categoryId}
          onChange={(checked) => handleToggleActive(row, checked)}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <Flex gap={8}>
          <Button size="small" onClick={() => openEdit(row)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this category?"
            description="Products still using it must be reassigned or disabled first."
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
          Add category
        </Button>
      </Flex>

      {loading ? (
        <div style={{ padding: '80px 0', textAlign: 'center' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table columns={columns} dataSource={categories} rowKey="categoryId" pagination={false} />
      )}

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
