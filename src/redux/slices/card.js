import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  comments: [],
  actionItems: [],
};

const cardSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    addComment: (state, action) => {
      state.comments.push({ ...action.payload, votes: 0 });
    },
    updateComment: (state, action) => {
      const { index, text } = action.payload;
      state.comments[index].text = text;
    },
    voteComment: (state, action) => {
      const index = action.payload;
      if (state.comments[index].votes < 5) {
        state.comments[index].votes += 1;
      }
    },
    addActionItem: (state, action) => {
      state.actionItems.push(action.payload);
    },
  },
});

export const { addComment, updateComment, voteComment, addActionItem } =
  cardSlice.actions;
export default cardSlice.reducer;
