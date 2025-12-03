import ClientLayout from "../components/layout/ClientLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import SearchResults from "../pages/SearchResults";
import Booking from "../pages/Booking";
import OTPVerify from "../pages/OtpVerify";
import Payment from "../pages/Payment";
import VNPayReturn from "../pages/Payment/VNPayReturn";

const routesClient = [
  {
    path: "/",
    element: <ClientLayout/>,
    children: [
      {
        index: true,
        element: <Home/>
      },
      {
        path: "search-results",
        element: <SearchResults/>
      },
      {
        path: "booking",
        element: <Booking/>
      }
      ,
      {
        path: '/vnpay/result',
        element: <VNPayReturn/>
      }
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/otp-verify",
    element: <OTPVerify />
  },
  {
    path: "/payment",
    element: <Payment />
  }
];

export default routesClient;