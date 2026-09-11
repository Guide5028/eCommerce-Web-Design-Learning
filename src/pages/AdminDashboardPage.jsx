import { useEffect, useState } from 'react';
import { Card, Col, Flex, List, Progress, Row, Spin, Tag, Tooltip, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService.js';
import { categoryService } from '../services/categoryService.js';
import { saleService } from '../services/saleService.js';
import { resolveImage } from '../utils/resolveImage.js';

// Matches the threshold used on AdminStockPage's "Low stock" tag, so the two stay consistent.
const LOW_STOCK_THRESHOLD = 5;
const TOP_SELLERS_LIMIT = 10;
const RESTOCK_PREVIEW_LIMIT = 5;
// Reorder-up-to-level: recommend topping up to 3x the alert threshold.
const RESTOCK_TARGET_MULTIPLIER = 3;

const GRADIENT = 'linear-gradient(135deg, #211D17 0%, #6b4e1f 55%, #B88E2F 100%)';
const DONUT_COLORS = ['#211D17', '#5c4718', '#8a6d24', '#B88E2F', '#d4a941', '#e0bc70', '#efd9a6', '#f6ead0'];

function SectionHeader({ label, count, suffix }) {
  return (
    <Flex align="center" justify="space-between" style={{ marginBottom: 12 }}>
      <Typography.Title level={5} style={{ margin: 0, color: 'var(--color-primary)', letterSpacing: '0.04em' }}>
        {label}
      </Typography.Title>
      <Tag color="gold" style={{ borderRadius: 999, fontWeight: 600 }}>
        {count} {suffix}
      </Tag>
    </Flex>
  );
}

// Plain SVG trend line -- no chart library. No dots: with preserveAspectRatio="none"
// stretching the box to fill a wide card, a round dot would get squashed into an
// ellipse, so the line (plus a soft fill under it) is the whole chart.
function TrendLine({ values }) {
  if (values.length === 0) return null;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const points = values.map((v, i) => {
    const x = values.length === 1 ? 0 : (i / (values.length - 1)) * 100;
    const y = 34 - ((v - min) / range) * 26; // keeps the line inside a 6px margin top/bottom
    return [x, y];
  });
  const linePath = points.map(([x, y]) => `${x},${y}`).join(' ');
  const areaPath = `0,40 ${linePath} 100,40`;

  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" style={{ width: '100%', height: 56, marginTop: 20, display: 'block' }}>
      <polygon points={areaPath} fill="var(--color-primary)" opacity="0.12" />
      <polyline
        points={linePath}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

// Single ring, many colors -- a real donut instead of one circle per category.
function CategoryDonut({ slices }) {
  let cursor = 0;
  const stops = slices
    .map(({ percent }, i) => {
      const from = cursor;
      cursor += percent;
      return `${DONUT_COLORS[i % DONUT_COLORS.length]} ${from}% ${cursor}%`;
    })
    .join(', ');

  return (
    <Flex align="center" gap={24} wrap>
      <div
        style={{
          width: 140,
          height: 140,
          borderRadius: '50%',
          background: `conic-gradient(${stops})`,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: 84, height: 84, borderRadius: '50%', background: '#fff' }} />
      </div>

      <Flex vertical gap={6} style={{ flex: 1, minWidth: 140 }}>
        {slices.map(({ name, count }, i) => (
          <Flex key={name} align="center" gap={8}>
            <span
              style={{ width: 10, height: 10, borderRadius: '50%', background: DONUT_COLORS[i % DONUT_COLORS.length], flexShrink: 0 }}
            />
            <Typography.Text style={{ fontSize: 13, flex: 1 }} ellipsis>
              {name}
            </Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              {count}
            </Typography.Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
}

// Dashboard: revenue (with a simple per-order bar trend), a single category donut,
// top sellers, then restock suggestions -- kept short since the list can get long.
export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const [productsPage, categories, sales] = await Promise.all([
          productService.getProducts({ limit: 100 }),
          categoryService.getCategories(),
          saleService.getSales(),
        ]);
        const products = productsPage.items;
        const lowStockProducts = products.filter(
          (p) => p.isActive && Number(p.stockQuantity) <= LOW_STOCK_THRESHOLD,
        );

        const countsByCategory = {};
        products.forEach((p) => {
          const key = p.category || 'Uncategorized';
          countsByCategory[key] = (countsByCategory[key] || 0) + 1;
        });
        const categorySlices = Object.entries(countsByCategory)
          .sort((a, b) => b[1] - a[1])
          .map(([name, count]) => ({ name, count, percent: Math.round((count / products.length) * 100) }));

        // no bulk "sale items" endpoint yet, so pull each sale's line items and
        // aggregate quantity/revenue per product client-side -- fine at today's volume
        const saleDetails = await Promise.all(sales.map((s) => saleService.getSaleById(s.saleId)));
        const productsById = new Map(products.map((p) => [p.productId, p]));
        const soldTotals = new Map();
        saleDetails.forEach((sale) => {
          sale.items?.forEach((item) => {
            const existing = soldTotals.get(item.productId) ?? { quantity: 0, revenue: 0 };
            existing.quantity += item.quantity;
            existing.revenue += item.quantity * Number(item.unitPrice) - Number(item.discountAmount);
            soldTotals.set(item.productId, existing);
          });
        });
        const topSellers = [...soldTotals.entries()]
          .map(([productId, totals]) => ({ productId, product: productsById.get(productId), ...totals }))
          .filter((row) => row.product)
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, TOP_SELLERS_LIMIT);

        const restockTarget = LOW_STOCK_THRESHOLD * RESTOCK_TARGET_MULTIPLIER;
        const restockRecommendations = lowStockProducts
          .map((p) => ({ product: p, recommend: restockTarget - Number(p.stockQuantity) }))
          .sort((a, b) => Number(a.product.stockQuantity) - Number(b.product.stockQuantity));

        // oldest -> newest, left to right, for the revenue trend line
        const revenueBars = [...sales].reverse().map((s) => Number(s.totalAmount));

        setStats({
          totalCategories: categories.length,
          categorySlices,
          restockRecommendations,
          totalSales: sales.length,
          totalRevenue: sales.reduce((sum, sale) => sum + Number(sale.totalAmount), 0),
          revenueBars,
          topSellers,
        });
      } catch {
        // interceptor already toasted it
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading || !stats) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  const maxSoldQuantity = stats.topSellers[0]?.quantity ?? 1;
  const restockPreview = stats.restockRecommendations.slice(0, RESTOCK_PREVIEW_LIMIT);
  const restockRemaining = stats.restockRecommendations.length - restockPreview.length;

  return (
    <Flex vertical gap={24}>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <SectionHeader label="MONEY MADE" count={stats.totalSales} suffix="orders" />
          <Card styles={{ body: { padding: 0 } }} style={{ overflow: 'hidden', border: 'none' }}>
            <div style={{ background: GRADIENT, color: '#fff', textAlign: 'center', padding: '10px 16px', fontSize: 13, fontWeight: 600 }}>
              So far
            </div>
            <div style={{ padding: '20px 16px' }}>
              <Typography.Title level={2} style={{ margin: 0, textAlign: 'center' }}>
                ฿{stats.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </Typography.Title>
              <TrendLine values={stats.revenueBars} />
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <SectionHeader label="CATEGORIES" count={stats.totalCategories} suffix="total" />
          <Card>
            <CategoryDonut slices={stats.categorySlices} />
          </Card>
        </Col>
      </Row>

      <Card title="Top selling products" styles={{ body: { padding: 0 } }}>
        {stats.topSellers.length === 0 ? (
          <Typography.Text type="secondary" style={{ display: 'block', padding: 24, textAlign: 'center' }}>
            No sales recorded yet -- best sellers will show up here once orders come in.
          </Typography.Text>
        ) : (
          <List
            dataSource={stats.topSellers}
            renderItem={(row, index) => (
              <List.Item style={{ padding: '12px 24px' }}>
                <Flex align="center" gap={16} style={{ width: '100%' }}>
                  <Typography.Text strong style={{ width: 24, color: 'var(--color-primary)' }}>
                    #{index + 1}
                  </Typography.Text>

                  {row.product.imageUrl ? (
                    <img
                      src={resolveImage(row.product.imageUrl)}
                      alt=""
                      style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }}
                    />
                  ) : (
                    <div style={{ width: 40, height: 40, borderRadius: 4, background: 'var(--color-border)', flexShrink: 0 }} />
                  )}

                  <Flex vertical style={{ flex: 1, minWidth: 0 }}>
                    <Typography.Text strong ellipsis>
                      {row.product.name}
                    </Typography.Text>
                    <Progress
                      percent={Math.round((row.quantity / maxSoldQuantity) * 100)}
                      showInfo={false}
                      size="small"
                      strokeColor="var(--color-primary)"
                    />
                  </Flex>

                  <Flex vertical align="flex-end" style={{ width: 110, flexShrink: 0 }}>
                    <Typography.Text strong>{row.quantity} sold</Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      ฿{row.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </Typography.Text>
                  </Flex>
                </Flex>
              </List.Item>
            )}
          />
        )}
      </Card>

      <Card
        title={
          <Flex align="center" gap={6}>
            Restock suggestions
            <Tooltip title={`Based on current stock, not sales speed yet -- top up to ${LOW_STOCK_THRESHOLD * RESTOCK_TARGET_MULTIPLIER} units.`}>
              <InfoCircleOutlined style={{ color: 'var(--color-text-muted)', fontSize: 13 }} />
            </Tooltip>
          </Flex>
        }
      >
        {restockPreview.length === 0 ? (
          <Typography.Text type="secondary">Nothing is low on stock right now.</Typography.Text>
        ) : (
          <Flex vertical gap={10}>
            {restockPreview.map(({ product }) => (
              <Flex key={product.productId} align="center" gap={12}>
                <Typography.Text ellipsis style={{ flex: 1 }}>
                  {product.name}
                </Typography.Text>
                <Flex align="center" gap={6} style={{ width: 96, flexShrink: 0, justifyContent: 'flex-end' }}>
                  <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                    {product.stockQuantity}
                  </Typography.Text>
                  <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                    →
                  </Typography.Text>
                  <Tag color="warning" style={{ margin: 0 }}>
                    {LOW_STOCK_THRESHOLD * RESTOCK_TARGET_MULTIPLIER}
                  </Tag>
                </Flex>
              </Flex>
            ))}

            <Link to="/admin/stock" style={{ fontWeight: 600, marginTop: 4 }}>
              {restockRemaining > 0 ? `+${restockRemaining} more -- view Stock page` : 'View Stock page'}
            </Link>
          </Flex>
        )}
      </Card>
    </Flex>
  );
}
