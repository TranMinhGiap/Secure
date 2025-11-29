import { useState, useRef, useEffect } from "react";
import { Card, Typography, message } from "antd";
import OTPInputSlot from "../../components/common/OTPInputSlot";
import "./OtpVerify.scss";
import { POST } from "../../../utils/requests";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';
import { setAuth } from "../../../admin/features/auth/authSlice";
import { useDispatch } from "react-redux";

const { Title, Text } = Typography; 

const OTPVerify = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [shake, setShake] = useState(false);
  const [counter, setCounter] = useState(300);
  const [progress, setProgress] = useState(100);
  const [isFilled, setIsFilled] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const email = location.state?.email;

  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);
  // Tự vào không có email => back
  useEffect(() => {
    if (!email) navigate("/login");
  }, [email]);

  // COUNTDOWN + PROGRESS
  useEffect(() => {
    if (counter <= 0) return;

    const timer = setTimeout(() => {
      setCounter(counter - 1);
      setProgress((counter / 300) * 100);
    }, 1000);

    return () => clearTimeout(timer);
  }, [counter]);

  // FORMAT mm:ss
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const updateOtpValue = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    setOtp((prev) => {
      const arr = [...prev];
      arr[index] = value;
      return arr;
    });

    // Auto focus
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!paste) return;

    const arr = paste.split("");
    const newOtp = [...otp];

    for (let i = 0; i < 6; i++) newOtp[i] = arr[i] || "";
    setOtp(newOtp);

    const nextIndex = arr.length >= 6 ? 5 : arr.length;
    inputsRef.current[nextIndex]?.focus();
  };

  // AUTO SUBMIT
  // useEffect(() => {
  //   const code = otp.join("");
  //   if (code.length === 6) {
  //     setIsFilled(true);
  //     submitOTP(code);
  //   } else {
  //     setIsFilled(false);
  //   }
  // }, [otp]);
  useEffect(() => {
    const code = otp.join("");

    if (code.length === 6 && !isFilled) {
      setIsFilled(true);
      submitOTP(code);
    }
  }, [otp]);

  const submitOTP = async (code) => {
    try { 
      const res = await POST(`/api/v1/auth/verify_otp`, { otp: code, email: email });

      if (!res?.success) {
        // OTP sai
        setIsFilled(false);
        setShake(true);
        setTimeout(() => setShake(false), 400);
        messageApi.open({
          type: 'error',
          content: res?.message || "Mã OTP không đúng hoặc đã hết hạn!"
        });
        return;
      }

      // OTP đúng => Lưu token + thông báo
      // Cookies.set('token', res.data.accessToken, { expires: 1, sameSite: 'strict' });
      dispatch(setAuth(res.data.accessToken));
      messageApi.open({
        type: "success",
        content: res?.message || "Xác thực OTP thành công!"
      });
      // Chuyển hướng
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 300);

    } catch (err) {
      setShake(true);
      setTimeout(() => setShake(false), 400);

      messageApi.open({
        type: "error",
        content: err?.message || "Lỗi server! Vui lòng thử lại."
      });
    }
  };


  const resendOtp = async () => {
    if (counter > 0) return;

    try {
      const res = await POST("/api/v1/auth/resend_otp", { email });

      if (!res.success) {
        messageApi.open({
          type: "error",
          content: res.message || "Không thể gửi lại mã OTP!"
        });
        return;
      }

      // Reset countdown
      setCounter(300);
      setProgress(100);

      messageApi.open({
        type: "success",
        content: res.message || "OTP mới đã được gửi đến email của bạn"
      });

    } catch (err) {
      messageApi.open({
        type: "error",
        content: err.message || "Lỗi server khi gửi lại OTP"
      });
    }
  };

  return (
    <>
      {contextHolder}
      <div className="otp-container">
        <Card className="otp-card">
          <Title level={3}>Xác nhận mã OTP</Title>
          <Text className="otp-desc">
            Mã OTP đã được gửi đến email của bạn.
          </Text>

          {/* PROGRESS BAR */}
          <div className="otp-progress">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* OTP INPUT GROUP */}
          <div
            className={`otp-input-group ${shake ? "shake" : ""}`}
            onPaste={handlePaste}
          >
            {otp.map((digit, index) => (
              <OTPInputSlot
                key={index}
                value={digit}
                isFilled={!!digit}
                active={index === otp.findIndex((v) => v === "")}
                onChange={(e) => updateOtpValue(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                inputRef={(el) => (inputsRef.current[index] = el)}
              />
            ))}
          </div>

          {/* COUNTDOWN */}
          <div className="otp-resend">
            {counter > 0 ? (
              <Text type="secondary">Gửi lại mã sau {formatTime(counter)}</Text>
            ) : (
              <button className="otp-btn-resend" onClick={resendOtp}>
                Gửi lại mã OTP
              </button>
            )}
          </div>
        </Card>
      </div>
    </>
  );
};

export default OTPVerify;