import { Card, Form, Input, Col, Row, Select, Button, Badge, notification, Flex } from 'antd';
import { useState } from 'react';
import { POST } from '../../../utils/requests';
import { useNavigate } from "react-router-dom";
import { CloseCircleOutlined } from '@ant-design/icons';
import GoBack from '../../components/common/GoBack';

const CreateRole = () => {

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const { TextArea } = Input;

  const customRule = (message) => {
    const rule = [{ required: true, message: `${message}` }];
    return rule;
  }

  const onFinish = async (values) => { 
    setLoading(true);
    try {
      await POST("/api/v1/admin/roles/create", values); 
      form.resetFields();  
      navigate("/admin/roles", { state: { success: true }});
    } catch (error) {
      api.open({
        message: "Có lỗi khi thêm nhóm quyền! Vui lòng thử lại",
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
        <h2>Thêm mới quyền</h2>
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
                  style={{ height: 170, resize: 'none' }}
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

export default CreateRole;