import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedHcp: null,
  hcpList: [],
};

const hcpSlice = createSlice({
  name: "hcp",
  initialState,
  reducers: {
    setSelectedHcp: (state, action) => {
      state.selectedHcp = action.payload;
    },

    setHcpList: (state, action) => {
      state.hcpList = action.payload;
    },
  },
});

export const {
  setSelectedHcp,
  setHcpList,
} = hcpSlice.actions;

export default hcpSlice.reducer;