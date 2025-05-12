import { useDispatch, useSelector } from 'react-redux';
import {
    fetchLanguages,
    submitTranslationSession,
    fetchTranslationSessions
} from "../../store/slices/healthcareSlice";

const useHealthcare = () => {

    const dispatch = useDispatch();
    const {languages_dropdown, formData, loading, error, message} = useSelector((state) => state.healthcare);

    const loadLanguages = () => {
        dispatch(fetchLanguages());
    };

    const handleOnSubmit = (formData) => {
        dispatch(submitTranslationSession(formData));
    };

    const fetchSessions = () => {
        dispatch(fetchTranslationSessions());
    };

    return {
        languages_dropdown,
        formData,
        loading,
        error,
        message,
        loadLanguages,
        handleOnSubmit,
        fetchSessions
    };


};

export default useHealthcare;