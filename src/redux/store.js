import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import chatSlice from "./slices/chatSlice";

export default configureStore({
  reducer: {
    authSlice,
    chatSlice,
  },
});
