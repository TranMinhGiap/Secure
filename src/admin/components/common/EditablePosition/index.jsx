import { InputNumber, Popconfirm, notification } from "antd";
import { useState } from "react";
import { SmileOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { PATCH } from "../../../../utils/requests";

const EditablePosition = ({ id, url, position }) => {
  const [value, setValue] = useState(position);
  const [originalValue, setOriginalValue] = useState(position);
  const [showConfirm, setShowConfirm] = useState(false);
  const [api, contextHolderNoti] = notification.useNotification();

  const handleBlur = () => {
    if (value === originalValue) return;
    setShowConfirm(true);
  };

  const handleCancel = () => {
    setValue(originalValue);
    setShowConfirm(false);
  };

  const handleConfirm = async () => {
    try {
      await PATCH(`/api/v1/admin/${url}/change-position/${id}`, { position : value} )
      api.open({
        message: 'Thay đổi vị trí thành công',
        description: "Danh mục đã được thay đổi vị trí",
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight"
      });
      setOriginalValue(value);
    } catch (error) {
      api.open({
        message: "Có lỗi khi thay đổi vị trí danh mục ! Vui lòng thử lại",
        description: error.message,
        showProgress: true,
        pauseOnHover: true,
        icon: <CloseCircleOutlined style={{ color: 'red' }} />,
        placement: "topRight"
      });
      setValue(originalValue); 
    } finally {
      setShowConfirm(false);
    }
  };
  return (
    <>
      {contextHolderNoti}
      <Popconfirm
        title="Xác nhận thay đổi vị trí?"
        description={`Bạn có muốn cập nhật vị trí từ ${originalValue} → ${value}?`}
        open={showConfirm}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <InputNumber
          value={value}
          onChange={(v) => setValue(v)}
          onBlur={handleBlur}
          style={{ width: 70 }}
          onPressEnter={handleBlur}
        />
      </Popconfirm>
    </>
  );
};

export default EditablePosition;;