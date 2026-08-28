import { useState } from 'react';
import { Button } from 'antd';
import ProductCard from './ProductCard.jsx';

// Paged "Show More" grid, ported from legacy/js/app.js:608-633 (home) and :819-846 (related products)

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
        <Button className="btn btn-outline show-more" onClick={() => setVisibleCount((c) => c + pageSize)}>
          Show More
        </Button>
      )}
    </>
  );
}
