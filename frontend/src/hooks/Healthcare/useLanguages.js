import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchLanguages } from "../../store/slices/languageSlice";

const useLanguages = () => {
  const dispatch = useDispatch();
  const { languages, loading, error } = useSelector((state) => state.language);

  useEffect(() => {
    dispatch(fetchLanguages());
  }, [dispatch]);

  return { languages, loading, error };
};

export default useLanguages;