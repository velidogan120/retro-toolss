import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  comments: [],
  actionItems: [],
  totalVotesUsed: 0,
};

// src/redux/slices/card.js

const cardSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    addComment: (state, action) => {
      state.comments.push({ ...action.payload, votes: 0, id: action.payload.id || Date.now() });
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
    deleteComment: (state, action) => {
      state.comments = state.comments.filter(comment => comment.id !== action.payload);
    },
    // Other reducers...
  },
});

export const { addComment, voteComment, deleteComment, addActionItem, resetVotes } = cardSlice.actions;
export default cardSlice.reducer;

