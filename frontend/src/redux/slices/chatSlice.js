import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  loading: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },

    clearMessages: (state) => {
      state.messages = [];
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  addMessage,
  clearMessages,
  setLoading,
} = chatSlice.actions;

export default chatSlice.reducer;