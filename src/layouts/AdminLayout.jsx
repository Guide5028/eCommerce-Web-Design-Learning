import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Grid, Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  PercentageOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext.jsx';
import styles from '../styles/components/AdminLayout.module.css';

const { Sider, Header, Content } = Layout;

// Sidebar nav groups, in antd Menu's own items shape -- also the single source of
// truth for the topbar title below. `key` doubles as the route path.
const NAV_ITEMS = [
  {
    key: 'overview',
    type: 'group',
    label: 'Overview',
    children: [{ key: '/admin', icon: <DashboardOutlined />, label: 'Dashboard' }],
  },
  {
    key: 'catalog',
    type: 'group',
    label: 'Catalog',
    children: [
      { key: '/admin/products', icon: <ShoppingOutlined />, label: 'Products' },
      { key: '/admin/categories', icon: <AppstoreOutlined />, label: 'Categories' },
      { key: '/admin/stock', icon: <DatabaseOutlined />, label: 'Stock' },
      { key: '/admin/promotions', icon: <PercentageOutlined />, label: 'Promotions' },
    ],
  },
  {
    key: 'sales',
    type: 'group',
    label: 'Sales',
    children: [{ key: '/admin/refunds', icon: <RollbackOutlined />, label: 'Refunds' }],
  },
  {
    key: 'people',
    type: 'group',
    label: 'People',
    children: [
      { key: '/admin/employees', icon: <TeamOutlined />, label: 'Employees' },
      { key: '/admin/customers', icon: <UserOutlined />, label: 'Customers' },
    ],
  },
];

const ALL_NAV_ITEMS = NAV_ITEMS.flatMap((section) => section.children);

// Fixed dark sidebar + topbar shell for the admin area (see the /admin routes in routes/index.jsx).
export default function AdminLayout() {
  const { profile, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const pageTitle = ALL_NAV_ITEMS.find((item) => item.key === pathname)?.label ?? 'Admin';
  // AntD's Sider drives the responsive collapse itself (breakpoint below) -- this only
  // tracks the resulting state so the rest of the page doesn't need to know why it changed.
  const [collapsed, setCollapsed] = useState(false);
  const screens = Grid.useBreakpoint();

  return (
    <Layout className={styles.shell}>
      <Sider
        breakpoint="lg"
        collapsedWidth={0}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={260}
        style={{ background: '#211D17' }}
      >
        <div className={styles.sidebarInner}>
          <div className={styles.brand}>
            <span className={styles.brandMark}>Furniro</span>
            <span className={styles.brandSub}>Admin</span>
          </div>

          <Menu
            className={styles.nav}
            theme="dark"
            mode="inline"
            items={NAV_ITEMS}
            selectedKeys={[pathname]}
            onClick={({ key }) => {
              navigate(key);
              // below the same "lg" breakpoint Sider collapses at -- close the overlay after picking a page
              if (!screens.lg) setCollapsed(true);
            }}
            style={{ background: 'transparent', borderInlineEnd: 'none' }}
          />

          <div className={styles.sidebarFooter}>
            <Link to="/" className={styles.backLink}>
              Back to store
            </Link>
            <button type="button" className={styles.logoutBtn} onClick={logout}>
              <LogoutOutlined />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </Sider>

      <Layout>
        <Header className={styles.topbar}>
          <h1 className={styles.pageTitle}>{pageTitle}</h1>

          {profile && (
            <div className={styles.adminChip}>
              <span className={styles.adminName}>{profile.name}</span>
              <span className={styles.adminRole}>{profile.role}</span>
            </div>
          )}
        </Header>

        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
