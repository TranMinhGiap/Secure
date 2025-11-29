// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import {
//   Layout,
//   Button,
//   List,
//   Row,
//   Col,
//   Typography,
//   Space,
//   Divider,
//   Checkbox,
//   Radio,
//   Slider,
//   Select,
//   Tag,
//   Spin,
//   Card,
// } from 'antd';
// import {
//   ArrowLeftOutlined,
//   EnvironmentOutlined,
//   ClockCircleOutlined,
//   GiftOutlined,
//   CalendarOutlined,
//   UserOutlined,
//   SwapOutlined,
// } from '@ant-design/icons';
// import dayjs from 'dayjs';

// const { Content, Sider } = Layout;
// const { Title, Text } = Typography;
// const { Group: RadioGroup } = Radio;

// const SearchResults = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { flights: initialFlights, payload } = location.state || {};
//   console.log(initialFlights);
//   const [filters, setFilters] = useState({
//     stops: 'any',
//     airline: [],
//     departureTime: [0, 24],
//     arrivalTime: [0, 24], 
//     priceRange: [0, 10000000],
//     promo: false,
//   });
//   const [loading, setLoading] = useState(false);

//   if (!initialFlights || initialFlights.length === 0) {
//     return (
//       <Layout style={{ minHeight: '100vh' }}>
//         <Content style={{ padding: '24px', background: '#f5f5f5' }}>
//           <div style={{ textAlign: 'center', padding: '50px' }}>
//             <Title level={3}>Không tìm thấy chuyến bay</Title>
//             <Button type="primary" onClick={() => navigate('/')}>
//               Quay về tìm kiếm
//             </Button>
//           </div>
//         </Content>
//       </Layout>
//     );
//   }

//   const handleFilterChange = (type, value) => {
//     setFilters((prev) => ({ ...prev, [type]: value }));
//     setLoading(true);
//     setTimeout(() => setLoading(false), 300);
//   };

//   const applyFilters = () => {
//     let filtered = initialFlights;
//     if (filters.stops !== 'any') {
//       filtered = filtered.filter((f) =>
//         filters.stops === 'direct' ? f.stops === 0 : f.stops === parseInt(filters.stops)
//       );
//     }
//     if (filters.airline.length > 0) {
//       filtered = filtered.filter((f) => filters.airline.includes(f.airline));
//     }
//     filtered = filtered.filter((f) => {
//       const depHour = f.departureTime ? parseInt(f.departureTime.split(':')[0]) || 0 : 0;
//       const arrHour = f.arrivalTime ? parseInt(f.arrivalTime.split(':')[0]) || 0 : 0;
//       return (
//         depHour >= filters.departureTime[0] &&
//         depHour <= filters.departureTime[1] &&
//         arrHour >= filters.arrivalTime[0] &&
//         arrHour <= filters.arrivalTime[1]
//       );
//     });
//     filtered = filtered.filter((f) => {
//       const priceNum = parseInt(f.price.replace(/[^\d]/g, '')) || 0;
//       return priceNum >= filters.priceRange[0] && priceNum <= filters.priceRange[1];
//     });
//     if (filters.promo) filtered = filtered.filter((f) => f.promo);
//     return filtered;
//   };

//   const displayedFlights = applyFilters();
//   console.log(displayedFlights);
//   const airlines = [...new Set(initialFlights.map((f) => f.airline))].map((a) => ({
//     label: a,
//     value: a,
//   }));

//   const stopsOptions = [
//     { label: 'Tất cả', value: 'any' },
//     { label: 'Bay thẳng', value: 'direct' },
//     { label: '1 điểm dừng', value: '1' },
//     { label: '2+ điểm dừng', value: '2' },
//   ];

//   return (
//     <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
//       {/* Sidebar Bộ lọc */}
//       <Sider
//         width={280}
//         style={{
//           background: '#fff',
//           padding: '20px',
//           borderRight: '1px solid #f0f0f0',
//           overflowY: 'auto',
//         }}
//       >
//         <Title level={5}>Bộ lọc chuyến bay</Title>
//         <Divider orientation="left">Số điểm dừng</Divider>
//         <RadioGroup
//           value={filters.stops}
//           onChange={(e) => handleFilterChange('stops', e.target.value)}
//           style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
//         >
//           {stopsOptions.map((opt) => (
//             <Radio key={opt.value} value={opt.value}>
//               {opt.label}
//             </Radio>
//           ))}
//         </RadioGroup>

