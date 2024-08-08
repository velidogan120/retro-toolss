import React, { useState } from 'react';
import { Input, Button, Card } from 'antd';
import Comment from './Comment';
import styles from '@/styles/css/module.css';
const Column = ({ title, comments, handleAddComment, handleVote, handleDelete, column, isEditable, isVisible, sessionId, step }) => {
  const [commentText, setCommentText] = useState('');

  const onAddComment = () => {
    handleAddComment(column, commentText);
    setCommentText('');
  };

  return (
    <Card title={title} className={styles.column}>
      {isEditable && (
        <>
          <Input.TextArea 
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write your comment here..."
            className={styles['input']}
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
            handleDelete={() => handleDelete(c.id)}
            step={step}
          />
        ))}
      </div>
    </Card>
  );
};

export default Column;