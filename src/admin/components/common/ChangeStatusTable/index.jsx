import { Tag, notification, Popconfirm } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, SmileOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { PATCH } from '../../../../utils/requests';

const ChangeStatusTable = ({ id, status, url }) => {

  const [originalStatus, setOriginalStatus] = useState(status);
  const statusUpdate = originalStatus === "active" ? "inactive" : "active"
  const [api, contextHolderNoti] = notification.useNotification();
  
  useEffect(() => {
    setOriginalStatus(status);
  }, [status]);

  const handleConfirm = async () => {
    try {
      await PATCH(`/api/v1/admin/${url}/change-status/${id}`, { status : statusUpdate} );
      api.open({
        message: 'Cập nhật trạng thái thành công',
        description: "Danh mục đã được cập nhật trạng thái",
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight"
      });
      setOriginalStatus(statusUpdate);
    } catch (error) {
      api.open({
        message: "Có lỗi khi cập nhật trạng thái danh mục! Vui lòng thử lại",
        description: error.message,
        showProgress: true,
        pauseOnHover: true,
        icon: <CloseCircleOutlined style={{ color: 'red' }} />,
        placement: "topRight"
      });
    }
  }

  return (
    <>
      {contextHolderNoti}    
      <Popconfirm
        title="Xác nhận thay đổi trạng thái?"
        description={`Bạn có muốn cập nhật trạng thái cho danh mục này không?`}
        onConfirm={handleConfirm}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Tag
          icon={originalStatus === "active" ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={originalStatus === "active" ? "success" : "error"}
          style={{ cursor: 'pointer' }}
        >
          {originalStatus === "active" ? "Hoạt động" : "Dừng hoạt động"}
        </Tag>
      </Popconfirm>
    </>
  );
};

export default ChangeStatusTable;