//         <Divider orientation="left">Hãng hàng không</Divider>
//         <Checkbox.Group
//           options={airlines}
//           value={filters.airline}
//           onChange={(v) => handleFilterChange('airline', v)}
//           style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
//         />

//         <Divider orientation="left">Giờ cất cánh</Divider>
//         <Slider
//           range
//           min={0}
//           max={23}
//           marks={{ 0: '00h', 6: '06h', 12: '12h', 18: '18h', 23: '23h' }}
//           value={filters.departureTime}
//           onChange={(v) => handleFilterChange('departureTime', v)}
//         />

//         <Divider orientation="left">Giờ hạ cánh</Divider>
//         <Slider
//           range
//           min={0}
//           max={23}
//           marks={{ 0: '00h', 6: '06h', 12: '12h', 18: '18h', 23: '23h' }}
//           value={filters.arrivalTime}
//           onChange={(v) => handleFilterChange('arrivalTime', v)}
//         />

//         <Divider orientation="left">Giá vé</Divider>
//         <Slider
//           range
//           min={0}
//           max={10000000}
//           marks={{ 0: '0đ', 5000000: '5tr', 10000000: '10tr' }}
//           value={filters.priceRange}
//           onChange={(v) => handleFilterChange('priceRange', v)}
//         />

//         <Divider orientation="left">Ưu đãi</Divider>
//         <Checkbox
//           checked={filters.promo}
//           onChange={(e) => handleFilterChange('promo', e.target.checked)}
//         >
//           <GiftOutlined /> Có khuyến mãi
//         </Checkbox>
//       </Sider>

//       {/* Content */}
//       <Content style={{ padding: '20px 40px' }}>
//         <Spin spinning={loading}>
//           {/* Thông tin tìm kiếm ở trên */}
//           <Card
//             style={{
//               marginBottom: 20,
//               borderRadius: 8,
//               boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
//             }}
//           >
//             <Row align="middle" justify="space-between">
//               <Col>
//                 <Space>
//                   <Button
//                     icon={<ArrowLeftOutlined />}
//                     onClick={() => navigate('/')}
//                     type="text"
//                   >
//                     Quay lại
//                   </Button>
//                   <Title level={4} style={{ margin: 0 }}>
//                     {payload.departure} → {payload.arrival}
//                   </Title>
//                 </Space>
//                 <Space style={{ marginTop: 8 }}>
//                   <CalendarOutlined style={{marginLeft: 10}}/>
//                   <Text>
//                     {dayjs(payload.departureDate).format('DD/MM/YYYY')}
//                     {payload.returnDate
//                       ? ` - ${dayjs(payload.returnDate).format('DD/MM/YYYY')}`
//                       : ''}
//                   </Text>
//                   <UserOutlined />
//                   <Text>
//                     {payload.passengers.adults +
//                       payload.passengers.children}{' '}
//                     khách • {payload.seatClass}
//                   </Text>
//                 </Space>
//               </Col>
//             </Row>
//           </Card>

