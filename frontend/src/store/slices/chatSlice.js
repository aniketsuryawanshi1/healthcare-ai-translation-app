import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "../../utils/api-handler";

// Fetch chat messages.
export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance.get(`/messages/${userId}/`);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Server is not connected."
      );
    }
  }
);

// Send messages.
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ userId, text }, { rejectWithValue }) => {
    try {
      await AxiosInstance.post(`messages/${userId}/`, { text });
      return { userId, text };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Server is not connected."
      );
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Adding a message received via websocket.
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    // Clear messages when switching rooms.
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
        state.error = null;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addMessage, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
