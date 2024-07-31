import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 0,
}

export const cardSlice = createSlice({
  name: 'card',
  initialState,
  reducers: {

  },
})

export const { } = cardSlice.actions

export default cardSlice.reducer