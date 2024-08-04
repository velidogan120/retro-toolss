import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  comments: [],
  actionItems: [],
  totalVotes: 0,
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
      const { index, column } = action.payload;
      if (state.totalVotes < 5 && state.comments[index].column === column) {
        state.comments[index].votes += 1;
        state.totalVotes += 1;
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