//           {/* Danh sách chuyến bay */}
//           <Text strong style={{ display: 'block', marginBottom: 12 }}>
//             Tìm thấy {displayedFlights.length} chuyến bay phù hợp
//           </Text>
//           <List
//             dataSource={displayedFlights}
//             renderItem={(flight) => (
//               <List.Item
//                 key={flight.id}
//                 style={{
//                   background: '#fff',
//                   padding: '16px 24px',
//                   borderRadius: 8,
//                   marginBottom: 12,
//                   border: '1px solid #f0f0f0',
//                 }}
//               >
//                 <Row justify="space-between" align="middle" style={{ width: '100%' }}>
//                   <Col>
//                     <Space align="start">
//                       <img
//                         src={`https://via.placeholder.com/40x40?text=${flight.airline.charAt(
//                           0
//                         )}`}
//                         alt={flight.airline}
//                         style={{ borderRadius: '50%' }}
//                       />
//                       <div>
//                         <Title level={5} style={{ margin: 0 }}>
//                           {flight.airline}
//                         </Title>
//                         <Text type="secondary">{flight.code}</Text>
//                       </div>
//                     </Space>
//                   </Col>
//                   <Col>
//                     <Space split={<Divider type="vertical" />}>
//                       <Space direction="vertical" size={0}>
//                         <Text strong>{flight.departureTime || 'N/A'}</Text>
//                         <Text type="secondary">{flight.from}</Text>
//                       </Space>
//                       <div style={{ textAlign: 'center' }}>
//                         <ClockCircleOutlined />
//                         <br />
//                         <Text type="secondary">
//                           {flight.stops ? `${flight.stops} dừng` : 'Thẳng'}
//                         </Text>
//                       </div>
//                       <Space direction="vertical" size={0}>
//                         <Text strong>{flight.arrivalTime || 'N/A'}</Text>
//                         <Text type="secondary">{flight.to}</Text>
//                       </Space>
//                     </Space>
//                   </Col>
//                   <Col>
//                     <Space direction="vertical" align="end">
//                       <Title level={4} style={{ color: '#00ab6b', margin: 0 }}>
//                         {flight.price}
//                       </Title>
//                       <Button type="primary" onClick={() => console.log('Chọn vé', flight.id)}>
//                         Chọn
//                       </Button>
//                     </Space>
//                   </Col>
//                 </Row>
//               </List.Item>
//             )}
//           />
//         </Spin>
//       </Content>
//     </Layout>
//   );
// };

// export default SearchResults;


// import React, { useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import {
//   Layout,
//   Button,
//   List,
//   Row,
//   Col,
//   Typography,
//   Space,
//   Divider,
//   Checkbox,
//   message,
//   Radio,
//   Slider,
//   Spin,
//   Skeleton,
//   Card,
//   Empty,
// } from "antd";
// import {
//   ArrowLeftOutlined,
//   CalendarOutlined,
//   UserOutlined,
//   ClockCircleOutlined,
// } from "@ant-design/icons";
// import dayjs from "dayjs";
// import { GET, POST } from "../../../utils/requests";

// const { Content, Sider } = Layout;
// const { Title, Text } = Typography;

// const SearchResults = () => {
//   const navigate = useNavigate();
//   const [messageApi, contextHolder] = message.useMessage();

//   // Lấy parameters từ URL
//   const [searchParams] = useSearchParams();
//   const payload = {
//     departure: searchParams.get("from"),
//     arrival: searchParams.get("to"),
//     departureDate: searchParams.get("date"),
//     returnDate: searchParams.get("return") || null,
//     adults: Number(searchParams.get("adults")) || 1,
//     children: Number(searchParams.get("children")) || 0,
//     infants: Number(searchParams.get("infants")) || 0,
//     seatClass: searchParams.get("seat") || "Economy",
//     tripType: searchParams.get("trip") || "oneway",
//   };

//   console.log(payload);

//   const [flights, setFlights] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Bộ lọc
//   const [filters, setFilters] = useState({
//     stops: "any",
//     airline: [],
//     departureTime: [0, 24],
//     arrivalTime: [0, 24],
//     priceRange: [0, 10000000],
//     promo: false,
//   });

//   useEffect(() => {
//     fetchFlights();
//   }, []);

//   const fetchFlights = async () => {
//     setLoading(true);
//     try {
//       const result = await GET(`/flights/fullsearch?ap=${payload.departure}.${payload.arrival}&dt=${payload.departureDate}.${payload.returnDate ? payload.returnDate : "NA"}&ps=${payload.adults}.${payload.children}.${payload.infants}&sc=${payload.seatClass}`);
//       console.log(result.data);
//       // setFlights(result.data);
//     } catch (err) {
//       messageApi.open({
//         type: 'error',
//         content: 'Có lỗi khi hiển thị chuyến bay',
//       });
//       console.error("Lỗi API:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Khi thay đổi bộ lọc
//   const handleFilterChange = (key, value) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   // Áp bộ lọc
//   const applyFilters = () => {
//     let filtered = flights;

