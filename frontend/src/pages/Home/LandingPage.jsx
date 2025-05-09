import {RoleSelector} from "../../components/index"
import React, { useState } from 'react';
const LandingPage = () => {
  const [role, setRole] = useState(null); // Default role
  return (
    <div>
      <RoleSelector value={role} onChange={(e) => setRole(e.target.value)}/>
    </div>
  );
};

export default LandingPage;
