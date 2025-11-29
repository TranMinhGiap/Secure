import { Card, Form, Input, Col, Row, Button, Select, notification, Flex, Spin, Badge, Space } from 'antd';
import { useEffect, useState } from 'react';
import { GET, PATCH } from '../../../utils/requests';
import { CloseCircleOutlined, SmileOutlined, EditOutlined, UndoOutlined } from '@ant-design/icons';
import GoBack from '../../components/common/GoBack';
import { useParams } from "react-router-dom";

const FlightEdit = () => {

  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [airports, setAirports] = useState([]);

  const customRule = (message) => {
    const rule = [{ required: true, message: `${message}` }];
    return rule;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [airports, detailFlight] = await Promise.all([
          GET("/api/v1/admin/airports"),
          GET(`/api/v1/admin/flights/detail/${id}`)
        ]);
        setAirports(airports.data);
        setData(detailFlight.data);
        form.setFieldsValue(detailFlight.data);
      } catch (error) {
        api.open({
          message: "Có lỗi khi hiển thị thông tin chuyến bay!",
          description: error.message,
          showProgress: true,
          pauseOnHover: true,
          icon: <CloseCircleOutlined style={{ color: 'red' }} />,
          placement: "topRight"
        });
      }
    };
    fetchData();
  }, [api]);

  const onCancel = () => {
    setLoading(true);
    form.setFieldsValue(data);
    setLoading(false)
  };

  const onFinish = async (values) => { 
    setLoading(true);
    try {
      await PATCH(`/api/v1/admin/flights/${id}`, values); 
      setData(values);
      api.open({
        message: 'Cập nhật thành công',
        description: "Chuyến bay đã được cập nhật !",
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight"
      });
    } catch (error) {
      api.open({
        message: "Có lỗi khi chỉnh sửa chuyến bay! Vui lòng thử lại",
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
        <h2>Chỉnh sửa máy bay</h2>
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

export default FlightEdit;