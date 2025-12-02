import { useEffect, useState } from "react";
import {
  Layout,
  Select,
  DatePicker,
  Button,
  Form,
  Row,
  Col,
  Input,
  Radio,
  Card,
  Tabs,
  Space,
  message,
  Popover,
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
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { GET } from "../../../utils/requests";
import removeVietnameseTones from "../../../shared/helper/removeVietnameseTones";

const { Content } = Layout;
const { Option } = Select;
const { Meta } = Card;

const Home = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [tripType, setTripType] = useState("oneway");

  const [airports, setAirports] = useState([]);
  const [passengerVisible, setPassengerVisible] = useState(false);
  const [rotateSwap, setRotateSwap] = useState(false);
  const [seatClass, setSeatClass] = useState([]);
  const [passengers, setPassengers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });

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

  // Fetch danh sách sân bay
  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const [airportsRes, seatClassRes] = await Promise.all([
          GET("/api/v1/airports"),
          GET("/api/v1/seat-classes"),
        ]);

        setAirports(airportsRes.data);
        setSeatClass(seatClassRes.data);
      } catch (error) {
        messageApi.open({
          type: 'error',
          content: 'Có lỗi khi hiển thị sân bay',
        });
      }
    };
    fetchAirports();
  }, []);

  // Label hành khách
  const getPassengersLabel = () => {
    return `${passengers.adults} người lớn · ${passengers.children} trẻ em · ${passengers.infants} em bé`;
  };

  // Tăng giảm số lượng hành khách
  const updatePassenger = (type, delta) => {
    setPassengers((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta),
    }));
  };

  // Popover hành khách
  const passengerContent = (
    <div style={{ width: 260 }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        {[
          { key: "adults", label: "Người lớn" },
          { key: "children", label: "Trẻ em" },
          { key: "infants", label: "Em bé" },
        ].map(({ key, label }) => (
          <div
            key={key}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <span>{label}</span>
            <Space>
              <Button
                icon={<MinusOutlined />}
                size="small"
                onClick={() => updatePassenger(key, -1)}
              />
              <span>{passengers[key]}</span>
              <Button
                icon={<PlusOutlined />}
                size="small"
                onClick={() => updatePassenger(key, 1)}
              />
            </Space>
          </div>
        ))}
      </Space>
    </div>
  );

  // Submit form + đẩy query + chuyển SearchResults
  const onFinish = (values) => {
    const query = new URLSearchParams({
      from: values.departure,
      to: values.arrival,
      date: values.departureDate.format("YYYY-MM-DD"),
      return:
        tripType === "roundtrip" && values.returnDate
          ? values.returnDate.format("YYYY-MM-DD")
          : "",
      adults: passengers.adults,
      children: passengers.children,
      infants: passengers.infants,
      seat: values.seatClass,
      trip: tripType,
    }).toString();

    navigate(`/search-results?${query}`);
  };

  return (
    <>
      {contextHolder}
      <Layout style={{ minHeight: "100vh" }}>
        {/* Banner */}
        <div style={{ position: "relative", height: 380, overflow: "hidden" }}>
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt="banner"
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backdropFilter: "brightness(0.7)",
            }}
          >
            <h2 style={{ color: "white", fontSize: 32, fontWeight: 600 }}>
              Tìm & đặt vé máy bay giá rẻ cùng Traveloka
            </h2>
          </div>
        </div>

        {/* Form tìm kiếm */}
        <Content style={{ padding: "24px", background: "#f5f5f5" }}>
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              background: "white",
              padding: 24,
              borderRadius: 12,
              boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
            }}
          >
            <Form
              layout="vertical"
              form={form}
              onFinish={onFinish}
              initialValues={{
                departure: "SGN",
                arrival: "HAN",
                departureDate: dayjs(),
                seatClass: "Economy",
              }}
            >
              {/* Loại chuyến đi */}
              <Row style={{ marginBottom: 10 }}>
                <Radio.Group
                  value={tripType}
                  onChange={(e) => setTripType(e.target.value)}
                  optionType="button"
                  buttonStyle="solid"
                  size="small"
                >
                  <Radio.Button value="oneway">Một chiều</Radio.Button>
                  <Radio.Button value="roundtrip">Khứ hồi</Radio.Button>
                </Radio.Group>
              </Row>

              {/* Điểm đi - điểm đến */}
              <Row gutter={16}>
                <Col xs={24} md={10}>
                  <Form.Item name="departure" label="Điểm đi">
                    <Select
                      size="large"
                      showSearch
                      optionFilterProp="label"
                      suffixIcon={<EnvironmentOutlined />}
                      options={airports.map((a) => ({
                        label: a.name,
                        value: a.iata_code,
                      }))}
                      filterOption={(input, option) =>
                        removeVietnameseTones(option.label).includes(
                          removeVietnameseTones(input)
                        )
                      }
                    />
                  </Form.Item>
                </Col>

                {/* Swap button */}
                <Col
                  xs={24}
                  md={4}
                  style={{ display: "flex", justifyContent: "center", alignItems: 'center' }}
                >
                  <Button
                    icon={
                      <SwapOutlined
                        style={{
                          fontSize: 20,
                          color: "#888",
                          transition: "0.3s",
                          transform: rotateSwap ? "rotate(180deg)" : "rotate(0deg)"
                        }}
                      />
                    }
                    size="large"
                    onClick={() => {
                      const d = form.getFieldValue("departure");
                      const a = form.getFieldValue("arrival");
                      form.setFieldsValue({ departure: a, arrival: d });
                      setRotateSwap(!rotateSwap);
                    }}
                  />
                </Col>

                <Col xs={24} md={10}>
                  <Form.Item
                    name="arrival"
                    label="Điểm đến"
                    rules={[
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (value && value === getFieldValue("departure")) {
                            return Promise.reject(
                              "Điểm đến phải khác điểm đi"
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <Select
                      size="large"
                      showSearch
                      optionFilterProp="label"
                      suffixIcon={<EnvironmentOutlined />}
                      options={airports.map((a) => ({
                        label: a.name,
                        value: a.iata_code,
                      }))}
                      filterOption={(input, option) =>
                        removeVietnameseTones(option.label).includes(
                          removeVietnameseTones(input)
                        )
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Ngày */}
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item name="departureDate" label="Ngày đi">
                    <DatePicker
                      size="large"
                      style={{ width: "100%" }}
                      format="DD/MM/YYYY"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item name="returnDate" label="Ngày về">
                    <DatePicker
                      placeholder="Chọn ngày về"
                      size="large"
                      style={{ width: "100%" }}
                      format="DD/MM/YYYY"
                      disabled={tripType === "oneway"}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Hành khách + hạng ghế */}
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label="Hành khách">
                    <Popover
                      content={passengerContent}
                      trigger="click"
                      placement="bottomLeft"
                      open={passengerVisible}
                      onOpenChange={setPassengerVisible}
                    >
                      <Input
                        size="large"
                        readOnly
                        value={getPassengersLabel()}
                        suffix={
                          <Space>
                            <UserOutlined />
                            <DownOutlined
                              style={{
                                transition: "0.3s",
                                transform: passengerVisible ? "rotate(180deg)" : "rotate(0deg)"
                              }}
                            />
                          </Space>
                        }
                      />
                    </Popover>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item name="seatClass" label="Hạng ghế">
                    <Select
                      size="large"
                      options={seatClass.map(item => ({
                        label: item.class_name,
                        value: item.class_name
                      }))}
                    />
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
        </Content>
        {/* Deal */}
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
    </>
  );
};

export default Home;