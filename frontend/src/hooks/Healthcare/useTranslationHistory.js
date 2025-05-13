import { useDispatch, useSelector } from 'react-redux';
import { fetchTranslationHistory } from '../store/slices/translationHistorySlice';

const useTranslationHistory = () => {
  const dispatch = useDispatch();
  const { translations, loading, error } = useSelector((state) => state.translationHistory);

  const loadTranslationHistory = () => {
    dispatch(fetchTranslationHistory());
  };

  return { translations, loading, error, loadTranslationHistory };
};

export default useTranslationHistory;