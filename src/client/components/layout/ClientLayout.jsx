import { Outlet, Link } from "react-router-dom";
import {
  Layout,
  Menu,
  Button
} from "antd";
import { useSelector } from "react-redux";

const ClientLayout = () => {
  const { Header } = Layout;
  const auth = useSelector((store) => store.auth);
  return (
    <>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          background: "#fff",
          position: 'sticky',
          top: 0,
          zIndex: 100,
          borderBottom: '1px solid #ccc'
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <h1
            style={{
              margin: 0,
              color: "#00ab6b",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            traveloka<span style={{ color: "#1890ff" }}>🦅</span>
          </h1>
          <Menu
            mode="horizontal"
            style={{ borderBottom: "none", marginLeft: "24px" }}
            items={[
              { key: "flight", label: "Vé máy bay" },
              { key: "hotel", label: "Khách sạn" },
              { key: "bus", label: "Vé xe" },
              { key: "stay", label: "Chỗ ở & Xe" },
              { key: "more", label: "More →" },
            ]}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          { auth.isLoggedIn ? (
            <Link to='/logout'>
              <Button type="primary" size="small">Đăng Xuất</Button>
            </Link>
          ) : (
              <>
                <Link to='/login'>
                  <Button type="primary" size="small">Đăng nhập</Button>
                </Link>
                <Link to='/register'>
                  <Button size="small">Đăng ký</Button>
                </Link>
              </>
          ) }
        </div>
      </Header>
      <Outlet />
      <footer>Layout Footer Client</footer>
    </>
  );
};

export default ClientLayout;