//     if (filters.stops !== "any") {
//       filtered = filtered.filter((f) =>
//         filters.stops === "direct" ? f.stops === 0 : f.stops === Number(filters.stops)
//       );
//     }

//     if (filters.airline.length > 0) {
//       filtered = filtered.filter((f) => filters.airline.includes(f.airline));
//     }

//     filtered = filtered.filter((f) => {
//       const depHour = Number(f.departureTime.split(":")[0]);
//       const arrHour = Number(f.arrivalTime.split(":")[0]);

//       return (
//         depHour >= filters.departureTime[0] &&
//         depHour <= filters.departureTime[1] &&
//         arrHour >= filters.arrivalTime[0] &&
//         arrHour <= filters.arrivalTime[1]
//       );
//     });

//     filtered = filtered.filter((f) => {
//       const priceNum = parseInt(f.price.replace(/[^\d]/g, ""));
//       return (
//         priceNum >= filters.priceRange[0] &&
//         priceNum <= filters.priceRange[1]
//       );
//     });

//     return filtered;
//   };

//   const displayedFlights = applyFilters();

//   const airlines = [...new Set(flights.map((f) => f.airline))].map((a) => ({
//     label: a,
//     value: a,
//   }));

//   return (
//     <>
//       {contextHolder}
//       <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
//         {/* SIDEBAR */}
//         <Sider
//           width={280}
//           style={{
//             background: "#fff",
//             padding: "20px",
//             borderRight: "1px solid #eee",
//             height: "100vh",
//             overflowY: "auto",
//           }}
//         >
//           <Title level={5}>Bộ lọc chuyến bay</Title>
//           <Divider>Số điểm dừng</Divider>

//           <Radio.Group
//             onChange={(e) => handleFilterChange("stops", e.target.value)}
//             value={filters.stops}
//             style={{ display: "flex", flexDirection: "column", gap: 6 }}
//           >
//             <Radio value="any">Tất cả</Radio>
//             <Radio value="direct">Bay thẳng</Radio>
//             <Radio value="1">1 điểm dừng</Radio>
//             <Radio value="2">2+ điểm dừng</Radio>
//           </Radio.Group>

//           <Divider>Hãng hàng không</Divider>
//           <Checkbox.Group
//             options={airlines}
//             value={filters.airline}
//             onChange={(v) => handleFilterChange("airline", v)}
//             style={{ display: "flex", flexDirection: "column", gap: 6 }}
//           />

//           <Divider>Giờ cất cánh</Divider>
//           <Slider
//             range
//             min={0}
//             max={24}
//             value={filters.departureTime}
//             marks={{ 0: "0h", 6: "6h", 12: "12h", 18: "18h", 24: "24h" }}
//             onChange={(v) => handleFilterChange("departureTime", v)}
//           />

//           <Divider>Giờ hạ cánh</Divider>
//           <Slider
//             range
//             min={0}
//             max={24}
//             value={filters.arrivalTime}
//             marks={{ 0: "0h", 6: "6h", 12: "12h", 18: "18h", 24: "24h" }}
//             onChange={(v) => handleFilterChange("arrivalTime", v)}
//           />

//           <Divider>Giá vé</Divider>
//           <Slider
//             range
//             min={0}
//             max={10000000}
//             value={filters.priceRange}
//             marks={{ 0: "0đ", 5000000: "5tr", 10000000: "10tr" }}
//             onChange={(v) => handleFilterChange("priceRange", v)}
//           />
//         </Sider>

//         {/* CONTENT */}
//         <Content style={{ padding: "20px 40px" }}>
//           {/* Header thông tin tìm kiếm */}
//           <Card style={{ marginBottom: 20 }}>
//             <Row align="middle" justify="space-between">
//               <Space>
//                 <Button
//                   icon={<ArrowLeftOutlined />}
//                   onClick={() => navigate("/")}
//                   type="text"
//                 >
//                   Quay lại
//                 </Button>
//                 <Title level={4} style={{ margin: 0 }}>
//                   {payload.departure} → {payload.arrival}
//                 </Title>
//               </Space>
//               <Space>
//                 <CalendarOutlined />
//                 {payload.departureDate &&
//                   dayjs(payload.departureDate).format("DD/MM/YYYY")}
//                 <UserOutlined />
//                 {payload.adults + payload.children} khách • {payload.seatClass}
//               </Space>
//             </Row>
//           </Card>

