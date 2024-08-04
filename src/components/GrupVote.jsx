'use client';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { voteComment } from '../redux/slices/card';

const GroupVote = ({ socket }) => {
  const comments = useSelector(state => state.cards.comments);
  const dispatch = useDispatch();

  const handleVote = (index) => {
    const comment = comments[index];
    if (comment.votes < 5) {
      dispatch(voteComment(index));
      socket.emit('voteComment', index);
    } else {
      alert('You can only vote up to 5 times.');
    }
  };

  return (
    <div>
      {comments.map((c, index) => (
        <div key={index}>
          <span>{c.text}</span>
          <button onClick={() => handleVote(index)}>Vote</button>
          <span>{c.votes}</span>
        </div>
      ))}
    </div>
  );
};

export default GroupVote;
