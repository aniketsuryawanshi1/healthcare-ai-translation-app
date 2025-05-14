import  { useEffect } from 'react';
import { List, Spin } from 'antd';
import { useTranslationHistory } from '../../hooks/Healthcare/index'

const TranslationHistory = () => {
  const { translations, loading, error, loadTranslationHistory } = useTranslationHistory();

  useEffect(() => {
    loadTranslationHistory();
  }, [loadTranslationHistory]);

  if (loading) return <Spin tip="Loading translation history..." />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Translation History</h2>
      <List
        bordered
        dataSource={translations}
        renderItem={(item) => (
          <List.Item>
            <strong>Original:</strong> {item.original_text} <br />
            <strong>Translated:</strong> {item.translated_text}
          </List.Item>
        )}
      />
    </div>
  );
};

export default TranslationHistory;