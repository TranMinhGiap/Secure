import { Menu } from 'antd';
import {
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const MenuComponent = (props) => {
  const prefix = "/admin";
  const { collapsed } = props;

  const items = [
    { key: '1', icon: <PieChartOutlined />, label: <Link to={`${prefix}`}>Dashboard</Link> },
    // { key: '2', icon: <DesktopOutlined />, label: <Link to={`${prefix}/product-category`}>Danh mục sản phẩm</Link> },
    // { key: '3', icon: <DesktopOutlined />, label: <Link to={`${prefix}/products`}>Sản phẩm</Link> },
    { key: '4', icon: <ContainerOutlined />, label: <Link to={`${prefix}/accounts`}>Tài khoản</Link> },
    { key: '13', icon: <ContainerOutlined />, label: <Link to={`${prefix}/airlines`}>Hãng bay</Link> },
    { key: '14', icon: <ContainerOutlined />, label: <Link to={`${prefix}/airplanes`}>Máy bay</Link> },
    { key: '15', icon: <ContainerOutlined />, label: <Link to={`${prefix}/airports`}>Sân bay</Link> },
    { key: '16', icon: <ContainerOutlined />, label: <Link to={`${prefix}/flights`}>Chuyến bay</Link> },
    {
      key: 'sub1',
      label: 'Quyền', 
      icon: <MailOutlined />,
      children: [
        { key: '5', icon: <DesktopOutlined />, label: <Link to={`${prefix}/roles`}>Nhóm quyền</Link> },
        { key: '6', icon: <DesktopOutlined />, label: <Link to={`${prefix}/roles/permissions`}>Phần quyền</Link> },
      ],
    },
    {
      key: 'sub2',
      label: 'Navigation Two',
      icon: <AppstoreOutlined />,
      children: [
        { key: '9', label: 'Option 9' },
        { key: '10', label: 'Option 10' },
        {
          key: 'sub3',
          label: 'Submenu',
          children: [
            { key: '11', label: 'Option 11' },
            { key: '12', label: 'Option 12' },
          ],
        },
      ],
    },
  ];

  return (
    <Menu
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      mode="inline"
      theme="dark"
      inlineCollapsed={collapsed}
      items={items}
    />
  );
};

export default MenuComponent;