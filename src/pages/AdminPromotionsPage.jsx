import { useEffect, useState } from 'react';
import { Button, Flex, List, Popconfirm, Tag, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { promotionService } from '../services/promotionService.js';
import { categoryService } from '../services/categoryService.js';
import { productService } from '../services/productService.js';
import PromotionFormModal from '../components/PromotionFormModal.jsx';
import AdminItemCard from '../components/AdminItemCard.jsx';

const SCOPE_LABELS = { all: 'All products', category: 'Category', product: 'Product' };

function formatDiscount(promo) {
  return promo.discountType === 'percentage'
    ? `${Number(promo.discountValue)}% off`
    : `฿${Number(promo.discountValue).toLocaleString()} off`;
}

// Admin page for creating/editing/deleting promotions -- pos-api applies these
// automatically at checkout (see promotionService.getBestPromotionForProduct on the backend).
export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [promos, cats, prods] = await Promise.all([
        promotionService.getPromotions(),
        categoryService.getCategories(),
        productService.getProducts({ limit: 100 }),
      ]);
      setPromotions(promos);
      setCategories(cats);
      setProducts(prods.items);
    } catch {
      // interceptor already toasted it
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function scopeTargetName(promo) {
    if (promo.scope === 'category') return categories.find((c) => c.categoryId === promo.categoryId)?.name ?? '—';
    if (promo.scope === 'product') return products.find((p) => p.productId === promo.productId)?.name ?? '—';
    return 'All products';
  }

  function openCreate() {
    setEditingPromotion(null);
    setModalOpen(true);
  }

  function openEdit(promotion) {
    setEditingPromotion(promotion);
    setModalOpen(true);
  }

  async function handleSubmit(values) {
    setSubmitting(true);
    try {
      if (editingPromotion) {
        const updated = await promotionService.updatePromotion(editingPromotion.promotionId, values);
        setPromotions((prev) =>
          prev.map((p) => (p.promotionId === updated.promotionId ? updated : p)),
        );
        message.success(`Updated ${updated.name}`);
      } else {
        const created = await promotionService.createPromotion(values);
        setPromotions((prev) => [created, ...prev]);
        message.success(`Created ${created.name}`);
      }
      setModalOpen(false);
    } catch {
      // interceptor already toasted it -- keep the modal open so they can fix it
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(promotion) {
    try {
      await promotionService.deletePromotion(promotion.promotionId);
      setPromotions((prev) => prev.filter((p) => p.promotionId !== promotion.promotionId));
      message.success(`Deleted ${promotion.name}`);
    } catch {
      // interceptor already toasted it
    }
  }

  return (
    <>
      <Flex justify="flex-end" style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          New promotion
        </Button>
      </Flex>

      <List
        loading={loading}
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
        dataSource={promotions}
        rowKey="promotionId"
        pagination={{ pageSize: 20, showSizeChanger: false }}
        locale={{ emptyText: 'No promotions yet.' }}
        renderItem={(promotion) => {
          const now = dayjs();
          const isExpired = now.isAfter(dayjs(promotion.endDate));
          const isUpcoming = now.isBefore(dayjs(promotion.startDate));

          return (
            <List.Item>
              <AdminItemCard
                title={promotion.name}
                tags={[
                  <Tag key="scope">{SCOPE_LABELS[promotion.scope]}</Tag>,
                  !promotion.isActive ? (
                    <Tag key="status">Disabled</Tag>
                  ) : isExpired ? (
                    <Tag color="default" key="status">Expired</Tag>
                  ) : isUpcoming ? (
                    <Tag color="processing" key="status">Upcoming</Tag>
                  ) : (
                    <Tag color="success" key="status">Live</Tag>
                  ),
                ]}
                highlight={formatDiscount(promotion)}
                fields={[
                  { label: 'Applies to', value: scopeTargetName(promotion) },
                  {
                    label: 'Period',
                    value: `${dayjs(promotion.startDate).format('MMM D, YYYY')} – ${dayjs(promotion.endDate).format('MMM D, YYYY')}`,
                  },
                ]}
                actions={[
                  <EditOutlined key="edit" onClick={() => openEdit(promotion)} />,
                  <Popconfirm
                    key="delete"
                    title="Delete this promotion?"
                    onConfirm={() => handleDelete(promotion)}
                    okText="Delete"
                    okButtonProps={{ danger: true }}
                  >
                    <DeleteOutlined />
                  </Popconfirm>,
                ]}
              />
            </List.Item>
          );
        }}
      />

      <PromotionFormModal
        open={modalOpen}
        promotion={editingPromotion}
        submitting={submitting}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
