import React from 'react';
import useLogout from "../../hooks/Authentication/useLogout";
const Dashboard = () => {

  const handleLogout = useLogout();

  return (
    <div>
      <h2>Dashboard</h2>
      {/* Logout button */}
      <button onClick={handleLogout} style={{ padding: '8px 16px', marginTop: '10px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px' }}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
