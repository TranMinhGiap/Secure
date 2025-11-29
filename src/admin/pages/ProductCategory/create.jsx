import { Card, Form, Input, Col, Row, Select, Button, InputNumber, Badge, notification, Flex } from 'antd';
import { useEffect, useState } from 'react';
import { GET, POST } from '../../../utils/requests';
import MyEditor from '../../components/common/CKEditer';
import UploadMultipleImages from '../../components/common/UploadMultipleImages';
import { useNavigate } from "react-router-dom";
import { CloseCircleOutlined } from '@ant-design/icons';
import GoBack from '../../components/common/GoBack';

const CreateProductCategory = () => {

  const [form] = Form.useForm();
  const [category, setCategory] = useState([]);
  const [description, setDescription] = useState('');
  const [thumbnails, setThumbnails] = useState([]);
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);

  const customRule = (message) => {
    const rule = [{ required: true, message: `${message}` }];
    return rule;
  }

  const onFinish = async (values) => { 
    setLoading(true);
    try {
      const payload = {
        ...values,
        description, 
        thumbnail: thumbnails,
      };
      await POST("/api/v1/admin/product-category/create", payload); 
      form.resetFields();  
      setDescription('');  
      console.log(payload);
      navigate("/admin/product-category", { state: { success: true }});
    } catch (error) {
      api.open({
        message: "Có lỗi khi thêm danh mục sản phẩm! Vui lòng thử lại",
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await GET("/api/v1/admin/product-category", {limit: 0});
        setCategory(result.data);
      } catch (error) {
        console.log("failed !")
      }
    };
    fetchData();
  }, []);

  return (
    <>
      {contextHolder}
      <Flex align='center' justify='space-between'>
        <h2>Create Product Category</h2>
        <GoBack/>
      </Flex>
      <Card>
        <Form
          form={form}
          onFinish={onFinish}
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

export default CreateProductCategory;