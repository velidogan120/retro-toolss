import { configureStore } from '@reduxjs/toolkit'
import cardReducer from "@/redux/slices/card";

export const store = configureStore({
  reducer: {
    card:cardReducer
  },
})