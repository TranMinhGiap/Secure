import { Card, Form, Input, Col, Row, Button, notification, Flex } from 'antd';
import { useState } from 'react';
import { POST } from '../../../utils/requests';
import { useNavigate } from "react-router-dom";
import { CloseCircleOutlined } from '@ant-design/icons';
import GoBack from '../../components/common/GoBack';
import UploadAvatar from '../../../shared/components/UploadSingle';

const AirportCreate = () => {

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);

  const customRule = (message) => {
    const rule = [{ required: true, message: `${message}` }];
    return rule;
  }

  const onFinish = async (values) => { 
    setLoading(true);
    try {
      await POST("/api/v1/admin/airports/post", values); 
      form.resetFields();  
      console.log(values);
      navigate("/admin/airports", { state: { success: true }});
    } catch (error) {
      api.open({
        message: "Có lỗi khi thêm sân bay! Vui lòng thử lại",
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
        <h2>Thêm sân bay</h2>
        <GoBack/>
      </Flex>
      <Card>
        <Form
          form={form}
          onFinish={onFinish}
          layout='vertical'
        >
          <Row gutter={{ sm: 16 }}>
            <Col xs={24}>
              <Form.Item name="logo_url" label="Hình ảnh sân bay">
                <UploadAvatar
                  url="http://localhost:3000/api/v1/admin/upload-cloud-image"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Tên sân bay"
                name="name"
                rules={customRule("Nhập tên sân bay")}
              >
                <Input placeholder="VD: ..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Mã sân bay"
                name="iata_code"
                rules={customRule("Nhập mã sân bay")}
              >
                <Input placeholder="VD: ..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Thành phố"
                name="city"
                rules={customRule("Nhập thành phố")}
              >
                <Input placeholder="VD: ..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Quốc gia"
                name="country"
                rules={customRule("Nhập quốc gia")}
              >
                <Input placeholder="VD: ..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Múi giờ"
                name="timezone"
                rules={customRule("Nhập múi giờ")}
              >
                <Input placeholder="VD: ..." />
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

export default AirportCreate;