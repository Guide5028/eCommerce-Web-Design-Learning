import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, ConfigProvider, Flex, InputNumber, Tabs } from 'antd';
import { FacebookOutlined, LinkedinOutlined, TwitterOutlined } from '@ant-design/icons';
import { useProducts } from '../context/ProductsContext.jsx';
import { useStore } from '../context/StoreContext.jsx';
import { formatPrice, colorName } from '../utils/format.js';
import { resolveImage } from '../utils/resolveImage.js';
import { COLOR_TEXT } from '../theme.js';
import StarRating from '../components/StarRating.jsx';
import ProductGrid from '../components/ProductGrid.jsx';
import asgaardGallery1 from '../assets/images/product-asgaard-gallery-1.jpg';
import asgaardGallery2 from '../assets/images/product-asgaard-gallery-2.jpg';
import styles from '../styles/pages/ProductDetailPage.module.css';

// Single product page: gallery, options, add-to-cart, tabs, and related products.

// Scoped AntD tokens for the Add To Cart / Compare buttons and qty input on this page.
const actionsRowButtonTheme = {
  components: {
    Button: {
      defaultColor: COLOR_TEXT,
      defaultBorderColor: COLOR_TEXT,
      defaultHoverBg: COLOR_TEXT,
      defaultHoverColor: '#fff',
      defaultHoverBorderColor: COLOR_TEXT,
      defaultGhostColor: COLOR_TEXT,
      defaultGhostBorderColor: '#000',
      borderRadius: 15,
      controlHeight: 64,
      contentFontSize: 16,
    },
    // InputNumber's height is padding-driven, unlike Button's controlHeight
    InputNumber: {
      paddingBlock: 20,
    },
  },
};

const REVIEWS = [
  { author: 'Alex M.', text: 'Comfortable and well-made, exactly as pictured. Delivery was quick too.' },
  { author: 'Jordan K.', text: 'Really happy with the build quality. Took a star off only because assembly took longer than expected.' },
  { author: 'Sam R.', text: 'Looks even better in person. Would buy again.' },
];

