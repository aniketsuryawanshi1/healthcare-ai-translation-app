import { configureStore } from '@reduxjs/toolkit';
import { languageReducer, chatReducer, translationHistoryReducer,patientReducer,profileReducer } from './slices';

const store = configureStore({
  reducer: {
    language : languageReducer,
    chat: chatReducer,
    translationHistory :translationHistoryReducer,
    patients: patientReducer,
    profile: profileReducer,
  },
});

export default store;