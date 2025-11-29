// import { useLocation } from "react-router-dom";
// import {
//   Row,
//   Col,
//   Card,
//   Typography,
//   Input,
//   Select,
//   Divider,
//   Alert,
//   Button,
//   Space,
// } from "antd";
// import { CheckCircleOutlined } from "@ant-design/icons";

// const { Title, Text } = Typography;

// const Booking = () => {
//   const { state } = useLocation();
//   const { flight, passengers } = state;

//   const totalPassengers =
//     passengers.adults + passengers.children + passengers.infants;

//   return (
//     <div style={{ background: "#f5f5f5", minHeight: "100vh" }}>
//       {/* ==== TOP STEPPER ==== */}
//       <div
//         style={{
//           padding: "16px 40px",
//           background: "#fff",
//           borderBottom: "1px solid #eee",
//           display: "flex",
//           alignItems: "center",
//           gap: 12,
//           fontSize: 16,
//         }}
//       >
//         <CheckCircleOutlined style={{ color: "green", fontSize: 20 }} />
//         <span style={{ color: "green", fontWeight: 600 }}>
//           Chi tiết chuyến đi của bạn
//         </span>

//         <span style={{ margin: "0 12px" }}>➜</span>

//         <span style={{ color: "#999" }}>2. Thanh toán</span>
//       </div>

//       <Row gutter={24} style={{ padding: "30px 40px" }}>
//         {/* ============= LEFT SIDE (FORM) ============= */}
//         <Col span={16}>
//           {/* ===== Thông tin liên hệ ===== */}
//           <Card style={{ marginBottom: 24 }}>
//             <Title level={4}>Thông tin liên hệ (nhận vé/phí thanh toán)</Title>

//             <Alert
//               message="Đăng nhập hoặc đăng ký để có giá rẻ hơn và nhiều ưu đãi hơn!"
//               type="info"
//               showIcon
//               style={{ marginBottom: 20 }}
//             />

//             <Row gutter={12}>
//               <Col span={12}>
//                 <Text>Họ *</Text>
//                 <Input placeholder="Như trên CMND (không dấu)" />
//               </Col>

//               <Col span={12}>
//                 <Text>Tên đệm và tên *</Text>
//                 <Input placeholder="Như trên CMND (không dấu)" />
//               </Col>

//               <Col span={12} style={{ marginTop: 16 }}>
//                 <Text>Điện thoại di động *</Text>
//                 <Input addonBefore="+84" placeholder="VD: 0912345678" />
//               </Col>

//               <Col span={12} style={{ marginTop: 16 }}>
//                 <Text>Email *</Text>
//                 <Input placeholder="VD: email@example.com" />
//               </Col>
//             </Row>
//           </Card>

//           {/* ===== Thông tin hành khách ===== */}
//           <Card>
//             <Title level={4}>Thông tin hành khách</Title>

//             <Alert
//               type="warning"
//               message={
//                 <>
//                   <b>Vui lòng chú ý:</b> Nhập tên đúng như trên CMND/CCCD.
//                 </>
//               }
//               style={{ marginBottom: 20 }}
//             />

//             {[...Array(totalPassengers)].map((_, i) => (
//               <Card
//                 key={i}
//                 style={{
//                   marginBottom: 16,
//                   border: "1px solid #e6e6e6",
//                 }}
//               >
//                 <Title level={5} style={{ marginBottom: 16 }}>
//                   Hành khách {i + 1}
//                 </Title>

//                 <Row gutter={12}>
//                   <Col span={8}>
//                     <Text>Danh xưng *</Text>
//                     <Select
//                       style={{ width: "100%" }}
//                       options={[
//                         { label: "Anh", value: "MR" },
//                         { label: "Chị", value: "MS" },
//                         { label: "Bé", value: "CHILD" },
//                       ]}
//                       defaultValue="MR"
//                     />
//                   </Col>

//                   <Col span={8}>
//                     <Text>Họ *</Text>
//                     <Input />
//                   </Col>

//                   <Col span={8}>
//                     <Text>Tên đệm và tên *</Text>
//                     <Input />
//                   </Col>

//                   <Col span={12} style={{ marginTop: 16 }}>
//                     <Text>Ngày sinh *</Text>
//                     <Input type="date" />
//                   </Col>
//                 </Row>
//               </Card>
//             ))}

//             <Button type="primary" size="large">
//               Tiếp tục thanh toán
//             </Button>
//           </Card>
//         </Col>

//         {/* ============= RIGHT SIDE (SUMMARY) ============= */}
//         <Col span={8}>
//           <Card
//             title={<b>Tóm tắt chuyến bay</b>}
//             extra={<a>Chi tiết</a>}
//             style={{
//               position: "sticky",
//               top: 30,
//               borderRadius: 8,
//             }}
//           >
//             <Space direction="vertical" style={{ width: "100%" }}>
//               <Text type="secondary">Chuyến bay đi</Text>

