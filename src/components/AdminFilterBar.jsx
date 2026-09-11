import { Flex, Input, Segmented, Select } from 'antd';

const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'price', label: 'Price' },
  { value: 'stockQuantity', label: 'Stock' },
];

// Shared search/category/sort controls for AdminProductsPage + AdminStockPage --
// both list the same product catalog through the same pos-api query params
// (search, category, sortBy, order), just with different defaults.
export default function AdminFilterBar({ categories, filters, onChange, extra }) {
  return (
    <Flex gap={12} wrap="wrap" align="center">
      <Input.Search
        placeholder="Search products…"
        allowClear
        defaultValue={filters.search}
        onSearch={(value) => onChange({ ...filters, search: value || undefined })}
        style={{ width: 240 }}
      />

      <Select
        placeholder="All categories"
        allowClear
        style={{ width: 180 }}
        value={filters.category}
        onChange={(value) => onChange({ ...filters, category: value })}
        options={categories.map((c) => ({ value: c.name, label: c.name }))}
      />

      <Select
        style={{ width: 130 }}
        value={filters.sortBy}
        onChange={(value) => onChange({ ...filters, sortBy: value })}
        options={SORT_OPTIONS}
      />

      <Segmented
        value={filters.order}
        onChange={(value) => onChange({ ...filters, order: value })}
        options={[
          { value: 'asc', label: 'Asc' },
          { value: 'desc', label: 'Desc' },
        ]}
      />

      {extra}
    </Flex>
  );
}
