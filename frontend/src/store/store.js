import { configureStore } from '@reduxjs/toolkit';
import { languageReducer, messageReducer, translationHistoryReducer,chatReducer } from './slices';

const store = configureStore({
  reducer: {
    language : languageReducer,
    message:messageReducer,
    translationHistory :translationHistoryReducer,
    chat : chatReducer,
  },
});

export default store;