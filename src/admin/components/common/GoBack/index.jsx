import { useNavigate } from "react-router-dom";
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const GoBack = () => {
  const navigate = useNavigate();
  return (
    <>
      <Button icon={<ArrowLeftOutlined />} color="primary" variant="outlined" onClick={() => navigate(-1)}>
        Trở lại
      </Button>
    </>
  );
};

export default GoBack;