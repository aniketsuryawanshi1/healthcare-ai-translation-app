import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '../../utils/api-handler';
// Async thunk to fetch translation history
export const fetchTranslationHistory = createAsyncThunk(
  'translationHistory/fetchTranslationHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get('translations/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const translationHistorySlice = createSlice({
  name: 'translationHistory',
  initialState: {
    translations: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTranslationHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTranslationHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.translations = action.payload;
      })
      .addCase(fetchTranslationHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default translationHistorySlice.reducer;