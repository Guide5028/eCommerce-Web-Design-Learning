import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  TeamOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext.jsx';
import styles from '../styles/components/AdminLayout.module.css';

// Sidebar nav groups for the admin shell -- also the single source of truth for the topbar title below.
const NAV_SECTIONS = [
  {
    title: 'Overview',
    items: [{ label: 'Dashboard', to: '/admin', icon: <DashboardOutlined /> }],
  },
  {
    title: 'Catalog',
    items: [
      { label: 'Products', to: '/admin/products', icon: <ShoppingOutlined /> },
      { label: 'Categories', to: '/admin/categories', icon: <AppstoreOutlined /> },
    ],
  },
  {
    title: 'People',
    items: [{ label: 'Employees', to: '/admin/employees', icon: <TeamOutlined /> }],
  },
];

const ALL_NAV_ITEMS = NAV_SECTIONS.flatMap((section) => section.items);

// Fixed dark sidebar + topbar shell for the admin area (see the /admin routes in routes/index.jsx).
export default function AdminLayout() {
  const { profile, logout } = useAuth();
  const { pathname } = useLocation();
  const pageTitle = ALL_NAV_ITEMS.find((item) => item.to === pathname)?.label ?? 'Admin';

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>Furniro</span>
          <span className={styles.brandSub}>Admin</span>
        </div>

        <nav className={styles.nav}>
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className={styles.navSection}>
              <p className={styles.navSectionTitle}>{section.title}</p>
              <ul className={styles.navList}>
                {section.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/admin'}
                      className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link to="/" className={styles.backLink}>
            Back to store
          </Link>
          <button type="button" className={styles.logoutBtn} onClick={logout}>
            <LogoutOutlined />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <h1 className={styles.pageTitle}>{pageTitle}</h1>

          {profile && (
            <div className={styles.adminChip}>
              <span className={styles.adminName}>{profile.name}</span>
              <span className={styles.adminRole}>{profile.role}</span>
            </div>
          )}
        </header>

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
