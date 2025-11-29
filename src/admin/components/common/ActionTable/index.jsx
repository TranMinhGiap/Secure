import { Button, Dropdown, Popconfirm } from 'antd';
import { MoreOutlined, EyeOutlined, EditOutlined, DeleteOutlined, CloseCircleOutlined, SmileOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { DELETE } from '../../../../utils/requests';

const ActionTable = (props) => {
  const { id, url, reload, api } = props;
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await DELETE(`/api/v1/admin/${url}/delete/${id}`);
      api.open({
        message: 'Xóa danh mục thành công',
        description: "Danh mục được chọn đã bị xóa",
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight"
      });
      reload();
    } catch (error) {
      api.open({
        message: "Có lỗi khi xóa danh mục! Vui lòng thử lại",
        description: error.message,
        showProgress: true,
        pauseOnHover: true,
        icon: <CloseCircleOutlined style={{ color: 'red' }} />,
        placement: "topRight"
      });
    }
  }

  const items = [
    {
      key: 'view',
      label: (
        <Button color="primary" variant="filled" icon={<EyeOutlined />}></Button>
      ),
      onClick: () => {
        navigate(`/admin/${url}/detail/${id}`);
      },
    },
    {
      key: 'edit',
      label: (
        <Button color="purple" variant="filled" icon={<EditOutlined />}></Button>
      ),
      onClick: () => {
        navigate(`/admin/${url}/edit/${id}`);
      },
    },
    {
      key: 'delete',
      label: (
        <Popconfirm
          title="Xác nhận xóa!"
          description="Bạn chắc chắn muốn xóa?"
          onConfirm={handleDelete}
          okText="Có"
          cancelText="Hủy"
        >
          <Button color="danger" variant="filled" icon={<DeleteOutlined />} onClick={(e) => e.stopPropagation()} />
        </Popconfirm>
      ),
      // onClick={(e) => e.stopPropagation() : chặn sự kiện click không lan ra tới Dropdown ⇒ Dropdown không đóng sớm nữa
    },
  ]
  
  return (
    <>
      <Dropdown
        menu={{items}}
        // trigger={['click']}
        placement="bottomRight"
        overlayClassName="actions-dropdown"  // Để custom style nếu cần
      >
        <Button type="text" icon={<MoreOutlined />} size="small" className="flex items-center justify-center" />
      </Dropdown>
    </>
  );
};

export default ActionTable;