// import { Navigate, Outlet } from "react-router-dom";
// import { useSelector } from "react-redux";

// const PrivateRoutes = () => {
//   const auth = useSelector((store) => store.auth);
//   const isLogin = auth.isLoggedIn;
//   return (
//     <>
//       {isLogin ? <Outlet/> : <Navigate to='/admin/login' />}
//     </>
//   );
// };

// export default PrivateRoutes;

import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const RequirePermission = ({ required }) => {
  const { isLoggedIn, permissions } = useSelector((state) => state.auth);

  if (!isLoggedIn) return <Navigate to="/admin/login" replace />;

  // Check permission
  const hasPermission = permissions.includes(required);

  if (!hasPermission) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default RequirePermission;
