import { Button, Checkbox, Drawer, Flex, InputNumber, Select, Space } from 'antd';
import { FilterOutlined, AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import styles from '../styles/components/ShopToolbar.module.css';

// Shop page's toolbar: results count, category filter drawer, sort, and page size.

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
  onShowBlur,
  sortValue,
  onSortChange,
}) {
  return (
    <section className="filter">
      <Flex justify="space-between" wrap className={styles.shopToolbar}>
        <Flex align="center" className={styles.toolbarLeft}>
          <Flex
            align="center"
            gap={8}
            component="button"
            type="button"
            className={`${styles.toolbarFilter}${filterCount > 0 ? ` ${styles.isActive}` : ''}`}
            aria-expanded={filterOpen}
            onClick={onOpenFilter}
          >
            <FilterOutlined />
            Filter
            {filterCount > 0 && <span className={styles.filterCount}>{filterCount}</span>}
          </Flex>
          <Flex align="center" justify="center" component="button" type="button" className={styles.toolbarIconBtn} aria-label="Grid view">
            <AppstoreOutlined />
          </Flex>
          <Flex align="center" justify="center" component="button" type="button" className={styles.toolbarIconBtn} aria-label="List view">
            <BarsOutlined />
          </Flex>
          <span className={styles.toolbarDivider} />
          <p className={styles.toolbarResults}>{resultsText}</p>
        </Flex>

        <Flex align="center" className={styles.toolbarRight}>
          <Flex align="center" gap={12} component="label" className={styles.toolbarField}>
            Show
            <InputNumber
              className={styles.toolbarShowInput}
              min={1}
              value={showValue}
              onChange={onShowChange}
              onBlur={onShowBlur}
              controls={false}
            />
          </Flex>
          <Flex align="center" gap={12} component="label" className={styles.toolbarField}>
            Short by
            <Select
              className={styles.toolbarSortSelect}
              value={sortValue}
              onChange={onSortChange}
              options={SORT_OPTIONS}
              popupMatchSelectWidth={false}
            />
          </Flex>
        </Flex>
      </Flex>

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
          <Flex align="center" gap={12}>
            <Flex vertical gap={6} component="label" className={styles.filterPriceField}>
              Min
              <InputNumber min={0} step={50000} placeholder="0" value={draftMin} onChange={onDraftMinChange} />
            </Flex>
            <span className={styles.filterPriceSep}>&ndash;</span>
            <Flex vertical gap={6} component="label" className={styles.filterPriceField}>
              Max
              <InputNumber min={0} step={50000} placeholder="7000000" value={draftMax} onChange={onDraftMaxChange} />
            </Flex>
          </Flex>
        </div>

        <Flex align="flex-end" gap={16} className={styles.filterPanelActions}>
          <Space>
            <Button onClick={onClear}>Clear Filter</Button>
            <Button type="primary" onClick={onApply}>Apply Filter</Button>
          </Space>
        </Flex>
      </Drawer>
    </section>
  );
}
