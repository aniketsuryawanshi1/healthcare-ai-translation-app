import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [], // Real-time messages
    roomName: null, // Current chat room
    isConnected: false, // WebSocket connection status
  },
  reducers: {
    connectToRoom: (state, action) => {
      state.roomName = action.payload;
      state.isConnected = true;
    },
    disconnectFromRoom: (state) => {
      state.roomName = null;
      state.isConnected = false;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { connectToRoom, disconnectFromRoom, addMessage, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;