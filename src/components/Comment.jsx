import React, { useState, useEffect } from 'react';
import { Avatar, Button, Skeleton } from 'antd';

const Comment = ({ comment, isVisible, handleVote }) => {
  const [userImg, setUserImg] = useState('');

  useEffect(() => {
    const images = [
      '/assets/img/pokemon1.jpg',
      '/assets/img/pokemon2.jpg',
      '/assets/img/pokemon3.jpg',
        '/assets/img/pokemon4.jpg'
    ];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setUserImg(randomImage);
  }, []);

  if (!comment) {
    return <Skeleton active />;
  }

  return (
    <div className="comment">
      <Avatar src={userImg} alt="User Avatar" className="comment-avatar" />
      {isVisible ? (
        <>
          <span className="comment-text">{comment.text}</span>
          <Button onClick={handleVote} className="comment-actions">Vote</Button>
          <span className="comment-votes">{comment.votes || 0}</span>
        </>
      ) : (
        <Skeleton active className="comment-text" />
      )}
    </div>
  );
};

export default Comment;
