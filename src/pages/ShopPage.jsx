import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Flex, Pagination, Spin } from 'antd';
import { useProducts } from '../context/ProductsContext.jsx';
import ShopToolbar from '../components/ShopToolbar.jsx';
import ProductCard from '../components/ProductCard.jsx';
import FeaturesBar from '../components/FeaturesBar.jsx';
import styles from '../styles/pages/ShopPage.module.css';

export default function ShopPage() {
  const { products, loading } = useProducts(); // filter/sort/paginate client-side, no extra fetch
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [sort, setSort] = useState('default');

  // จัดเตรียมสำหรับระบบดรอว์เวอร์ฟิลเตอร์
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(undefined);
  const [draftCategory, setDraftCategory] = useState(undefined);

  // หากมีการ Search ตัวใหม่จากแถบค้นหาด้านบน ให้ดึงระบบกลับมาที่หน้า 1 เสมอ
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  // ฟิลเตอร์ + ค้นหา ทำฝั่ง client จาก products ก้อนเดียวที่โหลดมาแล้ว
  const filtered = useMemo(() => {
    let list = products;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(q));
    }
    if (selectedCategory) {
      list = list.filter((p) => p.category === selectedCategory);
    }
    return list;
  }, [products, searchQuery, selectedCategory]);

  // เรียงลำดับ -- ค่า sort ต้องตรงกับ SORT_OPTIONS ใน ShopToolbar.jsx (ใช้ขีดกลาง ไม่ใช่ underscore)
  const sorted = useMemo(() => {
    const list = filtered.slice();
    if (sort === 'price-asc') list.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sort === 'price-desc') list.sort((a, b) => Number(b.price) - Number(a.price));
    else if (sort === 'name-desc') list.sort((a, b) => b.name.localeCompare(a.name));
    else list.sort((a, b) => a.name.localeCompare(b.name)); // 'default' และ 'name-asc' เรียงผลเหมือนกัน
    return list;
  }, [filtered, sort]);

  const totalProducts = sorted.length;
  const pageCount = Math.max(1, Math.ceil(totalProducts / (pageSize || 8)));
  const currentPage = Math.min(page, pageCount);
  const pageStart = (currentPage - 1) * (pageSize || 8);
  const pageItems = sorted.slice(pageStart, pageStart + (pageSize || 8));

  const shownStart = pageItems.length ? pageStart + 1 : 0;
  const shownEnd = pageStart + pageItems.length;
  const searchNote = searchQuery ? ` for "${searchQuery}"` : '';

  const resultsText = pageItems.length
    ? `Showing ${shownStart}–${shownEnd} of ${totalProducts} results${searchNote}`
    : `No products match${searchNote || ' this filter'}`;

  const filterCount = selectedCategory ? 1 : 0;

  function openFilterDrawer() {
    setDraftCategory(selectedCategory);
    setFilterOpen(true);
  }

  function applyFilters() {
    setSelectedCategory(draftCategory);
    setPage(1); // ย้อนกลับหน้าแรกเมื่อกดฟิลเตอร์หมวดหมู่ใหม่
    setFilterOpen(false);
  }

  function clearFilters() {
    setDraftCategory(undefined);
    setSelectedCategory(undefined);
    setPage(1);
  }

  function handlePageChange(nextPage) {
    setPage(nextPage);
    // ดันหน้าจอกลับขึ้นไปด้านบนเมื่อทำการเปลี่ยนหน้าสินค้า
    document.querySelector(`.${styles.shopOurProducts}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <main>
      <Flex align="center" justify="center" component="section" className={styles.shopHero}>
        <div className={styles.shopHeroContent}>
          <h1>Shop</h1>
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">&rsaquo;</span>
            <span aria-current="page">Shop</span>
          </nav>
        </div>
      </Flex>

      <ShopToolbar
        resultsText={resultsText}
        filterCount={filterCount}
        filterOpen={filterOpen}
        onOpenFilter={openFilterDrawer}
        onCloseFilter={() => setFilterOpen(false)}
        tags={['Living Room', 'Bedroom', 'Dining', 'Workspace', 'Lighting', 'Storage', 'Outdoor', 'Decor']}
        draftTags={draftCategory ? [draftCategory] : []}
        onDraftTagsChange={(tags) => setDraftCategory(tags[0] || undefined)} // เลือกได้ทีละ 1 หมวดหมู่หลัก
        onApply={applyFilters}
        onClear={clearFilters}
        showValue={pageSize}
        onShowChange={(value) => {
          setPageSize(value);
          setPage(1);
        }}
        onShowBlur={() => {
          if (!pageSize || pageSize <= 0) setPageSize(8);
        }}
        sortValue={sort}
        onSortChange={(value) => {
          setSort(value);
          setPage(1);
        }}
      />

      <Flex vertical align="center" component="section" className={styles.shopOurProducts}>
        {loading ? (
          <div style={{ padding: '80px 0' }}>
            <Spin size="large" tip="กำลังเลือกสรรเฟอร์นิเจอร์ส่งตรงจากคลังหลังบ้าน..." />
          </div>
        ) : (
          <div className="products-grid">
            {pageItems.map((product) => (
              <ProductCard product={product} key={product.productId ?? product.id} />
            ))}
          </div>
        )}

        {!loading && pageItems.length > 0 && (
          <Flex align="center" justify="center" gap={16} component="nav" className={styles.pagination} aria-label="Product pages">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalProducts}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </Flex>
        )}
      </Flex>

      <FeaturesBar />
    </main>
  );
}
