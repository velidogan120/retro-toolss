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
    voteComment: (state, action) => {
      if (state.totalVotesUsed < 5) {
        const { index, column } = action.payload;
        const comment = state.comments.filter(c => c.column === column)[index];

        if (comment) {
          comment.votes = (comment.votes || 0) + 1;
          state.totalVotesUsed += 1;
        }
      } else {
        alert('You can only vote up to 5 times.');
      }
    },
    addActionItem: (state, action) => {
      state.actionItems.push(action.payload);
    },
    resetVotes: (state) => {
      state.totalVotesUsed = 0;
      state.comments.forEach(comment => {
        comment.votes = 0;
      });
    },
  },
});

export const { addComment, voteComment, addActionItem, resetVotes } = cardSlice.actions;
export default cardSlice.reducer;
