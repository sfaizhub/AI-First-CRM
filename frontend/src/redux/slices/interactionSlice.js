import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  interactions: [],
};

const interactionSlice = createSlice({
  name: "interaction",
  initialState,
  reducers: {
    setInteractions: (state, action) => {
      state.interactions = action.payload;
    },

    addInteraction: (state, action) => {
      state.interactions.push(action.payload);
    },
  },
});

export const {
  setInteractions,
  addInteraction,
} = interactionSlice.actions;

export default interactionSlice.reducer;