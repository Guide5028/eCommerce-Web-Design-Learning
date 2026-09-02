import { useState } from 'react';
import { Button, ConfigProvider } from 'antd';
import ProductCard from './ProductCard.jsx';
import { COLOR_PRIMARY } from '../../theme.js';
import styles from '../../styles/components/product/ProductGrid.module.css';

// Paged "Show More" grid, ported from legacy/js/app.js:608-633 (home) and :819-846 (related products)

// `ghost` gives the transparent-bg / colored-border-and-text look for free once the
// ghost color tokens are pointed at the brand color -- AntD's own ghost variant is
// built exactly for "outlined button on a plain background". The hover-fills-solid
// flourish isn't a token (ghost's own hover just adjusts the border), so that part
// stays a couple of lines of plain CSS in the module.
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
          <ProductCard product={product} key={product.id} />
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
