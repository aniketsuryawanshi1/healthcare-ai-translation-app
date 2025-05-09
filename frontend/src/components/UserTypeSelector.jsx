import React from 'react';
import { Radio, Typography } from 'antd';
import { UserOutlined, MedicineBoxOutlined } from '@ant-design/icons';

const { Title } = Typography;

const buttonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  justifyContent: 'center',
  padding: '12px 20px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  width: '200px',
  textAlign: 'center',
  fontWeight: '500',
  fontSize: '16px',
  backgroundColor: '#f9f9f9',
};

const RoleSelector = ({ value, onChange }) => {
  return (
    <div style={{ textAlign: 'center', padding: 24 }}>
      <Title level={4} style={{ marginBottom: 20 }}>
        Select Your Role
      </Title>
      <Radio.Group
        value={value}
        onChange={onChange}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <Radio.Button value="is_patient" style={buttonStyle}>
          <UserOutlined />
          Patient
        </Radio.Button>
        <Radio.Button value="is_doctor" style={buttonStyle}>
          <MedicineBoxOutlined />
          Doctor
        </Radio.Button>
      </Radio.Group>
    </div>
  );
};

export default RoleSelector;
