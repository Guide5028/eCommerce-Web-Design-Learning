import { useState } from 'react';
import { Button, ConfigProvider } from 'antd';
import ProductCard from './ProductCard.jsx';
import { COLOR_PRIMARY } from '../theme.js';
import styles from '../styles/components/ProductGrid.module.css';

// Paged product grid with a "Show More" button, used on Home and Related Products.
const showMoreButtonTheme = {
  components: {
    Button: {
      defaultGhostColor: COLOR_PRIMARY,
      defaultGhostBorderColor: COLOR_PRIMARY,
      contentFontSize: 16,
    },
  },
};

export default function ProductGrid({ products, pageSize = 8, gridClassName = 'products-grid' }) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const visible = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  return (
    <>
      <div className={gridClassName}>
        {visible.map((product) => (
          <ProductCard product={product} key={product.productId ?? product.id} />
        ))}
      </div>
      {hasMore && (
        <ConfigProvider theme={showMoreButtonTheme}>
          <Button ghost className={styles.showMore} onClick={() => setVisibleCount((c) => c + pageSize)}>
            Show More
          </Button>
        </ConfigProvider>
      )}
    </>
  );
}
