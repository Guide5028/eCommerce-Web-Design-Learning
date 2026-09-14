import { Segmented } from 'antd';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';

// Card/List switcher for admin pages that render AdminItemCard grids -- paired
// with useViewMode for the persisted state.
export default function ViewToggle({ value, onChange }) {
  return (
    <Segmented
      value={value}
      onChange={onChange}
      options={[
        { value: 'card', icon: <AppstoreOutlined />, label: 'Cards' },
        { value: 'list', icon: <BarsOutlined />, label: 'List' },
      ]}
    />
  );
}
