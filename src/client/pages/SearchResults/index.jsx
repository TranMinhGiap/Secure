import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Layout,
  Button,
  List,
  Row,
  Typography,
  Space,
  Divider,
  Checkbox,
  message,
  Badge,
  Slider,
  Skeleton,
  Card,
  Empty,
  Drawer,
  Tag,
  Popover,
} from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { GET, POST } from "../../../utils/requests";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

/* ======================
    Helper Functions
====================== */

// "2h 15m" → phút
const parseDuration = (str) => {
  if (!str) return 0;
  const [h, rest] = str.split("h");
  const m = parseInt(rest) || 0;
  return Number(h) * 60 + m;
};

// phút → "2h 15m"
const formatDuration = (m) => `${Math.floor(m / 60)}h ${m % 60}m`;

// Format VNĐ
const formatPrice = (n) =>
  n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });


/* ======================
      MAIN COMPONENT
====================== */

const SearchResults = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [searchParams] = useSearchParams();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);

  const payload = {
    departure: searchParams.get("from"),
    arrival: searchParams.get("to"),
    departureDate: searchParams.get("date"),
    returnDate: searchParams.get("return") || null,
    adults: Number(searchParams.get("adults")) || 1,
    children: Number(searchParams.get("children")) || 0,
    infants: Number(searchParams.get("infants")) || 0,
    seatClass: searchParams.get("seat") || "Economy",
    tripType: searchParams.get("trip") || "oneway",
  };

  /* STATE */
  const [flights, setFlights] = useState([]);
  const [airlineOptions, setAirlineOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [priceLimit, setPriceLimit] = useState([0, 0]);
  const [durationLimit, setDurationLimit] = useState([0, 0]);

  const [filters, setFilters] = useState({
    airline: [],
    priceRange: [0, 0],
    durationRange: [0, 0],
  });

  const [sortType, setSortType] = useState("none");

  /* ============ Fetch flights ============= */
  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const res = await GET(
        `/api/v1/flights/fullsearch?ap=${payload.departure}.${payload.arrival}&dt=${payload.departureDate}.${
          payload.returnDate ?? "NA"
        }&ps=${payload.adults}.${payload.children}.${payload.infants}&sc=${payload.seatClass}`
      );

      const data = res.data;
      setFlights(data.flights || []);

      // const res = await GET(`/fullSearch`);

      // const data = res.data;
      // const flightsList = data.flights || [];

      // setFlights(flightsList);

      // Airline options
      const airlineList = Object.values(data.airlineData).map((a) => ({
        label: (
          <Space align="center">
            <img
              src={a.logo}
              width={26}
              height={26}
              style={{
                borderRadius: "50%",
                objectFit: "cover",
              }}
              alt=""
            />
            {a.name}
          </Space>
        ),
        value: a.code,
      }));
      setAirlineOptions(airlineList);

      // Price range
      setPriceLimit([data.minPrice, data.maxPrice]);
      setFilters((p) => ({ ...p, priceRange: [data.minPrice, data.maxPrice] }));

      // Duration range
      const minDur = parseDuration(data.durationRange.minDuration);
      const maxDur = parseDuration(data.durationRange.maxDuration);

      setDurationLimit([minDur, maxDur]);
      setFilters((p) => ({ ...p, durationRange: [minDur, maxDur] }));
    } catch (err) {
      messageApi.error("Không thể tải danh sách chuyến bay");
    } finally {
      setLoading(false);
    }
  };

  /* ============ FILTER ============= */
  const applyFilters = () => {
    let filtered = flights;

    // Airline
    if (filters.airline.length > 0) {
      filtered = filtered.filter((f) =>
        filters.airline.includes(f.flight.airline.iata_code)
      );
    }

    // Price
    filtered = filtered.filter(
      (f) =>
        f.pricePerson >= filters.priceRange[0] &&
        f.pricePerson <= filters.priceRange[1]
    );

    // Duration
    filtered = filtered.filter((f) => {
      const d = parseDuration(f.duration);
      return d >= filters.durationRange[0] && d <= filters.durationRange[1];
    });

    return filtered;
  };

  /* ============ SORT ============= */
  const applySort = (list) => {
    switch (sortType) {
      case "price-asc":
        return [...list].sort((a, b) => a.pricePerson - b.pricePerson);

      case "price-desc":
        return [...list].sort((a, b) => b.pricePerson - a.pricePerson);

      case "depart-asc":
        return [...list].sort(
          (a, b) =>
            Number(a.departureTime.hour) * 60 +
            Number(a.departureTime.minute) -
            (Number(b.departureTime.hour) * 60 +
              Number(b.departureTime.minute))
        );

      case "depart-desc":
        return [...list].sort(
          (a, b) =>
            Number(b.departureTime.hour) * 60 +
            Number(b.departureTime.minute) -
            (Number(a.departureTime.hour) * 60 +
              Number(a.departureTime.minute))
        );

      case "duration-asc":
        return [...list].sort(
          (a, b) => parseDuration(a.duration) - parseDuration(b.duration)
        );

      case "duration-desc":
        return [...list].sort(
          (a, b) => parseDuration(b.duration) - parseDuration(a.duration)
        );

      default:
        return list;
    }
  };

  const displayedFlights = applySort(applyFilters());


  /* ====================================
        RENDER
  ==================================== */

  return (
    <>
      {contextHolder}

      <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>

        {/* ========= SIDEBAR =========== */}
        <Sider width={280} style={{ background: "#fff", padding: 20 }}>
          <div
            style={{
              position: "sticky",
              top: 20,
              height: "calc(100vh - 40px)",
              overflowY: "auto",
            }}
          >
            <Title style={{ textAlign: 'center', color: 'green', marginTop: 10 }} level={4}>Bộ lọc chuyến bay</Title>

            {/* Airline */}
            <Divider>Hãng hàng không</Divider>
            <Checkbox.Group
              options={airlineOptions}
              value={filters.airline}
              onChange={(v) => setFilters((p) => ({ ...p, airline: v }))}
              style={{ display: "flex", flexDirection: "column", gap: 6 }}
            />

            {/* Price */}
            <Divider>Giá vé</Divider>
            <Slider
              style={{ width: "70%", marginLeft: "auto", marginRight: "auto" }}
              range
              min={priceLimit[0]}
              max={priceLimit[1]}
              value={filters.priceRange}
              onChange={(v) => setFilters((p) => ({ ...p, priceRange: v }))}
              marks={{
                [priceLimit[0]]: formatPrice(priceLimit[0]),
                [priceLimit[1]]: formatPrice(priceLimit[1]),
              }}
              tooltip={{ formatter: (v) => formatPrice(v) }}
            />

            {/* Duration */}
            <Divider>Thời gian bay</Divider>
            <Slider
              range
              style={{ width: "80%", marginLeft: "auto", marginRight: "auto" }}
              min={durationLimit[0]}
              max={durationLimit[1]}
              value={filters.durationRange}
              onChange={(v) =>
                setFilters((p) => ({ ...p, durationRange: v }))
              }
              marks={{
                [durationLimit[0]]: formatDuration(durationLimit[0]),
                [durationLimit[1]]: formatDuration(durationLimit[1]),
              }}
              tooltip={{ formatter: (v) => formatDuration(v) }}
            />
          </div>
        </Sider>

        {/* ========= CONTENT =========== */}
        <Content style={{ padding: "20px 40px" }}>

          {/* ===== HEADER ===== */}
          <Card style={{ marginBottom: 20 }}>
            <Row justify="space-between" align="middle">
              <Space>
                <Button
                  icon={<ArrowLeftOutlined />}
                  type="text"
                  onClick={() => navigate("/")}
                >
                  Quay lại
                </Button>

                <Title level={4} style={{ margin: 0 }}>
                  {payload.departure} → {payload.arrival}
                </Title>
              </Space>

              {/* POPUP: chi tiết khách */}
              <Space>
                <CalendarOutlined />
                {dayjs(payload.departureDate).format("DD/MM/YYYY")}

                <Popover
                  trigger="hover"
                  content={
                    <div>
                      <div><Badge status="success" text="Người lớn" />: {payload.adults}</div>
                      <div><Badge status="warning" text="Trẻ em" />: {payload.children}</div>
                      <div><Badge status="error" text="Em bé" />: {payload.infants}</div>
                      <hr/>
                      <div>Hạng ghế: <Tag color='magenta' variant='filled'>{payload.seatClass}</Tag></div>
                    </div>
                  }
                >
                  <Space style={{ cursor: "pointer" }}>
                    <UserOutlined />
                    {payload.adults +
                      payload.children +
                      payload.infants}
                    khách • {payload.seatClass}
                  </Space>
                </Popover>
              </Space>
            </Row>
          </Card>

          {/* ===== SORT BAR ===== */}
          <Card style={{ marginBottom: 20 }}>
            <Space wrap>
              <Text strong>Sắp xếp theo:</Text>

              <Button
                type={sortType === "price-asc" ? "primary" : "default"}
                onClick={() => setSortType("price-asc")}
              >
                Giá thấp → cao
              </Button>

              <Button
                type={sortType === "price-desc" ? "primary" : "default"}
                onClick={() => setSortType("price-desc")}
              >
                Giá cao → thấp
              </Button>

              <Button
                type={sortType === "depart-asc" ? "primary" : "default"}
                onClick={() => setSortType("depart-asc")}
              >
                Giờ đi sớm nhất
              </Button>

              <Button
                type={sortType === "depart-desc" ? "primary" : "default"}
                onClick={() => setSortType("depart-desc")}
              >
                Giờ đi muộn nhất
              </Button>

              <Button
                type={sortType === "duration-asc" ? "primary" : "default"}
                onClick={() => setSortType("duration-asc")}
              >
                Bay ngắn nhất
              </Button>

              <Button
                type={sortType === "duration-desc" ? "primary" : "default"}
                onClick={() => setSortType("duration-desc")}
              >
                Bay dài nhất
              </Button>
            </Space>
          </Card>

          {/* ===== LIST RESULTS ===== */}

          {loading ? (
            <>
              {[1, 2, 3].map((i) => (
                <Card key={i} style={{ marginBottom: 16 }}>
                  <Skeleton active paragraph={{ rows: 2 }} />
                </Card>
              ))}
            </>
          ) : displayedFlights.length === 0 ? (
            <Empty description="Không có chuyến bay phù hợp" />
          ) : (
            <List
              dataSource={displayedFlights}
              renderItem={(f) => (
                <Card
                  key={f.id}
                  style={{ marginBottom: 16 }}
                  bodyStyle={{ padding: 24 }}
                >
                  <Row justify="space-between" align="middle">

                    {/* Logo + tên hãng */}
                    <div style={{ width: 240, display: "flex", gap: 12, alignItems: 'center' }}>
                      <img
                        src={f.flight.airline.logo_url}
                        width={56}
                        height={56}
                        style={{
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                        alt=""
                      />
                      <div>
                        <Title level={5} style={{ marginBottom: 2, marginTop: 0 }}>
                          {f.flight.airline.name}
                        </Title>
                        <Text type="secondary">
                          {f.flight.flight_number}
                        </Text>
                      </div>
                    </div>

                    {/* Giờ đi */}
                    <div style={{ width: 120, textAlign: "center" }}>
                      <Text strong>
                        {f.departureTime.hour}:{f.departureTime.minute}
                      </Text>
                      <br />
                      <Text type="secondary">
                        {f.flight.departureAirport.iata_code}
                      </Text>
                    </div>

                    {/* Duration */}
                    <div
                      style={{
                        width: 110,
                        textAlign: "center",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <ClockCircleOutlined />
                      <br />
                      <Text type="secondary">{f.duration}</Text>
                    </div>

                    {/* Giờ đến */}
                    <div style={{ width: 120, textAlign: "center" }}>
                      <Text strong>
                        {f.arrivalTime.hour}:{f.arrivalTime.minute}
                      </Text>
                      <br />
                      <Text type="secondary">
                        {f.flight.arrivalAirport.iata_code}
                      </Text>
                    </div>

                    {/* Giá + chọn */}
                    <div
                      style={{
                        width: 150,
                        textAlign: "right",
                      }}
                    >
                      <Title level={4} style={{ color: "#00ab6b", marginTop: 0 }}>
                        {formatPrice(f.pricePerson)}
                      </Title>
                      <Button
                        type="primary"
                        onClick={() => {
                          setSelectedFlight(f);
                          setOpenDrawer(true);
                        }}
                      >
                        Chọn
                      </Button>
                    </div>
                  </Row>
                </Card>
              )}
            />
          )}
        </Content>
        <Drawer
          placement="right"
          title="Xác nhận thông tin"
          width={560}
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          styles={{ body: { padding: 0, background: "#fff" } }}
        >
          {selectedFlight && (
            <div style={{ position: "relative", height: "100%", overflow: "hidden" }}>

              {/* BODY – scrollable */}
              <div className="drawer-body-scroll">
                {/* TAB + TITLE */}
                <div style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      display: "inline-block",
                      padding: "6px 12px",
                      borderRadius: 8,
                      background: "#e2f3ff",
                      color: "#0284c7",
                      fontWeight: 600,
                    }}
                  >
                    Khởi hành
                  </div>

                  <div style={{ marginTop: 8, fontSize: 16 }}>
                    {selectedFlight.flight.departureAirport.city} →{" "}
                    {selectedFlight.flight.arrivalAirport.city}
                  </div>

                  <Text type="secondary">
                    {dayjs(payload.departureDate).format("dddd, DD MMM YYYY")}
                  </Text>
                </div>

                <Divider />

                <Card>
                  {/* Airline */}
                  <div style={{ display: "flex", gap: 12 }}>
                    <img
                      src={selectedFlight.flight.airline.logo_url}
                      width={48}
                      height={48}
                      style={{ borderRadius: "50%", objectFit: "cover" }}
                      alt=""
                    />
                    <Title level={5} style={{ marginTop: 6 }}>
                      {selectedFlight.flight.airline.name}
                    </Title>
                  </div>

                  {/* TIME LINE */}
                  <Row justify="space-between" align="middle" style={{ marginTop: 20 }}>
                    <Space direction="vertical" size={0} style={{ textAlign: "center" }}>
                      <Title level={4} style={{ margin: 0 }}>
                        {selectedFlight.departureTime.hour}:{selectedFlight.departureTime.minute}
                      </Title>
                      <div className="airport-badge">
                        {selectedFlight.flight.departureAirport.iata_code}
                      </div>
                    </Space>

                    <div style={{ textAlign: "center" }}>
                      <div style={{ width: 180, height: 2, background: "#d0d0d0", margin: "6px auto" }} />
                      <Text type="secondary">
                        {selectedFlight.duration} — Bay thẳng
                      </Text>
                    </div>

                    <Space direction="vertical" size={0} style={{ textAlign: "center" }}>
                      <Title level={4} style={{ margin: 0 }}>
                        {selectedFlight.arrivalTime.hour}:{selectedFlight.arrivalTime.minute}
                      </Title>
                      <div className="airport-badge">
                        {selectedFlight.flight.arrivalAirport.iata_code}
                      </div>
                    </Space>
                  </Row>
                </Card>

                <Divider />

                {/* PRICE DETAILS */}
                <Title level={5}>Chi tiết giá</Title>

                <div>
                  {payload.adults} người lớn × {formatPrice(selectedFlight.price.adult)}
                </div>

                {payload.children > 0 && (
                  <div>{payload.children} trẻ em × {formatPrice(selectedFlight.price.child)}</div>
                )}

                {payload.infants > 0 && (
                  <div>{payload.infants} em bé × {formatPrice(selectedFlight.price.infant)}</div>
                )}
              </div>

              {/* FOOTER – cố định dưới */}
              <div className="drawer-footer-fixed">

                {/* TOTAL row */}
                <div className="total-row">
                  <span>Tổng cộng</span>
                  <span>
                    {formatPrice(
                      payload.adults * selectedFlight.price.adult +
                      payload.children * selectedFlight.price.child +
                      payload.infants * selectedFlight.price.infant
                    )}
                  </span>
                </div>

                {/* CONFIRM Button */}
                <Button
                  type="primary"
                  block
                  loading={loading}
                  style={{ fontSize: 16 }}
                  onClick={ async () => {
                    setLoading(true);
                    const totalPrice = payload.adults * selectedFlight.price.adult +
                      payload.children * selectedFlight.price.child +
                      payload.infants * selectedFlight.price.infant
                    try {
                      const payloadSession = {
                        outbound_flight_id: selectedFlight.id,
                        return_flight_id: payload.returnDate ? null : null,
                        seat_class_name: payload.seatClass,
                        passengers: [
                          {type: "ADULT", count: payload.adults},
                          {type: "CHILDREN", count: payload.children},
                          {type: "INFANT", count: payload.infants},
                        ],
                        fare_price: {
                          base_price: parseInt(selectedFlight.flightFares[0].base_price),
                          service_fee: parseInt(selectedFlight.flightFares[0].service_fee),
                          tax: parseInt(selectedFlight.flightFares[0].tax),
                          total_price: totalPrice
                        }
                      }

                      await POST(`/api/v1/flight-selection/create-session`, payloadSession);

                    } catch (error) {
                      messageApi.open({
                        type: 'error',
                        content: 'Có lỗi khi đặt vé. Vui lòng thử lại sau.',
                      });
                      navigate("/search-results");
                      return;
                    } finally {
                      setLoading(false);
                    }
                    navigate("/booking", {
                      state: { flight: selectedFlight, passengers: payload },
                    })
                  }
                  }
                >
                  Xác nhận
                </Button>
              </div>

            </div>
          )}
        </Drawer>
      </Layout>
      <style>
        {`
          .drawer-body-scroll {
            height: calc(100vh - 180px); 
            overflow-y: auto;
            padding: 20px 24px;
            background: #f7f9fa;
          }

          .drawer-footer-fixed {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: #fff;
            border-top: 1px solid #e5e5e5;
            padding: 12px 24px 16px;
            z-index: 50;
          }

          .total-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 18px;
            font-weight: 700;
            color: #00a76f;
            margin-bottom: 12px;
          }
        `}
      </style>
    </>
  );
};

export default SearchResults;