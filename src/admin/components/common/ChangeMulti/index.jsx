import { Select, Badge, Popconfirm, notification } from 'antd';
import { useState } from 'react';
import { SmileOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { PATCH } from '../../../../utils/requests';

const ChangeMulti = ({ids, reload, url, moreOptions = []}) => {

  const [type, setType] = useState(undefined);
  const [open, setOpen] = useState(false);
  const [api, contextHolderNoti] = notification.useNotification();

  let options = [
    {
      value: 'active',
      label: <Badge status="success" text="Hoạt động" />,
      
    },
    {
      value: 'inactive',
      label: <Badge status="warning" text="Dừng hoạt động" />,
    },
    {
      value: 'deleted-all',
      label: <Badge status="error" text="Xóa" />,
    },
  ]

  if (moreOptions.length > 0) {
    options = [
      ...moreOptions,
      ...options
    ]
  }

  const handleConfirm = async () => {
    // logic update
    if(ids.length === 0){
      api.open({
        message: 'Chưa có danh mục cần thay đổi',
        description: "Chọn ít nhất 1 danh mục để thay đổi trạng thái",
        icon: <CloseCircleOutlined style={{ color: 'red' }} />,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight"
      });
      setOpen(false);
      setType(undefined);
      return;
    }
    try {
      await PATCH(`/api/v1/admin/${url}/change-multi`, { ids : ids, type : type});
      reload();
      api.open({
        message: 'Thay đổi thành công',
        description: "Danh mục đã được thay đổi trạng thái",
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
        showProgress: true,
        pauseOnHover: true,
        placement: "topRight",
      });
    } catch (error) {
      api.open({
        message: "Có lỗi khi thay đổi trạng thái danh mục! Vui lòng thử lại",
        description: error.message,
        showProgress: true,
        pauseOnHover: true,
        icon: <CloseCircleOutlined style={{ color: 'red' }} />,
        placement: "topRight"
      });
    } finally {
      setOpen(false);
      setType(undefined);
    }
  }

  const handleCancel = () => {
    setType(undefined)
    setOpen(false);
  }

  const handleChange = (v) => {
    setType(v);
    setOpen(true);
  }

  return (
    <>
      {contextHolderNoti}
      <Popconfirm
        title="Xác nhận?"
        description={`Thực hiện hành động đã chọn?`}
        open={open}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <Select
          showSearch
          placeholder="--- Hành động ---"
          optionFilterProp="label"
          onChange={handleChange}
          options={options}
          style={{ width: 170 }}
          value={type}
        />
      </Popconfirm>
    </>
  );
};

export default ChangeMulti;