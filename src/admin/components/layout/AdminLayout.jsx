import { Layout } from 'antd';
import { useState } from 'react';
import { Outlet } from "react-router-dom";
import MenuComponent from '../common/MenuComponent';
import HeaderComponent from '../common/HeaderComponent';
import './AdminLayout.scss';
const { Footer, Sider, Content } = Layout;

const LayoutDefault = () => {

  const siderStyle = {
    overflow: 'auto',
    height: '100vh',
    position: 'sticky',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarGutter: 'stable',
  };

  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className='layout'>
      <Sider collapsed={collapsed} style={siderStyle}>
        <div className="demo-logo-vertical" />
        <MenuComponent/>
      </Sider>
      <Layout>
        <HeaderComponent setCollapsed={setCollapsed} collapsed={collapsed}/>
        <Content className='main'>
          <Outlet/>
        </Content>
        <Footer className='footer'>Ant Design ©2025 Created by Ant</Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutDefault;