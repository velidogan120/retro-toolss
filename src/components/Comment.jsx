import React from 'react';
import { Skeleton, Button } from 'antd';

const Comment = ({ comment, isVisible, handleVote, step }) => {
  if (!comment) {
    return <Skeleton active />;
  }
  
  return (
    <div>
      {isVisible ? (
        <>
          <span>{comment.text}</span>
          {step > 1 && (
            <>
              <Button onClick={() => handleVote(comment.id)}>Vote</Button>
              <span>{comment.votes || 0}</span>
            </>
          )}
        </>
      ) : (
        <Skeleton active />
      )}
    </div>
  );
};

export default Comment;
