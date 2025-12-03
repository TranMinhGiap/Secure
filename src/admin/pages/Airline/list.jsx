import { useEffect, useState } from 'react';
import { Button, Flex, Space, Table, message, Select, Badge, Dropdown, notification, Image, Tag } from 'antd';
import { DownloadOutlined, PlusCircleOutlined, SmileOutlined } from '@ant-design/icons';
import { GET } from '../../../utils/requests';
import ActionTable from '../../components/common/ActionTable';
import { useNavigate, useLocation } from 'react-router-dom';
// import useTableSearch from '../../../shared/helper/useTableSearch';
// import EditablePosition from '../../components/common/EditablePosition';
// import ChangeStatusTable from '../../components/common/ChangeStatusTable';
// import ChangeMulti from '../../components/common/ChangeMulti';

const AirlineList = () => {

  //==========================================================

  //==========================================================

  const navigate = useNavigate();
  const location = useLocation();
  const [api, contextHolderNoti] = notification.useNotification();

  console.log("***");

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: [ 8, 15, 25, 35],
    showQuickJumper: true
  });
  const [reload, setReload] = useState(true);
  // const [filters, setFilters] = useState({ status: "all" });
  const [messageApi, contextHolder] = message.useMessage();

  const params = {
    // ...filters,
    page: pagination.current,
    limit: pagination.pageSize,
  };

  // const { getColumnSearchProps } = useTableSearch((value) => {
  //   setFilters(prev => ({
  //     ...prev,
  //     keyword: value 
  //   }));
  //   setPagination(prev => ({ ...prev, current: 1 })); 
  // });

  const handleReload = () => {
    setSelectedRowKeys([]);
    setReload(!reload);
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (location.state?.success) {
        api.open({
          message: 'Thêm mới Airline thành công',
          description: "Đã thêm 1 danh mục mới",
          icon: <SmileOutlined style={{ color: '#108ee9' }} />,
          showProgress: true,
          pauseOnHover: true,
          placement: "topRight"
        });
        navigate(location.pathname, { replace: true });
      }
      try {
        const result = await GET("/api/v1/airlines", params);
        console.log(result);
        setData(result.data);
        setPagination(prev => ({
          ...prev,
          total: result.pagination?.totalPage * result.pagination?.limit || 0,
        }));
      } catch (error) {
        messageApi.open({
          type: 'error',
          content: error.message
        });
        setData([]);  // Reset data nếu lỗi
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [pagination.current, pagination.pageSize, reload]);

  console.log(params);

  const columns = [
    {
      title: 'Logo',
      dataIndex: 'logo_url',
      render: (_, record) => (
        <Space>
          <Image
            style={{ width: 70, aspectRatio: "1/1", objectFit: 'contain' }}
            src={record.logo_url ? record.logo_url : "error"}
            fallback={
              !record.logo_url
                ? "data:image/png;base64,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"
                : "error"
            }
          />
        </Space>
      )
    },
    {
      title: 'Tên hãng',
      dataIndex: 'name',
      // ...getColumnSearchProps('title', 'Tìm theo tên danh mục'),
      // sorter: true,
    },
    { 
      title: 'Mã hãng', 
      dataIndex: 'iata_code',
      render: (_, record) => (
        <Tag color="purple">{record.iata_code}</Tag>
      )
    },
    {
      dataIndex: "action",
      width: 70,
      render: (_, record) => (
        <ActionTable id={record["id"]} reload={handleReload} url={`airlines`} api={api} />
      )
    }
  ];
  
  const exportMenuItems = [
    {
      key: 'print',
      label: 'Print',
      onClick: () => {
        // Logic cho Print (ví dụ: window.print())
        console.log('Print clicked');
      },
    },
    {
      key: 'csv',
      label: 'Download as CSV',
      onClick: () => {
        // Logic cho Download CSV (ví dụ: fetch API export)
        console.log('Download CSV clicked');
      },
    },
  ];

  const handleTableChange = (newPagination, _, newSorter) => {
    setPagination(newPagination)
  }

  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 400);
  };
  const onSelectChange = newSelectedRowKeys => {
    // console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };
  const hasSelected = selectedRowKeys.length > 0;
  console.log("===");
  return (
    <>
      {contextHolder}
      {contextHolderNoti}
      <Flex gap="middle" vertical>
        <Flex align="center" justify='space-between'>
          <Space>
            <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
              Reload
            </Button>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : null}
          </Space>
          <Button 
            icon={<PlusCircleOutlined />} 
            color="primary" 
            variant="dashed"
            onClick={() => navigate('/airlines/create')}
          >
            Thêm danh mục
          </Button>
        </Flex>
        <Flex vertical>
          <Flex justify='space-between' style={{padding: '16px 8px', backgroundColor: "white", borderRadius: "12px 12px 0 0"}}>
            <Space>
              {/* <Select
                defaultValue="all"
                style={{ width: 170 }}
                onChange={(v) => setFilters({...filters, status: v})}
                options={[
                  { value: 'all', label: <Badge status="default" text="Tất cả" /> },
                  { value: 'active', label: <Badge status="success" text="Hoạt động" /> },
                  { value: 'inactive', label: <Badge status="error" text="Dừng hoạt động" /> }
                ]}
                disabled={loading}
              />
              <ChangeMulti ids={selectedRowKeys} reload={handleReload} url="product-category"/> */}
            </Space>
            <Space>
              <Dropdown
                menu={{ items: exportMenuItems }}
                placement="bottomRight"
                trigger={["click"]}
                arrow
              >
                <Button color="purple" variant="outlined" icon={<DownloadOutlined />}>
                  Export
                </Button>
              </Dropdown>
            </Space>
          </Flex>
          <Table
            rowSelection={rowSelection}
            loading={loading}
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={pagination}
            onChange={handleTableChange}
            scroll={{ y: 411 }}
          />
        </Flex>
      </Flex>
    </>
  );
};
export default AirlineList;