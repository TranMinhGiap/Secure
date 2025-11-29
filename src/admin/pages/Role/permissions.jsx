import { Table, Checkbox, Button, Typography, notification, Flex, Tag } from "antd";
import { useEffect, useState } from "react";
import { GET, PATCH } from "../../../utils/requests";
import { CloseCircleOutlined, SmileOutlined, WarningOutlined, SettingOutlined } from "@ant-design/icons";
const { Title } = Typography;

// 🔹 Danh sách quyền (module + actions)
const permissions = [
  {
    label: "Danh mục sản phẩm",
    items: [
      { key: "products-category_view", label: "Xem" },
      { key: "products-category_create", label: "Thêm mới" },
      { key: "products-category_edit", label: "Chỉnh sửa" },
      { key: "products-category_delete", label: "Xóa" },
    ],
  },
  {
    label: "Sản phẩm",
    items: [
      { key: "products_view", label: "Xem" },
      { key: "products_create", label: "Thêm mới" },
      { key: "products_edit", label: "Chỉnh sửa" },
      { key: "products_delete", label: "Xóa" },
    ],
  },
  {
    label: "Nhóm quyền",
    items: [
      { key: "role_view", label: "Xem" },
      { key: "role_create", label: "Thêm mới" },
      { key: "role_edit", label: "Chỉnh sửa" },
      { key: "role_delete", label: "Xóa" },
      { key: "role_permissions", label: "Phân quyền" },
    ],
  },
  {
    label: "Dashboard",
    items: [{ key: "dashboard_view", label: "Xem" }],
  },
  {
    label: "Account",
    items: [
      { key: "account_view", label: "Xem" },
      { key: "account_create", label: "Thêm mới" },
      { key: "account_edit", label: "Chỉnh sửa" },
      { key: "account_delete", label: "Xóa" },
    ],
  },
  {
    label: "Setting",
    items: [
      { key: "setting_view", label: "Xem" },
      { key: "setting_edit", label: "Cập nhật" },
    ],
  },
];

const RolePermissions = () => {
  const [records, setRecords] = useState([]); 
  const [originalRecords, setOriginalRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  // Lấy danh sách role
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch tất cả roles active
        const result = await GET("/api/v1/admin/roles", {status: "active", limit: 0});
        setRecords(result.data || []);
        setOriginalRecords(
          (result.data || []).map((role) => ({
            ...role,
            permissions: [...role.permissions], 
          }))
        );
      } catch (error) {
        api.open({
          message: "Có lỗi khi hiển thị nhóm quyền! Vui lòng thử lại",
          description: error.message,
          icon: <CloseCircleOutlined style={{ color: "red" }} />,
          placement: "topRight",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); 

  console.log(records);

  //  Thay đổi checkbox
  const handleChange = (roleIndex, permissionKey, checked) => {
    const newRecords = [...records];
    const role = newRecords[roleIndex];
    if (checked) {
      if (!role.permissions.includes(permissionKey)) {
        role.permissions.push(permissionKey);
      }
    } else {
      role.permissions = role.permissions.filter((p) => p !== permissionKey);
    }
    setRecords(newRecords);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const changedRole = records
      .map((role, index) => {
        const originalPerms = originalRecords[index]?.permissions || [];
        const currentPerms = role.permissions || [];
        // So sánh mảng bằng JSON để đơn giản 
        if (JSON.stringify(currentPerms.sort()) !== JSON.stringify(originalPerms.sort())) {
          return {
            id: role["_id"], 
            permissions: [...currentPerms], 
          };
        }
        return null;
      })
      .filter(Boolean);

    if (changedRole.length === 0) {
      api.open({
        message: "Thông báo",
        description: "Không có thay đổi nào để cập nhật!",
        icon: <WarningOutlined style={{ color: "#f80178ff" }} />,
        placement: "topRight",
        showProgress: true,
        pauseOnHover: true,
      });
      setLoading(false);
      return;
    }
    try {
      await PATCH("/api/v1/admin/roles/permissions", { roles: changedRole });
      setOriginalRecords(
        records.map((role) => ({
          ...role,
          permissions: [...role.permissions],
        }))
      );
      api.open({
        message: "Cập nhật thành công",
        description: "Thông tin nhóm quyền đã được cập nhật!",
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
        placement: "topRight",
        showProgress: true,
        pauseOnHover: true,
      });
    } catch (error) {
      api.open({
        message: "Có lỗi khi cập nhật nhóm quyền! Vui lòng thử lại",
        description: error.message,
        icon: <CloseCircleOutlined style={{ color: "red" }} />,
        placement: "topRight",
        showProgress: true,
        pauseOnHover: true,
      });
    } finally {
      setLoading(false);
    }
  };

  //  Tạo dữ liệu hiển thị (module headers + actions) với rowKey
  const dataSource = [];
  let rowIndex = 0;
  permissions.forEach((group) => {
    // Thêm hàng module header (không dùng colSpan nữa)
    dataSource.push({
      key: `module-${group.label}-${rowIndex++}`,
      type: "module",
      name: group.label,
    });
    // Thêm các action rows
    group.items.forEach((item) => {
      dataSource.push({
        key: `action-${item.key}-${rowIndex++}`,
        type: "action",
        permissionKey: item.key, // Đổi tên để tránh conflict với key của row
        label: item.label,
      });
    });
  });

  // Tính scroll.x chính xác: width cột đầu + width mỗi role column
  const featureColumnWidth = 200;
  const roleColumnWidth = 80;
  const scrollX = featureColumnWidth + (roleColumnWidth * records.length);

  // Tạo cột bảng
  const columns = [
    {
      title: "Tính năng",
      dataIndex: "label",
      width: featureColumnWidth,
      fixed: "left", // Fixed left cho cột này
      render: (_, record) => { // arg 1 là giá trị của dataIndex
        if (record.type === "module") {
          return (
            <Tag color="magenta" style={{ fontWeight: 600, fontSize: 13 }}>{record.name}</Tag>
          );
        } else {
          return record.label;
        }
      },
    },
    ...records.map((role, roleIndex) => ({
      title: role.title,
      align: "center",
      width: roleColumnWidth,
      render: (_, record) => {
        if (record.type === "module") {
          // Cho module: empty cell, nhưng với background match để trông như span
          return (
            <div
            style={{ 
                // backgroundColor: "#f5f5f5", 
                height: "100%",
                border: "none"
              }} 
            >
              ---------
            </div>
          );
        } else {
          return (
            <Checkbox
              checked={role.permissions.includes(record.permissionKey)} // Sửa: dùng permissionKey
              onChange={(e) =>
                handleChange(roleIndex, record.permissionKey, e.target.checked)
              }
            />
          );
        }
      },
    })),
  ];

  return (
    <div>
      {contextHolder}
      <Flex align="center" justify="space-between">
        <Title level={3}>Phân quyền</Title>
        <Button icon={<SettingOutlined spin />} color="primary" variant="filled" onClick={handleSubmit} loading={loading}>
          Cập nhật
        </Button>
      </Flex>
      <Table
        columns={columns}
        dataSource={dataSource}
        bordered
        size="small"
        pagination={false}
        loading={loading}
        scroll={{ 
          y: 550,
          x: scrollX,  
        }}
        tableLayout="fixed" 
        rowKey="key"
      />
    </div>
  );
};

export default RolePermissions;
