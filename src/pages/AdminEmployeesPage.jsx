import { useEffect, useState } from 'react';
import { Select, Spin, Switch, Table, Tag, message } from 'antd';
import { getEmployees, updateEmployee } from '../services/employeeService.js';
import { useAuth } from '../context/AuthContext.jsx';
import PageHero from '../components/PageHero.jsx';
import styles from '../styles/pages/Admin.module.css';

const ROLE_OPTIONS = [
  { value: 'cashier', label: 'Cashier' },
  { value: 'admin', label: 'Admin' },
];

// Admin page for approving sign-ups and managing employee roles/active status.
export default function AdminEmployeesPage() {
  const { profile } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const data = await getEmployees();
      // surface pending sign-ups (isActive: false) first, not alphabetical order
      setEmployees(data.slice().sort((a, b) => Number(a.isActive) - Number(b.isActive)));
    } catch (err) {
      // client's response interceptor already toasts the error message
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpdate(employeeId, patch) {
    setSavingId(employeeId);
    try {
      const updated = await updateEmployee(employeeId, patch);
      setEmployees((prev) => prev.map((e) => (e.employeeId === employeeId ? updated : e)));
      message.success(`Updated ${updated.name}`);
    } catch (err) {
      // interceptor already toasted it; nothing else to do
    } finally {
      setSavingId(null);
    }
  }

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Role',
      key: 'role',
      render: (_, row) => (
        <Select
          value={row.role}
          // pos-api itself refuses to let an admin edit their own row; disable it here too
          disabled={row.employeeId === profile.employeeId || savingId === row.employeeId}
          style={{ width: 130 }}
          options={ROLE_OPTIONS}
          onChange={(value) => handleUpdate(row.employeeId, { role: value })}
        />
      ),
    },
    {
      title: 'Active',
      key: 'isActive',
      render: (_, row) => (
        <Switch
          checked={row.isActive}
          disabled={row.employeeId === profile.employeeId || savingId === row.employeeId}
          onChange={(checked) => handleUpdate(row.employeeId, { isActive: checked })}
        />
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, row) => {
        if (!row.isActive) {
          // isActive:false + profileComplete:false = a brand-new, unapproved social sign-up
          return (
            <Tag color={row.profileComplete ? 'default' : 'warning'}>
              {row.profileComplete ? 'Disabled' : 'Pending approval'}
            </Tag>
          );
        }
        return row.profileComplete ? <Tag color="success">Active</Tag> : <Tag color="processing">Needs profile</Tag>;
      },
    },
  ];

  return (
    <main>
      <PageHero title="Employees" />

      <section className={styles.adminSection}>
        {loading ? (
          <div className={styles.adminLoading}>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            className={styles.adminTable}
            columns={columns}
            dataSource={employees}
            rowKey="employeeId"
            pagination={false}
          />
        )}
      </section>
    </main>
  );
}
