import { useState } from "react";
import {
  Layout,
  Menu,
  Select,
  DatePicker,
  Button,
  Form,
  Row,
  Col,
  Tabs,
  Card,
  Input,
  Radio,
  Space,
  Popover,
  List,
} from "antd";
import {
  SearchOutlined,
  EnvironmentOutlined,
  SwapOutlined,
  UserOutlined,
  DownOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "antd/dist/reset.css";

const { Header, Content } = Layout;
const { Option } = Select;
const { Meta } = Card;
const { Group: RadioGroup } = Radio;

const Home = () => {
  const [form] = Form.useForm();
  const [tripType, setTripType] = useState("oneway");
  const [passengerVisible, setPassengerVisible] = useState(false);
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [flights, setFlights] = useState([]);

  const airports = [
    { value: "SGN", label: "TP. HCM (SGN)" },
    { value: "HAN", label: "Hà Nội (HAN)" },
    { value: "DAD", label: "Đà Nẵng (DAD)" },
    { value: "UIH", label: "Huế (UIH)" },
  ];

  const deals = [
    {
      title: "Deal bay SGN - HAN",
      description: "Giá chỉ từ 500k",
      image: "https://via.placeholder.com/300x200?text=Deal+1",
    },
    {
      title: "Deal bay HAN - DAD",
      description: "Khuyến mãi 20%",
      image: "https://via.placeholder.com/300x200?text=Deal+2",
    },
    {
      title: "Deal bay DAD - SGN",
      description: "Bay ngay hôm nay",
      image: "https://via.placeholder.com/300x200?text=Deal+3",
    },
  ];

  const getPassengersLabel = () => {
    return `${passengers.adults} người lớn, ${passengers.children} trẻ em, ${passengers.infants} em bé`;
  };

  const updatePassengerCount = (type, delta) => {
    setPassengers((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta),
    }));
  };

  const passengerContent = (
    <div style={{ width: 300, padding: 16 }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        {["adults", "children", "infants"].map((type, idx) => {
          const labels = ["Người lớn", "Trẻ em", "Em bé"];
          return (
            <div
              key={type}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{labels[idx]}</span>
              <Space>
                <Button
                  icon={<MinusOutlined />}
                  size="small"
                  onClick={() => updatePassengerCount(type, -1)}
                />
                <span>{passengers[type]}</span>
                <Button
                  icon={<PlusOutlined />}
                  size="small"
                  onClick={() => updatePassengerCount(type, 1)}
                />
              </Space>
            </div>
          );
        })}
      </Space>
    </div>
  );

  const onFinish = (values) => {
    const payload = {
      ...values,
      tripType,
      passengers,
      departureDate: values.departureDate
        ? values.departureDate.format("YYYY-MM-DD")
        : null,
      returnDate: values.returnDate
        ? values.returnDate.format("YYYY-MM-DD")
        : null,
    };

    console.log("Payload gửi về BE:", payload);

    // ✅ Giả lập dữ liệu chuyến bay
    const mockFlights = [
      {
        id: 1,
        airline: "Vietnam Airlines",
        code: "VN123",
        from: payload.departure,
        to: payload.arrival,
        time: "08:00 - 10:00",
        price: "1,200,000 VND",
      },
      {
        id: 2,
        airline: "Vietjet Air",
        code: "VJ456",
        from: payload.departure,
        to: payload.arrival,
        time: "09:30 - 11:20",
        price: "950,000 VND",
      },
      {
        id: 3,
        airline: "Bamboo Airways",
        code: "QH789",
        from: payload.departure,
        to: payload.arrival,
        time: "12:00 - 14:00",
        price: "1,050,000 VND",
      },
    ];

    setFlights(mockFlights);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header */}
      {/* <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          background: "#fff",
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
              { key: "hotel", label: "Khách sạn" },
              { key: "flight", label: "Vé máy bay" },
              { key: "bus", label: "Vé xe" },
              { key: "stay", label: "Chỗ ở & Xe" },
              { key: "more", label: "More →" },
            ]}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Button type="primary" size="small">
            Đăng nhập
          </Button>
          <Button size="small">Đăng ký</Button>
        </div>
      </Header> */}

      {/* Banner */}
      <div style={{ position: "relative", height: "400px", overflow: "hidden" }}>
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2070&q=80"
          alt="Banner"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "white",
            zIndex: 1,
          }}
        >
          <h2 style={{ fontSize: "28px", marginBottom: "16px" }}>
            Tìm & đặt vé máy bay giá rẻ, deal bay hấp dẫn cùng Traveloka
          </h2>
        </div>
      </div>

      {/* Form */}
      <Content style={{ padding: "24px", background: "#f5f5f5" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            background: "white",
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            initialValues={{
              departure: "SGN",
              arrival: "HAN",
              departureDate: dayjs(),
              seatClass: "Economy",
            }}
          >
            <Row style={{ marginBottom: "16px" }}>
              <Col span={24}>
                <RadioGroup
                  onChange={(e) => setTripType(e.target.value)}
                  value={tripType}
                  buttonStyle="solid"
                  size="small"
                  optionType="button"
                >
                  <Radio.Button value="oneway">Một chiều</Radio.Button>
                  <Radio.Button value="roundtrip">Khứ hồi</Radio.Button>
                </RadioGroup>
              </Col>
            </Row>

            {/* Điểm đi - đến */}
            <Row gutter={16} style={{ marginBottom: "16px" }}>
              <Col xs={24} md={10}>
                <Form.Item name="departure" label="Từ">
                  <Select
                    size="large"
                    showSearch
                    optionFilterProp="label"
                    suffixIcon={<EnvironmentOutlined />}
                    options={airports}
                    placeholder="Chọn sân bay đi"
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                md={4}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  type="text"
                  icon={<SwapOutlined style={{ fontSize: "20px", color: "#bfbfbf" }} rotate={90} />}
                  size="large"
                />
              </Col>
              <Col xs={24} md={10}>
                <Form.Item name="arrival" label="Đến">
                  <Select
                    size="large"
                    showSearch
                    optionFilterProp="label"
                    suffixIcon={<EnvironmentOutlined />}
                    options={airports}
                    placeholder="Chọn sân bay đến"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Ngày */}
            <Row gutter={16} style={{ marginBottom: "16px" }}>
              <Col xs={24} md={12}>
                <Form.Item name="departureDate" label="Ngày đi">
                  <DatePicker
                    placeholder="Chọn ngày"
                    size="large"
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="returnDate" label="Ngày về">
                  <DatePicker
                    placeholder="Chọn ngày"
                    size="large"
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    disabled={tripType !== "roundtrip"}
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Hành khách + hạng ghế */}
            <Row gutter={16} style={{ marginBottom: "16px" }}>
              <Col xs={24} md={12}>
                <Form.Item label="Hành khách">
                  <Popover
                    content={passengerContent}
                    title="Chọn hành khách"
                    trigger="click"
                    open={passengerVisible}
                    onOpenChange={setPassengerVisible}
                    placement="bottomLeft"
                  >
                    <Input
                      size="large"
                      readOnly
                      value={getPassengersLabel()}
                      placeholder="Chọn hành khách"
                      suffix={
                        <Space>
                          <UserOutlined />
                          <DownOutlined />
                        </Space>
                      }
                      style={{ cursor: "pointer" }}
                    />
                  </Popover>
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="seatClass" label="Hạng ghế">
                  <Select
                    size="large"
                    style={{ width: "100%" }}
                    suffixIcon={<DownOutlined />}
                  >
                    <Option value="Economy">Phổ thông</Option>
                    <Option value="Premium Economy">Phổ thông đặc biệt</Option>
                    <Option value="Business">Thương gia</Option>
                    <Option value="First">Hạng nhất</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Nút tìm */}
            <Row>
              <Col span={24}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  icon={<SearchOutlined />}
                >
                  Tìm chuyến bay
                </Button>
              </Col>
            </Row>
          </Form>
        </div>

        {/* ✅ Hiển thị kết quả chuyến bay */}
        {flights.length > 0 && (
          <div
            style={{
              maxWidth: "1000px",
              margin: "24px auto",
              background: "#fff",
              padding: "16px 24px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h3>Kết quả chuyến bay:</h3>
            <List
              dataSource={flights}
              renderItem={(flight) => (
                <List.Item
                  key={flight.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #f0f0f0",
                    padding: "12px 0",
                  }}
                >
                  <div>
                    <b>{flight.airline}</b> - {flight.code}
                    <div>
                      {flight.from} → {flight.to}
                    </div>
                    <div>{flight.time}</div>
                  </div>
                  <div>
                    <b>{flight.price}</b>
                  </div>
                </List.Item>
              )}
            />
          </div>
        )}
      </Content>

      {/* Deals */}
      <Content style={{ padding: "24px", background: "#fff" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h3 style={{ textAlign: "center", marginBottom: "24px" }}>
            Tìm Kiếm Các Deal Bay Ở Việt Nam
          </h3>
          <Tabs
            defaultActiveKey="1"
            centered
            items={[
              {
                key: "1",
                label: "Mới nhất",
                children: (
                  <Row gutter={16}>
                    {deals.map((deal, index) => (
                      <Col span={8} key={index}>
                        <Card
                          hoverable
                          cover={<img alt={deal.title} src={deal.image} />}
                          style={{ marginBottom: "16px" }}
                        >
                          <Meta
                            title={deal.title}
                            description={deal.description}
                          />
                        </Card>
                      </Col>
                    ))}
                  </Row>
                ),
              },
              { key: "2", label: "Gần đây", children: <p>Content for Gần đây...</p> },
              { key: "3", label: "Quá khứ", children: <p>Content for Quá khứ...</p> },
            ]}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default Home;
