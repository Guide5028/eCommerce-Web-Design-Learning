import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Badge, Drawer, Input, Menu, Popover } from 'antd';
import {
  MenuOutlined,
  SearchOutlined,
  UserOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { useStore } from '../../store/StoreContext.jsx';

const NAV_ITEMS = [
  { key: '/', label: 'Home' },
  { key: '/shop', label: 'Shop' },
  { key: '/about', label: 'About' },
  { key: '/contact', label: 'Contact' },
];

export default function SiteHeader() {
  const { cartCount, favoriteCount } = useStore();
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
    <header>
      <Link to="/" className="logo">
        <img src="/images/logo-furniro.svg" alt="Furniro" />
        <span>Furniro</span>
      </Link>

      <button
        type="button"
        className="nav-toggle"
        aria-label="Toggle menu"
        aria-controls="site-nav"
        aria-expanded={drawerOpen}
        onClick={() => setDrawerOpen(true)}
      >
        <MenuOutlined style={{ fontSize: 20 }} />
      </button>

      <nav id="site-nav" className="site-nav-desktop">
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={NAV_ITEMS}
          onClick={handleNavClick}
        />
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

      <div className="header-icons">
        <Link to="/login" aria-label="Account">
          <UserOutlined style={{ fontSize: 22 }} />
        </Link>

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
          <button
            type="button"
            className="search-toggle-btn"
            id="search-toggle-btn"
            aria-expanded={searchOpen}
            aria-label="Search"
          >
            <SearchOutlined style={{ fontSize: 22 }} />
          </button>
        </Popover>

        <Link to="/favorite" className="icon-link" aria-label="Wishlist">
          <Badge count={favoriteCount} size="small" offset={[-2, 2]}>
            <HeartOutlined style={{ fontSize: 22 }} />
          </Badge>
        </Link>

        <Link to="/cart" className="icon-link" aria-label="Cart">
          <Badge count={cartCount} size="small" offset={[-2, 2]}>
            <ShoppingCartOutlined style={{ fontSize: 22 }} />
          </Badge>
        </Link>
      </div>
    </header>
  );
}
