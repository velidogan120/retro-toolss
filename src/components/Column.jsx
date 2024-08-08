import React, { useState } from 'react';
import { Input, Button, Card } from 'antd';
import Comment from './Comment';
import styles from '@/styles/css/module.css';

const Column = ({ title, comments, handleAddComment, handleVote, column, isEditable, isVisible, step }) => {
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
            isVisible={isVisible}
            handleVote={() => handleVote(index, column)}
            showDelete={step === 1}
          />
        ))}
      </div>
    </Card>
  );
};

export default Column;
