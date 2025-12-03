import { Button, Typography, Card } from "antd";
import {
  HomeOutlined,
  CheckCircleTwoTone,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function VNPayReturn() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e0f7ff, #ffffff)",
        padding: "40px 20px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 500,
          textAlign: "center",
          padding: "40px 20px",
          borderRadius: 16,
          boxShadow: "0px 8px 32px rgba(0,0,0,0.15)",
        }}
      >
        <CheckCircleTwoTone
          twoToneColor="#52c41a"
          style={{
            fontSize: 80,
            marginBottom: 20,
          }}
        />

        <Title level={2} style={{ color: "#52c41a", marginBottom: 10 }}>
          Thanh toán thành công!
        </Title>

        <Text style={{ fontSize: 16, opacity: 0.85 }}>
          Cảm ơn bạn đã sử dụng dịch vụ Trevoloka.  
          Chúc bạn có một chuyến đi thật tuyệt vời! 
        </Text>

        <div style={{ marginTop: 40 }}>
          <Button
            type="primary"
            size="large"
            icon={<HomeOutlined />}
            style={{
              paddingInline: 30,
              fontSize: 16,
              borderRadius: 10,
              height: 45,
              background: "linear-gradient(135deg, #1677ff, #49a6ff)",
              boxShadow: "0 4px 14px rgba(0,122,255,0.3)",
            }}
            onClick={() => navigate("/")}
          >
            Về trang chủ
          </Button>
        </div>
      </Card>
    </div>
  );
}
