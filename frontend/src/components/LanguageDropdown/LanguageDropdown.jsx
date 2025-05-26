import { Select, Spin } from 'antd';
import { useLanguages } from "../../hooks/Healthcare/index";

const { Option } = Select;

const LanguageDropdown = ({ value, onChange }) => {
  const { languages, loading, error } = useLanguages();

  if (loading) return <Spin tip="Loading languages..." />;
  if (error) return <p>Error: {error}</p>;

  return (
    <Select
      showSearch
      placeholder="Select a language"
      optionFilterProp="children"
      style={{ width: '100%' }}
      value={value}          // Controlled value
      onChange={onChange}    // Controlled onChange
    >
      {languages.map((lang) => (
        <Option key={lang.id} value={lang.id}>
          {lang.language_name}
        </Option>
      ))}
    </Select>
  );
};

export default LanguageDropdown;
