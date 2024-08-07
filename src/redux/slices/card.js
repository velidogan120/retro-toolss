import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  comments: [],
  actionItems: [],
  totalVotesUsed: 0,
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
      if (state.comments[index]) {
        state.comments[index].text = text;
      }
    },
    voteComment: (state, action) => {
      const { index, column } = action.payload;
      const comment = state.comments.find(
        (c) => c.index === index && c.column === column
      );

      if (comment && state.totalVotesUsed < 5) {
        comment.votes = (comment.votes || 0) + 1;
        state.totalVotesUsed += 1;
      } else {
        console.error("Comment not found or max votes reached.");
      }
    },
    addActionItem: (state, action) => {
      state.actionItems.push(action.payload);
    },
    resetVotes: (state) => {
      state.totalVotesUsed = 0;

      state.comments = state.comments.map((comment) => ({
        ...comment,
        votes: 0,
      }));
    },
  },
});

export const {
  addComment,
  updateComment,
  voteComment,
  addActionItem,
  resetVotes,
} = cardSlice.actions;
export default cardSlice.reducer;