export default function ProductDetailPage() {
  const { id } = useParams();
  const { products, loading } = useProducts();
  const { addToCart } = useStore();

  const product = products.find((p) => (p.productId ?? p.id) === Number(id));

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
    setSelectedSize(product.sizes?.[0] ?? null); // not every product has size/color variants
    setSelectedColor(product.colors?.[0] ?? null);
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
    addToCart(product.productId ?? product.id, qty);
    setAdded(true);
    window.setTimeout(() => {
      setAdded(false);
      busyRef.current = false;
    }, 1200);
  }

  const baseRating = Math.round(product.rating ?? 0);
  const reviewRatings = [Math.min(5, baseRating), Math.max(1, baseRating - 1), Math.min(5, baseRating)];

  const tabItems = [
    {
      key: 'description',
      label: 'Description',
      children: (
        <div className={styles.tabPanel}>
          {/* falls back to the plain description string if there's no paragraph array */}
          {(product.descriptionParagraphs ?? [product.description]).filter(Boolean).map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
          {/* preserved from the legacy design: these two images are a static showcase, not product-specific */}
          <div className={styles.descriptionGallery}>
            <div className={styles.descriptionGalleryItem}>
              <img src={asgaardGallery1} alt="Cream modular sofa, straight configuration" />
            </div>
            <div className={styles.descriptionGalleryItem}>
              <img src={asgaardGallery2} alt="Cream modular sofa, chaise configuration" />
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'additional',
      label: 'Additional Information',
      children: (
        <div className={styles.tabPanel}>
          <table className={styles.specTable}>
            <tbody>
              <tr>
                <th scope="row">Weight</th>
                <td>{product.weight}</td>
              </tr>
              <tr>
                <th scope="row">Dimensions</th>
                <td>{product.dimensions}</td>
              </tr>
              <tr>
                <th scope="row">Material</th>
                <td>{product.material}</td>
              </tr>
              <tr>
                <th scope="row">Color</th>
                <td>{(product.colors ?? []).map(colorName).join(', ') || '—'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
    {
      key: 'reviews',
      label: `Reviews [${product.reviewCount ?? 0}]`,
      children: (
        <div className={styles.tabPanel}>
          <ul className={styles.reviewList}>
            {REVIEWS.map((review, i) => (
              <li className={styles.reviewItem} key={review.author}>
                <div className={styles.reviewHeader}>
                  <span className={styles.reviewAuthor}>{review.author}</span>
                  <StarRating value={reviewRatings[i]} />
                </div>
                <p className={styles.reviewText}>{review.text}</p>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
  ];

  const related = products.filter((p) => (p.productId ?? p.id) !== (product.productId ?? product.id));
  const relatedProducts = related.length ? related : products;

  return (
    <main>
      <nav className={styles.productBreadcrumb} aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="breadcrumb-sep">&rsaquo;</span>
        <Link to="/shop">Shop</Link>
        <span className="breadcrumb-sep">&rsaquo;</span>
        <span className={styles.breadcrumbDivider} />
        <span aria-current="page">{product.name}</span>
      </nav>

      <section className={styles.productDetail}>
        <div className={styles.productGallery}>
          <div className={styles.productThumbs}>
            {[0, 1, 2, 3].map((i) => (
              <button
                key={i}
                type="button"
                className={`${styles.productThumbItem}${selectedThumb === i ? ` ${styles.isActive}` : ''}`}
                aria-label={`Show image ${i + 1}`}
                onClick={() => setSelectedThumb(i)}
              >
                <img src={resolveImage(product.imageUrl || product.image)} alt={product.alt || product.name} />
              </button>
            ))}
          </div>

          <div className={styles.productMainImage}>
            <img src={resolveImage(product.imageUrl || product.image)} alt={product.alt || product.name} />
          </div>
        </div>

        <div className={styles.singleProductInfo}>
          <h1>{product.name}</h1>
          <p className={styles.singleProductPrice}>{formatPrice(product)}</p>

          <div className={styles.productRating}>
            <StarRating value={product.rating ?? 0} />
            <span className={styles.ratingDivider} />
            <span className={styles.ratingCount}>
              {product.reviewCount ?? 0} {(product.reviewCount ?? 0) === 1 ? 'Customer Review' : 'Customer Reviews'}
            </span>
          </div>

          <p className={styles.productDescription}>{product.description}</p>

          <div className={styles.productOption} hidden={!product.sizes?.length}>
            <p className={styles.productOptionLabel}>Size</p>
            <div className={styles.sizeOptions}>
              {(product.sizes ?? []).map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`${styles.sizeBtn}${selectedSize === size ? ` ${styles.isActive}` : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.productOption} hidden={!product.colors?.length}>
            <p className={styles.productOptionLabel}>Color</p>
            <div className={styles.colorOptions}>
              {(product.colors ?? []).map((hex) => (
                <button
                  key={hex}
                  type="button"
                  className={`${styles.colorSwatch}${selectedColor === hex ? ` ${styles.isActive}` : ''}`}
                  style={{ '--swatch-color': hex }}
                  aria-label={`Color ${colorName(hex)}`}
                  onClick={() => setSelectedColor(hex)}
                />
              ))}
            </div>
          </div>

          <div className={styles.productActionsRow}>
            <ConfigProvider theme={actionsRowButtonTheme}>
              <InputNumber
                className={styles.qtyInput}
                min={1}
                value={qty}
                onChange={(value) => setQty(value || 1)}
              />
              <Button className={styles.btnAddToCart} onClick={handleAddToCart}>
                {added ? 'Added!' : 'Add To Cart'}
              </Button>
              <Button ghost className={styles.btnCompare}>+ Compare</Button>
            </ConfigProvider>
          </div>

          <hr className={styles.productDivider} />

          <dl className={styles.productMeta}>
            <div className={styles.productMetaRow}>
              <dt>SKU</dt>
              <dd>: {product.sku}</dd>
            </div>
            <div className={styles.productMetaRow}>
              <dt>Category</dt>
              <dd>: {product.category}</dd>
            </div>
            <div className={styles.productMetaRow} hidden={!product.tags?.length}>
              <dt>Tags</dt>
              <dd>: {(product.tags ?? []).join(', ')}</dd>
            </div>
            <div className={styles.productMetaRow}>
              <dt>Share</dt>
              <dd className={styles.productShare}>
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

      <section className={styles.productTabsSection}>
        <Tabs defaultActiveKey="description" centered items={tabItems} />
      </section>

      <Flex vertical align="center" component="section" className={styles.relatedProducts}>
        <h2>Related Products</h2>
        <ProductGrid products={relatedProducts} pageSize={4} />
      </Flex>
    </main>
  );
}
