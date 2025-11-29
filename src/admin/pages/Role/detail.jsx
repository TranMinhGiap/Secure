import {Flex, Card, notification, Row, Col, Space, Badge, Tag, Tabs } from 'antd';
import GoBack from "../../components/common/GoBack";
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { GET } from '../../../utils/requests';
import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

const RoleDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [api, contextHolderNoti] = notification.useNotification();

  // call api lấy dữ liệu dựa trên id
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resutl = await GET(`/api/v1/admin/roles/detail/${id}`);
        setData(resutl.data);
      } catch (error) {
        api.open({
          message: "Có lỗi khi hiển thị danh mục sản phẩm! Vui lòng thử lại",
          description: error.message,
          showProgress: true,
          pauseOnHover: true,
          icon: <CloseCircleOutlined style={{ color: 'red' }} />,
          placement: "topRight"
        });
      }
    };
    fetchData();
  }, [id, api]);

  return (
    <>
      {contextHolderNoti}
      <Flex justify='space-between' align='center'>
        <h2>Thông tin chi tiết</h2>
        <GoBack/>
      </Flex>
      {data ? (
        <>
          <Card>
            <Row gutter={{ sm: 16 }}>
              <Col xs={24}>
                <Flex gap='middle' vertical>
                  <Space>
                    <h1>{data.title ? data.title : "Chưa có tên nhóm quyền"}</h1>
                  </Space>
                  <Space>
                    <Badge status="processing" text="Trạng thái : " />
                    {data.status === "active" ? (
                      <Tag icon={<CheckCircleOutlined />} color="success">
                        Hoạt động
                      </Tag>
                    ) : (
                      <Tag icon={<CloseCircleOutlined />} color="error">
                        Dừng hoạt động
                      </Tag>
                    )}
                  </Space>
                  <Space>
                    <Badge status="processing" text="Người tạo : " />
                    {data.userCreate ? (
                      <h3>{data.userCreate.fullName}</h3>
                    ) : (
                      <Tag icon={<CloseCircleOutlined />} color="error">
                        Không xác định
                      </Tag>
                    )}
                  </Space>
                  <Space>
                    <Badge status="processing" text="Thời gian tạo : " />
                    {data.createdAt ? (
                      <h3>{new Date(data.createdAt).toLocaleString('vi-VN')}</h3>
                    ) : (
                      <Tag icon={<CloseCircleOutlined />} color="error">
                        Không xác định
                      </Tag>
                    )}
                  </Space>
                  <Space>
                    <Badge status="processing" text="Người cập nhật : " />
                    {data.userUpdate ? (
                      <h3>{data.userUpdate.fullName}</h3>
                    ) : (
                      <Tag icon={<CloseCircleOutlined />} color="error">
                        Chưa có
                      </Tag>
                    )}
                  </Space>
                  <Space>
                    <Badge status="processing" text="Thời gian cập nhật : " />
                    {(data.updatedAt && data.updatedAt === data.createdAt) ? (
                      <Tag icon={<CloseCircleOutlined />} color="error">
                        Chưa có
                      </Tag>
                    ) : (
                      <h3>{new Date(data.updatedAt).toLocaleString('vi-VN')}</h3>
                    )}
                  </Space>
                  <Space>
                    <Badge status="processing" text="Danh sách các chức năng được truy cập" />
                    {(!data.permissions || data.permissions.length === 0) ? (
                      <Tag style={{ maxWidth: "400px" }} icon={<CloseCircleOutlined />} color="error">
                        Không được phép truy cập bất kì chức năng nào!
                      </Tag>
                    ) : (
                      <Flex wrap="wrap">
                        {data.permissions.map((item, index) => (
                          <Tag key={index} color="geekblue">
                            {item}
                          </Tag>
                        ))}
                      </Flex>
                    )}
                  </Space>
                </Flex>
              </Col>
            </Row>
          </Card>
          <Card style={{ marginTop: 20 }}>
            <Tabs
              defaultActiveKey="1"
              items={[
                {
                  label: "Mô tả chi tiết",
                  key: '1',
                  children: (
                    data.description ? (
                      <p>{data.description}</p>
                    ) : (
                      <h4>Danh mục chưa có mô tả</h4>
                    )
                  )
                }
              ]}
            />
          </Card>
        </>
      ) : (
        <>
        {/* Loading or skeleton */}
        </>
      )}
    </>
  );
};

export default RoleDetail;