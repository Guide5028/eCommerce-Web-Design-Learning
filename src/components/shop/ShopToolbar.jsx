import { Button, Checkbox, Drawer, InputNumber, Select, Space } from 'antd';
import { FilterOutlined, AppstoreOutlined, BarsOutlined } from '@ant-design/icons';

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
      <div className="shop-toolbar">
        <div className="toolbar-left">
          <button
            type="button"
            className={`toolbar-filter${filterCount > 0 ? ' is-active' : ''}`}
            aria-expanded={filterOpen}
            onClick={onOpenFilter}
          >
            <FilterOutlined />
            Filter
            {filterCount > 0 && <span className="filter-count">{filterCount}</span>}
          </button>
          <button type="button" className="toolbar-icon-btn" aria-label="Grid view">
            <AppstoreOutlined />
          </button>
          <button type="button" className="toolbar-icon-btn" aria-label="List view">
            <BarsOutlined />
          </button>
          <span className="toolbar-divider" />
          <p className="toolbar-results">{resultsText}</p>
        </div>

        <div className="toolbar-right">
          <label className="toolbar-field">
            Show
            <InputNumber
              className="toolbar-show-input"
              min={1}
              value={showValue}
              onChange={onShowChange}
              controls={false}
            />
          </label>
          <label className="toolbar-field">
            Short by
            <Select
              className="toolbar-sort-select"
              value={sortValue}
              onChange={onSortChange}
              options={SORT_OPTIONS}
              popupMatchSelectWidth={false}
            />
          </label>
        </div>
      </div>

      <Drawer title="Filter products" placement="right" open={filterOpen} onClose={onCloseFilter} width={340}>
        <div className="filter-panel-group">
          <h3>Category</h3>
          <Checkbox.Group
            value={draftTags}
            onChange={onDraftTagsChange}
            className="filter-tags"
            options={tags.map((tag) => ({ label: tag, value: tag }))}
          />
        </div>

        <div className="filter-panel-group filter-panel-group--price">
          <h3>Price Range</h3>
          <div className="filter-price-inputs">
            <label className="filter-price-field">
              Min
              <InputNumber min={0} step={50000} placeholder="0" value={draftMin} onChange={onDraftMinChange} />
            </label>
            <span className="filter-price-sep">&ndash;</span>
            <label className="filter-price-field">
              Max
              <InputNumber min={0} step={50000} placeholder="7000000" value={draftMax} onChange={onDraftMaxChange} />
            </label>
          </div>
        </div>

        <div className="filter-panel-actions">
          <Space>
            <Button onClick={onClear}>Clear Filter</Button>
            <Button type="primary" onClick={onApply}>Apply Filter</Button>
          </Space>
        </div>
      </Drawer>
    </section>
  );
}
