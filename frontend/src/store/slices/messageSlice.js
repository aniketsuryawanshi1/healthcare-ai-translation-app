import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '../../utils/api-handler';
// Async thunk to fetch messages
export const fetchMessages = createAsyncThunk('message/fetchMessages', async (_, { rejectWithValue }) => {
  try {
    const response = await AxiosInstance.get('messages/');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Async thunk to send a message
export const sendMessage = createAsyncThunk('message/sendMessage', async (messageData, { rejectWithValue }) => {
  try {
    const response = await AxiosInstance.post('messages/', messageData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const messageSlice = createSlice({
  name: 'message',
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default messageSlice.reducer;