import { Card, Flex, Typography } from 'antd';

// Reusable card for admin list pages (Products, Stock, Categories, Employees) --
// swaps a table row for a card in a grid, for quick glance-and-tap POS-style management.
//
//   image          optional cover image URL
//   title          main heading (e.g. product/employee name)
//   tags           array of <Tag> nodes shown under the title (category, status, ...)
//   highlight      one big secondary value (e.g. price, stock quantity) shown prominently
//   highlightColor color for `highlight` -- defaults to the brand color; pages that need
//                  it to react to data (e.g. red when stock hits 0) pass their own
//   fields         array of { label, value } shown as small label/value rows
//   actions        array of nodes rendered in antd Card's own bottom action row
export default function AdminItemCard({ image, title, tags, highlight, highlightColor = 'var(--color-primary)', fields, actions }) {
  return (
    <Card
      hoverable
      styles={{ body: { padding: 16 } }}
      cover={
        image ? (
          <img src={image} alt="" style={{ height: 140, width: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ height: 140, background: 'var(--color-border)' }} />
        )
      }
      actions={actions}
    >
      <Flex vertical gap={6}>
        <Typography.Text strong ellipsis style={{ fontSize: 16 }}>
          {title}
        </Typography.Text>

        {tags?.length > 0 && (
          <Flex gap={6} wrap>
            {tags}
          </Flex>
        )}

        {highlight && (
          <Typography.Text style={{ fontSize: 20, fontWeight: 700, color: highlightColor }}>
            {highlight}
          </Typography.Text>
        )}

        {fields?.map((field) => (
          <Flex key={field.label} justify="space-between">
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {field.label}
            </Typography.Text>
            <Typography.Text style={{ fontSize: 12 }} ellipsis>
              {field.value}
            </Typography.Text>
          </Flex>
        ))}
      </Flex>
    </Card>
  );
}
