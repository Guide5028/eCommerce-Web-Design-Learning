import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Pagination } from 'antd';
import { useProducts } from '../data/ProductsContext.jsx';
import ShopToolbar from '../components/shop/ShopToolbar.jsx';
import ProductCard from '../components/product/ProductCard.jsx';
import FeaturesBar from '../components/layout/FeaturesBar.jsx';
import { matchesFilters, sortProducts, buildFilterTags } from '../utils/shopFilters.js';

// Ported from legacy/js/app.js:637-817 (shop toolbar filter / sort / pagination)

export default function ShopPage() {
  const { products: allProducts } = useProducts();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [sort, setSort] = useState('default');
  const [selectedTags, setSelectedTags] = useState([]);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);

  const [filterOpen, setFilterOpen] = useState(false);
  const [draftTags, setDraftTags] = useState([]);
  const [draftMin, setDraftMin] = useState(null);
  const [draftMax, setDraftMax] = useState(null);

  // a new search from the header always starts back on page 1
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const filterTags = useMemo(() => buildFilterTags(allProducts), [allProducts]);

  const filters = useMemo(
    () => ({ tags: selectedTags, minPrice, maxPrice, search: searchQuery }),
    [selectedTags, minPrice, maxPrice, searchQuery]
  );

  const filtered = useMemo(
    () => allProducts.filter((product) => matchesFilters(product, filters)),
    [allProducts, filters]
  );
  const sorted = useMemo(() => sortProducts(filtered, sort), [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageItems = sorted.slice(start, start + pageSize);

  const shownStart = pageItems.length ? start + 1 : 0;
  const shownEnd = start + pageItems.length;
  const searchNote = filters.search ? ` for "${filters.search}"` : '';
  const resultsText = sorted.length
    ? `Showing ${shownStart}–${shownEnd} of ${sorted.length} results${searchNote}`
    : `No products match${searchNote || ' this filter'}`;

  const filterCount = selectedTags.length + (minPrice != null || maxPrice != null ? 1 : 0);

  function openFilterDrawer() {
    setDraftTags(selectedTags);
    setDraftMin(minPrice);
    setDraftMax(maxPrice);
    setFilterOpen(true);
  }

  function applyFilters() {
    setSelectedTags(draftTags);
    setMinPrice(draftMin ?? null);
    setMaxPrice(draftMax ?? null);
    setPage(1);
    setFilterOpen(false);
  }

  function clearFilters() {
    setDraftTags([]);
    setDraftMin(null);
    setDraftMax(null);
    setSelectedTags([]);
    setMinPrice(null);
    setMaxPrice(null);
    setPage(1);
  }

  function handlePageChange(nextPage) {
    setPage(nextPage);
    document.querySelector('.filter')?.scrollIntoView({ block: 'start' });
  }

  return (
    <main>
      <section className="shop-hero">
        <div className="shop-hero-content">
          <h1>Shop</h1>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">&rsaquo;</span>
            <span aria-current="page">Shop</span>
          </nav>
        </div>
      </section>

      <ShopToolbar
        resultsText={resultsText}
        filterCount={filterCount}
        filterOpen={filterOpen}
        onOpenFilter={openFilterDrawer}
        onCloseFilter={() => setFilterOpen(false)}
        tags={filterTags}
        draftTags={draftTags}
        onDraftTagsChange={setDraftTags}
        draftMin={draftMin}
        draftMax={draftMax}
        onDraftMinChange={setDraftMin}
        onDraftMaxChange={setDraftMax}
        onApply={applyFilters}
        onClear={clearFilters}
        showValue={pageSize}
        onShowChange={(value) => {
          setPageSize(value && value > 0 ? value : allProducts.length);
          setPage(1);
        }}
        sortValue={sort}
        onSortChange={(value) => {
          setSort(value);
          setPage(1);
        }}
      />

      <section className="shop-our-products">
        <div className="products-grid">
          {pageItems.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>

        {sorted.length > 0 && (
          <nav className="pagination" aria-label="Product pages">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={sorted.length}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </nav>
        )}
      </section>

      <FeaturesBar />
    </main>
  );
}