//               <Row justify="space-between">
//                 <Text strong>
//                   {flight.flight.departureAirport.iata_code} →{" "}
//                   {flight.flight.arrivalAirport.iata_code}
//                 </Text>
//                 <Text type="secondary">{flight.duration}</Text>
//               </Row>

//               <Row justify="space-between">
//                 <Text>
//                   {flight.departureTime.hour}:{flight.departureTime.minute}
//                 </Text>
//                 <Text>
//                   {flight.arrivalTime.hour}:{flight.arrivalTime.minute}
//                 </Text>
//               </Row>

//               <Divider />

//               <Space>
//                 <img
//                   src={flight.flight.airline.logo_url}
//                   width={40}
//                   height={40}
//                   style={{ borderRadius: "50%", objectFit: "cover" }}
//                 />
//                 <div>
//                   <Text>{flight.flight.airline.name}</Text>
//                   <br />
//                   <Text type="secondary">Khuyến mãi</Text>
//                 </div>
//               </Space>

//               <Divider />

//               <b>Không áp dụng đổi lịch bay</b>
//               <b>Không hoàn vé</b>
//             </Space>

//             <Divider />

//             <div style={{ display: "flex", justifyContent: "space-between" }}>
//               <Text strong>Giá bạn trả</Text>
//               <Text strong style={{ fontSize: 18, color: "#00ab6b" }}>
//                 {(flight.pricePerson * totalPassengers).toLocaleString("vi-VN")} VND
//               </Text>
//             </div>
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// export default Booking;

