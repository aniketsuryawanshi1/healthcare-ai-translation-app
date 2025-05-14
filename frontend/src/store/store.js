import { configureStore } from '@reduxjs/toolkit';
import { languageReducer, messageReducer, translationHistoryReducer,patientReducer, } from './slices';

const store = configureStore({
  reducer: {
    language : languageReducer,
    message:messageReducer,
    translationHistory :translationHistoryReducer,
    patients: patientReducer,
  },
});

export default store;