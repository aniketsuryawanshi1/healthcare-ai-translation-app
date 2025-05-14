
import { Select, Spin } from 'antd';
import { useLanguages } from "../../hooks/Healthcare/index"

const { Option } = Select;

const LanguageDropdown = () => {
  const { languages, loading, error } = useLanguages();

  if (loading) return <Spin tip="Loading languages..." />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Select Language</h2>
      <Select
        showSearch
        placeholder="Select a language"
        optionFilterProp="children"
        style={{ width: '100%' }}
      >
        {languages.map((lang) => (
          <Option key={lang.id} value={lang.id}>
            {lang.language_name}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default LanguageDropdown;