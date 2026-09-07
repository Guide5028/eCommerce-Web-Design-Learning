import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, ConfigProvider, Flex } from 'antd';
import { HeartOutlined, HeartFilled, ShareAltOutlined, SwapOutlined } from '@ant-design/icons';
import { useStore } from '../context/StoreContext.jsx';
import { resolveImage } from '../utils/resolveImage.js';
import styles from '../styles/components/ProductCard.module.css';

const addCartButtonTheme = {
  components: {
    Button: {
      defaultColor: '#B88E2F',
      defaultHoverBg: '#B88E2F',
      defaultHoverColor: '#fff',
      borderRadius: 0,
      contentFontSize: 16,
      controlHeight: 50,
      paddingInline: 28,
    },
  },
};

export default function ProductCard({ product }) {
  const { addToCart, isFavorite, toggleFavorite } = useStore();
  const [added, setAdded] = useState(false);
  const busyRef = useRef(false);

  const pId = product.productId || product.id; // pos-api's id field
  const liked = isFavorite ? isFavorite(pId) : false;
  const detailHref = `/product/${pId}`;

  function handleAddToCart(event) {
    event.preventDefault();
    event.stopPropagation();
    if (busyRef.current) return;
    busyRef.current = true;

    if (addToCart) addToCart(pId, 1);
    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
      busyRef.current = false;
    }, 1200);
  }

  function handleToggleLike(event) {
    event.preventDefault();
    event.stopPropagation();
    if (toggleFavorite) toggleFavorite(pId);
  }

  function handlePlaceholderClick(event) {
    event.preventDefault();
  }

  // badge is "new"/"sale" (case-insensitive) or a plain string like "-30%" from pos-api.
  const badgeLabel = product.badge ? (product.badge.toLowerCase() === 'new' ? 'New' : product.badge) : null;
  const badgeTypeClass = product.badge?.toLowerCase() === 'new' ? styles.new : styles.sale;

  return (
    // fixed height keeps the grid aligned
    <div className={styles.productCard} data-product-id={pId} style={{ height: '100%' }}>
      <div className={styles.productThumb}>
        <Link to={detailHref}>
          {/* product image, resolved from imageUrl (or bundled local image) */}
          <img
            src={resolveImage(product.imageUrl || product.image)} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </Link>
        {badgeLabel && (
          <span className={`${styles.badge} ${badgeTypeClass}`}>{badgeLabel}</span>
        )}
      </div>

      <div className={styles.productInfo}>
        <h3 className={styles.productName}>
          <Link to={detailHref}>{product.name}</Link>
        </h3>
        <p className={styles.productCategory}>{product.category}</p>
        <Flex align="center" gap={12} className={styles.productPrice}>
          {/* price formatted as Thai baht */}
          <span className={styles.price}>
            ฿{Number(product.price).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
          {product.priceOld && (
            <span className={styles.priceOld}>
              ฿{Number(product.priceOld).toLocaleString()}
            </span>
          )}
        </Flex>
        {/* stock quantity from pos-api */}
        <span style={{ fontSize: '11px', color: '#9F9F9F', display: 'block', marginTop: '4px' }}>
          คลังคงเหลือ: {product.stockQuantity ?? 0} ชิ้น
        </span>
      </div>

      <Flex vertical align="center" justify="center" gap={16} className={styles.productOverlay}>
        <ConfigProvider theme={addCartButtonTheme}>
          <Button className={styles.btnAddCart} onClick={handleAddToCart}>
            {added ? 'Added!' : 'Add to cart'}
          </Button>
        </ConfigProvider>
        <Flex align="center" gap={20} className={styles.productActions}>
          <Flex align="center" gap={6} component="a" href="#top" className={styles.actionLink} onClick={handlePlaceholderClick}>
            <ShareAltOutlined />
            Share
          </Flex>
          <Flex align="center" gap={6} component="a" href="#top" className={styles.actionLink} onClick={handlePlaceholderClick}>
            <SwapOutlined />
            Compare
          </Flex>
          <Flex
            align="center"
            gap={6}
            component="a"
            href="#top"
            className={`${styles.actionLink}${liked ? ` ${styles.liked}` : ''}`}
            aria-pressed={liked ? 'true' : 'false'}
            onClick={handleToggleLike}
          >
            {liked ? <HeartFilled /> : <HeartOutlined />}
            {liked ? 'Liked' : 'Like'}
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
}
