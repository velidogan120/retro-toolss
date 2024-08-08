import { configureStore } from "@reduxjs/toolkit";
import cardReducer from "./slices/card";

const store = configureStore({
  reducer: {
    cards: cardReducer,
  },
});

export default store;