//           {/* Loading Skeleton */}
//           {loading ? (
//             <>
//               {[1, 2, 3].map((i) => (
//                 <Card key={i} style={{ marginBottom: 16 }}>
//                   <Skeleton active avatar paragraph={{ rows: 2 }} />
//                 </Card>
//               ))}
//             </>
//           ) : displayedFlights.length === 0 ? (
//             <Empty description="Không có chuyến bay phù hợp" />
//           ) : (
//             <List
//               dataSource={displayedFlights}
//               renderItem={(f) => (
//                 <Card
//                   key={f.id}
//                   style={{ marginBottom: 16 }}
//                   bodyStyle={{ padding: 20 }}
//                 >
//                   <Row justify="space-between" align="middle">
//                     <Space>
//                       <img
//                         src={`https://via.placeholder.com/40x40?text=${f.airline[0]}`}
//                         style={{ borderRadius: "50%" }}
//                       />
//                       <div>
//                         <Title level={5}>{f.airline}</Title>
//                         <Text type="secondary">{f.code}</Text>
//                       </div>
//                     </Space>

//                     <Space split={<Divider type="vertical" />}>
//                       <div>
//                         <Text strong>{f.departureTime}</Text>
//                         <br />
//                         <Text type="secondary">{f.from}</Text>
//                       </div>
//                       <div style={{ textAlign: "center" }}>
//                         <ClockCircleOutlined />
//                         <br />
//                         <Text type="secondary">
//                           {f.stops === 0 ? "Thẳng" : `${f.stops} dừng`}
//                         </Text>
//                       </div>
//                       <div>
//                         <Text strong>{f.arrivalTime}</Text>
//                         <br />
//                         <Text type="secondary">{f.to}</Text>
//                       </div>
//                     </Space>

//                     <Space direction="vertical" align="end">
//                       <Title level={4} style={{ color: "#00ab6b" }}>
//                         {f.price}
//                       </Title>
//                       <Button type="primary">Chọn</Button>
//                     </Space>
//                   </Row>
//                 </Card>
//               )}
//             />
//           )}
//         </Content>
//       </Layout>
//     </>
//   );
// };

// export default SearchResults;


// import React, { useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import {
//   Layout,
//   Button,
//   List,
//   Row,
//   Col,
//   Typography,
//   Space,
//   Divider,
//   Checkbox,
//   message,
//   Slider,
//   Skeleton,
//   Card,
//   Empty,
// } from "antd";
// import {
//   ArrowLeftOutlined,
//   CalendarOutlined,
//   UserOutlined,
//   ClockCircleOutlined,
// } from "@ant-design/icons";
// import dayjs from "dayjs";
// import { GET } from "../../../utils/requests";

// const { Content, Sider } = Layout;
// const { Title, Text } = Typography;

// // Helper convert duration "2h 15m" -> phút
// const parseDuration = (str) => {
//   if (!str) return 0;
//   const h = parseInt(str.split("h")[0]) || 0;
//   const m = parseInt(str.split("h")[1]) || 0;
//   return h * 60 + m;
// };

// // Helper convert phút -> "2h 15m"
// const formatDuration = (minutes) => {
//   const h = Math.floor(minutes / 60);
//   const m = minutes % 60;
//   return `${h}h ${m}m`;
// };

// const SearchResults = () => {
//   const navigate = useNavigate();
//   const [messageApi, contextHolder] = message.useMessage();
//   const [searchParams] = useSearchParams();

