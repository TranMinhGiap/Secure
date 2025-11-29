import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from 'react-redux';

const PrivateRoute = ({ requiredPermissions = [], matchAll = false }) => {
  const { isLoggedIn, permissions } = useSelector((state) => state.auth);
  // Chưa login thì chuyển hướng về login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  // Không yêu cầu quyền → OK
  if (requiredPermissions.length === 0) {
    return <Outlet />;  
  }
  // Check tùy logic (Cần có tất cả các quyền / chỉ cần có 1 trong các quyền) để truy cập
  const hasPermission = matchAll 
    ? requiredPermissions.every(perm => permissions.includes(perm))
    : requiredPermissions.some(perm => permissions.includes(perm));   
  // Không đủ quyền điều hướng về trang chu
  if (!hasPermission) {
    return <Navigate to="/" replace />;
  }
  // Cho phép truy cập khi thỏa mãn tất cả điều kiện trên
  return <Outlet />;
};

export default PrivateRoute;