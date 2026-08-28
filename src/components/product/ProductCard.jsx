import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { HeartOutlined, HeartFilled, ShareAltOutlined, SwapOutlined } from '@ant-design/icons';
import { useStore } from '../../store/StoreContext.jsx';
import { formatPrice, formatPriceOld } from '../../utils/format.js';

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
    <div className="product-card" data-product-id={product.id}>
      <div className="product-thumb">
        <Link to={detailHref}>
          <img src={product.image} alt={product.alt} />
        </Link>
        {product.badge && (
          <span className={`badge badge--${product.badge.type}`}>{product.badge.label}</span>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">
          <Link to={detailHref}>{product.name}</Link>
        </h3>
        <p className="product-category">{product.category}</p>
        <div className="product-price">
          <span className="price">{formatPrice(product)}</span>
          {product.priceOld && <span className="price-old">{formatPriceOld(product)}</span>}
        </div>
      </div>

      <div className="product-overlay">
        <Button className="btn-add-cart" onClick={handleAddToCart}>
          {added ? 'Added!' : 'Add to cart'}
        </Button>
        <div className="product-actions">
          <a href="#top" className="action-link" onClick={handlePlaceholderClick}>
            <ShareAltOutlined />
            Share
          </a>
          <a href="#top" className="action-link" onClick={handlePlaceholderClick}>
            <SwapOutlined />
            Compare
          </a>
          <a
            href="#top"
            className={`action-link btn-like${liked ? ' is-active' : ''}`}
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
