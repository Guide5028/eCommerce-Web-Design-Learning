import { useEffect, useState } from 'react';
import { List, Tag, message } from 'antd';
import { customerService } from '../services/customerService.js';
import AdminItemCard from '../components/AdminItemCard.jsx';
import CustomerFormModal from '../components/CustomerFormModal.jsx';

// Admin page for viewing shoppers and adjusting their contact info/loyalty points.
// No create/delete here -- accounts only come from the storefront's own registration.
export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await customerService.getCustomers();
      setCustomers(data);
    } catch {
      // interceptor already toasted it
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openEdit(customer) {
    setEditingCustomer(customer);
    setModalOpen(true);
  }

  async function handleSubmit(values) {
    setSubmitting(true);
    try {
      const updated = await customerService.updateCustomer(editingCustomer.customerId, values);
      setCustomers((prev) => prev.map((c) => (c.customerId === updated.customerId ? updated : c)));
      message.success(`Updated ${updated.name}`);
      setModalOpen(false);
    } catch {
      // interceptor already toasted it -- keep the modal open so they can fix it
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <List
        loading={loading}
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4 }}
        dataSource={customers}
        rowKey="customerId"
        pagination={{ pageSize: 20, showSizeChanger: false }}
        locale={{ emptyText: 'No customers yet -- they show up here once shoppers register.' }}
        renderItem={(customer) => (
          <List.Item>
            <AdminItemCard
              title={customer.name}
              tags={[<Tag key="phone">{customer.phone || 'No phone'}</Tag>]}
              highlight={`${customer.pointBalance} pts`}
              fields={[
                { label: 'Email', value: customer.email },
                { label: 'Address', value: customer.address || '—' },
              ]}
              actions={[
                <a key="edit" onClick={() => openEdit(customer)}>
                  Edit
                </a>,
              ]}
            />
          </List.Item>
        )}
      />

      <CustomerFormModal
        open={modalOpen}
        customer={editingCustomer}
        submitting={submitting}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
