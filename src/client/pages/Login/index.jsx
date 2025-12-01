import { Form, Input, Button, Typography, Card, message, Spin } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { POST } from "../../../utils/requests";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useSelector } from "react-redux";

const Login = () => {

  const [captchaToken, setCaptchaToken] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const auth = useSelector((store) => store.auth);

  const { Title } = Typography;
  const navigate = useNavigate();

  if (auth.loading) {
    return (
      <Spin tip="Đang tải thông tin ..." spinning fullscreen />
    )
  }

  if(auth.isLoggedIn){
    return <Navigate to="/" replace />;
  }

  const onFinish = async (values) => {
    if (!captchaToken) {
      messageApi.error("Vui lòng xác minh ReCAPTCHA!");
      return;
    }

    setLoading(true);

    try {
      // Gửi thông tin đăng nhập lên backend để verify (Đã bao gồm gửi otp nếu thông tin đăng nhập hợp lệ)
      await POST("/api/v1/auth/signin", {
        ...values,
        captchaToken: captchaToken
      });

      // Thành công => redirect /otp-verify để xác thực otp

      navigate("/otp-verify", {
        replace: true,
        state: { email: values.email }
      });

    } catch (error) {
      messageApi.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}

      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Card style={{ width: 450, padding: 20, boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
          <Title level={3} style={{ textAlign: "center" }}>Đăng nhập</Title>

          <Form name="login" onFinish={onFinish} layout="vertical">

            <Form.Item name="email" label="Email" rules={[{ required: true, message: "Vui lòng nhập email!" }, { type: "email", message: "Email không đúng định dạng!" }]}>
              <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
            </Form.Item>

            {/* === ReCAPTCHA === */}
            <Form.Item>
              <ReCAPTCHA
                sitekey={process.env.REACT_APP_SITE_KEY}
                onChange={(token) => setCaptchaToken(token)}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                disabled={loading}
              >
                Đăng nhập
              </Button>
            </Form.Item>

            <div style={{ textAlign: "center" }}>
              Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
            </div>

          </Form>
        </Card>
      </div>
    </>
  );
};

export default Login;