//   // Payload từ URL
//   const payload = {
//     departure: searchParams.get("from"),
//     arrival: searchParams.get("to"),
//     departureDate: searchParams.get("date"),
//     returnDate: searchParams.get("return") || null,
//     adults: Number(searchParams.get("adults")) || 1,
//     children: Number(searchParams.get("children")) || 0,
//     infants: Number(searchParams.get("infants")) || 0,
//     seatClass: searchParams.get("seat") || "Economy",
//     tripType: searchParams.get("trip") || "oneway",
//   };

//   // State
//   const [flights, setFlights] = useState([]);
//   const [airlineOptions, setAirlineOptions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Giá min/max
//   const [priceLimit, setPriceLimit] = useState([0, 0]);

//   // Duration min/max (phút)
//   const [durationLimit, setDurationLimit] = useState([0, 0]);

//   // Filters
//   const [filters, setFilters] = useState({
//     airline: [],
//     priceRange: [0, 0],
//     durationRange: [0, 0],
//   });

//   useEffect(() => {
//     fetchFlights();
//   }, []);

//   const fetchFlights = async () => {
//     try {
//       setLoading(true);

//       const res = await GET(`/fullSearch`);
//       console.log(res);

//       const data = res.data;
//       const flightsList = data.flights || [];

//       setFlights(flightsList);

//       // Airline filter data
//       const airlinesArr = Object.values(data.airlineData).map((item) => ({
//         label: (
//           <Space>
//             <img src={item.logo} width={24} height={24} alt="" />
//             {item.name}
//           </Space>
//         ),
//         value: item.code,
//       }));
//       setAirlineOptions(airlinesArr);

//       // Set min/max price
//       setPriceLimit([data.minPrice, data.maxPrice]);
//       setFilters((prev) => ({
//         ...prev,
//         priceRange: [data.minPrice, data.maxPrice],
//       }));

//       // Set min/max duration
//       const minDur = parseDuration(data.durationRange.minDuration);
//       const maxDur = parseDuration(data.durationRange.maxDuration);

//       setDurationLimit([minDur, maxDur]);
//       setFilters((prev) => ({
//         ...prev,
//         durationRange: [minDur, maxDur],
//       }));
//     } catch (err) {
//       messageApi.error("Không thể tải danh sách chuyến bay");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const applyFilters = () => {
//     let filtered = flights;

//     // Lọc hãng
//     if (filters.airline.length > 0) {
//       filtered = filtered.filter((f) =>
//         filters.airline.includes(f.flight.airline.iata_code)
//       );
//     }

//     // Lọc giá
//     filtered = filtered.filter(
//       (f) =>
//         f.pricePerson >= filters.priceRange[0] &&
//         f.pricePerson <= filters.priceRange[1]
//     );

//     // Lọc duration (phút)
//     filtered = filtered.filter((f) => {
//       const d = parseDuration(f.duration);
//       return d >= filters.durationRange[0] && d <= filters.durationRange[1];
//     });

//     return filtered;
//   };

//   const displayedFlights = applyFilters();

//   return (
//     <>
//       {contextHolder}
//       <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>

//         {/* SIDEBAR */}
//         <Sider width={280} style={{ background: "#fff", padding: 20 }}>
//           <Title level={5}>Bộ lọc chuyến bay</Title>

//           {/* Hãng hàng không */}
//           <Divider>Hãng hàng không</Divider>
//           <Checkbox.Group
//             options={airlineOptions}
//             value={filters.airline}
//             onChange={(v) => setFilters((p) => ({ ...p, airline: v }))}
//             style={{ display: "flex", flexDirection: "column", gap: 6 }}
//           />

//           {/* Lọc giá */}
//           <Divider>Giá vé</Divider>
//           <Slider
//             range
//             min={priceLimit[0]}
//             max={priceLimit[1]}
//             value={filters.priceRange}
//             onChange={(v) => setFilters((p) => ({ ...p, priceRange: v }))}
//             tooltip={{
//               formatter: (val) =>
//                 val?.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
//             }}
//           />

//           {/* Duration */}
//           <Divider>Thời gian bay</Divider>
//           <Slider
//             range
//             min={durationLimit[0]}
//             max={durationLimit[1]}
//             value={filters.durationRange}
//             onChange={(v) => setFilters((p) => ({ ...p, durationRange: v }))}
//             tooltip={{ formatter: (v) => formatDuration(v) }}
//             marks={{
//               [durationLimit[0]]: formatDuration(durationLimit[0]),
//               [durationLimit[1]]: formatDuration(durationLimit[1]),
//             }}
//           />
//         </Sider>

