import { Card, Form, Input, Col, Row, Button, Space, notification, Flex, Spin, Select } from 'antd';
import { useEffect, useState } from 'react';
import { GET, PATCH } from '../../../utils/requests';
import { CloseCircleOutlined, SmileOutlined, EditOutlined, UndoOutlined } from '@ant-design/icons';
import GoBack from '../../components/common/GoBack';
import { useParams } from "react-router-dom";

const AirplaneEdit = () => {

  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [airlines, setAirlines] = useState([]);

  const customRule = (message) => {
    const rule = [{ required: true, message: `${message}` }];
    return rule;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [airlines, detailAirplane] = await Promise.all([
          GET("/api/v1/admin/airlines"),
          GET(`/api/v1/admin/airplanes/detail/${id}`)
        ]);
        setAirlines(airlines.data);
        setData(detailAirplane.data);
        form.setFieldsValue(detailAirplane.data);
      } catch (error) {
        api.open({
          message: "Có lỗi khi lấy thông tin hãng bay / máy bay!",
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
      await PATCH(`/api/v1/airplanes/${id}`, values); 
      setData(values);
      api.open({
        message: 'Cập nhật thành công',
        description: "Máy bay đã được cập nhật !",
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight"
      });
    } catch (error) {
      api.open({
        message: "Có lỗi khi chỉnh sửa máy bay! Vui lòng thử lại",
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
                  label="Tên máy bay"
                  name="model"
                  rules={customRule("Nhập tên máy bay")}
                >
                  <Input placeholder="VD: ..." />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Hãng máy bay"
                  name="airline_id"
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
              <Col xs={24} md={12}>
                <Form.Item
                  label="Sức chứa"
                  name="seat_capacity"
                  rules={customRule("Nhập sức chứa")}
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

export default AirplaneEdit;