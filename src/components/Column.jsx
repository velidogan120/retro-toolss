import React, { useState } from 'react';
import { Input, Button, Card } from 'antd';
import Comment from './Comment';

const Column = ({ title, comments, handleAddComment, handleVote, column, isEditable, isVisible, sessionId }) => {
  const [commentText, setCommentText] = useState('');

  const onAddComment = () => {
    handleAddComment(column, commentText);
    setCommentText('');
  };

  return (
    <Card title={title} className="column">
      {isEditable && (
        <>
          <Input.TextArea 
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write your comment here..."
            className="comment-text"
          />
          <Button onClick={onAddComment} style={{ marginTop: '10px' }}>Add Comment</Button>
        </>
      )}
      <div>
        {comments.map((c, index) => (
          <Comment 
            key={index}
            comment={c}
            isVisible={isVisible || c.sessionId === sessionId}
            handleVote={() => handleVote(index, column)}
          />
        ))}
      </div>
    </Card>
  );
};

export default Column;
