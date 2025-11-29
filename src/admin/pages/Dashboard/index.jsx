import { useSelector } from "react-redux";

const Dashboard = () => {
  const auth = useSelector((store) => store.auth);
  console.log(auth);
  return (
    <>
      <h1>Page Dashboard Admin</h1>
    </>
  );
};

export default Dashboard;