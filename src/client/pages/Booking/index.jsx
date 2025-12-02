import { useLocation, useNavigate } from "react-router-dom";
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
  Modal,
  Form
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useState, useRef } from "react";
import SeatSelectionDrawer from "../SeatSelection";

const { Title, Text } = Typography;
const dateFormat = "DD/MM/YYYY";

const Booking = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { flight, passengers } = state;

  /* FORM INSTANCES */
  const [contactForm] = Form.useForm();
  const [passengerForm] = Form.useForm();

  const [showPriceDetail, setShowPriceDetail] = useState(false);
  const [showSeatDrawer, setShowSeatDrawer] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState({});
  const [seatPrice, setSeatPrice] = useState(0);
  const [seatError, setSeatError] = useState("");
  const seatErrorRef = useRef(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  /* PASSENGER LIST */
  const passengerList = [
    ...Array(passengers.adults).fill("Người lớn"),
    ...Array(passengers.children).fill("Trẻ em"),
    ...Array(passengers.infants).fill("Em bé"),
  ];

  /* GIÁ */
  const basePrice =
    passengers.adults * flight.price.adult +
    passengers.children * flight.price.child +
    passengers.infants * flight.price.infant;

  const totalPrice = basePrice + seatPrice;

  /* GHẾ */
  const handleSeatChange = ({ passengerSeats, totalSeatPrice }) => {
    setSelectedSeats(passengerSeats);
    setSeatPrice(totalSeatPrice);
    setSeatError("");
    setShowSeatDrawer(false);
  };

  /* VALIDATE TIẾP TỤC */
  const handleContinue = async () => {
    try {
      await contactForm.validateFields();
      await passengerForm.validateFields();

      // 🔥 Chỉ Người lớn + Trẻ em mới cần ghế
      const seatRequiredIndexes = passengerList
        .map((type, idx) => ({ type, idx }))
        .filter(p => p.type !== "Em bé") // ❌ Em bé không cần ghế
        .map(p => p.idx);

      for (let idx of seatRequiredIndexes) {
        if (!selectedSeats[idx]) {
          setSeatError(`Vui lòng chọn ghế cho hành khách ${idx + 1}`);
          setTimeout(() => {
            seatErrorRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }, 120);
          return;
        }
      }

      setShowConfirmModal(true);
    } catch (err) {
      if (err.errorFields?.length) {
        contactForm.scrollToField(err.errorFields[0].name);
        passengerForm.scrollToField(err.errorFields[0].name);
      }
    }
  };

  /* CONFIRM → PAYMENT */
  // const handleConfirm = () => {
  //   const contactInfo = contactForm.getFieldsValue();
  //   const passengerInfo = passengerForm.getFieldsValue().passengers;
  //   console.log(
  //     {
  //       flight,
  //       passengers,
  //       contactInfo,
  //       passengerInfo,
  //       selectedSeats,
  //       seatPrice,
  //       totalPrice,
  //     }
  //   )
  //   navigate("/payment", {
  //     state: {
  //       flight,
  //       passengers,
  //       contactInfo,
  //       passengerInfo,
  //       selectedSeats,
  //       seatPrice,
  //       totalPrice,
  //     },
  //   });
  // };
  const handleConfirm = () => {
  const contactInfo = contactForm.getFieldsValue();
  const passengerRaw = passengerForm.getFieldsValue().passengers;

  // Chuẩn hóa dữ liệu hành khách
  const passengerInfo = passengerRaw.map((p, index) => {
    // map giới tính
    let gender = "UNKNOWN";
    if (p.title === "MR") gender = "MALE";
    if (p.title === "MS") gender = "FEMALE";
    if (p.title === "CHILD") gender = "CHILD";

    return {
      fullName: `${p.lastName} ${p.firstName}`.trim(),
      lastName: p.lastName.trim(),
      firstName: p.firstName.trim(),
      gender,
      date_of_birth: p.dob ? p.dob.format("YYYY-MM-DD") : null, 
      dob_display: p.dob ? p.dob.format("DD/MM/YYYY") : null,      
    };
  });

  console.log({
    flight,
    passengers,
    contactInfo,
    passengerInfo,
    selectedSeats,
    seatPrice,
    totalPrice,
  });

  navigate("/payment", {
    state: {
      flight,
      passengers,
      contactInfo,
      passengerInfo,
      selectedSeats,
      seatPrice,
      totalPrice,
    },
  });
};

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh" }}>

      {/* ======= STEPPER (KEEP ORIGINAL) ======= */}
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
              1
            </div>
            <span style={{ color: "#00a76f", fontWeight: 600 }}>
              Chi tiết chuyến đi của bạn
            </span>
          </div>

          <div style={{ color: "#aaa" }}>➜</div>

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

      {/* BODY */}
      <div style={{ padding: "30px 40px" }}>
        <Row gutter={12} >

          {/* ================= LEFT SIDE ================= */}
          <Col span={16}>

            {/* ---- Thông tin liên hệ ---- */}
            <Card style={{ marginBottom: 24 }}>
              <Title level={4}>Thông tin liên hệ (nhận vé/phí thanh toán)</Title>

              <Alert
                message="Đăng nhập hoặc đăng ký để có giá rẻ hơn và nhiều ưu đãi hơn!"
                type="info"
                showIcon
                style={{ marginBottom: 20 }}
              />

              <Form form={contactForm} layout="vertical">
                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item
                      label="Họ *"
                      name="lastName"
                      rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
                    >
                      <Input placeholder="Như trên CMND (không dấu)" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Tên đệm và tên *"
                      name="firstName"
                      rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                    >
                      <Input placeholder="Như trên CMND (không dấu)" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Điện thoại di động *"
                      name="phone"
                      rules={[
                        { required: true, message: "Vui lòng nhập số điện thoại!" },
                        { pattern: /^[0-9]+$/, message: "Số điện thoại không hợp lệ!" },
                      ]}
                    >
                      <Input addonBefore="+84" placeholder="0912345678" />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      label="Email *"
                      name="email"
                      rules={[
                        { required: true, message: "Vui lòng nhập email!" },
                        { type: "email", message: "Email không hợp lệ!" },
                      ]}
                    >
                      <Input placeholder="email@example.com" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Card>

            {/* ---- Thông tin hành khách ---- */}
            <Card style={{ marginBottom: 24 }}>
              <Title level={4}>Thông tin hành khách</Title>

              <Alert
                type="warning"
                message={<><b>Vui lòng chú ý:</b> Nhập tên đúng như trên CMND/CCCD.</>}
                style={{ marginBottom: 20 }}
                showIcon
              />

              <Form form={passengerForm} layout="vertical">
                {passengerList.map((type, index) => (
                  <Card key={index} style={{ marginBottom: 16, borderRadius: 6 }}>
                    <Title level={5}>
                      Hành khách {index + 1}{" "}
                      <span style={{ color: "#999" }}>({type})</span>
                    </Title>

                    <Row gutter={12}>
                      <Col span={8}>
                        <Form.Item
                          label="Danh xưng *"
                          name={["passengers", index, "title"]}
                          initialValue={type === "Em bé" ? "CHILD" : "MR"}
                          rules={[{ required: true, message: "Chọn danh xưng!" }]}
                        >
                          <Select
                            options={[
                              { label: "Anh", value: "MR" },
                              { label: "Chị", value: "MS" },
                              { label: "Bé", value: "CHILD" },
                            ]}
                          />
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Form.Item
                          label="Họ *"
                          name={["passengers", index, "lastName"]}
                          rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>

                      <Col span={8}>
                        <Form.Item
                          label="Tên đệm và tên *"
                          name={["passengers", index, "firstName"]}
                          rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          label="Ngày sinh *"
                          name={["passengers", index, "dob"]}
                          rules={[{ required: true, message: "Chọn ngày sinh!" }]}
                        >
                          <DatePicker
                            format={dateFormat}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </Form>

              {/* BUTTON GHẾ */}
              <Button
                type="default"
                size="large"
                style={{ width: "100%" }}
                onClick={() => setShowSeatDrawer(true)}
              >
                Chọn ghế ngồi
              </Button>

              {/* ❗ LỖI GHẾ */}
              <div ref={seatErrorRef}>
                {seatError && (
                  <div style={{ color: "red", marginTop: 6, fontSize: 13 }}>
                    {seatError}
                  </div>
                )}
              </div>

              {/* TEXT GHẾ */}
              {seatPrice > 0 && (
                <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
                  Đã chọn {Object.keys(selectedSeats).length} ghế ·{" "}
                  {seatPrice.toLocaleString("vi-VN")}₫
                </Text>
              )}

              {/* NÚT TIẾP TỤC */}
              <Button
                type="primary"
                size="large"
                style={{ width: "100%", marginTop: 16 }}
                onClick={handleContinue}
              >
                Tiếp tục thanh toán
              </Button>
            </Card>
          </Col>

          {/* ================= RIGHT SIDE ================= */}
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

              {/* ===== GIỮ NGUYÊN UI GIÁ ===== */}
              <div
                style={{ cursor: "pointer", padding: "8px 0" }}
                onClick={() => setShowPriceDetail(!showPriceDetail)}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Text strong>Giá bạn trả</Text>

                  <Space>
                    <Text strong style={{ fontSize: 18, color: "#00ab6b" }}>
                      {totalPrice.toLocaleString("vi-VN")} VND
                    </Text>

                    <DownOutlined
                      style={{
                        transition: "0.3s",
                        transform: showPriceDetail ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </Space>
                </div>
              </div>

              {showPriceDetail && (
                <div style={{ marginTop: 12, fontSize: 14 }}>
                  {passengers.adults > 0 && (
                    <div
                      style={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <span>{passengers.adults} người lớn ×</span>
                      <span>
                        {flight.price.adult.toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                  )}

                  {passengers.children > 0 && (
                    <div
                      style={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <span>{passengers.children} trẻ em ×</span>
                      <span>
                        {flight.price.child.toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                  )}

                  {passengers.infants > 0 && (
                    <div
                      style={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <span>{passengers.infants} em bé ×</span>
                      <span>
                        {flight.price.infant.toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                  )}

                  {seatPrice > 0 && (
                    <>
                      <Divider style={{ margin: "8px 0" }} />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontWeight: 500,
                        }}
                      >
                        <span>Phí chọn ghế</span>
                        <span>{seatPrice.toLocaleString("vi-VN")}₫</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </div>

      {/* DRAWER GHẾ */}
      <SeatSelectionDrawer
        open={showSeatDrawer}
        onClose={() => setShowSeatDrawer(false)}
        flight={flight}
        passengers={passengers}
        seatClass={passengers.seatClass || "ECONOMY"}
        value={{ passengerSeats: selectedSeats, totalSeatPrice: seatPrice }}
        onChange={handleSeatChange}
      />

      {/* MODAL XÁC NHẬN */}
      <Modal
        open={showConfirmModal}
        footer={null}
        width={700}
        onCancel={() => setShowConfirmModal(false)}
      >
        <div style={{ padding: "8px 0 4px" }}>
          <Title level={3} style={{ marginBottom: 8 }}>
            Kiểm tra tên hành khách
          </Title>

          <p style={{ fontSize: 15, color: "#555", marginBottom: 16 }}>
            Hãy đảm bảo chính tả và thứ tự tên đúng. Sai sót có thể khiến bạn bị từ chối lên máy bay hoặc phải trả thêm phí.
          </p>

          <div
            style={{
              background: "#FFF8E5",
              border: "1px solid #FFE7B8",
              padding: "10px 14px",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <span style={{ fontSize: 18 }}>!</span>
            <span style={{ color: "#9B7C2C" }}>
              Hãng hàng không này có thể không cho phép sửa tên
            </span>
          </div>

          {/* Passenger list */}
          {passengerForm.getFieldValue("passengers")?.map((p, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #eee",
                borderRadius: 10,
                padding: 16,
                marginBottom: 20,
                background: "#fafafa",
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 14 }}>
                {i + 1}.{" "}
                {p?.title === "MR" ? "Ông" : p?.title === "MS" ? "Bà" : "Bé"}{" "}
                {p?.lastName} {p?.firstName}
              </div>

              <div style={{ lineHeight: "26px", marginLeft: 10 }}>
                <div>
                  <b>Họ:</b> {p?.lastName}
                </div>
                <div>
                  <b>Tên đệm và tên:</b> {p?.firstName}
                </div>
                <div>
                  <b>Ngày sinh:</b> {p?.dob?.format("DD-MM-YYYY")}
                </div>
                <div>
                  <b>Quốc tịch:</b> Vietnam
                </div>
                <div>
                  <b>Ghế:</b>{" "}
                  {selectedSeats[i]?.seatNumber || (
                    <span style={{ color: "#999" }}>Không cần ghế riêng (Em bé)</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 30,
            }}
          >
            <Button
              size="large"
              style={{
                width: "48%",
                border: "1px solid #ddd",
                fontWeight: 500,
                height: 46,
              }}
              onClick={() => setShowConfirmModal(false)}
            >
              Quay lại
            </Button>

            <Button
              type="primary"
              size="large"
              style={{ width: "48%", height: 46, fontWeight: 600 }}
              onClick={handleConfirm}
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default Booking;