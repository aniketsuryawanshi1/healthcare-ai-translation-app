
import { configureStore } from '@reduxjs/toolkit';
import healthcareReducer from './slices/healthcareSlice';

const store = configureStore({
  reducer: {
    healthcare: healthcareReducer
  },
});

export default store;