//         {/* CONTENT */}
//         <Content style={{ padding: "20px 40px" }}>
//           <Card style={{ marginBottom: 20 }}>
//             <Row justify="space-between">
//               <Space>
//                 <Button icon={<ArrowLeftOutlined />} type="text" onClick={() => navigate("/")}>
//                   Quay lại
//                 </Button>
//                 <Title level={4} style={{ margin: 0 }}>
//                   {payload.departure} → {payload.arrival}
//                 </Title>
//               </Space>
//               <Space>
//                 <CalendarOutlined />
//                 {dayjs(payload.departureDate).format("DD/MM/YYYY")}
//                 <UserOutlined />
//                 {payload.adults + payload.children} khách
//               </Space>
//             </Row>
//           </Card>

//           {loading ? (
//             <>
//               {[1, 2, 3].map((i) => (
//                 <Card key={i} style={{ marginBottom: 16 }}>
//                   <Skeleton active paragraph={{ rows: 2 }} />
//                 </Card>
//               ))}
//             </>
//           ) : displayedFlights.length === 0 ? (
//             <Empty description="Không có chuyến bay phù hợp" />
//           ) : (
//             <List
//               dataSource={displayedFlights}
//               renderItem={(f) => (
//                 <Card key={f.id} style={{ marginBottom: 16 }} bodyStyle={{ padding: 20 }}>
//                   <Row justify="space-between">
//                     {/* Logo hãng */}
//                     <Space>
//                       <img
//                         src={f.flight.airline.logo_url}
//                         width={40}
//                         style={{ borderRadius: "50%" }}
//                       />
//                       <div>
//                         <Title level={5}>{f.flight.airline.name}</Title>
//                         <Text type="secondary">{f.flight.flight_number}</Text>
//                       </div>
//                     </Space>

//                     {/* Giờ bay */}
//                     <Space split={<Divider type="vertical" />}>
//                       <div>
//                         <Text strong>
//                           {f.departureTime.hour}:{f.departureTime.minute}
//                         </Text>
//                         <br />
//                         <Text type="secondary">{f.flight.departureAirport.iata_code}</Text>
//                       </div>

//                       <div style={{ textAlign: "center" }}>
//                         <ClockCircleOutlined />
//                         <br />
//                         <Text type="secondary">{f.duration}</Text>
//                       </div>

//                       <div>
//                         <Text strong>
//                           {f.arrivalTime.hour}:{f.arrivalTime.minute}
//                         </Text>
//                         <br />
//                         <Text type="secondary">{f.flight.arrivalAirport.iata_code}</Text>
//                       </div>
//                     </Space>

//                     {/* Giá */}
//                     <Space direction="vertical" align="end">
//                       <Title level={4} style={{ color: "#00ab6b" }}>
//                         {f.pricePerson.toLocaleString("vi-VN")}₫
//                       </Title>
//                       <Button type="primary">Chọn</Button>
//                     </Space>
//                   </Row>
//                 </Card>
//               )}
//             />
//           )}
//         </Content>
//       </Layout>
//     </>
//   );
// };

// export default SearchResults;


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
import { GET } from "../../../utils/requests";

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
      // const res = await GET(
      //   `/flights/fullsearch?ap=${payload.departure}.${payload.arrival}&dt=${payload.departureDate}.${
      //     payload.returnDate ?? "NA"
      //   }&ps=${payload.adults}.${payload.children}.${payload.infants}&sc=${payload.seatClass}`
      // );

      // const data = res.data.data;
      // setFlights(data.flights || []);

      const res = await GET(`/fullSearch`);

      const data = res.data;
      const flightsList = data.flights || [];

      setFlights(flightsList);

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
                  style={{ fontSize: 16 }}
                  onClick={() =>
                    navigate("/booking", {
                      state: { flight: selectedFlight, passengers: payload },
                    })
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