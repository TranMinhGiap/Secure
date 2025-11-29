import { Card, Form, Input, Col, Row, Select, Button, InputNumber, Badge, notification, Flex, Space, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { GET, PATCH } from '../../../utils/requests';
import MyEditor from '../../components/common/CKEditer';
import UploadMultipleImages from '../../components/common/UploadMultipleImages';
import { useParams } from "react-router-dom";
import { CloseCircleOutlined, SmileOutlined, EditOutlined, UndoOutlined } from '@ant-design/icons';
import GoBack from '../../components/common/GoBack';

const EditProductCategory = () => {

  const [form] = Form.useForm();
  const [category, setCategory] = useState([]);
  const [description, setDescription] = useState('');
  const [thumbnails, setThumbnails] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [data, setData] = useState(null);

  const customRule = (message) => {
    const rule = [{ required: true, message: `${message}` }];
    return rule;
  }

  const onCancel = () => {
    setLoading(true);
    // form.resetFields(); reset về initialValues nhưng form đang không dùng
    form.setFieldsValue(data);
    setDescription(data.description || "");
    setThumbnails(data.thumbnail || []);
    setLoading(false)
  };

  const onFinish = async (values) => { 
    setLoading(true);
    try {
      const payload = {
        ...values,
        description, 
        thumbnail: thumbnails,
      };
      await PATCH(`/api/v1/admin/product-category/edit/${id}`, payload);
      setData(payload); // để cập nhật dữ liệu mới khi thành công   
      console.log(payload);
      api.open({
        message: 'Cập nhật thành công',
        description: "Danh mục sản phẩm đã được cập nhật !",
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight"
      });
    } catch (error) {
      api.open({
        message: "Có lỗi khi cập nhật danh mục sản phẩm! Vui lòng thử lại",
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

  // ==============================================================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResult, detailResult] = await Promise.all([
          GET("/api/v1/admin/product-category", { limit: 0 }),
          GET(`/api/v1/admin/product-category/detail/${id}`)
        ]);
        setCategory(categoriesResult.data);
        setData(detailResult.data);
      } catch (error) {
        api.open({
          message: "Có lỗi khi lấy thông tin danh mục sản phẩm!",
          description: error.message,
          icon: <CloseCircleOutlined style={{ color: 'red' }} />,
          placement: "topRight"
        });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      console.log(data);
      form.setFieldsValue(data);
      setDescription(data.description || "");
      setThumbnails(data.thumbnail || []);
    }
  }, [data]);
  // ==============================================================

  return (
    <>
      {contextHolder}
      <Flex align='center' justify='space-between'>
        <h2>Edit Product Category</h2>
        <GoBack/>
      </Flex>
      <Card>
        <Spin spinning={loading} tip="Đang cập nhật">
          <Form
            form={form}
            onFinish={onFinish}
            // initialValues={data} chỉ chạy lần đầu
            disabled={loading}
          >
            <Row gutter={{ sm: 16 }}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Tên danh mục"
                  name="title"
                  rules={customRule("Nhập tên danh mục sản phẩm")}
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Input placeholder="Nhập tên danh mục" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label="Danh mục cha"
                  name="parent_id"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Select
                    showSearch
                    allowClear
                    placeholder="Chọn danh mục cha"
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={category.map(item => ({
                      label: item.title,
                      value: item["_id"]
                    }))}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={4}>
                <Form.Item
                  label="Vị trí"
                  name="position"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <InputNumber placeholder="Tự động" style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  label="Mô tả"
                  name="description"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <MyEditor
                    value={description}
                    onChange={setDescription}
                  />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item
                  label="Ảnh" // ← Thay Input bằng upload multiple
                  name="thumbnail"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  getValueFromEvent={(value) => value} // Để form nhận array
                  initialValue={thumbnails}
                >
                  <UploadMultipleImages
                    value={thumbnails}
                    onChange={(urls) => {
                      setThumbnails(urls);
                      form.setFieldsValue({ thumbnail: urls }); // Sync với form
                    }}
                  />
                </Form.Item>
              </Col>

              <Col xs={15} sm={9} md={7} lg={4}>
                <Form.Item label="Trạng thái" name="status" initialValue="active" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
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

export default EditProductCategory;