import { Form, Input, Button, Typography, Card, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuth } from "../../features/auth/authSlice";
import { POST } from "../../../utils/requests";
import { useState } from "react";
import Cookies from 'js-cookie';
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {

  const dispatch = useDispatch();

  const [messageApi, contextHolder] = message.useMessage();
  
  const [loading, setLoading] = useState(false);

  const { Title } = Typography;

  const navigate = useNavigate();

  const token = Cookies.get('token');

  const [captchaToken, setCaptchaToken] = useState(null);

  if(token){
    return <Navigate to="/admin" replace />;
  }

  const onFinish = async (values) => {
    if (!captchaToken) {
      messageApi.error("Vui lòng xác minh ReCAPTCHA!");
      return;
    }

    setLoading(true);

    try {
      const result = await POST("/api/v1/auth/login", {
        ...values,
        captchaToken: captchaToken
      });
      // Lưu thông tin vào redux
      dispatch(setAuth(result));

      // Gửi OTP đã trong bước login
      navigate("admin/otp-verify", {
        replace: true,
        state: { email: values.email }
      });
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Card style={{ width: 450, padding: 20, boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
          <Title level={3} style={{ textAlign: "center" }}>
            Đăng nhập
          </Title>

          <Form name="login" onFinish={onFinish} layout="vertical">
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Vui lòng nhập email!" }, { type: "email", message: "Email không đúng định dạng!" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
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
              <Button type="primary" htmlType="submit" block loading={loading} disabled={loading}>
                Đăng nhập
              </Button>
            </Form.Item>

            <div style={{ textAlign: "center" }}>
              Chưa có tài khoản?
            </div>
          </Form>
        </Card>
      </div>
    </>
  );
};

export default Login;