// src/redux/slices/card.js

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
      state.comments.push({ ...action.payload, votes: 0, id: Date.now() }); // Ensure each comment has a unique id
    },
    updateComment: (state, action) => {
      const { id, text } = action.payload;
      const comment = state.comments.find(c => c.id === id);
      if (comment) {
        comment.text = text;
      }
    },
    voteComment: (state, action) => {
      const { id } = action.payload;
      const comment = state.comments.find(c => c.id === id);
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
      state.comments = state.comments.map(comment => ({ ...comment, votes: 0 }));
    },
  },
});

export const { addComment, updateComment, voteComment, addActionItem, resetVotes } = cardSlice.actions;
export default cardSlice.reducer;
