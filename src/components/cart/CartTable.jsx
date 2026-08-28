import { Link } from 'react-router-dom';
import { Button, InputNumber, Table } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { formatPrice, formatRp } from '../../utils/format.js';

// Ported from legacy/js/app.js:953-1038 (cart page render) using an AntD Table.

export default function CartTable({ lines, onQtyChange, onRemove }) {
  const columns = [
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      render: (product) => (
        <div className="cart-product">
          <Link to={`/product/${product.id}`}>
            <img src={product.image} alt={product.alt} />
          </Link>
          <Link to={`/product/${product.id}`}>
            <span>{product.name}</span>
          </Link>
        </div>
      ),
    },
    {
      title: 'Price',
      key: 'price',
      className: 'cart-price',
      render: (_, line) => formatPrice(line.product),
    },
    {
      title: 'Quantity',
      key: 'quantity',
      className: 'cart-qty-cell',
      render: (_, line) => (
        <InputNumber
          className="cart-qty-input"
          min={1}
          value={line.qty}
          aria-label={`Quantity for ${line.product.name}`}
          onChange={(value) => onQtyChange(line.product.id, value || 1)}
        />
      ),
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      className: 'cart-subtotal',
      render: (_, line) => formatRp(line.product.price * line.qty),
    },
    {
      title: <span className="sr-only">Remove</span>,
      key: 'remove',
      className: 'cart-remove-cell',
      render: (_, line) => (
        <Button
          type="text"
          className="cart-remove-btn"
          aria-label={`Remove ${line.product.name} from cart`}
          icon={<DeleteOutlined />}
          onClick={() => onRemove(line.product.id)}
        />
      ),
    },
  ];

  return (
    <div className="cart-table-wrap">
      <Table
        className="cart-table"
        columns={columns}
        dataSource={lines}
        rowKey={(line) => line.product.id}
        pagination={false}
      />
    </div>
  );
}
