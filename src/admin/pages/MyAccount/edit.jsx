import { Card, Form, Input, Col, Row, Tag, Button, Space, notification, Flex, Spin, Segmented } from 'antd';
import { useEffect, useState } from 'react';
import { PATCH } from '../../../utils/requests';
import { CloseCircleOutlined, SmileOutlined, EditOutlined, UndoOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import GoBack from '../../components/common/GoBack';
import UploadAvatar from '../../../shared/components/UploadSingle';
import { useSelector } from "react-redux";

const MyAccountEdit = () => {

  const { user } = useSelector((store) => store.auth);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [changePassword, setChangePassword] = useState(false);

  const customRule = (message) => {
    const rule = [{ required: true, message: `${message}` }];
    return rule;
  }
  // console.log(user);

  useEffect(() => {
    // console.log(user);
    if (user) {
      form.setFieldsValue(user);
      setData(user);
    }
  }, [user]);

  const onCancel = () => {
    setLoading(true);
    // form.resetFields(); reset về initialValues nhưng form đang không dùng
    form.setFieldsValue(data);
    form.resetFields(['password', 'newPassword']);
    setChangePassword(false);
    setLoading(false)
  };

  const onFinish = async (values) => { 
    setLoading(true);
    const { email, ...payload } = values;
    try {
      await PATCH(`/api/v1/admin/my-accounts/edit`, payload); 
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
        message: "Có lỗi khi chỉnh cập nhât tài khoản! Vui lòng thử lại",
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
      <Flex align='center' justify='space-between' style={{ marginBottom: 16 }}>
        <span></span>
        <GoBack/>
      </Flex>
      <Card>
        <Spin spinning={loading} tip="loadding...">
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
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Segmented
                  style={{ marginBottom: 12 }}
                  value={changePassword ? 'Password' : 'Account'}
                  options={['Account', 'Password']}
                  onChange={value => {
                    if(value === 'Password'){
                      setChangePassword(true);
                    } else{
                      setChangePassword(false);
                    }
                  }}
                />
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Họ và tên"
                  name="fullName"
                  rules={customRule("Nhập họ và tên")}
                >
                  <Input placeholder="VD: Trần Minh Giáp" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Số điện thoại"
                  name="phone"
                >
                  <Input placeholder="VD: 0396434223" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[...customRule("Nhập email"), { type: 'email', message: 'Email không hợp lệ' }]}
                >
                  <Input placeholder="VD: giap1519gn@gmail.com" disabled />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Quê quán"
                  name="hometown"
                >
                  <Input placeholder="VD: Thái Bình" />
                </Form.Item>
              </Col>
              {changePassword && (
                <>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Mật khẩu mới"
                      name="password"
                      rules={customRule("Nhập mật khẩu mới")}
                    >
                      <Input.Password placeholder="Nhập mật khẩu mới" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      name="newPassword"
                      label="Xác nhận mật khẩu"
                      dependencies={["password"]}
                      rules={[...customRule("Xác nhận mật khẩu mới"), ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error("Mật khẩu không trùng khớp!"));
                        },
                      })
                      ]}
                    >
                      <Input.Password placeholder="Xác nhận mật khẩu" />
                    </Form.Item>
                  </Col>
                </>
              )}
              <Col xs={24}>
                <Space style={{ paddingBottom: 15, marginTop: 8 }}>
                  <Tag icon={<ExclamationCircleOutlined />} color="warning">
                    Kiểm tra lại thông tin trước khi cập nhật
                  </Tag>
                </Space>
              </Col>
              <Col xs={24}>
                <Space style={{ paddingBottom: 20, marginTop: 8 }}>
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

export default MyAccountEdit;