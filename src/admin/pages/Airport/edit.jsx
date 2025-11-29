import { Card, Form, Input, Col, Row, Button, Space, notification, Flex, Spin } from 'antd';
import { useState } from 'react';
import { PATCH } from '../../../utils/requests';
import { CloseCircleOutlined, SmileOutlined, EditOutlined, UndoOutlined } from '@ant-design/icons';
import GoBack from '../../components/common/GoBack';
import UploadAvatar from '../../../shared/components/UploadSingle';
import { useParams } from "react-router-dom";

const AirportEdit = () => {

  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [data, setData] = useState(null);

  const customRule = (message) => {
    const rule = [{ required: true, message: `${message}` }];
    return rule;
  }

  const onCancel = () => {
    setLoading(true);
    form.setFieldsValue(data);
    setLoading(false)
  };

  const onFinish = async (values) => { 
    setLoading(true);
    try {
      await PATCH(`/api/v1/admin/airports/${id}`, values); 
      setData(values);
      api.open({
        message: 'Cập nhật thành công',
        description: "Sân bay đã được cập nhật !",
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight"
      });
    } catch (error) {
      api.open({
        message: "Có lỗi khi cập nhật sân bay! Vui lòng thử lại",
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
        <h2>Cập nhật sân bay</h2>
        <GoBack/>
      </Flex>
      <Card>
        <Spin spinning={loading} tip="Đang cập nhật">
          <Form
            form={form}
            onFinish={onFinish}
            layout='vertical'
            disabled={loading}
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
                <Space style={{ paddingBottom: 20 }}>
                  <Button
                    color="primary"
                    variant='filled'
                    htmlType="submit"
                    loading={loading}
                    icon={<EditOutlined />}
                  >
                    Cập nhật
                  </Button>
                  <Button
                    color="danger"
                    onClick={onCancel}
                    loading={loading}
                    variant='filled'
                    icon={<UndoOutlined />}
                  >
                    Hủy
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Card>
    </>
  );
};

export default AirportEdit;