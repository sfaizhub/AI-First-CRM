import { configureStore } from "@reduxjs/toolkit";

import hcpReducer from "../redux/slices/hcpSlice";
import interactionReducer from "../redux/slices/interactionSlice";
import chatReducer from "../redux/slices/chatSlice";

export const store = configureStore({
  reducer: {
    hcp: hcpReducer,
    interaction: interactionReducer,
    chat: chatReducer,
  },
});