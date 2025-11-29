import { Flex, Tag, Card, Image, Timeline, Divider, Space } from "antd";
import { EditOutlined, UsergroupAddOutlined, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useSelector } from "react-redux";

const MyAccount = (props) => {

  const { user } = useSelector((store) => store.auth);

  return (
    <>
      {user ? (
        <>
          <Card>
            <Flex vertical align='center' gap={16}>
              <Image
                width={100}
                height={100}
                src={user?.avatar || 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'}
                preview={false}
                style={{ borderRadius: '50%', boxSizing: 'border-box', border: '1px solid #1890ff' }}
              />
              <Tag icon={<CheckCircleOutlined />} color="success">
                Hoạt động
              </Tag>
              <Timeline
                style={{ marginTop: 7 }}
                items={[
                  {
                    children: <Space>
                      <UsergroupAddOutlined />
                      {new Date(user.createdBy.createdAt).toLocaleString('vi-VN')}
                    </Space>,
                  },
                  {
                    children: <Space>
                      <EditOutlined />
                      {user.updatedAt === user.createdBy.createdAt ? (
                        <span>Chưa cập được nhật</span>
                      ) : (
                        new Date(user.updatedAt).toLocaleString('vi-VN')
                      )}
                    </Space>,
                  }
                ]}
              />
            </Flex>
          </Card>
          <Card style={{ marginTop: 16 }}>
            <Divider>Một số thông tin khác</Divider>
            <Flex vertical>
              <Space>
                <h4>Họ và tên : </h4>
                <span>{user.fullName ? user.fullName : <Tag icon={<CloseCircleOutlined />} color="error">Chưa có thông tin</Tag>}</span>
              </Space>
              <Space>
                <h4>Email : </h4>
                <span>{user.email ? user.email : <Tag icon={<CloseCircleOutlined />} color="error">Chưa có thông tin</Tag>}</span>
              </Space>
              <Space>
                <h4>Số điện thoại : </h4>
                <span>{user.phone ? user.phone : <Tag icon={<CloseCircleOutlined />} color="error">Chưa có thông tin</Tag>}</span>
              </Space>
              <Space>
                <h4>Quê quán : </h4>
                <span>{user.hometown ? user.hometown : <Tag icon={<CloseCircleOutlined />} color="error">Chưa có thông tin</Tag>}</span>
              </Space>
              <Space>
                <h4>Phân quyền : </h4>
                <span>{user.roleInfo ?
                  <Tag color="blue">{user.roleInfo.title}</Tag> : <Tag icon={<CloseCircleOutlined />} color="error">Chưa có thông tin</Tag>}
                </span>
              </Space>
              <Space>
                <h4>Người tạo : </h4>
                <span>{user.userCreate ? user.userCreate.fullName : <Tag icon={<CloseCircleOutlined />} color="error">Chưa có thông tin</Tag>}</span>
              </Space>
              <Space>
                <h4>Người chỉnh sửa : </h4>
                <span>{user.userUpdate ? user.userUpdate.fullName : <Tag icon={<CloseCircleOutlined />} color="error">Chưa có thông tin</Tag>}</span>
              </Space>
            </Flex>
          </Card>
        </>
      ) : (
          <>
            <h3>Không có thông tin cá nhân</h3>
            <span>Vui lòng tải lại trang </span>
          </>
      )}
    </>
  );
};

export default MyAccount;