import { Card, Form, Input, Col, Row, Select, Button, Space, Badge, notification, Flex, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { GET, PATCH } from '../../../utils/requests';
import { CloseCircleOutlined, SmileOutlined, EditOutlined, UndoOutlined } from '@ant-design/icons';
import GoBack from '../../components/common/GoBack';
import UploadAvatar from '../../../shared/components/UploadSingle';
import { useParams } from "react-router-dom";

const EditAccount = () => {

  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const { id } = useParams();
  const [data, setData] = useState(null);

  const customRule = (message) => {
    const rule = [{ required: true, message: `${message}` }];
    return rule;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesResult, accountResult] = await Promise.all([
          GET("/api/v1/admin/roles", { limit: 0 }),
          GET(`/api/v1/admin/accounts/detail/${id}`)
        ]);
        setRoles(rolesResult.data || []);
        setData(accountResult.data || null);
        form.setFieldsValue(accountResult.data);
      } catch (error) {
        api.open({
          message: "Có lỗi khi lấy thông tin tài khoản!",
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

  // useEffect(() => {
  //   if (data) {
  //     form.setFieldsValue(data);
  //   }
  // }, [data]);

  const onCancel = () => {
    setLoading(true);
    // form.resetFields(); reset về initialValues nhưng form đang không dùng
    form.setFieldsValue(data);
    setLoading(false)
  };

  const onFinish = async (values) => { 
    setLoading(true);
    try {
      await PATCH(`/api/v1/admin/accounts/edit/${id}`, values); 
      setData(values);
      api.open({
        message: 'Cập nhật thành công',
        description: "Tài khoản đã được cập nhật !",
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight"
      });
    } catch (error) {
      api.open({
        message: "Có lỗi khi chỉnh sửa tài khoản! Vui lòng thử lại",
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
        <Spin spinning={loading} tip="Đang cập nhật">
          <Form
            form={form}
            onFinish={onFinish}
            layout='vertical'
            disabled={loading}
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
                  label="Quê quán"
                  name="hometown"
                >
                  <Input placeholder="VD: Thái Bình" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Mật khẩu"
                  name="password"
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

export default EditAccount;