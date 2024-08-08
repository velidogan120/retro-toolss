// src/app/components/CommentCard.jsx
import React, { useState } from 'react';
import { Card, Input, Button, List } from 'antd';
import Comment from './Comment';
import styles from '../styles/css/commentcard.css';

const { TextArea } = Input;

const CommentCard = ({ title, comments, handleAddComment, handleDeleteComment, handleVote, isWritingStage, isVotingStage, isDeletingStage }) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = () => {
    if (newComment.trim()) {
      handleAddComment(newComment);
      setNewComment('');
    }
  };

  return (
    <Card title={title} className={styles.commentCard}>
      <List
        dataSource={comments}
        renderItem={(comment, index) => (
          <Comment
            key={index}
            comment={comment}
            onDelete={() => handleDeleteComment(index)}
            onVote={() => handleVote(index)}
            isVotingStage={isVotingStage}
            isDeletingStage={isDeletingStage}
          />
        )}
      />
      {isWritingStage && (
        <>
          <TextArea
            rows={2}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Type your idea here..."
            className={styles.textArea}
          />
          <Button type="primary" onClick={handleSubmit} className={styles.addButton}>
            Add Comment
          </Button>
        </>
      )}
    </Card>
  );
};

export default CommentCard;
