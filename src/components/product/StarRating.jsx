import { Rate } from 'antd';

export default function StarRating({ value, ...rest }) {
  return <Rate disabled allowHalf value={value} {...rest} />;
}
