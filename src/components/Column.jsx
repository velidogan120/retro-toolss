import React from 'react';
import Comment from './Comment';
import { Input, Button } from 'antd';

const Column = ({ title, comments, isEditable, isVisible, comment, setComment, handleAddComment, handleVote, column, sessionId, step }) => {
  return (
    <div style={{ flex: 1, margin: '0 10px' }}>
      <h3>{title}</h3>
      {isEditable && (
        <>
          <Input.TextArea 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment here..."
          />
          <Button onClick={handleAddComment}>Add Comment</Button>
        </>
      )}
      <div>
        {comments.map((c) => (
          <Comment 
            key={c.id}
            comment={c}
            isVisible={isVisible || c.sessionId === sessionId}
            handleVote={handleVote}
            step={step}
          />
        ))}
      </div>
    </div>
  );
};

export default Column;
