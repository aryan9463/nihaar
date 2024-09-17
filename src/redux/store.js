import PinReducer from "./slices/PinSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    pin: PinReducer, // Add your slices here
  },
});

// Optional: Define types for use with TypeScript
