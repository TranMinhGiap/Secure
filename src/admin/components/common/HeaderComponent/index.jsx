import { Layout, Space, Drawer, Flex, Image, Divider, Button } from 'antd';
import './Header.scss';
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined, SettingOutlined, PicRightOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from '../../../features/auth/authSlice';
import MyAccount from '../../../pages/MyAccount';
//=================================
const { Header } = Layout;

const HeaderComponent = (props) => {
  const auth = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setCollapsed, collapsed } = props;
  const [open, setOpen] = useState(false);
  const [childrenDrawer, setChildrenDrawer] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const showChildrenDrawer = () => {
    setChildrenDrawer(true);
  };

  const onChildrenDrawerClose = () => {
    setChildrenDrawer(false);
  };

  const handleLogout = () => {
    onClose();
    setTimeout(() => {
      if (auth.token) {
        dispatch(logout());
        navigate('/admin/login');
      }
    }, 90);
  }

  return (
    <Header 
      style={{ 
        position: 'sticky', 
        top: 0, zIndex: 100, 
        backgroundColor: 'rgba(255, 255, 255, 0.6)', 
        backdropFilter: 'blur(10px)', padding: '0 20px', 
        boxShadow: '0 2px 8px #f0f1f2', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.3)' 
      }}
    >
      <Flex justify='space-between' align='center'>
        <Space 
          align='center'
          style={{ fontSize: 24, cursor: 'pointer', transition: 'all 0.2s ease-in-out' }}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Space>
        <Space>
          <div onClick={showDrawer}>
            <Image
              width={45}
              height={45}
              preview={false}
              style={{ borderRadius: '50%', cursor: 'pointer', boxSizing: 'border-box', border: '1px solid #1890ff' }}
              src={auth.user?.avatar || 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'}
            />
          </div>
          <Drawer
            closable={{ 'aria-label': 'Close Button' }}
            onClose={onClose}
            open={open}
            width={350}
            footer={<Button onClick={handleLogout} style={{width: '100%'}} icon={<LogoutOutlined />} color="danger" variant="filled">Đăng xuất</Button>}
          >
            <Flex vertical align='center' gap={16}>
              <Image
                width={96}
                height={96}
                preview={false}
                style={{ borderRadius: '50%', boxSizing: 'border-box', border: '1px solid #1890ff' }}
                src={auth.user?.avatar || 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'}
              />
              <Space>
                <h3>{auth.user?.fullName || 'Chưa xác định'}</h3>
              </Space>
              <Space style={{ color: '#637381' }}>
                {auth.user?.email || 'Chưa xác định'}
              </Space>
              <Divider />
              <Flex vertical gap={8} style={{width: '100%'}}>
                <Space className='item-info' onClick={showChildrenDrawer}>
                  <PicRightOutlined />
                  <Space className='item-info__link'>Thông tin tài khoản</Space>
                </Space>
                <Space
                  className='item-info'
                  onClick={() => {
                    navigate('/admin/my-accounts/edit');
                    onClose();
                  }}
                >
                  <SettingOutlined/>
                  <Space className='item-info__link'>Cài đặt</Space>
                </Space>
              </Flex>
            </Flex>
            <Drawer
              title="Thông tin cá nhân"
              width={530}
              closable={false}
              onClose={onChildrenDrawerClose}
              open={childrenDrawer}
            >
              <MyAccount />
            </Drawer>
          </Drawer>
        </Space>
      </Flex>
    </Header>
  );
};

export default HeaderComponent;