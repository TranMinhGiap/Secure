import { Card, Form, Input, Col, Row, Select, Button, Badge, notification, Flex } from 'antd';
import { useEffect, useState } from 'react';
import { GET, POST } from '../../../utils/requests';
import { useNavigate } from "react-router-dom";
import { CloseCircleOutlined } from '@ant-design/icons';
import GoBack from '../../components/common/GoBack';
import UploadAvatar from '../../../shared/components/UploadSingle';

const CreateAccount = () => {

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  const customRule = (message) => {
    const rule = [{ required: true, message: `${message}` }];
    return rule;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await GET("/api/v1/admin/roles", { limit: 0 });
        setRoles(result.data || []);
      } catch (error) {
        api.open({
          message: "Có lỗi khi hiển thị nhóm quyền!",
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

  const onFinish = async (values) => { 
    setLoading(true);
    try {
      await POST("/api/v1/admin/accounts/create", values); 
      form.resetFields();  
      console.log(values);
      navigate("/admin/accounts", { state: { success: true }});
    } catch (error) {
      api.open({
        message: "Có lỗi khi thêm tài khoản! Vui lòng thử lại",
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
        <h2>Tạo tài khoản</h2>
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
              <Form.Item name="avatar" label="">
                <UploadAvatar
                  url="http://localhost:3000/api/v1/admin/upload-cloud-image"
                  // value={form.getFieldValue('avatar')}
                  // // onChange={(url) => form.setFieldValue('avatar', url)}
                  // onChange={(url) => {
                  //   console.log('UploadAvatar onChange value:', url, typeof url);
                  //   form.setFieldValue('avatar', url);
                  // }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={customRule("Nhập họ và tên")}
              >
                <Input placeholder="VD: Trần Minh Giáp" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={customRule("Nhập số điện thoại")}
              >
                <Input placeholder="VD: 0396434223" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[...customRule("Nhập email"), { type: 'email', message: 'Email không hợp lệ' }]}
              >
                <Input placeholder="VD: giap1519gn@gmail.com" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={customRule("Nhập mật khẩu")}
              >
                <Input.Password placeholder="Nhập mật khẩu" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={7} lg={4}>
              <Form.Item 
                label="Trạng thái" 
                name="status" 
                initialValue="active" 
              >
                <Select
                  options={[
                    { value: 'active', label: <Badge status="success" text="Hoạt động" /> },
                    { value: 'inactive', label: <Badge status="error" text="Ngừng hoạt động" /> }
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Phân quyền"
                name="role_id"
                rules={customRule("Chọn phân quyền")}
              >
                <Select
                  showSearch
                  allowClear
                  placeholder="Chọn phân quyền"
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={roles.map(item => ({
                    label: item.title,
                    value: item["_id"]
                  }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Quê quán"
                name="hometown"
              >
                <Input placeholder="VD: Thái Bình" />
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

export default CreateAccount;