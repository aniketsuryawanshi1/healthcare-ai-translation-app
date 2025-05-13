import  { useState } from 'react';
import { Dropdown, Input, Menu, Spin, Alert } from 'antd';
import {useLanguages} from "../../hooks/Healthcare/index"
import useLogout from '../../hooks/Authentication/useLogout';

const Dashboard = () => {
  const handleLogout = useLogout();
  const { languages, loading, error } = useLanguages();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter languages based on the search term
  const filteredLanguages = languages.filter((lang) =>
    lang.language_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Menu for the dropdown
  const menu = (
    <Menu>
      <Menu.Item key="search">
        <Input
          placeholder="Search language"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '200px' }}
        />
      </Menu.Item>
      {filteredLanguages.map((lang) => (
        <Menu.Item key={lang.id}>
          {lang.language_name}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div>
      <h2>Dashboard</h2>

      {/* Handle loading state */}
      {loading && <Spin tip="Loading languages..." style={{ marginBottom: '10px' }} />}

      {/* Handle error state */}
      {error && <Alert message="Error" description={error} type="error" showIcon style={{ marginBottom: '10px' }} />}

      {/* Language Dropdown */}
      {!loading && !error && (
        <Dropdown overlay={menu} trigger={['hover']}>
          <button style={{ padding: '8px 16px', marginTop: '10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>
            Select Language
          </button>
        </Dropdown>
      )}

      {/* Logout button */}
      <button onClick={handleLogout} style={{ padding: '8px 16px', marginTop: '10px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px' }}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;