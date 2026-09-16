import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Flex, Select, Spin, Switch, Table, Typography } from 'antd';
import { useAuth } from '../context/AuthContext.jsx';
import { employeeService } from '../services/employeeService.js';

const ROLE_OPTIONS = [
  { value: 'cashier', label: 'Cashier' },
  { value: 'admin', label: 'Admin' },
];

function accountType(employee) {
  if (employee.googleId) return 'Google';
  if (employee.facebookId) return 'Facebook';
  return 'Local';
}

export default function AdminEmployeesPage() {
  const { profile } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // employeeId -> the field currently being saved for that row ('role' | 'isActive'),
  // so only that row's control shows a spinner instead of the whole table.
  const [savingField, setSavingField] = useState({});

  const loadEmployees = useCallback(() => {
    setLoading(true);
    setError(null);
    employeeService
      .getAllEmployees()
      .then(setEmployees)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  async function handleFieldChange(employeeId, field, value) {
    const previous = employees;
    setSavingField((s) => ({ ...s, [employeeId]: field }));
    setEmployees((rows) => rows.map((row) => (row.employeeId === employeeId ? { ...row, [field]: value } : row)));

    try {
      await employeeService.updateEmployee(employeeId, { [field]: value });
    } catch {
      setEmployees(previous); // the axios interceptor already toasted the error
    } finally {
      setSavingField((s) => {
        const next = { ...s };
        delete next[employeeId];
        return next;
      });
    }
  }

  const columns = useMemo(
    () => [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (name, row) => (
          <Flex align="center" gap={8}>
            <Typography.Text>{name}</Typography.Text>
            {row.employeeId === profile?.employeeId && (
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                (you)
              </Typography.Text>
            )}
          </Flex>
        ),
      },
      { title: 'Email', dataIndex: 'email', key: 'email' },
      {
        title: 'Account',
        key: 'account',
        render: (_, row) => (
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            {accountType(row)}
          </Typography.Text>
        ),
      },
      {
        title: 'Role',
        key: 'role',
        render: (_, row) => (
          <Select
            value={row.role}
            options={ROLE_OPTIONS}
            variant="borderless"
            style={{ width: 110 }}
            disabled={row.employeeId === profile?.employeeId}
            loading={savingField[row.employeeId] === 'role'}
            onChange={(value) => handleFieldChange(row.employeeId, 'role', value)}
          />
        ),
      },
      {
        title: 'Status',
        key: 'status',
        render: (_, row) => (
          <Flex align="center" gap={8}>
            <Switch
              size="small"
              checked={row.isActive}
              disabled={row.employeeId === profile?.employeeId}
              loading={savingField[row.employeeId] === 'isActive'}
              onChange={(checked) => handleFieldChange(row.employeeId, 'isActive', checked)}
            />
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              {row.isActive ? 'Active' : 'Pending'}
            </Typography.Text>
          </Flex>
        ),
      },
    ],
    [profile, savingField],
  );

  if (loading) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert type="error" showIcon message="Couldn't load employees" description={error} />;
  }

  return (
    <Table
      size="small"
      rowKey="employeeId"
      dataSource={employees}
      columns={columns}
      pagination={{
        pageSize: 20,
        showSizeChanger: true,
        pageSizeOptions: [10, 20, 50, 100],
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
      }}
    />
  );
}
