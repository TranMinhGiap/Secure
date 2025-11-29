import { Card, Form, Input, Col, Row, Select, Button, Badge, notification, Flex, Spin, Space } from 'antd';
import { useEffect, useState } from 'react';
import { PATCH, GET } from '../../../utils/requests';
import { CloseCircleOutlined, SmileOutlined, UndoOutlined, EditOutlined } from '@ant-design/icons';
import { useParams } from "react-router-dom";
import GoBack from '../../components/common/GoBack';

const EditRole = () => {

  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const { TextArea } = Input;
  const { id } = useParams();
  const [data, setData] = useState();

  const customRule = (message) => {
    const rule = [{ required: true, message: `${message}` }];
    return rule;
  }

  // láy data dựa trên id trên url
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await GET(`/api/v1/admin/roles/detail/${id}`);
        setData(result.data);
      } catch (error) {
        api.open({
          message: "Có lỗi khi hiển thị thông tin nhóm quyền!",
          description: error.message,
          icon: <CloseCircleOutlined style={{ color: 'red' }} />,
          placement: "topRight"
        });
      }
    };
    fetchData();
  }, []);
  
  // fill data vao form
  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data]);

  const onFinish = async (values) => { 
    setLoading(true);
    try {
      await PATCH(`/api/v1/admin/roles/edit/${id}`, values); 
      setData(values); 
      api.open({
        message: 'Cập nhật thành công',
        description: "Thông tin nhóm quyền đã được cập nhật !",
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight"
      });
    } catch (error) {
      api.open({
        message: "Có lỗi khi cập nhật nhóm quyền! Vui lòng thử lại",
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

  const onCancel = () => {
    setLoading(true);
    form.setFieldsValue(data);
    setLoading(false)
  };

  return (
    <>
      {contextHolder}
      <Flex align='center' justify='space-between'>
        <h2>Thêm mới quyền</h2>
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
                <Form.Item
                  label="Tên nhóm quyền"
                  name="title"
                  rules={customRule("Nhập tên nhóm quyền sản phẩm")}
                >
                  <Input placeholder="Nhập tên nhóm quyền" />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  label="Mô tả"
                  name="description"
                >
                  <TextArea
                    showCount
                    maxLength={400}
                    placeholder="Nhập mô tả (giới hạn 400 kí tự)"
                    style={{ height: 190, resize: 'none' }}
                  />
                </Form.Item>
              </Col>
              <Col xs={15} sm={9} md={7} lg={4}>
                <Form.Item label="Trạng thái" name="status" initialValue="active">
                  <Select
                    options={[
                      { value: 'active', label: <Badge status="success" text="Hoạt động" /> },
                      { value: 'inactive', label: <Badge status="error" text="Ngừng hoạt động" /> }
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Space>
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

export default EditRole;