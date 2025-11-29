import AdminLayout from "../components/layout/AdminLayout";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import ProductCategory from "../pages/ProductCategory";
import ProductCategoryList from "../pages/ProductCategory/list";
import CreateProductCategory from "../pages/ProductCategory/create";
import DetailProductCategory from "../pages/ProductCategory/detail";
import EditProductCategory from "../pages/ProductCategory/edit";
import Role from "../pages/Role";
import RoleList from "../pages/Role/list";
import CreateRole from "../pages/Role/create";
import RoleDetail from "../pages/Role/detail";
import EditRole from "../pages/Role/edit";
import RolePermissions from "../pages/Role/permissions";
import Account from "../pages/Account";
import AccountList from "../pages/Account/list";
import CreateAccount from "../pages/Account/create";
import EditAccount from "../pages/Account/edit";
import AccountDetail from "../pages/Account/detail";
import MyAccountEdit from "../pages/MyAccount/edit";
import AirlineList from "../pages/Airline/list";
import Airline from "../pages/Airline";
import AirlineCreate from "../pages/Airline/create";
import AirlineEdit from "../pages/Airline/edit";
import Airplane from "../pages/Airplane";
import AirplaneList from "../pages/Airplane/list";
import AirplaneEdit from "../pages/Airplane/edit";
import AirplaneCreate from "../pages/Airplane/create";
import Airport from "../pages/Airport";
import AirportList from "../pages/Airport/list";
import AirportEdit from "../pages/Airport/edit";
import AirportCreate from "../pages/Airport/create";
import Flight from "../pages/Flight";
import FlightList from "../pages/Flight/list";
import FlightEdit from "../pages/Flight/edit";
import FlightCreate from "../pages/Flight/create";
import OTPVerify from "../pages/OtpVerify";
import RequirePermission from "../components/common/PrivateRoutes";


const routesAdmin = [
  {
    path: "/admin",
    element: <AdminLayout/>,
    children: [
      {
        index: true,
        element: <Dashboard/>
      },
      // {
      //   path: "product-category",
      //   element: <ProductCategory/>,
      //   children: [
      //     {
      //       index: true,
      //       element: <ProductCategoryList/>
      //     },
      //     {
      //       path: "create",
      //       element: <CreateProductCategory/>
      //     },
      //     {
      //       path: "detail/:id",
      //       element: <DetailProductCategory/>
      //     },
      //     {
      //       path: "edit/:id",
      //       element: <EditProductCategory/>
      //     }
      //   ]
      // },
      {
        element: <RequirePermission required="view_category" />,
        children: [
          {
            path: "product-category",
            element: <ProductCategory />,
            children: [
              { index: true, element: <ProductCategoryList /> },

              {
                path: "create",
                element: (
                  <RequirePermission required="create_category" />
                ),
                children: [
                  { index: true, element: <CreateProductCategory /> },
                ],
              },

              {
                path: "edit/:id",
                element: (
                  <RequirePermission required="edit_category" />
                ),
                children: [
                  { index: true, element: <EditProductCategory /> },
                ],
              },

              { path: "detail/:id", element: <DetailProductCategory /> },
            ],
          },
        ],
      },
      {
        path: "roles",
        element: <Role/>,
        children: [
          {
            index: true,
            element: <RoleList/>
          },
          {
            path: "create",
            element: <CreateRole/>
          },
          {
            path: "detail/:id",
            element: <RoleDetail/>
          },
          {
            path: "edit/:id",
            element: <EditRole/>
          },
          {
            path: "permissions",
            element: <RolePermissions/>
          }
        ]
      },
      {
        path: "accounts",
        element: <Account/>,
        children: [
          {
            index: true,
            element: <AccountList/>
          },
          {
            path: "create",
            element: <CreateAccount/>
          },
          {
            path: "edit/:id",
            element: <EditAccount/>
          },
          {
            path: "detail/:id",
            element: <AccountDetail/>
          }
        ]
      },
      {
        path: "my-accounts/edit",
        element: <MyAccountEdit/>
      },
      {
        path: "airlines",
        element: <Airline />,
        children: [
          {
            index: true,
            element: <AirlineList/>
          },
          {
            path: "create",
            element: <AirlineCreate/>
          },
          {
            path: "edit/:id",
            element: <AirlineEdit/>
          }
        ]
      },
      {
        path: "airplanes",
        element: <Airplane />,
        children: [
          {
            index: true,
            element: <AirplaneList/>
          },
          {
            path: "create",
            element: <AirplaneCreate/>
          },
          {
            path: "edit/:id",
            element: <AirplaneEdit/>
          }
        ]
      },
      {
        path: "airports",
        element: <Airport />,
        children: [
          {
            index: true,
            element: <AirportList/>
          },
          {
            path: "create",
            element: <AirportCreate/>
          },
          {
            path: "edit/:id",
            element: <AirportEdit/>
          }
        ]
      },
      {
        path: "flights",
        element: <Flight />,
        children: [
          {
            index: true,
            element: <FlightList/>
          },
          {
            path: "create",
            element: <FlightCreate/>
          },
          {
            path: "edit/:id",
            element: <FlightEdit/>
          }
        ]
      }
    ]
  },
  {
    path: "/admin/login",
    element: <Login/>
  },
  {
    path: "/admin/register",
    element: <Login/>
  },
  {
    path: "/admin/otp-verify",
    element: <OTPVerify/>
  }
];

export default routesAdmin;