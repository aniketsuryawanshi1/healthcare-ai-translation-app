import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '../../utils/api-handler';
// Async thunk to fetch languages
export const fetchLanguages = createAsyncThunk('language/fetchLanguages', async (_, { rejectWithValue }) => {
  try {
    const response = await AxiosInstance.get('languages/');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const languageSlice = createSlice({
  name: 'language',
  initialState: {
    languages: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLanguages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLanguages.fulfilled, (state, action) => {
        state.loading = false;
        state.languages = action.payload;
      })
      .addCase(fetchLanguages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default languageSlice.reducer;