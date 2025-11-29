import { Card, Form, Input, Col, Row, Button, notification, Select, Flex, Badge  } from 'antd';
import { useState, useEffect } from 'react';
import { GET, POST } from '../../../utils/requests';
import { useNavigate } from "react-router-dom";
import { CloseCircleOutlined } from '@ant-design/icons';
import GoBack from '../../components/common/GoBack';

const FlightCreate = () => {

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [airports, setAirports] = useState([]);

  const customRule = (message) => {
    const rule = [{ required: true, message: `${message}` }];
    return rule;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await GET("/api/v1/admin/airports");
        setAirports(result.data);
      } catch (error) {
        api.open({
          message: "Có lỗi khi hiển thị sân bay! Vui lòng thử lại",
          description: error.message,
          showProgress: true,
          pauseOnHover: true,
          icon: <CloseCircleOutlined style={{ color: 'red' }} />,
          placement: "topRight"
        });
      }
    };
    fetchData();
  }, []);

  const onFinish = async (values) => { 
    setLoading(true);
    try {
      await POST("/api/v1/admin/flights/post", values); 
      form.resetFields();  
      console.log(values);
      navigate("/admin/flights", { state: { success: true }});
    } catch (error) {
      api.open({
        message: "Có lỗi khi thêm chuyến bay! Vui lòng thử lại",
        description: error.message,
        showProgress: true,
        pauseOnHover: true,
        icon: <CloseCircleOutlined style={{ color: 'red' }} />,
        placement: "topRight"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Flex align='center' justify='space-between'>
        <h2>Thêm chuyến bay</h2>
        <GoBack/>
      </Flex>
      <Card>
        <Form
          form={form}
          onFinish={onFinish}
          layout='vertical'
        >
          <Row gutter={{ sm: 16 }}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Số hiệu"
                name="flight_number"
                rules={customRule("Nhập số hiệu chuyến bay")}
              >
                <Input placeholder="VD: ..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Thời gian (phút)"
                name="duration"
                rules={customRule("Nhập thời gian chuyến bay")}
              >
                <Input placeholder="VD: ..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Giá"
                name="base_price"
                rules={customRule("Nhập giá")}
              >
                <Input placeholder="VD: ..." />
              </Form.Item>
            </Col>
            <Col xs={15} sm={9} md={7} lg={4}>
              <Form.Item label="Trạng thái" name="flight_status" initialValue="active">
                <Select
                  options={[
                    { value: 'active', label: <Badge status="success" text="Hoạt động" /> },
                    { value: 'cancel', label: <Badge status="error" text="Hủy" /> },
                    { value: 'delay', label: <Badge status="error" text="Hoãn" /> }
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Sân bay khởi hành"
                name="departure_airport"
                rules={customRule("Chọn sân bay khởi hành")}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Chọn sân bay khởi hành"
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={airports.map(item => ({
                    label: item.name,
                    value: item["id"]
                  }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Sân bay đến"
                name="arrival_airport"
                dependencies={['departure_airport']}
                rules={[
                  ...customRule("Chọn sân bay đến"),
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || value !== getFieldValue('departure_airport')) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Sân bay đến phải khác sân bay khởi hành'));
                    },
                  }),
                ]}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Chọn sân bay đến"
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={airports.map(item => ({
                    label: item.name,
                    value: item["id"]
                  }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item>
                <Button 
                  type="primary" 
                  variant='outlined' 
                  htmlType="submit"
                  loading={loading}
                >
                  Thêm mới
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
};

export default FlightCreate;