import { useLocation } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Typography,
  Input,
  Select,
  Divider,
  Alert,
  DatePicker,
  Button,
  Space,
} from "antd";
import { CheckCircleOutlined, DownOutlined } from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const Booking = () => {
  const { state } = useLocation();
  const { flight, passengers } = state;
  const [showPriceDetail, setShowPriceDetail] = useState(false);
  const dateFormat = "DD/MM/YYYY";

  /* ============================
      TÍNH TIỀN THEO TỪNG LOẠI
  ============================ */

  const totalPrice =
    passengers.adults * flight.price.adult +
    passengers.children * flight.price.child +
    passengers.infants * flight.price.infant;

  /* ============================
      MẢNG HÀNH KHÁCH
      Tự động sắp xếp theo thứ tự:
      Người lớn → Trẻ em → Em bé
  ============================ */

  const passengerList = [
    ...Array(passengers.adults).fill("Người lớn"),
    ...Array(passengers.children).fill("Trẻ em"),
    ...Array(passengers.infants).fill("Em bé"),
  ];

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh" }}>
      {/* ==== TOP STEPPER ==== */}
      {/* <div
        style={{
          padding: "16px 40px",
          background: "#fff",
          borderBottom: "1px solid #eee",
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: 16,
        }}
      >
        <CheckCircleOutlined style={{ color: "green", fontSize: 20 }} />
        <span style={{ color: "green", fontWeight: 600 }}>
          Chi tiết chuyến đi của bạn
        </span>

        <span style={{ margin: "0 12px" }}>➜</span>

        <span style={{ color: "#999" }}>2. Thanh toán</span>
      </div> */}
      {/* ==== TOP STEPPER (Sticky) ==== */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "#fff",
          borderBottom: "1px solid #eee",
          padding: "14px 0",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 40,
            fontSize: 16,
          }}
        >
          {/* Step 1 */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: "#00a76f",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              ✓
            </div>
            <span style={{ color: "#00a76f", fontWeight: 600 }}>
              Chi tiết chuyến đi của bạn
            </span>
          </div>

          {/* Arrow */}
          <div style={{ color: "#aaa" }}>➜</div>

          {/* Step 2 */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: "#e5f4ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1890ff",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              2
            </div>
            <div>
              <div style={{ color: "#1890ff", fontWeight: 600 }}>Thanh toán</div>
              <div style={{ fontSize: 13, color: "#666" }}>
                Nhu yếu phẩm chuyến bay
              </div>
            </div>
          </div>
        </div>
      </div>


      <Row gutter={24} style={{ padding: "30px 40px" }}>
        {/* ============= LEFT SIDE (FORM) ============= */}
        <Col span={16}>
          {/* ===== Thông tin liên hệ ===== */}
          <Card style={{ marginBottom: 24 }}>
            <Title level={4}>Thông tin liên hệ (nhận vé/phí thanh toán)</Title>

            <Alert
              message="Đăng nhập hoặc đăng ký để có giá rẻ hơn và nhiều ưu đãi hơn!"
              type="info"
              showIcon
              style={{ marginBottom: 20 }}
            />

            <Row gutter={12}>
              <Col span={12}>
                <Text>Họ *</Text>
                <Input placeholder="Như trên CMND (không dấu)" />
              </Col>

              <Col span={12}>
                <Text>Tên đệm và tên *</Text>
                <Input placeholder="Như trên CMND (không dấu)" />
              </Col>

              <Col span={12} style={{ marginTop: 16 }}>
                <Text>Điện thoại di động *</Text>
                <Input addonBefore="+84" placeholder="VD: 0912345678" />
              </Col>

              <Col span={12} style={{ marginTop: 16 }}>
                <Text>Email *</Text>
                <Input placeholder="VD: email@example.com" />
              </Col>
            </Row>
          </Card>

          {/* ===== Thông tin hành khách ===== */}
          <Card>
            <Title level={4}>Thông tin hành khách</Title>

            <Alert
              type="warning"
              message={
                <>
                  <b>Vui lòng chú ý:</b> Nhập tên đúng như trên CMND/CCCD.
                </>
              }
              style={{ marginBottom: 20 }}
            />

            {passengerList.map((type, index) => (
              <Card
                key={index}
                style={{
                  marginBottom: 16,
                  border: "1px solid #e6e6e6",
                  borderRadius: 6,
                }}
              >
                <Title level={5} style={{ marginBottom: 16 }}>
                  Hành khách {index + 1}{" "}
                  <span style={{ color: "#999" }}>({type})</span>
                </Title>

                <Row gutter={12}>
                  <Col span={8}>
                    <Text>Danh xưng *</Text>
                    <Select
                      style={{ width: "100%" }}
                      options={[
                        { label: "Anh", value: "MR" },
                        { label: "Chị", value: "MS" },
                        { label: "Bé", value: "CHILD" },
                      ]}
                      defaultValue={type === "Em bé" ? "CHILD" : "MR"}
                    />
                  </Col>

                  <Col span={8}>
                    <Text>Họ *</Text>
                    <Input />
                  </Col>

                  <Col span={8}>
                    <Text>Tên đệm và tên *</Text>
                    <Input />
                  </Col>

                  <Col span={12} style={{ marginTop: 16 }}>
                    <Text>Ngày sinh *</Text>
                    <DatePicker
                      format={dateFormat}
                      style={{ width: "100%" }}
                      placeholder="dd/mm/yyyy"
                      inputReadOnly
                    />
                  </Col>
                </Row>
              </Card>
            ))}

            <Button type="primary" size="large">
              Tiếp tục thanh toán
            </Button>
          </Card>
        </Col>

        {/* ============= RIGHT SIDE (SUMMARY) ============= */}
        <Col span={8}>
          <Card
            title={<b>Tóm tắt chuyến bay</b>}
            extra={<a>Chi tiết</a>}
            style={{
              position: "sticky",
              top: 132,
              borderRadius: 8,
            }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <Text type="secondary">Chuyến bay đi</Text>

              <Row justify="space-between">
                <Text strong>
                  {flight.flight.departureAirport.iata_code} →{" "}
                  {flight.flight.arrivalAirport.iata_code}
                </Text>
                <Text type="secondary">{flight.duration}</Text>
              </Row>

              <Row justify="space-between">
                <Text>
                  {flight.departureTime.hour}:{flight.departureTime.minute}
                </Text>
                <Text>
                  {flight.arrivalTime.hour}:{flight.arrivalTime.minute}
                </Text>
              </Row>

              <Divider />

              <Space>
                <img
                  src={flight.flight.airline.logo_url}
                  width={40}
                  height={40}
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <Text>{flight.flight.airline.name}</Text>
                  <br />
                  <Text type="secondary">Khuyến mãi</Text>
                </div>
              </Space>

              <Divider />

              <b>Không áp dụng đổi lịch bay</b>
              <b>Không hoàn vé</b>
            </Space>

            <Divider />

            {/* ===== GIÁ BẠN TRẢ (toggle giống Traveloka) ===== */}
            <div
              style={{
                cursor: "pointer",
                padding: "8px 0",
              }}
              onClick={() => setShowPriceDetail(!showPriceDetail)}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text strong>Giá bạn trả</Text>

                <Space>
                  <Text
                    strong
                    style={{
                      fontSize: 18,
                      color: "#00ab6b",
                    }}
                  >
                    {totalPrice.toLocaleString("vi-VN")} VND
                  </Text>

                  {/* icon xoay */}
                  <span>
                    <DownOutlined
                      style={{
                        transition: "0.3s",
                        transform: showPriceDetail ? "rotate(180deg)" : "rotate(0deg)"
                      }}
                    />
                  </span>
                </Space>
              </div>
            </div>

            {/* ===== Chi tiết giá khi mở ===== */}
            {showPriceDetail && (
              <div style={{ marginTop: 12, fontSize: 14 }}>
                {passengers.adults > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <span>{passengers.adults} người lớn ×</span>
                    <span>{flight.price.adult.toLocaleString("vi-VN")}₫</span>
                  </div>
                )}

                {passengers.children > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <span>{passengers.children} trẻ em ×</span>
                    <span>{flight.price.child.toLocaleString("vi-VN")}₫</span>
                  </div>
                )}

                {passengers.infants > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{passengers.infants} em bé ×</span>
                    <span>{flight.price.infant.toLocaleString("vi-VN")}₫</span>
                  </div>
                )}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Booking;