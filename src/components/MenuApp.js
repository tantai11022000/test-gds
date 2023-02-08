import { GlobalOutlined , UserOutlined , UnorderedListOutlined, PieChartOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useState } from 'react';
import { Link , useLocation } from 'react-router-dom';
const items = [
  {
    label: (
      <Link to='/'>Customer</Link>
    ),
    key: 'customer',
    icon: <GlobalOutlined />,
  },
  {
    label: (
      <Link to='/employee'>Employee</Link>
    ),
    key: 'employee',
    icon: <UserOutlined />
  },
  {
    label: (
      <Link to='/order'>Order</Link>
    ),
    key: 'order',
    icon: <UnorderedListOutlined />
  },
  {
    label: (
      <Link to='/chart'>Chart</Link>
    ),
    key: 'chart',
    icon: <PieChartOutlined />
  }
];
const MenuApp = () => {
  const defaultMenu = useLocation().pathname.split('/')[1]
  const [current, setCurrent] = useState(defaultMenu ? defaultMenu : 'customer');
  const onClick = (e) => {
    setCurrent(e.key);
  };
  return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
};
export default MenuApp;