import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoutes = () => {
  const auth = useSelector((store) => store.auth);
  const isLogin = auth.isLoggedIn;
  return (
    <>
      {isLogin ? <Outlet/> : <Navigate to='/login' />}
    </>
  );
};

export default PrivateRoutes;