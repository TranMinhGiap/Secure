import { Card, Form, Input, Col, Row, Select, Button, InputNumber, Badge, notification, Flex } from 'antd';
import { useEffect, useState } from 'react';
import { GET, POST } from '../../../utils/requests';
import { useNavigate } from "react-router-dom";
import { CloseCircleOutlined } from '@ant-design/icons';
import GoBack from '../../components/common/GoBack';

const AirplaneCreate = () => {

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [airlines, setAirlines] = useState([]);

  const customRule = (message) => {
    const rule = [{ required: true, message: `${message}` }];
    return rule;
  }

  const onFinish = async (values) => { 
    setLoading(true);
    try {
      await POST("/api/v1/admin/airplanes/create", values); 
      form.resetFields();   
      console.log(values);
      navigate("/admin/airplanes", { state: { success: true }});
    } catch (error) {
      api.open({
        message: "Có lỗi khi thêm máy bay! Vui lòng thử lại",
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await GET("/api/v1/admin/airlines");
        setAirlines(result.data);
      } catch (error) {
        api.open({
          message: "Có lỗi khi hiển thị hãng bay! Vui lòng thử lại",
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

  return (
    <>
      {contextHolder}
      <Flex align='center' justify='space-between'>
        <h2>Thêm máy bay</h2>
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
                label="Tên máy bay"
                name="model"
                rules={customRule("Nhập tên máy bay")}
              >
                <Input placeholder="" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Hãng máy bay"
                name="airline_id"
                rules={customRule("Chọn hãng máy bay")}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Chọn hãng máy bay"
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={airlines.map(item => ({
                    label: item.name,
                    value: item["id"]
                  }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={4}>
              <Form.Item
                label="Sức chứa"
                name="seat_capacity"
                rules={customRule("Nhập sức chứa")}
              >
                <InputNumber placeholder="Nhập sức chứa" style={{ width: '100%' }} />
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

export default AirplaneCreate;