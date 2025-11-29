import { Flex, Card, notification, Row, Col, Image, Space, Tag, Timeline, Divider } from 'antd';
import { useParams } from 'react-router-dom';
import { GET } from '../../../utils/requests';
import { useEffect, useState } from 'react';
import { WarningOutlined, CheckCircleOutlined, CloseCircleOutlined, UsergroupAddOutlined, EditOutlined } from '@ant-design/icons';
import GoBack from "../../components/common/GoBack";

const AccountDetail = () => {

  const { id } = useParams();
  const [api, contextHolderNoti] = notification.useNotification();
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await GET(`/api/v1/admin/accounts/detail/${id}`);
        setAccount(result.data || null);
      } catch (error) {
        api.open({
          message: "Có lỗi khi hiển thị danh mục sản phẩm! Vui lòng thử lại",
          description: error.message,
          showProgress: true,
          pauseOnHover: true,
          icon: <WarningOutlined style={{ color: 'red' }} />,
          placement: "topRight"
        });
      }
    }
    fetchData();
  }, []);

  console.log(account);

  return (
    <> 
      {contextHolderNoti}
      <Flex justify='space-between' align='center'>
        <h2 style={{ margin: 0 }}>Thông tin chi tiết</h2>
        <GoBack/>
      </Flex>
      {account ? (
        <>
          <Row gutter={[16, 16]} >
            <Col xs={24} sm={12} md={8} xl={6}>
              <Card style={{ marginTop: 16, borderRadius: 8 }}>
                <Flex vertical align='center' gap={16}>
                  <Image
                    width={100}
                    style={{ border: '1px solid #ccc', borderRadius: '50%' }}
                    src={account.avatar || 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'}
                    preview={false}
                  />
                  {account.status === 'active' ? (
                    <Tag icon={<CheckCircleOutlined />} color="success">
                      Hoạt động
                    </Tag>
                  ) : (
                    <Tag icon={<CloseCircleOutlined />} color="error">
                      Dừng hoạt động
                    </Tag>
                  )}
                  <Timeline
                    style={{ marginTop: 7 }}
                    items={[
                      {
                        children: <Space>
                          <UsergroupAddOutlined />
                          {new Date(account.createdBy.createdAt).toLocaleString('vi-VN')}
                        </Space>,
                      },
                      {
                        children: <Space>
                          <EditOutlined />
                          {account.updatedAt === account.createdBy.createdAt ? (
                            <span>Chưa cập được nhật</span>
                          ) : (
                            new Date(account.updatedAt).toLocaleString('vi-VN')
                          )}
                        </Space>,
                      }
                    ]}
                  />
                </Flex>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={16} xl={18}>
              <Card style={{ marginTop: 16, borderRadius: 8 }}>
                <Row>
                  <Divider>Thông tin chi tiết</Divider>
                  <Flex vertical>
                    <Space>
                      <h4>Họ và tên : </h4>
                      <span>{account.fullName ? account.fullName : <Tag icon={<CloseCircleOutlined />} color="error">Chưa có thông tin</Tag>}</span>
                    </Space>
                    <Space>
                      <h4>Email : </h4>
                      <span>{account.email ? account.email : <Tag icon={<CloseCircleOutlined />} color="error">Chưa có thông tin</Tag>}</span>
                    </Space>
                    <Space>
                      <h4>Số điện thoại : </h4>
                      <span>{account.phone ? account.phone : <Tag icon={<CloseCircleOutlined />} color="error">Chưa có thông tin</Tag>}</span>
                    </Space>
                    <Space>
                      <h4>Quê quán : </h4>
                      <span>{account.hometown ? account.hometown : <Tag icon={<CloseCircleOutlined />} color="error">Chưa có thông tin</Tag>}</span>
                    </Space>
                    <Space>
                      <h4>Phân quyền : </h4>
                      <span>{account.roleInfo ? 
                        <Tag color="blue">{account.roleInfo.title}</Tag> : <Tag icon={<CloseCircleOutlined />} color="error">Chưa có thông tin</Tag>}
                      </span>
                    </Space>
                    <Space>
                      <h4>Người tạo : </h4>
                      <span>{account.userCreate ? account.userCreate.fullName : <Tag icon={<CloseCircleOutlined />} color="error">Chưa có thông tin</Tag>}</span>
                    </Space>
                    <Space>
                      <h4>Người chỉnh sửa : </h4>
                      <span>{account.userUpdate ? account.userUpdate.fullName : <Tag icon={<CloseCircleOutlined />} color="error">Chưa có thông tin</Tag>}</span>
                    </Space>
                  </Flex>
                </Row>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default AccountDetail;