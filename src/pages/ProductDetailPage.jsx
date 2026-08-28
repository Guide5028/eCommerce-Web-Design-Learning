import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, InputNumber, Tabs } from 'antd';
import { FacebookOutlined, LinkedinOutlined, TwitterOutlined } from '@ant-design/icons';
import { useProducts } from '../data/ProductsContext.jsx';
import { useStore } from '../store/StoreContext.jsx';
import { formatPrice, colorName } from '../utils/format.js';
import StarRating from '../components/product/StarRating.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';

// Ported from legacy/js/app.js:821-951 (single product page routing)

const REVIEWS = [
  { author: 'Alex M.', text: 'Comfortable and well-made, exactly as pictured. Delivery was quick too.' },
  { author: 'Jordan K.', text: 'Really happy with the build quality. Took a star off only because assembly took longer than expected.' },
  { author: 'Sam R.', text: 'Looks even better in person. Would buy again.' },
];

export default function ProductDetailPage() {
  const { id } = useParams();
  const { products, loading } = useProducts();
  const { addToCart } = useStore();

  const product = products.find((p) => p.id === Number(id));

  const [selectedThumb, setSelectedThumb] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const busyRef = useRef(false);

  useEffect(() => {
    if (!product) return;
    document.title = `Furniro - ${product.name}`;
    setSelectedThumb(0);
    setSelectedSize(product.sizes[0]);
    setSelectedColor(product.colors[0]);
    setQty(1);
  }, [product]);

  if (loading) return null;

  if (!product) {
    return (
      <main>
        <section className="favorite-section">
          <h2>Product not found</h2>
          <p className="favorite-empty">
            That product doesn&apos;t exist. Back to the <Link to="/shop">shop</Link>.
          </p>
        </section>
      </main>
    );
  }

  function handleAddToCart() {
    if (busyRef.current) return;
    busyRef.current = true;
    addToCart(product.id, qty);
    setAdded(true);
    window.setTimeout(() => {
      setAdded(false);
      busyRef.current = false;
    }, 1200);
  }

  const baseRating = Math.round(product.rating);
  const reviewRatings = [Math.min(5, baseRating), Math.max(1, baseRating - 1), Math.min(5, baseRating)];

  const tabItems = [
    {
      key: 'description',
      label: 'Description',
      children: (
        <div className="tab-panel">
          {product.descriptionParagraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
          {/* preserved from the legacy design: these two images are a static showcase, not product-specific */}
          <div className="description-gallery">
            <div className="description-gallery-item">
              <img src="/images/product-asgaard-gallery-1.jpg" alt="Cream modular sofa, straight configuration" />
            </div>
            <div className="description-gallery-item">
              <img src="/images/product-asgaard-gallery-2.jpg" alt="Cream modular sofa, chaise configuration" />
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'additional',
      label: 'Additional Information',
      children: (
        <div className="tab-panel">
          <table className="spec-table">
            <tbody>
              <tr>
                <th scope="row">Weight</th>
                <td className="spec-value">{product.weight}</td>
              </tr>
              <tr>
                <th scope="row">Dimensions</th>
                <td className="spec-value">{product.dimensions}</td>
              </tr>
              <tr>
                <th scope="row">Material</th>
                <td className="spec-value">{product.material}</td>
              </tr>
              <tr>
                <th scope="row">Color</th>
                <td className="spec-value">{product.colors.map(colorName).join(', ')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
    {
      key: 'reviews',
      label: `Reviews [${product.reviewCount}]`,
      children: (
        <div className="tab-panel">
          <ul className="review-list">
            {REVIEWS.map((review, i) => (
              <li className="review-item" key={review.author}>
                <div className="review-header">
                  <span className="review-author">{review.author}</span>
                  <StarRating value={reviewRatings[i]} />
                </div>
                <p className="review-text">{review.text}</p>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
  ];

  const related = products.filter((p) => p.id !== product.id);
  const relatedProducts = related.length ? related : products;

  return (
    <main>
      <nav className="product-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-sep">&rsaquo;</span>
        <Link to="/shop">Shop</Link>
        <span className="breadcrumb-sep">&rsaquo;</span>
        <span className="breadcrumb-divider" />
        <span aria-current="page">{product.name}</span>
      </nav>

      <section className="product-detail">
        <div className="product-gallery">
          <div className="product-thumbs">
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                type="button"
                className={`product-thumb-item${selectedThumb === i ? ' is-active' : ''}`}
                aria-label={`Show image ${i + 1}`}
                onClick={() => setSelectedThumb(i)}
              >
                <img src={product.image} alt={product.alt} />
              </button>
            ))}
          </div>

          <div className="product-main-image">
            <img src={product.image} alt={product.alt} />
          </div>
        </div>

        <div className="single-product-info">
          <h1>{product.name}</h1>
          <p className="single-product-price">{formatPrice(product)}</p>

          <div className="product-rating">
            <StarRating value={product.rating} />
            <span className="rating-divider" />
            <span className="rating-count">
              {product.reviewCount} {product.reviewCount === 1 ? 'Customer Review' : 'Customer Reviews'}
            </span>
          </div>

          <p className="product-description">{product.description}</p>

          <div className="product-option">
            <p className="product-option-label">Size</p>
            <div className="size-options">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`size-btn${selectedSize === size ? ' is-active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="product-option">
            <p className="product-option-label">Color</p>
            <div className="color-options">
              {product.colors.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  className={`color-swatch${selectedColor === hex ? ' is-active' : ''}`}
                  style={{ '--swatch-color': hex }}
                  aria-label={`Color ${colorName(hex)}`}
                  onClick={() => setSelectedColor(hex)}
                />
              ))}
            </div>
          </div>

          <div className="product-actions-row">
            <InputNumber
              className="qty-input"
              min={1}
              value={qty}
              onChange={(value) => setQty(value || 1)}
            />
            <Button className="btn-add-to-cart" onClick={handleAddToCart}>
              {added ? 'Added!' : 'Add To Cart'}
            </Button>
            <Button className="btn-compare">+ Compare</Button>
          </div>

          <hr className="product-divider" />

          <dl className="product-meta">
            <div className="product-meta-row">
              <dt>SKU</dt>
              <dd>: {product.sku}</dd>
            </div>
            <div className="product-meta-row">
              <dt>Category</dt>
              <dd>: {product.category}</dd>
            </div>
            <div className="product-meta-row">
              <dt>Tags</dt>
              <dd>: {product.tags.join(', ')}</dd>
            </div>
            <div className="product-meta-row">
              <dt>Share</dt>
              <dd className="product-share">
                :
                <a href="#top" aria-label="Share on Facebook" onClick={(e) => e.preventDefault()}>
                  <FacebookOutlined />
                </a>
                <a href="#top" aria-label="Share on LinkedIn" onClick={(e) => e.preventDefault()}>
                  <LinkedinOutlined />
                </a>
                <a href="#top" aria-label="Share on Twitter" onClick={(e) => e.preventDefault()}>
                  <TwitterOutlined />
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="product-tabs-section">
        <Tabs defaultActiveKey="description" centered items={tabItems} className="product-tabs" />
      </section>

      <section className="related-products">
        <h2>Related Products</h2>
        <ProductGrid products={relatedProducts} pageSize={4} />
      </section>
    </main>
  );
}
