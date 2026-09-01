import { Button, Checkbox, Drawer, InputNumber, Select, Space } from 'antd';
import { FilterOutlined, AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import styles from './ShopToolbar.module.css';

// Ported from legacy/js/app.js:637-817 (shop toolbar filter/sort), filter panel now an AntD Drawer.

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
];

export default function ShopToolbar({
  resultsText,
  filterCount,
  filterOpen,
  onOpenFilter,
  onCloseFilter,
  tags,
  draftTags,
  onDraftTagsChange,
  draftMin,
  draftMax,
  onDraftMinChange,
  onDraftMaxChange,
  onApply,
  onClear,
  showValue,
  onShowChange,
  sortValue,
  onSortChange,
}) {
  return (
    <section className="filter">
      <div className={styles.shopToolbar}>
        <div className={styles.toolbarLeft}>
          <button
            type="button"
            className={`${styles.toolbarFilter}${filterCount > 0 ? ` ${styles.isActive}` : ''}`}
            aria-expanded={filterOpen}
            onClick={onOpenFilter}
          >
            <FilterOutlined />
            Filter
            {filterCount > 0 && <span className={styles.filterCount}>{filterCount}</span>}
          </button>
          <button type="button" className={styles.toolbarIconBtn} aria-label="Grid view">
            <AppstoreOutlined />
          </button>
          <button type="button" className={styles.toolbarIconBtn} aria-label="List view">
            <BarsOutlined />
          </button>
          <span className={styles.toolbarDivider} />
          <p className={styles.toolbarResults}>{resultsText}</p>
        </div>

        <div className={styles.toolbarRight}>
          <label className={styles.toolbarField}>
            Show
            <InputNumber
              className={styles.toolbarShowInput}
              min={1}
              value={showValue}
              onChange={onShowChange}
              controls={false}
            />
          </label>
          <label className={styles.toolbarField}>
            Short by
            <Select
              className={styles.toolbarSortSelect}
              value={sortValue}
              onChange={onSortChange}
              options={SORT_OPTIONS}
              popupMatchSelectWidth={false}
            />
          </label>
        </div>
      </div>

      <Drawer title="Filter products" placement="right" open={filterOpen} onClose={onCloseFilter} width={340}>
        <div className={styles.filterPanelGroup}>
          <h3>Category</h3>
          <Checkbox.Group
            value={draftTags}
            onChange={onDraftTagsChange}
            className={styles.filterTags}
            options={tags.map((tag) => ({ label: tag, value: tag }))}
          />
        </div>

        <div className={`${styles.filterPanelGroup} ${styles.filterPanelGroupPrice}`}>
          <h3>Price Range</h3>
          <div className={styles.filterPriceInputs}>
            <label className={styles.filterPriceField}>
              Min
              <InputNumber min={0} step={50000} placeholder="0" value={draftMin} onChange={onDraftMinChange} />
            </label>
            <span className={styles.filterPriceSep}>&ndash;</span>
            <label className={styles.filterPriceField}>
              Max
              <InputNumber min={0} step={50000} placeholder="7000000" value={draftMax} onChange={onDraftMaxChange} />
            </label>
          </div>
        </div>

        <div className={styles.filterPanelActions}>
          <Space>
            <Button onClick={onClear}>Clear Filter</Button>
            <Button type="primary" onClick={onApply}>Apply Filter</Button>
          </Space>
        </div>
      </Drawer>
    </section>
  );
}
