import {
  Row,
  Col,
  Card,
  Typography,
  Divider,
  Space,
  Radio,
  message,
  Button,
  Alert,
} from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { POST } from "../../../utils/requests";

const { Title, Text } = Typography;

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const [secondsLeft, setSecondsLeft] = useState(30 * 60);

  // Phương thức thanh toán
  const [paymentMethod, setPaymentMethod] = useState("store"); 

  // Nếu không có state thì quay về home
  useEffect(() => {
    if (!state) navigate("/");
  }, [state, navigate]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!state) return null;

  const {
    flight,
    passengers,
    contactInfo,
    passengerInfo,
    selectedSeats,
    seatPrice,
    totalPrice,
    bookingSessionId
  } = state;

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };

  // ==========================================
  // HANDLE PAYMENT CLICK
  // ==========================================
  const handlePayment = async () => {
    console.log("Payment Method:", paymentMethod);

    if (paymentMethod === "vnpay") {
      try {
        // const res = await fetch("http://localhost:3000/api/v1/payment/vnpay", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({
        //     amount: totalPrice,
        //     orderInfo: `Thanh toan ve may bay - ${contactInfo.firstName}`,
        //     bookingData: {
        //       flight,
        //       passengers,
        //       passengerInfo,
        //       contactInfo,
        //       selectedSeats,
        //     },
        //   }),
        // });
        const res = await POST('/api/v1/vnpay/create', {
          amount: totalPrice,
          booking_session_id: bookingSessionId,
        })

        console.log(res);

        if (!res.paymentUrl) {  
          messageApi.open({
            type: 'error',
            content: 'Không tạo được URL thanh toán VNPay',
          });
          return;
        }

        // Redirect sang VNPay sandbox
        window.location.href = res.paymentUrl;
      } catch (err) {
        console.error("VNPay Payment Error:", err);
        messageApi.open({
          type: 'error',
          content: 'Lỗi phương thức thanh toán',
        });
      }

      return;
    }

    // MẶC ĐỊNH: THANH TOÁN TẠI CỬA HÀNG
    navigate("/payment/store-code", {
      state: {
        code: Math.floor(100000000 + Math.random() * 900000000),
        flight,
        passengerInfo,
        totalPrice,
      },
    });
  };

  return (
    <>
      {contextHolder}
      <div style={{ background: "#f5f6fa", minHeight: "100vh" }}>
        {/* ================= HEADER COUNTDOWN ================= */}
        <div
          style={{
            background: "#007bff",
            color: "white",
            padding: "14px 0",
            textAlign: "center",
            fontSize: 16,
          }}
        >
          Đừng lo lắng, giá vẫn giữ nguyên. Hoàn tất thanh toán trong{" "}
          <b>{formatTime(secondsLeft)}</b>
        </div>

        <Row gutter={24} style={{ padding: "30px 40px" }}>
          {/* ===================== LEFT SIDE ===================== */}
          <Col span={16}>
            <Card style={{ marginBottom: 24 }}>
              <Title level={4}>Bạn muốn thanh toán thế nào?</Title>

              <Radio.Group
                onChange={(e) => setPaymentMethod(e.target.value)}
                value={paymentMethod}
                style={{ width: "100%" }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>

                  {/* ================= PAY AT STORE ================= */}
                  <Card
                    style={{
                      padding: 16,
                      border:
                        paymentMethod === "store"
                          ? "2px solid #007bff"
                          : "1px solid #eee",
                    }}
                  >
                    <Radio value="store" style={{ fontSize: 16 }}>
                      Thanh toán tại cửa hàng
                    </Radio>

                    {paymentMethod === "store" && (
                      <Alert
                        type="info"
                        showIcon
                        message="Bạn có thể thanh toán tại Circle K, WinMart, FamilyMart, Pharmacity..."
                        style={{ marginTop: 12 }}
                      />
                    )}
                  </Card>

                  {/* =================== VNPay QR ==================== */}
                  <Card
                    style={{
                      padding: 16,
                      border:
                        paymentMethod === "vnpay"
                          ? "2px solid #007bff"
                          : "1px solid #eee",
                    }}
                  >
                    <Radio value="vnpay" style={{ fontSize: 16 }}>
                      Thanh toán bằng VNPay (QR / App Banking)
                    </Radio>

                    {paymentMethod === "vnpay" && (
                      <Alert
                        type="info"
                        showIcon
                        message="Bạn sẽ được chuyển sang VNPay Sandbox để quét QR / Thanh toán bằng App ngân hàng."
                        style={{ marginTop: 12 }}
                      />
                    )}
                  </Card>

                </Space>
              </Radio.Group>

              {/* BUTTON */}
              <Button
                type="primary"
                size="large"
                style={{ width: "100%", marginTop: 20 }}
                onClick={handlePayment}
              >
                Thanh toán
              </Button>
            </Card>
          </Col>

          {/* ===================== RIGHT SIDE SUMMARY ===================== */}
          <Col span={8}>
            <Card
              title={<b>Tóm tắt vé máy bay</b>}
              style={{ position: "sticky", top: 20 }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <Text type="secondary">Mã đặt chỗ sẽ có sau khi thanh toán</Text>

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
                    style={{ borderRadius: "50%" }}
                    alt=""
                  />
                  <div>
                    <Text>{flight.flight.airline.name}</Text>
                    <br />
                    <Text type="secondary">Phổ thông</Text>
                  </div>
                </Space>

                <Divider />

                <Title level={5}>Chi tiết hành khách</Title>
                {passengerInfo.map((p, index) => (
                  <div key={index} style={{ marginBottom: 8 }}>
                    <b>{p.fullName}</b>
                    <br />
                    <Text type="secondary">
                      {selectedSeats[index]
                        ? `Ghế: ${selectedSeats[index].seatNumber}`
                        : "Không ghế (Em bé)"}
                    </Text>
                  </div>
                ))}

                <Divider />

                <Title level={5}>Giá bạn trả</Title>
                <Row justify="space-between">
                  <Text>Giá vé</Text>
                  <Text>{(totalPrice - seatPrice).toLocaleString("vi-VN")}₫</Text>
                </Row>

                {seatPrice > 0 && (
                  <Row justify="space-between">
                    <Text>Phí chọn ghế</Text>
                    <Text>{seatPrice.toLocaleString("vi-VN")}₫</Text>
                  </Row>
                )}

                <Divider />

                <Row justify="space-between">
                  <Text strong>Tổng cộng</Text>
                  <Text strong style={{ fontSize: 18, color: "#00ab6b" }}>
                    {totalPrice.toLocaleString("vi-VN")}₫
                  </Text>
                </Row>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Payment;
