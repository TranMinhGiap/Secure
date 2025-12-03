import { Outlet, Link } from "react-router-dom";
import { Layout, Menu, Button, Row, Col } from "antd";
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
          position: "sticky",
          top: 0,
          zIndex: 100,
          borderBottom: "1px solid #ccc",
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
            defaultSelectedKeys={["flight"]}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {auth.isLoggedIn ? (
            <Link to="/logout">
              <Button type="primary" size="small">
                Đăng Xuất
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button type="primary" size="small">
                  Đăng nhập
                </Button>
              </Link>
              <Link to="/register">
                <Button size="small">Đăng ký</Button>
              </Link>
            </>
          )}
        </div>
      </Header>

      <Outlet />

      <footer
        style={{
          background: "linear-gradient(135deg, #015ba3, #028cd1 40%, #05c9d6)",
          color: "#fff",
          padding: "60px 0 28px",
          fontFamily: "Inter, sans-serif",
          borderRadius: "18px 18px 0 0",
          boxShadow: "0 -4px 40px rgba(0,0,0,0.18)"
        }}
      >
        <div style={{ width: "92%", maxWidth: 1300, margin: "0 auto" }}>

          <Row gutter={[32, 32]}>

            {/* ================= COL 1 : BRAND ================= */}
            <Col xs={24} md={12} lg={8}>
              <h2
                style={{
                  fontSize: 34,
                  fontWeight: 800,
                  marginBottom: 12,
                  textShadow: "0 3px 6px rgba(0,0,0,0.25)"
                }}
              >
                Trevoloka
              </h2>

              <p style={{ opacity: 0.92, fontSize: 15, lineHeight: 1.7 }}>
                Đặt vé dễ dàng – Ưu đãi mỗi ngày.
                Chúng tôi đem đến trải nghiệm bay tốt nhất với hơn 500+ hãng hàng không.
              </p>

              {/* CONTACT */}
              <div style={{ marginTop: 18, lineHeight: 1.9, fontSize: 15 }}>
                Hotline: <strong>1900 9999</strong> <br />
                Email: <strong>support@trevoloka.com</strong> <br />
                Giờ làm việc: <strong>08:00 - 22:00</strong>
              </div>
            </Col>

            {/* ================= COL 2 : EXPLORE ================= */}
            <Col xs={12} md={6} lg={5}>
              <h4 style={{ marginBottom: 18, fontSize: 19, fontWeight: 700 }}>
                Khám phá
              </h4>

              <ul style={{ listStyle: "none", padding: 0, fontSize: 15 }}>
                {[
                  "Vé máy bay nội địa",
                  "Vé máy bay quốc tế",
                  "Combo bay + khách sạn",
                  "Khuyến mãi hot",
                  "Trung tâm hỗ trợ"
                ].map((item, i) => (
                  <li key={i} style={{ marginBottom: 12 }}>
                    <a
                      href="#"
                      style={{
                        color: "#eaf6ff",
                        textDecoration: "none",
                        transition: "0.25s"
                      }}
                      onMouseOver={(e) => (e.target.style.color = "#ffffff")}
                      onMouseOut={(e) => (e.target.style.color = "#eaf6ff")}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </Col>

            {/* ================= COL 3 : POLICY ================= */}
            <Col xs={12} md={6} lg={5}>
              <h4 style={{ marginBottom: 18, fontSize: 19, fontWeight: 700 }}>
                Chính sách
              </h4>

              <ul style={{ listStyle: "none", padding: 0, fontSize: 15 }}>
                {[
                  "Điều khoản sử dụng",
                  "Chính sách bảo mật",
                  "Chính sách hoàn/đổi vé",
                  "Bảo mật thanh toán",
                  "Quy định vận chuyển"
                ].map((item, i) => (
                  <li key={i} style={{ marginBottom: 12 }}>
                    <a
                      href="#"
                      style={{
                        color: "#eaf6ff",
                        textDecoration: "none",
                        transition: "0.25s"
                      }}
                      onMouseOver={(e) => (e.target.style.color = "#ffffff")}
                      onMouseOut={(e) => (e.target.style.color = "#eaf6ff")}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </Col>

            {/* ================= COL 4 : PAYMENT & AIRLINES ================= */}
            <Col xs={24} md={12} lg={6}>
              <h4 style={{ marginBottom: 14, fontSize: 19, fontWeight: 700 }}>
                Thanh toán an toàn
              </h4>

              <div
                style={{
                  background: "rgba(255,255,255,0.22)",
                  borderRadius: 14,
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  flexWrap: "wrap",
                  backdropFilter: "blur(5px)"
                }}
              >
                {[
                  "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg",
                  "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
                  "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg",
                  "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="payment"
                    style={{
                      height: 36,
                      transition: "0.25s",
                      cursor: "pointer"
                    }}
                    onMouseOver={(e) => (e.target.style.transform = "scale(1.12)")}
                    onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                  />
                ))}
              </div>

              <h4 style={{ marginTop: 26, marginBottom: 14, fontSize: 19, fontWeight: 700 }}>
                Hãng hàng không đối tác
              </h4>

              <div
                style={{
                  background: "rgba(255,255,255,0.22)",
                  borderRadius: 14,
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 16,
                  backdropFilter: "blur(5px)"
                }}
              >
                {[
                  "data:image/png;base64,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",
                  "data:image/png;base64,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",
                  "data:image/png;base64,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",
                  "data:image/png;base64,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",
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="airline"
                    style={{
                      height: 32,
                      transition: "0.25s",
                      cursor: "pointer"
                    }}
                    onMouseOver={(e) => (e.target.style.transform = "scale(1.08)")}
                    onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                  />
                ))}
              </div>
            </Col>
          </Row>

          {/* COPYRIGHT */}
          <div
            style={{
              textAlign: "center",
              marginTop: 45,
              paddingTop: 16,
              borderTop: "1px solid rgba(255,255,255,0.3)",
              fontSize: 14,
              opacity: 0.9
            }}
          >
            © 2025 Trevoloka – Trải nghiệm bay tuyệt vời, bắt đầu từ đây.
          </div>
        </div>
      </footer>
    </>
  );
};

export default ClientLayout;
