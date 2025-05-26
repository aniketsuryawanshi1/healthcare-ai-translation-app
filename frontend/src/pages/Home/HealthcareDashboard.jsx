
import { Button, Row, Col } from "antd";
import CreateProfileModal from "../../components/CreateProfileModal";
import useLogout from "../../hooks/Authentication/useLogout";

const HealthcareDashboard = () => {
  const { handleLogout } = useLogout();

  return (
    <div style={{ padding: "30px" }}>
      <Row justify="space-between" align="middle">
        <Col>
          <h2>🏥 Welcome to Healthcare Dashboard</h2>
        </Col>
        <Col>
          <Button type="primary" danger onClick={handleLogout}>
            Logout
          </Button>
        </Col>
      </Row>

      <div style={{ marginTop: 40 }}>
        <CreateProfileModal />
      </div>
    </div>
  );
};

export default HealthcareDashboard;
