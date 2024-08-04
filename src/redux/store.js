import { configureStore } from "@reduxjs/toolkit";
import cardReducer from "../redux/slices/card";

const store = configureStore({
  reducer: {
    cards: cardReducer,
  },
});

export default store;
