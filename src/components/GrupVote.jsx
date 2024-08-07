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
    <div className="column">
      <div className="column-title">Group Vote</div>
      {comments.map((c, index) => (
        <div key={index} className="comment">
          {/* <img src ='/public/assets/img/pokemon1.jpg' alt="User Avatar" className="comment-avatar" /> */}
          <span className="comment-text">{c.text}</span>
          <Button onClick={() => handleVote(index)} className="comment-actions">Vote</Button>
          <span className="comment-votes">{c.votes}</span>
        </div>
      ))}
    </div>
  );
};

export default GroupVote;
