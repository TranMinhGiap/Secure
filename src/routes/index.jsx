import { useRoutes } from "react-router-dom";
import routesClient from "../client/routes";
import routesAdmin from "../admin/routes";
import Error404 from "../shared/pages/Error404";

const AllRoutes = () => {
  const allRoutes = [
    ...routesAdmin,
    ...routesClient,
    { path: '*', element: <Error404/> }
  ];
  
  const Routes = useRoutes(allRoutes);

  return (
    <>
      {Routes}
    </>
  );
};

export default AllRoutes;