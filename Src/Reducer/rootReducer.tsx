// src/store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";

const rootReducer = combineReducers({
  user: userSlice,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check
    }),
});

export default store;
