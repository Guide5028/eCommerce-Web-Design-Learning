import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, ConfigProvider } from 'antd';
import { HeartOutlined, HeartFilled, ShareAltOutlined, SwapOutlined } from '@ant-design/icons';
import { useStore } from '../../store/StoreContext.jsx';
import { formatPrice, formatPriceOld } from '../../utils/format.js';
import { COLOR_PRIMARY } from '../../theme.js';
import styles from '../../styles/components/product/ProductCard.module.css';

// "Add to cart" is white bg + brand-colored text (AntD's type="default" bg is
// already white by default), inverting to solid brand-colored bg + white text on
// hover -- all colors, so that part is real Button component tokens. Height comes
// from controlHeight, not paddingBlock: AntD's Button always renders a literal
// `height: controlHeight` CSS property of its own (button/style/index.js) and
// hardcodes vertical padding to 0 regardless of any paddingBlock override, so
// controlHeight is the real (and only) lever -- same mechanism as Select. 50
// approximates what the original 12px vertical padding produced at 16px font:
// ~25.6px content line height + 2*12px padding =~ 50.
const addCartButtonTheme = {
  components: {
    Button: {
      defaultColor: COLOR_PRIMARY,
      defaultHoverBg: COLOR_PRIMARY,
      defaultHoverColor: '#fff',
      borderRadius: 0,
      contentFontSize: 16,
      controlHeight: 50,
      paddingInline: 28,
    },
  },
};

// Ported from legacy/js/app.js:200-229 (productCardHTML) + the add-to-cart/like click handlers
// further down in legacy/js/app.js:277-322.

export default function ProductCard({ product }) {
  const { addToCart, isFavorite, toggleFavorite } = useStore();
  const [added, setAdded] = useState(false);
  const busyRef = useRef(false);
  const liked = isFavorite(product.id);
  const detailHref = `/product/${product.id}`;

  function handleAddToCart(event) {
    event.preventDefault();
    event.stopPropagation();
    if (busyRef.current) return;
    busyRef.current = true;

    addToCart(product.id, 1);
    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
      busyRef.current = false;
    }, 1200);
  }

  function handleToggleLike(event) {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(product.id);
  }

  function handlePlaceholderClick(event) {
    event.preventDefault();
  }

  return (
    <div className={styles.productCard} data-product-id={product.id}>
      <div className={styles.productThumb}>
        <Link to={detailHref}>
          <img src={product.image} alt={product.alt} />
        </Link>
        {product.badge && (
          <span className={`${styles.badge} ${styles[product.badge.type]}`}>{product.badge.label}</span>
        )}
      </div>

      <div className={styles.productInfo}>
        <h3 className={styles.productName}>
          <Link to={detailHref}>{product.name}</Link>
        </h3>
        <p className={styles.productCategory}>{product.category}</p>
        <div className={styles.productPrice}>
          <span className={styles.price}>{formatPrice(product)}</span>
          {product.priceOld && <span className={styles.priceOld}>{formatPriceOld(product)}</span>}
        </div>
      </div>

      <div className={styles.productOverlay}>
        <ConfigProvider theme={addCartButtonTheme}>
          <Button className={styles.btnAddCart} onClick={handleAddToCart}>
            {added ? 'Added!' : 'Add to cart'}
          </Button>
        </ConfigProvider>
        <div className={styles.productActions}>
          <a href="#top" className={styles.actionLink} onClick={handlePlaceholderClick}>
            <ShareAltOutlined />
            Share
          </a>
          <a href="#top" className={styles.actionLink} onClick={handlePlaceholderClick}>
            <SwapOutlined />
            Compare
          </a>
          <a
            href="#top"
            className={`${styles.actionLink}${liked ? ` ${styles.liked}` : ''}`}
            aria-pressed={liked ? 'true' : 'false'}
            onClick={handleToggleLike}
          >
            {liked ? <HeartFilled /> : <HeartOutlined />}
            {liked ? 'Liked' : 'Like'}
          </a>
        </div>
      </div>
    </div>
  );
}
