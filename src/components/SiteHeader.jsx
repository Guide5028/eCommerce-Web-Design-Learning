import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Badge, ConfigProvider, Drawer, Flex, Input, Menu, Popover } from 'antd';
import {
  MenuOutlined,
  SearchOutlined,
  UserOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { useStore } from '../context/StoreContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import logoFurniro from '../assets/images/logo-furniro.svg';
import styles from '../styles/components/SiteHeader.module.css';

const NAV_ITEMS = [
  { key: '/', label: 'Home' },
  { key: '/shop', label: 'Shop' },
  { key: '/about', label: 'About' },
  { key: '/contact', label: 'Contact' },
];

export default function SiteHeader() {
  const { cartCount, favoriteCount } = useStore();
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // prefill the header search box when already on /shop?search=...
  useEffect(() => {
    if (location.pathname === '/shop') {
      const params = new URLSearchParams(location.search);
      setSearchValue(params.get('search') || '');
    }
  }, [location.pathname, location.search]);

  function handleSearch(value) {
    const query = value.trim();
    navigate(query ? `/shop?search=${encodeURIComponent(query)}` : '/shop');
    setSearchOpen(false);
  }

  function handleNavClick({ key }) {
    navigate(key);
    setDrawerOpen(false);
  }

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <img src={logoFurniro} alt="Furniro" />
        <span>Furniro</span>
      </Link>

      <button
        type="button"
        className={styles.navToggle}
        aria-label="Toggle menu"
        aria-controls="site-nav"
        aria-expanded={drawerOpen}
        onClick={() => setDrawerOpen(true)}
      >
        <MenuOutlined style={{ fontSize: 20 }} />
      </button>

      <nav id="site-nav" className={styles.siteNavDesktop}>
        {/* scoped to just the desktop nav, doesn't touch the mobile Drawer's Menu below */}
        <ConfigProvider theme={{ components: { Menu: { itemPaddingInline: 0, fontSize: 16 } } }}>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={NAV_ITEMS}
            onClick={handleNavClick}
          />
        </ConfigProvider>
      </nav>

      <Drawer
        title="Furniro"
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={260}
      >
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          items={NAV_ITEMS}
          onClick={handleNavClick}
        />
      </Drawer>

      <Flex align="center" className={styles.headerIcons}>
        {profile ? (
          <Popover
            trigger="click"
            placement="bottomRight"
            content={
              <div className={styles.accountPopover}>
                <p className={styles.accountName}>{profile.name}</p>
                <p className={styles.accountRole}>{profile.role}</p>
                {profile.role === 'admin' && (
                  <>
                    <Link to="/admin/employees" className={styles.logoutBtn}>
                      Employees
                    </Link>
                    <Link to="/admin/products" className={styles.logoutBtn}>
                      Products
                    </Link>
                    <Link to="/admin/categories" className={styles.logoutBtn}>
                      Categories
                    </Link>
                  </>
                )}
                <button type="button" className={styles.logoutBtn} onClick={logout}>
                  Log out
                </button>
              </div>
            }
          >
            <Flex align="center" component="button" type="button" className={styles.accountToggleBtn} aria-label="Account">
              <UserOutlined style={{ fontSize: 22 }} />
            </Flex>
          </Popover>
        ) : (
          <Link to="/login" aria-label="Account">
            <UserOutlined style={{ fontSize: 22 }} />
          </Link>
        )}

        <Popover
          open={searchOpen}
          onOpenChange={setSearchOpen}
          trigger="click"
          placement="bottomRight"
          content={
            <Input.Search
              placeholder="Search products…"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onSearch={handleSearch}
              autoFocus
              style={{ width: 260 }}
            />
          }
        >
          <Flex
            align="center"
            component="button"
            type="button"
            className={styles.searchToggleBtn}
            id="search-toggle-btn"
            aria-expanded={searchOpen}
            aria-label="Search"
          >
            <SearchOutlined style={{ fontSize: 22 }} />
          </Flex>
        </Popover>

        <Link to="/favorite" aria-label="Wishlist">
          <Badge count={favoriteCount} size="small" offset={[-2, 2]}>
            <HeartOutlined style={{ fontSize: 22 }} />
          </Badge>
        </Link>

        <Link to="/cart" aria-label="Cart">
          <Badge count={cartCount} size="small" offset={[-2, 2]}>
            <ShoppingCartOutlined style={{ fontSize: 22 }} />
          </Badge>
        </Link>
      </Flex>
    </header>
  );
}
