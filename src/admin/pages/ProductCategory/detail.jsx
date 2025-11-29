import {Flex, Card, notification, Row, Col, Image, Space, Badge, Tag, Tabs } from 'antd';
import GoBack from "../../components/common/GoBack";
import ImageGallery from '../../components/common/ImageDetail';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { GET } from '../../../utils/requests';
import { CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

const DetailProductCategory = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [api, contextHolderNoti] = notification.useNotification();

  // call api lấy dữ liệu dựa trên id
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resutl = await GET(`/api/v1/admin/product-category/detail/${id}`);
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

  // const sampleImages = Array.from({ length: 8 }, (_, i) => `https://example.com/img${i + 1}.jpg`);
  return (
    <>
      {contextHolderNoti}
      <Flex justify='space-between' align='center'>
        <h2>Thông tin chi tiết</h2>
        <GoBack/>
      </Flex>
      {/* <ImageGallery images={sampleImages}/> */}
      {data ? (
        <>
          <Card>
            <Row gutter={{ sm: 16 }}>
              <Col xs={24} md={10}>
                {(data.thumbnail && data.thumbnail.length > 0) ? (
                  <ImageGallery images={data.thumbnail} />
                ) : (
                  <div style={{ width: '100%', aspectRatio: '1/1' }}>
                    <Image
                      width='100%'
                      height='100%'
                      src="error"
                      fallback="data:image/png;base64,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"
                    />
                    <h4 style={{ textAlign: 'center' }}>Chưa có hình ảnh minh họa !</h4>
                  </div>
                )}
              </Col>
              <Col xs={24} md={14}>
                <Flex gap='middle' vertical style={{ paddingLeft: '70px' }}>
                  <Space>
                    <h1>{data.title}</h1>
                  </Space>
                  <Space>
                    <Badge status="processing" text="Danh mục cha : " />
                    <h3>{data.infoCategoryParent ? data.infoCategoryParent.title : "Không có danh mục cha"}</h3>
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
                    <Badge status="processing" text="Vị trí : " />
                    <h3>{data.position}</h3>
                  </Space>
                  <Space>
                    <Badge status="processing" text="Người tạo : " />
                    {data.userCreate ? (
                      <h3>{data.userCreate.fullName}</h3>
                    ) : (
                      <Tag icon={<CloseCircleOutlined />} color="error">
                        Không có
                      </Tag>
                    )}
                  </Space>
                  <Space>
                    <Badge status="processing" text="Thời gian tạo : " />
                    {data.createdAt ? (
                      <h3>{new Date(data.createdAt).toLocaleString('vi-VN')}</h3>
                    ) : (
                      <Tag icon={<CloseCircleOutlined />} color="error">
                        Không có
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
                      <div
                        dangerouslySetInnerHTML={{ __html: data.description }}
                      />
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

        </>
      )}
    </>
  );
};

export default DetailProductCategory;